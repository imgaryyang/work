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

package com.lenovohit.mnis.org.model;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.lenovohit.bdrp.authority.model.AuthAccount;
import com.lenovohit.bdrp.authority.model.AuthPrincipal;
import com.lenovohit.core.utils.BeanUtils;
import com.lenovohit.mnis.base.model.AuditableModel;

/**
 * mnis_USER
 * 
 * @author zyus
 * @version 1.0.0 2017-12-14
 */
@Entity
@Table(name = "mnis_USER")
public class User extends AuditableModel  implements AuthModel,AuthPrincipal {
    /** 版本号 */
    private static final long serialVersionUID = 8071159992147771148L;
    
    private String sessionId;

    /** custCode */
    private String custCode;

    /** userCode */
    private String userCode;

    /** type */
    private String type;

    /** name */
    private String name;

    /** enName */
    private String enName;

    /** shortName */
    private String shortName;

    /** idType */
    private String idType;
    
    /** age */
    private int age;

    /** idNo */
    private String idNo;

    /** effectiveDate */
    private String effectiveDate;

    /** expiredDate */
    private String expiredDate;

    /** visaDate */
    private String visaDate;

    /** visaAddr */
    private String visaAddr;

    /** siId */
    private String siId;

    /** homePlace */
    private String homePlace;

    /** bornDate */
    private String bornDate;

    /** gender */
    private String gender;

    /** folk */
    private String folk;

    /** marrStatus */
    private String marrStatus;

    /** eduLevel */
    private String eduLevel;

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

    /** email */
    private String email;

    /** pinyin */
    private String pinyin;

    /** isActive */
    private String isActive;

    /** isExpe */
    private String isExpe;

    /** status */
    private String status;

    private AuthAccount loginAccount;//登录账户
    private Org org;
    private Dept dept;
    private Post post;
	private Set<UserInOrg> orgs;
	private Set<Dept> depts;
	private Set<Post> posts;
	
	@SuppressWarnings("rawtypes")
	private Map<String, Object> map;
    
	
	@Transient
    public String getSessionId() {
		return sessionId;
	}

	public void setSessionId(String sessionId) {
		this.sessionId = sessionId;
	}

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
     * 获取userCode
     * 
     * @return userCode
     */
    @Column(name = "USER_CODE", nullable = true, length = 8)
    public String getUserCode() {
        return this.userCode;
    }

    /**
     * 设置userCode
     * 
     * @param userCode
     */
    public void setUserCode(String userCode) {
        this.userCode = userCode;
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
     * 获取age
     * @return
     */
    @Column(name = "AGE", nullable = true, columnDefinition = "INT default 0" )
    public int getAge() {
		return age;
	}
    /**
     * 设置age
     * @param age
     */
	public void setAge(int age) {
		this.age = age;
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
     * 获取visaAddr
     * 
     * @return visaAddr
     */
    @Column(name = "VISA_ADDR", nullable = true, length = 100)
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
     * 获取siId
     * 
     * @return siId
     */
    @Column(name = "SI_ID", nullable = true, length = 20)
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
     * 获取homePlace
     * 
     * @return homePlace
     */
    @Column(name = "HOME_PLACE", nullable = true, length = 100)
    public String getHomePlace() {
        return this.homePlace;
    }

    /**
     * 设置homePlace
     * 
     * @param homePlace
     */
    public void setHomePlace(String homePlace) {
        this.homePlace = homePlace;
    }

    /**
     * 获取bornDate
     * 
     * @return bornDate
     */
    @Column(name = "BORN_DATE", nullable = true, length = 20)
    public String getBornDate() {
        return this.bornDate;
    }

    /**
     * 设置bornDate
     * 
     * @param bornDate
     */
    public void setBornDate(String bornDate) {
        this.bornDate = bornDate;
    }

    /**
     * 获取gender
     * 
     * @return gender
     */
    @Column(name = "GENDER", nullable = true, length = 10)
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
     * 获取folk
     * 
     * @return folk
     */
    @Column(name = "FOLK", nullable = true, length = 10)
    public String getFolk() {
        return this.folk;
    }

    /**
     * 设置folk
     * 
     * @param folk
     */
    public void setFolk(String folk) {
        this.folk = folk;
    }

    /**
     * 获取marrStatus
     * 
     * @return marrStatus
     */
    @Column(name = "MARR_STATUS", nullable = true, length = 1)
    public String getMarrStatus() {
        return this.marrStatus;
    }

    /**
     * 设置marrStatus
     * 
     * @param marrStatus
     */
    public void setMarrStatus(String marrStatus) {
        this.marrStatus = marrStatus;
    }

    /**
     * 获取eduLevel
     * 
     * @return eduLevel
     */
    @Column(name = "EDU_LEVEL", nullable = true, length = 50)
    public String getEduLevel() {
        return this.eduLevel;
    }

    /**
     * 设置eduLevel
     * 
     * @param eduLevel
     */
    public void setEduLevel(String eduLevel) {
        this.eduLevel = eduLevel;
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
    @Column(name = "ADDRESS", nullable = true, length = 100)
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
     * 获取mail
     * 
     * @return mail
     */
    @Column(name = "EMAIL", nullable = true, length = 50)
    public String getEmail() {
        return this.email;
    }

    /**
     * 设置mail
     * 
     * @param mail
     */
    public void setEmail(String email) {
        this.email = email;
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
     * 获取isActive
     * 
     * @return isActive
     */
    @Column(name = "IS_ACTIVE", nullable = true, length = 1)
    public String getIsActive() {
        return this.isActive;
    }

    /**
     * 设置isActive
     * 
     * @param isActive
     */
    public void setIsActive(String isActive) {
        this.isActive = isActive;
    }

    /**
     * 获取isExpe
     * 
     * @return isExpe
     */
    @Column(name = "IS_EXPE", nullable = true, length = 1)
    public String getIsExpe() {
        return this.isExpe;
    }

    /**
     * 设置isExpe
     * 
     * @param isExpe
     */
    public void setIsExpe(String isExpe) {
        this.isExpe = isExpe;
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
	public AuthAccount getLoginAccount() {
		return loginAccount;
	}

	public void setLoginAccount(AuthAccount loginAccount) {
		this.loginAccount = loginAccount;
	}
	
	@Transient
	public Org getOrg() {
		if(org != null){
			return org;
		} 
		for(UserInOrg uio : getOrgs()){
			if(UserInOrg.IS_REG_TRUE.equals(uio.getIsReg())){
				org = uio.getOrg();
				break;
			}
		}
		return org;
	}
	
	public void setOrg(Org org) {
		 this.org = org;
	}

	@Transient
	public Set<UserInOrg> getOrgs() {
		if (null == orgs)
			orgs = new HashSet<UserInOrg>();
		return orgs;
	}
	public void setOrgs(Set<UserInOrg> orgs) {
		this.orgs = orgs;
	}

	@Transient
	public Dept getDep() {
		if(dept != null){
			return dept;
		} 
		if(getDepts().size()>0){
			return getDepts().iterator().next();
		} else {
			return null;
		}
	}
	public void setDep(Dept dept) {
		this.dept = dept;
	}

	@Transient
	public Set<Dept> getDepts() {
		if (null == depts)
			depts = new HashSet<Dept>();
		return depts;
	}

	public void setDeps(Set<Dept> depts) {
		this.depts = depts;
	}

	@Transient
	public Post getPost() {
		if(post != null){
			return post;
		} 
		if(getPosts().size()>0){
			return getPosts().iterator().next();
		} else {
			return null;
		}
	}
	public void setPost(Post post) {
		this.post = post;
	}

	@Transient
	public Set<Post> getPosts() {
		if (null == posts)
			posts = new HashSet<Post>();
		return posts;
	}
	public void setPosts(Set<Post> posts) {
		this.posts = posts;
	}

	@Override
	public AuthPrincipal clone() {
		try {
			Object clone = super.clone();
			return (User) clone;
		} catch (CloneNotSupportedException e) {
			User target = new User();
			BeanUtils.copyProperties(this, target);
			return target;
		}
	}
	
	@SuppressWarnings("rawtypes")
	@Transient
	public Map<String, Object> getMap() {
		return map;
	}

	@SuppressWarnings("rawtypes")
	public void setMap(Map<String, Object> map) {
		this.map = map;
	}
	
}