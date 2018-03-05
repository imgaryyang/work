package com.lenovohit.hcp.base.manager.impl;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;

import javax.transaction.Transactional;
import javax.transaction.Transactional.TxType;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.SpringUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.hcp.base.manager.HisBizChargeManager;
import com.lenovohit.hcp.base.manager.HisInterChargeManager;
import com.lenovohit.hcp.base.manager.HisToOutChargeManager;
import com.lenovohit.hcp.base.model.HisOrder;
import com.lenovohit.hcp.finance.model.InvoiceManage;
import com.lenovohit.hcp.payment.model.HisPayResult;

@Service
@Transactional
public class HisInterChargeManagerImpl implements HisInterChargeManager {

	private static Log log = LogFactory.getLog(HisInterChargeManagerImpl.class);
	@Autowired
	private RedisSequenceManager redisSequenceManager;
	@Autowired
	private HisToOutChargeManager hisToOutChargeManager;
	@Autowired
	private GenericManager<HisOrder, String> hisOrderManager;
	@Autowired
	protected GenericManager<InvoiceManage, String> invoiceManageManager;

	@Override
	// 将信息转为his平台订单存库，调用收银台生成订单接口
	public HisOrder handleChargeToPay(String operator, BigDecimal amt, List<String> detailIds, String type,
			String hosId, String bizBeanName) {
		log.info("调用收银台开始");
		checkPayParams(operator, amt, detailIds, type, bizBeanName);
		checkInvoice(hosId, operator, type);
		String orderNo = redisSequenceManager.get("OC_PAYWAY", "PAY_ID");
		log.info("生成的orderNo为：" + orderNo);
		// ((HisInterChargeManager)
		// AopContext.currentProxy()).createAndSaveHisOrder(operator, amt,
		// detailIds, type,
		// bizBeanName, orderId);
		hisToOutChargeManager.createOrder(orderNo, operator, amt);
		log.info("调用收银台生成订单结束");
		return createAndSaveHisOrder(operator, amt, detailIds, type, bizBeanName, orderNo);
	}

	@Override
	@Transactional(TxType.REQUIRES_NEW)
	public HisOrder createAndSaveHisOrder(String operator, BigDecimal amt, List<String> detailIds, String type,
			String bizBeanName, String orderNo) {
		return doCreateAndSaveHisOrder(operator, amt, detailIds, type, bizBeanName, orderNo);
	}

	@Override
	/**
	 * 1、处理his订单
	 * 2、处理公共逻辑部分
	 * 3、处理特殊逻辑部分
	 */
	public void handleChargePayReturn(Boolean success, String operator, BigDecimal amt, String orderNo,
			Map<String, BigDecimal> payWays) {
		log.info("收费成功回调his开始，参数 success:" + success + ",operator:" + operator + ",amt:" + amt + ",orderNo:" + orderNo
				+ ",");
		if (success)
			log.info("payWays:" + payWays.toString());
		HisOrder hisOrder = hisOrderManager.findOneByProp("orderNo", orderNo);
		List<String> chargeDetailIds = Arrays.asList(StringUtils.split(hisOrder.getChargeIds(), ","));
		HisBizChargeManager hisBizChargeManager = (HisBizChargeManager) SpringUtils.getContext()
				.getBean(hisOrder.getBizBean());
		log.info("处理具体业务逻辑的manager为：" + hisOrder.getBizBean());
		if (success) {
			hisOrder.setStatus(HisOrder.ORDER_STAT_PAY_SUCCESS);
			hisOrder.setFinishTime(new Date());
			hisOrder.setTranTime(new Date());
			hisBizChargeManager.bizAfterPaySuccess(operator, amt, orderNo, chargeDetailIds, payWays);
		} else {
			hisOrder.setStatus(HisOrder.ORDER_STAT_CLOSED);// 该笔订单作废，his发起交易会重新生成订单
			hisOrder.setFinishTime(new Date());
			hisBizChargeManager.bizAfterPayFailed(operator, amt, orderNo, chargeDetailIds);
		}
		hisOrderManager.save(hisOrder);
	}

	@Override
	public void handleChargeReturn(HisPayResult result) {
		handleChargePayReturn(new Boolean(result.isSuccess()), result.getOperator(), result.getAmt(),
				result.getOrderNo(), result.getResultMap());
	}

	private HisOrder doCreateAndSaveHisOrder(String operator, BigDecimal amt, List<String> detailIds, String type,
			String bizBeanName, String orderNo) {
		HisOrder hisOrder = new HisOrder();
		hisOrder.setAmt(amt);
		hisOrder.setBizBean(bizBeanName);
		StringBuilder sb = new StringBuilder();
		for (String s : detailIds) {
			sb.append(s);
			sb.append(",");
		}
		hisOrder.setChargeIds(sb.toString());
		hisOrder.setCreateTime(new Date());
		hisOrder.setOperator(operator);
		hisOrder.setOrderNo(orderNo);
		hisOrder.setOrderDesc("云his收费项目");
		hisOrder.setOrderType(type);
		hisOrder.setStatus(HisOrder.ORDER_STAT_INITIAL);
		return hisOrderManager.save(hisOrder);
	}

	private void checkInvoice(String hosId, String operator, String invoiceType) {
		String hql = "from InvoiceManage where hosId = ? and invoiceType = ? and getOper like ? and invoiceState = ?";
		List<InvoiceManage> invoiceManage = (List<InvoiceManage>) invoiceManageManager.find(hql, hosId, invoiceType,
				operator, InvoiceManage.INVOICE_STATE_USE);
		if (invoiceManage.size() != 1)// 此处校验以防万一，一般不会出现，因为在创建订单会校验一次。
			throw new RuntimeException("没有可用的发票号，请校验");
		InvoiceManage invoice = invoiceManage.get(0);
		if (invoice.getInvoiceUse().compareTo(invoice.getInvoiceEnd()) > 0)
			throw new RuntimeException("发票号用完请校验");
	}

	private void checkPayParams(String operator, BigDecimal amt, List<String> detailIds, String type,
			String bizBeanName) {
		if (StringUtils.isBlank(operator) || StringUtils.isBlank(amt) || StringUtils.isBlank(toString())
				|| StringUtils.isBlank(bizBeanName)) {
			log.error("操作人、金额、订单类型、业务bean名、都不能为空，" + operator + "," + amt + "," + type + "," + bizBeanName + ".");
			throw new RuntimeException("操作人、金额、订单类型都不能为空");
		}
		if (detailIds == null || detailIds.size() < 1) {
			log.error("收费明细id list不能为空");
			throw new RuntimeException("收费明细id list不能为空");
		}
		HisBizChargeManager hisBizChargeManager = (HisBizChargeManager) SpringUtils.getContext().getBean(bizBeanName);
		if (hisBizChargeManager == null) {
			log.error("不存在该beaname:" + bizBeanName + "对应的bean对象");
			throw new RuntimeException("不存在该beanname对应的bean对象");
		}
	}

}
