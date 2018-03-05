package com.lenovohit.hwe.pay.support.alipay.scan.model.result;

import com.lenovohit.hwe.pay.support.alipay.scan.model.TradeStatus;
import com.lenovohit.hwe.pay.support.alipay.scan.model.response.AlipayPaySyncResponse;

/**
 * Created by liuyangkly on 15/8/27.
 */
public class AlipayF2FPaySyncResult implements Result {
    private TradeStatus tradeStatus;
    private AlipayPaySyncResponse response;

    public AlipayF2FPaySyncResult(AlipayPaySyncResponse response) {
        this.response = response;
    }

    public void setTradeStatus(TradeStatus tradeStatus) {
        this.tradeStatus = tradeStatus;
    }

    public void setResponse(AlipayPaySyncResponse response) {
        this.response = response;
    }

    public TradeStatus getTradeStatus() {
        return tradeStatus;
    }

    public AlipayPaySyncResponse getResponse() {
        return response;
    }

    @Override
    public boolean isTradeSuccess() {
        return response != null &&
                TradeStatus.SUCCESS.equals(tradeStatus);
    }
}
