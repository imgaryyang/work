package com.lenovohit.ssm.treat.model;

//住院清单
public class InpatientBill {
	
	private String recipeNo     ;       //处方号
	private String indeptId     ;       //专科ID
	private String indeptName   ;       //专科名称
	private String doctorId     ;       //医师ID
	private String doctorName   ;       //医生姓名
	private String itemId       ;       //项目ID
	private String itemName     ;       //项目名称
	private String feeType      ;       //分类码
	private String dose         ;       //剂量
	private String frequency    ;       //频次
	private String usage        ;       //方法
	private String dosage       ;       //每次用量
	private String dosageSpec   ;       //每次用量单位
	private String itemPrice    ;       //单价
	private String itemNum      ;       //数量
	private String itemSepc     ;       //规格
	private String paymentStatus;       //缴费状态
	private String execStatus   ;       //确认状态
	private String paymentTime  ;       //交易时间
	
	public String getRecipeNo() {
		return recipeNo;
	}
	public void setRecipeNo(String recipeNo) {
		this.recipeNo = recipeNo;
	}
	public String getIndeptId() {
		return indeptId;
	}
	public void setIndeptId(String indeptId) {
		this.indeptId = indeptId;
	}
	public String getIndeptName() {
		return indeptName;
	}
	public void setIndeptName(String indeptName) {
		this.indeptName = indeptName;
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
	public String getItemId() {
		return itemId;
	}
	public void setItemId(String itemId) {
		this.itemId = itemId;
	}
	public String getItemName() {
		return itemName;
	}
	public void setItemName(String itemName) {
		this.itemName = itemName;
	}
	public String getFeeType() {
		return feeType;
	}
	public void setFeeType(String feeType) {
		this.feeType = feeType;
	}
	public String getDose() {
		return dose;
	}
	public void setDose(String dose) {
		this.dose = dose;
	}
	public String getFrequency() {
		return frequency;
	}
	public void setFrequency(String frequency) {
		this.frequency = frequency;
	}
	public String getUsage() {
		return usage;
	}
	public void setUsage(String usage) {
		this.usage = usage;
	}
	public String getDosage() {
		return dosage;
	}
	public void setDosage(String dosage) {
		this.dosage = dosage;
	}
	public String getDosageSpec() {
		return dosageSpec;
	}
	public void setDosageSpec(String dosageSpec) {
		this.dosageSpec = dosageSpec;
	}
	public String getItemPrice() {
		return itemPrice;
	}
	public void setItemPrice(String itemPrice) {
		this.itemPrice = itemPrice;
	}
	public String getItemNum() {
		return itemNum;
	}
	public void setItemNum(String itemNum) {
		this.itemNum = itemNum;
	}
	public String getItemSepc() {
		return itemSepc;
	}
	public void setItemSepc(String itemSepc) {
		this.itemSepc = itemSepc;
	}
	public String getPaymentStatus() {
		return paymentStatus;
	}
	public void setPaymentStatus(String paymentStatus) {
		this.paymentStatus = paymentStatus;
	}
	public String getExecStatus() {
		return execStatus;
	}
	public void setExecStatus(String execStatus) {
		this.execStatus = execStatus;
	}
	public String getPaymentTime() {
		return paymentTime;
	}
	public void setPaymentTime(String paymentTime) {
		this.paymentTime = paymentTime;
	}
	
}
