/*
 * Welcome to use the TableGo Tools.
 * 
 * http://vipbooks.iteye.com
 * http://blog.csdn.net/vipbooks
 * http://www.cnblogs.com/vipbooks
 * 
 * Author:bianj
 * Email:edinsker@163.com
 * Version:5.8.0
 */

package com.lenovohit.hwe.pay.model;

import java.math.BigDecimal;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import com.lenovohit.hwe.base.model.AuditableModel;

/**
 * PAY_CHECK_DETAIL_WXPAY
 * 
 * @author zyus
 * @version 1.0.0 2017-12-22
 */
@Entity
@Table(name = "PAY_CHECK_DETAIL_WXPAY")
public class CheckDetailWxpay extends AuditableModel implements java.io.Serializable {
    /** 版本号 */
    private static final long serialVersionUID = -559814157983459775L;

    /** recordId */
    private String recordId;

    /** tradeTime */
    private String tradeTime;

    /** appId */
    private String appId;

    /** mchId */
    private String mchId;

    /** childMchId */
    private String childMchId;

    /** deviceInfo */
    private String deviceInfo;

    /** tradeNo */
    private String tradeNo;

    /** outTradeNo */
    private String outTradeNo;

    /** openId */
    private String openId;

    /** tradeType */
    private String tradeType;

    /** tradeStatus */
    private String tradeStatus;

    /** bankType */
    private String bankType;

    /** feeType */
    private String feeType;

    /** totalFee */
    private BigDecimal totalFee;

    /** mpCouponFee */
    private BigDecimal mpCouponFee;

    /** refTradeNo */
    private String refTradeNo;

    /** refOutTradeNo */
    private String refOutTradeNo;

    /** refundFee */
    private BigDecimal refundFee;

    /** mrCouponFee */
    private BigDecimal mrCouponFee;

    /** refType */
    private String refType;

    /** refStatus */
    private String refStatus;

    /** body */
    private String body;

    /** attach */
    private String attach;

    /** fee */
    private BigDecimal fee;

    /** feeRate */
    private String feeRate;

    /**
     * 获取recordId
     * 
     * @return recordId
     */
    @Column(name = "RECORD_ID", nullable = true, length = 32)
    public String getRecordId() {
        return this.recordId;
    }

    /**
     * 设置recordId
     * 
     * @param recordId
     */
    public void setRecordId(String recordId) {
        this.recordId = recordId;
    }

    /**
     * 获取tradeTime
     * 
     * @return tradeTime
     */
    @Column(name = "TRADE_TIME", nullable = true, length = 20)
    public String getTradeTime() {
        return this.tradeTime;
    }

    /**
     * 设置tradeTime
     * 
     * @param tradeTime
     */
    public void setTradeTime(String tradeTime) {
        this.tradeTime = tradeTime;
    }

    /**
     * 获取appId
     * 
     * @return appId
     */
    @Column(name = "APP_ID", nullable = true, length = 32)
    public String getAppId() {
        return this.appId;
    }

    /**
     * 设置appId
     * 
     * @param appId
     */
    public void setAppId(String appId) {
        this.appId = appId;
    }

    /**
     * 获取mchId
     * 
     * @return mchId
     */
    @Column(name = "MCH_ID", nullable = true, length = 32)
    public String getMchId() {
        return this.mchId;
    }

    /**
     * 设置mchId
     * 
     * @param mchId
     */
    public void setMchId(String mchId) {
        this.mchId = mchId;
    }

    /**
     * 获取childMchId
     * 
     * @return childMchId
     */
    @Column(name = "CHILD_MCH_ID", nullable = true, length = 32)
    public String getChildMchId() {
        return this.childMchId;
    }

    /**
     * 设置childMchId
     * 
     * @param childMchId
     */
    public void setChildMchId(String childMchId) {
        this.childMchId = childMchId;
    }

    /**
     * 获取deviceInfo
     * 
     * @return deviceInfo
     */
    @Column(name = "DEVICE_INFO", nullable = true, length = 32)
    public String getDeviceInfo() {
        return this.deviceInfo;
    }

    /**
     * 设置deviceInfo
     * 
     * @param deviceInfo
     */
    public void setDeviceInfo(String deviceInfo) {
        this.deviceInfo = deviceInfo;
    }

    /**
     * 获取tradeNo
     * 
     * @return tradeNo
     */
    @Column(name = "TRADE_NO", nullable = true, length = 32)
    public String getTradeNo() {
        return this.tradeNo;
    }

    /**
     * 设置tradeNo
     * 
     * @param tradeNo
     */
    public void setTradeNo(String tradeNo) {
        this.tradeNo = tradeNo;
    }

    /**
     * 获取outTradeNo
     * 
     * @return outTradeNo
     */
    @Column(name = "OUT_TRADE_NO", nullable = true, length = 32)
    public String getOutTradeNo() {
        return this.outTradeNo;
    }

    /**
     * 设置outTradeNo
     * 
     * @param outTradeNo
     */
    public void setOutTradeNo(String outTradeNo) {
        this.outTradeNo = outTradeNo;
    }

    /**
     * 获取openId
     * 
     * @return openId
     */
    @Column(name = "OPEN_ID", nullable = true, length = 128)
    public String getOpenId() {
        return this.openId;
    }

    /**
     * 设置openId
     * 
     * @param openId
     */
    public void setOpenId(String openId) {
        this.openId = openId;
    }

    /**
     * 获取tradeType
     * 
     * @return tradeType
     */
    @Column(name = "TRADE_TYPE", nullable = true, length = 20)
    public String getTradeType() {
        return this.tradeType;
    }

    /**
     * 设置tradeType
     * 
     * @param tradeType
     */
    public void setTradeType(String tradeType) {
        this.tradeType = tradeType;
    }

    /**
     * 获取tradeStatus
     * 
     * @return tradeStatus
     */
    @Column(name = "TRADE_STATUS", nullable = true, length = 20)
    public String getTradeStatus() {
        return this.tradeStatus;
    }

    /**
     * 设置tradeStatus
     * 
     * @param tradeStatus
     */
    public void setTradeStatus(String tradeStatus) {
        this.tradeStatus = tradeStatus;
    }

    /**
     * 获取bankType
     * 
     * @return bankType
     */
    @Column(name = "BANK_TYPE", nullable = true, length = 20)
    public String getBankType() {
        return this.bankType;
    }

    /**
     * 设置bankType
     * 
     * @param bankType
     */
    public void setBankType(String bankType) {
        this.bankType = bankType;
    }

    /**
     * 获取feeType
     * 
     * @return feeType
     */
    @Column(name = "FEE_TYPE", nullable = true, length = 10)
    public String getFeeType() {
        return this.feeType;
    }

    /**
     * 设置feeType
     * 
     * @param feeType
     */
    public void setFeeType(String feeType) {
        this.feeType = feeType;
    }

    /**
     * 获取totalFee
     * 
     * @return totalFee
     */
    @Column(name = "TOTAL_FEE", nullable = true)
    public BigDecimal getTotalFee() {
        return this.totalFee;
    }

    /**
     * 设置totalFee
     * 
     * @param totalFee
     */
    public void setTotalFee(BigDecimal totalFee) {
        this.totalFee = totalFee;
    }

    /**
     * 获取mpCouponFee
     * 
     * @return mpCouponFee
     */
    @Column(name = "MP_COUPON_FEE", nullable = true)
    public BigDecimal getMpCouponFee() {
        return this.mpCouponFee;
    }

    /**
     * 设置mpCouponFee
     * 
     * @param mpCouponFee
     */
    public void setMpCouponFee(BigDecimal mpCouponFee) {
        this.mpCouponFee = mpCouponFee;
    }

    /**
     * 获取refTradeNo
     * 
     * @return refTradeNo
     */
    @Column(name = "REF_TRADE_NO", nullable = true, length = 32)
    public String getRefTradeNo() {
        return this.refTradeNo;
    }

    /**
     * 设置refTradeNo
     * 
     * @param refTradeNo
     */
    public void setRefTradeNo(String refTradeNo) {
        this.refTradeNo = refTradeNo;
    }

    /**
     * 获取refOutTradeNo
     * 
     * @return refOutTradeNo
     */
    @Column(name = "REF_OUT_TRADE_NO", nullable = true, length = 50)
    public String getRefOutTradeNo() {
        return this.refOutTradeNo;
    }

    /**
     * 设置refOutTradeNo
     * 
     * @param refOutTradeNo
     */
    public void setRefOutTradeNo(String refOutTradeNo) {
        this.refOutTradeNo = refOutTradeNo;
    }

    /**
     * 获取refundFee
     * 
     * @return refundFee
     */
    @Column(name = "REFUND_FEE", nullable = true)
    public BigDecimal getRefundFee() {
        return this.refundFee;
    }

    /**
     * 设置refundFee
     * 
     * @param refundFee
     */
    public void setRefundFee(BigDecimal refundFee) {
        this.refundFee = refundFee;
    }

    /**
     * 获取mrCouponFee
     * 
     * @return mrCouponFee
     */
    @Column(name = "MR_COUPON_FEE", nullable = true)
    public BigDecimal getMrCouponFee() {
        return this.mrCouponFee;
    }

    /**
     * 设置mrCouponFee
     * 
     * @param mrCouponFee
     */
    public void setMrCouponFee(BigDecimal mrCouponFee) {
        this.mrCouponFee = mrCouponFee;
    }

    /**
     * 获取refType
     * 
     * @return refType
     */
    @Column(name = "REF_TYPE", nullable = true, length = 20)
    public String getRefType() {
        return this.refType;
    }

    /**
     * 设置refType
     * 
     * @param refType
     */
    public void setRefType(String refType) {
        this.refType = refType;
    }

    /**
     * 获取refStatus
     * 
     * @return refStatus
     */
    @Column(name = "REF_STATUS", nullable = true, length = 20)
    public String getRefStatus() {
        return this.refStatus;
    }

    /**
     * 设置refStatus
     * 
     * @param refStatus
     */
    public void setRefStatus(String refStatus) {
        this.refStatus = refStatus;
    }

    /**
     * 获取body
     * 
     * @return body
     */
    @Column(name = "BODY", nullable = true, length = 128)
    public String getBody() {
        return this.body;
    }

    /**
     * 设置body
     * 
     * @param body
     */
    public void setBody(String body) {
        this.body = body;
    }

    /**
     * 获取attach
     * 
     * @return attach
     */
    @Column(name = "ATTACH", nullable = true, length = 128)
    public String getAttach() {
        return this.attach;
    }

    /**
     * 设置attach
     * 
     * @param attach
     */
    public void setAttach(String attach) {
        this.attach = attach;
    }

    /**
     * 获取fee
     * 
     * @return fee
     */
    @Column(name = "FEE", nullable = true)
    public BigDecimal getFee() {
        return this.fee;
    }

    /**
     * 设置fee
     * 
     * @param fee
     */
    public void setFee(BigDecimal fee) {
        this.fee = fee;
    }

    /**
     * 获取feeRate
     * 
     * @return feeRate
     */
    @Column(name = "FEE_RATE", nullable = true, length = 10)
    public String getFeeRate() {
        return this.feeRate;
    }

    /**
     * 设置feeRate
     * 
     * @param feeRate
     */
    public void setFeeRate(String feeRate) {
        this.feeRate = feeRate;
    }
}