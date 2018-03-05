package com.lenovohit.hcp.base.manager.impl;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.transaction.Transactional;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.BeanUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.hcp.appointment.model.RegInfo;
import com.lenovohit.hcp.base.manager.HisBizChargeManager;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.finance.model.InvoiceInfo;
import com.lenovohit.hcp.finance.model.InvoiceInfoDetail;
import com.lenovohit.hcp.finance.model.InvoiceManage;
import com.lenovohit.hcp.finance.model.OutpatientChargeDetail;
import com.lenovohit.hcp.finance.model.PayWay;

@Transactional
public abstract class AbstractHisBizChargeManagerImpl implements HisBizChargeManager {
	@Autowired
	protected GenericManager<OutpatientChargeDetail, String> outpatientChargeDetailManager;
	@Autowired
	protected GenericManager<InvoiceManage, String> invoiceManageManager;
	@Autowired
	protected GenericManager<InvoiceInfo, String> invoiceInfoManager;
	@Autowired
	protected GenericManager<RegInfo, String> regInfoManager;
	@Autowired
	protected GenericManager<PayWay, String> payWayManager;
	@Autowired
	protected GenericManager<HcpUser, String> hcpUserManager;
	@Autowired
	protected GenericManager<InvoiceInfoDetail, String> invoiceInfoDetailManager;
	@Autowired
	private RedisSequenceManager redisSequenceManager;
	private static Log log = LogFactory.getLog(AbstractHisBizChargeManagerImpl.class);
	protected static final String CANCLELED = "1";
	protected static final String UN_CANCLEL = "0";
	private Object lock = new Object();

	@Override
	public void bizAfterPaySuccess(String operator, BigDecimal amt, String orderId, List<String> chargeDetailIds,
			Map<String, BigDecimal> payWays) {
		log.info("支付成功——回调具体业务逻辑开始");
		HcpUser user = getUser(operator);
		List<OutpatientChargeDetail> chargeDetails = getChargeDetailInfo(chargeDetailIds);// 不校验是否为空,调用收费会校验
		RegInfo info = regInfoManager.get(chargeDetails.get(0).getRegId());
		synchronized (lock) {
			String invoiceNo = getNewAndUpdateInvoiceNo(chargeDetails.get(0).getHosId(), operator);
			log.info("发票号为：" + invoiceNo);
			buildAndSaveInvoiceInfo(invoiceNo, user, amt, orderId, info.getPayType(), chargeDetails);
			log.info("支付成功——添加保存发票信息表成功");
			buildAndSaveInvoiceInfoDetail(invoiceNo, chargeDetails);
			log.info("支付成功——添加保存发票信息分类表表成功");
			buildAndSavePayWay(invoiceNo, orderId, payWays, chargeDetails.get(0));
			log.info("支付成功——添加保存支付方式表成功");
			updatePaySuccessInfo(user, amt, orderId, invoiceNo, info, chargeDetails);
			log.info("支付成功——修改其他相关信息成功");
		}
		log.info("支付成功——回调具体业务逻辑结束");
	}

	@Override
	public void bizAfterPayFailed(String operator, BigDecimal amt, String orderId, List<String> chargeDetailIds) {
		log.info("支付失败——回调具体业务逻辑开始");
		doBizAfterPayFailed(operator, amt, orderId, chargeDetailIds);
		log.info("支付失败——回调具体业务逻辑结束");
	}

	@Override
	public void bizAfterRefundSuccess(String hosId, String invoiceNo, HcpUser operator) {
		if (StringUtils.isBlank(hosId) || StringUtils.isBlank(invoiceNo))
			throw new RuntimeException("医院id以及发票号不能为空");
		String payId = redisSequenceManager.get("OC_PAYWAY", "PAY_ID");
		Date date = new Date();
		log.info("退款成功——回调具体业务逻辑开始");
		InvoiceInfo info = refundUpdateInvoiceInfo(hosId, invoiceNo, operator, payId, date);
		log.info("退款成功——更新发票信息表成功");
		refundUpdateChargeDetails(info, operator, date);
		log.info("退款成功——更新收费明细表成功");
		refundUpdateInvoiceInfoDetails(info, operator, date);
		log.info("退款成功——更新发票分类明细表成功");
		refundUpdatePayWays(info, operator, date);
		log.info("退款成功——更新支付方式表成功");
		refundUpdateOtherInfos(info);
		log.info("退款成功——更新其他业务逻辑成功");
		log.info("退款成功——回调具体业务逻辑结束");

	}

	/**
	 * 退款成功执行其他更新信息，比如挂号修改挂号表
	 * @param hosId
	 * @param invoiceNo
	 */
	protected abstract void refundUpdateOtherInfos(InvoiceInfo info);

	/**
	 * 支付失败执行的逻辑
	 * @param operator
	 * @param amt
	 * @param orderId
	 * @param chargeDetailIds
	 */
	protected abstract void doBizAfterPayFailed(String operator, BigDecimal amt, String orderId,
			List<String> chargeDetailIds);

	/**
	 * 具体实现类根据自己的业务逻辑处理自己的相关信息
	 * @param operator
	 * @param amt
	 * @param orderId 订单号（即pay_id）
	 * @param invoiceNo
	 * @param info
	 * @param details
	 */
	protected abstract void updatePaySuccessOtherInfo(HcpUser operator, BigDecimal amt, String orderId,
			String invoiceNo, RegInfo regInfo, List<OutpatientChargeDetail> details);

	/**
	 * 发票来源，由具体的实现类负责，比如（挂号、收费。现在只有这两种）
	 * @return
	 */
	protected abstract String getInvoiceSource();

	/**
	 * 发票类型，便于查询当前操作员该类型发票使用（挂号发票、门诊发票、住院发票等，具体参考数据字典，看自己对应的是哪种发票）
	 * @return
	 */
	protected abstract String getInvoiceType();

	/**
	 * 获取收费明细，由具体的实现类负责
	 * （根据调用收银台传送的数据获取对应的收费明细，比如挂号传的可能为reg_id（就诊流水）,门诊可能为recipe_id（处方id）
	 * 	推荐最好为32位uuid，但是如果数据太多其他实现也可以，不硬性规定，但是要对应收银台传入的数据对应，否则导致线上数据错误）
	 * @param chargeDetailIds
	 * @return 查询后的收费明细记录
	 */
	protected abstract List<OutpatientChargeDetail> getChargeDetailInfo(List<String> chargeDetailIds);

	protected final void updatePaySuccessInfo(HcpUser operator, BigDecimal amt, String orderId, String invoiceNo,
			RegInfo info, List<OutpatientChargeDetail> details) {
		updatePaySuccessChargeDetails(invoiceNo, details,operator);
		updatePaySuccessOtherInfo(operator, amt, orderId, invoiceNo, info, details);
	}

	protected final String getNewAndUpdateInvoiceNo(String hosId, String operator) {
		String hql = "from InvoiceManage where hosId = ? and invoiceType = ? and getOper like ? and invoiceState = ?";
		List<InvoiceManage> invoiceManage = (List<InvoiceManage>) invoiceManageManager.find(hql, hosId,
				getInvoiceType(), operator, InvoiceManage.INVOICE_STATE_USE);
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

	private void updatePaySuccessChargeDetails(String invoiceNo, List<OutpatientChargeDetail> details,HcpUser user) {
		for (OutpatientChargeDetail o : details) {
			o.setApplyState(OutpatientChargeDetail.APPLY_STATE_PAY_UNMEDICINE);
			o.setChargeTime(new Date());
			o.setInvoiceNo(invoiceNo);
			o.setChargeOper(user);
			//o.setDrugDept(user.getLoginDepartment());//默认当前科室
		}
		outpatientChargeDetailManager.batchSave(details);
	}

	private void buildAndSavePayWay(String invoiceNo, String orderId, Map<String, BigDecimal> payWays,
			OutpatientChargeDetail detail) {
		List<PayWay> payWayList = new ArrayList<>();
		int i = 1;
		for (Map.Entry<String, BigDecimal> entry : payWays.entrySet()) {
			PayWay payWay = new PayWay();
			payWay.setCreateTime(detail.getCreateTime());
			payWay.setPayCost(entry.getValue());
			payWay.setInvoiceNo(invoiceNo);
			payWay.setPayWay(entry.getKey());// TODO 支付方式转换？
			payWay.setPlusMinus(1);
			payWay.setPayId(orderId);
			payWay.setCreateTime(detail.getCreateTime());
			payWay.setCancelFlag(UN_CANCLEL);
			payWay.setPayNum(String.valueOf(i++));// paynum，同一个payid的支付序列号，由1递增
			payWay.setRegId(detail.getRegId());
			payWay.setPatientId(detail.getPatient().getId());
			payWay.setHosId(detail.getHosId());
			payWayList.add(payWay);
		}
		payWayManager.batchSave(payWayList);
	}

	private void buildAndSaveInvoiceInfoDetail(String invoiceNo, List<OutpatientChargeDetail> chargeDetails) {
		// 发票明细为根据feecode汇总记录金额，所有需要计算所有的收费明细中的feecode（有重复），汇总按每个feecode计算的总金额来插入
		List<InvoiceInfoDetail> details = new ArrayList<>();
		Map<String, BigDecimal> feeCodeAmt = countAmtByFeeCode(chargeDetails);
		OutpatientChargeDetail o = chargeDetails.get(0);
		for (Map.Entry<String, BigDecimal> entry : feeCodeAmt.entrySet()) {
			InvoiceInfoDetail invoiceInfoDetail = new InvoiceInfoDetail();
			invoiceInfoDetail.setPlusMinus(1);
			invoiceInfoDetail.setFeeCode(entry.getKey());
			invoiceInfoDetail.setHosId(o.getHosId());
			invoiceInfoDetail.setCancelFlag(UN_CANCLEL);
			invoiceInfoDetail.setRecipeId("");
			invoiceInfoDetail.setRegId(o.getRegId());
			invoiceInfoDetail.setRecipeDept(o.getRecipeDept());
			invoiceInfoDetail.setExeDept(o.getExeDept());
			invoiceInfoDetail.setTotCost(entry.getValue());
			invoiceInfoDetail.setInvoiceNo(invoiceNo);
			details.add(invoiceInfoDetail);
		}
		invoiceInfoDetailManager.batchSave(details);
	}

	private Map<String, BigDecimal> countAmtByFeeCode(List<OutpatientChargeDetail> chargeDetails) {
		Map<String, BigDecimal> result = new HashMap<>();
		for (OutpatientChargeDetail o : chargeDetails) {
			BigDecimal bigDecimal = result.get(o.getFeeCode());
			if (StringUtils.isBlank(bigDecimal)) {
				result.put(o.getFeeCode(), o.getTotCost());
			} else {
				BigDecimal pre = result.get(o.getFeeCode());
				result.put(o.getFeeCode(), pre.add(o.getTotCost()));
			}
		}
		return result;
	}

	private void buildAndSaveInvoiceInfo(String invoiceNo, HcpUser operator, BigDecimal amt, String orderId,
			String payType, List<OutpatientChargeDetail> details) {
		InvoiceInfo invoiceInfo = new InvoiceInfo();
		invoiceInfo.setPayType(payType);
		invoiceInfo.setPlusMinus(new Integer(1));
		invoiceInfo.setInvoiceNo(invoiceNo);
		invoiceInfo.setTotCost(amt);
		invoiceInfo.setFeeType(details.get(0).getFeeType());
		invoiceInfo.setPayType(details.get(0).getFeeType());
		invoiceInfo.setRegId(details.get(0).getRegId());
		invoiceInfo.setInvoiceOperName(operator != null ? operator.getName() : "");
		invoiceInfo.setCancelOperName("");
		invoiceInfo.setPayId(orderId);
		invoiceInfo.setPrintState(InvoiceInfo.INVOICE_UNPRINT);
		invoiceInfo.setInvoiceOper(operator != null ? operator.getId() : "");
		invoiceInfo.setRebateType(details.get(0).getRebateType());
		invoiceInfo.setIsbalance(InvoiceInfo.UN_BALANCE);
		invoiceInfo.setInvoiceTime(details.get(0).getCreateTime());
		invoiceInfo.setInvoiceSource(getInvoiceSource());
		invoiceInfo.setPatientInfo(details.get(0).getPatient());
		invoiceInfo.setHosId(details.get(0).getHosId());
		invoiceInfo.setInvoiceType(getInvoiceType());
		BigDecimal pubCost = new BigDecimal(0);
		BigDecimal ownCost = new BigDecimal(0);
		BigDecimal rebateCost = new BigDecimal(0);
		// 收费明细可能多条对应一张发票，所有要汇总所有收费明细记录存入一条发票信息
		for (OutpatientChargeDetail o : details) {
			pubCost = pubCost.add(StringUtils.isBlank(o.getPubCost()) ? new BigDecimal(0) : o.getPubCost());
			ownCost = ownCost.add(StringUtils.isBlank(o.getOwnCost()) ? new BigDecimal(0) : o.getOwnCost());
			rebateCost = rebateCost.add(StringUtils.isBlank(o.getRebateCost()) ? new BigDecimal(0) : o.getRebateCost());
		}
		invoiceInfo.setPubCost(pubCost);
		invoiceInfo.setOwnCost(ownCost);
		invoiceInfo.setRebateCost(rebateCost);
		invoiceInfo.setUpdateTime(new Date());
		invoiceInfo.setCancelFlag(InvoiceInfo.UN_CANCELED);
		invoiceInfoManager.save(invoiceInfo);
		// invoiceInfo.setCancelOper("");
		// invoiceInfo.setComm("");
		// invoiceInfo.setCreateOperId("");
		// invoiceInfo.setCreateOper("");
		// invoiceInfo.setCreateTime("");
		// invoiceInfo.setUpdateOper("");
		// invoiceInfo.setUpdateOperId("");
		// invoiceInfo.setId("");
		// invoiceInfo.setPrintState("");
		// invoiceInfo.setCancelTime("");
		// invoiceInfo.setPrintLastNo("");
		// invoiceInfo.setBalanceId("");
		// invoiceInfo.setBalanceTime("");

	}

	private InvoiceInfo refundUpdateInvoiceInfo(String hosId, String invoiceNo, HcpUser operator, String payId,
			Date date) {
		String hql = "from InvoiceInfo where hosId = ? and invoiceNo = ? ";
		InvoiceInfo invoiceInfo = invoiceInfoManager.findOne(hql, hosId, invoiceNo);
		if (invoiceInfo == null)
			throw new RuntimeException("查不到该笔发票记录，请校验");
		if (CANCLELED.equals(invoiceInfo.getCancelFlag()))
			throw new RuntimeException("发票已经被退号，不能再退");
		invoiceInfo.setCancelFlag(CANCLELED); // 已取消
		invoiceInfo.setCancelOper(operator.getId());
		invoiceInfo.setCancelOperName(operator.getName());
		invoiceInfo.setCancelTime(date);
		invoiceInfo.setUpdateTime(date);
		invoiceInfo.setUpdateOper(operator.getName());
		invoiceInfo.setUpdateOperId(operator.getId());
		InvoiceInfo minusInvoiceInfo = new InvoiceInfo();
		BeanUtils.copyProperties(invoiceInfo, minusInvoiceInfo);
		minusInvoiceInfo.setId(null);
		minusInvoiceInfo.setPayId(payId);
		minusInvoiceInfo.setInvoiceOper(operator.getId());
		minusInvoiceInfo.setInvoiceOperName(operator.getName());
		minusInvoiceInfo.setInvoiceTime(date);
		minusInvoiceInfo.setIsbalance(InvoiceInfo.UN_BALANCE);
		minusInvoiceInfo.setBalanceId(null);
		minusInvoiceInfo.setBalanceTime(null);
		minusInvoiceInfo.setCreateOper(operator.getName());
		minusInvoiceInfo.setCreateOperId(operator.getId());
		minusInvoiceInfo.setCreateTime(date);
		minusInvoiceInfo.setPlusMinus(-minusInvoiceInfo.getPlusMinus());
		minusInvoiceInfo.setTotCost(minusInvoiceInfo.getTotCost().negate());
		minusInvoiceInfo.setPubCost(minusInvoiceInfo.getPubCost().negate());
		minusInvoiceInfo.setOwnCost(minusInvoiceInfo.getOwnCost().negate());
		minusInvoiceInfo.setRebateCost(minusInvoiceInfo.getRebateCost().negate());
		this.invoiceInfoManager.save(invoiceInfo);
		return this.invoiceInfoManager.save(minusInvoiceInfo);
	}

	private HcpUser getUser(String userName) {
		return hcpUserManager.findOneByProp("name", userName);
	}

	private void refundUpdateChargeDetails(InvoiceInfo info, HcpUser user, Date date) {
		String hql = "from OutpatientChargeDetail where hosId = ? and invoiceNo = ? ";
		List<OutpatientChargeDetail> details = (List<OutpatientChargeDetail>) outpatientChargeDetailManager.find(hql,
				info.getHosId(), info.getInvoiceNo());
		List<OutpatientChargeDetail> minusDetails = new ArrayList<>();
		for (OutpatientChargeDetail chargeDetail : details) {
			chargeDetail.setApplyState(OutpatientChargeDetail.APPLY_STATE_PAY_REFUNDED); // 已退费
			chargeDetail.setCancelFlag(CANCLELED); // 已取消
			chargeDetail.setCancelTime(date);
			chargeDetail.setCancelOper(user);
			OutpatientChargeDetail minusChargeDetail = new OutpatientChargeDetail();
			BeanUtils.copyProperties(chargeDetail, minusChargeDetail);
			minusChargeDetail.setId(null);
			minusChargeDetail.setChargeOper(user);
			minusChargeDetail.setChargeTime(date);
			minusChargeDetail.setCreateTime(date);
			minusChargeDetail.setQty(new BigDecimal(-1));
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
			minusDetails.add(minusChargeDetail);
		}
		outpatientChargeDetailManager.batchSave(details);
		outpatientChargeDetailManager.batchSave(minusDetails);
	}

	private void refundUpdateInvoiceInfoDetails(InvoiceInfo info, HcpUser user, Date date) {
		String hql = "from InvoiceInfoDetail where hosId = ? and invoiceNo = ? ";
		List<InvoiceInfoDetail> details = invoiceInfoDetailManager.find(hql, info.getHosId(), info.getInvoiceNo());
		List<InvoiceInfoDetail> minusDetails = new ArrayList<>();
		for (InvoiceInfoDetail invoiceInfoDetail : details) {
			InvoiceInfoDetail minusInvoiceInfoDetail = new InvoiceInfoDetail();
			invoiceInfoDetail.setCancelFlag(CANCLELED);
			invoiceInfoDetail.setCancelTime(date);
			invoiceInfoDetail.setCancelOper(user.getId());
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

	private void refundUpdatePayWays(InvoiceInfo info, HcpUser user, Date date) {
		String hql = "from PayWay where hosId = ? and invoiceNo = ? ";
		List<PayWay> payWays = payWayManager.find(hql, info.getHosId(), info.getInvoiceNo());
		List<PayWay> minusPayWays = new ArrayList<>();
		for (PayWay payWay : payWays) {
			PayWay minusPayWay = new PayWay();
			payWay.setCancelFlag(CANCLELED); // 已取消
			payWay.setCancelTime(date);
			payWay.setCancelOper(user.getId());
			BeanUtils.copyProperties(payWay, minusPayWay);
			minusPayWay.setId(null);
			minusPayWay.setPayId(info.getPayId());
			minusPayWay.setUpdateOper(user.getName());
			minusPayWay.setUpdateOperId(user.getId());
			minusPayWay.setUpdateTime(date);
			minusPayWay.setCreateOper(user.getName());
			minusPayWay.setCreateOperId(user.getId());
			minusPayWay.setCreateTime(date);
			if (minusPayWay.getPlusMinus() != null) {
				minusPayWay.setPlusMinus(-minusPayWay.getPlusMinus());
			}
			if (minusPayWay.getPayCost() != null) {
				minusPayWay.setPayCost(minusPayWay.getPayCost().negate());
			}
			minusPayWays.add(minusPayWay);
		}
		payWayManager.batchSave(payWays);
		payWayManager.batchSave(minusPayWays);
	}
}
