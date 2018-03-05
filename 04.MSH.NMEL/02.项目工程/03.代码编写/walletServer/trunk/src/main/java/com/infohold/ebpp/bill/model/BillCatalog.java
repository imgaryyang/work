/***********************************************************************
 * Module:  BillCatalog.java
 * Author:  Exorics
 * Purpose: Defines the Class BillCatalog
 ***********************************************************************/

package com.infohold.ebpp.bill.model;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.hibernate.annotations.GenericGenerator;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.infohold.core.model.BaseModel;

@Entity
@Table(name="IH_EBPP_BILLCATALOG")
public class BillCatalog extends BaseModel {
	
	private static final long serialVersionUID = 3140186251024545170L;
	
	@Transient
	public static final String STATUS_DISABLED = "00";
	@Transient
	public static final String STATUS_ENABLED = "01";

	private static final String STATUS_UNUSED = "02";
	
	private String code;
	private String name;
	private String status;
	private String memo;
//	private BillCatalog parent;
	private String parent;
//	private BizChannel bizChannel;
	private String createdOn;
	
	@Id
	@Column(name = "CODE", length = 6, updatable = false)
	@GenericGenerator(name = "assigned", strategy = "assigned")
	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}
	
	@Column(name = "NAME", length = 100)
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
	@Column(name="STATUS",length = 2)
	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

//	@ManyToOne(cascade = CascadeType.REFRESH, optional = true)
//	@JoinColumn(name = "PARENT_ID")
//	public BillCatalog getParent() {
//		return parent;
//	}
//
//	public void setParent(BillCatalog parent) {
//		this.parent = parent;
//	}
	
	

//	public BizChannel getBizChannel() {
//		return bizChannel;
//	}
//
//
//
//	public void setBizChannel(BizChannel bizChannel) {
//		this.bizChannel = bizChannel;
//	}
	
	@Column(name="MEMO",length = 100)
	public String getMemo() {
		return memo;
	}

	public void setMemo(String memo) {
		this.memo = memo;
	}

	@Column(name = "PARENT_ID")
	public String getParent() {
		return parent;
	}

	public void setParent(String parent) {
		this.parent = parent;
	}

	@Column(name = "CREATED_ON", length = 19, updatable = false)
	public String getCreatedOn() {
		return createdOn;
	}


	public void setCreatedOn(String createdOn) {
		this.createdOn = createdOn;
	}
	
	/**
	 * 判断状态是否存在状态序列中
	 * 
	 * @param statusCode
	 * @return
	 */
	public static boolean hasStatus(String statusCode) {
		return BillCatalog.STATUS_DISABLED.equals(statusCode) || BillCatalog.STATUS_ENABLED.equals(statusCode)
				|| BillCatalog.STATUS_UNUSED.equals(statusCode);
	}

//	@Transient
//	@JsonIgnore
//	@Override
//	public boolean isNew() {
//		return StringUtils.isBlank(this.getCode());
//	}
	
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
		return new HashCodeBuilder().append(this.code).toHashCode();
	}

	/**
	 * 重载equals
	 */
	public boolean equals(Object obj) {
		return EqualsBuilder.reflectionEquals(this, obj);
	}

	@Override
	public boolean _newObejct() {
		return StringUtils.isBlank(this.getCode());
	}

}