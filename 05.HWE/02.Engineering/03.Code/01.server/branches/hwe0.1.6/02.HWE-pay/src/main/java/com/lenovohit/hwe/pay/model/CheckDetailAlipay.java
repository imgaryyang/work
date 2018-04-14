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
 * PAY_CHECK_DETAIL_ALIPAY
 * 
 * @author zyus
 * @version 1.0.0 2017-12-22
 */
@Entity
@Table(name = "PAY_CHECK_DETAIL_ALIPAY")
public class CheckDetailAlipay extends AuditableModel implements java.io.Serializable {
    /** 版本号 */
    private static final long serialVersionUID = 4941470140865636976L;

    /** recordId */
    private String recordId;

    /** outTradeNo */
    private String outTradeNo;

    /** tradeNo */
    private String tradeNo;

    /** tradeType */
    private String tradeType;

    /** subject */
    private String subject;

    /** createTime */
    private String createTime;

    /** finishTime */
    private String finishTime;

    /** storeId */
    private String storeId;

    /** storeName */
    private String storeName;

    /** operatorId */
    private String operatorId;

    /** terminalId */
    private String terminalId;

    /** sellerId */
    private String sellerId;

    /** amt */
    private BigDecimal amt;

    /** clearAmt */
    private BigDecimal clearAmt;

    /** couponAmt */
    private BigDecimal couponAmt;

    /** pointAmt */
    private BigDecimal pointAmt;

    /** discountAmt */
    private BigDecimal discountAmt;

    /** mDiscountAmt */
    private BigDecimal mDiscountAmt;

    /** ticketAmt */
    private BigDecimal ticketAmt;

    /** ticketName */
    private String ticketName;

    /** mCouponAmt */
    private BigDecimal mCouponAmt;

    /** cardAmt */
    private BigDecimal cardAmt;

    /** requestNo */
    private String requestNo;

    /** serviceAmt */
    private BigDecimal serviceAmt;

    /** commission */
    private BigDecimal commission;

    /** memo */
    private String memo;

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
     * 获取outTradeNo
     * 
     * @return outTradeNo
     */
    @Column(name = "OUT_TRADE_NO", nullable = true, length = 64)
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
     * 获取tradeNo
     * 
     * @return tradeNo
     */
    @Column(name = "TRADE_NO", nullable = true, length = 64)
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
     * 获取subject
     * 
     * @return subject
     */
    @Column(name = "SUBJECT", nullable = true, length = 256)
    public String getSubject() {
        return this.subject;
    }

    /**
     * 设置subject
     * 
     * @param subject
     */
    public void setSubject(String subject) {
        this.subject = subject;
    }

    /**
     * 获取createTime
     * 
     * @return createTime
     */
    @Column(name = "CREATE_TIME", nullable = true, length = 20)
    public String getCreateTime() {
        return this.createTime;
    }

    /**
     * 设置createTime
     * 
     * @param createTime
     */
    public void setCreateTime(String createTime) {
        this.createTime = createTime;
    }

    /**
     * 获取finishTime
     * 
     * @return finishTime
     */
    @Column(name = "FINISH_TIME", nullable = true, length = 20)
    public String getFinishTime() {
        return this.finishTime;
    }

    /**
     * 设置finishTime
     * 
     * @param finishTime
     */
    public void setFinishTime(String finishTime) {
        this.finishTime = finishTime;
    }

    /**
     * 获取storeId
     * 
     * @return storeId
     */
    @Column(name = "STORE_ID", nullable = true, length = 32)
    public String getStoreId() {
        return this.storeId;
    }

    /**
     * 设置storeId
     * 
     * @param storeId
     */
    public void setStoreId(String storeId) {
        this.storeId = storeId;
    }

    /**
     * 获取storeName
     * 
     * @return storeName
     */
    @Column(name = "STORE_NAME", nullable = true, length = 128)
    public String getStoreName() {
        return this.storeName;
    }

    /**
     * 设置storeName
     * 
     * @param storeName
     */
    public void setStoreName(String storeName) {
        this.storeName = storeName;
    }

    /**
     * 获取operatorId
     * 
     * @return operatorId
     */
    @Column(name = "OPERATOR_ID", nullable = true, length = 32)
    public String getOperatorId() {
        return this.operatorId;
    }

    /**
     * 设置operatorId
     * 
     * @param operatorId
     */
    public void setOperatorId(String operatorId) {
        this.operatorId = operatorId;
    }

    /**
     * 获取terminalId
     * 
     * @return terminalId
     */
    @Column(name = "TERMINAL_ID", nullable = true, length = 32)
    public String getTerminalId() {
        return this.terminalId;
    }

    /**
     * 设置terminalId
     * 
     * @param terminalId
     */
    public void setTerminalId(String terminalId) {
        this.terminalId = terminalId;
    }

    /**
     * 获取sellerId
     * 
     * @return sellerId
     */
    @Column(name = "SELLER_ID", nullable = true, length = 50)
    public String getSellerId() {
        return this.sellerId;
    }

    /**
     * 设置sellerId
     * 
     * @param sellerId
     */
    public void setSellerId(String sellerId) {
        this.sellerId = sellerId;
    }

    /**
     * 获取amt
     * 
     * @return amt
     */
    @Column(name = "AMT", nullable = true)
    public BigDecimal getAmt() {
        return this.amt;
    }

    /**
     * 设置amt
     * 
     * @param amt
     */
    public void setAmt(BigDecimal amt) {
        this.amt = amt;
    }

    /**
     * 获取clearAmt
     * 
     * @return clearAmt
     */
    @Column(name = "CLEAR_AMT", nullable = true)
    public BigDecimal getClearAmt() {
        return this.clearAmt;
    }

    /**
     * 设置clearAmt
     * 
     * @param clearAmt
     */
    public void setClearAmt(BigDecimal clearAmt) {
        this.clearAmt = clearAmt;
    }

    /**
     * 获取couponAmt
     * 
     * @return couponAmt
     */
    @Column(name = "COUPON_AMT", nullable = true)
    public BigDecimal getCouponAmt() {
        return this.couponAmt;
    }

    /**
     * 设置couponAmt
     * 
     * @param couponAmt
     */
    public void setCouponAmt(BigDecimal couponAmt) {
        this.couponAmt = couponAmt;
    }

    /**
     * 获取pointAmt
     * 
     * @return pointAmt
     */
    @Column(name = "POINT_AMT", nullable = true)
    public BigDecimal getPointAmt() {
        return this.pointAmt;
    }

    /**
     * 设置pointAmt
     * 
     * @param pointAmt
     */
    public void setPointAmt(BigDecimal pointAmt) {
        this.pointAmt = pointAmt;
    }

    /**
     * 获取discountAmt
     * 
     * @return discountAmt
     */
    @Column(name = "DISCOUNT_AMT", nullable = true)
    public BigDecimal getDiscountAmt() {
        return this.discountAmt;
    }

    /**
     * 设置discountAmt
     * 
     * @param discountAmt
     */
    public void setDiscountAmt(BigDecimal discountAmt) {
        this.discountAmt = discountAmt;
    }

    /**
     * 获取mDiscountAmt
     * 
     * @return mDiscountAmt
     */
    @Column(name = "M_DISCOUNT_AMT", nullable = true)
    public BigDecimal getMDiscountAmt() {
        return this.mDiscountAmt;
    }

    /**
     * 设置mDiscountAmt
     * 
     * @param mDiscountAmt
     */
    public void setMDiscountAmt(BigDecimal mDiscountAmt) {
        this.mDiscountAmt = mDiscountAmt;
    }

    /**
     * 获取ticketAmt
     * 
     * @return ticketAmt
     */
    @Column(name = "TICKET_AMT", nullable = true)
    public BigDecimal getTicketAmt() {
        return this.ticketAmt;
    }

    /**
     * 设置ticketAmt
     * 
     * @param ticketAmt
     */
    public void setTicketAmt(BigDecimal ticketAmt) {
        this.ticketAmt = ticketAmt;
    }

    /**
     * 获取ticketName
     * 
     * @return ticketName
     */
    @Column(name = "TICKET_NAME", nullable = true, length = 128)
    public String getTicketName() {
        return this.ticketName;
    }

    /**
     * 设置ticketName
     * 
     * @param ticketName
     */
    public void setTicketName(String ticketName) {
        this.ticketName = ticketName;
    }

    /**
     * 获取mCouponAmt
     * 
     * @return mCouponAmt
     */
    @Column(name = "M_COUPON_AMT", nullable = true)
    public BigDecimal getMCouponAmt() {
        return this.mCouponAmt;
    }

    /**
     * 设置mCouponAmt
     * 
     * @param mCouponAmt
     */
    public void setMCouponAmt(BigDecimal mCouponAmt) {
        this.mCouponAmt = mCouponAmt;
    }

    /**
     * 获取cardAmt
     * 
     * @return cardAmt
     */
    @Column(name = "CARD_AMT", nullable = true)
    public BigDecimal getCardAmt() {
        return this.cardAmt;
    }

    /**
     * 设置cardAmt
     * 
     * @param cardAmt
     */
    public void setCardAmt(BigDecimal cardAmt) {
        this.cardAmt = cardAmt;
    }

    /**
     * 获取requestNo
     * 
     * @return requestNo
     */
    @Column(name = "REQUEST_NO", nullable = true, length = 64)
    public String getRequestNo() {
        return this.requestNo;
    }

    /**
     * 设置requestNo
     * 
     * @param requestNo
     */
    public void setRequestNo(String requestNo) {
        this.requestNo = requestNo;
    }

    /**
     * 获取serviceAmt
     * 
     * @return serviceAmt
     */
    @Column(name = "SERVICE_AMT", nullable = true)
    public BigDecimal getServiceAmt() {
        return this.serviceAmt;
    }

    /**
     * 设置serviceAmt
     * 
     * @param serviceAmt
     */
    public void setServiceAmt(BigDecimal serviceAmt) {
        this.serviceAmt = serviceAmt;
    }

    /**
     * 获取commission
     * 
     * @return commission
     */
    @Column(name = "COMMISSION", nullable = true)
    public BigDecimal getCommission() {
        return this.commission;
    }

    /**
     * 设置commission
     * 
     * @param commission
     */
    public void setCommission(BigDecimal commission) {
        this.commission = commission;
    }

    /**
     * 获取memo
     * 
     * @return memo
     */
    @Column(name = "MEMO", nullable = true, length = 256)
    public String getMemo() {
        return this.memo;
    }

    /**
     * 设置memo
     * 
     * @param memo
     */
    public void setMemo(String memo) {
        this.memo = memo;
    }
}