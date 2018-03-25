package com.lenovohit.hwe.pay.support.alipay.model.result;

import com.alipay.api.response.AlipayTradeFastpayRefundQueryResponse;
import com.lenovohit.hwe.pay.support.alipay.model.TradeStatus;

/**
 * Created by liuyangkly on 15/8/27.
 */
public class AlipayTradeRefundQueryResult implements AbsAlipayTradeResult {
    private TradeStatus tradeStatus;
    private AlipayTradeFastpayRefundQueryResponse response;

    public AlipayTradeRefundQueryResult(AlipayTradeFastpayRefundQueryResponse response) {
        this.response = response;
    }

    public void setTradeStatus(TradeStatus tradeStatus) {
        this.tradeStatus = tradeStatus;
    }

    public void setResponse(AlipayTradeFastpayRefundQueryResponse response) {
        this.response = response;
    }

    public TradeStatus getTradeStatus() {
        return tradeStatus;
    }

    public AlipayTradeFastpayRefundQueryResponse getResponse() {
        return response;
    }

    @Override
    public boolean isTradeSuccess() {
        return response != null &&
                TradeStatus.SUCCESS.equals(tradeStatus);
    }
}
