package com.lenovohit.hwe.pay.support.bankpay.transfer.model;

/**
 * Created by zyus
 */
public enum BankTradeStatus {
    SUCCESS  // 业务交易明确成功，比如支付成功、退货成功
    
    ,REFUNDING  // 退款业务处理中

    ,FAILED  // 业务交易明确失败，比如支付明确失败、退货明确失败

    ,UNKNOWN // 业务交易状态未知，此时不清楚该业务是否成功或者失败，需要商户自行确认
}
