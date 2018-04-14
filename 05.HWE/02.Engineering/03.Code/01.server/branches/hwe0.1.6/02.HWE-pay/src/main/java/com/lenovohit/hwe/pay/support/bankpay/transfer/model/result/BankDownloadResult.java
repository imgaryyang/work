package com.lenovohit.hwe.pay.support.bankpay.transfer.model.result;

import com.lenovohit.hwe.pay.support.bankpay.transfer.model.BankTradeStatus;
import com.lenovohit.hwe.pay.support.bankpay.transfer.model.response.BankDownloadResponse;

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
