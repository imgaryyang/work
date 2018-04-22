package com.lenovohit.ssm.treat.model;
/**
 * 就诊记录明细
 *
 */
public class MedicalRecordItem {
	
	private String id;				// "00000001", 
    private String treatmentDate;	//就诊时间 "2017-01-03 13:35", 
    private String departmentId;	//科室ID "001001002", 
    private String departmentName;	//科室 "物理康复", 
    private String doctorId;		//医生ID "0001", 
    private String doctorName;		//医生名称 "蒋建光", 
    private String doctorJobTitleId;//医生职称ID "001", 
    private String doctorJobTitle;	//医生职称 "主任医师", 
    private String printTimes;		//打印次数 0
    
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getTreatmentDate() {
		return treatmentDate;
	}
	public void setTreatmentDate(String treatmentDate) {
		this.treatmentDate = treatmentDate;
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
	public String getDoctorJobTitleId() {
		return doctorJobTitleId;
	}
	public void setDoctorJobTitleId(String doctorJobTitleId) {
		this.doctorJobTitleId = doctorJobTitleId;
	}
	public String getDoctorJobTitle() {
		return doctorJobTitle;
	}
	public void setDoctorJobTitle(String doctorJobTitle) {
		this.doctorJobTitle = doctorJobTitle;
	}
	public String getPrintTimes() {
		return printTimes;
	}
	public void setPrintTimes(String printTimes) {
		this.printTimes = printTimes;
	}
}

