package com.lenovohit.hwe.pay.support.alipay.business;

import org.apache.commons.configuration.Configuration;

import com.alipay.api.request.AlipayTradeRefundRequest;
import com.alipay.api.response.AlipayTradeRefundResponse;
import com.lenovohit.hwe.pay.support.alipay.config.Constants;
import com.lenovohit.hwe.pay.support.alipay.model.TradeStatus;
import com.lenovohit.hwe.pay.support.alipay.model.builder.AlipayTradeRefundRequestBuilder;
import com.lenovohit.hwe.pay.support.alipay.model.result.AlipayTradeRefundResult;

/**
 * Created by liuyangkly on 15/7/31.
 */
public class AlipayTradeRefundBusiness extends AbsAlipayTradeBusiness {

	public AlipayTradeRefundBusiness(Configuration configs) {
		super(configs);
	}
	
	public AlipayTradeRefundResult run(AlipayTradeRefundRequestBuilder builder) {
        validateBuilder(builder);

        AlipayTradeRefundRequest request = new AlipayTradeRefundRequest();
        request.setNotifyUrl(builder.getNotifyUrl());
        request.putOtherTextParam("app_auth_token", builder.getAppAuthToken());
        request.setBizContent(builder.toJsonString());
        log.info("trade.refund bizContent:" + request.getBizContent());

        AlipayTradeRefundResponse response = (AlipayTradeRefundResponse) getResponse(client, request);

        AlipayTradeRefundResult result = new AlipayTradeRefundResult(response);
        if (response != null && Constants.SUCCESS.equals(response.getCode())) {
            // 退货交易成功
            result.setTradeStatus(TradeStatus.SUCCESS);

        } else if (tradeError(response)) {
            // 退货发生异常，退货状态未知
            result.setTradeStatus(TradeStatus.UNKNOWN);

        } else {
            // 其他情况表明该订单退货明确失败
            result.setTradeStatus(TradeStatus.FAILED);
        }
        return result;
    }
}
