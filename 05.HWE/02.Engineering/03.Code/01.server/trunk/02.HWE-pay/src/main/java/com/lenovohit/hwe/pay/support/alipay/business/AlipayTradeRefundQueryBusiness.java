package com.lenovohit.hwe.pay.support.alipay.business;

import org.apache.commons.configuration.Configuration;

import com.alipay.api.request.AlipayTradeFastpayRefundQueryRequest;
import com.alipay.api.response.AlipayTradeFastpayRefundQueryResponse;
import com.lenovohit.hwe.pay.support.alipay.config.Constants;
import com.lenovohit.hwe.pay.support.alipay.model.TradeStatus;
import com.lenovohit.hwe.pay.support.alipay.model.builder.AlipayTradeRefundQueryRequestBuilder;
import com.lenovohit.hwe.pay.support.alipay.model.result.AlipayTradeRefundQueryResult;

/**
 * Created by liuyangkly on 15/7/31.
 */
public class AlipayTradeRefundQueryBusiness extends AbsAlipayTradeBusiness {

	public AlipayTradeRefundQueryBusiness(Configuration configs) {
		super(configs);
	}
	
	public AlipayTradeRefundQueryResult run(AlipayTradeRefundQueryRequestBuilder builder) {
		AlipayTradeFastpayRefundQueryResponse response = tradeRefundQuery(builder);

        AlipayTradeRefundQueryResult result = new AlipayTradeRefundQueryResult(response);
        if (queryRefundSuccess(response)) {
            // 查询返回该订单交易支付成功
            result.setTradeStatus(TradeStatus.SUCCESS);

        } else if (tradeError(response)) {
            // 查询发生异常，交易状态未知
            result.setTradeStatus(TradeStatus.UNKNOWN);

        } else {
        	// 其他情况详细核实 TODO"ACQ.TRADE_NOT_EXIST"待核实
        	if(Constants.FAILED.equals(response.getCode()) && "ACQ.TRADE_NOT_EXIST".equals(response.getSubCode())){
        		result.setTradeStatus(TradeStatus.FAILED);
        	} else {//其他错误也是本次查询交易错误，不代要查询的交易记录业务状态是错误的，需修改后重新发起请求。
                result.setTradeStatus(TradeStatus.UNKNOWN);
        	}
        }
        return result;
    }

	protected AlipayTradeFastpayRefundQueryResponse tradeRefundQuery(AlipayTradeRefundQueryRequestBuilder builder) {
		validateBuilder(builder);

		AlipayTradeFastpayRefundQueryRequest request = new AlipayTradeFastpayRefundQueryRequest();
		request.putOtherTextParam("app_auth_token", builder.getAppAuthToken());
		request.setBizContent(builder.toJsonString());
		log.info("trade.query bizContent:" + request.getBizContent());

		return (AlipayTradeFastpayRefundQueryResponse) getResponse(client, request);
	}
	
}
