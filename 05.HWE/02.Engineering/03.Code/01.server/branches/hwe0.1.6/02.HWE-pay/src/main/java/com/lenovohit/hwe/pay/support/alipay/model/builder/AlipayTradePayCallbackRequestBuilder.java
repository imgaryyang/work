package com.lenovohit.hwe.pay.support.alipay.model.builder;

import org.apache.commons.configuration.Configuration;

import com.google.gson.annotations.SerializedName;
import com.lenovohit.core.utils.StringUtils;

/**
 * Created by liuyangkly on 16/3/3.
 */
public class AlipayTradePayCallbackRequestBuilder extends AbsAlipayTradeRequestBuilder {

    private BizContent bizContent = new BizContent();

    @Override
    public BizContent getBizContent() {
        return bizContent;
    }

    @Override
    public boolean validate() {
        if (StringUtils.isEmpty(bizContent.responseStr)) {
            throw new IllegalStateException("responseStr can not both be NULL!");
        }
        return true;
    }

    @Override
    public String toString() {
        final StringBuilder sb = new StringBuilder("AlipayTradePayCallbackRequestBuilder{");
        sb.append("bizContent=").append(bizContent);
        sb.append(", super=").append(super.toString());
        sb.append('}');
        return sb.toString();
    }

    @Override
    public AlipayTradePayCallbackRequestBuilder setAppAuthToken(String appAuthToken) {
        return (AlipayTradePayCallbackRequestBuilder) super.setAppAuthToken(appAuthToken);
    }

    @Override
    public AlipayTradePayCallbackRequestBuilder setNotifyUrl(String notifyUrl) {
        return (AlipayTradePayCallbackRequestBuilder) super.setNotifyUrl(notifyUrl);
    }

    @Override
	public AlipayTradePayCallbackRequestBuilder setConfigs(Configuration configs) {
		return (AlipayTradePayCallbackRequestBuilder) super.setConfigs(configs);
	}

    public String getResponseStr() {
        return bizContent.responseStr;
    }

    public AlipayTradePayCallbackRequestBuilder setResponseStr(String responseStr) {
        bizContent.responseStr = responseStr;
        return this;
    }

    public static class BizContent {
        // 支付宝反馈报文串
        @SerializedName("responseStr")
        private String responseStr;


        @Override
        public String toString() {
            final StringBuilder sb = new StringBuilder("BizContent{");
            sb.append("responseStr='").append(responseStr).append('\'');
            sb.append('}');
            return sb.toString();
        }
    }
}
