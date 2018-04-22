package com.lenovohit.ssm.treat.model;

public class PacsRecord {
	
	private String data;//参数
	private String patientId;
	private String patientCardNo;
	private String patientType;
	private String unitCode;
	private String dtReg;
	private String dtEnd;
	private String barcode;
	private String machineId;
	private String examApplyId;//申请单号
	private String examItemName;//检查项目
	private String expectExamDate;//检查时间
	private String pid;//病人编号
	private String patientName;//病人姓名
	private String sex;//病人性别
	private String pdfUrl;
	private String filePath;
	private String imagePath;
	private String fileName;
	private String printFlag;//打印回传结果标志
	private String downLoadPdfResponse;
	private String downLoadPdfResult;
	private String error;
	
	public String getData() {
		return data;
	}
	public void setData(String data) {
		this.data = data;
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
	public String getExamApplyId() {
		return examApplyId;
	}
	public void setExamApplyId(String examApplyId) {
		this.examApplyId = examApplyId;
	}
	public String getExamItemName() {
		return examItemName;
	}
	public void setExamItemName(String examItemName) {
		this.examItemName = examItemName;
	}
	public String getExpectExamDate() {
		return expectExamDate;
	}
	public void setExpectExamDate(String expectExamDate) {
		this.expectExamDate = expectExamDate;
	}
	public String getPid() {
		return pid;
	}
	public void setPid(String pid) {
		this.pid = pid;
	}
	public String getPatientName() {
		return patientName;
	}
	public void setPatientName(String patientName) {
		this.patientName = patientName;
	}
	public String getSex() {
		return sex;
	}
	public void setSex(String sex) {
		this.sex = sex;
	}
	
	public String getPdfUrl() {
		return pdfUrl;
	}
	public void setPdfUrl(String pdfUrl) {
		this.pdfUrl = pdfUrl;
	}
	public String getFilePath() {
		return filePath;
	}
	public void setFilePath(String filePath) {
		this.filePath = filePath;
	}
	public String getImagePath() {
		return imagePath;
	}
	public void setImagePath(String imagePath) {
		this.imagePath = imagePath;
	}
	public String getFileName() {
		return fileName;
	}
	public void setFileName(String fileName) {
		this.fileName = fileName;
	}
	public String getPrintFlag() {
		return printFlag;
	}
	public void setPrintFlag(String printFlag) {
		this.printFlag = printFlag;
	}
	public String getDownLoadPdfResponse() {
		return downLoadPdfResponse;
	}
	public void setDownLoadPdfResponse(String downLoadPdfResponse) {
		this.downLoadPdfResponse = downLoadPdfResponse;
	}
	public String getError() {
		return error;
	}
	public void setError(String error) {
		this.error = error;
	}
	public String getDownLoadPdfResult() {
		return downLoadPdfResult;
	}
	public void setDownLoadPdfResult(String downLoadPdfResult) {
		this.downLoadPdfResult = downLoadPdfResult;
	}
}
