package com.lenovohit.ssm.treat.model;

public class AssayRecord {
	private String ffmc;//方法名称
	private String data;//参数
	private String bkh;//病卡号
	private String patientId;
	private String patientType;
	private String patientCardNo;
	private String unitCode;
	private String dtReg;
	private String dtEnd;
	private long 	sjjg;//时间间隔
	private String barcode;
	private String machineId;
	private String bgdbm;	//报告单编码
	private String tmh;//报告单的条码号
	private String ybh;//样本号
	private String hyrq;//化验日期
	private String hyxmmc;//化验项目名称
	private String sqsj;//申请时间
	private String sqysmc;//申请医生名称
	private String shbz;//审核标志：1已审核，0未审核
	private String fsbz;//发送标志：1已发送，0未发送
	private String dybz;//打印标志：1已打印，0未打印
	private String pdfUrl ; //PDF文件的URL链接，正常情况下在自助打印的条件是 DYBZ=0，且 URL不为空的单子才可以在自助上打印。
	private String filePath;
	private String imagePath;
	private String fileName;
	private String printFlag;//打印回传结果标志
	
	public String getFfmc() {
		return ffmc;
	}
	public void setFfmc(String ffmc) {
		this.ffmc = ffmc;
	}
	public String getData() {
		return data;
	}
	public void setData(String data) {
		this.data = data;
	}
	public String getBkh() {
		return bkh;
	}
	public void setBkh(String bkh) {
		this.bkh = bkh;
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
	public String getBarcode() {
		return barcode;
	}
	public void setBarcode(String barcode) {
		this.barcode = barcode;
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
	public long getSjjg() {
		return sjjg;
	}
	public void setSjjg(long sjjg) {
		this.sjjg = sjjg;
	}
	public String getMachineId() {
		return machineId;
	}
	public void setMachineId(String machineId) {
		this.machineId = machineId;
	}
	public String getUnitCode() {
		return unitCode;
	}
	public void setUnitCode(String unitCode) {
		this.unitCode = unitCode;
	}
	public String getBgdbm() {
		return bgdbm;
	}
	public void setBgdbm(String bgdbm) {
		this.bgdbm = bgdbm;
	}
	public String getTmh() {
		return tmh;
	}
	public void setTmh(String tmh) {
		this.tmh = tmh;
	}
	public String getYbh() {
		return ybh;
	}
	public void setYbh(String ybh) {
		this.ybh = ybh;
	}
	public String getHyrq() {
		return hyrq;
	}
	public void setHyrq(String hyrq) {
		this.hyrq = hyrq;
	}
	public String getHyxmmc() {
		return hyxmmc;
	}
	public void setHyxmmc(String hyxmmc) {
		this.hyxmmc = hyxmmc;
	}
	public String getSqsj() {
		return sqsj;
	}
	public void setSqsj(String sqsj) {
		this.sqsj = sqsj;
	}
	public String getSqysmc() {
		return sqysmc;
	}
	public void setSqysmc(String sqysmc) {
		this.sqysmc = sqysmc;
	}
	public String getShbz() {
		return shbz;
	}
	public void setShbz(String shbz) {
		this.shbz = shbz;
	}
	public String getFsbz() {
		return fsbz;
	}
	public void setFsbz(String fsbz) {
		this.fsbz = fsbz;
	}
	public String getDybz() {
		return dybz;
	}
	public void setDybz(String dybz) {
		this.dybz = dybz;
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
}
