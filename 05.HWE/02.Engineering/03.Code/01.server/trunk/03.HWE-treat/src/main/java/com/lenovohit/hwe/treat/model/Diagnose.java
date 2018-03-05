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

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.lenovohit.hwe.base.model.AuditableModel;

/**
 * TREAT_DIAGNOSE
 * 
 * @author zyus
 * @version 1.0.0 2017-12-16
 */
@Entity
@Table(name = "TREAT_DIAGNOSE")
public class Diagnose extends AuditableModel implements java.io.Serializable {
    /** 版本号 */
    private static final long serialVersionUID = -7079810595163066282L;

    /** actId */
    private String actId;

    /** actNo */
    private String actNo;

    /** depNo */
    private String depNo;

    /** depName */
    private String depName;

    /** depId */
    private String depId;

    /** docId */
    private String docId;

    /** docNo */
    private String docNo;

    /** docName */
    private String docName;

    /** diseaseId */
    private String diseaseId;

    /** diseaseNo */
    private String diseaseNo;

    /** 诊断类型|DISEASE_TYPE */
    private String diseaseType;

    /** diseaseName */
    private String diseaseName;

    /** diseaseTime */
    private Date diseaseTime;

    /** isCurrent */
    private String isCurrent;

    /** A - 初始
            0 - 正常
            1 - 废弃 */
    private String status;
    
    private String hosNo;

    @Transactional
    public String getHosNo() {
		return hosNo;
	}

	public void setHosNo(String hosNo) {
		this.hosNo = hosNo;
	}

	/**
     * 获取actId
     * 
     * @return actId
     */
	@Column(name = "ACT_ID", nullable = true, length = 32)
    public String getActId() {
		return actId;
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
		return actNo;
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
     * 获取diseaseId
     * 
     * @return diseaseId
     */
    @Column(name = "DISEASE_ID", nullable = true, length = 20)
    public String getDiseaseId() {
        return this.diseaseId;
    }

    /**
     * 设置diseaseId
     * 
     * @param diseaseId
     */
    public void setDiseaseId(String diseaseId) {
        this.diseaseId = diseaseId;
    }

    /**
     * 获取diseaseNo
     * 
     * @return diseaseNo
     */
    @Column(name = "DISEASE_NO", nullable = false, length = 50)
    public String getDiseaseNo() {
        return this.diseaseNo;
    }

    /**
     * 设置diseaseNo
     * 
     * @param diseaseNo
     */
    public void setDiseaseNo(String diseaseNo) {
        this.diseaseNo = diseaseNo;
    }

    /**
     * 获取诊断类型|DISEASE_TYPE
     * 
     * @return 诊断类型|DISEASE_TYPE
     */
    @Column(name = "DISEASE_TYPE", nullable = true, length = 2)
    public String getDiseaseType() {
        return this.diseaseType;
    }

    /**
     * 设置诊断类型|DISEASE_TYPE
     * 
     * @param diseaseType
     *          诊断类型|DISEASE_TYPE
     */
    public void setDiseaseType(String diseaseType) {
        this.diseaseType = diseaseType;
    }

    /**
     * 获取diseaseName
     * 
     * @return diseaseName
     */
    @Column(name = "DISEASE_NAME", nullable = true, length = 100)
    public String getDiseaseName() {
        return this.diseaseName;
    }

    /**
     * 设置diseaseName
     * 
     * @param diseaseName
     */
    public void setDiseaseName(String diseaseName) {
        this.diseaseName = diseaseName;
    }

    /**
     * 获取diseaseTime
     * 
     * @return diseaseTime
     */
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    @Column(name = "DISEASE_TIME", nullable = true)
    public Date getDiseaseTime() {
        return this.diseaseTime;
    }

    /**
     * 设置diseaseTime
     * 
     * @param diseaseTime
     */
    public void setDiseaseTime(Date diseaseTime) {
        this.diseaseTime = diseaseTime;
    }

    /**
     * 获取isCurrent
     * 
     * @return isCurrent
     */
    @Column(name = "IS_CURRENT", nullable = true, length = 1)
    public String getIsCurrent() {
        return this.isCurrent;
    }

    /**
     * 设置isCurrent
     * 
     * @param isCurrent
     */
    public void setIsCurrent(String isCurrent) {
        this.isCurrent = isCurrent;
    }

    /**
     * 获取A - 初始
            0 - 正常
            1 - 废弃
     * 
     * @return A - 初始
            0 - 正常
            1 - 废弃
     */
    @Column(name = "STATUS", nullable = true, length = 1)
    public String getStatus() {
        return this.status;
    }

    /**
     * 设置A - 初始
            0 - 正常
            1 - 废弃
     * 
     * @param status
     *          A - 初始
            0 - 正常
            1 - 废弃
     */
    public void setStatus(String status) {
        this.status = status;
    }
}