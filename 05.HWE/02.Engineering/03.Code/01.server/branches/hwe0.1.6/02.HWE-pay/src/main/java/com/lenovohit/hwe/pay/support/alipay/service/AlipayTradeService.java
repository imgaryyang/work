package com.lenovohit.hwe.pay.support.alipay.service;

import com.lenovohit.hwe.pay.support.alipay.model.builder.AlipayTradeDownloadRequestBuilder;
import com.lenovohit.hwe.pay.support.alipay.model.builder.AlipayTradePayRequestBuilder;
import com.lenovohit.hwe.pay.support.alipay.model.builder.AlipayTradePrecreateRequestBuilder;
import com.lenovohit.hwe.pay.support.alipay.model.builder.AlipayTradeQueryRequestBuilder;
import com.lenovohit.hwe.pay.support.alipay.model.builder.AlipayTradeRefundQueryRequestBuilder;
import com.lenovohit.hwe.pay.support.alipay.model.builder.AlipayTradeRefundRequestBuilder;
import com.lenovohit.hwe.pay.support.alipay.model.response.AlipayTradePayCallbackResponse;
import com.lenovohit.hwe.pay.support.alipay.model.result.AlipayTradeDownloadResult;
import com.lenovohit.hwe.pay.support.alipay.model.result.AlipayTradePayResult;
import com.lenovohit.hwe.pay.support.alipay.model.result.AlipayTradePayCallbackResult;
import com.lenovohit.hwe.pay.support.alipay.model.result.AlipayTradePrecreateResult;
import com.lenovohit.hwe.pay.support.alipay.model.result.AlipayTradeQueryResult;
import com.lenovohit.hwe.pay.support.alipay.model.result.AlipayTradeRefundQueryResult;
import com.lenovohit.hwe.pay.support.alipay.model.result.AlipayTradeRefundResult;

/**
 * Created by liuyangkly on 15/7/29.
 */
public interface AlipayTradeService {

    // 当面付2.0流程支付
    public AlipayTradePayResult tradePay(AlipayTradePayRequestBuilder builder);

    // 当面付2.0消费查询
    public AlipayTradeQueryResult queryTradeResult(AlipayTradeQueryRequestBuilder builder);

    // 当面付2.0消费退款
    public AlipayTradeRefundResult tradeRefund(AlipayTradeRefundRequestBuilder builder);
    
    // 当面付2.0退款查询
    public AlipayTradeRefundQueryResult tradeRefundQueryResult(AlipayTradeRefundQueryRequestBuilder builder);

    // 当面付2.0预下单(生成二维码)
    public AlipayTradePrecreateResult tradePrecreate(AlipayTradePrecreateRequestBuilder builder);
    
    // 当面付2.0异步通知
    public AlipayTradePayCallbackResult paySync(AlipayTradePayCallbackResponse response);
    
    // 当面付2.0同步对账文件
    public AlipayTradeDownloadResult tradeDownloadUrl(AlipayTradeDownloadRequestBuilder builder);
}
