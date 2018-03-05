/***********************************************************************
 * Module:  PayInfoEnd.java
 * Author:  djl
 * Purpose: Defines the Class PayDetail
 ***********************************************************************/
package com.infohold.ebpp.bill.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;

import com.infohold.core.model.BaseIdModel;

@Entity
@Table(name = "IH_EBPP_END_PAYINFO")
public class PayInfoEnd extends BaseIdModel {

	private static final long serialVersionUID = 2656939416556528121L;
	
	@Transient
	public static final String VALID_FLAG_TRUE = "1";
	@Transient
	public static final String VALID_FLAG_FALSE = "0";
	
	@Transient
	public static final String INVALID_TYPE_EMPTY_ORIBIZNO = "1";
	@Transient
	public static final String INVALID_TYPE_EMPTY_PAYNO = "2";
	@Transient
	public static final String INVALID_TYPE_EMPTY_WAY = "3";
	@Transient
	public static final String INVALID_TYPE_NOT_FOUND_BILL = "4";
//	@Transient
//	public static final String INVALID_TYPE_NOT_UNIQUE = "5";
	
	
	private String no;
	private String oriBizNo;
	private String payNo;//SEQUENCENO
	private String status;
	private float amt;
	private String payedTime;//TRAN_TIME
	private String way;//TRAN_WAY
	private int quantity;//TRAN_QUANTITY
	private String payChannel;//TRAN_CHANEL
	private String createdOn;
	private String updatedOn;
	
	private String insertTime;
	private String validFlag;
	private String invalidType;
	private String invalidInfo;
	
	private String syncDate;
	private String syncType;
	private String syncFlag;
	
	@Column(name = "SEQUENCENO", length = 30)
	public String getPayNo() {
		return payNo;
	}

	public void setPayNo(String payNo) {
		this.payNo = payNo;
	}

	@Column(name = "STATUS", length = 2)
	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}
	
	@Column(name="NO", length=30)
	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}

	@Column(name = "AMT")
	public float getAmt() {
		return amt;
	}

	public void setAmt(float amt) {
		this.amt = amt;
	}
	
	@Column(name = "TRAN_CHANEL")
	public String getPayChannel() {
		return payChannel;
	}

	public void setPayChannel(String payChannel) {
		this.payChannel = payChannel;
	}
	
	
	@Column(name = "TRAN_WAY",length = 2)
	public String getWay() {
		return way;
	}

	public void setWay(String way) {
		this.way = way;
	}
	
//	@Column(name = "TRAN_QUALITY")
//	public float getQuality() {
//		return quality;
//	}
//
//	public void setQuality(float quality) {
//		this.quality = quality;
//	}
	
	@Column(name = "TRAN_QUANTITY")
	public int getQuantity() {
		return quantity;
	}

	public void setQuantity(int quantity) {
		this.quantity = quantity;
	}
	
	@Column(name = "TRAN_TIME",length=19)
	public String getPayedTime() {
		return payedTime;
	}

	public void setPayedTime(String payedTime) {
		this.payedTime = payedTime;
	}
	
	@Column(name = "ORIBIZNO", length = 50)
	public String getOriBizNo() {
		return oriBizNo;
	}

	public void setOriBizNo(String oriBizNo) {
		this.oriBizNo = oriBizNo;
	}
	
	public String getValidFlag() {
		return validFlag;
	}

	public void setValidFlag(String validFlag) {
		this.validFlag = validFlag;
	}

	public String getInvalidType() {
		return invalidType;
	}

	public void setInvalidType(String invalidType) {
		this.invalidType = invalidType;
	}

	public String getInvalidInfo() {
		return invalidInfo;
	}

	public void setInvalidInfo(String invalidInfo) {
		this.invalidInfo = invalidInfo;
	}
	
	public String getCreatedOn() {
		return createdOn;
	}

	public void setCreatedOn(String createdOn) {
		this.createdOn = createdOn;
	}

	public String getUpdatedOn() {
		return updatedOn;
	}

	public void setUpdatedOn(String updatedOn) {
		this.updatedOn = updatedOn;
	}

	public String getInsertTime() {
		return insertTime;
	}

	public void setInsertTime(String insertTime) {
		this.insertTime = insertTime;
	}
	
	public String getSyncDate() {
		return syncDate;
	}

	public void setSyncDate(String syncDate) {
		this.syncDate = syncDate;
	}

	public String getSyncType() {
		return syncType;
	}

	public void setSyncType(String syncType) {
		this.syncType = syncType;
	}

	public String getSyncFlag() {
		return syncFlag;
	}

	public void setSyncFlag(String syncFlag) {
		this.syncFlag = syncFlag;
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

//	@Transient
//	public String getbID() {
//		return bID;
//	}
//
//	public void setbID(String bID) {
//		this.bID = bID;
//	}

}