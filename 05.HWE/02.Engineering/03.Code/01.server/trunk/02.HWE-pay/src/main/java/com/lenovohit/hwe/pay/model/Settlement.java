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
import java.util.HashMap;
import java.util.Map;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.lenovohit.hwe.base.model.AuditableModel;

/**
 * PAY_SETTLEMENT
 * 
 * @author zyus
 * @version 1.0.0 2018-01-11
 */
@Entity
@Table(name = "PAY_SETTLEMENT")
public class Settlement extends AuditableModel implements java.io.Serializable {
    /** 版本号 */
    private static final long serialVersionUID = -7882211593967816916L;
	public static final String SETTLE_TYPE_PAY = "SP";// 支付
	public static final String SETTLE_TYPE_REFUND = "SR";// 退款
	public static final String SETTLE_TYPE_CANCEL = "SC";// 撤销

	public static final String SETTLE_STAT_INITIAL = "A";// 初始化
	public static final String SETTLE_STAT_PAY_SUCCESS = "0";// 支付成功
	public static final String SETTLE_STAT_PAY_FAILURE = "1";// 支付失败
	public static final String SETTLE_STAT_PAY_FINISH = "2";// 支付完成
	public static final String SETTLE_STAT_REFUNDING = "5";// 正在退款
	public static final String SETTLE_STAT_REFUND_FAILURE = "6";// 退款失败
	public static final String SETTLE_STAT_REFUND_SUCCESS = "7";// 退款成功
	public static final String SETTLE_STAT_REFUND_CANCELED= "8";//被撤销的
	public static final String SETTLE_STAT_CLOSED = "9";// 关闭 超时关闭 手工关闭 废单
	public static final String SETTLE_STAT_EXCEPTIONAL = "E";// 异常  
	public static final String SETTLE_STAT_REVERSE = "R";// 冲账

	public static final String SETTLE_TRADE_INITIAL = "A";// 初始化
	public static final String SETTLE_TRADE_SUCCESS = "0";// 交易成功
	public static final String SETTLE_TRADE_FAILURE = "1";// 交易失败
	public static final String SETTLE_TRADE_CLOSED = "9";// 交易关闭
	public static final String SETTLE_TRADE_EXCEPTIONAL = "E";// 交易异常
	

    /** settleNo */
    private String settleNo;

    /** settleType */
    private String settleType;

    /** settleTitle */
    private String settleTitle;

    /** settleDesc */
    private String settleDesc;

    /** amt */
    private BigDecimal amt;

    /** realAmt */
    private BigDecimal realAmt;

    /** appCode */
    private String appCode;

    /** appName */
    private String appName;

    /** APP - APP
            SSM - SSM
            SSB - SSB */
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

    /** tradeNo */
    private String tradeNo;

    /** tradeTime */
    private Date tradeTime;

    /** tradeStatus */
    private String tradeStatus;

    /** tradeRspCode */
    private String tradeRspCode;

    /** tradeRspMsg */
    private String tradeRspMsg;

    /** tradeTerminalCode */
    private String tradeTerminalCode;
    
    private String oriTradeNo;

    /** finishTime */
    private Date finishTime;

    /** outTime */
    private String outTime;

    /** billId */
    private String billId;

    /** oriSettleId */
    private String oriSettleId;

    /** oriAmt */
    private BigDecimal oriAmt;

    /** checkStat */
    private String checkStat;

    /** checkTime */
    private Date checkTime;

    /** syncNum */
    private Integer syncNum;

    /** qrCode */
    private String qrCode;

    /** respText */
    private String respText;

    /** printStat */
    private String printStat;

    /** printBatchNo */
    private String printBatchNo;

    /** flag */
    private String flag;

    /** status */
    private String status;

    private String oriBillId;
    private PayType payType;
	private Bill bill;
	private Settlement oriSettlement;//原流水
	
    /** 临时变量存储 **/
	private Map<String, Object> variables = new HashMap<String, Object>();
	
    /**
     * 获取settleNo
     * 
     * @return settleNo
     */
    @Column(name = "SETTLE_NO", nullable = true, length = 50)
    public String getSettleNo() {
        return this.settleNo;
    }

    /**
     * 设置settleNo
     * 
     * @param settleNo
     */
    public void setSettleNo(String settleNo) {
        this.settleNo = settleNo;
    }

    /**
     * 获取settleType
     * 
     * @return settleType
     */
    @Column(name = "SETTLE_TYPE", nullable = true, length = 2)
    public String getSettleType() {
        return this.settleType;
    }

    /**
     * 设置settleType
     * 
     * @param settleType
     */
    public void setSettleType(String settleType) {
        this.settleType = settleType;
    }

    /**
     * 获取settleTitle
     * 
     * @return settleTitle
     */
    @Column(name = "SETTLE_TITLE", nullable = true, length = 200)
    public String getSettleTitle() {
        return this.settleTitle;
    }

    /**
     * 设置settleTitle
     * 
     * @param settleTitle
     */
    public void setSettleTitle(String settleTitle) {
        this.settleTitle = settleTitle;
    }

    /**
     * 获取settleDesc
     * 
     * @return settleDesc
     */
    @Column(name = "SETTLE_DESC", nullable = true, length = 500)
    public String getSettleDesc() {
        return this.settleDesc;
    }

    /**
     * 设置settleDesc
     * 
     * @param settleDesc
     */
    public void setSettleDesc(String settleDesc) {
        this.settleDesc = settleDesc;
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
     * 获取realAmt
     * 
     * @return realAmt
     */
    @Column(name = "REAL_AMT", nullable = true)
    public BigDecimal getRealAmt() {
        return this.realAmt;
    }

    /**
     * 设置realAmt
     * 
     * @param realAmt
     */
    public void setRealAmt(BigDecimal realAmt) {
        this.realAmt = realAmt;
    }

    /**
     * 获取appCode
     * 
     * @return appCode
     */
    @Column(name = "APP_CODE", nullable = true, length = 32)
    public String getAppCode() {
        return this.appCode;
    }

    /**
     * 设置appCode
     * 
     * @param appCode
     */
    public void setAppCode(String appCode) {
        this.appCode = appCode;
    }

    /**
     * 获取appName
     * 
     * @return appName
     */
    @Column(name = "APP_NAME", nullable = true, length = 50)
    public String getAppName() {
        return this.appName;
    }

    /**
     * 设置appName
     * 
     * @param appName
     */
    public void setAppName(String appName) {
        this.appName = appName;
    }

    /**
     * 获取APP - APP
            SSM - SSM
            SSB - SSB
     * 
     * @return APP - APP
            SSM - SSM
            SSB - SSB
     */
    @Column(name = "APP_TYPE", nullable = true, length = 3)
    public String getAppType() {
        return this.appType;
    }

    /**
     * 设置APP - APP
            SSM - SSM
            SSB - SSB
     * 
     * @param appType
     *          APP - APP
            SSM - SSM
            SSB - SSB
     */
    public void setAppType(String appType) {
        this.appType = appType;
    }

    /**
     * 获取terminalCode
     * 
     * @return terminalCode
     */
    @Column(name = "TERMINAL_CODE", nullable = true, length = 50)
    public String getTerminalCode() {
        return this.terminalCode;
    }

    /**
     * 设置terminalCode
     * 
     * @param terminalCode
     */
    public void setTerminalCode(String terminalCode) {
        this.terminalCode = terminalCode;
    }

    /**
     * 获取terminalName
     * 
     * @return terminalName
     */
    @Column(name = "TERMINAL_NAME", nullable = true, length = 70)
    public String getTerminalName() {
        return this.terminalName;
    }

    /**
     * 设置terminalName
     * 
     * @param terminalName
     */
    public void setTerminalName(String terminalName) {
        this.terminalName = terminalName;
    }

    /**
     * 获取terminalUser
     * 
     * @return terminalUser
     */
    @Column(name = "TERMINAL_USER", nullable = true, length = 50)
    public String getTerminalUser() {
        return this.terminalUser;
    }

    /**
     * 设置terminalUser
     * 
     * @param terminalUser
     */
    public void setTerminalUser(String terminalUser) {
        this.terminalUser = terminalUser;
    }

    /**
     * 获取payChannelId
     * 
     * @return payChannelId
     */
    @Column(name = "PAY_CHANNEL_ID", nullable = true, length = 32)
    public String getPayChannelId() {
        return this.payChannelId;
    }

    /**
     * 设置payChannelId
     * 
     * @param payChannelId
     */
    public void setPayChannelId(String payChannelId) {
        this.payChannelId = payChannelId;
    }

    /**
     * 获取payChannelCode
     * 
     * @return payChannelCode
     */
    @Column(name = "PAY_CHANNEL_CODE", nullable = true, length = 20)
    public String getPayChannelCode() {
        return this.payChannelCode;
    }

    /**
     * 设置payChannelCode
     * 
     * @param payChannelCode
     */
    public void setPayChannelCode(String payChannelCode) {
        this.payChannelCode = payChannelCode;
    }

    /**
     * 获取payChannelName
     * 
     * @return payChannelName
     */
    @Column(name = "PAY_CHANNEL_NAME", nullable = true, length = 50)
    public String getPayChannelName() {
        return this.payChannelName;
    }

    /**
     * 设置payChannelName
     * 
     * @param payChannelName
     */
    public void setPayChannelName(String payChannelName) {
        this.payChannelName = payChannelName;
    }

    /**
     * 获取payMerchantId
     * 
     * @return payMerchantId
     */
    @Column(name = "PAY_MERCHANT_ID", nullable = true, length = 32)
    public String getPayMerchantId() {
        return this.payMerchantId;
    }

    /**
     * 设置payMerchantId
     * 
     * @param payMerchantId
     */
    public void setPayMerchantId(String payMerchantId) {
        this.payMerchantId = payMerchantId;
    }

    /**
     * 获取payMerchantNo
     * 
     * @return payMerchantNo
     */
    @Column(name = "PAY_MERCHANT_NO", nullable = true, length = 50)
    public String getPayMerchantNo() {
        return this.payMerchantNo;
    }

    /**
     * 设置payMerchantNo
     * 
     * @param payMerchantNo
     */
    public void setPayMerchantNo(String payMerchantNo) {
        this.payMerchantNo = payMerchantNo;
    }

    /**
     * 获取payMerchantName
     * 
     * @return payMerchantName
     */
    @Column(name = "PAY_MERCHANT_NAME", nullable = true, length = 50)
    public String getPayMerchantName() {
        return this.payMerchantName;
    }

    /**
     * 设置payMerchantName
     * 
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
     * 
     * @param payTypeCode
     */
    public void setPayTypeCode(String payTypeCode) {
        this.payTypeCode = payTypeCode;
    }

    /**
     * 获取payTypeName
     * 
     * @return payTypeName
     */
    @Column(name = "PAY_TYPE_NAME", nullable = true, length = 50)
    public String getPayTypeName() {
        return this.payTypeName;
    }

    /**
     * 设置payTypeName
     * 
     * @param payTypeName
     */
    public void setPayTypeName(String payTypeName) {
        this.payTypeName = payTypeName;
    }

    /**
     * 获取payerNo
     * 
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
     * 获取tradeRspCode
     * 
     * @return tradeRspCode
     */
    @Column(name = "TRADE_RSP_CODE", nullable = true, length = 50)
    public String getTradeRspCode() {
        return this.tradeRspCode;
    }

    /**
     * 设置tradeRspCode
     * 
     * @param tradeRspCode
     */
    public void setTradeRspCode(String tradeRspCode) {
        this.tradeRspCode = tradeRspCode;
    }

    /**
     * 获取tradeRspMsg
     * 
     * @return tradeRspMsg
     */
    @Column(name = "TRADE_RSP_MSG", nullable = true, length = 500)
    public String getTradeRspMsg() {
        return this.tradeRspMsg;
    }

    /**
     * 设置tradeRspMsg
     * 
     * @param tradeRspMsg
     */
    public void setTradeRspMsg(String tradeRspMsg) {
        this.tradeRspMsg = tradeRspMsg;
    }

    /**
     * 获取tradeTerminalCode
     * 
     * @return tradeTerminalCode
     */
    @Column(name = "TRADE_TERMINAL_CODE", nullable = true, length = 50)
    public String getTradeTerminalCode() {
        return this.tradeTerminalCode;
    }

    /**
     * 设置tradeTerminalCode
     * 
     * @param tradeTerminalCode
     */
    public void setTradeTerminalCode(String tradeTerminalCode) {
        this.tradeTerminalCode = tradeTerminalCode;
    }
    
    @Column(name = "ORI_TRADE_NO", nullable = true, length = 50)
    public String getOriTradeNo() {
		return oriTradeNo;
	}

	public void setOriTradeNo(String oriTradeNo) {
		this.oriTradeNo = oriTradeNo;
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
     * 获取billId
     * 
     * @return billId
     */
    @Column(name = "BILL_ID", nullable = true, length = 32)
    public String getBillId() {
        return this.billId;
    }

    /**
     * 设置billId
     * 
     * @param billId
     */
    public void setBillId(String billId) {
        this.billId = billId;
    }

    /**
     * 获取oriSettleId
     * 
     * @return oriSettleId
     */
    @Column(name = "ORI_SETTLE_ID", nullable = true, length = 32)
    public String getOriSettleId() {
        return this.oriSettleId;
    }

    /**
     * 设置oriSettleId
     * 
     * @param oriSettleId
     */
    public void setOriSettleId(String oriSettleId) {
        this.oriSettleId = oriSettleId;
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
     * 获取checkStat
     * 
     * @return checkStat
     */
    @Column(name = "CHECK_STAT", nullable = true, length = 1)
    public String getCheckStat() {
        return this.checkStat;
    }

    /**
     * 设置checkStat
     * 
     * @param checkStat
     */
    public void setCheckStat(String checkStat) {
        this.checkStat = checkStat;
    }

    /**
     * 获取checkTime
     * 
     * @return checkTime
     */
    @Column(name = "CHECK_TIME", nullable = true)
    public Date getCheckTime() {
        return this.checkTime;
    }

    /**
     * 设置checkTime
     * 
     * @param checkTime
     */
    public void setCheckTime(Date checkTime) {
        this.checkTime = checkTime;
    }

    /**
     * 获取syncNum
     * 
     * @return syncNum
     */
    @Column(name = "SYNC_NUM", nullable = true, length = 10)
    public Integer getSyncNum() {
        return this.syncNum;
    }

    /**
     * 设置syncNum
     * 
     * @param syncNum
     */
    public void setSyncNum(Integer syncNum) {
        this.syncNum = syncNum;
    }

    /**
     * 获取qrCode
     * 
     * @return qrCode
     */
    @Column(name = "QR_CODE", nullable = true, length = 200)
    public String getQrCode() {
        return this.qrCode;
    }

    /**
     * 设置qrCode
     * 
     * @param qrCode
     */
    public void setQrCode(String qrCode) {
        this.qrCode = qrCode;
    }

    /**
     * 获取respText
     * 
     * @return respText
     */
    @Column(name = "RESP_TEXT", nullable = true, length = 65535)
    public String getRespText() {
        return this.respText;
    }

    /**
     * 设置respText
     * 
     * @param respText
     */
    public void setRespText(String respText) {
        this.respText = respText;
    }

    /**
     * 获取printStat
     * 
     * @return printStat
     */
    @Column(name = "PRINT_STAT", nullable = true, length = 1)
    public String getPrintStat() {
        return this.printStat;
    }

    /**
     * 设置printStat
     * 
     * @param printStat
     */
    public void setPrintStat(String printStat) {
        this.printStat = printStat;
    }

    /**
     * 获取printBatchNo
     * 
     * @return printBatchNo
     */
    @Column(name = "PRINT_BATCH_NO", nullable = true, length = 50)
    public String getPrintBatchNo() {
        return this.printBatchNo;
    }

    /**
     * 设置printBatchNo
     * 
     * @param printBatchNo
     */
    public void setPrintBatchNo(String printBatchNo) {
        this.printBatchNo = printBatchNo;
    }

    /**
     * 获取flag
     * 
     * @return flag
     */
    @Column(name = "FLAG", nullable = true, length = 32)
    public String getFlag() {
        return this.flag;
    }

    /**
     * 设置flag
     * 
     * @param flag
     */
    public void setFlag(String flag) {
        this.flag = flag;
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
    
    @Transient
    public String getOriBillId() {
		return oriBillId;
	}

	public void setOriBillId(String oriBillId) {
		this.oriBillId = oriBillId;
	}

	@Transient
	public PayType getPayType() {
		return payType;
	}
	public void setPayType(PayType payType) {
		this.payType = payType;
	}
	
	@Transient
	public Bill getBill() {
		return bill;
	}
	public void setBill(Bill bill) {
		this.bill = bill;
	}
	
	 @Transient
	public Settlement getOriSettlement() {
		return oriSettlement;
	}
	public void setOriSettlement(Settlement oriSettlement) {
		this.oriSettlement = oriSettlement;
	}
	
    @Transient
	public Map<String, Object> getVariables() {
		return variables;
	}
    
	public void setVariables(Map<String, Object> variables) {
		this.variables = variables;
	}
}