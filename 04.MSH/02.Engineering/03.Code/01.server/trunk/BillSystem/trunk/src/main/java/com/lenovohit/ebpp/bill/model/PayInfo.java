/***********************************************************************
 * Module:  PayDetail.java
 * Author:  Exorics
 * Purpose: Defines the Class PayDetail
 ***********************************************************************/
package com.lenovohit.ebpp.bill.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;

import com.lenovohit.core.model.BaseIdModel;

@Entity
@Table(name = "IH_EBPP_PAYINFO")
public class PayInfo extends BaseIdModel {

	private static final long serialVersionUID = 2616939416556528121L;
	
	@Transient
	public static final String PAY_WAY_POINT = "01";       //积分
	@Transient
	public static final String PAY_WAY_VOUCHER = "02";     //优惠券
	@Transient
	public static final String PAY_WAY_BALANCE = "03";     //余额支付
	@Transient
	public static final String PAY_WAY_PACKETS = "04";     //红包
	
	private String no;
	private String oriBizNo;
	private String payNo;//SEQUENCENO
	private String status;
	private float amt;////
	private String tranDate;//TRAN_DATE
	private String payedTime;//TRAN_TIME
	private String way;////TRAN_WAY
	private int quantity;////TRAN_QUANTITY
	private String payChannel;//TRAN_CHANEL
	
	private String createdDate;
	private String createdOn;
	private String updatedOn;
	
	private String syncType;
	private String syncFlag;
	private String endDayId;
	
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

	public String getEndDayId() {
		return endDayId;
	}

	public void setEndDayId(String endDayId) {
		this.endDayId = endDayId;
	}

	public String getCreatedDate() {
		return createdDate;
	}

	public void setCreatedDate(String createdDate) {
		this.createdDate = createdDate;
	}
	
	public String getTranDate() {
		return tranDate;
	}

	public void setTranDate(String tranDate) {
		this.tranDate = tranDate;
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