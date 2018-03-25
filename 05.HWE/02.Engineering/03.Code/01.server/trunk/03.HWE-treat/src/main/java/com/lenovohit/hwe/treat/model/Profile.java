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

/**
 * TREAT_PROFILE
 * 
 * @author zyus
 * @version 1.0.0 2017-12-16
 */
@Entity
@Table(name = "TREAT_PROFILE")
public class Profile extends HisAuditableModel implements java.io.Serializable {
    /** 版本号 */
    private static final long serialVersionUID = -2969951194691603037L;
    
    public static final String MEDICAL_OK = "1"; //是医保
    public static final String MEDICAL_NO = "0"; //非医保

    /** patientId */
    private String patientId;

    /** patientNo */
    private String patientNo;

    /** patientName */
    private String patientName;

    /** hosId */
    private String hosId;

    /** hosNo */
    private String hosNo;

    /** hosName */
    private String hosName;

    /** type */
    private String type;
    
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

    /** idno */
    private String idNo;

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
    
    /** total */
    private BigDecimal total;

    /** balance */
    private BigDecimal balance;

    /** acctNo */
    private String acctNo;

    /** acctStatus */
    private String acctStatus;

    /** cardNo */
    private String cardNo;

    /** cardType */
    private String cardType;

    /** cardStatus */
    private String cardStatus;

    /** openType */
    private String openType;

    /** guaranteeIdno */
    private String guaranteeIdno;

    /** guaranteeName */
    private String guaranteeName;

    /** guaranteeType */
    private String guaranteeType;

    /** status */
    private String status;
    
    private String identify;//标识业务需要 档案是否认证？
    
    private BigDecimal age;//年龄

    /**
     * 获取patientId
     * 
     * @return patientId
     */
    @Column(name = "PATIENT_ID", nullable = true, length = 32)
    public String getPatientId() {
        return this.patientId;
    }

    /**
     * 设置patientId
     * 
     * @param patientId
     */
    public void setPatientId(String patientId) {
        this.patientId = patientId;
    }

    /**
     * 获取patientNo
     * 
     * @return patientNo
     */
    @Column(name = "PATIENT_NO", nullable = true, length = 50)
    public String getPatientNo() {
        return this.patientNo;
    }

    /**
     * 设置patientNo
     * 
     * @param patientNo
     */
    public void setPatientNo(String patientNo) {
        this.patientNo = patientNo;
    }

    /**
     * 获取patientName
     * 
     * @return patientName
     */
    @Column(name = "PATIENT_NAME", nullable = true, length = 70)
    public String getPatientName() {
        return this.patientName;
    }

    /**
     * 设置patientName
     * 
     * @param patientName
     */
    public void setPatientName(String patientName) {
        this.patientName = patientName;
    }

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
     * 设置photo
     * 
     * @param photo
     */
    public void setPhoto(String photo) {
        this.photo = photo;
    }

    /**
     * 获取idno
     * 
     * @return idno
     */
    @Column(name = "ID_NO", nullable = true, length = 18)
    public String getIdNo() {
        return this.idNo;
    }

    /**
     * 设置idno
     * 
     * @param idno
     */
    public void setIdNo(String idNo) {
        this.idNo = idNo;
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
    @Column(name = "BIRTH_DAY", nullable = true, length = 10)
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
     * 获取total
     * 
     * @return total
     */
    @Column(name = "TOTAL", nullable = true)
    public BigDecimal getTotal() {
        return this.total;
    }

    /**
     * 设置total
     * 
     * @param total
     */
    public void setTotal(BigDecimal total) {
        this.total = total;
    }
    
    /**
     * 获取balance
     * 
     * @return balance
     */
    @Column(name = "BALANCE", nullable = true)
    public BigDecimal getBalance() {
        return this.balance;
    }

    /**
     * 设置balance
     * 
     * @param balance
     */
    public void setBalance(BigDecimal balance) {
        this.balance = balance;
    }

    /**
     * 获取openType
     * 
     * @return openType
     */
    @Column(name = "OPEN_TYPE", nullable = true, length = 1)
    public String getOpenType() {
        return this.openType;
    }

    /**
     * 设置openType
     * 
     * @param openType
     */
    public void setOpenType(String openType) {
        this.openType = openType;
    }

    /**
     * 获取acctNo
     * 
     * @return acctNo
     */
    @Column(name = "ACCT_NO", nullable = true, length = 50)
    public String getAcctNo() {
        return this.acctNo;
    }

    /**
     * 设置acctNo
     * 
     * @param acctNo
     */
    public void setAcctNo(String acctNo) {
        this.acctNo = acctNo;
    }

    /**
     * 获取acctStatus
     * 
     * @return acctStatus
     */
    @Column(name = "ACCT_STATUS", nullable = true, length = 1)
    public String getAcctStatus() {
        return this.acctStatus;
    }

    /**
     * 设置acctStatus
     * 
     * @param acctStatus
     */
    public void setAcctStatus(String acctStatus) {
        this.acctStatus = acctStatus;
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
     * 获取cardStatus
     * 
     * @return cardStatus
     */
    @Column(name = "CARD_STATUS", nullable = true, length = 1)
    public String getCardStatus() {
        return this.cardStatus;
    }

    /**
     * 设置cardStatus
     * 
     * @param cardStatus
     */
    public void setCardStatus(String cardStatus) {
        this.cardStatus = cardStatus;
    }

    /**
     * 获取guaranteeIdno
     * 
     * @return guaranteeIdno
     */
    @Column(name = "GUARANTEE_IDNO", nullable = true, length = 18)
    public String getGuaranteeIdno() {
        return this.guaranteeIdno;
    }

    /**
     * 设置guaranteeIdno
     * 
     * @param guaranteeIdno
     */
    public void setGuaranteeIdno(String guaranteeIdno) {
        this.guaranteeIdno = guaranteeIdno;
    }

    /**
     * 获取guaranteeName
     * 
     * @return guaranteeName
     */
    @Column(name = "GUARANTEE_NAME", nullable = true, length = 70)
    public String getGuaranteeName() {
        return this.guaranteeName;
    }

    /**
     * 设置guaranteeName
     * 
     * @param guaranteeName
     */
    public void setGuaranteeName(String guaranteeName) {
        this.guaranteeName = guaranteeName;
    }

    /**
     * 获取guaranteeType
     * 
     * @return guaranteeType
     */
    @Column(name = "GUARANTEE_TYPE", nullable = true, length = 1)
    public String getGuaranteeType() {
        return this.guaranteeType;
    }

    /**
     * 设置guaranteeType
     * 
     * @param guaranteeType
     */
    public void setGuaranteeType(String guaranteeType) {
        this.guaranteeType = guaranteeType;
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
	public String getIdentify() {
		return identify;
	}

	public void setIdentify(String identify) {
		this.identify = identify;
	}
    
}