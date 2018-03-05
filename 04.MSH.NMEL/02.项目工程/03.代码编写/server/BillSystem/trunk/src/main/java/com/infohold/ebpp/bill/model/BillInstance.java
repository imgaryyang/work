/***********************************************************************
 * Module:  BillInstance.java
 * Author:  Exorics
 * Purpose: Defines the Class BillInstance
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
@Table(name = "IH_EBPP_BILLINSTANCE")
public class BillInstance extends BaseIdModel {

	private static final long serialVersionUID = -5778189127147309332L;
	
	@Transient
	public static final String FLAG_DISABLED = "0";
	@Transient
	public static final String FLAG_ENABLED = "1";
	
	@Transient
	public static final String STATUS_NEW = "01";
	@Transient
	public static final String STATUS_PAYING = "11";
	@Transient
	public static final String STATUS_PAYED_SUCCESS = "12";
	@Transient
	public static final String STATUS_PAYED_EXCEPTION = "21";
	@Transient
	public static final String STATUS_PAYED_FAILURE = "22";
	@Transient
	public static final String STATUS_CLOSED_IN_EXCEPTION = "08";
	@Transient
	public static final String STATUS_CLOSED_NORMAL = "09";
	
	
	
	private String no;
	private String oriBizNo;
	private String oldOriBizNo;
	private String type;
	private String flag;
	private String status;
	private String memo;
	private String ccy;
	private float amt;
	private String bizChannel;
	private String payerCode;
	private String payerName;
	private String payerAcctNo;
	private String payeeCode;
	private String payeeName;
	private String payeeAcctNo;
	private String transDate;
	private String transTime;
	
	private String createdDate;
	private String createdOn;
	private String updatedOn;
	private String finishedOn;
	
	private String syncType;
	private String syncFlag;
	private String endDayId;
	
	@Column(name = "NO", length = 30)
	public String getNo() {
		return no;
	}
	
	public void setNo(String no) {
		this.no = no;
	}
	
	@Column(name = "ORIBIZNO", length = 50)
	public String getOriBizNo() {
		return oriBizNo;
	}
	
	public void setOriBizNo(String oriBizNo) {
		this.oriBizNo = oriBizNo;
	}
	
	@Column(name = "OLDORIBIZNO", length = 50)
	public String getOldOriBizNo() {
		return oldOriBizNo;
	}

	public void setOldOriBizNo(String oldOriBizNo) {
		this.oldOriBizNo = oldOriBizNo;
	}
	
//	@Column(name = "_TYPE", length = 32)
//	public BillType getType() {
//		return type;
//	}
//	
//	public void setType(BillType type) {
//		this.type = type;
//	}
	
	@Column(name = "_TYPE", length = 32)
	public String getType() {
		return type;
	}
	
	public void setType(String type) {
		this.type = type;
	}
	
	@Column(name = "FLAG", length = 1)
	public String getFlag() {
		return flag;
	}
	
	public void setFlag(String flag) {
		this.flag = flag;
	}
	
	@Column(name = "STATUS", length = 2)
	public String getStatus() {
		return status;
	}
	
	public void setStatus(String status) {
		this.status = status;
	}
	
	@Column(name = "MEMO", length = 100)
	public String getMemo() {
		return memo;
	}
	
	public void setMemo(String memo) {
		this.memo = memo;
	}
	
	@Column(name = "CCY", length = 3)
	public String getCcy() {
		return ccy;
	}
	
	public void setCcy(String ccy) {
		this.ccy = ccy;
	}
	
	@Column(name = "AMT")
	public float getAmt() {
		return amt;
	}
	
	public void setAmt(float amt) {
		this.amt = amt;
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
	
	@Column(name = "PAYEE_CODE", length = 50)
	public String getPayeeCode() {
		return payeeCode;
	}
	
	public void setPayeeCode(String payeeCode) {
		this.payeeCode = payeeCode;
	}
	
	@Column(name = "PAYEE_NAME", length = 70)
	public String getPayeeName() {
		return payeeName;
	}
	
	public void setPayeeName(String payeeName) {
		this.payeeName = payeeName;
	}
	
	@Column(name = "PAYEE_ACCT", length = 50)
	public String getPayeeAcctNo() {
		return payeeAcctNo;
	}
	
	public void setPayeeAcctNo(String payeeAcctNo) {
		this.payeeAcctNo = payeeAcctNo;
	}
	
	@Column(name = "PAYER_CODE", length = 50)
	public String getPayerCode() {
		return payerCode;
	}
	
	public void setPayerCode(String payerCode) {
		this.payerCode = payerCode;
	}
	
	@Column(name = "PAYER_NAME", length = 70)
	public String getPayerName() {
		return payerName;
	}
	
	public void setPayerName(String payerName) {
		this.payerName = payerName;
	}
	
	@Column(name = "PAYER_ACCT", length = 50)
	public String getPayerAcctNo() {
		return payerAcctNo;
	}
	
	public void setPayerAcctNo(String payerAcctNo) {
		this.payerAcctNo = payerAcctNo;
	}
	
	@Column(name = "TRANS_ON", length = 19)
	public String getTransTime() {
		return transTime;
	}
	
	public void setTransTime(String transTime) {
		this.transTime = transTime;
	}
	
	@Column(name = "CREATED_ON", length = 19)
	public String getCreatedOn() {
		return createdOn;
	}
	
	public void setCreatedOn(String createdOn) {
		this.createdOn = createdOn;
	}
	
	@Column(name = "UPDATED_ON", length = 19)
	public String getUpdatedOn() {
		return updatedOn;
	}
	
	public void setUpdatedOn(String updatedOn) {
		this.updatedOn = updatedOn;
	}
	
	@Column(name = "FINISHED_ON", length = 19)
	public String getFinishedOn() {
		return finishedOn;
	}
	public void setFinishedOn(String finishedOn) {
		this.finishedOn = finishedOn;
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
	
	

	public String getTransDate() {
		return transDate;
	}

	public void setTransDate(String transDate) {
		this.transDate = transDate;
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