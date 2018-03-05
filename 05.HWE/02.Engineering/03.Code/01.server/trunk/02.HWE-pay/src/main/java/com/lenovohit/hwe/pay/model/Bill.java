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

import com.lenovohit.hwe.base.annotation.RedisSequence;
import com.lenovohit.hwe.base.model.AuditableModel;

/**
 * PAY_BILL
 * 
 * @author zyus
 * @version 1.0.0 2018-01-11
 */
@Entity
@Table(name = "PAY_BILL")
public class Bill extends AuditableModel implements java.io.Serializable {
    /** 版本号 */
    private static final long serialVersionUID = -7103069329048241273L;

	public static final String BILL_TYPE_PAY = "BP";
	public static final String BILL_TYPE_REFUND = "BR";
	public static final String BILL_TYPE_CANCEL = "BC";

	public static final String BILL_STAT_INITIAL = "A";
	public static final String BILL_STAT_TRAN_SUCCESS = "0";
	public static final String BILL_STAT_PAY_SUCCESS = "1";
	public static final String BILL_STAT_PAY_FAILURE = "2";
	public static final String BILL_STAT_TRAN_FAILURE = "3";
	public static final String BILL_STAT_PAY_PARTIAL = "4";
	public static final String BILL_STAT_REFUNDING = "5";
	public static final String BILL_STAT_REFUND_FAILURE = "6";
	public static final String BILL_STAT_REFUND_SUCCESS = "7";
	public static final String BILL_STAT_REFUND_CANCELED = "8";
	public static final String BILL_STAT_CLOSED = "9";
	public static final String BILL_STAT_EXCEPTIONAL = "E";// 异常  
	public static final String BILL_STAT_CANCEL = "C";// 撤销
	public static final String BILL_STAT_REVERSE = "R";// 冲账
	
    /** billNo */
    private String billNo;

    /** BP - 支付
        BR - 退款
        BC - 撤销 */
    private String billType;

    /** billTitle */
    private String billTitle;

    /** billDesc */
    private String billDesc;

    /** amt 
     * 总额
     * */
    private BigDecimal amt = new BigDecimal(0.0);

    /** realAmt 
     * 实际付款 
     * */
    private BigDecimal realAmt = new BigDecimal(0.0);

    /** lastAmt */
    private BigDecimal lastAmt = new BigDecimal(0.0);

    /** paAmt */
    private BigDecimal paAmt = new BigDecimal(0.0);

    /** miAmt */
    private BigDecimal miAmt = new BigDecimal(0.0);

    /** selfAmt */
    private BigDecimal selfAmt = new BigDecimal(0.0);

    /** reduceAmt */
    private BigDecimal reduceAmt = new BigDecimal(0.0);

    /** appCode */
    private String appCode;

    /** appName */
    private String appName;

    /** appType */
    private String appType;

    /** terminalCode */
    private String terminalCode;

    /** terminalName */
    private String terminalName;

    /** terminalUser */
    private String terminalUser;

    /** payChannelId */
    private String payChannelId;

    /** payChannelCode */
    private String payChannelCode;

    /** payChannelName */
    private String payChannelName;

    /** payMerchantId */
    private String payMerchantId;

    /** payMerchantNo */
    private String payMerchantNo;

    /** payMerchantName */
    private String payMerchantName;

    /** payTypeId */
    private String payTypeId;

    /** payTypeCode */
    private String payTypeCode;

    /** payTypeName */
    private String payTypeName;

    /** payerNo */
    private String payerNo;

    /** payerName */
    private String payerName;

    /** payerAccount */
    private String payerAccount;

    /** payerAcctType */
    private String payerAcctType;

    /** payerAcctBank */
    private String payerAcctBank;

    /** payerPhone */
    private String payerPhone;

    /** payerLogin */
    private String payerLogin;

    /** 00:门诊预存
        01:预约
        02:挂号
        03:门诊缴费
        04:住院预缴
        05:发卡
        06:建档 */
    private String bizType;

    /** bizNo */
    private String bizNo;

    /** bizUrl */
    private String bizUrl;

    /** bizBean */
    private String bizBean;

    /** bizTime */
    private Date bizTime;

    /** tranTime */
    private Date tranTime;

    /** finishTime */
    private Date finishTime;

    /** outTime */
    private String outTime;

    /** oriBillId */
    private String oriBillId;

    /** oriAmt */
    private BigDecimal oriAmt;

    /** optStatus */
    private String optStatus;

    /** optTime */
    private Date optTime;

    /** optId */
    private String optId;

    /** optName */
    private String optName;

    /** operation */
    private String operation;

    /** INITIAL = "A"	
        TRAN_SUCCESS = "0"
        PAY_SUCCESS = "1"
        PAY_FAILURE = "2"
        THIRD_FAILURE = "3"
        TRAN_FINISH = "4"
        REFUNDING = "5"
        FAILURE = "6"
        SUCCESS = "7"
        EXCEPTIONAL = "8"
        CLOSED = "9" */
    private String status;

    /**
     * 获取billNo
     * @return billNo
     */
    @Column(name = "BILL_NO", nullable = true, length = 50)
    @RedisSequence
    public String getBillNo() {
        return this.billNo;
    }

    /**
     * 设置billNo
     * @param billNo
     */
    public void setBillNo(String billNo) {
        this.billNo = billNo;
    }

    /**
     * 获取billType
     * @return billType
     */
    @Column(name = "BILL_TYPE", nullable = true, length = 2)
    public String getBillType() {
        return this.billType;
    }

    /**
     * 设置 billType
     * @param billType
     */
    public void setBillType(String billType) {
        this.billType = billType;
    }

    /**
     * 获取billTitle
     * @return billTitle
     */
    @Column(name = "BILL_TITLE", nullable = true, length = 200)
    public String getBillTitle() {
        return this.billTitle;
    }

    /**
     * 设置billTitle
     * @param billTitle
     */
    public void setBillTitle(String billTitle) {
        this.billTitle = billTitle;
    }

    /**
     * 获取billDesc
     * @return billDesc
     */
    @Column(name = "BILL_DESC", nullable = true, length = 500)
    public String getBillDesc() {
        return this.billDesc;
    }

    /**
     * 设置billDesc
     * @param billDesc
     */
    public void setBillDesc(String billDesc) {
        this.billDesc = billDesc;
    }

    /**
     * 获取amt
     * @return amt
     */
    @Column(name = "AMT", nullable = true)
    public BigDecimal getAmt() {
        return this.amt;
    }

    /**
     * 设置amt
     * @param amt
     */
    public void setAmt(BigDecimal amt) {
        this.amt = amt;
    }

    /**
     * 获取realAmt
     * @return realAmt
     */
    @Column(name = "REAL_AMT", nullable = true)
    public BigDecimal getRealAmt() {
        return this.realAmt;
    }

    /**
     * 设置realAmt
     * @param realAmt
     */
    public void setRealAmt(BigDecimal realAmt) {
        this.realAmt = realAmt;
    }

    /**
     * 获取lastAmt
     * @return lastAmt
     */
    @Column(name = "LAST_AMT", nullable = true)
    public BigDecimal getLastAmt() {
        return this.lastAmt;
    }

    /**
     * 设置lastAmt
     * @param lastAmt
     */
    public void setLastAmt(BigDecimal lastAmt) {
        this.lastAmt = lastAmt;
    }

    /**
     * 获取paAmt
     * @return paAmt
     */
    @Column(name = "PA_AMT", nullable = true)
    public BigDecimal getPaAmt() {
        return this.paAmt;
    }

    /**
     * 设置paAmt
     * @param paAmt
     */
    public void setPaAmt(BigDecimal paAmt) {
        this.paAmt = paAmt;
    }

    /**
     * 获取miAmt
     * @return miAmt
     */
    @Column(name = "MI_AMT", nullable = true)
    public BigDecimal getMiAmt() {
        return this.miAmt;
    }

    /**
     * 设置miAmt
     * @param miAmt
     */
    public void setMiAmt(BigDecimal miAmt) {
        this.miAmt = miAmt;
    }

    /**
     * 获取selfAmt
     * @return selfAmt
     */
    @Column(name = "SELF_AMT", nullable = true)
    public BigDecimal getSelfAmt() {
        return this.selfAmt;
    }

    /**
     * 设置selfAmt
     * @param selfAmt
     */
    public void setSelfAmt(BigDecimal selfAmt) {
        this.selfAmt = selfAmt;
    }

    /**
     * 获取reduceAmt
     * @return reduceAmt
     */
    @Column(name = "REDUCE_AMT", nullable = true)
    public BigDecimal getReduceAmt() {
        return this.reduceAmt;
    }

    /**
     * 设置reduceAmt
     * @param reduceAmt
     */
    public void setReduceAmt(BigDecimal reduceAmt) {
        this.reduceAmt = reduceAmt;
    }

    /**
     * 获取appCode
     * @return appCode
     */
    @Column(name = "APP_CODE", nullable = true, length = 32)
    public String getAppCode() {
        return this.appCode;
    }

    /**
     * 设置appCode
     * @param appCode
     */
    public void setAppCode(String appCode) {
        this.appCode = appCode;
    }

    /**
     * 获取appName
     * @return appName
     */
    @Column(name = "APP_NAME", nullable = true, length = 50)
    public String getAppName() {
        return this.appName;
    }

    /**
     * 设置appName
     * @param appName
     */
    public void setAppName(String appName) {
        this.appName = appName;
    }

    /**
     * 获取appType
     * @return appType
     */
    @Column(name = "APP_TYPE", nullable = true, length = 3)
    public String getAppType() {
        return this.appType;
    }

    /**
     * 设置appType
     * @param appType
     */
    public void setAppType(String appType) {
        this.appType = appType;
    }

    /**
     * 获取terminalCode
     * @return terminalCode
     */
    @Column(name = "TERMINAL_CODE", nullable = true, length = 50)
    public String getTerminalCode() {
        return this.terminalCode;
    }

    /**
     * 设置terminalCode
     * @param terminalCode
     */
    public void setTerminalCode(String terminalCode) {
        this.terminalCode = terminalCode;
    }

    /**
     * 获取terminalName
     * @return terminalName
     */
    @Column(name = "TERMINAL_NAME", nullable = true, length = 70)
    public String getTerminalName() {
        return this.terminalName;
    }

    /**
     * 设置terminalName
     * @param terminalName
     */
    public void setTerminalName(String terminalName) {
        this.terminalName = terminalName;
    }

    /**
     * 获取terminalUser
     * @return terminalUser
     */
    @Column(name = "TERMINAL_USER", nullable = true, length = 50)
    public String getTerminalUser() {
        return this.terminalUser;
    }

    /**
     * 设置terminalUser
     * @param terminalUser
     */
    public void setTerminalUser(String terminalUser) {
        this.terminalUser = terminalUser;
    }

    /**
     * 获取payChannelId
     * @return payChannelId
     */
    @Column(name = "PAY_CHANNEL_ID", nullable = true, length = 32)
    public String getPayChannelId() {
        return this.payChannelId;
    }

    /**
     * 设置payChannelId
     * @param payChannelId
     */
    public void setPayChannelId(String payChannelId) {
        this.payChannelId = payChannelId;
    }

    /**
     * 获取payChannelCode
     * @return payChannelCode
     */
    @Column(name = "PAY_CHANNEL_CODE", nullable = true, length = 20)
    public String getPayChannelCode() {
        return this.payChannelCode;
    }

    /**
     * 设置payChannelCode
     * @param payChannelCode
     */
    public void setPayChannelCode(String payChannelCode) {
        this.payChannelCode = payChannelCode;
    }

    /**
     * 获取payChannelName
     * @return payChannelName
     */
    @Column(name = "PAY_CHANNEL_NAME", nullable = true, length = 50)
    public String getPayChannelName() {
        return this.payChannelName;
    }

    /**
     * 设置payChannelName
     * @param payChannelName
     */
    public void setPayChannelName(String payChannelName) {
        this.payChannelName = payChannelName;
    }

    /**
     * 获取payMerchantId
     * @return payMerchantId
     */
    @Column(name = "PAY_MERCHANT_ID", nullable = true, length = 32)
    public String getPayMerchantId() {
        return this.payMerchantId;
    }

    /**
     * 设置payMerchantId
     * @param payMerchantId
     */
    public void setPayMerchantId(String payMerchantId) {
        this.payMerchantId = payMerchantId;
    }

    /**
     * 获取payMerchantNo
     * @return payMerchantNo
     */
    @Column(name = "PAY_MERCHANT_NO", nullable = true, length = 50)
    public String getPayMerchantNo() {
        return this.payMerchantNo;
    }

    /**
     * 设置payMerchantNo
     * @param payMerchantNo
     */
    public void setPayMerchantNo(String payMerchantNo) {
        this.payMerchantNo = payMerchantNo;
    }

    /**
     * 获取payMerchantName
     * @return payMerchantName
     */
    @Column(name = "PAY_MERCHANT_NAME", nullable = true, length = 50)
    public String getPayMerchantName() {
        return this.payMerchantName;
    }

    /**
     * 设置payMerchantName
     * @param payMerchantName
     */
    public void setPayMerchantName(String payMerchantName) {
        this.payMerchantName = payMerchantName;
    }

    /**
     * 获取payTypeId
     * 
     * @return payTypeId
     */
    @Column(name = "PAY_TYPE_ID", nullable = true, length = 32)
    public String getPayTypeId() {
        return this.payTypeId;
    }

    /**
     * 设置payTypeId
     * 
     * @param payTypeId
     */
    public void setPayTypeId(String payTypeId) {
        this.payTypeId = payTypeId;
    }

    /**
     * 获取payTypeCode
     * 
     * @return payTypeCode
     */
    @Column(name = "PAY_TYPE_CODE", nullable = true, length = 20)
    public String getPayTypeCode() {
        return this.payTypeCode;
    }

    /**
     * 设置payTypeCode
     * @param payTypeCode
     */
    public void setPayTypeCode(String payTypeCode) {
        this.payTypeCode = payTypeCode;
    }

    /**
     * 获取payTypeName
     * @return payTypeName
     */
    @Column(name = "PAY_TYPE_NAME", nullable = true, length = 50)
    public String getPayTypeName() {
        return this.payTypeName;
    }

    /**
     * 设置payTypeName
     * @param payTypeName
     */
    public void setPayTypeName(String payTypeName) {
        this.payTypeName = payTypeName;
    }

    /**
     * 获取payerNo
     * @return payerNo
     */
    @Column(name = "PAYER_NO", nullable = true, length = 50)
    public String getPayerNo() {
        return this.payerNo;
    }

    /**
     * 设置payerNo
     * 
     * @param payerNo
     */
    public void setPayerNo(String payerNo) {
        this.payerNo = payerNo;
    }

    /**
     * 获取payerName
     * 
     * @return payerName
     */
    @Column(name = "PAYER_NAME", nullable = true, length = 70)
    public String getPayerName() {
        return this.payerName;
    }

    /**
     * 设置payerName
     * 
     * @param payerName
     */
    public void setPayerName(String payerName) {
        this.payerName = payerName;
    }

    /**
     * 获取payerAccount
     * 
     * @return payerAccount
     */
    @Column(name = "PAYER_ACCOUNT", nullable = true, length = 50)
    public String getPayerAccount() {
        return this.payerAccount;
    }

    /**
     * 设置payerAccount
     * 
     * @param payerAccount
     */
    public void setPayerAccount(String payerAccount) {
        this.payerAccount = payerAccount;
    }

    /**
     * 获取payerAcctType
     * 
     * @return payerAcctType
     */
    @Column(name = "PAYER_ACCT_TYPE", nullable = true, length = 1)
    public String getPayerAcctType() {
        return this.payerAcctType;
    }

    /**
     * 设置payerAcctType
     * 
     * @param payerAcctType
     */
    public void setPayerAcctType(String payerAcctType) {
        this.payerAcctType = payerAcctType;
    }

    /**
     * 获取payerAcctBank
     * 
     * @return payerAcctBank
     */
    @Column(name = "PAYER_ACCT_BANK", nullable = true, length = 20)
    public String getPayerAcctBank() {
        return this.payerAcctBank;
    }

    /**
     * 设置payerAcctBank
     * 
     * @param payerAcctBank
     */
    public void setPayerAcctBank(String payerAcctBank) {
        this.payerAcctBank = payerAcctBank;
    }

    /**
     * 获取payerPhone
     * 
     * @return payerPhone
     */
    @Column(name = "PAYER_PHONE", nullable = true, length = 20)
    public String getPayerPhone() {
        return this.payerPhone;
    }

    /**
     * 设置payerPhone
     * 
     * @param payerPhone
     */
    public void setPayerPhone(String payerPhone) {
        this.payerPhone = payerPhone;
    }

    /**
     * 获取payerLogin
     * 
     * @return payerLogin
     */
    @Column(name = "PAYER_LOGIN", nullable = true, length = 50)
    public String getPayerLogin() {
        return this.payerLogin;
    }

    /**
     * 设置payerLogin
     * 
     * @param payerLogin
     */
    public void setPayerLogin(String payerLogin) {
        this.payerLogin = payerLogin;
    }

    /**
     * 获取00:门诊预存
            01:预约
            02:挂号
            03:门诊缴费
            04:住院预缴
            05:发卡
            06:建档
     * 
     * @return 00
     */
    @Column(name = "BIZ_TYPE", nullable = true, length = 2)
    public String getBizType() {
        return this.bizType;
    }

    /**
     * 设置00:门诊预存
            01:预约
            02:挂号
            03:门诊缴费
            04:住院预缴
            05:发卡
            06:建档
     * 
     * @param bizType
     *          00
     */
    public void setBizType(String bizType) {
        this.bizType = bizType;
    }

    /**
     * 获取bizNo
     * 
     * @return bizNo
     */
    @Column(name = "BIZ_NO", nullable = true, length = 50)
    public String getBizNo() {
        return this.bizNo;
    }

    /**
     * 设置bizNo
     * 
     * @param bizNo
     */
    public void setBizNo(String bizNo) {
        this.bizNo = bizNo;
    }

    /**
     * 获取bizUrl
     * 
     * @return bizUrl
     */
    @Column(name = "BIZ_URL", nullable = true, length = 200)
    public String getBizUrl() {
        return this.bizUrl;
    }

    /**
     * 设置bizUrl
     * 
     * @param bizUrl
     */
    public void setBizUrl(String bizUrl) {
        this.bizUrl = bizUrl;
    }

    /**
     * 获取bizBean
     * 
     * @return bizBean
     */
    @Column(name = "BIZ_BEAN", nullable = true, length = 50)
    public String getBizBean() {
        return this.bizBean;
    }

    /**
     * 设置bizBean
     * 
     * @param bizBean
     */
    public void setBizBean(String bizBean) {
        this.bizBean = bizBean;
    }

    /**
     * 获取bizTime
     * 
     * @return bizTime
     */
    @Column(name = "BIZ_TIME", nullable = true)
    public Date getBizTime() {
        return this.bizTime;
    }

    /**
     * 设置bizTime
     * 
     * @param bizTime
     */
    public void setBizTime(Date bizTime) {
        this.bizTime = bizTime;
    }

    /**
     * 获取tranTime
     * 
     * @return tranTime
     */
    @Column(name = "TRAN_TIME", nullable = true)
    public Date getTranTime() {
        return this.tranTime;
    }

    /**
     * 设置tranTime
     * 
     * @param tranTime
     */
    public void setTranTime(Date tranTime) {
        this.tranTime = tranTime;
    }

    /**
     * 获取finishTime
     * 
     * @return finishTime
     */
    @Column(name = "FINISH_TIME", nullable = true)
    public Date getFinishTime() {
        return this.finishTime;
    }

    /**
     * 设置finishTime
     * 
     * @param finishTime
     */
    public void setFinishTime(Date finishTime) {
        this.finishTime = finishTime;
    }

    /**
     * 获取outTime
     * 
     * @return outTime
     */
    @Column(name = "OUT_TIME", nullable = true, length = 20)
    public String getOutTime() {
        return this.outTime;
    }

    /**
     * 设置outTime
     * 
     * @param outTime
     */
    public void setOutTime(String outTime) {
        this.outTime = outTime;
    }

    /**
     * 获取oriBillId
     * 
     * @return oriBillId
     */
    @Column(name = "ORI_BILL_ID", nullable = true, length = 32)
    public String getOriBillId() {
        return this.oriBillId;
    }

    /**
     * 设置oriBillId
     * 
     * @param oriBillId
     */
    public void setOriBillId(String oriBillId) {
        this.oriBillId = oriBillId;
    }

    /**
     * 获取oriAmt
     * 
     * @return oriAmt
     */
    @Column(name = "ORI_AMT", nullable = true)
    public BigDecimal getOriAmt() {
        return this.oriAmt;
    }

    /**
     * 设置oriAmt
     * 
     * @param oriAmt
     */
    public void setOriAmt(BigDecimal oriAmt) {
        this.oriAmt = oriAmt;
    }

    /**
     * 获取optStatus
     * 
     * @return optStatus
     */
    @Column(name = "OPT_STATUS", nullable = true, length = 1)
    public String getOptStatus() {
        return this.optStatus;
    }

    /**
     * 设置optStatus
     * 
     * @param optStatus
     */
    public void setOptStatus(String optStatus) {
        this.optStatus = optStatus;
    }

    /**
     * 获取optTime
     * 
     * @return optTime
     */
    @Column(name = "OPT_TIME", nullable = true)
    public Date getOptTime() {
        return this.optTime;
    }

    /**
     * 设置optTime
     * 
     * @param optTime
     */
    public void setOptTime(Date optTime) {
        this.optTime = optTime;
    }

    /**
     * 获取optId
     * 
     * @return optId
     */
    @Column(name = "OPT_ID", nullable = true, length = 32)
    public String getOptId() {
        return this.optId;
    }

    /**
     * 设置optId
     * 
     * @param optId
     */
    public void setOptId(String optId) {
        this.optId = optId;
    }

    /**
     * 获取optName
     * 
     * @return optName
     */
    @Column(name = "OPT_NAME", nullable = true, length = 50)
    public String getOptName() {
        return this.optName;
    }

    /**
     * 设置optName
     * 
     * @param optName
     */
    public void setOptName(String optName) {
        this.optName = optName;
    }

    /**
     * 获取operation
     * 
     * @return operation
     */
    @Column(name = "OPERATION", nullable = true, length = 200)
    public String getOperation() {
        return this.operation;
    }

    /**
     * 设置operation
     * 
     * @param operation
     */
    public void setOperation(String operation) {
        this.operation = operation;
    }

    /**
     * 获取INITIAL = "A"	
                        TRAN_SUCCESS = "0"
                        PAY_SUCCESS = "1"
                        PAY_FAILURE = "2"
                        THIRD_FAILURE = "3"
                        TRAN_FINISH = "4"
                        REFUNDING = "5"
                        FAILURE = "6"
                        SUCCESS = "7"
                        EXCEPTIONAL = "8"
                        CLOSED = "9"
     * 
     * @return INITIAL = "A"	
                        TRAN_SUCCESS = "0"
                        PAY_SUCCESS = "1"
                        PAY_FAILURE = "2"
                        THIRD_FAILURE = "3"
                        TRAN_FINISH = "4"
                        REFUNDING = "5"
                        FAILURE = "6"
                        SUCCESS = "7"
                        EXCEPTIONAL = "8"
                        CLOSED = "9"
     */
    @Column(name = "STATUS", nullable = true, length = 1)
    public String getStatus() {
        return this.status;
    }

    /**
     * 设置INITIAL = "A"	
                        TRAN_SUCCESS = "0"
                        PAY_SUCCESS = "1"
                        PAY_FAILURE = "2"
                        THIRD_FAILURE = "3"
                        TRAN_FINISH = "4"
                        REFUNDING = "5"
                        FAILURE = "6"
                        SUCCESS = "7"
                        EXCEPTIONAL = "8"
                        CLOSED = "9"
     * 
     * @param status
     *          INITIAL = "A"	
                        TRAN_SUCCESS = "0"
                        PAY_SUCCESS = "1"
                        PAY_FAILURE = "2"
                        THIRD_FAILURE = "3"
                        TRAN_FINISH = "4"
                        REFUNDING = "5"
                        FAILURE = "6"
                        SUCCESS = "7"
                        EXCEPTIONAL = "8"
                        CLOSED = "9"
     */
    public void setStatus(String status) {
        this.status = status;
    }
}