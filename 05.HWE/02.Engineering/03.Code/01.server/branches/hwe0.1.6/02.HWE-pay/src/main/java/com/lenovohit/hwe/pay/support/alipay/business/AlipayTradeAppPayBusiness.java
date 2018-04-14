package com.lenovohit.hwe.pay.support.alipay.business;

import org.apache.commons.configuration.Configuration;

import com.alipay.api.request.AlipayTradeAppPayRequest;
import com.alipay.api.response.AlipayTradeAppPayResponse;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.hwe.pay.support.alipay.model.TradeStatus;
import com.lenovohit.hwe.pay.support.alipay.model.builder.AlipayTradeAppPayRequestBuilder;
import com.lenovohit.hwe.pay.support.alipay.model.result.AlipayTradeAppPayResult;

/**
 * Created by liuyangkly on 15/7/31.
 */
public class AlipayTradeAppPayBusiness extends AbsAlipayTradeBusiness {

	public AlipayTradeAppPayBusiness(Configuration configs) {
		super(configs);
	}
	
    public AlipayTradeAppPayResult run(AlipayTradeAppPayRequestBuilder builder) {
        validateBuilder(builder);

        AlipayTradeAppPayRequest request = new AlipayTradeAppPayRequest();
        request.setNotifyUrl(builder.getNotifyUrl());
        request.putOtherTextParam("app_auth_token", builder.getAppAuthToken());
        request.setBizContent(builder.toJsonString());
        log.info("trade.precreate bizContent:" + request.getBizContent());

        AlipayTradeAppPayResponse response = (AlipayTradeAppPayResponse) getSDKResponse(client, request);

        AlipayTradeAppPayResult result = new AlipayTradeAppPayResult(response);
        if (response != null && !StringUtils.isBlank(response.getBody())) {
            // 预下单交易成功
            result.setTradeStatus(TradeStatus.SUCCESS);
        } else {
            // 其他情况表明该预下单明确失败
            result.setTradeStatus(TradeStatus.FAILED);
        }
        return result;
    }
    
}
