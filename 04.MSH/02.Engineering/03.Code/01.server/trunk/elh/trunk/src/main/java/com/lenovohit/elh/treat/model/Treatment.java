package com.lenovohit.elh.treat.model;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.lenovohit.core.model.BaseIdModel;
import com.lenovohit.elh.base.model.Department;
import com.lenovohit.elh.base.model.Doctor;
import com.lenovohit.elh.base.model.Hospital;
import com.lenovohit.elh.base.model.Patient;

/**
 * 就医记录表
 * @author Administrator
 *
 */
@Entity
@Table(name="ELH_TREATMENT")
public class Treatment extends BaseIdModel {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = -8504665976338361906L;
	
	private String idHlht;
	
	private Patient patient;//就诊人->patient
	private Hospital hospital;//就诊医院->hospital
	private Department department;//就诊科室->department
	private Doctor doctor;//主治医生
	
	private String patientId;
	private String hospitalId;//就诊医院->hospital
	private String departmentId;//就诊科室->department
	private String doctorId;//主治医生

	
	private String patientName;
	private String hospitalName;//就诊医院->hospital
	private String departmentName;//就诊科室->department
	private String doctorName;//主治医生
	
	private String cardType;//就诊卡类型
	private String cardNo;//就诊卡号
	private String cardTypeName;//所持卡类型
	private String appUser;//就医账户
	private String patientHlht;//院方就诊人标识->patient	
	private String status;//状态
	private String type;//类别 0 普通 1急诊
	private String medcialResult;//诊断结果
	private String notification;//当前提醒
	private String createTime;//创建时间
	private String startTime;//开始时间
	private String updateTime;//更新时间
	private List<TreatGroup> groups;
	@Transient
	public List<TreatGroup> getGroups() {
		if(null==groups )groups=new ArrayList<TreatGroup>();
		return groups;
	}
	public void setGroups(List<TreatGroup> groups) {
		this.groups = groups;
	}
	public String getStartTime() {
		return startTime;
	}
	public void setStartTime(String startTime) {
		this.startTime = startTime;
	}
	public String getUpdateTime() {
		return updateTime;
	}
	public void setUpdateTime(String updateTime) {
		this.updateTime = updateTime;
	}
	public String getIdHlht() {
		return idHlht;
	}
	public void setIdHlht(String idHlht) {
		this.idHlht = idHlht;
	}
	public String getCreateTime() {
		return createTime;
	}
	public void setCreateTime(String createTime) {
		this.createTime = createTime;
	}
	
	public String getPatientHlht() {
		return patientHlht;
	}
	public void setPatientHlht(String patientHlht) {
		this.patientHlht = patientHlht;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getMedcialResult() {
		return medcialResult;
	}
	public void setMedcialResult(String medcialResult) {
		this.medcialResult = medcialResult;
	}
	public String getNotification() {
		return notification;
	}
	public void setNotification(String notification) {
		this.notification = notification;
	}
	public String getAppUser() {
		return appUser;
	}
	public void setAppUser(String appUser) {
		this.appUser = appUser;
	}
	@Transient
	public Patient getPatient() {
		return patient;
	}
	public void setPatient(Patient patient) {
		this.patient = patient;
	}
	@Transient
	public Hospital getHospital() {
		return hospital;
	}
	public void setHospital(Hospital hospital) {
		this.hospital = hospital;
	}
	@Transient
	public Department getDepartment() {
		return department;
	}
	public void setDepartment(Department department) {
		this.department = department;
	}
	@Transient
	public Doctor getDoctor() {
		return doctor;
	}
	public void setDoctor(Doctor doctor) {
		this.doctor = doctor;
	}
	@Column(name="PATIENT")
	public String getPatientId() {
		return patientId;
	}
	public void setPatientId(String patientId) {
		this.patientId = patientId;
	}
	@Column(name="HOSPITAL")
	public String getHospitalId() {
		return hospitalId;
	}
	public void setHospitalId(String hospitalId) {
		this.hospitalId = hospitalId;
	}
	@Column(name="DEPARTMENT")
	public String getDepartmentId() {
		return departmentId;
	}
	public void setDepartmentId(String departmentId) {
		this.departmentId = departmentId;
	}
	@Column(name="DOCTOR")
	public String getDoctorId() {
		return doctorId;
	}
	public void setDoctorId(String doctorId) {
		this.doctorId = doctorId;
	}
	public String getPatientName() {
		return patientName;
	}
	public void setPatientName(String patientName) {
		this.patientName = patientName;
	}
	public String getHospitalName() {
		return hospitalName;
	}
	public void setHospitalName(String hospitalName) {
		this.hospitalName = hospitalName;
	}
	public String getDepartmentName() {
		return departmentName;
	}
	public void setDepartmentName(String departmentName) {
		this.departmentName = departmentName;
	}
	public String getDoctorName() {
		return doctorName;
	}
	public void setDoctorName(String doctorName) {
		this.doctorName = doctorName;
	}
	public String getCardType() {
		return cardType;
	}
	public void setCardType(String cardType) {
		this.cardType = cardType;
	}
	public String getCardTypeName() {
		return cardTypeName;
	}
	public void setCardTypeName(String cardTypeName) {
		this.cardTypeName = cardTypeName;
	}
	public String getCardNo() {
		return cardNo;
	}
	public void setCardNo(String cardNo) {
		this.cardNo = cardNo;
	}
}
