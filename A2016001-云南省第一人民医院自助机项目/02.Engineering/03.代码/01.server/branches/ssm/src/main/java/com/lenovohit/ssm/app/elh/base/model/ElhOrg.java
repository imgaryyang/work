package com.lenovohit.ssm.app.elh.base.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.hibernate.annotations.GenericGenerator;


import com.lenovohit.core.model.BaseModel;
import com.lenovohit.ssm.base.model.Org;

/**
 * 机构（医院）
 * @author Administrator
 *
 */
@Entity
@Table(name="ELH_ORG")
public class ElhOrg extends BaseModel {
	private static final long serialVersionUID = 1826210740042076986L;
	
	private String code        ;      //机构代码
	private String name        ;      //机构名称
	//1 - 综合医院  2 - 专科医院      
	private String hosType     ;       //医院类型
	 /*1A - 一级甲等    
	   1B - 一级乙等
	   1C - 一级丙等
	   2A - 二级甲等
	   2B - 二级乙等
	   2C - 二级丙等
	   3A - 三级甲等
	   3B - 三级乙等
	   3C - 三级丙等*/
	private String hosLevel    ;    //医院级别
	private String linkman     ;    //联系人	
	private String lmContactWay;    //联系人联系方式	
	private String zipcode     ;    //邮编	
	private String address     ;    //地址	
	private String salesman    ;    //客户专员	
	private String smContactWay;    //客户专员联系方式
	//1 - 正常2 - 已下线
	private String state       ;     //状态	
	private String memo        ;     //备注	
	private String logo        ;     //医院
	private String hosHomeBg   ;     //医院微主页背景图
	private String createdAt   ;     //创建时间	
	private Org org;
	private String id;//

	@Id
	@Column(name="ID",length = 32)
	@GeneratedValue(generator="system-uuid")
	@GenericGenerator(name="system-uuid", strategy="assigned")
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	
	@Transient
	public Org getOrg() {
		return org;
	}
	public void setOrg(Org org) {
		this.org = org;
	}
	
	public String getCode() {
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getHosType() {
		return hosType;
	}
	public void setHosType(String hosType) {
		this.hosType = hosType;
	}
	public String getHosLevel() {
		return hosLevel;
	}
	public void setHosLevel(String hosLevel) {
		this.hosLevel = hosLevel;
	}
	public String getLinkman() {
		return linkman;
	}
	public void setLinkman(String linkman) {
		this.linkman = linkman;
	}
	public String getLmContactWay() {
		return lmContactWay;
	}
	public void setLmContactWay(String lmContactWay) {
		this.lmContactWay = lmContactWay;
	}
	public String getZipcode() {
		return zipcode;
	}
	public void setZipcode(String zipcode) {
		this.zipcode = zipcode;
	}
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	public String getSalesman() {
		return salesman;
	}
	public void setSalesman(String salesman) {
		this.salesman = salesman;
	}
	public String getSmContactWay() {
		return smContactWay;
	}
	public void setSmContactWay(String smContactWay) {
		this.smContactWay = smContactWay;
	}
	public String getState() {
		return state;
	}
	public void setState(String state) {
		this.state = state;
	}
	public String getMemo() {
		return memo;
	}
	public void setMemo(String memo) {
		this.memo = memo;
	}
	public String getLogo() {
		return logo;
	}
	public void setLogo(String logo) {
		this.logo = logo;
	}
	public String getHosHomeBg() {
		return hosHomeBg;
	}
	public void setHosHomeBg(String hosHomeBg) {
		this.hosHomeBg = hosHomeBg;
	}
	public String getCreatedAt() {
		return createdAt;
	}
	public void setCreatedAt(String createdAt) {
		this.createdAt = createdAt;
	} 
	@Transient
	@Override
	public boolean _newObejct() {
		return null == this.getId();
	}
	
	/**
	 * 重载toString;
	 */
	public String toString() {
		return ToStringBuilder.reflectionToString(this);
	}

	/**
	 * 重载hashCode;
	 */
	public int hashCode() {
		return new HashCodeBuilder().append(this.getId()).toHashCode();
	}

	/**
	 * 重载equals
	 */
	public boolean equals(Object obj) {
		return EqualsBuilder.reflectionEquals(this, obj);
	}
}
