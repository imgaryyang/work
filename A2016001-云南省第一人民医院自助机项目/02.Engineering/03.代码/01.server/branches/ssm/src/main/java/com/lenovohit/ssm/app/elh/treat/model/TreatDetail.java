package com.lenovohit.ssm.app.elh.treat.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Inheritance;
import javax.persistence.InheritanceType;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.lenovohit.core.model.BaseIdModel;
import com.lenovohit.ssm.app.elh.base.model.Hospital;
import com.lenovohit.ssm.treat.model.Patient;

/**
 * 就医项总表
 * @author Administrator
 *
 */
@Entity
@Table(name="ELH_TREATDETAIL")
@Inheritance(strategy=InheritanceType.JOINED)
public class TreatDetail extends BaseIdModel {

	/**
	 * 
	 */
	private static final long serialVersionUID = 8805319130397359699L;
	
	private String idHlht;
	private String hospitalId;
	private String hospitalName;
	private Hospital hospital;
	private String deptId;// 科室
	private String deptName;// 科室
	private String patientId;//就诊人->PATIENT
	private String patientName;//就诊人姓名
	private Patient patient;//就诊人->PATIENT
	private String name;//名称
	private String biz;//业务类别 分组排序时使用
	private String bizName;//业务类别名称
	private String description;//描述
	private String notification;//提醒
	private String treatment;//所属就医记录
	
	private String createTime;//创建时间
	private String startTime;//开始时间
	private String updateTime;//更新时间
	private String endTime;//结束时间
	
	private String status;//状态
	private boolean needPay;//是否需要交费
	private boolean payed;//是否缴费
	@Deprecated 
	private String medicalResult;//诊断结果 不推荐使用
	
	
	@Column(name="PATIENT")
	public String getPatientId() {
		return patientId;
	}
	public void setPatientId(String patientId) {
		this.patientId = patientId;
	}
	@Transient
	public Patient getPatient() {
		return patient;
	}
	public void setPatient(Patient patient) {
		this.patient = patient;
	}
	public String getIdHlht() {
		return idHlht;
	}
	public String getDeptId() {
		return deptId;
	}
	public void setDeptId(String dept) {
		this.deptId = dept;
	}
	public String getDeptName() {
		return deptName;
	}
	public void setDeptName(String deptName) {
		this.deptName = deptName;
	}
	public void setIdHlht(String idHlht) {
		this.idHlht = idHlht;
	}
	
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getBiz() {
		return biz;
	}
	public void setBiz(String biz) {
		this.biz = biz;
	}
	public String getBizName() {
		return bizName;
	}
	public void setBizName(String bizName) {
		this.bizName = bizName;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getNotification() {
		return notification;
	}
	public void setNotification(String notification) {
		this.notification = notification;
	}
	public String getTreatment() {
		return treatment;
	}
	public void setTreatment(String treatment) {
		this.treatment = treatment;
	}
	public String getStartTime() {
		return startTime;
	}
	public void setStartTime(String startTime) {
		this.startTime = startTime;
	}
	public String getEndTime() {
		return endTime;
	}
	public void setEndTime(String endTime) {
		this.endTime = endTime;
	}
	public String getUpdateTime() {
		return updateTime;
	}
	public void setUpdateTime(String updateTime) {
		this.updateTime = updateTime;
	}
	public String getCreateTime() {
		return createTime;
	}
	public void setCreateTime(String createTime) {
		this.createTime = createTime;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public boolean getNeedPay() {
		return needPay;
	}
	public void setNeedPay(boolean needPay) {
		this.needPay = needPay;
	}
	public boolean getPayed() {
		return payed;
	}
	public void setPayed(boolean payed) {
		this.payed = payed;
	}
	public String getMedicalResult() {
		return medicalResult;
	}
	public void setMedicalResult(String medicalResult) {
		this.medicalResult = medicalResult;
	}
	public String getPatientName() {
		return patientName;
	}
	public void setPatientName(String patientName) {
		this.patientName = patientName;
	}
	@Column(name="HOSPITAL")
	public String getHospitalId() {
		return hospitalId;
	}
	public void setHospitalId(String hospitalId) {
		this.hospitalId = hospitalId;
	}
	@Transient
	public Hospital getHospital() {
		return hospital;
	}
	public void setHospital(Hospital hospital) {
		this.hospital = hospital;
	}
	public String getHospitalName() {
		return hospitalName;
	}
	public void setHospitalName(String hospitalName) {
		this.hospitalName = hospitalName;
	}
}
