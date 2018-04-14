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

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.lenovohit.hwe.base.model.AuditableModel;

/**
 * TREAT_DOCTOR
 * 
 * @author zyus
 * @version 1.0.0 2017-12-16
 */
@Entity
@Table(name = "TREAT_DOCTOR")
public class Doctor extends AuditableModel implements java.io.Serializable {
    /** 版本号 */
    private static final long serialVersionUID = 2419789612414390712L;

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

    /** no */
    private String no;

    /** name */
    private String name;

    /** pinyin */
    private String pinyin;

    /** wubi */
    private String wubi;

    /** gender */
    private String gender;

    /** birthday */
    private String birthday;

    /** age */
    private BigDecimal age;

    /** telephone */
    private String telephone;

    /** mobile */
    private String mobile;

    /** jobNum */
    private String jobNum;

    /** certNum */
    private String certNum;

    /** degrees */
    private String degrees;

    /** major */
    private String major;

    /** jobTitle */
    private String jobTitle;

    /** speciality */
    private String speciality;

    /** entryDate */
    private String entryDate;

    /** workedYears */
    private BigDecimal workedYears;

    /** photo */
    private String photo;

    /** isExpert */
    private String isExpert;

    /** treatFee */
    private BigDecimal treatFee;

    /** regFee */
    private BigDecimal regFee;

    /** sort */
    private Integer sort;

    /** status */
    private String status;

    
    private Hospital hospital;
    
    private Department deptment;
    
    
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
     * 获取name
     * 
     * @return name
     */
    @Column(name = "NAME", nullable = true, length = 70)
    public String getName() {
        return this.name;
    }

    /**
     * 设置name
     * 
     * @param name
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * 获取pinyin
     * 
     * @return pinyin
     */
    @Column(name = "PINYIN", nullable = true, length = 50)
    public String getPinyin() {
        return this.pinyin;
    }

    /**
     * 设置pinyin
     * 
     * @param pinyin
     */
    public void setPinyin(String pinyin) {
        this.pinyin = pinyin;
    }

    /**
     * 获取wubi
     * 
     * @return wubi
     */
    @Column(name = "WUBI", nullable = true, length = 50)
    public String getWubi() {
        return this.wubi;
    }

    /**
     * 设置wubi
     * 
     * @param wubi
     */
    public void setWubi(String wubi) {
        this.wubi = wubi;
    }

    /**
     * 获取gender
     * 
     * @return gender
     */
    @Column(name = "GENDER", nullable = true, length = 1)
    public String getGender() {
        return this.gender;
    }

    /**
     * 设置gender
     * 
     * @param gender
     */
    public void setGender(String gender) {
        this.gender = gender;
    }

    /**
     * 获取birthday
     * 
     * @return birthday
     */
    @Column(name = "BIRTHDAY", nullable = true, length = 10)
    public String getBirthday() {
        return this.birthday;
    }

    /**
     * 设置birthday
     * 
     * @param birthday
     */
    public void setBirthday(String birthday) {
        this.birthday = birthday;
    }

    /**
     * 获取age
     * 
     * @return age
     */
    @Transient
    public BigDecimal getAge() {
        return this.age;
    }

    /**
     * 设置age
     * 
     * @param age
     */
    public void setAge(BigDecimal age) {
        this.age = age;
    }

    /**
     * 获取telephone
     * 
     * @return telephone
     */
    @Column(name = "TELEPHONE", nullable = true, length = 20)
    public String getTelephone() {
        return this.telephone;
    }

    /**
     * 设置telephone
     * 
     * @param telephone
     */
    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    /**
     * 获取mobile
     * 
     * @return mobile
     */
    @Column(name = "MOBILE", nullable = true, length = 20)
    public String getMobile() {
        return this.mobile;
    }

    /**
     * 设置mobile
     * 
     * @param mobile
     */
    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    /**
     * 获取jobNum
     * 
     * @return jobNum
     */
    @Column(name = "JOB_NUM", nullable = true, length = 30)
    public String getJobNum() {
        return this.jobNum;
    }

    /**
     * 设置jobNum
     * 
     * @param jobNum
     */
    public void setJobNum(String jobNum) {
        this.jobNum = jobNum;
    }

    /**
     * 获取certNum
     * 
     * @return certNum
     */
    @Column(name = "CERT_NUM", nullable = true, length = 50)
    public String getCertNum() {
        return this.certNum;
    }

    /**
     * 设置certNum
     * 
     * @param certNum
     */
    public void setCertNum(String certNum) {
        this.certNum = certNum;
    }

    /**
     * 获取degrees
     * 
     * @return degrees
     */
    @Column(name = "DEGREES", nullable = true, length = 20)
    public String getDegrees() {
        return this.degrees;
    }

    /**
     * 设置degrees
     * 
     * @param degrees
     */
    public void setDegrees(String degrees) {
        this.degrees = degrees;
    }

    /**
     * 获取major
     * 
     * @return major
     */
    @Column(name = "MAJOR", nullable = true, length = 30)
    public String getMajor() {
        return this.major;
    }

    /**
     * 设置major
     * 
     * @param major
     */
    public void setMajor(String major) {
        this.major = major;
    }

    /**
     * 获取jobTitle
     * 
     * @return jobTitle
     */
    @Column(name = "JOB_TITLE", nullable = true, length = 20)
    public String getJobTitle() {
        return this.jobTitle;
    }

    /**
     * 设置jobTitle
     * 
     * @param jobTitle
     */
    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    /**
     * 获取speciality
     * 
     * @return speciality
     */
    @Column(name = "SPECIALITY", nullable = true, length = 500)
    public String getSpeciality() {
        return this.speciality;
    }

    /**
     * 设置speciality
     * 
     * @param speciality
     */
    public void setSpeciality(String speciality) {
        this.speciality = speciality;
    }

    /**
     * 获取entryDate
     * 
     * @return entryDate
     */
    @Column(name = "ENTRY_DATE", nullable = true, length = 10)
    public String getEntryDate() {
        return this.entryDate;
    }

    /**
     * 设置entryDate
     * 
     * @param entryDate
     */
    public void setEntryDate(String entryDate) {
        this.entryDate = entryDate;
    }

    /**
     * 获取workedYears
     * 
     * @return workedYears
     */
    @Column(name = "WORKED_YEARS", nullable = true)
    public BigDecimal getWorkedYears() {
        return this.workedYears;
    }

    /**
     * 设置workedYears
     * 
     * @param workedYears
     */
    public void setWorkedYears(BigDecimal workedYears) {
        this.workedYears = workedYears;
    }

    /**
     * 获取photo
     * 
     * @return photo
     */
    @Column(name = "PHOTO", nullable = true, length = 50)
    public String getPhoto() {
        return this.photo;
    }

    /**
     * 设置photo
     * 
     * @param photo
     */
    public void setPhoto(String photo) {
        this.photo = photo;
    }

    /**
     * 获取isExpert
     * 
     * @return isExpert
     */
    @Column(name = "IS_EXPERT", nullable = true, length = 1)
    public String getIsExpert() {
        return this.isExpert;
    }

    /**
     * 设置isExpert
     * 
     * @param isExpert
     */
    public void setIsExpert(String isExpert) {
        this.isExpert = isExpert;
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
     * 获取sort
     * 
     * @return sort
     */
    @Column(name = "SORTNO", nullable = true, length = 10)
    public Integer getSort() {
        return this.sort;
    }

    /**
     * 设置sort
     * 
     * @param sort
     */
    public void setSort(Integer sort) {
        this.sort = sort;
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
	
}