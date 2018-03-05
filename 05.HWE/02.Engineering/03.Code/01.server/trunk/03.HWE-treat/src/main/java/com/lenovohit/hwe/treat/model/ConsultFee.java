package com.lenovohit.hwe.treat.model;

import javax.persistence.Entity;
import javax.persistence.Table;

import com.lenovohit.hwe.base.model.AuditableModel;

@Entity
@Table(name = "CONSULT_FEE")
public class ConsultFee extends AuditableModel implements java.io.Serializable {
	private static final long serialVersionUID = 2785667409688656841L;
	private String department;					
	private String deptName;					
	private String doctor;					
	private String consultFee;					
	private String stopFlag;					
	public String getDepartment() {
		return department;
	}
	public void setDepartment(String department) {
		this.department = department;
	}
	public String getDeptName() {
		return deptName;
	}
	public void setDeptName(String deptName) {
		this.deptName = deptName;
	}
	public String getDoctor() {
		return doctor;
	}
	public void setDoctor(String doctor) {
		this.doctor = doctor;
	}
	public String getStopFlag() {
		return stopFlag;
	}
	public void setStopFlag(String stopFlag) {
		this.stopFlag = stopFlag;
	}
	public String getConsultFee() {
		return consultFee;
	}
	public void setConsultFee(String consultFee) {
		this.consultFee = consultFee;
	}
	
	
	
	
}
