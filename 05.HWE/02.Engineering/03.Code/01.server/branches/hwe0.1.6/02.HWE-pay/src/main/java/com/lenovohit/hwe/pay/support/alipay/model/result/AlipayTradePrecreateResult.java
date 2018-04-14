package com.lenovohit.hwe.pay.support.alipay.model.result;

import com.alipay.api.response.AlipayTradePrecreateResponse;
import com.lenovohit.hwe.pay.support.alipay.model.TradeStatus;

/**
 * Created by liuyangkly on 15/8/27.
 */
public class AlipayTradePrecreateResult implements AbsAlipayTradeResult {
    private TradeStatus tradeStatus;
    private AlipayTradePrecreateResponse response;

    public AlipayTradePrecreateResult(AlipayTradePrecreateResponse response) {
        this.response = response;
    }

    public void setTradeStatus(TradeStatus tradeStatus) {
        this.tradeStatus = tradeStatus;
    }

    public void setResponse(AlipayTradePrecreateResponse response) {
        this.response = response;
    }

    public TradeStatus getTradeStatus() {
        return tradeStatus;
    }

    public AlipayTradePrecreateResponse getResponse() {
        return response;
    }

    @Override
    public boolean isTradeSuccess() {
        return response != null &&
                TradeStatus.SUCCESS.equals(tradeStatus);
    }
}
