package com.lenovohit.hwe.pay.service.impl;

import org.apache.commons.configuration.Configuration;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Service;

import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.hwe.pay.model.Settlement;
import com.lenovohit.hwe.pay.service.PayBaseService;
import com.lenovohit.hwe.pay.support.acctpay.balance.model.BalancePayResponse;
import com.lenovohit.hwe.pay.support.acctpay.balance.transfer.RestEntityResponse;
import com.lenovohit.hwe.pay.support.acctpay.balance.transfer.RestResponse;
import com.lenovohit.hwe.pay.utils.PayMerchantConfigCache;

@Service("cacctpayTbalancePayService")
public class CacctpayTbalancePayServiceImpl implements PayBaseService {
	private static Log log = LogFactory.getLog(CacctpayTbalancePayServiceImpl.class);

	@Override
	public void prePay(Settlement settlement) {
		Configuration config = PayMerchantConfigCache.getConfig(settlement.getPayType().getPayMerchant());
		settlement.getVariables().put("_config", config);
	}

	@Override
	public void payCallback(Settlement settlement) {
		try {
			settlement.setRespText((String) settlement.getVariables().get("responseStr"));
			RestEntityResponse<BalancePayResponse> response = parseEntity(settlement.getRespText());
			if (response.isSuccess()) {// 支付成功
				BalancePayResponse result = response.getEntity();
				settlement.setPayerName(result.getOperator());
				// 交易信息
				settlement.setTradeNo(result.getTradeNo());// 交易流水 ---支付渠道流水
				settlement.setTradeTime(result.getTradeTime());// 交易时间
				settlement.setTradeRspCode(response.getSuccess());// 交易返回码
				settlement.setTradeRspMsg(response.getMsg());// 交易返回说明
				settlement.setTradeStatus(Settlement.SETTLE_TRADE_SUCCESS);
				settlement.setStatus(Settlement.SETTLE_STAT_PAY_SUCCESS);
				settlement.setRealAmt(result.getAmt());// 实际支付完成的金额
			} else {
				// 交易信息
				settlement.setTradeRspCode(response.getSuccess());// 交易返回码
				settlement.setTradeRspMsg(response.getMsg());// 交易返回说明
				settlement.setTradeStatus(Settlement.SETTLE_TRADE_FAILURE);
				settlement.setStatus(Settlement.SETTLE_STAT_PAY_FAILURE);
			}
		} catch (Exception e) {
			e.printStackTrace();
			settlement.setStatus(Settlement.SETTLE_STAT_EXCEPTIONAL);
			log.error("预存账户余额支付报文处理:" + e.getMessage());
		}
	}

	@Override
	public void refund(Settlement settlement) {
	}

	@Override
	public void query(Settlement settlement) {
	}

	@Override
	public void refundQuery(Settlement settlement) {
	}

	private RestEntityResponse<BalancePayResponse> parseEntity(String content){
		RestResponse restResponse = JSONUtils.deserialize(content, RestResponse.class);
		RestEntityResponse<BalancePayResponse> response = new RestEntityResponse<BalancePayResponse>(restResponse);
		String result = restResponse.getResult();
		if(!StringUtils.isEmpty(result)){
			BalancePayResponse entity = JSONUtils.parseObject(result, BalancePayResponse.class);
			response.setEntity(entity);
		}
		return response;
	}
}
