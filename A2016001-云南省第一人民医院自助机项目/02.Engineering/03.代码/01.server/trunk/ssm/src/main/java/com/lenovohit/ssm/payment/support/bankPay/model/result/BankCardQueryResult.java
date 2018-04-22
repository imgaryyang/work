package com.lenovohit.ssm.payment.support.bankPay.model.result;

import com.lenovohit.ssm.payment.support.bankPay.model.BankTradeStatus;
import com.lenovohit.ssm.payment.support.bankPay.model.response.BankCardQueryResponse;

/**
 * Created by zyus
 */
public class BankCardQueryResult implements BankTradeResult {
    private BankTradeStatus tradeStatus;
    private BankCardQueryResponse response;

    public BankCardQueryResult(BankCardQueryResponse response) {
        this.response = response;
    }

    public void setTradeStatus(BankTradeStatus tradeStatus) {
        this.tradeStatus = tradeStatus;
    }

    public void setResponse(BankCardQueryResponse response) {
        this.response = response;
    }

    public BankTradeStatus getTradeStatus() {
        return tradeStatus;
    }

    public BankCardQueryResponse getResponse() {
        return response;
    }

    @Override
    public boolean isTradeSuccess() {
        return response != null &&
        		BankTradeStatus.SUCCESS.equals(tradeStatus);
    }
}
