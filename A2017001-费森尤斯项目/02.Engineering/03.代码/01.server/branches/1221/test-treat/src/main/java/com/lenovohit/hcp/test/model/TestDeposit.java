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

package com.lenovohit.hcp.test.model;

import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import com.lenovohit.core.model.BaseIdModel;

/**
 * TREAT_DEPOSIT
 * 
 * @author zyus
 * @version 1.0.0 2017-12-16
 */
@Entity
@Table(name = "TEST_TREAT_DEPOSIT")
public class TestDeposit extends BaseIdModel implements java.io.Serializable {
    /** 版本号 */
    private static final long serialVersionUID = 2752604019696410424L;

    /** proId */
    private String proId;  

    /** proNo */
    private String proNo;

    /** proName */
    private String proName;

    /** cardId */
    private String cardId;

    /** cardNo */
    private String cardNo;

    /** tradeType */
    private String tradeType;

    /** tradeTime */
    private Date tradeTime;   // 交易时间

    /** tradeNo */
    private String tradeNo;   // 交易流水号

    /** outTradeNo */
    private String outTradeNo;   // 外部流水号

    /** amt */
    private BigDecimal amt; 	// 金额

    /** balance */
    private BigDecimal balance;

    /** userId */
    private String userId;

    /** account */
    private String account;

    /** accountName */
    private String accountName;

    /** appChannel */
    private String appChannel;

    /** appId */
    private String appId;

    /** C-现金
            Z-支付宝
            W-微信
            B-银行
            … */
    private String tradeChannel;

    /** adFlag */
    private String adFlag;

    /** operator */
    private String operator;

    /** status */
    private String status;

    /**
     * 获取proId
     * 
     * @return proId
     */
    @Column(name = "PRO_ID", nullable = true, length = 32)
    public String getProId() {
        return this.proId;
    }

    /**
     * 设置proId
     * 
     * @param proId
     */
    public void setProId(String proId) {
        this.proId = proId;
    }

    /**
     * 获取proNo
     * 
     * @return proNo
     */
    @Column(name = "PRO_NO", nullable = true, length = 50)
    public String getProNo() {
        return this.proNo;
    }

    /**
     * 设置proNo
     * 
     * @param proNo
     */
    public void setProNo(String proNo) {
        this.proNo = proNo;
    }

    /**
     * 获取proName
     * 
     * @return proName
     */
    @Column(name = "PRO_NAME", nullable = true, length = 70)
    public String getProName() {
        return this.proName;
    }

    /**
     * 设置proName
     * 
     * @param proName
     */
    public void setProName(String proName) {
        this.proName = proName;
    }

    /**
     * 获取cardId
     * 
     * @return cardId
     */
    @Column(name = "CARD_ID", nullable = true, length = 32)
    public String getCardId() {
        return this.cardId;
    }

    /**
     * 设置cardId
     * 
     * @param cardId
     */
    public void setCardId(String cardId) {
        this.cardId = cardId;
    }

    /**
     * 获取cardNo
     * 
     * @return cardNo
     */
    @Column(name = "CARD_NO", nullable = true, length = 50)
    public String getCardNo() {
        return this.cardNo;
    }

    /**
     * 设置cardNo
     * 
     * @param cardNo
     */
    public void setCardNo(String cardNo) {
        this.cardNo = cardNo;
    }

    /**
     * 获取tradeType
     * 
     * @return tradeType
     */
    @Column(name = "TRADE_TYPE", nullable = true, length = 1)
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
     * 获取tradeTime
     * 
     * @return tradeTime
     */
    @Column(name = "TRADE_TIME", nullable = true)
    public Date getTradeTime() {
        return this.tradeTime;
    }

    /**
     * 设置tradeTime
     * 
     * @param tradeTime
     */
    public void setTradeTime(Date tradeTime) {
        this.tradeTime = tradeTime;
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
     * 获取balance
     * 
     * @return balance
     */
    @Column(name = "BALANCE", nullable = true)
    public BigDecimal getBalance() {
        return this.balance;
    }

    /**
     * 设置balance
     * 
     * @param balance
     */
    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }

    /**
     * 获取userId
     * 
     * @return userId
     */
    @Column(name = "USER_ID", nullable = true, length = 50)
    public String getUserId() {
        return this.userId;
    }

    /**
     * 设置userId
     * 
     * @param userId
     */
    public void setUserId(String userId) {
        this.userId = userId;
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
     * 获取accountName
     * 
     * @return accountName
     */
    @Column(name = "ACCOUNT_NAME", nullable = true, length = 70)
    public String getAccountName() {
        return this.accountName;
    }

    /**
     * 设置accountName
     * 
     * @param accountName
     */
    public void setAccountName(String accountName) {
        this.accountName = accountName;
    }

    /**
     * 获取appChannel
     * 
     * @return appChannel
     */
    @Column(name = "APP_CHANNEL", nullable = true, length = 1)
    public String getAppChannel() {
        return this.appChannel;
    }

    /**
     * 设置appChannel
     * 
     * @param appChannel
     */
    public void setAppChannel(String appChannel) {
        this.appChannel = appChannel;
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
     * 获取C-现金
            Z-支付宝
            W-微信
            B-银行
            …
     * 
     * @return C-现金
            Z-支付宝
            W-微信
            B-银行
            …
     */
    @Column(name = "TRADE_CHANNEL", nullable = true, length = 1)
    public String getTradeChannel() {
        return this.tradeChannel;
    }

    /**
     * 设置C-现金
            Z-支付宝
            W-微信
            B-银行
            …
     * 
     * @param tradeChannel
     *          C-现金
            Z-支付宝
            W-微信
            B-银行
            …
     */
    public void setTradeChannel(String tradeChannel) {
        this.tradeChannel = tradeChannel;
    }

    /**
     * 获取adFlag
     * 
     * @return adFlag
     */
    @Column(name = "AD_FLAG", nullable = true, length = 1)
    public String getAdFlag() {
        return this.adFlag;
    }

    /**
     * 设置adFlag
     * 
     * @param adFlag
     */
    public void setAdFlag(String adFlag) {
        this.adFlag = adFlag;
    }

    /**
     * 获取operator
     * 
     * @return operator
     */
    @Column(name = "OPERATOR", nullable = true, length = 50)
    public String getOperator() {
        return this.operator;
    }

    /**
     * 设置operator
     * 
     * @param operator
     */
    public void setOperator(String operator) {
        this.operator = operator;
    }

    /**
     * 获取status
     * 
     * @return status
     */
    @Column(name = "STATUS", nullable = true, length = 1)
    public String getStatus() {
        return this.status;
    }

    /**
     * 设置status
     * 
     * @param status
     */
    public void setStatus(String status) {
        this.status = status;
    }
}