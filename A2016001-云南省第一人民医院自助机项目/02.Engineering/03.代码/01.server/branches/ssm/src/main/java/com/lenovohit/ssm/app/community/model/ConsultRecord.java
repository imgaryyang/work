package com.lenovohit.ssm.app.community.model;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

import com.lenovohit.core.model.BaseIdModel;
import com.lenovohit.ssm.app.elh.base.model.Doctor;

@Entity
@Table(name = "CONSULT_RECORD")
public class ConsultRecord extends BaseIdModel {
	private static final long serialVersionUID = 2785667409688656841L;
	private String department;					
	private String deptName;					
	private String hospital;					
	private String hosName;					
	private Doctor doctor;					
	private String consultType;					
	private String consultTopic;					
	private String consultDetail;					
	private String status;					
	private String comm;				
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
	public String getHospital() {
		return hospital;
	}
	public void setHospital(String hospital) {
		this.hospital = hospital;
	}
	public String getHosName() {
		return hosName;
	}
	public void setHosName(String hosName) {
		this.hosName = hosName;
	}
	@ManyToOne
	@JoinColumn(name = "doctor", nullable = true)
	@NotFound(action=NotFoundAction.IGNORE)
	public Doctor getDoctor() {
		return doctor;
	}
	public void setDoctor(Doctor doctor) {
		this.doctor = doctor;
	}
	public String getConsultType() {
		return consultType;
	}
	public void setConsultType(String consultType) {
		this.consultType = consultType;
	}
	public String getConsultTopic() {
		return consultTopic;
	}
	public void setConsultTopic(String consultTopic) {
		this.consultTopic = consultTopic;
	}
	public String getConsultDetail() {
		return consultDetail;
	}
	public void setConsultDetail(String consultDetail) {
		this.consultDetail = consultDetail;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getComm() {
		return comm;
	}
	public void setComm(String comm) {
		this.comm = comm;
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
	
	
	

	
	
	
}
