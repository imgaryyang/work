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

package com.lenovohit.hwe.pay.support.acctpay.balance.model;

import java.math.BigDecimal;
import java.util.Date;

/**
 * @author zyus
 * @version 1.0.0 2017-12-16
 */
public class BalancePayResponse implements java.io.Serializable {
    /** 版本号 */
    private static final long serialVersionUID = 104664346478712983L;

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

    /** 1:挂号 2:门诊收费  3:体检收费 4.医院授权透支冲账 */
    private String tradeType;

    /** tradeTime */
    private Date tradeTime;

    /** tradeNo */
    private String tradeNo;

    /** amt */
    private BigDecimal amt;

    /** balance */
    private BigDecimal balance;

    /** appChannel */
    private String appChannel;

    /** appId */
    private String appId;

    /** operator */
    private String operator;

    /** status */
    private String status;
    
    private String createdBy;
	private String updatedBy;
	private Date createdAt;
	private Date updatedAt;
    private String startDate;
	private String endDate;
    
    /**
     * 获取proId
     * 
     * @return proId
     */
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
     * 获取1:挂号 2:门诊收费  3:体检收费 4.医院授权透支冲账
     * 
     * @return 1:挂号 2:门诊收费  3:体检收费 4
     */
    public String getTradeType() {
        return this.tradeType;
    }

    /**
     * 设置1:挂号 2:门诊收费  3:体检收费 4.医院授权透支冲账
     * 
     * @param tradeType
     *          1:挂号 2:门诊收费  3:体检收费 4
     */
    public void setTradeType(String tradeType) {
        this.tradeType = tradeType;
    }

    /**
     * 获取tradeTime
     * 
     * @return tradeTime
     */
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
     * 获取amt
     * 
     * @return amt
     */
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
     * 获取appChannel
     * 
     * @return appChannel
     */
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
     * 获取operator
     * 
     * @return operator
     */
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

	public String getCreatedBy() {
		return createdBy;
	}

	public void setCreatedBy(String createdBy) {
		this.createdBy = createdBy;
	}

	public String getUpdatedBy() {
		return updatedBy;
	}

	public void setUpdatedBy(String updatedBy) {
		this.updatedBy = updatedBy;
	}

	public Date getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(Date createdAt) {
		this.createdAt = createdAt;
	}

	public Date getUpdatedAt() {
		return updatedAt;
	}

	public void setUpdatedAt(Date updatedAt) {
		this.updatedAt = updatedAt;
	}

	public String getStartDate() {
		return startDate;
	}

	public void setStartDate(String startDate) {
		this.startDate = startDate;
	}

	public String getEndDate() {
		return endDate;
	}

	public void setEndDate(String endDate) {
		this.endDate = endDate;
	}
    
}