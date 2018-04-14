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
import javax.persistence.Transient;

import com.lenovohit.hwe.base.model.AuditableModel;

/**
 * PAY_CASH_ERROR
 * 
 * @author zyus
 * @version 1.0.0 2017-12-22
 */
@Entity
@Table(name = "PAY_CASH")
public class Cash extends AuditableModel implements java.io.Serializable {
   
	/** 版本号 */
    private static final long serialVersionUID = -7199491244543238242L;

	public static final String CASH_STAT_INITIAL = "A";// 初始化
	public static final String CASH_STAT_PAY_SUCCESS = "0";// 支付成功
	public static final String CASH_STAT_PAY_FAILURE = "1";// 支付失败
	public static final String CASH_STAT_PAY_FINISH = "2";// 交易完成
	public static final String CASH_STAT_CLOSED = "9";// 关闭 超时关闭 手工关闭 废单
	public static final String CASH_STAT_EXCEPTIONAL = "E";// 异常  
	public static final String CASH_STAT_REVERSE = "R";// 冲账

    
    /** settleId */
    private String settleId;

    /** settleNo */
    private String settleNo;
    
    /** appCode */
    private String appCode;

    /** appName */
    private String appName;

	/**
	 * APP - APP SSM - SSM SSB - SSB
	 */
    private String appType;

    /** terminalCode */
    private String terminalCode;

    /** terminalName */
    private String terminalName;

    /** terminalUser */
    private String terminalUser;
    
    /** amt */
    private BigDecimal amt;
    
    /** ret */
    private String ret;

    /** msg */
    private String msg;

    /** printStat */
    private String printStat;

    /** printBatchNo */
    private String printBatchNo;

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
    
    /** status */
    private String status;
    
    private Settlement settlement;
    
    /**
     * 获取settleId
     * 
     * @return settleId
     */
    @Column(name = "SETTLE_ID", nullable = true, length = 32)
    public String getSettleId() {
        return this.settleId;
    }

    /**
     * 设置settleId
     * 
     * @param settleId
     */
    public void setSettleId(String settleId) {
        this.settleId = settleId;
    }

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
     * 获取ret
     * 
     * @return ret
     */
    @Column(name = "RET", nullable = true, length = 20)
    public String getRet() {
        return this.ret;
    }

    /**
     * 设置ret
     * 
     * @param ret
     */
    public void setRet(String ret) {
        this.ret = ret;
    }

    /**
     * 获取msg
     * 
     * @return msg
     */
    @Column(name = "MSG", nullable = true, length = 500)
    public String getMsg() {
        return this.msg;
    }

    /**
     * 设置msg
     * 
     * @param msg
     */
    public void setMsg(String msg) {
        this.msg = msg;
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
	public Settlement getSettlement() {
		return settlement;
	}

	public void setSettlement(Settlement settlement) {
		this.settlement = settlement;
	}
    
}