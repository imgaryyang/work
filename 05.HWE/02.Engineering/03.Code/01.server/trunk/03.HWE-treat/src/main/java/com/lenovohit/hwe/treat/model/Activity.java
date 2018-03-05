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
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.lenovohit.hwe.base.model.AuditableModel;

/**
 * TREAT_ACTIVITY
 * 
 * @author zyus
 * @version 1.0.0 2017-12-16
 */
@Entity
@Table(name = "TREAT_ACTIVITY")
public class Activity extends AuditableModel implements java.io.Serializable {
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

    /** status */
    private String status;
    
    private Hospital hospital;
    
    private Department deptment;
    
    private Doctor doctor;
    
    private Profile profile;
    
    /** 诊疗类型 */
    private String clinicType;
    
    /** 诊疗类型名称 */
    private String clinicTypeName;
    
    /** 主诉 */
    private String complaint;
    
    //所关联的Diagnose医生诊断表里的数据
    private List<Diagnose> diagnose;
    
    //所关联的Record处方表里的数据
    private List<Record> record;
    
    //所关联的RecordDrug药物明细表的数据
    private List<RecordDrug> recordDrug;
    
    //所关联的RecordTest检查项目表的数据
    private List<RecordTest> recordTest;
    
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
     * 获取depClazz
     * 
     * @return depClazz
     */
    @Column(name = "DEP_CLAZZ", nullable = true, length = 50)
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
    @Column(name = "DEP_CLAZZ_NAME", nullable = true, length = 50)
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
     * 获取appointId
     * 
     * @return appointId
     */
    @Column(name = "APPOINT_ID", nullable = true, length = 32)
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
    @Column(name = "APPOINT_NO", nullable = true, length = 50)
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
     * 获取disease
     * 
     * @return disease
     */
    @Column(name = "DISEASE", nullable = true, length = 50)
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
    @Column(name = "DISEASE_NAME", nullable = true, length = 50)
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
    @Column(name = "DISEASE_TYPE", nullable = true, length = 1)
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
    @Column(name = "DISEASE_TYPE_NAME", nullable = true, length = 50)
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
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    @Column(name = "TREAT_START", nullable = true)
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
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    @Column(name = "TREAT_END", nullable = true)
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
    @Column(name = "DIAGNOSIS", nullable = true, length = 255)
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
    @Column(name = "PRINT_STATUS", nullable = true, length = 1)
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
    @Column(name = "PRINT_COUNT", nullable = true, length = 10)
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
	public List<Diagnose> getDiagnose() {
		return diagnose;
	}

	public void setDiagnose(List<Diagnose> diagnose) {
		this.diagnose = diagnose;
	}

	@Transient
	public List<Record> getRecord() {
		return record;
	}

	public void setRecord(List<Record> record) {
		this.record = record;
	}

	@Transient
	public List<RecordDrug> getRecordDrug() {
		return recordDrug;
	}

	public void setRecordDrug(List<RecordDrug> recordDrug) {
		this.recordDrug = recordDrug;
	}

	@Transient
	public List<RecordTest> getRecordTest() {
		return recordTest;
	}

	public void setRecordTest(List<RecordTest> recordTest) {
		this.recordTest = recordTest;
	}

	public String getClinicType() {
		return clinicType;
	}

	public void setClinicType(String clinicType) {
		this.clinicType = clinicType;
	}

	public String getClinicTypeName() {
		return clinicTypeName;
	}

	public void setClinicTypeName(String clinicTypeName) {
		this.clinicTypeName = clinicTypeName;
	}

	public String getComplaint() {
		return complaint;
	}

	public void setComplaint(String complaint) {
		this.complaint = complaint;
	}
	
	
    
    
}