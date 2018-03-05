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

package com.lenovohit.hcp.appointment.model;

import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;


/**
 * TREAT_ACTIVITY
 * 
 * @author zyus
 * @version 1.0.0 2017-12-16
 */
public class IActivity  implements java.io.Serializable {
    /** 版本号 */
    private static final long serialVersionUID = 7356675721224227656L;

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
    /** cardType */
    private String cardType;
	/** appointId */
    private String appointId;

    /** appointNo */
    private String appointNo;

    /** no */
    private String no;

    /** disease */
    private String disease;

    /** diseaseName */
    private String diseaseName;

    /** diseaseType */
    private String diseaseType;

    /** diseaseTypeName */
    private String diseaseTypeName;

    /** treatStart */
    private Date treatStart;

    /** treatEnd */
    private Date treatEnd;

    /** diagnosis */
    private String diagnosis;

    /** printStatus */
    private String printStatus;

    /** printCount */
    private Integer printCount;
    private BigDecimal regFee;
    private BigDecimal treatFee;
    private Date appointTime;
    public String getCardType() {
		return cardType;
	}

	public void setCardType(String cardType) {
		this.cardType = cardType;
	}
    public Date getAppointTime() {
		return appointTime;
	}

	public void setAppointTime(Date appointTime) {
		this.appointTime = appointTime;
	}

	public BigDecimal getRegFee() {
		return regFee;
	}

	public void setRegFee(BigDecimal regFee) {
		this.regFee = regFee;
	}

	public BigDecimal getTreatFee() {
		return treatFee;
	}

	public void setTreatFee(BigDecimal treatFee) {
		this.treatFee = treatFee;
	}

	/** status */
    private String status;
    
   
    private String operatorId;
    private String operator;
    private String deptNo;
    private String clinicType;
    private String startDate;
    private String endDate;
    private String mobile;
    private String idNo;
  
    
    
    public String getMobile() {
		return mobile;
	}

	public void setMobile(String mobile) {
		this.mobile = mobile;
	}

	public String getIdNo() {
		return idNo;
	}

	public void setIdNo(String idNo) {
		this.idNo = idNo;
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

	public String getDeptNo() {
		return deptNo;
	}

	public void setDeptNo(String deptNo) {
		this.deptNo = deptNo;
	}

	public String getClinicType() {
		return clinicType;
	}

	public void setClinicType(String clinicType) {
		this.clinicType = clinicType;
	}

	public String getOperatorId() {
		return operatorId;
	}

	public void setOperatorId(String operatorId) {
		this.operatorId = operatorId;
	}

	public String getOperator() {
		return operator;
	}

	public void setOperator(String operator) {
		this.operator = operator;
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
    @Column(name = "SEP_TYPE", nullable = true, length = 1)
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
     * 获取appointId
     * 
     * @return appointId
     */
    public String getAppointId() {
        return this.appointId;
    }

    /**
     * 设置appointId
     * 
     * @param appointId
     */
    public void setAppointId(String appointId) {
        this.appointId = appointId;
    }

    /**
     * 获取appointNo
     * 
     * @return appointNo
     */
    public String getAppointNo() {
        return this.appointNo;
    }

    /**
     * 设置appointNo
     * 
     * @param appointNo
     */
    public void setAppointNo(String appointNo) {
        this.appointNo = appointNo;
    }

    /**
     * 获取no
     * 
     * @return no
     */
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
     * 获取disease
     * 
     * @return disease
     */
    public String getDisease() {
        return this.disease;
    }

    /**
     * 设置disease
     * 
     * @param disease
     */
    public void setDisease(String disease) {
        this.disease = disease;
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
     * 获取diseaseType
     * 
     * @return diseaseType
     */
    public String getDiseaseType() {
        return this.diseaseType;
    }

    /**
     * 设置diseaseType
     * 
     * @param diseaseType
     */
    public void setDiseaseType(String diseaseType) {
        this.diseaseType = diseaseType;
    }

    /**
     * 获取diseaseTypeName
     * 
     * @return diseaseTypeName
     */
    public String getDiseaseTypeName() {
        return this.diseaseTypeName;
    }

    /**
     * 设置diseaseTypeName
     * 
     * @param diseaseTypeName
     */
    public void setDiseaseTypeName(String diseaseTypeName) {
        this.diseaseTypeName = diseaseTypeName;
    }

    /**
     * 获取treatStart
     * 
     * @return treatStart
     */
    public Date getTreatStart() {
        return this.treatStart;
    }

    /**
     * 设置treatStart
     * 
     * @param treatStart
     */
    public void setTreatStart(Date treatStart) {
        this.treatStart = treatStart;
    }

    /**
     * 获取treatEnd
     * 
     * @return treatEnd
     */
    public Date getTreatEnd() {
        return this.treatEnd;
    }

    /**
     * 设置treatEnd
     * 
     * @param treatEnd
     */
    public void setTreatEnd(Date treatEnd) {
        this.treatEnd = treatEnd;
    }

    /**
     * 获取diagnosis
     * 
     * @return diagnosis
     */
    public String getDiagnosis() {
        return this.diagnosis;
    }

    /**
     * 设置diagnosis
     * 
     * @param diagnosis
     */
    public void setDiagnosis(String diagnosis) {
        this.diagnosis = diagnosis;
    }

    /**
     * 获取printStatus
     * 
     * @return printStatus
     */
    public String getPrintStatus() {
        return this.printStatus;
    }

    /**
     * 设置printStatus
     * 
     * @param printStatus
     */
    public void setPrintStatus(String printStatus) {
        this.printStatus = printStatus;
    }

    /**
     * 获取printCount
     * 
     * @return printCount
     */
    public Integer getPrintCount() {
        return this.printCount;
    }

    /**
     * 设置printCount
     * 
     * @param printCount
     */
    public void setPrintCount(Integer printCount) {
        this.printCount = printCount;
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
    
    
	
    
}