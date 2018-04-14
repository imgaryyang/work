package com.lenovohit.hwe.pay.support.alipay.model.result;

import com.alipay.api.response.AlipayTradeAppPayResponse;
import com.lenovohit.hwe.pay.support.alipay.model.TradeStatus;

/**
 * Created by liuyangkly on 15/8/27.
 */
public class AlipayTradeAppPayResult implements AbsAlipayTradeResult {
    private TradeStatus tradeStatus;
    private AlipayTradeAppPayResponse response;

    public AlipayTradeAppPayResult(AlipayTradeAppPayResponse response) {
        this.response = response;
    }

    public void setTradeStatus(TradeStatus tradeStatus) {
        this.tradeStatus = tradeStatus;
    }

    public void setResponse(AlipayTradeAppPayResponse response) {
        this.response = response;
    }

    public TradeStatus getTradeStatus() {
        return tradeStatus;
    }

    public AlipayTradeAppPayResponse getResponse() {
        return response;
    }

    @Override
    public boolean isTradeSuccess() {
        return response != null &&
                TradeStatus.SUCCESS.equals(tradeStatus);
    }
}
