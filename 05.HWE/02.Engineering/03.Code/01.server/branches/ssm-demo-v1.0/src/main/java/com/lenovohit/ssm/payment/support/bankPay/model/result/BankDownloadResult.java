package com.lenovohit.ssm.payment.support.bankPay.model.result;

import com.lenovohit.ssm.payment.support.bankPay.model.BankTradeStatus;
import com.lenovohit.ssm.payment.support.bankPay.model.response.BankDownloadResponse;

/**
 * Created by zyus
 */
public class BankDownloadResult implements BankTradeResult {
    private BankTradeStatus tradeStatus;
    private BankDownloadResponse response;

    public BankDownloadResult(BankDownloadResponse response) {
        this.response = response;
    }

    public void setTradeStatus(BankTradeStatus tradeStatus) {
        this.tradeStatus = tradeStatus;
    }

    public void setResponse(BankDownloadResponse response) {
        this.response = response;
    }

    public BankTradeStatus getTradeStatus() {
        return tradeStatus;
    }

    public BankDownloadResponse getResponse() {
        return response;
    }

    @Override
    public boolean isTradeSuccess() {
        return response != null &&
        		BankTradeStatus.SUCCESS.equals(tradeStatus);
    }
}
