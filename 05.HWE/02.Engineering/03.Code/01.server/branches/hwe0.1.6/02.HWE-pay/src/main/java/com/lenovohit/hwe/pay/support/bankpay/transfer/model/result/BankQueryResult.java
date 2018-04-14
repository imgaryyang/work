package com.lenovohit.hwe.pay.support.bankpay.transfer.model.result;

import com.lenovohit.hwe.pay.support.bankpay.transfer.model.BankTradeStatus;
import com.lenovohit.hwe.pay.support.bankpay.transfer.model.response.BankQueryResponse;

/**
 * Created by zyus
 */
public class BankQueryResult implements BankTradeResult {
    private BankTradeStatus tradeStatus;
    private BankQueryResponse response;

    public BankQueryResult(BankQueryResponse response) {
        this.response = response;
    }

    public void setTradeStatus(BankTradeStatus tradeStatus) {
        this.tradeStatus = tradeStatus;
    }

    public void setResponse(BankQueryResponse response) {
        this.response = response;
    }

    public BankTradeStatus getTradeStatus() {
        return tradeStatus;
    }

    public BankQueryResponse getResponse() {
        return response;
    }

    @Override
    public boolean isTradeSuccess() {
        return response != null &&
        		BankTradeStatus.SUCCESS.equals(tradeStatus);
    }
}
