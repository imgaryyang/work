package com.lenovohit.hwe.pay.support.alipay.business;

import org.apache.commons.configuration.Configuration;

import com.alipay.api.request.AlipayDataDataserviceBillDownloadurlQueryRequest;
import com.alipay.api.response.AlipayDataDataserviceBillDownloadurlQueryResponse;
import com.lenovohit.hwe.pay.support.alipay.config.Constants;
import com.lenovohit.hwe.pay.support.alipay.model.TradeStatus;
import com.lenovohit.hwe.pay.support.alipay.model.builder.AlipayTradeDownloadRequestBuilder;
import com.lenovohit.hwe.pay.support.alipay.model.result.AlipayTradeDownloadResult;

/**
 * Created by liuyangkly on 15/7/31.
 */
public class AlipayTradeDownloadBusiness extends AbsAlipayTradeBusiness {

	public AlipayTradeDownloadBusiness(Configuration configs) {
		super(configs);
	}
	
	public AlipayTradeDownloadResult run(AlipayTradeDownloadRequestBuilder builder) {
        validateBuilder(builder);

        AlipayDataDataserviceBillDownloadurlQueryRequest request = new AlipayDataDataserviceBillDownloadurlQueryRequest();

        // 设置业务参数
        request.setBizContent(builder.toJsonString());
        log.info("trade.pay bizContent:" + request.getBizContent());

        // 调用读取文件路径接口
        AlipayDataDataserviceBillDownloadurlQueryResponse response = (AlipayDataDataserviceBillDownloadurlQueryResponse) getResponse(client, request);

        AlipayTradeDownloadResult result = new AlipayTradeDownloadResult(response);
        if (response != null && Constants.SUCCESS.equals(response.getCode())) {
            // 交易成功
        	result.setTradeStatus(TradeStatus.SUCCESS);
        } else if (tradeError(response)) {
            // 查询发生异常，交易状态未知
            result.setTradeStatus(TradeStatus.UNKNOWN);
        } else {
            // 明确失败
            result.setTradeStatus(TradeStatus.FAILED);
        }

        return result;
    }
}
