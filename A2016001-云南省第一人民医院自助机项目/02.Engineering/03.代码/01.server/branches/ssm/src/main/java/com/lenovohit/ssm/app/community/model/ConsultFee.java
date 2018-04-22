package com.lenovohit.ssm.app.community.model;

import javax.persistence.Entity;
import javax.persistence.Table;

import com.lenovohit.core.model.BaseIdModel;

@Entity
@Table(name = "CONSULT_FEE")
public class ConsultFee extends BaseIdModel {
	private static final long serialVersionUID = 2785667409688656841L;
	private String department;					
	private String deptName;					
	private String doctor;					
	private String consultFee;					
	private String stopFlag;					
	private String createTime; 					
	private String createOper;					
	private String updateTime;					
	private String updateOper;					
	private String createOperId;					
	private String updateOperId;
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
	public String getCreateTime() {
		return createTime;
	}
	public void setCreateTime(String createTime) {
		this.createTime = createTime;
	}
	public String getCreateOper() {
		return createOper;
	}
	public void setCreateOper(String createOper) {
		this.createOper = createOper;
	}
	public String getUpdateTime() {
		return updateTime;
	}
	public void setUpdateTime(String updateTime) {
		this.updateTime = updateTime;
	}
	public String getUpdateOper() {
		return updateOper;
	}
	public void setUpdateOper(String updateOper) {
		this.updateOper = updateOper;
	}
	public String getCreateOperId() {
		return createOperId;
	}
	public void setCreateOperId(String createOperId) {
		this.createOperId = createOperId;
	}
	public String getUpdateOperId() {
		return updateOperId;
	}
	public void setUpdateOperId(String updateOperId) {
		this.updateOperId = updateOperId;
	}
	public String getConsultFee() {
		return consultFee;
	}
	public void setConsultFee(String consultFee) {
		this.consultFee = consultFee;
	}
	
	
	
	
}
