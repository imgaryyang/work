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

package com.lenovohit.hcp.payment.model;

import java.awt.ItemSelectable;
import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import com.lenovohit.hcp.base.model.ChargeDetail;

/**
 * TREAT_CHARGE
 * 
 * @author zyus
 * @version 1.0.0 2017-12-16
 */
public class ICharge implements java.io.Serializable {
    /** 版本号 */
    private static final long serialVersionUID = 7765526928452586545L;

    /** hosId */
    private String hosId;

    /** hosNo */
    private String hosNo;

    /** hosName */
    private String hosName;

    /** depId */
    private String depId;

    /** depNo */
    private String depNo;

    /** depName */
    private String depName;

    /** depClazz */
    private String depClazz;

    /** depClazzName */
    private String depClazzName;

    /** sepId */
    private String sepId;

    /** sepCode */
    private String sepCode;

    /** sepName */
    private String sepName;

    /** sepType */
    private String sepType;

    /** docId */
    private String docId;

    /** docNo */
    private String docNo;

    /** docName */
    private String docName;

    /** docJobTitle */
    private String docJobTitle;

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

    /** actId */
    private String actId;

    /** actNo */
    private String actNo;

    /** miType */
    private String miType;

    /** myselfScale */
    private BigDecimal myselfScale;

    /** amt */
    private BigDecimal amt;

    /** realAmt */
    private BigDecimal realAmt;

	private BigDecimal paAmt = new BigDecimal(0);//个人账户金额	
	private BigDecimal miAmt = new BigDecimal(0);//医保报销金额	
	private BigDecimal myselfAmt = new BigDecimal(0);//个人自付金额
	private BigDecimal reduceAmt = new BigDecimal(0);//减免金额
    
    /** chargeUser */
    private String chargeUser;

    /** chargeTime */
    private Date chargeTime;

    /** comment */
    private String comment;

    /** status */
    private String status;
    
    private String no;    /** items */
    private List<IChargeDetail> items;
    
    private String chargeNo;
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
     * 获取hosName
     * 
     * @return hosName
     */
                                                                        
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
     * 获取depId
     * 
     * @return depId
     */
                                                                        
    public String getDepId() {
        return this.depId;
    }

    /**
     * 设置depId
     * 
     * @param depId
     */
    public void setDepId(String depId) {
        this.depId = depId;
    }

    /**
     * 获取depNo
     * 
     * @return depNo
     */
                                                                        
    public String getDepNo() {
        return this.depNo;
    }

    /**
     * 设置depNo
     * 
     * @param depNo
     */
    public void setDepNo(String depNo) {
        this.depNo = depNo;
    }

    /**
     * 获取depName
     * 
     * @return depName
     */
                                                                        
    public String getDepName() {
        return this.depName;
    }

    /**
     * 设置depName
     * 
     * @param depName
     */
    public void setDepName(String depName) {
        this.depName = depName;
    }

    /**
     * 获取depClazz
     * 
     * @return depClazz
     */
                                                                        
    public String getDepClazz() {
        return this.depClazz;
    }

    /**
     * 设置depClazz
     * 
     * @param depClazz
     */
    public void setDepClazz(String depClazz) {
        this.depClazz = depClazz;
    }

    /**
     * 获取depClazzName
     * 
     * @return depClazzName
     */
                                                                        
    public String getDepClazzName() {
        return this.depClazzName;
    }

    /**
     * 设置depClazzName
     * 
     * @param depClazzName
     */
    public void setDepClazzName(String depClazzName) {
        this.depClazzName = depClazzName;
    }

    /**
     * 获取sepId
     * 
     * @return sepId
     */
                                                                        
    public String getSepId() {
        return this.sepId;
    }

    /**
     * 设置sepId
     * 
     * @param sepId
     */
    public void setSepId(String sepId) {
        this.sepId = sepId;
    }

    /**
     * 获取sepCode
     * 
     * @return sepCode
     */
                                                                        
    public String getSepCode() {
        return this.sepCode;
    }

    /**
     * 设置sepCode
     * 
     * @param sepCode
     */
    public void setSepCode(String sepCode) {
        this.sepCode = sepCode;
    }

    /**
     * 获取sepName
     * 
     * @return sepName
     */
                                                                        
    public String getSepName() {
        return this.sepName;
    }

    /**
     * 设置sepName
     * 
     * @param sepName
     */
    public void setSepName(String sepName) {
        this.sepName = sepName;
    }

    /**
     * 获取sepType
     * 
     * @return sepType
     */
                                                                        
    public String getSepType() {
        return this.sepType;
    }

    /**
     * 设置sepType
     * 
     * @param sepType
     */
    public void setSepType(String sepType) {
        this.sepType = sepType;
    }

    /**
     * 获取docId
     * 
     * @return docId
     */
                                                                        
    public String getDocId() {
        return this.docId;
    }

    /**
     * 设置docId
     * 
     * @param docId
     */
    public void setDocId(String docId) {
        this.docId = docId;
    }

    /**
     * 获取docNo
     * 
     * @return docNo
     */
                                                                        
    public String getDocNo() {
        return this.docNo;
    }

    /**
     * 设置docNo
     * 
     * @param docNo
     */
    public void setDocNo(String docNo) {
        this.docNo = docNo;
    }

    /**
     * 获取docName
     * 
     * @return docName
     */
                                                                        
    public String getDocName() {
        return this.docName;
    }

    /**
     * 设置docName
     * 
     * @param docName
     */
    public void setDocName(String docName) {
        this.docName = docName;
    }

    /**
     * 获取docJobTitle
     * 
     * @return docJobTitle
     */
                                                                        
    public String getDocJobTitle() {
        return this.docJobTitle;
    }

    /**
     * 设置docJobTitle
     * 
     * @param docJobTitle
     */
    public void setDocJobTitle(String docJobTitle) {
        this.docJobTitle = docJobTitle;
    }

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
     * 获取actId
     * 
     * @return actId
     */
                                                                        
    public String getActId() {
        return this.actId;
    }

    /**
     * 设置actId
     * 
     * @param actId
     */
    public void setActId(String actId) {
        this.actId = actId;
    }

    /**
     * 获取actNo
     * 
     * @return actNo
     */
                                                                        
    public String getActNo() {
        return this.actNo;
    }

    /**
     * 设置actNo
     * 
     * @param actNo
     */
    public void setActNo(String actNo) {
        this.actNo = actNo;
    }

    /**
     * 获取miType
     * 
     * @return miType
     */
                                                                        
    public String getMiType() {
        return this.miType;
    }

    /**
     * 设置miType
     * 
     * @param miType
     */
    public void setMiType(String miType) {
        this.miType = miType;
    }

    /**
     * 获取myselfScale
     * 
     * @return myselfScale
     */
                                                                        
    public BigDecimal getMyselfScale() {
        return this.myselfScale;
    }

    /**
     * 设置myselfScale
     * 
     * @param myselfScale
     */
    public void setMyselfScale(BigDecimal myselfScale) {
        this.myselfScale = myselfScale;
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
     * 获取realAmt
     * 
     * @return realAmt
     */
                                                                        
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
     * 获取chargeUser
     * 
     * @return chargeUser
     */
                                                                        
    public String getChargeUser() {
        return this.chargeUser;
    }

    /**
     * 设置chargeUser
     * 
     * @param chargeUser
     */
    public void setChargeUser(String chargeUser) {
        this.chargeUser = chargeUser;
    }

    /**
     * 获取chargeTime
     * 
     * @return chargeTime
     */
                                                                        
    public Date getChargeTime() {
        return this.chargeTime;
    }

    /**
     * 设置chargeTime
     * 
     * @param chargeTime
     */
    public void setChargeTime(Date chargeTime) {
        this.chargeTime = chargeTime;
    }

    /**
     * 获取comment
     * 
     * @return comment
     */
                                                                        
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
    
    
    public BigDecimal getPaAmt() {
		return paAmt;
	}

	public void setPaAmt(BigDecimal paAmt) {
		this.paAmt = paAmt;
	}

	public BigDecimal getMiAmt() {
		return miAmt;
	}

	public void setMiAmt(BigDecimal miAmt) {
		this.miAmt = miAmt;
	}

	public BigDecimal getMyselfAmt() {
		return myselfAmt;
	}

	public void setMyselfAmt(BigDecimal myselfAmt) {
		this.myselfAmt = myselfAmt;
	}

	public BigDecimal getReduceAmt() {
		return reduceAmt;
	}

	public void setReduceAmt(BigDecimal reduceAmt) {
		this.reduceAmt = reduceAmt;
	}
	
	public List<IChargeDetail> getItems() {
		return items;
	}

	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}public void setItems(List<IChargeDetail> items) {
		this.items = items;
	}
	
    /**
     * 获取chargeNo
     * 
     * @return chargeNo
     */
                                                                        
    public String getChargeNo() {
        return this.chargeNo;
    }

    /**
     * 设置chargeNo
     * 
     * @param chargeNo
     */
    public void setChargeNo(String chargeNo) {
        this.chargeNo = chargeNo;
    }
    }