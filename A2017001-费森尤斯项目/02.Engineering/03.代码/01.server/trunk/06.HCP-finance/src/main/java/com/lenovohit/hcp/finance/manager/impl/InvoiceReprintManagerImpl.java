package com.lenovohit.hcp.finance.manager.impl;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.List;

import javax.transaction.Transactional;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.BeanUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.hcp.base.manager.IRedisSequenceManager;
import com.lenovohit.hcp.finance.manager.InvoiceReprintManager;
import com.lenovohit.hcp.finance.model.InvoiceInfo;
import com.lenovohit.hcp.finance.model.InvoiceInfoDetail;
import com.lenovohit.hcp.finance.model.InvoiceManage;
import com.lenovohit.hcp.finance.model.OutpatientChargeDetail;
import com.lenovohit.hcp.finance.model.PayWay;
import com.lenovohit.hcp.finance.web.rest.InvoiceReprintController.UserNow;
import com.lenovohit.hcp.odws.model.MedicalOrder;

@Service
@Transactional
public class InvoiceReprintManagerImpl implements InvoiceReprintManager {
	private static Log log = LogFactory.getLog(InvoiceReprintManagerImpl.class);
	@Autowired
	private GenericManager<InvoiceInfo, String> invoiceInfoManager;
	@Autowired
	private GenericManager<InvoiceInfoDetail, String> invoiceInfoDetailManager;
	@Autowired
	private GenericManager<PayWay, String> payWayManager;
	@Autowired
	private GenericManager<OutpatientChargeDetail, String> outpatientChargeDetailManager;
	@Autowired
	private GenericManager<MedicalOrder, String> medicalOrderManager;
	@Autowired
	private GenericManager<InvoiceManage, String> invoiceManageManager;
	@Autowired
	private IRedisSequenceManager redisSequenceManager;
	protected static final String CANCLELED = "1";
	protected static final String PRINTED = "2";
	
	@Override
	public void forRefund(String hosId, String invoiceNo, UserNow userNow) {
		if (StringUtils.isBlank(hosId) || StringUtils.isBlank(invoiceNo))
			throw new RuntimeException("医院id以及发票号不能为空");
		log.info("退款成功——回调具体业务逻辑开始");
		refundInvoiceInfo(hosId, invoiceNo, userNow);
		log.info("退款成功——更新发票信息表成功");
		refundChargeDetails(hosId, invoiceNo, userNow);
		log.info("退款成功——更新收费明细表成功");
		refundInvoiceInfoDetails(hosId, invoiceNo, userNow);
		log.info("退款成功——更新发票分类明细表成功");
		refundPayWays(hosId, invoiceNo, userNow);
		log.info("退款成功——更新支付方式表成功");
		log.info("退款成功——回调具体业务逻辑结束");
	}

	@Override
	public void forReprint(String hosId, String invoiceNo, UserNow userNow) {
		if (StringUtils.isBlank(hosId) || StringUtils.isBlank(invoiceNo))
			throw new RuntimeException("医院id以及发票号不能为空");
		log.info("重打成功——回调具体业务逻辑开始");
		InvoiceInfo newInvoiceInfo = reprintInvoiceInfo(hosId, invoiceNo, userNow);
		log.info("重打成功——更新发票信息表成功");
		reprintChargeDetails(hosId, invoiceNo, userNow, newInvoiceInfo.getInvoiceNo());
		log.info("重打成功——更新收费明细表成功");
		reprintInvoiceInfoDetails(hosId, invoiceNo, userNow, newInvoiceInfo.getInvoiceNo());
		log.info("重打成功——更新发票分类明细表成功");
		String newPayId = reprintPayWays(hosId, invoiceNo, userNow, newInvoiceInfo.getInvoiceNo());
		log.info("重打成功——更新支付方式表成功");
		newInvoiceInfo.setPayId(newPayId);	// 新的payId回写invoiceInfo
		this.invoiceInfoManager.save(newInvoiceInfo);
		log.info("重打成功——回调具体业务逻辑结束");
	}
	
	private void refundInvoiceInfo(String hosId, String invoiceNo, UserNow userNow) {
		String hql = "from InvoiceInfo where hosId = ? and invoiceNo = ? ";
		InvoiceInfo invoiceInfo = invoiceInfoManager.findOne(hql, hosId, invoiceNo);
		if (invoiceInfo == null)
			throw new RuntimeException("查不到该笔发票记录，请校验");
		if (CANCLELED.equals(invoiceInfo.getCancelFlag()))
			throw new RuntimeException("发票记录已被取消，发票号"+invoiceInfo.getInvoiceNo()+"不可退费");
		invoiceInfo.setCancelFlag(CANCLELED); // 已取消
		invoiceInfo.setCancelOper(userNow.hcpUser.getId());
		invoiceInfo.setCancelOperName(userNow.hcpUser.getName());
		invoiceInfo.setCancelTime(userNow.now);
		invoiceInfo.setUpdateOper(userNow.hcpUser.getName());
		invoiceInfo.setUpdateOperId(userNow.hcpUser.getId());
		invoiceInfo.setUpdateTime(userNow.now);	
		
		InvoiceInfo minusInvoiceInfo = new InvoiceInfo();
		BeanUtils.copyProperties(invoiceInfo, minusInvoiceInfo);
		minusInvoiceInfo.setId(null);
		if (minusInvoiceInfo.getPlusMinus() != null) {
			minusInvoiceInfo.setPlusMinus(-minusInvoiceInfo.getPlusMinus());
		}
		if (minusInvoiceInfo.getTotCost() != null) {
			minusInvoiceInfo.setTotCost(minusInvoiceInfo.getTotCost().negate());
		}
		if (minusInvoiceInfo.getPubCost() != null) {			
			minusInvoiceInfo.setPubCost(minusInvoiceInfo.getPubCost().negate());
		}
		if (minusInvoiceInfo.getOwnCost() != null) {				
			minusInvoiceInfo.setOwnCost(minusInvoiceInfo.getOwnCost().negate());
		}
		if (minusInvoiceInfo.getRebateCost() != null) {	
			minusInvoiceInfo.setRebateCost(minusInvoiceInfo.getRebateCost().negate());
		}
		minusInvoiceInfo.setCreateOper(userNow.hcpUser.getName());
		minusInvoiceInfo.setCreateOperId(userNow.hcpUser.getId());
		minusInvoiceInfo.setCreateTime(userNow.now);

		this.invoiceInfoManager.save(invoiceInfo);
		this.invoiceInfoManager.save(minusInvoiceInfo);
	}

	private void refundChargeDetails(String hosId, String invoiceNo, UserNow userNow) {
		
		//旧Order表的idList
		List<String> oldOrderIds = new ArrayList<String>();
		//新Order表的idList
		List<String> newOrderIds = new ArrayList<String>();
		String hql = "from OutpatientChargeDetail where hosId = ? and invoiceNo = ? and plusMinus = ? and applyState = ? ";
		//原收费明细
		List<OutpatientChargeDetail> details = (List<OutpatientChargeDetail>) outpatientChargeDetailManager.find(hql,
				hosId, invoiceNo, new BigDecimal("1"),"7");
		String nageHql= " from OutpatientChargeDetail where hosId = ? and invoiceNo = ? and plusMinus = ? ";
		//负收费记录
		String jql = "from OutpatientChargeDetail where hosId = ? and invoiceNo = ? and plusMinus = ? ";
		
		//挂号费诊查费记录
		/*String regJql="from OutpatientChargeDetail where hosId = ? and invoiceNo = ? and ( feeCode = '007' or  feeCode = '009' ) ";
		List<OutpatientChargeDetail> regDetails =(List<OutpatientChargeDetail>) outpatientChargeDetailManager.find(regJql,hosId, invoiceNo);
		if(regDetails!=null && regDetails.size()>0){
			for(int i=0;i<regDetails.size();i++){
				regDetails.get(i).setApplyState("0");
			}
		}*/
		
		
		List<OutpatientChargeDetail> negativeDetails = 
				(List<OutpatientChargeDetail>) outpatientChargeDetailManager.find(jql,hosId, invoiceNo,new BigDecimal("-1"));
		if(details!=null && details.size()>0 && negativeDetails!=null && negativeDetails.size()>0 && negativeDetails.size() == details.size()){
			List<OutpatientChargeDetail> minusDetails = new ArrayList<>();
			//修改原有记录状态
			for (OutpatientChargeDetail chargeDetail : details) {
				if(CANCLELED.equals(chargeDetail.getCancelFlag())) {
					throw new RuntimeException("收费明细记录已被取消，发票号"+chargeDetail.getInvoiceNo()+"不可退费");
				}
				oldOrderIds.add(chargeDetail.getOrder().getId());
				chargeDetail.setApplyState(OutpatientChargeDetail.APPLY_STATE_PAY_REFUNDED); // 已退费
				chargeDetail.setCancelFlag(CANCLELED); // 已取消
				chargeDetail.setCancelOper(userNow.hcpUser);
				chargeDetail.setCancelTime(userNow.now);
				chargeDetail.setUpdateOper(userNow.hcpUser.getName());
				chargeDetail.setUpdateOperId(userNow.hcpUser.getId());
				chargeDetail.setUpdateTime(userNow.now);
				
			}
			//修改冲销记录状态
			/*for (OutpatientChargeDetail chargeDetail : negativeDetails) {
				if(CANCLELED.equals(chargeDetail.getCancelFlag())) {
					throw new RuntimeException("收费明细记录已被取消，发票号"+chargeDetail.getInvoiceNo()+"不可退费");
				}
				oldOrderIds.add(chargeDetail.getOrder().getId());
				OutpatientChargeDetail minusChargeDetail = new OutpatientChargeDetail();
				BeanUtils.copyProperties(chargeDetail, minusChargeDetail);
				minusChargeDetail.setId(null);
				if (minusChargeDetail.getPlusMinus() != null) {
					minusChargeDetail.setPlusMinus(minusChargeDetail.getPlusMinus().negate());
				}
				if (minusChargeDetail.getTotCost() != null) {
					minusChargeDetail.setTotCost(minusChargeDetail.getTotCost().negate());
				}
				if (minusChargeDetail.getPubCost() != null) {
					minusChargeDetail.setPubCost(minusChargeDetail.getPubCost().negate());
				}
				if (minusChargeDetail.getOwnCost() != null) {
					minusChargeDetail.setOwnCost(minusChargeDetail.getOwnCost().negate());
				}
				if (minusChargeDetail.getRebateCost() != null) {
					minusChargeDetail.setRebateCost(minusChargeDetail.getRebateCost().negate());
				}
				if (minusChargeDetail.getQty() != null) {
					minusChargeDetail.setQty(minusChargeDetail.getQty().negate());
				}
				minusChargeDetail.setCreateOper(userNow.hcpUser.getName());
				minusChargeDetail.setCreateOperId(userNow.hcpUser.getId());
				minusChargeDetail.setCreateTime(userNow.now);
				minusDetails.add(minusChargeDetail);
			}*/
			outpatientChargeDetailManager.batchSave(details);
			//outpatientChargeDetailManager.batchSave(regDetails);
			//outpatientChargeDetailManager.batchSave(minusDetails);
			//修改原有order状态
			try {
				List<String> idvalues = new ArrayList<String>();
				StringBuilder idSql = new StringBuilder("update ow_order set ORDER_STATE = '5' WHERE ID IN (");
				for (int i = 0; i < oldOrderIds.size(); i++) {
					idSql.append("?");
					idvalues.add(oldOrderIds.get(i).toString());
					if (i != oldOrderIds.size() - 1)
						idSql.append(",");
				}
				idSql.append(")");
				System.out.println(idSql.toString());
				medicalOrderManager.executeSql(idSql.toString(), idvalues.toArray());
			} catch (Exception e) {
				e.printStackTrace();
				throw new BaseException("删除失败");
			}
		}else{
			throw new RuntimeException("退药插入数据出错，请联系管理员");
		}
	}

	private void refundInvoiceInfoDetails(String hosId, String invoiceNo, UserNow userNow) {
		String hql = "from InvoiceInfoDetail where hosId = ? and invoiceNo = ? ";
		List<InvoiceInfoDetail> details = invoiceInfoDetailManager.find(hql, hosId, invoiceNo);
		List<InvoiceInfoDetail> minusDetails = new ArrayList<>();
		for (InvoiceInfoDetail invoiceInfoDetail : details) {
			if(CANCLELED.equals(invoiceInfoDetail.getCancelFlag())) {
				throw new RuntimeException("发票明细记录已被取消，发票号"+invoiceInfoDetail.getInvoiceNo()+"不可退费");
			}
			invoiceInfoDetail.setCancelFlag(CANCLELED);
			invoiceInfoDetail.setCancelOper(userNow.hcpUser.getName());
			invoiceInfoDetail.setCancelTime(userNow.now);
			
			InvoiceInfoDetail minusInvoiceInfoDetail = new InvoiceInfoDetail();
			BeanUtils.copyProperties(invoiceInfoDetail, minusInvoiceInfoDetail);
			minusInvoiceInfoDetail.setId(null);
			if (minusInvoiceInfoDetail.getPlusMinus() != null) {
				minusInvoiceInfoDetail.setPlusMinus(-minusInvoiceInfoDetail.getPlusMinus());
			}
			if (minusInvoiceInfoDetail.getTotCost() != null) {
				minusInvoiceInfoDetail.setTotCost(minusInvoiceInfoDetail.getTotCost().negate());
			}
			minusDetails.add(minusInvoiceInfoDetail);
		}
		invoiceInfoDetailManager.batchSave(details);
		invoiceInfoDetailManager.batchSave(minusDetails);
	}

	private void refundPayWays(String hosId, String invoiceNo, UserNow userNow) {
		String hql = "from PayWay where hosId = ? and invoiceNo = ? ";
		List<PayWay> payWays = payWayManager.find(hql, hosId, invoiceNo);
		List<PayWay> minusPayWays = new ArrayList<>();
		for (PayWay payWay : payWays) {
			// 更新原纪录
			if(CANCLELED.equals(payWay.getCancelFlag())) {
				throw new RuntimeException("支付方式记录已被取消，发票号"+payWay.getInvoiceNo()+"不可退费");
			}
			payWay.setCancelFlag(CANCLELED); // 已取消
			payWay.setCancelOper(userNow.hcpUser.getName());
			payWay.setCancelTime(userNow.now);
			payWay.setUpdateOper(userNow.hcpUser.getName());
			payWay.setUpdateOperId(userNow.hcpUser.getId());
			payWay.setUpdateTime(userNow.now);	
			
			// 插入负记录
			PayWay minusPayWay = new PayWay();
			BeanUtils.copyProperties(payWay, minusPayWay);
			minusPayWay.setId(null);
			if (minusPayWay.getPlusMinus() != null) {
				minusPayWay.setPlusMinus(-minusPayWay.getPlusMinus());
			}
			if (minusPayWay.getPayCost() != null) {
				minusPayWay.setPayCost(minusPayWay.getPayCost().negate());
			}
			minusPayWay.setCreateOper(userNow.hcpUser.getName());
			minusPayWay.setCreateOperId(userNow.hcpUser.getId());
			minusPayWay.setCreateTime(userNow.now);
			minusPayWays.add(minusPayWay);
		}
		payWayManager.batchSave(payWays);
		payWayManager.batchSave(minusPayWays);
	}
	
	private InvoiceInfo reprintInvoiceInfo(String hosId, String invoiceNo, UserNow userNow) {
		String hql = "from InvoiceInfo where hosId = ? and invoiceNo = ? ";
		InvoiceInfo invoiceInfo = invoiceInfoManager.findOne(hql, hosId, invoiceNo);
		InvoiceInfo newInvoiceInfo = new InvoiceInfo();
		BeanUtils.copyProperties(invoiceInfo, newInvoiceInfo);
		
		if (invoiceInfo == null)
			throw new RuntimeException("查不到该笔发票记录，请校验");
		if (CANCLELED.equals(invoiceInfo.getCancelFlag()))
			throw new RuntimeException("发票记录已被取消，发票号"+invoiceInfo.getInvoiceNo()+"不可退费");
		invoiceInfo.setCancelFlag(CANCLELED); // 已取消
		invoiceInfo.setPrintState(PRINTED); // 已取消
		invoiceInfo.setCancelOper(userNow.hcpUser.getId());
		invoiceInfo.setCancelOperName(userNow.hcpUser.getName());
		invoiceInfo.setCancelTime(userNow.now);
		invoiceInfo.setUpdateOper(userNow.hcpUser.getName());
		invoiceInfo.setUpdateOperId(userNow.hcpUser.getId());
		invoiceInfo.setUpdateTime(userNow.now);	
		
		InvoiceInfo minusInvoiceInfo = new InvoiceInfo();
		BeanUtils.copyProperties(invoiceInfo, minusInvoiceInfo);
		minusInvoiceInfo.setId(null);
		if (minusInvoiceInfo.getPlusMinus() != null) {
			minusInvoiceInfo.setPlusMinus(-minusInvoiceInfo.getPlusMinus());
		}
		if (minusInvoiceInfo.getTotCost() != null) {
			minusInvoiceInfo.setTotCost(minusInvoiceInfo.getTotCost().negate());
		}
		if (minusInvoiceInfo.getPubCost() != null) {			
			minusInvoiceInfo.setPubCost(minusInvoiceInfo.getPubCost().negate());
		}
		if (minusInvoiceInfo.getOwnCost() != null) {				
			minusInvoiceInfo.setOwnCost(minusInvoiceInfo.getOwnCost().negate());
		}
		if (minusInvoiceInfo.getRebateCost() != null) {	
			minusInvoiceInfo.setRebateCost(minusInvoiceInfo.getRebateCost().negate());
		}
		minusInvoiceInfo.setCreateOper(userNow.hcpUser.getName());
		minusInvoiceInfo.setCreateOperId(userNow.hcpUser.getId());
		minusInvoiceInfo.setCreateTime(userNow.now);
		
		newInvoiceInfo.setId(null);
		String newInvoiceNo = getNewInvoiceNo(invoiceInfo.getHosId(), userNow.hcpUser.getName(), invoiceInfo.getInvoiceType());
		newInvoiceInfo.setInvoiceNo(newInvoiceNo);
		newInvoiceInfo.setCreateOper(userNow.hcpUser.getName());
		newInvoiceInfo.setCreateOperId(userNow.hcpUser.getId());
		newInvoiceInfo.setCreateTime(userNow.now);
		newInvoiceInfo.setUpdateOper(userNow.hcpUser.getName());
		newInvoiceInfo.setUpdateOperId(userNow.hcpUser.getId());
		newInvoiceInfo.setUpdateTime(userNow.now);	
		newInvoiceInfo.setInvoiceOper(userNow.hcpUser.getId());
		newInvoiceInfo.setInvoiceOperName(userNow.hcpUser.getName());
		newInvoiceInfo.setInvoiceTime(userNow.now);
		newInvoiceInfo.setPrintLastNo(invoiceNo);

		this.invoiceInfoManager.save(invoiceInfo);
		this.invoiceInfoManager.save(minusInvoiceInfo);
//		this.invoiceInfoManager.save(newInvoiceInfo);
		
		return newInvoiceInfo;
	}

	private void reprintChargeDetails(String hosId, String invoiceNo, UserNow userNow, String newInvoiceNo) {
		String hql = "from OutpatientChargeDetail where hosId = ? and invoiceNo = ? ";
		List<OutpatientChargeDetail> details = (List<OutpatientChargeDetail>) outpatientChargeDetailManager.find(hql,
				hosId, invoiceNo);
		List<OutpatientChargeDetail> minusDetails = new ArrayList<>();
		List<OutpatientChargeDetail> newDetails = new ArrayList<>();
		for (OutpatientChargeDetail chargeDetail : details) {
			OutpatientChargeDetail newChargeDetail = new OutpatientChargeDetail();
			BeanUtils.copyProperties(chargeDetail, newChargeDetail);
			
			if(CANCLELED.equals(chargeDetail.getCancelFlag())) {
				throw new RuntimeException("收费明细记录已被取消，发票号"+chargeDetail.getInvoiceNo()+"不可退费");
			}
			chargeDetail.setApplyState(OutpatientChargeDetail.APPLY_STATE_PAY_REFUNDED); // 已退费
			chargeDetail.setCancelFlag(CANCLELED); // 已取消
			chargeDetail.setCancelOper(userNow.hcpUser);
			chargeDetail.setCancelTime(userNow.now);
			chargeDetail.setUpdateOper(userNow.hcpUser.getName());
			chargeDetail.setUpdateOperId(userNow.hcpUser.getId());
			chargeDetail.setUpdateTime(userNow.now);
			
			OutpatientChargeDetail minusChargeDetail = new OutpatientChargeDetail();
			BeanUtils.copyProperties(chargeDetail, minusChargeDetail);
			minusChargeDetail.setId(null);
			if (minusChargeDetail.getPlusMinus() != null) {
				minusChargeDetail.setPlusMinus(minusChargeDetail.getPlusMinus().negate());
			}
			if (minusChargeDetail.getTotCost() != null) {
				minusChargeDetail.setTotCost(minusChargeDetail.getTotCost().negate());
			}
			if (minusChargeDetail.getPubCost() != null) {
				minusChargeDetail.setPubCost(minusChargeDetail.getPubCost().negate());
			}
			if (minusChargeDetail.getOwnCost() != null) {
				minusChargeDetail.setOwnCost(minusChargeDetail.getOwnCost().negate());
			}
			if (minusChargeDetail.getRebateCost() != null) {
				minusChargeDetail.setRebateCost(minusChargeDetail.getRebateCost().negate());
			}
			if (minusChargeDetail.getQty() != null) {
				minusChargeDetail.setQty(minusChargeDetail.getQty().negate());
			}
			minusChargeDetail.setCreateOper(userNow.hcpUser.getName());
			minusChargeDetail.setCreateOperId(userNow.hcpUser.getId());
			minusChargeDetail.setCreateTime(userNow.now);
			minusDetails.add(minusChargeDetail);
			
			//Id, null 新发票号、creatTime、UpdateTime、、发票时间、发票人员、打印状态、重打原发票号
			newChargeDetail.setId(null);
			newChargeDetail.setInvoiceNo(newInvoiceNo);
			newChargeDetail.setCreateOper(userNow.hcpUser.getName());
			newChargeDetail.setCreateOperId(userNow.hcpUser.getId());
			newChargeDetail.setCreateTime(userNow.now);
			newChargeDetail.setUpdateOper(userNow.hcpUser.getName());
			newChargeDetail.setUpdateOperId(userNow.hcpUser.getId());
			newChargeDetail.setUpdateTime(userNow.now);
			newChargeDetail.setChargeOper(userNow.hcpUser);
			newChargeDetail.setChargeTime(userNow.now);		
			newChargeDetail.setCancelFlag("0");
			newDetails.add(newChargeDetail);
		}
		outpatientChargeDetailManager.batchSave(details);
		outpatientChargeDetailManager.batchSave(minusDetails);
		outpatientChargeDetailManager.batchSave(newDetails);
	}

	private void reprintInvoiceInfoDetails(String hosId, String invoiceNo, UserNow userNow, String newInvoiceNo) {
		String hql = "from InvoiceInfoDetail where hosId = ? and invoiceNo = ? ";
		List<InvoiceInfoDetail> details = invoiceInfoDetailManager.find(hql, hosId, invoiceNo);
		List<InvoiceInfoDetail> minusDetails = new ArrayList<>();
		List<InvoiceInfoDetail> newDetails = new ArrayList<>();
		for (InvoiceInfoDetail invoiceInfoDetail : details) {
			InvoiceInfoDetail newInvoiceInfoDetail = new InvoiceInfoDetail();
			BeanUtils.copyProperties(invoiceInfoDetail, newInvoiceInfoDetail);
			
			if(CANCLELED.equals(invoiceInfoDetail.getCancelFlag())) {
				throw new RuntimeException("发票明细记录已被取消，发票号"+invoiceInfoDetail.getInvoiceNo()+"不可退费");
			}
			invoiceInfoDetail.setCancelFlag(CANCLELED);
			invoiceInfoDetail.setCancelOper(userNow.hcpUser.getName());
			invoiceInfoDetail.setCancelTime(userNow.now);
			
			InvoiceInfoDetail minusInvoiceInfoDetail = new InvoiceInfoDetail();
			BeanUtils.copyProperties(invoiceInfoDetail, minusInvoiceInfoDetail);
			minusInvoiceInfoDetail.setId(null);
			if (minusInvoiceInfoDetail.getPlusMinus() != null) {
				minusInvoiceInfoDetail.setPlusMinus(-minusInvoiceInfoDetail.getPlusMinus());
			}
			if (minusInvoiceInfoDetail.getTotCost() != null) {
				minusInvoiceInfoDetail.setTotCost(minusInvoiceInfoDetail.getTotCost().negate());
			}
			minusDetails.add(minusInvoiceInfoDetail);
			
			newInvoiceInfoDetail.setId(null);
			newInvoiceInfoDetail.setInvoiceNo(newInvoiceNo);
			newDetails.add(newInvoiceInfoDetail);
		}
		invoiceInfoDetailManager.batchSave(details);
		invoiceInfoDetailManager.batchSave(minusDetails);
		invoiceInfoDetailManager.batchSave(newDetails);
	}

	private String reprintPayWays(String hosId, String invoiceNo, UserNow userNow, String newInvoiceNo) {
		String hql = "from PayWay where hosId = ? and invoiceNo = ? ";
		List<PayWay> payWays = payWayManager.find(hql, hosId, invoiceNo);
		List<PayWay> minusPayWays = new ArrayList<>();
		List<PayWay> newPayWays = new ArrayList<>();
		String newPayId=redisSequenceManager.get("OC_PAYWAY", "PAY_ID");
		
		for (PayWay payWay : payWays) {
			PayWay newPayWay = new PayWay();
			BeanUtils.copyProperties(payWay, newPayWay);
			
			// 更新原纪录
			if(CANCLELED.equals(payWay.getCancelFlag())) {
				throw new RuntimeException("支付方式记录已被取消，发票号"+payWay.getInvoiceNo()+"不可退费");
			}
			payWay.setCancelFlag(CANCLELED); // 已取消
			payWay.setCancelOper(userNow.hcpUser.getName());
			payWay.setCancelTime(userNow.now);
			payWay.setUpdateOper(userNow.hcpUser.getName());
			payWay.setUpdateOperId(userNow.hcpUser.getId());
			payWay.setUpdateTime(userNow.now);	
			
			// 插入负记录
			PayWay minusPayWay = new PayWay();
			BeanUtils.copyProperties(payWay, minusPayWay);
			minusPayWay.setId(null);
			if (minusPayWay.getPlusMinus() != null) {
				minusPayWay.setPlusMinus(-minusPayWay.getPlusMinus());
			}
			if (minusPayWay.getPayCost() != null) {
				minusPayWay.setPayCost(minusPayWay.getPayCost().negate());
			}
			minusPayWay.setCreateOper(userNow.hcpUser.getName());
			minusPayWay.setCreateOperId(userNow.hcpUser.getId());
			minusPayWay.setCreateTime(userNow.now);
			minusPayWays.add(minusPayWay);
			
			newPayWay.setId(null);
			newPayWay.setPayId(newPayId);
			newPayWay.setInvoiceNo(newInvoiceNo);
			newPayWay.setCreateOper(userNow.hcpUser.getName());
			newPayWay.setCreateOperId(userNow.hcpUser.getId());
			newPayWay.setCreateTime(userNow.now);
			newPayWay.setUpdateOper(userNow.hcpUser.getName());
			newPayWay.setUpdateOperId(userNow.hcpUser.getId());
			newPayWay.setUpdateTime(userNow.now);
			newPayWays.add(newPayWay);
		}
		payWayManager.batchSave(payWays);
		payWayManager.batchSave(minusPayWays);
		payWayManager.batchSave(newPayWays);
		
		return newPayId;
	}

	protected final String getNewInvoiceNo(String hosId, String operator, String invoiceType) {
		String hql = "from InvoiceManage where hosId = ? and invoiceType = ? and getOper like ? and invoiceState = ?";
		@SuppressWarnings("unchecked")
		List<InvoiceManage> invoiceManage = (List<InvoiceManage>) invoiceManageManager.findByJql(hql, hosId,
				invoiceType, operator, InvoiceManage.INVOICE_STATE_USE);
		if (invoiceManage.size() != 1)// 此处校验以防万一，一般不会出现，因为在创建订单会校验一次。
			throw new RuntimeException("没有可用的发票号，请校验");
		InvoiceManage invoice = invoiceManage.get(0);
		if (invoice.getInvoiceUse().compareTo(invoice.getInvoiceEnd()) > 0)
			throw new RuntimeException("发票号用完请校验");
		BigInteger invoiceNo = invoice.getInvoiceUse();
		BigInteger newInvoiceNo = invoiceNo.add(new BigInteger("1"));
		invoice.setInvoiceUse(newInvoiceNo);
		invoiceManageManager.save(invoice);
		return invoiceNo.toString();
	}


	@Override
	//退费需要冲销的his_order,hcp_order,hcp_settlement通过regId查找信息。
	public void forRefundOtherInfo(String hosId, String invoiceNo, UserNow userNow, String regId) {
		forRefund(hosId, invoiceNo, userNow);
		
	}
}
