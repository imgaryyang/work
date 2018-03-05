/***********************************************************************
 * Module:PerMng.java
 * Author:wod
 * Purpose: Defines the Class PerMng
 ***********************************************************************/
package com.infohold.els.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;

import com.infohold.core.model.BaseModel;
import com.infohold.core.utils.StringUtils;

@Entity
@Table(name = "ELS_ORG")
public class ElsOrg extends BaseModel {
	private static final long serialVersionUID = -651782156722767436L;
	public static final String TYPE_GOVERNMENT = "1";
	public static final String TYPE_ENTERPRISE = "2";
	public static final String TYPE_COMPANY = "3";
	public static final String TYPE_EDUCATION = "4";
	public static final String TYPE_FINANCE = "5";
	public static final String STATUS_NORMAL = "1";
	public static final String STATUS_OFFLINE = "2";
	
	private String id;
	private String code;
	private String name;
	private String orgType;
	private String linkman;
	private String lmContactWay;
	private String zipcode;
	private String address;
	private String salesman;
	private String smContactWay;
	private String state;
	private String memo;
	private String createdAt;

	
	@Id
	@Column( name = "ID", length = 32, updatable = false )
	@GenericGenerator(name = "assigned", strategy = "assigned")
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}

	@Column( name = "ADDRESS", length = 200 )
	public String getAddress() {
		return address;
	}

	@Column( name = "CODE", length = 10 )
	public String getCode() {
		return code;
	}

	@Column( name = "CREATED_AT", length = 19 )                
	public String getCreatedAt() {
		return createdAt;
	}

	@Column( name = "LINKMAN", length = 50 )
	public String getLinkman() {
		return linkman;
	}

	@Column( name = "LM_CONTACT_WAY", length = 100 )
	public String getLmContactWay() {
		return lmContactWay;
	}

	@Column( name = "MEMO", length = 500 )
	public String getMemo() {
		return memo;
	}

	@Column( name = "NAME", length = 100 )
	public String getName() {
		return name;
	}

	@Column( name = "ORG_TYPE", length = 1 )
	public String getOrgType() {
		return orgType;
	}

	@Column( name = "SALESMAN", length = 50 )
	public String getSalesman() {
		return salesman;
	}

	@Column( name = "SM_CONTACT_WAY", length = 100 )
	public String getSmContactWay() {
		return smContactWay;
	}

	@Column( name = "STATE", length = 1 )
	public String getState() {
		return state;
	}

	@Column( name = "ZIPCODE", length = 6 )
	public String getZipcode() {
		return zipcode;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public void setCode(String code) {
		this.code = code;
	}
	public void setCreatedAt(String createdAt) {
		this.createdAt = createdAt;
	}
	public void setLinkman(String linkman) {
		this.linkman = linkman;
	}
	public void setLmContactWay(String lmContactWay) {
		this.lmContactWay = lmContactWay;
	}
	public void setMemo(String memo) {
		this.memo = memo;
	}
	public void setName(String name) {
		this.name = name;
	}
	public void setOrgType(String orgType) {
		this.orgType = orgType;
	}
	public void setSalesman(String salesman) {
		this.salesman = salesman;
	}
	public void setSmContactWay(String smContactWay) {
		this.smContactWay = smContactWay;
	}
	public void setState(String state) {
		this.state = state;
	}   
	
	public void setZipcode(String zipcode) {
		this.zipcode = zipcode;
	}
	
	/**
	 * 判断类型是否存在类型序列中
	 * 
	 * @param orgType
	 * @return
	 */
	public static boolean hasType(String orgType) {
		return  ElsOrg.TYPE_COMPANY.equals(orgType) || 
				ElsOrg.TYPE_EDUCATION.equals(orgType) || 
				ElsOrg.TYPE_ENTERPRISE.equals(orgType) ||
				ElsOrg.TYPE_FINANCE.equals(orgType) ||
				ElsOrg.TYPE_GOVERNMENT.equals(orgType);
	}
	
	/**
	 * 判断状态是否存在状态序列中
	 * 
	 * @param statusCode
	 * @return
	 */
	public static boolean hasStatus(String statusCode) {
		return  ElsOrg.STATUS_NORMAL.equals(statusCode) ||
				ElsOrg.STATUS_OFFLINE.equals(statusCode);
	}

	@Override
	public boolean _newObejct() {
		return StringUtils.isEmpty(this.id);
	}
}