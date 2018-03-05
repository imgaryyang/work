package com.lenovohit.bdrp.org.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.apache.commons.lang3.builder.HashCodeBuilder;

import com.lenovohit.core.model.BaseIdModel;
import com.lenovohit.core.utils.StringUtils;

/**
 * Created by IBUP model engine. Model code : Org Edited by : iBSDS Edited on
 * 2012-05-30 11:24:19
 */

@Entity
@Table(name = "IH_ORG")
public class Org extends BaseIdModel {

	private static final long serialVersionUID = 8252802287306624802L;
	
//	private String id;
	private String name;
	private String status;
	private String parentId;
	private Org parent;
	private String brcCode;
	private String province;
	private String effectDate;
	private String licnum;
	private String mobile;
	private String idNo;
	private String cascade;
	private String type;
	private String type2;
	private String shortName;
	private String phone;
	private String mobile1;
	private String enName;
	private String visaAddress;
	private String address;
	private String tags;
	private String phone1;
	private String idType;
	private String custCode;
	private String isLeaf;
	private String memo;
	private String zip;
	private String expirDate;
	private String upDate;
	private String visaDate;
	private String categry;
	private String city;
	private Integer lvl;
	
	private String siId;
	private int numberOfemployees;
	
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

	@Column(name = "BRCCODE", length = 6, updatable = false)
	public String getBrcCode() {
		return brcCode;
	}

	public void setBrcCode(String brcCode) {
		this.brcCode = brcCode;
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

	public void setLicnum(String licnum) {
		this.licnum = licnum;
	}

	@Column(name = "LICNUM", length = 50)
	public String getLicnum() {
		return this.licnum;
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

	public void setCascade(String cascade) {
		this.cascade = cascade;
	}

	@Column(name = "CASCAD", length = 50)
	public String getCascade() {
		return this.cascade;
	}

	public void setType(String type) {
		this.type = type;
	}

	@Column(name = "TYPE", length = 50)
	public String getType() {
		return this.type;
	}
	
	
	@Column(name = "TYPE2", length = 10)
	public String getType2() {
		return type2;
	}

	public void setType2(String type2) {
		this.type2 = type2;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	@Column(name = "ADDRESS", length = 10)
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

//	@ManyToOne(cascade = CascadeType.REFRESH, optional = true)
//	@JoinColumn(name = "PARENT")
//	@NotFound(action=NotFoundAction.IGNORE)
	@Transient
	public Org getParent() {
		return parent;
	}

	public void setParent(Org parent) {
		this.parent = parent;
	}

	public void setEnName(String enName) {
		this.enName = enName;
	}

	@Column(name = "ENNAME", length = 50)
	public String getEnName() {
		return this.enName;
	}

	public void setTags(String tags) {
		this.tags = tags;
	}

	@Column(name = "TAGS", length = 100)
	public String getTags() {
		return this.tags;
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

	public void setLvl(Integer lvl) {
		this.lvl = lvl;
	}

	@Column(name = "LVL")
	public Integer getLvl() {
		return this.lvl;
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

	public void setCategry(String categry) {
		this.categry = categry;
	}

	@Column(name = "CATEGRY", length = 50)
	public String getCategry() {
		return this.categry;
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

	public void setIsLeaf(String isLeaf) {
		this.isLeaf = isLeaf;
	}

	@Column(name = "ISLEAF", length = 1)
	public String getIsLeaf() {
		return this.isLeaf;
	}

	public void setMemo(String memo) {
		this.memo = memo;
	}

	@Column(name = "MEMO", length = 500)
	public String getMemo() {
		return this.memo;
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
	
	@Column(name = "SI_ID")
	public String getSiId() {
		return siId;
	}

	public void setSiId(String siId) {
		this.siId = siId;
	}

	@Column(name = "EMPLOYEES")
	public int getNumberOfemployees() {
		return numberOfemployees;
	}

	public void setNumberOfemployees(int numberOfemployees) {
		this.numberOfemployees = numberOfemployees;
	}
	
	@Column(name = "PARENT")
	public String getParentId() {
		return parentId;
	}

	public void setParentId(String parentId) {
		this.parentId = parentId;
	}

	@Override
	public boolean _newObejct() {
		return StringUtils.isEmpty(this.id);
	}
	
	/**
	 * 重载hashCode;
	 */
	public int hashCode() {
		return new HashCodeBuilder().append(this).toHashCode();
	}
	
}