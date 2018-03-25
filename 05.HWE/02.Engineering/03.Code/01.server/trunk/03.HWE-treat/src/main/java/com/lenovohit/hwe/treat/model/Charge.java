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
 * TREAT_CHARGE
 * 
 * @author zyus
 * @version 1.0.0 2017-12-16
 */
@Entity
@Table(name = "TREAT_CHARGE")
public class Charge extends HisAuditableModel implements java.io.Serializable {
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
    
    /** cardType */
    private String cardType;

    /** actId */
    private String actId;

    /** actNo */
    private String actNo;

    /** 收费单号 */
    private String no;
    
    /** miType */
    private String miType;

    /** myselfScale */
    private BigDecimal myselfScale;

    /** 应收金额 */
    private BigDecimal amt;

    /** 实收金额 */
    private BigDecimal realAmt;

    /** 实收金额 */
    private BigDecimal paAmt = new BigDecimal(0);//个人账户金额	
    
    /** 实收金额 */
    private BigDecimal miAmt = new BigDecimal(0);//医保报销金额	
    
    /** 实收金额 */
    private BigDecimal myselfAmt = new BigDecimal(0);//个人自付金额
    
    /** 实收金额 */
    private BigDecimal reduceAmt = new BigDecimal(0);//减免金额
    
    /** chargeUser */
    private String chargeUser;

    /** chargeTime */
    private Date chargeTime;

    /** comment */
    private String comment;

    /** status */
    private String status;


    private Hospital hospital;
    
    private Department deptment;
    
    private Doctor doctor;
    
    private Profile profile;
    
    private Activity activity;
    
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
     * 获取depId
     * 
     * @return depId
     */
    @Column(name = "DEP_ID", nullable = true, length = 32)
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
    @Column(name = "DEP_NO", nullable = true, length = 50)
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
    @Column(name = "DEP_NAME", nullable = true, length = 50)
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
     * 获取docId
     * 
     * @return docId
     */
    @Column(name = "DOC_ID", nullable = true, length = 32)
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
    @Column(name = "DOC_NO", nullable = true, length = 50)
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
    @Column(name = "DOC_NAME", nullable = true, length = 50)
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
    @Column(name = "DOC_JOB_TITLE", nullable = true, length = 50)
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
     * 获取actId
     * 
     * @return actId
     */
    @Column(name = "ACT_ID", nullable = true, length = 32)
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
    @Column(name = "ACT_NO", nullable = true, length = 50)
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

    @Column(name = "NO", nullable = true, length = 50)
    public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}
	
    /**
     * 获取miType
     * 
     * @return miType
     */
    @Column(name = "MI_TYPE", nullable = true, length = 1)
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
    @Column(name = "MYSELF_SCALE", nullable = true)
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
     * 获取chargeUser
     * 
     * @return chargeUser
     */
    @Column(name = "CHARGE_USER", nullable = true, length = 50)
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
    @Column(name = "CHARGE_TIME", nullable = true)
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
    @Column(name = "COMMENT", nullable = true, length = 50)
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

	@Transient
	public Hospital getHospital() {
		return hospital;
	}

	public void setHospital(Hospital hospital) {
		this.hospital = hospital;
	}
	@Transient
	public Department getDeptment() {
		return deptment;
	}

	public void setDeptment(Department deptment) {
		this.deptment = deptment;
	}
	@Transient
	public Doctor getDoctor() {
		return doctor;
	}

	public void setDoctor(Doctor doctor) {
		this.doctor = doctor;
	}
	@Transient
	public Profile getProfile() {
		return profile;
	}

	public void setProfile(Profile profile) {
		this.profile = profile;
	}
	@Transient
	public Activity getActivity() {
		return activity;
	}

	public void setActivity(Activity activity) {
		this.activity = activity;
	}

}