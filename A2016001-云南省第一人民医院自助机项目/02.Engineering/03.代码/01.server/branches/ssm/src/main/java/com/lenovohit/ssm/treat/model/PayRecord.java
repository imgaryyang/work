package com.lenovohit.ssm.treat.model;
/**
 * 缴费记录
 *
 */
public class PayRecord {
    
	private String patientNo;      //病人编号
	private String patientName;    //病人姓名
	private String payDate;        //收费时间
	private String itemClass;      //项目类别
	private String insurClass;     //医保类别
	private String myselfScale;    //自负比例
	private String itemCode;       //项目编码
	private String itemName;       //项目名称
	private String itemSpec;       //规格
	private String itemUnits;      //单位
	private String itemAmount;     //数量
	private String itemPrice;      //单价
	private String itemCosts;      //金额
	private String performDept;    //开单科室
	private String doctorName;     //开单医生
	private String adviceTime;     //开单时间
	private String recipeNo;       //处方号
	
	
	public String getPatientNo() {
		return patientNo;
	}
	public void setPatientNo(String patientNo) {
		this.patientNo = patientNo;
	}
	public String getPatientName() {
		return patientName;
	}
	public void setPatientName(String patientName) {
		this.patientName = patientName;
	}
	public String getPayDate() {
		return payDate;
	}
	public void setPayDate(String payDate) {
		this.payDate = payDate;
	}
	public String getItemClass() {
		return itemClass;
	}
	public void setItemClass(String itemClass) {
		this.itemClass = itemClass;
	}
	public String getInsurClass() {
		return insurClass;
	}
	public void setInsurClass(String insurClass) {
		this.insurClass = insurClass;
	}
	public String getMyselfScale() {
		return myselfScale;
	}
	public void setMyselfScale(String myselfScale) {
		this.myselfScale = myselfScale;
	}
	public String getItemCode() {
		return itemCode;
	}
	public void setItemCode(String itemCode) {
		this.itemCode = itemCode;
	}
	public String getItemName() {
		return itemName;
	}
	public void setItemName(String itemName) {
		this.itemName = itemName;
	}
	public String getItemSpec() {
		return itemSpec;
	}
	public void setItemSpec(String itemSpec) {
		this.itemSpec = itemSpec;
	}
	public String getItemUnits() {
		return itemUnits;
	}
	public void setItemUnits(String itemUnits) {
		this.itemUnits = itemUnits;
	}
	public String getItemAmount() {
		return itemAmount;
	}
	public void setItemAmount(String itemAmount) {
		this.itemAmount = itemAmount;
	}
	public String getItemPrice() {
		return itemPrice;
	}
	public void setItemPrice(String itemPrice) {
		this.itemPrice = itemPrice;
	}
	public String getItemCosts() {
		return itemCosts;
	}
	public void setItemCosts(String itemCosts) {
		this.itemCosts = itemCosts;
	}
	public String getPerformDept() {
		return performDept;
	}
	public void setPerformDept(String performDept) {
		this.performDept = performDept;
	}
	public String getDoctorName() {
		return doctorName;
	}
	public void setDoctorName(String doctorName) {
		this.doctorName = doctorName;
	}
	public String getAdviceTime() {
		return adviceTime;
	}
	public void setAdviceTime(String adviceTime) {
		this.adviceTime = adviceTime;
	}
	public String getRecipeNo() {
		return recipeNo;
	}
	public void setRecipeNo(String recipeNo) {
		this.recipeNo = recipeNo;
	}
    
}
