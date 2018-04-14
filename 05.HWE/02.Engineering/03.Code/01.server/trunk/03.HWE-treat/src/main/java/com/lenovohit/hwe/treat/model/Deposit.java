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

package com.lenovohit.hwe.treat.model;

import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;

/**
 * TREAT_DEPOSIT
 * 
 * @author zyus
 * @version 1.0.0 2017-12-16
 */
@Entity
@Table(name = "TREAT_DEPOSIT")
public class Deposit extends HisAuditableModel implements java.io.Serializable {
	public static final String TYPE_RECHARGE = "0"; // 充值
	public static final String TYPE_REFUND = "1"; // 退款
	public static final String TYPE_FREEZE = "2"; // 冻结
	
	public static final String STATUS_INITIAL = "A"; // 初始
	public static final String STATUS_SUCCESS = "0"; // 成功
	public static final String STATUS_IN_PROCESS = "1"; // 受理中
	public static final String STATUS_CLOSED = "9"; // 关闭
	public static final String STATUS_EXCEPTION = "E"; // 关闭

	/** 版本号 */
    private static final long serialVersionUID = 2752604019696410424L;
    /** hosId */
    private String hosId;

    /** hosNo */
    private String hosNo;

    /** hosName */
    private String hosName;
    
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

    /** cardType */
    private String cardType;
    
    /** type */
    private String type;
    
    /** no */
    private String no;

    /** depositTime */
    private Date depositTime;

    /** amt */
    private BigDecimal amt;

    /** balance */
    private BigDecimal balance;

    /** refunded */
    private BigDecimal refunded;
    
    /** tradeNo */
    private String tradeNo;
    
    /** tradeTime */
    private Date tradeTime;
    
    /** userId */
    private String userId;

    /** account */
    private String account;

    /** accountName */
    private String accountName;
    
    /** accountType */
    private String accountType;

    /** C-现金
            Z-支付宝
            W-微信
            B-银行
            … */
    private String tradeChannel;
    
    /** accountType */
    private String tradeChannelCode;
    
    /** tradeTerminalCode */
    private String tradeTerminalCode;
    
    /** batchNo */
    private String batchNo;

    /** adFlag */
    private String adFlag;
    
    /** comment */
    private String comment;

    /** status */
    private String status;
    
    private Profile profile;

    private String bizType;
    
    /**
     * 获取hosId
     * 
     * @return hosId
     */
    @Column(name = "HOS_ID", nullable = true, length = 32)
    public String getHosId() {
        return this.hosId;
    }

    /**
     * 设置hosId
     * 
     * @param hosId
     */
    public void setHosId(String hosId) {
        this.hosId = hosId;
    }

    /**
     * 获取hosNo
     * 
     * @return hosNo
     */
    @Column(name = "HOS_NO", nullable = true, length = 50)
    public String getHosNo() {
        return this.hosNo;
    }

    /**
     * 设置hosNo
     * 
     * @param hosNo
     */
    public void setHosNo(String hosNo) {
        this.hosNo = hosNo;
    }

    /**
     * 获取hosName
     * 
     * @return hosName
     */
    @Column(name = "HOS_NAME", nullable = true, length = 50)
    public String getHosName() {
        return this.hosName;
    }

    /**
     * 设置hosName
     * 
     * @param hosName
     */
    public void setHosName(String hosName) {
        this.hosName = hosName;
    }

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
    
    public String getCardType() {
		return cardType;
	}

	public void setCardType(String cardType) {
		this.cardType = cardType;
	}

    /**
     * 获取type
     * 
     * @return type
     */
    @Column(name = "TYPE", nullable = true, length = 1)
    public String getType() {
        return this.type;
    }

    /**
     * 设置type
     * 
     * @param type
     */
    public void setType(String type) {
        this.type = type;
    }

    /**
     * 获取no
     * 
     * @return no
     */
    @Column(name = "NO", nullable = true, length = 50)
    public String getNo() {
        return this.no;
    }

    /**
     * 设置no
     * 
     * @param no
     */
    public void setNo(String no) {
        this.no = no;
    }

    
    /**
     * 获取depositTime
     * 
     * @return depositTime
     */
    @Column(name = "DEPOSIT_TIME", nullable = true)
    public Date getDepositTime() {
        return this.depositTime;
    }

    /**
     * 设置time
     * 
     * @param time
     */
    public void setDepositTime(Date depositTime) {
        this.depositTime = depositTime;
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

	public String getAccountType() {
		return accountType;
	}

	public void setAccountType(String accountType) {
		this.accountType = accountType;
	}
	
    /**
     * 获取 tradeChannel
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
     */
    public void setTradeChannel(String tradeChannel) {
        this.tradeChannel = tradeChannel;
    }

    
    public String getTradeChannelCode() {
		return tradeChannelCode;
	}

	public void setTradeChannelCode(String tradeChannelCode) {
		this.tradeChannelCode = tradeChannelCode;
	}

	public String getTradeTerminalCode() {
		return tradeTerminalCode;
	}

	public void setTradeTerminalCode(String tradeTerminalCode) {
		this.tradeTerminalCode = tradeTerminalCode;
	}

	public String getBatchNo() {
		return batchNo;
	}

	public void setBatchNo(String batchNo) {
		this.batchNo = batchNo;
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
     * 获取comment
     * 
     * @return comment
     */
    @Column(name = "COMMENT_", nullable = true, length = 200)
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
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
   	public Profile getProfile() {
   		return profile;
   	}

   	public void setProfile(Profile profile) {
   		this.profile = profile;
   	}
   	
    /**
     * 获取refunded
     * 
     * @return refunded
     */
    @Transient
    public BigDecimal getRefunded() {
        return this.refunded;
    }

    /**
     * 设置amt
     * 
     * @param refunded
     */
    public void setRefunded(BigDecimal refunded) {
        this.refunded = refunded;
    }
    
    /**
     * 获取bizType
     * 
     * @return bizType
     */
    @Transient
    public String getBizType() {
        return this.bizType;
    }

    /**
     * 设置bizType
     * 
     * @param bizType
     */
    public void setBizType(String bizType) {
        this.bizType = bizType;
    }
}