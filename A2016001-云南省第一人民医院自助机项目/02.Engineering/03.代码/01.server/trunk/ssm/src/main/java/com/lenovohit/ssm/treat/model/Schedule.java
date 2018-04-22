package com.lenovohit.ssm.treat.model;

import java.util.ArrayList;
import java.util.List;

/**
 * 排班
 * @author xiaweiyi
 *
 */
public class Schedule {
	
	private String bookingPlatform;
	private String scheduleId ;   		//排班ID
	private String doctorCode;   		//医生编号
	private String doctorName;   		//医生姓名
	private String doctorPinyin;   		//医生拼音
	private String doctorType;   		//医师职称代码
	private String doctorTypeName;   	//医师职称名称
	private String deptCode;   			//科室代码
	private String deptId;   			//科室Id
	private String deptName;   			//科室名称
	private String deptType;			//科室类别
	private String onDutyTime;			//值班开始时间
	private String offDutyTime;			//值班结束时间
	private String clinicType ;   		//诊疗类型代码
	private String clinicTypeName ;   	//诊疗类型名称
	private String clinicDate;   		//排班日期
	private String clinicDuration;   	//班次类别代码
	private String clinicDurationName;  //班次类别名称
	private String countNo;   			//可预约数
	private String hospitalDistrict;   	//院区代码
	private String hospitalDistrictName;//院区名称
	private String serviceStation;   	//分诊站代码
 
	private String startDate;			//查询开始时间
	private String endDate;				//查询结算时间
	private String specialDiseasesCode;
	private String specialDiseasesName;
	
	
	public String getDeptType() {
		return deptType;
	}
	public void setDeptType(String deptType) {
		this.deptType = deptType;
	}
	public String getSpecialDiseasesCode() {
		return specialDiseasesCode;
	}
	public void setSpecialDiseasesCode(String specialDiseasesCode) {
		this.specialDiseasesCode = specialDiseasesCode;
	}
	public String getSpecialDiseasesName() {
		return specialDiseasesName;
	}
	public void setSpecialDiseasesName(String specialDiseasesName) {
		this.specialDiseasesName = specialDiseasesName;
	}
	
	private List<Appointment> appointments = new ArrayList<Appointment>();//号源列表
	
	public String getDeptId() {
		return deptId;
	}
	public void setDeptId(String deptId) {
		this.deptId = deptId;
	}
	public List<Appointment> getAppointments() {
		return appointments;
	}
	public void setAppointments(List<Appointment> appointments) {
		this.appointments = appointments;
	}
	public String getDoctorPinyin() {
		return doctorPinyin;
	}
	public void setDoctorPinyin(String doctorPinyin) {
		this.doctorPinyin = doctorPinyin;
	}
	public String getBookingPlatform() {
		return bookingPlatform;
	}
	public void setBookingPlatform(String bookingPlatform) {
		this.bookingPlatform = bookingPlatform;
	}
	public String getScheduleId() {
		return scheduleId;
	}
	public void setScheduleId(String scheduleId) {
		this.scheduleId = scheduleId;
	}
	public String getDoctorCode() {
		return doctorCode;
	}
	public void setDoctorCode(String doctorCode) {
		this.doctorCode = doctorCode;
	}
	public String getDoctorName() {
		return doctorName;
	}
	public void setDoctorName(String doctorName) {
		this.doctorName = doctorName;
	}
	public String getDoctorType() {
		return doctorType;
	}
	public void setDoctorType(String doctorType) {
		this.doctorType = doctorType;
	}
	public String getDoctorTypeName() {
		return doctorTypeName;
	}
	public void setDoctorTypeName(String doctorTypeName) {
		this.doctorTypeName = doctorTypeName;
	}
	public String getDeptCode() {
		return deptCode;
	}
	public void setDeptCode(String deptCode) {
		this.deptCode = deptCode;
	}
	public String getDeptName() {
		return deptName;
	}
	public void setDeptName(String deptName) {
		this.deptName = deptName;
	}
	public String getOnDutyTime() {
		return onDutyTime;
	}
	public void setOnDutyTime(String onDutyTime) {
		this.onDutyTime = onDutyTime;
	}
	public String getOffDutyTime() {
		return offDutyTime;
	}
	public void setOffDutyTime(String offDutyTime) {
		this.offDutyTime = offDutyTime;
	}
	public String getClinicType() {
		return clinicType;
	}
	public void setClinicType(String clinicType) {
		this.clinicType = clinicType;
	}
	public String getClinicTypeName() {
		return clinicTypeName;
	}
	public void setClinicTypeName(String clinicTypeName) {
		this.clinicTypeName = clinicTypeName;
	}
	public String getClinicDate() {
		return clinicDate;
	}
	public void setClinicDate(String clinicDate) {
		this.clinicDate = clinicDate;
	}
	public String getClinicDuration() {
		return clinicDuration;
	}
	public void setClinicDuration(String clinicDuration) {
		this.clinicDuration = clinicDuration;
	}
	public String getClinicDurationName() {
		return clinicDurationName;
	}
	public void setClinicDurationName(String clinicDurationName) {
		this.clinicDurationName = clinicDurationName;
	}
	public String getCountNo() {
		return countNo;
	}
	public void setCountNo(String countNo) {
		this.countNo = countNo;
	}
	public String getHospitalDistrict() {
		return hospitalDistrict;
	}
	public void setHospitalDistrict(String hospitalDistrict) {
		this.hospitalDistrict = hospitalDistrict;
	}
	public String getHospitalDistrictName() {
		return hospitalDistrictName;
	}
	public void setHospitalDistrictName(String hospitalDistrictName) {
		this.hospitalDistrictName = hospitalDistrictName;
	}
	public String getServiceStation() {
		return serviceStation;
	}
	public void setServiceStation(String serviceStation) {
		this.serviceStation = serviceStation;
	}
	public String getStartDate() {
		return startDate;
	}
	public void setStartDate(String startDate) {
		this.startDate = startDate;
	}
	public String getEndDate() {
		return endDate;
	}
	public void setEndDate(String endDate) {
		this.endDate = endDate;
	}
}

