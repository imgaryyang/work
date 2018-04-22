package com.lenovohit.ssm.treat.model;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class UnPayedFeeRecord {
	
	private String prescriptionId;	//
	private String prescriptionDate;//
	private String deptId;			//
	private String deptName;		//
	private String doctorId;		//
	private String doctorName;		//
	private String typeId;			//
	private String typeName;		//
	private BigDecimal totalAmt;	//
	private List<UnPayedFeeItem> items = new ArrayList<UnPayedFeeItem>();//明细
	
	public String getPrescriptionId() {
		return prescriptionId;
	}
	public void setPrescriptionId(String prescriptionId) {
		this.prescriptionId = prescriptionId;
	}
	public String getPrescriptionDate() {
		return prescriptionDate;
	}
	public void setPrescriptionDate(String prescriptionDate) {
		this.prescriptionDate = prescriptionDate;
	}
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
	public String getDoctorId() {
		return doctorId;
	}
	public void setDoctorId(String doctorId) {
		this.doctorId = doctorId;
	}
	public String getDoctorName() {
		return doctorName;
	}
	public void setDoctorName(String doctorName) {
		this.doctorName = doctorName;
	}
	public String getTypeId() {
		return typeId;
	}
	public void setTypeId(String typeId) {
		this.typeId = typeId;
	}
	public String getTypeName() {
		return typeName;
	}
	public void setTypeName(String typeName) {
		this.typeName = typeName;
	}
	public BigDecimal getTotalAmt() {
		return totalAmt;
	}
	public void setTotalAmt(BigDecimal totalAmt) {
		this.totalAmt = totalAmt;
	}
	public List<UnPayedFeeItem> getItems() {
		return items;
	}
	public void setItems(List<UnPayedFeeItem> items) {
		this.items = items;
	}
}
