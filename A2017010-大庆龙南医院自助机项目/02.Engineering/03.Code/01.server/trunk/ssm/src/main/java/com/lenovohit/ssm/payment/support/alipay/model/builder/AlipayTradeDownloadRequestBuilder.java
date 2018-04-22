package com.lenovohit.ssm.payment.support.alipay.model.builder;

import com.google.gson.annotations.SerializedName;
import com.lenovohit.core.utils.StringUtils;

/**
 * Created by liuyangkly on 16/3/3.
 */
public class AlipayTradeDownloadRequestBuilder extends RequestBuilder {
    private BizContent bizContent = new BizContent();

    @Override
    public BizContent getBizContent() {
        return bizContent;
    }

    @Override
    public boolean validate() {
        if (StringUtils.isEmpty(bizContent.billType)) {
            throw new NullPointerException("billType not both be NULL!");
        }
        if (StringUtils.isEmpty(bizContent.billDate)) {
            throw new NullPointerException("billDate should not be NULL!");
        }
        return true;
    }

    @Override
    public String toString() {
        final StringBuilder sb = new StringBuilder("AlipayTradeRefundRequestBuilder{");
        sb.append("bizContent=").append(bizContent);
        sb.append(", super=").append(super.toString());
        sb.append('}');
        return sb.toString();
    }

    @Override
    public AlipayTradeDownloadRequestBuilder setAppAuthToken(String appAuthToken) {
        return (AlipayTradeDownloadRequestBuilder) super.setAppAuthToken(appAuthToken);
    }

    @Override
    public AlipayTradeDownloadRequestBuilder setNotifyUrl(String notifyUrl) {
        return (AlipayTradeDownloadRequestBuilder) super.setNotifyUrl(notifyUrl);
    }

    public AlipayTradeDownloadRequestBuilder setBillDate(String billDate) {
        bizContent.billDate = billDate;
        return this;
    }

    public AlipayTradeDownloadRequestBuilder setBillType(String billType) {
        bizContent.billType = billType;
        return this;
    }
    
    public String getBillType() {
        return bizContent.billType;
    }

    public String getBillDate() {
        return bizContent.billDate;
    }
    

	public static class BizContent {
        // 账单类型 商户通过接口或商户经开放平台授权后其所属服务商通过接口可以获取以下账单类型：trade、signcustomer；
        @SerializedName("bill_type")
        private String billType;

        // (推荐) 外部订单号，可通过外部订单号申请退款，推荐使用
        @SerializedName("bill_date")
        private String billDate;

        @Override
        public String toString() {
            final StringBuilder sb = new StringBuilder("BizContent{");
            sb.append("billType='").append(billType).append('\'');
            sb.append(", billDate='").append(billDate).append('\'');
            sb.append('}');
            return sb.toString();
        }
    }
}
