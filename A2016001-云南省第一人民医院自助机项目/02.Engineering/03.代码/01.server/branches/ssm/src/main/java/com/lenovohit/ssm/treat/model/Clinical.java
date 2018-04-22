package com.lenovohit.ssm.treat.model;

import java.util.List;

/**
 * 诊疗活动
 * 
 * @author xiaweiyi
 *
 */
public class Clinical {
	private String patientNo; // 病人编号 String 非空
	private String startTime;// 开始时间 Datetime 非空
	private String endTime; // 结束时间 Datetime 非空

	private String clinicalId;// 诊疗活动ID Number 非空
	private String specID;// 接诊专科Number 非空
	private String specName;// 接诊专科名称
	private String specStartTime;// 接诊开始时间 Date 非空
	
	private String doctorID;// 接诊医师 Number 非空
	private String doctorName;// 接诊医生姓名 String
	
	
	private String diseaseType;// 病种类型String 0普通 2 特病 3慢病
	private String diseaseCode;// 病种代码 String

	private String recordID;// 病情记录ID String
	private String printCount;// 打印次数string
	
	private String mrSpecID;// 病例专科IDNumber
	private String mFotmatCode;// 格式代码 String
	
	private List<Guide> guides ;
	
	public List<Guide> getGuides() {
		return guides;
	}
	public void setGuides(List<Guide> guides) {
		this.guides = guides;
	}
	public String getPatientNo() {
		return patientNo;
	}
	public void setPatientNo(String patientNo) {
		this.patientNo = patientNo;
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
	public String getClinicalId() {
		return clinicalId;
	}
	public void setClinicalId(String clinicalId) {
		this.clinicalId = clinicalId;
	}
	public String getSpecID() {
		return specID;
	}
	public void setSpecID(String specID) {
		this.specID = specID;
	}
	public String getSpecName() {
		return specName;
	}
	public void setSpecName(String specName) {
		this.specName = specName;
	}
	public String getSpecStartTime() {
		return specStartTime;
	}
	public void setSpecStartTime(String specStartTime) {
		this.specStartTime = specStartTime;
	}
	public String getDoctorID() {
		return doctorID;
	}
	public void setDoctorID(String doctorID) {
		this.doctorID = doctorID;
	}
	public String getDoctorName() {
		return doctorName;
	}
	public void setDoctorName(String doctorName) {
		this.doctorName = doctorName;
	}
	public String getDiseaseType() {
		return diseaseType;
	}
	public void setDiseaseType(String diseaseType) {
		this.diseaseType = diseaseType;
	}
	public String getDiseaseCode() {
		return diseaseCode;
	}
	public void setDiseaseCode(String diseaseCode) {
		this.diseaseCode = diseaseCode;
	}
	public String getRecordID() {
		return recordID;
	}
	public void setRecordID(String recordID) {
		this.recordID = recordID;
	}
	public String getPrintCount() {
		return printCount;
	}
	public void setPrintCount(String printCount) {
		this.printCount = printCount;
	}
	public String getMrSpecID() {
		return mrSpecID;
	}
	public void setMrSpecID(String mrSpecID) {
		this.mrSpecID = mrSpecID;
	}
	public String getmFotmatCode() {
		return mFotmatCode;
	}
	public void setmFotmatCode(String mFotmatCode) {
		this.mFotmatCode = mFotmatCode;
	}

}
