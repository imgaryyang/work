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

package com.lenovohit.hcp.test.model;

import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.lenovohit.core.model.BaseIdModel;

/**
 * TREAT_APPOINT
 * 
 * @author zyus
 * @version 1.0.0 2017-12-16
 */
@Entity
@Table(name = "TEST_TREAT_APPOINT")
public class TestAppoint extends BaseIdModel implements java.io.Serializable {
    /** 版本号 */
    private static final long serialVersionUID = 3966085093689029677L;

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
    
    /** clinicTime */
    private String clinicTime;

    /** schId */
    private String schId;
    
    /** shcNo */
    private String schNo;
    
    /** shift */
    private String shift;

    /** shiftName */
    private String shiftName;

    /** num */
    private String num;

    /** no */
    private String no;

    /** reserveNo */
    private String reserveNo;

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

    private String mobile;
    private String idNo;
    
    /** 预约、实时是一种分类方式，需要核实医院是否有自己的分类方式 */
    private String type;

    /** regFee */
    private BigDecimal regFee;

    /** treatFee */
    private BigDecimal treatFee;

    /** totalFee */
    private BigDecimal totalFee;

    /** isRepeated */
    private String isRepeated;

    /** address */
    private String address;
    private String comment;
    private String appChannel;
    private String appUser;
    /** status */
    private String status;
    
    /** status_name */
    private String statusName;
    
    private Date appointTime;
    private Date signTime;
    private Date treatTime;
    
    private TestHospital hospital;
    
    private TestDepartment department;
    
    private TestDoctor doctor;
    
    private TestProfile profile;

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

    /**
	 * @return the clinicTime
	 */
    @Column(name = "CLINIC_TIME", nullable = true, length = 8)
	public String getClinicTime() {
		return clinicTime;
	}

	/**
	 * @param clinicTime the clinicTime to set
	 */
	public void setClinicTime(String clinicTime) {
		this.clinicTime = clinicTime;
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
     * 获取num
     * 
     * @return num
     */
    @Column(name = "NUM", nullable = true, length = 50)
    public String getNum() {
        return this.num;
    }

    /**
     * 设置num
     * 
     * @param num
     */
    public void setNum(String num) {
        this.num = num;
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
     * 获取reserveNo
     * 
     * @return reserveNo
     */
    @Column(name = "RESERVE_NO", nullable = true, length = 50)
    public String getReserveNo() {
        return this.reserveNo;
    }

    /**
     * 设置reserveNo
     * 
     * @param reserveNo
     */
    public void setReserveNo(String reserveNo) {
        this.reserveNo = reserveNo;
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

    @Column(name = "MOBILE", nullable = true, length = 50)
    public String getMobile() {
        return this.mobile;
    }
    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    @Column(name = "ID_NO", nullable = true, length = 50)
    public String getIdNo() {
        return this.idNo;
    }
    public void setIdNo(String idNo) {
        this.idNo = idNo;
    }
    /**
     * 获取预约、实时是一种分类方式，需要核实医院是否有自己的分类方式
     * 
     * @return 预约、实时是一种分类方式
     */
    @Column(name = "TYPE", nullable = true, length = 50)
    public String getType() {
        return this.type;
    }

    /**
     * 设置预约、实时是一种分类方式，需要核实医院是否有自己的分类方式
     * 
     * @param type
     *          预约、实时是一种分类方式
     */
    public void setType(String type) {
        this.type = type;
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
     * 获取isRepeated
     * 
     * @return isRepeated
     */
    @Column(name = "IS_REPEATED", nullable = true, length = 1)
    public String getIsRepeated() {
        return this.isRepeated;
    }

    /**
     * 设置isRepeated
     * 
     * @param isRepeated
     */
    public void setIsRepeated(String isRepeated) {
        this.isRepeated = isRepeated;
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

    @Column(name = "COMMENT", nullable = true, length = 1)
    public String getComment() {
        return this.comment;
    }
    public void setComment(String comment) {
        this.comment = comment;
    }
    
    @Column(name = "APP_CHANNEL", nullable = true, length = 1)
    public String getAppChannel() {
        return this.appChannel;
    }
    public void setAppChannel(String appChannel) {
        this.appChannel = appChannel;
    }
    
    @Column(name = "APP_USER", nullable = true, length = 1)
    public String getAppUser() {
        return this.appUser;
    }
    public void setAppUser(String appUser) {
        this.appUser = appUser;
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
    /**
     * 获取statusName
     * 
     * @return statusName
     */
    @Column(name = "STATUS_NAME", nullable = true, length = 50)
    public String getStatusName() {
        return this.statusName;
    }

    /**
     * 设置statusName
     * 
     * @param statusName
     */
    public void setStatusName(String statusName) {
        this.statusName = statusName;
    }

	@Transient
	public TestHospital getHospital() {
		return hospital;
	}

	public void setHospital(TestHospital hospital) {
		this.hospital = hospital;
	}
	@Transient
	public TestDepartment getDepartment() {
		return department;
	}

	public void setDepartment(TestDepartment department) {
		this.department = department;
	}
	@Transient
	public TestDoctor getDoctor() {
		return doctor;
	}

	public void setDoctor(TestDoctor doctor) {
		this.doctor = doctor;
	}
	@Transient
	public TestProfile getProfile() {
		return profile;
	}

	public void setProfile(TestProfile profile) {
		this.profile = profile;
	}

	@Column(name = "SCH_ID", nullable = true, length = 1)
	public String getSchId() {
		return schId;
	}

	public void setSchId(String schId) {
		this.schId = schId;
	}

	@Column(name = "SCH_NO", nullable = true, length = 1)
	public String getSchNo() {
		return schNo;
	}

	public void setSchNo(String schNo) {
		this.schNo = schNo;
	}
	
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    @Column(name = "APPOINT_TIME", nullable = true)
	public Date getAppointTime() {
		return appointTime;
	}

	public void setAppointTime(Date appointTime) {
		this.appointTime = appointTime;
	}

    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    @Column(name = "SIGN_TIME", nullable = true)
	public Date getSignTime() {
		return signTime;
	}

	public void setSignTime(Date signTime) {
		this.signTime = signTime;
	}
	
    @JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
    @Column(name = "TREAT_TIME", nullable = true)
	public Date getTreatTime() {
		return treatTime;
	}

	public void setTreatTime(Date treatTime) {
		this.treatTime = treatTime;
	}
}