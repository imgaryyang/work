package com.lenovohit.ssm.treat.model;

import java.math.BigDecimal;

public class AccountBillDetail {
	private String settlementId;	//
	private String settlementCode;	//     
	private String paidType;		//      
	private String paidTypeName;	//     
	private BigDecimal amt;			//      
	private String createdDate;		//      
	private String paidDate;		//      
	private String state;			//
	private String desc;			//
	public String getSettlementId() {
		return settlementId;
	}
	public void setSettlementId(String settlementId) {
		this.settlementId = settlementId;
	}
	public String getSettlementCode() {
		return settlementCode;
	}
	public void setSettlementCode(String settlementCode) {
		this.settlementCode = settlementCode;
	}
	public String getPaidType() {
		return paidType;
	}
	public void setPaidType(String paidType) {
		this.paidType = paidType;
	}
	public String getPaidTypeName() {
		return paidTypeName;
	}
	public void setPaidTypeName(String paidTypeName) {
		this.paidTypeName = paidTypeName;
	}
	public BigDecimal getAmt() {
		return amt;
	}
	public void setAmt(BigDecimal amt) {
		this.amt = amt;
	}
	public String getCreatedDate() {
		return createdDate;
	}
	public void setCreatedDate(String createdDate) {
		this.createdDate = createdDate;
	}
	public String getPaidDate() {
		return paidDate;
	}
	public void setPaidDate(String paidDate) {
		this.paidDate = paidDate;
	}
	public String getState() {
		return state;
	}
	public void setState(String state) {
		this.state = state;
	}
	public String getDesc() {
		return desc;
	}
	public void setDesc(String desc) {
		this.desc = desc;
	}
}
