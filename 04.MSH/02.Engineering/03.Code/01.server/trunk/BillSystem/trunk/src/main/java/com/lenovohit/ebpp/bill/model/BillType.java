/***********************************************************************
 * Module:  BillType.java
 * Author:  Exorics
 * Purpose: Defines the Class BillType
 ***********************************************************************/
package com.lenovohit.ebpp.bill.model;

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
import com.lenovohit.core.model.BaseModel;

@Entity
@Table(name = "IH_EBPP_BILLTYPE")
public class BillType extends BaseModel {

	private static final long serialVersionUID = 7592109297587875925L;

	@Transient
	public static final String STATUS_DISABLED = "00";
	@Transient
	public static final String STATUS_ENABLED = "01";
	@Transient
	public static final String STATUS_UNUSED = "02";

	private String code;
	private String name;
	private String memo;
	// private BillCatalog catalog;
	private String catalog;
	// private BizChannel bizChannel;
	private String bizChannel;
	private String status;
	private String regeditedOn;

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

	@Column(name = "MEMO", length = 100)
	public String getMemo() {
		return memo;
	}

	public void setMemo(String memo) {
		this.memo = memo;
	}

//	 @ManyToOne(cascade = CascadeType.REFRESH, optional = true)
//	 @JoinColumn(name = "CATALOG_ID")
//	 public BillCatalog getCatalog() {
//	 return catalog;
//	 }
//	
//	 public void setCatalog(BillCatalog catalog) {
//	 this.catalog = catalog;
//	 }

	@Column(name = "CATALOG_ID")
	public String getCatalog() {
		return catalog;
	}

	public void setCatalog(String catalog) {
		this.catalog = catalog;
	}

//	@ManyToOne(cascade = CascadeType.REFRESH, optional = true)
//	@JoinColumn(name = "BIZCH_CODE")
//	public BizChannel getBizChannel() {
//		return bizChannel;
//	}
//
//	public void setBizChannel(BizChannel bizChannel) {
//		this.bizChannel = bizChannel;
//	}
	
	@Column(name = "BIZCH_CODE")
	public String getBizChannel() {
		return bizChannel;
	}

	public void setBizChannel(String bizChannel) {
		this.bizChannel = bizChannel;
	}
	
	@Column(name = "STATUS", length = 2)
	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	@Column(name = "CREATED_ON", length = 2)
	public String getRegeditedOn() {
		return regeditedOn;
	}

	public void setRegeditedOn(String regeditedOn) {
		this.regeditedOn = regeditedOn;
	}

//	@Transient
//	@JsonIgnore
//	@Override
//	public boolean isNew() {
//		return StringUtils.isBlank(this.getCode());
//	}

	/**
	 * 判断状态是否存在状态序列中
	 * 
	 * @param statusCode
	 * @return
	 */
	public static boolean hasStatus(String statusCode) {
		return BillType.STATUS_DISABLED.equals(statusCode)
				|| BillType.STATUS_ENABLED.equals(statusCode)
				|| BillType.STATUS_UNUSED.equals(statusCode);
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