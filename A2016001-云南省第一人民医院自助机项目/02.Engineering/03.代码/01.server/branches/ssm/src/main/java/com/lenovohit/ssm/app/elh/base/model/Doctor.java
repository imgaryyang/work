package com.lenovohit.ssm.app.elh.base.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.lenovohit.core.model.BaseIdModel;

/**
 * 医生表
 * @author Administrator
 *
 */
@Entity
@Table(name="ELH_DOCTOR")
public class Doctor extends BaseIdModel {
	private static final long serialVersionUID = -4847708119225675684L;
	
	private String idHlht;//院方数据ID
	private String name;//姓名
	private String gender;//性别
	private String jobNum;//工号
	private String certNum;//资格证书号
	private String degrees;//学历
	private String major;//专业
	private String jobTitle;//职称
	private String speciality;//特长
	private Date entryTime;//入职时间
	private String departmentId;//所属科室ID
	private AppDepartment department;//所属科室
	private String deptName;//科室名称
	private String hospitalId;//所属医院ID
	private Hospital hospital;//所属医院
	private String hosName;//医院名称
	private String portrait;//照片
	private String clinic;//诊治代码
	private String clinicDesc;//诊治描述
	private String isExpert;//是否专家
	private String birthday;//出生日期
	private String entryDate;//从医日期
	private int sortno;//排序
	
	public String getIdHlht() {
		return idHlht;
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
	public String getGender() {
		return gender;
	}
	public void setGender(String gender) {
		this.gender = gender;
	}
	public String getJobNum() {
		return jobNum;
	}
	public void setJobNum(String jobNum) {
		this.jobNum = jobNum;
	}
	public String getCertNum() {
		return certNum;
	}
	public void setCertNum(String certNum) {
		this.certNum = certNum;
	}
	public String getDegrees() {
		return degrees;
	}
	public void setDegrees(String degrees) {
		this.degrees = degrees;
	}
	public String getMajor() {
		return major;
	}
	public void setMajor(String major) {
		this.major = major;
	}
	public String getJobTitle() {
		return jobTitle;
	}
	public void setJobTitle(String jobTitle) {
		this.jobTitle = jobTitle;
	}
	public String getSpeciality() {
		return speciality;
	}
	public void setSpeciality(String speciality) {
		this.speciality = speciality;
	}
	public Date getEntryTime() {
		return entryTime;
	}
	public void setEntryTime(Date entryTime) {
		this.entryTime = entryTime;
	}
	@Column(name = "department")
	public String getDepartmentId() {
		return departmentId;
	}
	public void setDepartmentId(String departmentId) {
		this.departmentId = departmentId;
	}
	@Transient
	public AppDepartment getDepartment() {
		return department;
	}
	public void setDepartment(AppDepartment department) {
		this.department = department;
	}
	public String getDeptName() {
		return deptName;
	}
	public void setDeptName(String deptName) {
		this.deptName = deptName;
	}
	@Column(name = "hospital")
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
	public String getHosName() {
		return hosName;
	}
	public void setHosName(String hosName) {
		this.hosName = hosName;
	}
	public String getPortrait() {
		return portrait;
	}
	public void setPortrait(String portrait) {
		this.portrait = portrait;
	}
	public String getClinic() {
		return clinic;
	}
	public void setClinic(String clinic) {
		this.clinic = clinic;
	}
	public String getClinicDesc() {
		return clinicDesc;
	}
	public void setClinicDesc(String clinicDesc) {
		this.clinicDesc = clinicDesc;
	}
	public String getIsExpert() {
		return isExpert;
	}
	public void setIsExpert(String isExpert) {
		this.isExpert = isExpert;
	}
	public String getBirthday() {
		return birthday;
	}
	public void setBirthday(String birthday) {
		this.birthday = birthday;
	}
	public String getEntryDate() {
		return entryDate;
	}
	public void setEntryDate(String entryDate) {
		this.entryDate = entryDate;
	}
	public int getSortno() {
		return sortno;
	}
	public void setSortno(int sortno) {
		this.sortno = sortno;
	}

}
