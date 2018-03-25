package com.lenovohit.hwe.pay.support.alipay.business;

import org.apache.commons.configuration.Configuration;

import com.alipay.api.request.AlipayTradePrecreateRequest;
import com.alipay.api.response.AlipayTradePrecreateResponse;
import com.lenovohit.hwe.pay.support.alipay.config.Constants;
import com.lenovohit.hwe.pay.support.alipay.model.TradeStatus;
import com.lenovohit.hwe.pay.support.alipay.model.builder.AlipayTradePrecreateRequestBuilder;
import com.lenovohit.hwe.pay.support.alipay.model.result.AlipayTradePrecreateResult;

/**
 * Created by liuyangkly on 15/7/31.
 */
public class AlipayTradePrecreateBusiness extends AbsAlipayTradeBusiness {

	public AlipayTradePrecreateBusiness(Configuration configs) {
		super(configs);
	}
	
    public AlipayTradePrecreateResult run(AlipayTradePrecreateRequestBuilder builder) {
        validateBuilder(builder);

        AlipayTradePrecreateRequest request = new AlipayTradePrecreateRequest();
        request.setNotifyUrl(builder.getNotifyUrl());
        request.putOtherTextParam("app_auth_token", builder.getAppAuthToken());
        request.setBizContent(builder.toJsonString());
        log.info("trade.precreate bizContent:" + request.getBizContent());

        AlipayTradePrecreateResponse response = (AlipayTradePrecreateResponse) getResponse(client, request);

        AlipayTradePrecreateResult result = new AlipayTradePrecreateResult(response);
        if (response != null && Constants.SUCCESS.equals(response.getCode())) {
            // 预下单交易成功
            result.setTradeStatus(TradeStatus.SUCCESS);

        } else if (tradeError(response)) {
            // 预下单发生异常，状态未知
            result.setTradeStatus(TradeStatus.UNKNOWN);

        } else {
            // 其他情况表明该预下单明确失败
            result.setTradeStatus(TradeStatus.FAILED);
        }
        return result;
    }
    
}
