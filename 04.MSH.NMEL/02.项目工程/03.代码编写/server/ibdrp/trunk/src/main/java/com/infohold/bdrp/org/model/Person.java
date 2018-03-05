package com.infohold.bdrp.org.model;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.infohold.core.model.BaseIdModel;
import com.infohold.core.utils.StringUtils;

/**
 * Created by IBUP model engine. Model code : Person Edited by : iBSDS Edited on
 * 2012-05-30 11:24:19
 */

@Entity
@Table(name = "IH_PERSON")
@JsonIgnoreProperties(value = { "orgs", "posts", "deps" })
public class Person extends BaseIdModel {
	private static final long serialVersionUID = 7640240456152503907L;
	
	private String pinyin;
	private String userCode;
	private String province;
	private String folk;
	private String gender;
	private String name;
	private String idType;
	private String custCode;
	private String zip;
	private String visaDate;
	private String city;
	private String phone1;
	private String upDate;
	private String expirDate;
	private String visaAddress;
	private String enName;
	private String shortName;
	private String phone;
	private String mobile1;
	private String address;
	private String effectDate;
	private String mobile;
	private String status;
	private String idNo;
	private String type;
	private String expired;
	private String active;
	private String loginId;
	private String password;
	private String username;
	private String ownerOrg;
	private String mail;
	private String bornDate;
	private String homePlace;
	private String marrStatus;
	private Post post;
	private Dep dep;
	private Org org;
	private Set<PersonInOrg> orgs;
	private Set<Dep> deps;
	private Set<Post> posts;
	private String siId;
	
//	@Id
//	@Column(name = "ID", nullable = false,length=32)
//	@GeneratedValue(generator="customer-assigned")
//	@GenericGenerator(name="customer-assigned",strategy="assigned")
//	public String getId(){
//		return this.id;
//	}
//	
//	public void setId(String id){
//		this.id = id;
//	}
	
	@Column(name = "PINYIN", length = 50)
	public String getPinyin() {
		return pinyin;
	}

	public void setPinyin(String pinyin) {
		this.pinyin = pinyin;
	}

	@Column(name = "USERCODE", length = 8, updatable = false)
	public String getUserCode() {
		return userCode;
	}

	public void setUserCode(String userCode) {
		this.userCode = userCode;
	}

	public void setProvince(String province) {
		this.province = province;
	}

	@Column(name = "PROVINCE", length = 6)
	public String getProvince() {
		return this.province;
	}

	public void setEffectDate(String effectDate) {
		this.effectDate = effectDate;
	}

	@Column(name = "EFFECTIVEDATE", length = 10)
	public String getEffectDate() {
		return this.effectDate;
	}

	public void setMobile(String mobile) {
		this.mobile = mobile;
	}

	@Column(name = "MOBILE", length = 50)
	public String getMobile() {
		return this.mobile;
	}

	public void setIdNo(String idNo) {
		this.idNo = idNo;
	}

	@Column(name = "IDNO", length = 18)
	public String getIdNo() {
		return this.idNo;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	@Column(name = "ADDRESS", length = 100)
	public String getAddress() {
		return this.address;
	}

	public void setMobile1(String mobile1) {
		this.mobile1 = mobile1;
	}

	@Column(name = "MOBILE1", length = 50)
	public String getMobile1() {
		return this.mobile1;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	@Column(name = "PHONE", length = 50)
	public String getPhone() {
		return this.phone;
	}

	public void setShortName(String shortName) {
		this.shortName = shortName;
	}

	@Column(name = "SHORTNAME", length = 20)
	public String getShortName() {
		return this.shortName;
	}

	public void setEnName(String enName) {
		this.enName = enName;
	}

	@Column(name = "ENNAME", length = 50)
	public String getEnName() {
		return this.enName;
	}

	public void setVisaAddress(String visaAddress) {
		this.visaAddress = visaAddress;
	}

	@Column(name = "VISAADDR", length = 100)
	public String getVisaAddress() {
		return this.visaAddress;
	}

	public void setExpirDate(String expirDate) {
		this.expirDate = expirDate;
	}

	@Column(name = "EXPIREDDATE", length = 10)
	public String getExpirDate() {
		return this.expirDate;
	}

	public void setUpDate(String upDate) {
		this.upDate = upDate;
	}

	@Column(name = "UPDATEDON", length = 19)
	public String getUpDate() {
		return this.upDate;
	}

	public void setPhone1(String phone1) {
		this.phone1 = phone1;
	}

	@Column(name = "PHONE1", length = 50)
	public String getPhone1() {
		return this.phone1;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	@Column(name = "STATUS", length = 1)
	public String getStatus() {
		return this.status;
	}

	public void setCity(String city) {
		this.city = city;
	}

	@Column(name = "CITY", length = 6)
	public String getCity() {
		return this.city;
	}

	public void setVisaDate(String visaDate) {
		this.visaDate = visaDate;
	}

	@Column(name = "VISADATE", length = 19)
	public String getVisaDate() {
		return this.visaDate;
	}

	public void setZip(String zip) {
		this.zip = zip;
	}

	@Column(name = "ZIP", length = 6)
	public String getZip() {
		return this.zip;
	}

	public void setCustCode(String custCode) {
		this.custCode = custCode;
	}

	@Column(name = "CUSTCODE", length = 30, updatable = false)
	public String getCustCode() {
		return this.custCode;
	}

	public void setIdType(String idType) {
		this.idType = idType;
	}

	@Column(name = "IDTYPE", length = 2)
	public String getIdType() {
		return this.idType;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "NAME", nullable = false, length = 100)
	public String getName() {
		return this.name;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}

	@Column(name = "GENDER", length = 10)
	public String getGender() {
		return this.gender;
	}

	public void setFolk(String folk) {
		this.folk = folk;
	}

	@Column(name = "FOLK", length = 10)
	public String getFolk() {
		return this.folk;
	}

	private String eduLevel;

	public void setEduLevel(String eduLevel) {
		this.eduLevel = eduLevel;
	}

	@Column(name = "EDULEVEL", length = 50)
	public String getEduLevel() {
		return this.eduLevel;
	}

	public void setMarrStatus(String marrStatus) {
		this.marrStatus = marrStatus;
	}

	@Column(name = "MARRSTATUS", length = 1)
	public String getMarrStatus() {
		return this.marrStatus;
	}

	public void setHomePlace(String homePlace) {
		this.homePlace = homePlace;
	}

	@Column(name = "HOMEPLACE", length = 50)
	public String getHomePlace() {
		return this.homePlace;
	}

	public void setBornDate(String bornDate) {
		this.bornDate = bornDate;
	}

	@Column(name = "BORNDATE", length = 20)
	public String getBornDate() {
		return this.bornDate;
	}

	public void setMail(String mail) {
		this.mail = mail;
	}

	@Column(name = "MAIL", length = 30)
	public String getMail() {
		return this.mail;
	}

	public void setLoginId(String loginId) {
		this.loginId = loginId;
	}

	// @Column(name = "PER_ID",length = 32)
	// @FieldProp(symbol = "登陆表_ID", desc = "")
	@Transient
	public String getLoginId() {
		return this.loginId;
	}


	@Transient
	public Org getOrg() {
		if(org != null){
			return org;
		} 
		for(PersonInOrg pio : getOrgs()){
			if(PersonInOrg.STATE_ON.equals(pio.getState())){
				org = pio.getId().getOrg();
				break;
			}
		}
		return org;
	}
	
	public void setOrg(Org org) {
		 this.org = org;
	}

//	@OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)
//	@JoinColumn(name = "PER_ID", updatable = false)
//	@OrderBy("effon desc")
//	@NotFound(action = NotFoundAction.IGNORE)
	@Transient
	public Set<PersonInOrg> getOrgs() {
		if (null == orgs)
			orgs = new HashSet<PersonInOrg>();
		return orgs;
	}

	public void setOrgs(Set<PersonInOrg> orgs) {
		this.orgs = orgs;
	}

	@Transient
	public Dep getDep() {
		if(dep != null){
			return dep;
		} 
		if(getDeps().size()>0){
			return getDeps().iterator().next();
		} else {
			return null;
		}
	}

	public void setDep(Dep dep) {
		this.dep = dep;
	}

//	@ManyToMany(fetch = FetchType.LAZY)//, cascade = CascadeType.REMOVE
//	@JoinTable(name = "IH_DEPT_PER", joinColumns = { @JoinColumn(name = "PER_ID") }, inverseJoinColumns = @JoinColumn(name = "DEP_ID"))
//	@NotFound(action = NotFoundAction.IGNORE)
	@Transient
	public Set<Dep> getDeps() {
		if (null == deps)
			deps = new HashSet<Dep>();
		return deps;
	}

	public void setDeps(Set<Dep> deps) {
		this.deps = deps;
	}

	public void addDeps(Dep dep) {
		getDeps().add(dep);
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

//	@ManyToMany(fetch = FetchType.LAZY)
//	@JoinTable(name = "IH_PER_POST", joinColumns = { @JoinColumn(name = "PID") }, inverseJoinColumns = @JoinColumn(name = "PTID"))
//	@NotFound(action = NotFoundAction.IGNORE)
	@Transient
	public Set<Post> getPosts() {
		if (null == posts)
			posts = new HashSet<Post>();
		return posts;
	}

	public void setPosts(Set<Post> posts) {
		this.posts = posts;
	}

	public void addPosts(Post post) {
		getPosts().add(post);
	}

	@Column(name = "OWNERORG", updatable = false, length = 32)
//	@Transient
	public String getOwnerOrg() {
		return ownerOrg;
	}

	public void setOwnerOrg(String ownerOrg) {
		this.ownerOrg = ownerOrg;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	@Column(name = "USERNAME", unique = true, length = 50)
	public String getUsername() {
		return this.username;
	}

	@Column(name = "PASSWORD", nullable = false, updatable = false, length = 64)
	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	@Column(name = "ISACTIVE", updatable = false, length = 1)
	public String getActive() {
		return active;
	}

	public void setActive(String active) {
		this.active = active;
	}

	@Column(name = "ISEXPE", updatable = false, length = 1)
	public String getExpired() {
		return expired;
	}

	public void setExpired(String expired) {
		this.expired = expired;
	}

	@Column(name = "TYPE", updatable = false, length = 1)
	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}
	
	@Column(name = "SI_ID", updatable = false, length = 1)
	public String getSiId() {
		return siId;
	}

	public void setSiId(String siId) {
		this.siId = siId;
	}

	@Override
	public boolean _newObejct() {
		return StringUtils.isEmpty(this.id);
	}

	
}