package com.lenovohit.hwe.pay.support.alipay.business;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import org.apache.commons.configuration.Configuration;

import com.alipay.api.request.AlipayTradeCreateRequest;
import com.alipay.api.response.AlipayTradeCreateResponse;
import com.lenovohit.hwe.pay.support.alipay.config.Constants;
import com.lenovohit.hwe.pay.support.alipay.model.TradeStatus;
import com.lenovohit.hwe.pay.support.alipay.model.builder.AlipayTradeCreateRequestBuilder;
import com.lenovohit.hwe.pay.support.alipay.model.result.AlipayTradeCreateResult;

/**
 * Created by liuyangkly on 15/7/31.
 */
public class AlipayTradeCreateBusiness extends AbsAlipayTradeBusiness {
	 protected static ExecutorService executorService = Executors.newCachedThreadPool();
	public AlipayTradeCreateBusiness(Configuration configs) {
		super(configs);
	}
	
    public AlipayTradeCreateResult run(AlipayTradeCreateRequestBuilder builder) {
        validateBuilder(builder);

        AlipayTradeCreateRequest request = new AlipayTradeCreateRequest();
        request.setNotifyUrl(builder.getNotifyUrl());
        request.putOtherTextParam("app_auth_token", builder.getAppAuthToken());
        request.setBizContent(builder.toJsonString());
        log.info("trade.precreate bizContent:" + request.getBizContent());

        AlipayTradeCreateResponse response = (AlipayTradeCreateResponse) getResponse(client, request);

        AlipayTradeCreateResult result = new AlipayTradeCreateResult(response);
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
