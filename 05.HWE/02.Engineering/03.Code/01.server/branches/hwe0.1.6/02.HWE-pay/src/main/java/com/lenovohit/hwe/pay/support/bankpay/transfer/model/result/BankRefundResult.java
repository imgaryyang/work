package com.lenovohit.hwe.pay.support.bankpay.transfer.model.result;

import com.lenovohit.hwe.pay.support.bankpay.transfer.model.BankTradeStatus;
import com.lenovohit.hwe.pay.support.bankpay.transfer.model.response.BankRefundResponse;

/**
 * Created by liuyangkly on 15/8/27.
 */
public class BankRefundResult implements BankTradeResult {
    private BankTradeStatus tradeStatus;
    private BankRefundResponse response;

    public BankRefundResult(BankRefundResponse response) {
        this.response = response;
    }

    public void setTradeStatus(BankTradeStatus tradeStatus) {
        this.tradeStatus = tradeStatus;
    }

    public void setResponse(BankRefundResponse response) {
        this.response = response;
    }

    public BankTradeStatus getTradeStatus() {
        return tradeStatus;
    }

    public BankRefundResponse getResponse() {
        return response;
    }

    @Override
    public boolean isTradeSuccess() {
        return response != null &&
        		BankTradeStatus.SUCCESS.equals(tradeStatus);
    }
}
