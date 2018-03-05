package com.lenovohit.hcp.material.model;

import java.util.Date;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.lenovohit.hcp.base.model.HcpBaseModel;

@Entity
@Table(name = "MATERIAL_BUYBILL") // 采购订单表
public class MatBuyBill extends HcpBaseModel {
	private static final long serialVersionUID = 4695224781661510820L;
	private String buyBill;
    private String deptId;
    private String company;
    private String buyCost;
    private String auitdOper;
    private Date auitdTime;
    private String invoiceNo;
    private String buyState; //采购状态|BUY_STATE
    private String comm;
    private List<MatBuyDetail> buyDetail;
    
    @Transient
	public List<MatBuyDetail> getBuyDetail() {
		return buyDetail;
	}
	public void setBuyDetail(List<MatBuyDetail> buyDetail) {
		this.buyDetail = buyDetail;
	}
	
	public String getBuyBill() {
		return buyBill;
	}
	public void setBuyBill(String buyBill) {
		this.buyBill = buyBill;
	}
	public String getDeptId() {
		return deptId;
	}
	public void setDeptId(String deptId) {
		this.deptId = deptId;
	}
	public String getCompany() {
		return company;
	}
	public void setCompany(String company) {
		this.company = company;
	}
	public String getBuyCost() {
		return buyCost;
	}
	public void setBuyCost(String buyCost) {
		this.buyCost = buyCost;
	}
	public String getAuitdOper() {
		return auitdOper;
	}
	public void setAuitdOper(String auitdOper) {
		this.auitdOper = auitdOper;
	}
	public Date getAuitdTime() {
		return auitdTime;
	}
	public void setAuitdTime(Date auitdTime) {
		this.auitdTime = auitdTime;
	}
	public String getInvoiceNo() {
		return invoiceNo;
	}
	public void setInvoiceNo(String invoiceNo) {
		this.invoiceNo = invoiceNo;
	}
	public String getBuyState() {
		return buyState;
	}
	public void setBuyState(String buyState) {
		this.buyState = buyState;
	}
	public String getComm() {
		return comm;
	}
	public void setComm(String comm) {
		this.comm = comm;
	}
}