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

import com.lenovohit.hwe.base.model.AuditableModel;

/**
 * TREAT_CONSUME
 * 
 * @author zyus
 * @version 1.0.0 2017-12-16
 */
@Entity
@Table(name = "TREAT_CONSUME")
public class Consume extends AuditableModel implements java.io.Serializable {
    /** 版本号 */
    private static final long serialVersionUID = 104664346478712983L;

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

    /** 1:挂号 2:门诊收费  3:体检收费 4.医院授权透支冲账 */
    private String type;

    /** 消费流水号 */
    private String no;
    
    /** 消费时间 */
    private Date consumeTime;

    /** amt */
    private BigDecimal amt;

    /** balance */
    private BigDecimal balance;
    
    /** comment */
    private String comment;

    /** status */
    private String status;
    
    private Profile profile;

    
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

    /**
     * 获取cardType
     * 
     * @return cardType
     */
    @Column(name = "CARD_TYPE", nullable = true, length = 1)
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
     * 获取1:挂号 2:门诊收费  3:体检收费 4.医院授权透支冲账
     * 
     * @return 1:挂号 2:门诊收费  3:体检收费 4
     */
    @Column(name = "TYPE", nullable = true, length = 1)
    public String getType() {
        return this.type;
    }

    /**
     * 设置1:挂号 2:门诊收费  3:体检收费 4.医院授权透支冲账
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
     * 获取consumeTime
     * 
     * @return consumeTime
     */
    @Column(name = "CONSUME_TIME", nullable = true)
    public Date getConsumeTime() {
        return this.consumeTime;
    }

    /**
     * 设置consumeTime
     * 
     * @param consumeTime
     */
    public void setConsumeTime(Date consumeTime) {
        this.consumeTime = consumeTime;
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
     * 获取comment
     * 
     * @return comment
     */
    @Column(name = "COMMENT_", nullable = true, length = 200)
    public String getComment() {
        return this.comment;
    }

    /**
     * 设置comment
     * 
     * @param comment
     */
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
    
}