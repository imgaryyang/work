package com.lenovohit.hwe.pay.support.alipay.model.result;

import com.lenovohit.hwe.pay.support.alipay.model.TradeStatus;
import com.lenovohit.hwe.pay.support.alipay.model.response.AlipayTradePayCallbackResponse;

/**
 * Created by liuyangkly on 15/8/27.
 */
public class AlipayTradePayCallbackResult implements AbsAlipayTradeResult {
    private TradeStatus tradeStatus;
    private AlipayTradePayCallbackResponse response;

    public AlipayTradePayCallbackResult(AlipayTradePayCallbackResponse response) {
        this.response = response;
    }

    public void setTradeStatus(TradeStatus tradeStatus) {
        this.tradeStatus = tradeStatus;
    }

    public void setResponse(AlipayTradePayCallbackResponse response) {
        this.response = response;
    }

    public TradeStatus getTradeStatus() {
        return tradeStatus;
    }

    public AlipayTradePayCallbackResponse getResponse() {
        return response;
    }

    @Override
    public boolean isTradeSuccess() {
        return response != null &&
                TradeStatus.SUCCESS.equals(tradeStatus);
    }
}
