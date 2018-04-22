package com.lenovohit.ssm.treat.model;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class AccountBill {
	private String id;
	private String orderCode;		// PPC20170123000001     
	private String orderType;		// 0     
	private String orderTypeName;	// 预存     
	private String orderDesc;		// 现金预存     
	private BigDecimal amt;			// 100.00     
	private String createdDate;		// 2017-01-01 09:34     
	private BigDecimal miPaid;		// 0.00     
	private BigDecimal paPaid;		// 0.00     
	private BigDecimal selfPaid;	// 100.00     
	private String paidType;		// 10     
	private String paidTypeName;	// 现金     
	private String paidDate;		// 2017-01-01 09:34     
	private String state;			// 2
	private List<AccountBillDetail> items = new ArrayList<AccountBillDetail>();//明细
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getOrderCode() {
		return orderCode;
	}
	public void setOrderCode(String orderCode) {
		this.orderCode = orderCode;
	}
	public String getOrderType() {
		return orderType;
	}
	public void setOrderType(String orderType) {
		this.orderType = orderType;
	}
	public String getOrderTypeName() {
		return orderTypeName;
	}
	public void setOrderTypeName(String orderTypeName) {
		this.orderTypeName = orderTypeName;
	}
	public String getOrderDesc() {
		return orderDesc;
	}
	public void setOrderDesc(String orderDesc) {
		this.orderDesc = orderDesc;
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
	public BigDecimal getMiPaid() {
		return miPaid;
	}
	public void setMiPaid(BigDecimal miPaid) {
		this.miPaid = miPaid;
	}
	public BigDecimal getPaPaid() {
		return paPaid;
	}
	public void setPaPaid(BigDecimal paPaid) {
		this.paPaid = paPaid;
	}
	public BigDecimal getSelfPaid() {
		return selfPaid;
	}
	public void setSelfPaid(BigDecimal selfPaid) {
		this.selfPaid = selfPaid;
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
	public List<AccountBillDetail> getItems() {
		return items;
	}
	public void setItems(List<AccountBillDetail> items) {
		this.items = items;
	}
}
