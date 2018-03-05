/***********************************************************************
 * Module:  BizChanel.java
 * Author:  Exorics
 * Purpose: Defines the Class BizChanel
 ***********************************************************************/
package com.lenovohit.ebpp.bill.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.hibernate.annotations.GenericGenerator;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.lenovohit.core.model.BaseModel;
import com.lenovohit.core.utils.StringUtils;

@Entity
@Table(name = "IH_EBPP_BIZCHANNEL")
public class BizChannel extends BaseModel {

	private static final long serialVersionUID = -3040277135292447199L;

	@Transient
	public static final String STATUS_DISABLED = "00";
	@Transient
	public static final String STATUS_ENABLED = "01";
	@Transient
	public static final String STATUS_UNUSED = "02";

	private String code;
	private String name;
	private String memo;
	private String type;
	private String status;
	private String registedOn;

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

	@Column(name = "_TYPE", length = 2)
	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	@Column(name = "STATUS", length = 2)
	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	@Column(name = "CREATED_ON", length = 19, updatable = false)
	public String getRegistedOn() {
		return registedOn;
	}

	public void setRegistedOn(String registedOn) {
		this.registedOn = registedOn;
	}

//	@Transient
//	@JsonIgnore
//	@Override
//	public boolean isNew() {
//		return StringUtils.isEmpty(this.code);
//	}

	/**
	 * 判断状态是否存在状态序列中
	 * 
	 * @param statusCode
	 * @return
	 */
	public static boolean hasStatus(String statusCode) {
		return BizChannel.STATUS_DISABLED.equals(statusCode) || BizChannel.STATUS_ENABLED.equals(statusCode)
				|| BizChannel.STATUS_UNUSED.equals(statusCode);
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
		return StringUtils.isEmpty(this.code);
	}

}