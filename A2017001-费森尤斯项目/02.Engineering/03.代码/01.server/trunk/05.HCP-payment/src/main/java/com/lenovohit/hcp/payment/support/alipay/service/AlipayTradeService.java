package com.lenovohit.hcp.payment.support.alipay.service;

import com.lenovohit.hcp.payment.support.alipay.model.builder.AlipayTradeDownloadRequestBuilder;
import com.lenovohit.hcp.payment.support.alipay.model.builder.AlipayTradePayRequestBuilder;
import com.lenovohit.hcp.payment.support.alipay.model.builder.AlipayTradePrecreateRequestBuilder;
import com.lenovohit.hcp.payment.support.alipay.model.builder.AlipayTradeQueryRequestBuilder;
import com.lenovohit.hcp.payment.support.alipay.model.builder.AlipayTradeRefundRequestBuilder;
import com.lenovohit.hcp.payment.support.alipay.model.response.AlipayPaySyncResponse;
import com.lenovohit.hcp.payment.support.alipay.model.result.AlipayF2FDownloadResult;
import com.lenovohit.hcp.payment.support.alipay.model.result.AlipayF2FPayResult;
import com.lenovohit.hcp.payment.support.alipay.model.result.AlipayF2FPaySyncResult;
import com.lenovohit.hcp.payment.support.alipay.model.result.AlipayF2FPrecreateResult;
import com.lenovohit.hcp.payment.support.alipay.model.result.AlipayF2FQueryResult;
import com.lenovohit.hcp.payment.support.alipay.model.result.AlipayF2FRefundResult;

/**
 * Created by liuyangkly on 15/7/29.
 */
public interface AlipayTradeService {

    // 当面付2.0流程支付
    public AlipayF2FPayResult tradePay(AlipayTradePayRequestBuilder builder);

    // 当面付2.0消费查询
    public AlipayF2FQueryResult queryTradeResult(AlipayTradeQueryRequestBuilder builder);

    // 当面付2.0消费退款
    public AlipayF2FRefundResult tradeRefund(AlipayTradeRefundRequestBuilder builder);

    // 当面付2.0预下单(生成二维码)
    public AlipayF2FPrecreateResult tradePrecreate(AlipayTradePrecreateRequestBuilder builder);
    
    // 当面付2.0异步通知
    public AlipayF2FPaySyncResult paySync(AlipayPaySyncResponse response);
    
    // 当面付2.0同步对账文件
    public AlipayF2FDownloadResult downloadUrl(AlipayTradeDownloadRequestBuilder builder);
}
