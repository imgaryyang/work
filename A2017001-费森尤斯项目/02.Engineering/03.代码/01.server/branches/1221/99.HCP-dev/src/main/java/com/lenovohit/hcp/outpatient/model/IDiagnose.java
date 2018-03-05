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

package com.lenovohit.hcp.outpatient.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;


/**
 * TREAT_DIAGNOSE
 * 
 * @author zyus
 * @version 1.0.0 2017-12-16
 */
public class IDiagnose  implements java.io.Serializable {
	private String id;
    /** 版本号 */
    private static final long serialVersionUID = -7079810595163066282L;

    /** treatId */
    private String treatId;

    /** treatNo */
    private String treatNo;

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
    private String hosName;
    private String proNo;
    private String proName;
    private String actNo;
    private String cardNo;
    private String cardType;
    private Date startDate;
    private Date endDate;

    public String getHosNo() {
		return hosNo;
	}

	public void setHosNo(String hosNo) {
		this.hosNo = hosNo;
	}

	public String getHosName() {
		return hosName;
	}

	public void setHosName(String hosName) {
		this.hosName = hosName;
	}

	public String getProNo() {
		return proNo;
	}

	public void setProNo(String proNo) {
		this.proNo = proNo;
	}

	public String getProName() {
		return proName;
	}

	public void setProName(String proName) {
		this.proName = proName;
	}

	public String getActNo() {
		return actNo;
	}

	public void setActNo(String actNo) {
		this.actNo = actNo;
	}

	public String getCardNo() {
		return cardNo;
	}

	public void setCardNo(String cardNo) {
		this.cardNo = cardNo;
	}

	public String getCardType() {
		return cardType;
	}

	public void setCardType(String cardType) {
		this.cardType = cardType;
	}

	public Date getStartDate() {
		return startDate;
	}

	public void setStartDate(Date startDate) {
		this.startDate = startDate;
	}

	public Date getEndDate() {
		return endDate;
	}

	public void setEndDate(Date endDate) {
		this.endDate = endDate;
	}

	/**
     * 获取treatId
     * 
     * @return treatId
     */
    public String getTreatId() {
        return this.treatId;
    }

    /**
     * 设置treatId
     * 
     * @param treatId
     */
    public void setTreatId(String treatId) {
        this.treatId = treatId;
    }

    /**
     * 获取treatNo
     * 
     * @return treatNo
     */
    public String getTreatNo() {
        return this.treatNo;
    }

    /**
     * 设置treatNo
     * 
     * @param treatNo
     */
    public void setTreatNo(String treatNo) {
        this.treatNo = treatNo;
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
     * 获取diseaseId
     * 
     * @return diseaseId
     */
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

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}
    
}