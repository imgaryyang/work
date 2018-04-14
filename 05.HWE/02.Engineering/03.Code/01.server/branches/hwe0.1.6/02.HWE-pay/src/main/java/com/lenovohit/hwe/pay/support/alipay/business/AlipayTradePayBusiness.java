package com.lenovohit.hwe.pay.support.alipay.business;

import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import org.apache.commons.configuration.Configuration;

import com.alipay.api.request.AlipayTradePayRequest;
import com.alipay.api.response.AlipayTradePayResponse;
import com.alipay.api.response.AlipayTradeQueryResponse;
import com.lenovohit.hwe.pay.support.alipay.config.Constants;
import com.lenovohit.hwe.pay.support.alipay.model.TradeStatus;
import com.lenovohit.hwe.pay.support.alipay.model.builder.AlipayTradePayRequestBuilder;
import com.lenovohit.hwe.pay.support.alipay.model.builder.AlipayTradeQueryRequestBuilder;
import com.lenovohit.hwe.pay.support.alipay.model.result.AlipayTradePayResult;

/**
 * Created by liuyangkly on 15/7/31.
 */
public class AlipayTradePayBusiness extends AbsAlipayTradeBusiness {
	 protected static ExecutorService executorService = Executors.newCachedThreadPool();
	public AlipayTradePayBusiness(Configuration configs) {
		super(configs);
	}
	
	// 商户可以直接使用的pay方法
    public AlipayTradePayResult run(AlipayTradePayRequestBuilder builder) {
        validateBuilder(builder);

        final String outTradeNo = builder.getOutTradeNo();

        AlipayTradePayRequest request = new AlipayTradePayRequest();
        // 设置平台参数
        request.setNotifyUrl(builder.getNotifyUrl());
        String appAuthToken = builder.getAppAuthToken();
        // todo 等支付宝sdk升级公共参数后使用如下方法
        // request.setAppAuthToken(appAuthToken);
        request.putOtherTextParam("app_auth_token", builder.getAppAuthToken());

        // 设置业务参数
        request.setBizContent(builder.toJsonString());
        log.info("trade.pay bizContent:" + request.getBizContent());

        // 首先调用支付api
        AlipayTradePayResponse response = (AlipayTradePayResponse) getResponse(client, request);

        AlipayTradePayResult result = new AlipayTradePayResult(response);
        if (response != null && Constants.SUCCESS.equals(response.getCode())) {
            // 支付交易明确成功
            result.setTradeStatus(TradeStatus.SUCCESS);

        } else if (response != null && Constants.PAYING.equals(response.getCode())) {
            // 返回用户处理中，则轮询查询交易是否成功，如果查询超时，则调用撤销
            AlipayTradeQueryRequestBuilder queryBuiler = new AlipayTradeQueryRequestBuilder()
                                                            .setAppAuthToken(appAuthToken)
                                                            .setOutTradeNo(outTradeNo);
            AlipayTradeQueryResponse loopQueryResponse = loopQueryResult(queryBuiler);
            return checkQueryAndCancel(outTradeNo, appAuthToken, result, loopQueryResponse);

        } else if (tradeError(response)) {
            // 系统错误，则查询一次交易，如果交易没有支付成功，则调用撤销
            AlipayTradeQueryRequestBuilder queryBuiler = new AlipayTradeQueryRequestBuilder()
                                                            .setAppAuthToken(appAuthToken)
                                                            .setOutTradeNo(outTradeNo);
            AlipayTradeQueryResponse queryResponse = tradeQuery(queryBuiler);
            return checkQueryAndCancel(outTradeNo, appAuthToken, result, queryResponse);

        } else {
            // 其他情况表明该订单支付明确失败
            result.setTradeStatus(TradeStatus.FAILED);
        }

        return result;
    }
}
