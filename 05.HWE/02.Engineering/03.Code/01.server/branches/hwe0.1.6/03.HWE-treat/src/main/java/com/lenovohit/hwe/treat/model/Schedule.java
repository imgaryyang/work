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

import com.lenovohit.hwe.base.model.AuditableModel;

/**
 * TREAT_SCHEDULE
 * 
 * @author zyus
 * @version 1.0.0 2017-12-16
 */
@Entity
@Table(name = "TREAT_SCHEDULE")
public class Schedule extends AuditableModel implements java.io.Serializable {
    /** 版本号 */
    private static final long serialVersionUID = -5641462371192966513L;

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

    /** depPinyin */
    private String depPinyin;

    /** depWubi */
    private String depWubi;

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

    /** docPinyin */
    private String docPinyin;

    /** docWubi */
    private String docWubi;
    
    /** clinicType */
    private String clinicType;

    /** clinicTypeName */
    private String clinicTypeName;

    /** clinicDate */
    private String clinicDate;
    
    /** no */
    private String no;

    /** shift */
    private String shift;

    /** shiftName */
    private String shiftName;

    /** dutyStart */
    private Date dutyStart;

    /** dutyEnd */
    private Date dutyEnd;

    /** totalNum */
    private Integer totalNum;

    /** enableNum */
    private Integer enableNum;

    /** disableNum */
    private Integer disableNum;

    /** regFee */
    private BigDecimal regFee;

    /** treatFee */
    private BigDecimal treatFee;

    /** totalFee */
    private BigDecimal totalFee;

    /** address */
    private String address;

    /** status */
    private String status;

    
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
     * 获取depPinyin
     * 
     * @return depPinyin
     */
    @Column(name = "DEP_PINYIN", nullable = true, length = 50)
    public String getDepPinyin() {
        return this.depPinyin;
    }

    /**
     * 设置depPinyin
     * 
     * @param depPinyin
     */
    public void setDepPinyin(String depPinyin) {
        this.depPinyin = depPinyin;
    }

    /**
     * 获取depWubi
     * 
     * @return depWubi
     */
    @Column(name = "DEP_WUBI", nullable = true, length = 50)
    public String getDepWubi() {
        return this.depWubi;
    }

    /**
     * 设置depWubi
     * 
     * @param depWubi
     */
    public void setDepWubi(String depWubi) {
        this.depWubi = depWubi;
    }

    /**
     * 获取sepId
     * 
     * @return sepId
     */
    @Column(name = "SEP_ID", nullable = true, length = 32)
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
    @Column(name = "SEP_CODE", nullable = true, length = 50)
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
    @Column(name = "SEP_NAME", nullable = true, length = 50)
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
     * 获取docPinyin
     * 
     * @return docPinyin
     */
    @Column(name = "DOC_PINYIN", nullable = true, length = 50)
    public String getDocPinyin() {
        return this.docPinyin;
    }

    /**
     * 设置docPinyin
     * 
     * @param docPinyin
     */
    public void setDocPinyin(String docPinyin) {
        this.docPinyin = docPinyin;
    }

    /**
     * 获取docWubi
     * 
     * @return docWubi
     */
    @Column(name = "DOC_WUBI", nullable = true, length = 50)
    public String getDocWubi() {
        return this.docWubi;
    }

    /**
     * 设置docWubi
     * 
     * @param docWubi
     */
    public void setDocWubi(String docWubi) {
        this.docWubi = docWubi;
    }

    /**
     * 获取clinicType
     * 
     * @return clinicType
     */
    @Column(name = "CLINIC_TYPE", nullable = true, length = 10)
    public String getClinicType() {
        return this.clinicType;
    }

    /**
     * 设置clinicType
     * 
     * @param clinicType
     */
    public void setClinicType(String clinicType) {
        this.clinicType = clinicType;
    }

    /**
     * 获取clinicTypeName
     * 
     * @return clinicTypeName
     */
    @Column(name = "CLINIC_TYPE_NAME", nullable = true, length = 50)
    public String getClinicTypeName() {
        return this.clinicTypeName;
    }

    /**
     * 设置clinicTypeName
     * 
     * @param clinicTypeName
     */
    public void setClinicTypeName(String clinicTypeName) {
        this.clinicTypeName = clinicTypeName;
    }

    /**
     * 获取clinicDate
     * 
     * @return clinicDate
     */
    @Column(name = "CLINIC_DATE", nullable = true, length = 10)
    public String getClinicDate() {
        return this.clinicDate;
    }

    /**
     * 设置clinicDate
     * 
     * @param clinicDate
     */
    public void setClinicDate(String clinicDate) {
        this.clinicDate = clinicDate;
    }

    @Column(name = "NO", nullable = true, length = 50)
    public String getNo() {
		return this.no;
	}

	public void setNo(String no) {
		this.no = no;
	}
	
	/**
     * 获取shift
     * 
     * @return shift
     */
    @Column(name = "SHIFT", nullable = true, length = 1)
    public String getShift() {
        return this.shift;
    }

    /**
     * 设置shift
     * 
     * @param shift
     */
    public void setShift(String shift) {
        this.shift = shift;
    }

    /**
     * 获取shiftName
     * 
     * @return shiftName
     */
    @Column(name = "SHIFT_NAME", nullable = true, length = 50)
    public String getShiftName() {
        return this.shiftName;
    }

    /**
     * 设置shiftName
     * 
     * @param shiftName
     */
    public void setShiftName(String shiftName) {
        this.shiftName = shiftName;
    }

    /**
     * 获取dutyStart
     * 
     * @return dutyStart
     */
    @Column(name = "DUTY_START", nullable = true)
    public Date getDutyStart() {
        return this.dutyStart;
    }

    /**
     * 设置dutyStart
     * 
     * @param dutyStart
     */
    public void setDutyStart(Date dutyStart) {
        this.dutyStart = dutyStart;
    }

    /**
     * 获取dutyEnd
     * 
     * @return dutyEnd
     */
    @Column(name = "DUTY_END", nullable = true)
    public Date getDutyEnd() {
        return this.dutyEnd;
    }

    /**
     * 设置dutyEnd
     * 
     * @param dutyEnd
     */
    public void setDutyEnd(Date dutyEnd) {
        this.dutyEnd = dutyEnd;
    }

    /**
     * 获取totalNum
     * 
     * @return totalNum
     */
    @Column(name = "TOTAL_NUM", nullable = true, length = 10)
    public Integer getTotalNum() {
        return this.totalNum;
    }

    /**
     * 设置totalNum
     * 
     * @param totalNum
     */
    public void setTotalNum(Integer totalNum) {
        this.totalNum = totalNum;
    }

    /**
     * 获取enableNum
     * 
     * @return enableNum
     */
    @Column(name = "ENABLE_NUM", nullable = true, length = 10)
    public Integer getEnableNum() {
        return this.enableNum;
    }

    /**
     * 设置enableNum
     * 
     * @param enableNum
     */
    public void setEnableNum(Integer enableNum) {
        this.enableNum = enableNum;
    }

    /**
     * 获取disableNum
     * 
     * @return disableNum
     */
    @Column(name = "DISABLE_NUM", nullable = true, length = 10)
    public Integer getDisableNum() {
        return this.disableNum;
    }

    /**
     * 设置disableNum
     * 
     * @param disableNum
     */
    public void setDisableNum(Integer disableNum) {
        this.disableNum = disableNum;
    }

    /**
     * 获取regFee
     * 
     * @return regFee
     */
    @Column(name = "REG_FEE", nullable = true)
    public BigDecimal getRegFee() {
        return this.regFee;
    }

    /**
     * 设置regFee
     * 
     * @param regFee
     */
    public void setRegFee(BigDecimal regFee) {
        this.regFee = regFee;
    }

    /**
     * 获取treatFee
     * 
     * @return treatFee
     */
    @Column(name = "TREAT_FEE", nullable = true)
    public BigDecimal getTreatFee() {
        return this.treatFee;
    }

    /**
     * 设置treatFee
     * 
     * @param treatFee
     */
    public void setTreatFee(BigDecimal treatFee) {
        this.treatFee = treatFee;
    }

    /**
     * 获取totalFee
     * 
     * @return totalFee
     */
    @Column(name = "TOTAL_FEE", nullable = true)
    public BigDecimal getTotalFee() {
        return this.totalFee;
    }

    /**
     * 设置totalFee
     * 
     * @param totalFee
     */
    public void setTotalFee(BigDecimal totalFee) {
        this.totalFee = totalFee;
    }

    /**
     * 获取address
     * 
     * @return address
     */
    @Column(name = "ADDRESS", nullable = true, length = 255)
    public String getAddress() {
        return this.address;
    }

    /**
     * 设置address
     * 
     * @param address
     */
    public void setAddress(String address) {
        this.address = address;
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

}