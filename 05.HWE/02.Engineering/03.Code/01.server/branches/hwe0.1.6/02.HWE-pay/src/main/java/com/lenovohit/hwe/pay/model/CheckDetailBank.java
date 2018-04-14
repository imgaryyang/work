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
 * PAY_CHECK_DETAIL_BANK
 * 
 * @author zyus
 * @version 1.0.0 2017-12-22
 */
@Entity
@Table(name = "PAY_CHECK_DETAIL_BANK")
public class CheckDetailBank extends AuditableModel implements java.io.Serializable {
    /** 版本号 */
    private static final long serialVersionUID = -960049938554934638L;

    /** recordId */
    private String recordId;

    /** merchanet */
    private String merchanet;

    /** terminal */
    private String terminal;

    /** batchNo */
    private String batchNo;

    /** account */
    private String account;

    /** amt */
    private BigDecimal amt;

    /** clearAmt */
    private BigDecimal clearAmt;

    /** cardType */
    private String cardType;

    /** cardBankCode */
    private String cardBankCode;

    /** outTradeNo */
    private String outTradeNo;

    /** tradeType */
    private String tradeType;

    /** tradeNo */
    private String tradeNo;

    /** tradeDate */
    private String tradeDate;

    /** tradeTime */
    private String tradeTime;

    /** clearDate */
    private String clearDate;

    /** tradeStatus */
    private String tradeStatus;

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
     * 获取merchanet
     * 
     * @return merchanet
     */
    @Column(name = "MERCHANET", nullable = true, length = 50)
    public String getMerchanet() {
        return this.merchanet;
    }

    /**
     * 设置merchanet
     * 
     * @param merchanet
     */
    public void setMerchanet(String merchanet) {
        this.merchanet = merchanet;
    }

    /**
     * 获取terminal
     * 
     * @return terminal
     */
    @Column(name = "TERMINAL", nullable = true, length = 50)
    public String getTerminal() {
        return this.terminal;
    }

    /**
     * 设置terminal
     * 
     * @param terminal
     */
    public void setTerminal(String terminal) {
        this.terminal = terminal;
    }

    /**
     * 获取batchNo
     * 
     * @return batchNo
     */
    @Column(name = "BATCH_NO", nullable = true, length = 20)
    public String getBatchNo() {
        return this.batchNo;
    }

    /**
     * 设置batchNo
     * 
     * @param batchNo
     */
    public void setBatchNo(String batchNo) {
        this.batchNo = batchNo;
    }

    /**
     * 获取account
     * 
     * @return account
     */
    @Column(name = "ACCOUNT", nullable = true, length = 32)
    public String getAccount() {
        return this.account;
    }

    /**
     * 设置account
     * 
     * @param account
     */
    public void setAccount(String account) {
        this.account = account;
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
     * 获取cardType
     * 
     * @return cardType
     */
    @Column(name = "CARD_TYPE", nullable = true, length = 20)
    public String getCardType() {
        return this.cardType;
    }

    /**
     * 设置cardType
     * 
     * @param cardType
     */
    public void setCardType(String cardType) {
        this.cardType = cardType;
    }

    /**
     * 获取cardBankCode
     * 
     * @return cardBankCode
     */
    @Column(name = "CARD_BANK_CODE", nullable = true, length = 20)
    public String getCardBankCode() {
        return this.cardBankCode;
    }

    /**
     * 设置cardBankCode
     * 
     * @param cardBankCode
     */
    public void setCardBankCode(String cardBankCode) {
        this.cardBankCode = cardBankCode;
    }

    /**
     * 获取outTradeNo
     * 
     * @return outTradeNo
     */
    @Column(name = "OUT_TRADE_NO", nullable = true, length = 50)
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
     * 获取tradeNo
     * 
     * @return tradeNo
     */
    @Column(name = "TRADE_NO", nullable = true, length = 50)
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
     * 获取tradeDate
     * 
     * @return tradeDate
     */
    @Column(name = "TRADE_DATE", nullable = true, length = 20)
    public String getTradeDate() {
        return this.tradeDate;
    }

    /**
     * 设置tradeDate
     * 
     * @param tradeDate
     */
    public void setTradeDate(String tradeDate) {
        this.tradeDate = tradeDate;
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
     * 获取clearDate
     * 
     * @return clearDate
     */
    @Column(name = "CLEAR_DATE", nullable = true, length = 20)
    public String getClearDate() {
        return this.clearDate;
    }

    /**
     * 设置clearDate
     * 
     * @param clearDate
     */
    public void setClearDate(String clearDate) {
        this.clearDate = clearDate;
    }

    /**
     * 获取tradeStatus
     * 
     * @return tradeStatus
     */
    @Column(name = "TRADE_STATUS", nullable = true, length = 1)
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
     * 获取memo
     * 
     * @return memo
     */
    @Column(name = "MEMO", nullable = true, length = 200)
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