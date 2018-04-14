package com.lenovohit.hwe.pay.support.alipay.model.result;

import com.alipay.api.response.AlipayTradeCreateResponse;
import com.lenovohit.hwe.pay.support.alipay.model.TradeStatus;

/**
 * Created by liuyangkly on 15/8/27.
 */
public class AlipayTradeCreateResult implements AbsAlipayTradeResult {
    private TradeStatus tradeStatus;
    private AlipayTradeCreateResponse response;

    public AlipayTradeCreateResult(AlipayTradeCreateResponse response) {
        this.response = response;
    }

    public void setTradeStatus(TradeStatus tradeStatus) {
        this.tradeStatus = tradeStatus;
    }

    public void setResponse(AlipayTradeCreateResponse response) {
        this.response = response;
    }

    public TradeStatus getTradeStatus() {
        return tradeStatus;
    }

    public AlipayTradeCreateResponse getResponse() {
        return response;
    }

    @Override
    public boolean isTradeSuccess() {
        return response != null &&
                TradeStatus.SUCCESS.equals(tradeStatus);
    }
}
