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

package com.lenovohit.hcp.base.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;


/**
 * TREAT_MED_CARD
 * 
 * @author zyus
 * @version 1.0.0 2017-12-16
 */

public class IMedCard implements java.io.Serializable {
    /** 版本号 */
    private static final long serialVersionUID = 1751638763524290856L;

    /** proId */
    private String proId;
    /** proName */
    private String proName;

    /** proNo */
    private String proNo;

   

	/** hosId */
    private String hosId;

    /** hosNo */
    private String hosNo;

    /** cardNo */
    private String cardNo;

    /** cardType */
    private String cardType;

    /** issuer */
    private String issuer;

    /** effectStart */
    private String effectStart;

    /** effectEnd */
    private String effectEnd;

    /** A - 初始
            0 - 正常
            1 - 已解绑 */
    private String status;
    
    private String hosName;
    
    
    /**
     * 获取proId
     * 
     * @return proId
     */
    public String getProId() {
        return this.proId;
    }
    
    public String getProName() {
		return proName;
	}

	public void setProName(String proName) {
		this.proName = proName;
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
     * 获取hosId
     * 
     * @return hosId
     */
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
     * 获取cardType
     * 
     * @return cardType
     */
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
     * 获取issuer
     * 
     * @return issuer
     */
    public String getIssuer() {
        return this.issuer;
    }

    /**
     * 设置issuer
     * 
     * @param issuer
     */
    public void setIssuer(String issuer) {
        this.issuer = issuer;
    }

    /**
     * 获取effectStart
     * 
     * @return effectStart
     */
    public String getEffectStart() {
        return this.effectStart;
    }

    /**
     * 设置effectStart
     * 
     * @param effectStart
     */
    public void setEffectStart(String effectStart) {
        this.effectStart = effectStart;
    }

    /**
     * 获取effectEnd
     * 
     * @return effectEnd
     */
    public String getEffectEnd() {
        return this.effectEnd;
    }

    /**
     * 设置effectEnd
     * 
     * @param effectEnd
     */
    public void setEffectEnd(String effectEnd) {
        this.effectEnd = effectEnd;
    }

    /**
     * 获取A - 初始
            0 - 正常
            1 - 已解绑
     * 
     * @return A - 初始
            0 - 正常
            1 - 已解绑
     */
    public String getStatus() {
        return this.status;
    }

    /**
     * 设置A - 初始
            0 - 正常
            1 - 已解绑
     * 
     * @param status
     *          A - 初始
            0 - 正常
            1 - 已解绑
     */
    public void setStatus(String status) {
        this.status = status;
    }

	public String getHosName() {
		return hosName;
	}

	public void setHosName(String hosName) {
		this.hosName = hosName;
	}
	
	
    
}