package com.lenovohit.hcp.payment.manager.impl;

import java.math.BigDecimal;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Service;

import com.lenovohit.core.utils.DateUtils;
import com.lenovohit.hcp.payment.model.HcpSettlement;
import com.lenovohit.hcp.payment.support.unionpay.model.UnionPayResponse;

@Service("unionPayManager")
public class UnionPayManagerImpl extends AbstractBasePayManagerImpl {
	private static Log log = LogFactory.getLog(UnionPayManagerImpl.class);

	@Override
	public void payCallBack(HcpSettlement settlement) {
		try {
			UnionPayResponse unionPay = new UnionPayResponse(settlement.getRespText());
			// 基础信息
			settlement.setPayerAccount(unionPay.getCardNo());// 付款人账户 交易卡号
			settlement.setPayerAcctType(unionPay.getCardType());// 付款人账户 卡类型
			settlement.setTerminalCode(unionPay.getTid());// 终端编号
			// 交易信息
			settlement.setTradeNo(unionPay.getRef());// 交易流水 ---支付渠道流水
			settlement.setTradeTime(DateUtils.string2Date(
					DateUtils.getCurrentYear() + unionPay.getTransDate() + unionPay.getTransTime(), "yyyyMMddHHmmss"));// 交易时间
			settlement.setTradeRspCode(unionPay.getRespCode());// 交易返回码
			settlement.setTradeRspMsg(unionPay.getRespInfo());// 交易返回说明
			if ("00".equals(settlement.getTradeRspCode())) {// 支付成功
				settlement.setTradeStatus(HcpSettlement.SETTLE_TRADE_SUCCESS);
				settlement.setStatus(HcpSettlement.SETTLE_STAT_PAY_SUCCESS);
				settlement.setRealAmt(new BigDecimal(unionPay.getAmount()));// 实际支付完成的金额
			} else {
				settlement.setTradeStatus(HcpSettlement.SETTLE_TRADE_FAILURE);
				settlement.setStatus(HcpSettlement.SETTLE_STAT_PAY_FAILURE);
			}
		} catch (Exception e) {
			settlement.setStatus(HcpSettlement.SETTLE_STAT_EXCEPTIONAL);
			log.error("银联支付报文处理:" + e.getMessage());
		}
	}
}
