package com.lenovohit.ssm.payment.support.bankPay.service;

import com.lenovohit.ssm.payment.support.bankPay.model.builder.BankCardQueryRequestBuilder;
import com.lenovohit.ssm.payment.support.bankPay.model.builder.BankDownloadRequestBuilder;
import com.lenovohit.ssm.payment.support.bankPay.model.builder.BankQueryRequestBuilder;
import com.lenovohit.ssm.payment.support.bankPay.model.builder.BankRefundRequestBuilder;
import com.lenovohit.ssm.payment.support.bankPay.model.result.BankCardQueryResult;
import com.lenovohit.ssm.payment.support.bankPay.model.result.BankDownloadResult;
import com.lenovohit.ssm.payment.support.bankPay.model.result.BankQueryResult;
import com.lenovohit.ssm.payment.support.bankPay.model.result.BankRefundResult;

/**
 * Created by zyus
 */
public interface BankTradeService {

//    // 流程支付
//    public BankPayResult tradePay(BankPayRequestBuilder builder);
//
    // 消费查询
    public BankQueryResult tradeQuery(BankQueryRequestBuilder builder);

    // 消费退款
    public BankRefundResult tradeRefund(BankRefundRequestBuilder builder); 
    
    // 卡查询
    public BankCardQueryResult tradeCardQuery(BankCardQueryRequestBuilder builder);
//
//    // 预下单(生成二维码)
//    public BankPrecreateResult tradePrecreate(BankPrecreateRequestBuilder builder);
//    
//    // 异步通知
//    public BankPaySyncResult paySync(AlipayPaySyncResponse response);
//    
    // 同步对账文件
    public BankDownloadResult tradeDownloadFile(BankDownloadRequestBuilder builder);
}
