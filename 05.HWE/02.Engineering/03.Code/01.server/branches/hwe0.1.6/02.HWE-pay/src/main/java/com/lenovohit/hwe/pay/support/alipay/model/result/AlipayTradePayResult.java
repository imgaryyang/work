package com.lenovohit.hwe.pay.support.alipay.model.result;

import com.alipay.api.response.AlipayTradePayResponse;
import com.lenovohit.hwe.pay.support.alipay.model.TradeStatus;

/**
 * Created by liuyangkly on 15/8/26.
 */
public class AlipayTradePayResult implements AbsAlipayTradeResult {
    private TradeStatus tradeStatus;
    private AlipayTradePayResponse response;

    public AlipayTradePayResult(AlipayTradePayResponse response) {
        this.response = response;
    }

    public void setTradeStatus(TradeStatus tradeStatus) {
        this.tradeStatus = tradeStatus;
    }

    public void setResponse(AlipayTradePayResponse response) {
        this.response = response;
    }

    public TradeStatus getTradeStatus() {
        return tradeStatus;
    }

    public AlipayTradePayResponse getResponse() {
        return response;
    }

    @Override
    public boolean isTradeSuccess() {
        return response != null &&
                TradeStatus.SUCCESS.equals(tradeStatus);
    }
}
