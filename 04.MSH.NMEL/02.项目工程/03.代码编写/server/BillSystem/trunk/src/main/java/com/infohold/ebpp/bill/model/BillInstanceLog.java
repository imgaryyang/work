/***********************************************************************
 * Module:  BillInstanceLog.java
 * Author:  Exorics
 * Purpose: Defines the Class BillInstanceLog
 ***********************************************************************/
package com.infohold.ebpp.bill.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;

import com.infohold.core.model.BaseIdModel;

@Entity
@Table(name = "IH_EBPP_BILLINSTANCELOG")
public class BillInstanceLog extends BaseIdModel {

	private static final long serialVersionUID = -2156336071294774281L;

//	private BillInstance bill;
	private String billId;
	private String operTime;
	private String content;
	private String oriData;
	private String preData;

//	public BillInstance getBill() {
//		return bill;
//	}
//
//	public void setBill(BillInstance bill) {
//		this.bill = bill;
//	}
	
	@Column(name = "BILL_ID", length = 32)
	public String getBillId() {
		return billId;
	}

	public void setBillId(String billId) {
		this.billId = billId;
	}
	
	@Column(name = "OPERATR_ON", length = 19)
	public String getOperTime() {
		return operTime;
	}
	
	public void setOperTime(String operTime) {
		this.operTime = operTime;
	}
	
	@Column(name = "CONTENT")
	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}
	
	@Column(name = "ORI_DATA")
	public String getOriData() {
		return oriData;
	}

	public void setOriData(String oriData) {
		this.oriData = oriData;
	}
	
	@Column(name = "PRE_DATA")
	public String getPreData() {
		return preData;
	}

	public void setPreData(String preData) {
		this.preData = preData;
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