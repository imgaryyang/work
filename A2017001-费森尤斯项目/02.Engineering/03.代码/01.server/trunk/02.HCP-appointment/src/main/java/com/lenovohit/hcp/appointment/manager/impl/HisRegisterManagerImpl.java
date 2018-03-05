package com.lenovohit.hcp.appointment.manager.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.transaction.Transactional;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.hcp.appointment.manager.RegisterManager;
import com.lenovohit.hcp.appointment.model.RegFree;
import com.lenovohit.hcp.appointment.model.RegInfo;
import com.lenovohit.hcp.base.manager.HisBizChargeManager;
import com.lenovohit.hcp.base.manager.HisInterChargeManager;
import com.lenovohit.hcp.base.manager.impl.RedisSequenceManager;
import com.lenovohit.hcp.base.model.Department;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.base.model.HisOrder;
import com.lenovohit.hcp.card.model.Patient;
import com.lenovohit.hcp.finance.model.InvoiceManage;
import com.lenovohit.hcp.finance.model.OutpatientChargeDetail;

@Service
@Transactional
public class HisRegisterManagerImpl implements RegisterManager {

	private static Log log = LogFactory.getLog(HisRegisterManagerImpl.class);
	@Autowired
	private GenericManager<Patient, String> patientManager;
	@Autowired
	private GenericManager<RegInfo, String> regInfoManager;
	@Autowired
	private GenericManager<RegFree, String> regFreeManager;
	@Autowired
	private GenericManager<OutpatientChargeDetail, String> outpatientChargeDetailManager;
	@Autowired
	private RedisSequenceManager redisSequenceManager;
	@Autowired
	private HisInterChargeManager hisInterChargeManager;
	@Autowired
	private GenericManager<HcpUser, String> hcpUserManager;
	@Autowired
	private GenericManager<InvoiceManage, String> invoiceManageManager;
	@Autowired
	private GenericManager<Department, String> departmentManager;
	@Autowired
	@Qualifier("hisRegistBizChargeManager")
	private HisBizChargeManager hisBizChargeManager;
	private static final String CANCELED = "1";
	private static final String UN_CANCELED = "0";

	@Override
	public RegInfo register(RegInfo info) {
		// 1生成流水号、发票号（fm_invoice_manage）21状态，记录reg_info表
		RegInfo savedInfo = buildAndSaveRegInfo(info);
		// 2记录收费明细表（oc_chargedetail）
		buildAndSaveChargeDetail(info);
		return savedInfo;
	}

	@Override
	public HisOrder registerToPay(RegInfo info) {
		if(info!=null && info.getRemark()==null){//挂号路径，登记不需要发票
			checkInvoiceNo(info.getHosId(), info.getCreateOper());
		}
		// 1生成流水号、21状态，记录reg_info表
		try {
			buildAndSaveRegInfo(info);
		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException("保存挂号信息失败，请重试");
		}
		// 2记录收费明细表（oc_chargedetail）
		List<OutpatientChargeDetail> details = buildAndSaveChargeDetail(info);
		HisOrder order = null;
		if(info!=null && info.getRemark()==null){//挂号路径，登记不需要交费
			// 3调用收银台支付
			List<String> detailIds = new ArrayList<>();
			for (OutpatientChargeDetail o : details)
				detailIds.add(o.getId());
			try {
				order = hisInterChargeManager.handleChargeToPay(info.getCreateOper(), getTotalFee(info.getRegLevel(),info.getHosId()),
						detailIds, InvoiceManage.INVOICE_TYPE_REGIST, info.getHosId(), "hisRegistBizChargeManager");
			} catch (Exception e) {
				e.printStackTrace();
				throw new RuntimeException("调用收银台生成订单失败，请重试");
			}
		}
		return order;
	}

	@Override
	public void cancel(RegInfo info, HcpUser user) {
		hisBizChargeManager.bizAfterRefundSuccess(info.getHosId(), info.getInvoiceNo(), user);
	}

	// 生成流水号、记录regState状态
	private RegInfo buildAndSaveRegInfo(RegInfo info) {
		info.setPayType(info.getFeeType());
		info.setRegState(RegInfo.REG_RESERVE_NUMED);
		info.setPatient(getPatient(info.getPatientId()));
		
		info.setRegDept(departmentManager.get(info.getRegDeptId()));
		info.setCreateTime(new Date());
		info.setRegTime(new Date());
		info.setCancelFlag(UN_CANCELED);
		log.info("挂号表保存数据成功");
		return regInfoManager.save(info);
	}

	private Patient getPatient(String patientId) {
		Patient patient = patientManager.get(patientId);
		if (patient == null) {
			throw new RuntimeException("没有找到对应的病人信息");
		}
		return patient;
	}

	private List<OutpatientChargeDetail> buildAndSaveChargeDetail(RegInfo info) {
	
		String[] strArray={"regLevel","hosId"};
		List<Object> values=new ArrayList<Object>();
		values.add(info.getRegLevel());
		values.add(info.getHosId());
		String jql="from RegFree where regLevel = ? and hosId = ? ";
		List<RegFree> result= (List<RegFree>) regFreeManager.find(jql, values.toArray());
		List<OutpatientChargeDetail> details = new ArrayList<>();
		String recipeId = redisSequenceManager.get("OC_CHARGEDETAIL", "RECIPE_ID");
		int i = 1;
		for (RegFree regFree : result) {
			OutpatientChargeDetail detail = new OutpatientChargeDetail();
			detail.setRecipeDept(info.getRegDept());
			detail.setExeDept(info.getRegDept());
			detail.setUnit(regFree.getItemInfo().getUnit());
			detail.setCreateOper(info.getCreateOper());
			detail.setCreateTime(info.getCreateTime());
			detail.setCancelFlag(UN_CANCELED);
			detail.setFeeType(info.getFeeType());
			detail.setFeeCode(regFree.getItemInfo().getFeeCode());
			detail.setHosId(info.getHosId());
			detail.setRegId(info.getId());
			detail.setRecipeId(recipeId);
			detail.setDrugFlag(OutpatientChargeDetail.DRUG_FLAG_TWO);
			detail.setRecipeTime(info.getCreateTime());
			detail.setRecipeNo(i++);
			detail.setPatient(getPatient(info.getPatientId()));
			detail.setPlusMinus(new BigDecimal(1));
			detail.setInvoiceNo(info.getInvoiceNo());
			detail.setCreateOper(info.getCreateOper());
			if(info!=null && info.getRemark()==null){//直接挂号路径
				detail.setApplyState(OutpatientChargeDetail.APPLY_STATE_PAY_UNMEDICINE);
			}else{//登记路径
				detail.setApplyState("0");
			}
			detail.setTotCost(regFree.getItemInfo().getUnitPrice());
			detail.setItemCode(regFree.getItemInfo().getId());
			detail.setItemName(regFree.getItemInfo().getItemName());
			detail.setSpecs(regFree.getItemInfo().getSpecs());
			detail.setChargeOper(hcpUserManager.get(info.getCreateOperId()));
			detail.setChargeTime(info.getCreateTime());
			detail.setQty(new BigDecimal(1));
			detail.setPackQty(new BigDecimal(1));
			detail.setPackUnit("次");
			detail.setDays(1);
			detail.setSalePrice(regFree.getItemInfo().getUnitPrice());
			details.add(detail);
		}
		log.info("收费明细表记录插入完成");
		return outpatientChargeDetailManager.batchSave(details);
	}

	private BigDecimal getTotalFee(String regLevel,String hosId) {
		List<RegFree> result = regFreeManager.find(" from RegFree where regLevel = ? and hosId = ? ", regLevel,hosId);
		BigDecimal totalFee = new BigDecimal(0);
		for (RegFree free : result) {
			totalFee = totalFee.add(free.getItemInfo().getUnitPrice());
		}
		log.info("挂号总费用为：" + totalFee);
		return totalFee;
	}

	private void checkInvoiceNo(String hosId, String operator) {
		String hql = "from InvoiceManage where hosId = ? and invoiceType = ? and getOper like ? and invoiceState = ?";
		List<InvoiceManage> invoiceManage = (List<InvoiceManage>) invoiceManageManager.find(hql, hosId,
				InvoiceManage.INVOICE_TYPE_REGIST, operator, InvoiceManage.INVOICE_STATE_USE);
		if (invoiceManage.size() != 1)// 此处校验以防万一，一般不会出现，因为在创建订单会校验一次。
			throw new RuntimeException("没有可用的发票号或者正在使用的发票区间超过一条，请校验");
		InvoiceManage invoice = invoiceManage.get(0);
		if (invoice.getInvoiceUse().compareTo(invoice.getInvoiceEnd()) > 0)
			throw new RuntimeException("发票号用完请校验");
	}
}
