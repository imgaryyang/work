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

package com.lenovohit.hwe.org.model;

import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

import com.lenovohit.hwe.base.model.AuditableModel;

/**
 * HWE_ORG
 * 
 * @author zyus
 * @version 1.0.0 2017-12-14
 */
@Entity
@Table(name = "HWE_ORG")
public class Org extends AuditableModel implements java.io.Serializable {
    /** 版本号 */
    private static final long serialVersionUID = 2117244735501880180L;

    /** custCode */
    private String custCode;

    /** brcCode */
    private String brcCode;

    /** name */
    private String name;

    /** enName */
    private String enName;

    /** shortName */
    private String shortName;

    /** idType */
    private String idType;

    /** idNo */
    private String idNo;

    /** visaDate */
    private String visaDate;

    /** effectiveDate */
    private String effectiveDate;

    /** expiredDate */
    private String expiredDate;

    /** visaAddr */
    private String visaAddr;

    /** categry */
    private String categry;

    /** type */
    private String type;

    /** 类别码
            第一位：1-代发 0-非代发
            第二位：1-易健康接入医院 0-非易健康接入医院
            第三位：1-易健康接入药店 0-非易健康接入药店
            第四位：1-收费机构 0-非收费机构
            第五位：1/0 是否社保
            第六位：1/0 是否卫计委
            第七位：1/0 是否合作银行
            第八位：1/0 是否平台运营机构
             */
    private String type2;

    /** orgNo */
    private String orgNo;

    /** licnum */
    private String licnum;

    /** siId */
    private String siId;

    /** employees */
    private Integer employees;

    /** registeredCapital */
    private Integer registeredCapital;

    /** areaCode */
    private String areaCode;

    /** areaName */
    private String areaName;

    /** memo */
    private String memo;

    /** lvl */
    private Integer lvl;

    /** cascad */
    private String cascad;

    /** isLeaf */
    private String isLeaf;

    /** phone */
    private String phone;

    /** phone1 */
    private String phone1;

    /** mobile */
    private String mobile;

    /** mobile1 */
    private String mobile1;

    /** zip */
    private String zip;

    /** province */
    private String province;

    /** city */
    private String city;

    /** address */
    private String address;

    /** status */
    private String status;

    /** parent */
    private Org parent;
    
    private Set<Org> children;
	private Set<Dept> depts;
	private Set<User> users;
    
    /**
     * 获取custCode
     * 
     * @return custCode
     */
    @Column(name = "CUST_CODE", nullable = true, length = 16)
    public String getCustCode() {
        return this.custCode;
    }

    /**
     * 设置custCode
     * 
     * @param custCode
     */
    public void setCustCode(String custCode) {
        this.custCode = custCode;
    }

    /**
     * 获取brcCode
     * 
     * @return brcCode
     */
    @Column(name = "BRC_CODE", nullable = true, length = 50)
    public String getBrcCode() {
        return this.brcCode;
    }

    /**
     * 设置brcCode
     * 
     * @param brcCode
     */
    public void setBrcCode(String brcCode) {
        this.brcCode = brcCode;
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
     * 获取enName
     * 
     * @return enName
     */
    @Column(name = "EN_NAME", nullable = true, length = 50)
    public String getEnName() {
        return this.enName;
    }

    /**
     * 设置enName
     * 
     * @param enName
     */
    public void setEnName(String enName) {
        this.enName = enName;
    }

    /**
     * 获取shortName
     * 
     * @return shortName
     */
    @Column(name = "SHORT_NAME", nullable = true, length = 50)
    public String getShortName() {
        return this.shortName;
    }

    /**
     * 设置shortName
     * 
     * @param shortName
     */
    public void setShortName(String shortName) {
        this.shortName = shortName;
    }

    /**
     * 获取idType
     * 
     * @return idType
     */
    @Column(name = "ID_TYPE", nullable = true, length = 2)
    public String getIdType() {
        return this.idType;
    }

    /**
     * 设置idType
     * 
     * @param idType
     */
    public void setIdType(String idType) {
        this.idType = idType;
    }

    /**
     * 获取idNo
     * 
     * @return idNo
     */
    @Column(name = "ID_NO", nullable = true, length = 50)
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
     * 获取visaDate
     * 
     * @return visaDate
     */
    @Column(name = "VISA_DATE", nullable = true, length = 10)
    public String getVisaDate() {
        return this.visaDate;
    }

    /**
     * 设置visaDate
     * 
     * @param visaDate
     */
    public void setVisaDate(String visaDate) {
        this.visaDate = visaDate;
    }

    /**
     * 获取effectiveDate
     * 
     * @return effectiveDate
     */
    @Column(name = "EFFECTIVE_DATE", nullable = true, length = 10)
    public String getEffectiveDate() {
        return this.effectiveDate;
    }

    /**
     * 设置effectiveDate
     * 
     * @param effectiveDate
     */
    public void setEffectiveDate(String effectiveDate) {
        this.effectiveDate = effectiveDate;
    }

    /**
     * 获取expiredDate
     * 
     * @return expiredDate
     */
    @Column(name = "EXPIRED_DATE", nullable = true, length = 10)
    public String getExpiredDate() {
        return this.expiredDate;
    }

    /**
     * 设置expiredDate
     * 
     * @param expiredDate
     */
    public void setExpiredDate(String expiredDate) {
        this.expiredDate = expiredDate;
    }

    /**
     * 获取visaAddr
     * 
     * @return visaAddr
     */
    @Column(name = "VISA_ADDR", nullable = true, length = 255)
    public String getVisaAddr() {
        return this.visaAddr;
    }

    /**
     * 设置visaAddr
     * 
     * @param visaAddr
     */
    public void setVisaAddr(String visaAddr) {
        this.visaAddr = visaAddr;
    }

    /**
     * 获取categry
     * 
     * @return categry
     */
    @Column(name = "CATEGRY", nullable = true, length = 50)
    public String getCategry() {
        return this.categry;
    }

    /**
     * 设置categry
     * 
     * @param categry
     */
    public void setCategry(String categry) {
        this.categry = categry;
    }

    /**
     * 获取type
     * 
     * @return type
     */
    @Column(name = "TYPE", nullable = true, length = 10)
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
     * 获取类别码
            第一位：1-代发 0-非代发
            第二位：1-易健康接入医院 0-非易健康接入医院
            第三位：1-易健康接入药店 0-非易健康接入药店
            第四位：1-收费机构 0-非收费机构
            第五位：1/0 是否社保
            第六位：1/0 是否卫计委
            第七位：1/0 是否合作银行
            第八位：1/0 是否平台运营机构
            
     * 
     * @return 类别码
            第一位
     */
    @Column(name = "TYPE2", nullable = true, length = 10)
    public String getType2() {
        return this.type2;
    }

    /**
     * 设置类别码
            第一位：1-代发 0-非代发
            第二位：1-易健康接入医院 0-非易健康接入医院
            第三位：1-易健康接入药店 0-非易健康接入药店
            第四位：1-收费机构 0-非收费机构
            第五位：1/0 是否社保
            第六位：1/0 是否卫计委
            第七位：1/0 是否合作银行
            第八位：1/0 是否平台运营机构
            
     * 
     * @param type2
     *          类别码
            第一位
     */
    public void setType2(String type2) {
        this.type2 = type2;
    }

    /**
     * 获取orgNo
     * 
     * @return orgNo
     */
    @Column(name = "ORG_NO", nullable = true, length = 50)
    public String getOrgNo() {
        return this.orgNo;
    }

    /**
     * 设置orgNo
     * 
     * @param orgNo
     */
    public void setOrgNo(String orgNo) {
        this.orgNo = orgNo;
    }

    /**
     * 获取licnum
     * 
     * @return licnum
     */
    @Column(name = "LICNUM", nullable = true, length = 50)
    public String getLicnum() {
        return this.licnum;
    }

    /**
     * 设置licnum
     * 
     * @param licnum
     */
    public void setLicnum(String licnum) {
        this.licnum = licnum;
    }

    /**
     * 获取siId
     * 
     * @return siId
     */
    @Column(name = "SI_ID", nullable = true, length = 50)
    public String getSiId() {
        return this.siId;
    }

    /**
     * 设置siId
     * 
     * @param siId
     */
    public void setSiId(String siId) {
        this.siId = siId;
    }

    /**
     * 获取employees
     * 
     * @return employees
     */
    @Column(name = "EMPLOYEES", nullable = true, length = 10)
    public Integer getEmployees() {
        return this.employees;
    }

    /**
     * 设置employees
     * 
     * @param employees
     */
    public void setEmployees(Integer employees) {
        this.employees = employees;
    }

    /**
     * 获取registeredCapital
     * 
     * @return registeredCapital
     */
    @Column(name = "REGISTERED_CAPITAL", nullable = true, length = 10)
    public Integer getRegisteredCapital() {
        return this.registeredCapital;
    }

    /**
     * 设置registeredCapital
     * 
     * @param registeredCapital
     */
    public void setRegisteredCapital(Integer registeredCapital) {
        this.registeredCapital = registeredCapital;
    }

    /**
     * 获取areaCode
     * 
     * @return areaCode
     */
    @Column(name = "AREA_CODE", nullable = true, length = 6)
    public String getAreaCode() {
        return this.areaCode;
    }

    /**
     * 设置areaCode
     * 
     * @param areaCode
     */
    public void setAreaCode(String areaCode) {
        this.areaCode = areaCode;
    }

    /**
     * 获取areaName
     * 
     * @return areaName
     */
    @Column(name = "AREA_NAME", nullable = true, length = 255)
    public String getAreaName() {
        return this.areaName;
    }

    /**
     * 设置areaName
     * 
     * @param areaName
     */
    public void setAreaName(String areaName) {
        this.areaName = areaName;
    }

    /**
     * 获取memo
     * 
     * @return memo
     */
    @Column(name = "MEMO", nullable = true, length = 500)
    public String getMemo() {
        return this.memo;
    }

    /**
     * 设置memo
     * 
     * @param memo
     */
    public void setMemo(String memo) {
        this.memo = memo;
    }

    /**
     * 获取lvl
     * 
     * @return lvl
     */
    @Column(name = "LVL", nullable = true, length = 10)
    public Integer getLvl() {
        return this.lvl;
    }

    /**
     * 设置lvl
     * 
     * @param lvl
     */
    public void setLvl(Integer lvl) {
        this.lvl = lvl;
    }

    /**
     * 获取cascad
     * 
     * @return cascad
     */
    @Column(name = "CASCAD", nullable = true, length = 50)
    public String getCascad() {
        return this.cascad;
    }

    /**
     * 设置cascad
     * 
     * @param cascad
     */
    public void setCascad(String cascad) {
        this.cascad = cascad;
    }

    /**
     * 获取isLeaf
     * 
     * @return isLeaf
     */
    @Column(name = "IS_LEAF", nullable = true, length = 1)
    public String getIsLeaf() {
        return this.isLeaf;
    }

    /**
     * 设置isLeaf
     * 
     * @param isLeaf
     */
    public void setIsLeaf(String isLeaf) {
        this.isLeaf = isLeaf;
    }

    /**
     * 获取phone
     * 
     * @return phone
     */
    @Column(name = "PHONE", nullable = true, length = 50)
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
     * 获取phone1
     * 
     * @return phone1
     */
    @Column(name = "PHONE1", nullable = true, length = 50)
    public String getPhone1() {
        return this.phone1;
    }

    /**
     * 设置phone1
     * 
     * @param phone1
     */
    public void setPhone1(String phone1) {
        this.phone1 = phone1;
    }

    /**
     * 获取mobile
     * 
     * @return mobile
     */
    @Column(name = "MOBILE", nullable = true, length = 50)
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
     * 获取mobile1
     * 
     * @return mobile1
     */
    @Column(name = "MOBILE1", nullable = true, length = 50)
    public String getMobile1() {
        return this.mobile1;
    }

    /**
     * 设置mobile1
     * 
     * @param mobile1
     */
    public void setMobile1(String mobile1) {
        this.mobile1 = mobile1;
    }

    /**
     * 获取zip
     * 
     * @return zip
     */
    @Column(name = "ZIP", nullable = true, length = 6)
    public String getZip() {
        return this.zip;
    }

    /**
     * 设置zip
     * 
     * @param zip
     */
    public void setZip(String zip) {
        this.zip = zip;
    }

    /**
     * 获取province
     * 
     * @return province
     */
    @Column(name = "PROVINCE", nullable = true, length = 6)
    public String getProvince() {
        return this.province;
    }

    /**
     * 设置province
     * 
     * @param province
     */
    public void setProvince(String province) {
        this.province = province;
    }

    /**
     * 获取city
     * 
     * @return city
     */
    @Column(name = "CITY", nullable = true, length = 6)
    public String getCity() {
        return this.city;
    }

    /**
     * 设置city
     * 
     * @param city
     */
    public void setCity(String city) {
        this.city = city;
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
    
    /**
     * 获取parent
     * 
     * @return parent
     */
    @ManyToOne(cascade = CascadeType.REFRESH, fetch = FetchType.LAZY, optional = true)
	@JoinColumn(name = "PARENT_ID",  nullable = true)
	@NotFound(action=NotFoundAction.IGNORE)
    public Org getParent() {
        return this.parent;
    }

    /**
     * 设置parent
     * 
     * @param parent
     */
    public void setParent(Org parent) {
        this.parent = parent;
    }
    
    @Transient
	public Set<Org> getChildren() {
		return children;
	}

	public void setChildren(Set<Org> children) {
		this.children = children;
	}
	
	@Transient
	public Set<Dept> getDepts() {
		return depts;
	}

	public void setDepts(Set<Dept> depts) {
		this.depts = depts;
	}
	
	@Transient
	public Set<User> getUsers() {
		return users;
	}

	public void setUsers(Set<User> users) {
		this.users = users;
	}
    
}