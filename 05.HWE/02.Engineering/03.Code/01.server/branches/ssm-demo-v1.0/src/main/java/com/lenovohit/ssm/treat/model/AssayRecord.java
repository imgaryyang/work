package com.lenovohit.ssm.treat.model;

public class AssayRecord {
	private String patientId;			//患者Id
	private String patientType;			//患者类型 门诊|住院
	private String patientCardNo;		//患者就诊
	private String unitCode;			//单位编号
	private String dtReg;				//开始日期(yyyy-MM-dd HH:mm:ss)
	private String dtEnd;				//结束日期(yyyy-MM-dd HH:mm:ss)
	private String barcode;				//条码号
	private String machineId;			//仪器ID
	private String sampleId;			//样本号
	private String sampleType;			//样本类型
	private String testdate ; 			//检验日期
	private String applydate ; 			//申请日期
	private String patientGender;		//患者性别 男|女
	private String patientAge;			//患者年龄
	private String subjectCode;			//检验项目编码
	private String subjectName;			//检验项目名称
	private String filePath;			//结果图片地址
	private String status;				//审核标识 5:审核,2:核收,0:接收,9:待查
	private String printStatus;			//打印状态 0:未打印,1:已打印
	private String printFlag;			//打印标识 0：不打印，1：打印
	private String windowFlag;			//窗口标识 0：不弹窗，1：弹窗
	private String msg;					//提示内容
	
	public String getPatientCardNo() {
		return patientCardNo;
	}
	public void setPatientCardNo(String patientCardNo) {
		this.patientCardNo = patientCardNo;
	}
	public String getUnitCode() {
		return unitCode;
	}
	public void setUnitCode(String unitCode) {
		this.unitCode = unitCode;
	}
	public String getFilePath() {
		return filePath;
	}
	public void setFilePath(String filePath) {
		this.filePath = filePath;
	}
	public String getSampleType() {
		return sampleType;
	}
	public void setSampleType(String sampleType) {
		this.sampleType = sampleType;
	}
	public String getApplydate() {
		return applydate;
	}
	public void setApplydate(String applydate) {
		this.applydate = applydate;
	}
	public String getPatientGender() {
		return patientGender;
	}
	public void setPatientGender(String patientGender) {
		this.patientGender = patientGender;
	}
	public String getPatientAge() {
		return patientAge;
	}
	public void setPatientAge(String patientAge) {
		this.patientAge = patientAge;
	}
	public String getSubjectCode() {
		return subjectCode;
	}
	public void setSubjectCode(String subjectCode) {
		this.subjectCode = subjectCode;
	}
	public String getSubjectName() {
		return subjectName;
	}
	public void setSubjectName(String subjectName) {
		this.subjectName = subjectName;
	}
	public String getBarcode() {
		return barcode;
	}
	public void setBarcode(String barcode) {
		this.barcode = barcode;
	}
	public String getMachineId() {
		return machineId;
	}
	public void setMachineId(String machineId) {
		this.machineId = machineId;
	}
	public String getSampleId() {
		return sampleId;
	}
	public void setSampleId(String sampleId) {
		this.sampleId = sampleId;
	}
	public String getTestdate() {
		return testdate;
	}
	public void setTestdate(String testdate) {
		this.testdate = testdate;
	}
	public String getPatientId() {
		return patientId;
	}
	public void setPatientId(String patientId) {
		this.patientId = patientId;
	}
	public String getPatientType() {
		return patientType;
	}
	public void setPatientType(String patientType) {
		this.patientType = patientType;
	}
	public String getDtReg() {
		return dtReg;
	}
	public void setDtReg(String dtReg) {
		this.dtReg = dtReg;
	}
	public String getDtEnd() {
		return dtEnd;
	}
	public void setDtEnd(String dtEnd) {
		this.dtEnd = dtEnd;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getPrintStatus() {
		return printStatus;
	}
	public void setPrintStatus(String printStatus) {
		this.printStatus = printStatus;
	}
	public String getPrintFlag() {
		return printFlag;
	}
	public void setPrintFlag(String printFlag) {
		this.printFlag = printFlag;
	}
	public String getWindowFlag() {
		return windowFlag;
	}
	public void setWindowFlag(String windowFlag) {
		this.windowFlag = windowFlag;
	}
	public String getMsg() {
		return msg;
	}
	public void setMsg(String msg) {
		this.msg = msg;
	}
}
