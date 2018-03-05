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
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.lenovohit.hwe.base.model.AuditableModel;

/**
 * TREAT_PATIENT
 * 
 * @author zyus
 * @version 1.0.0 2017-12-16
 */
@Entity
@Table(name = "TREAT_PATIENT")
public class Patient extends AuditableModel implements java.io.Serializable {
    /** 版本号 */
    private static final long serialVersionUID = 1784137895483180802L;

    /** no */
    private String no;
    
    /** name */
    private String name;

    /** wubi */
    private String wubi;

    /** pinyin */
    private String pinyin;

    /** photo */
    private String photo;

    /** idNo */
    private String idNo;

    /** idIssuer */
    private String idIssuer;

    /** idEffective */
    private String idEffective;

    /** miNo */
    private String miNo;

    /** miCardNo */
    private String miCardNo;

    /** company */
    private String company;

    /** unitCode */
    private String unitCode;

    /** mobile */
    private String mobile;

    /** phone */
    private String phone;

    /** email */
    private String email;

    /** gender */
    private String gender;

    /** birthday */
    private String birthday;

    /** nationality */
    private String nationality;

    /** nation */
    private String nation;

    /** origin */
    private String origin;

    /** height */
    private BigDecimal height;

    /** weight */
    private BigDecimal weight;

    /** marriage */
    private String marriage;

    /** occupation */
    private String occupation;

    /** address */
    private String address;

    /** type */
    private String type;

    /** status */
    private String status;
    
    private BigDecimal age;
    
    private Set<Profile> profiles;

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
     * @return
     */
    public String getName() {
		return name;
	}
    /**
     * 设置name
     * @param name
     */
	public void setName(String name) {
		this.name = name;
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
     * 获取photo
     * 
     * @return photo
     */
    @Column(name = "PHOTO", nullable = true, length = 200)
    public String getPhoto() {
        return this.photo;
    }

    /**
     * 设置头像
     * 
     * @param photo
     */
    public void setPhoto(String photo) {
        this.photo = photo;
    }

    /**
     * 获取idNo
     * 
     * @return idNo
     */
    @Column(name = "ID_NO", nullable = true, length = 18)
    public String getIdNo() {
        return this.idNo;
    }

    /**
     * 设置idNo
     * 
     * @param idNo
     */
    public void setIdNo(String idNo) {
        this.idNo = idNo;
    }

    /**
     * 获取idIssuer
     * 
     * @return idIssuer
     */
    @Column(name = "ID_ISSUER", nullable = true, length = 50)
    public String getIdIssuer() {
        return this.idIssuer;
    }

    /**
     * 设置idIssuer
     * 
     * @param idIssuer
     */
    public void setIdIssuer(String idIssuer) {
        this.idIssuer = idIssuer;
    }

    /**
     * 获取idEffective
     * 
     * @return idEffective
     */
    @Column(name = "ID_EFFECTIVE", nullable = true, length = 10)
    public String getIdEffective() {
        return this.idEffective;
    }

    /**
     * 设置idEffective
     * 
     * @param idEffective
     */
    public void setIdEffective(String idEffective) {
        this.idEffective = idEffective;
    }

    /**
     * 获取miNo
     * 
     * @return miNo
     */
    @Column(name = "MI_NO", nullable = true, length = 20)
    public String getMiNo() {
        return this.miNo;
    }

    /**
     * 设置miNo
     * 
     * @param miNo
     */
    public void setMiNo(String miNo) {
        this.miNo = miNo;
    }

    /**
     * 获取miCardNo
     * 
     * @return miCardNo
     */
    @Column(name = "MI_CARD_NO", nullable = true, length = 20)
    public String getMiCardNo() {
        return this.miCardNo;
    }

    /**
     * 设置miCardNo
     * 
     * @param miCardNo
     */
    public void setMiCardNo(String miCardNo) {
        this.miCardNo = miCardNo;
    }

    /**
     * 获取company
     * 
     * @return company
     */
    @Column(name = "COMPANY", nullable = true, length = 50)
    public String getCompany() {
        return this.company;
    }

    /**
     * 设置company
     * 
     * @param company
     */
    public void setCompany(String company) {
        this.company = company;
    }

    /**
     * 获取unitCode
     * 
     * @return unitCode
     */
    @Column(name = "UNIT_CODE", nullable = true, length = 20)
    public String getUnitCode() {
        return this.unitCode;
    }

    /**
     * 设置unitCode
     * 
     * @param unitCode
     */
    public void setUnitCode(String unitCode) {
        this.unitCode = unitCode;
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
     * 获取phone
     * 
     * @return phone
     */
    @Column(name = "PHONE", nullable = true, length = 20)
    public String getPhone() {
        return this.phone;
    }

    /**
     * 设置phone
     * 
     * @param phone
     */
    public void setPhone(String phone) {
        this.phone = phone;
    }

    /**
     * 获取email
     * 
     * @return email
     */
    @Column(name = "EMAIL", nullable = true, length = 50)
    public String getEmail() {
        return this.email;
    }

    /**
     * 设置email
     * 
     * @param email
     */
    public void setEmail(String email) {
        this.email = email;
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
     * 获取nationality
     * 
     * @return nationality
     */
    @Column(name = "NATIONALITY", nullable = true, length = 50)
    public String getNationality() {
        return this.nationality;
    }

    /**
     * 设置nationality
     * 
     * @param nationality
     */
    public void setNationality(String nationality) {
        this.nationality = nationality;
    }

    /**
     * 获取nation
     * 
     * @return nation
     */
    @Column(name = "NATION", nullable = true, length = 50)
    public String getNation() {
        return this.nation;
    }

    /**
     * 设置nation
     * 
     * @param nation
     */
    public void setNation(String nation) {
        this.nation = nation;
    }

    /**
     * 获取origin
     * 
     * @return origin
     */
    @Column(name = "ORIGIN", nullable = true, length = 50)
    public String getOrigin() {
        return this.origin;
    }

    /**
     * 设置origin
     * 
     * @param origin
     */
    public void setOrigin(String origin) {
        this.origin = origin;
    }

    /**
     * 获取height
     * 
     * @return height
     */
    @Column(name = "HEIGHT", nullable = true)
    public BigDecimal getHeight() {
        return this.height;
    }

    /**
     * 设置height
     * 
     * @param height
     */
    public void setHeight(BigDecimal height) {
        this.height = height;
    }

    /**
     * 获取weight
     * 
     * @return weight
     */
    @Column(name = "WEIGHT", nullable = true)
    public BigDecimal getWeight() {
        return this.weight;
    }

    /**
     * 设置weight
     * 
     * @param weight
     */
    public void setWeight(BigDecimal weight) {
        this.weight = weight;
    }

    /**
     * 获取marriage
     * 
     * @return marriage
     */
    @Column(name = "MARRIAGE", nullable = true, length = 1)
    public String getMarriage() {
        return this.marriage;
    }

    /**
     * 设置marriage
     * 
     * @param marriage
     */
    public void setMarriage(String marriage) {
        this.marriage = marriage;
    }

    /**
     * 获取occupation
     * 
     * @return occupation
     */
    @Column(name = "OCCUPATION", nullable = true, length = 10)
    public String getOccupation() {
        return this.occupation;
    }

    /**
     * 设置occupation
     * 
     * @param occupation
     */
    public void setOccupation(String occupation) {
        this.occupation = occupation;
    }

    /**
     * 获取address
     * 
     * @return address
     */
    @Column(name = "ADDRESS", nullable = true, length = 200)
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
     * 获取type
     * 
     * @return type
     */
    @Column(name = "TYPE", nullable = true, length = 1)
    public String getType() {
        return this.type;
    }

    /**
     * 设置type
     * 
     * @param type
     */
    public void setType(String type) {
        this.type = type;
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
	public Set<Profile> getProfiles() {
		return profiles;
	}

	public void setProfiles(Set<Profile> profiles) {
		this.profiles = profiles;
	}
    
}