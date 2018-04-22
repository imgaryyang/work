package com.lenovohit.ssm.treat.model;

import java.math.BigDecimal;

/**
 * 号源
 * @author xiaweiyi
 *
 */
public class AppointmentTimePeriod {
	
	private String apptId;			//预约ID		"0001"
    private String apptDate;		//预约日期		"2017-01-15"
    private String apptTime;		//预约时间 		""
    private String dayPeriod;		//预约时间段	"am" 
    private String startTime;		//			"8:30" 
    private String endTime;			//			"8:36" 
    private String bookNum;			//预约就诊序号	"3"
	private String scheduleId;		//			"0001" 
	private String departmentId;	//预约科室ID	"001001002" 
	private String departmentName;	//预约科室		"物理康复" 
    private String diagnosisType;	//诊断类型		"专科" 
    private String doctorId;		//预约医生ID	"0001" 
	private String doctorName;		//预约医生		"蒋建光" 
	private String jobTitleId;		//医生职称编号	"001" 
	private String jobTitle;		//医生职称		"主任医师" 
    private BigDecimal registeredAmount = new BigDecimal(0);
    private String address;			//就诊地址		"门诊楼二楼东侧外科诊室"
    private String state;			//状态
    private String bookDate;		//预约时间
    private String canceledDate;	//取消时间
    
	public String getApptId() {
		return apptId;
	}
	public void setApptId(String apptId) {
		this.apptId = apptId;
	}
	public String getApptDate() {
		return apptDate;
	}
	public void setApptDate(String apptDate) {
		this.apptDate = apptDate;
	}
	public String getApptTime() {
		return apptTime;
	}
	public void setApptTime(String apptTime) {
		this.apptTime = apptTime;
	}
	public String getDayPeriod() {
		return dayPeriod;
	}
	public void setDayPeriod(String dayPeriod) {
		this.dayPeriod = dayPeriod;
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
	public String getBookNum() {
		return bookNum;
	}
	public void setBookNum(String bookNum) {
		this.bookNum = bookNum;
	}
	public String getScheduleId() {
		return scheduleId;
	}
	public void setScheduleId(String scheduleId) {
		this.scheduleId = scheduleId;
	}
	public String getDepartmentId() {
		return departmentId;
	}
	public void setDepartmentId(String departmentId) {
		this.departmentId = departmentId;
	}
	public String getDepartmentName() {
		return departmentName;
	}
	public void setDepartmentName(String departmentName) {
		this.departmentName = departmentName;
	}
	public String getDiagnosisType() {
		return diagnosisType;
	}
	public void setDiagnosisType(String diagnosisType) {
		this.diagnosisType = diagnosisType;
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
	public String getJobTitleId() {
		return jobTitleId;
	}
	public void setJobTitleId(String jobTitleId) {
		this.jobTitleId = jobTitleId;
	}
	public String getJobTitle() {
		return jobTitle;
	}
	public void setJobTitle(String jobTitle) {
		this.jobTitle = jobTitle;
	}
	public BigDecimal getRegisteredAmount() {
		return registeredAmount;
	}
	public void setRegisteredAmount(BigDecimal registeredAmount) {
		this.registeredAmount = registeredAmount;
	}
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	public String getState() {
		return state;
	}
	public void setState(String state) {
		this.state = state;
	}
	public String getBookDate() {
		return bookDate;
	}
	public void setBookDate(String bookDate) {
		this.bookDate = bookDate;
	}
	public String getCanceledDate() {
		return canceledDate;
	}
	public void setCanceledDate(String canceledDate) {
		this.canceledDate = canceledDate;
	}
}
