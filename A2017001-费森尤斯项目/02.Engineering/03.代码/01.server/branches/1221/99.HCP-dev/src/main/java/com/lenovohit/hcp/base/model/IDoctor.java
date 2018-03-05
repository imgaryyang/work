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

import java.math.BigDecimal;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;



/**
 * TREAT_DOCTOR
 * 
 * @author zyus
 * @version 1.0.0 2017-12-16
 */

public class IDoctor  implements java.io.Serializable {
    /** 版本号 */
    private static final long serialVersionUID = 2419789612414390712L;

    /** hosId */

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

    /** sortno */
    private Integer sortno;

    /** status */
    private String status;

    
    private Hospital hospital;
    
   
    

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
     * 获取name
     * 
     * @return name
     */
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
     * 获取sortno
     * 
     * @return sortno
     */
    public Integer getSortno() {
        return this.sortno;
    }

    /**
     * 设置sortno
     * 
     * @param sortno
     */
    public void setSortno(Integer sortno) {
        this.sortno = sortno;
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
   
   
	public Hospital getHospital() {
		return hospital;
	}

	public void setHospital(Hospital hospital) {
		this.hospital = hospital;
	}
	
	
    
}