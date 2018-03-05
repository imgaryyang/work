package com.lenovohit.hcp.pharmacy.model;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.Table;

import com.lenovohit.core.model.BaseIdModel;


@Entity 
@Table(name = "PHA_APPLYIN_VIEW")	// 药房药库 - 入库申请-视图信息
public class PhaApplyInView extends BaseIdModel {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private String  appBill;
	private String  appOper;
	private String  hosId;
	private Date  appTime;
	private String  appState;
	private String fromDeptId;
	private String deptName;
	private String deptId;
	
	
	public String getDeptId() {
		return deptId;
	}
	public void setDeptId(String deptId) {
		this.deptId = deptId;
	}
	public String getDeptName() {
		return deptName;
	}
	public void setDeptName(String deptName) {
		this.deptName = deptName;
	}
	public String getFromDeptId() {
		return fromDeptId;
	}
	public void setFromDeptId(String fromDeptId) {
		this.fromDeptId = fromDeptId;
	}

	public String getAppBill() {
		return appBill;
	}
	public void setAppBill(String appBill) {
		this.appBill = appBill;
	}
	public String getAppOper() {
		return appOper;
	}
	public void setAppOper(String appOper) {
		this.appOper = appOper;
	}
	public Date getAppTime() {
		return appTime;
	}
	public void setAppTime(Date appTime) {
		this.appTime = appTime;
	}
	public String getAppState() {
		return appState;
	}
	public void setAppState(String appState) {
		this.appState = appState;
	}
	public String getHosId() {
		return hosId;
	}
	public void setHosId(String hosId) {
		this.hosId = hosId;
	}
	
	
	
	
	
}
