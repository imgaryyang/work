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
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import com.lenovohit.hwe.base.model.AuditableModel;

/**
 * PAY_CHECK_DETAIL_RESULT
 * 
 * @author zyus
 * @version 1.0.0 2017-12-22
 */
@Entity
@Table(name = "PAY_CHECK_DETAIL_RESULT")
public class CheckDetailResult extends AuditableModel implements java.io.Serializable {
    /** 版本号 */
    private static final long serialVersionUID = -7701159310700111400L;
    public static final String THRID_CHECK_STATUS_INITIAL = "A";
	public static final String THRID_CHECK_STATUS_SUCCESS = "0";
	public static final String THRID_CHECK_STATUS_FAILURE = "1";
	public static final String THRID_CHECK_STATUS_MNY_MORE = "2";
	public static final String THRID_CHECK_STATUS_MNY_LESS = "3";
	public static final String THRID_CHECK_STATUS_THRID_NOTRADE = "4";
	public static final String THRID_CHECK_STATUS_PCL_NOTRADE = "5";
	public static final String HWP_CHECK_STATUS_INITIAL = "A";
	public static final String HWP_CHECK_STATUS_SUCCESS = "0";
	public static final String HWP_CHECK_STATUS_FAILURE = "1";
	public static final String HWP_CHECK_STATUS_MNY_MORE = "2";
	public static final String HWP_CHECK_STATUS_MNY_LESS = "3";
	public static final String HWP_CHECK_STATUS_HWP_NOTRADE = "4";
	public static final String HWP_CHECK_STATUS_PCL_NOTRADE = "5";
	public static final String CHECK_TYPE_AUTO = "0";	
	public static final String CHECK_TYPE_HAND= "1";	
	public static final String DEAL_TYPE_AUTO = "0";	
	public static final String DEAL_TYPE_HAND = "1";	
    /** recordId */
    private String recordId;

    /** merchanet */
    private String merchanet;

    /** terminal */
    private String terminal;

    /** batchNo */
    private String batchNo;

    /** amt */
    private BigDecimal amt;

    /** clearAmt */
    private BigDecimal clearAmt;

    /** account */
    private String account;

    /** cardType */
    private String cardType;

    /** cardBankCode */
    private String cardBankCode;

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

    /** hwpNo */
    private String hwpNo;

    /** hwptime */
    private Date hwpTime;

    /** hwpAmt */
    private BigDecimal hwpAmt;

    /** hwpCode */
    private String hwpCode;

    /** hwpCheckTime */
    private Date hwpCheckTime;

    /** hwpCheckType */
    private String hwpCheckType;

    /** hwpCheckStatus */
    private String hwpCheckStatus;

    /** hwpDealStatus */
    private String hwpDealStatus;

    /** hwpDealTime */
    private Date hwpDealTime;

    /** hwpDealOpt */
    private String hwpDealOpt;

    /** hwpDealType */
    private String hwpDealType;

    /** thridNo */
    private String thridNo;

    /** thridTime */
    private Date thridTime;

    /** thridAmt */
    private BigDecimal thridAmt;

    /** thridCode */
    private String thridCode;

    /** thridCheckTime */
    private Date thridCheckTime;

    /** thridCheckType */
    private String thridCheckType;

    /** thridCheckStatus */
    private String thridCheckStatus;

    /** thridDealStatus */
    private String thridDealStatus;

    /** thridDealTime */
    private Date thridDealTime;

    /** thridDealOpt */
    private String thridDealOpt;

    /** thridDealType */
    private String thridDealType;

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
     * 获取account
     * 
     * @return account
     */
    @Column(name = "ACCOUNT", nullable = true, length = 50)
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
     * 获取tradeType
     * 
     * @return tradeType
     */
    @Column(name = "TRADE_TYPE", nullable = true, length = 2)
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
    @Column(name = "TRADE_DATE", nullable = true, length = 10)
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
    @Column(name = "TRADE_TIME", nullable = true, length = 8)
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
    @Column(name = "CLEAR_DATE", nullable = true, length = 10)
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
     * 获取hwpNo
     * 
     * @return hwpNo
     */
    @Column(name = "HWP_NO", nullable = true, length = 32)
    public String getHwpNo() {
        return this.hwpNo;
    }

    /**
     * 设置hwpNo
     * 
     * @param hwpNo
     */
    public void setHwpNo(String hwpNo) {
        this.hwpNo = hwpNo;
    }

    /**
     * 获取hwptime
     * 
     * @return hwptime
     */
    @Column(name = "HWP_TIME", nullable = true)
    public Date getHwpTime() {
        return this.hwpTime;
    }

    /**
     * 设置hwptime
     * 
     * @param hwptime
     */
    public void setHwpTime(Date hwpTime) {
        this.hwpTime = hwpTime;
    }

    /**
     * 获取hwpAmt
     * 
     * @return hwpAmt
     */
    @Column(name = "HWP_AMT", nullable = true)
    public BigDecimal getHwpAmt() {
        return this.hwpAmt;
    }

    /**
     * 设置hwpAmt
     * 
     * @param hwpAmt
     */
    public void setHwpAmt(BigDecimal hwpAmt) {
        this.hwpAmt = hwpAmt;
    }

    /**
     * 获取hwpCode
     * 
     * @return hwpCode
     */
    @Column(name = "HWP_CODE", nullable = true, length = 50)
    public String getHwpCode() {
        return this.hwpCode;
    }

    /**
     * 设置hwpCode
     * 
     * @param hwpCode
     */
    public void setHwpCode(String hwpCode) {
        this.hwpCode = hwpCode;
    }

    /**
     * 获取hwpCheckTime
     * 
     * @return hwpCheckTime
     */
    @Column(name = "HWP_CHECK_TIME", nullable = true)
    public Date getHwpCheckTime() {
        return this.hwpCheckTime;
    }

    /**
     * 设置hwpCheckTime
     * 
     * @param hwpCheckTime
     */
    public void setHwpCheckTime(Date hwpCheckTime) {
        this.hwpCheckTime = hwpCheckTime;
    }

    /**
     * 获取hwpCheckType
     * 
     * @return hwpCheckType
     */
    @Column(name = "HWP_CHECK_TYPE", nullable = true, length = 1)
    public String getHwpCheckType() {
        return this.hwpCheckType;
    }

    /**
     * 设置hwpCheckType
     * 
     * @param hwpCheckType
     */
    public void setHwpCheckType(String hwpCheckType) {
        this.hwpCheckType = hwpCheckType;
    }

    /**
     * 获取hwpCheckStatus
     * 
     * @return hwpCheckStatus
     */
    @Column(name = "HWP_CHECK_STATUS", nullable = true, length = 1)
    public String getHwpCheckStatus() {
        return this.hwpCheckStatus;
    }

    /**
     * 设置hwpCheckStatus
     * 
     * @param hwpCheckStatus
     */
    public void setHwpCheckStatus(String hwpCheckStatus) {
        this.hwpCheckStatus = hwpCheckStatus;
    }

    /**
     * 获取hwpDealStatus
     * 
     * @return hwpDealStatus
     */
    @Column(name = "HWP_DEAL_STATUS", nullable = true, length = 1)
    public String getHwpDealStatus() {
        return this.hwpDealStatus;
    }

    /**
     * 设置hwpDealStatus
     * 
     * @param hwpDealStatus
     */
    public void setHwpDealStatus(String hwpDealStatus) {
        this.hwpDealStatus = hwpDealStatus;
    }

    /**
     * 获取hwpDealTime
     * 
     * @return hwpDealTime
     */
    @Column(name = "HWP_DEAL_TIME", nullable = true)
    public Date getHwpDealTime() {
        return this.hwpDealTime;
    }

    /**
     * 设置hwpDealTime
     * 
     * @param hwpDealTime
     */
    public void setHwpDealTime(Date hwpDealTime) {
        this.hwpDealTime = hwpDealTime;
    }

    /**
     * 获取hwpDealOpt
     * 
     * @return hwpDealOpt
     */
    @Column(name = "HWP_DEAL_OPT", nullable = true, length = 200)
    public String getHwpDealOpt() {
        return this.hwpDealOpt;
    }

    /**
     * 设置hwpDealOpt
     * 
     * @param hwpDealOpt
     */
    public void setHwpDealOpt(String hwpDealOpt) {
        this.hwpDealOpt = hwpDealOpt;
    }

    /**
     * 获取hwpDealType
     * 
     * @return hwpDealType
     */
    @Column(name = "HWP_DEAL_TYPE", nullable = true, length = 1)
    public String getHwpDealType() {
        return this.hwpDealType;
    }

    /**
     * 设置hwpDealType
     * 
     * @param hwpDealType
     */
    public void setHwpDealType(String hwpDealType) {
        this.hwpDealType = hwpDealType;
    }

    /**
     * 获取thridNo
     * 
     * @return thridNo
     */
    @Column(name = "THRID_NO", nullable = true, length = 32)
    public String getThridNo() {
        return this.thridNo;
    }

    /**
     * 设置thridNo
     * 
     * @param thridNo
     */
    public void setThridNo(String thridNo) {
        this.thridNo = thridNo;
    }

    /**
     * 获取thridTime
     * 
     * @return thridTime
     */
    @Column(name = "THRID_TIME", nullable = true)
    public Date getThridTime() {
        return this.thridTime;
    }

    /**
     * 设置thridTime
     * 
     * @param thridTime
     */
    public void setThridTime(Date thridTime) {
        this.thridTime = thridTime;
    }

    /**
     * 获取thridAmt
     * 
     * @return thridAmt
     */
    @Column(name = "THRID_AMT", nullable = true)
    public BigDecimal getThridAmt() {
        return this.thridAmt;
    }

    /**
     * 设置thridAmt
     * 
     * @param thridAmt
     */
    public void setThridAmt(BigDecimal thridAmt) {
        this.thridAmt = thridAmt;
    }

    /**
     * 获取thridCode
     * 
     * @return thridCode
     */
    @Column(name = "THRID_CODE", nullable = true, length = 50)
    public String getThridCode() {
        return this.thridCode;
    }

    /**
     * 设置thridCode
     * 
     * @param thridCode
     */
    public void setThridCode(String thridCode) {
        this.thridCode = thridCode;
    }

    /**
     * 获取thridCheckTime
     * 
     * @return thridCheckTime
     */
    @Column(name = "THRID_CHECK_TIME", nullable = true)
    public Date getThridCheckTime() {
        return this.thridCheckTime;
    }

    /**
     * 设置thridCheckTime
     * 
     * @param thridCheckTime
     */
    public void setThridCheckTime(Date thridCheckTime) {
        this.thridCheckTime = thridCheckTime;
    }

    /**
     * 获取thridCheckType
     * 
     * @return thridCheckType
     */
    @Column(name = "THRID_CHECK_TYPE", nullable = true, length = 1)
    public String getThridCheckType() {
        return this.thridCheckType;
    }

    /**
     * 设置thridCheckType
     * 
     * @param thridCheckType
     */
    public void setThridCheckType(String thridCheckType) {
        this.thridCheckType = thridCheckType;
    }

    /**
     * 获取thridCheckStatus
     * 
     * @return thridCheckStatus
     */
    @Column(name = "THRID_CHECK_STATUS", nullable = true, length = 1)
    public String getThridCheckStatus() {
        return this.thridCheckStatus;
    }

    /**
     * 设置thridCheckStatus
     * 
     * @param thridCheckStatus
     */
    public void setThridCheckStatus(String thridCheckStatus) {
        this.thridCheckStatus = thridCheckStatus;
    }

    /**
     * 获取thridDealStatus
     * 
     * @return thridDealStatus
     */
    @Column(name = "THRID_DEAL_STATUS", nullable = true, length = 1)
    public String getThridDealStatus() {
        return this.thridDealStatus;
    }

    /**
     * 设置thridDealStatus
     * 
     * @param thridDealStatus
     */
    public void setThridDealStatus(String thridDealStatus) {
        this.thridDealStatus = thridDealStatus;
    }

    /**
     * 获取thridDealTime
     * 
     * @return thridDealTime
     */
    @Column(name = "THRID_DEAL_TIME", nullable = true)
    public Date getThridDealTime() {
        return this.thridDealTime;
    }

    /**
     * 设置thridDealTime
     * 
     * @param thridDealTime
     */
    public void setThridDealTime(Date thridDealTime) {
        this.thridDealTime = thridDealTime;
    }

    /**
     * 获取thridDealOpt
     * 
     * @return thridDealOpt
     */
    @Column(name = "THRID_DEAL_OPT", nullable = true, length = 200)
    public String getThridDealOpt() {
        return this.thridDealOpt;
    }

    /**
     * 设置thridDealOpt
     * 
     * @param thridDealOpt
     */
    public void setThridDealOpt(String thridDealOpt) {
        this.thridDealOpt = thridDealOpt;
    }

    /**
     * 获取thridDealType
     * 
     * @return thridDealType
     */
    @Column(name = "THRID_DEAL_TYPE", nullable = true, length = 1)
    public String getThridDealType() {
        return this.thridDealType;
    }

    /**
     * 设置thridDealType
     * 
     * @param thridDealType
     */
    public void setThridDealType(String thridDealType) {
        this.thridDealType = thridDealType;
    }
}