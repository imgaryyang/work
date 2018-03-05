package com.lenovohit.hcp.finance.model;

import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.lenovohit.hcp.base.annotation.RedisSequence;
import com.lenovohit.hcp.base.model.Department;
import com.lenovohit.hcp.base.model.HcpBaseModel;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.card.model.Patient;
import com.lenovohit.hcp.odws.model.MedicalOrder;

@Entity
@Table(name = "OC_CHARGEDETAIL") // 收费信息表
public class OutpatientChargeDetail extends HcpBaseModel {

	private static final long serialVersionUID = 1L;
	public static final String APPLY_STATE_PAY_UNMEDICINE = "1";// 1已交费未发药2已发药3已退药4已退费
	public static final String APPLY_STATE_MEDICINED = "2";
	public static final String APPLY_STATE_MEDICINE_REFUND = "3";
	public static final String APPLY_STATE_PAY_REFUNDED = "4";
	public static final String FEE_TYPE_REGIST = "1";
	public static final String FEE_TYPE_CLINIC = "2";
	public static final String DRUG_FLAG_TWO = "2";
	private String patientId; // 暂存，用于接收从前端传入的查询条件
	private Patient patient;
	private String regId;
	private String feeType; // 就诊类别|SEE_TYPE
	private BigDecimal plusMinus; // 正负类型|1正-1负
	private String recipeId;
	private Integer recipeNo;
	private Department recipeDept;
	private HcpUser recipeDoc;
	private Date recipeTime;
	private String drugFlag;
	private String itemCode;
	private String itemName;
	private String specs;
	private BigDecimal qty;
	private Integer days; // 草药付数|默认为1
	private String unit;
	private BigDecimal salePrice;
	private BigDecimal totCost;
	private BigDecimal pubCost;
	private BigDecimal ownCost;
	private String rebateType; // 减免类型|REBATE_TYPE
	private BigDecimal rebateCost;
	private String feeCode; // 费用分类|FEE_CODE
	private String invoiceNo;
	private Department exeDept;
	private HcpUser exeOper;
	private Date confirmTime;
	private String drugDeptId; // 暂存，用于接收从前端传入的查询条件
	private Department drugDept;
	private String cancelFlag;
	private HcpUser cancelOper;
	private Date cancelTime;
	private String orderId; // 暂存，用于接收从前端传入的查询条件
	private MedicalOrder order;
	private String combNo;
	private String applyState;// 1已交费未发药2已发药3已退药4已退费
	private HcpUser chargeOper; // 收费员
	private Date chargeTime; // 收费时间

	// 暂存诊疗卡号、医保卡号及患者，从前端接收查询条件
	private String medicalCardNo;
	private String miCardNo;
	private String patientName;

	@Transient
	public String getPatientId() {
		return patientId;
	}

	public void setPatientId(String patientId) {
		this.patientId = patientId;
	}

	@ManyToOne
	@JoinColumn(name = "PATIENT_ID", nullable = true)
	@NotFound(action = NotFoundAction.IGNORE)
	public Patient getPatient() {
		return patient;
	}

	public void setPatient(Patient patient) {
		this.patient = patient;
	}

	public String getRegId() {
		return regId;
	}

	public void setRegId(String regId) {
		this.regId = regId;
	}

	public String getFeeType() {
		return feeType;
	}

	public void setFeeType(String feeType) {
		this.feeType = feeType;
	}

	public String getRecipeId() {
		return recipeId;
	}

	public void setRecipeId(String recipeId) {
		this.recipeId = recipeId;
	}

	public Integer getRecipeNo() {
		return recipeNo;
	}

	public void setRecipeNo(Integer recipeNo) {
		this.recipeNo = recipeNo;
	}

	@Column(name = "RECIPE_TIME")
	@JsonFormat(pattern = "yyyy-MM-dd", timezone = "GMT+8")
	public Date getRecipeTime() {
		return recipeTime;
	}

	public void setRecipeTime(Date recipeTime) {
		this.recipeTime = recipeTime;
	}

	public String getDrugFlag() {
		return drugFlag;
	}

	public void setDrugFlag(String drugFlag) {
		this.drugFlag = drugFlag;
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

	public String getSpecs() {
		return specs;
	}

	public void setSpecs(String specs) {
		this.specs = specs;
	}

	public String getUnit() {
		return unit;
	}

	public void setUnit(String unit) {
		this.unit = unit;
	}

	public String getRebateType() {
		return rebateType;
	}

	public void setRebateType(String rebateType) {
		this.rebateType = rebateType;
	}

	public String getFeeCode() {
		return feeCode;
	}

	public void setFeeCode(String feeCode) {
		this.feeCode = feeCode;
	}

	public String getInvoiceNo() {
		return invoiceNo;
	}

	public void setInvoiceNo(String invoiceNo) {
		this.invoiceNo = invoiceNo;
	}

	@Column(name = "CONFIRM_TIME")
	@JsonFormat(pattern = "yyyy-MM-dd", timezone = "GMT+8")
	public Date getConfirmTime() {
		return confirmTime;
	}

	public void setConfirmTime(Date confirmTime) {
		this.confirmTime = confirmTime;
	}

	public String getCancelFlag() {
		return cancelFlag;
	}

	public void setCancelFlag(String cancelFlag) {
		this.cancelFlag = cancelFlag;
	}

	@Column(name = "CANCEL_TIME")
	@JsonFormat(pattern = "yyyy-MM-dd", timezone = "GMT+8")
	public Date getCancelTime() {
		return cancelTime;
	}

	public void setCancelTime(Date cancelTime) {
		this.cancelTime = cancelTime;
	}

	@Transient
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public String getCombNo() {
		return combNo;
	}

	public void setCombNo(String combNo) {
		this.combNo = combNo;
	}

	public String getApplyState() {
		return applyState;
	}

	public void setApplyState(String applyState) {
		this.applyState = applyState;
	}

	@Transient
	public String getMedicalCardNo() {
		return medicalCardNo;
	}

	public void setMedicalCardNo(String medicalCardNo) {
		this.medicalCardNo = medicalCardNo;
	}

	@Transient
	public String getMiCardNo() {
		return miCardNo;
	}

	public void setMiCardNo(String miCardNo) {
		this.miCardNo = miCardNo;
	}

	@Transient
	public String getPatientName() {
		return patientName;
	}

	public void setPatientName(String patientName) {
		this.patientName = patientName;
	}

	public BigDecimal getPlusMinus() {
		return plusMinus;
	}

	public void setPlusMinus(BigDecimal plusMinus) {
		this.plusMinus = plusMinus;
	}

	public BigDecimal getQty() {
		return qty;
	}

	public void setQty(BigDecimal qty) {
		this.qty = qty;
	}

	public Integer getDays() {
		return days;
	}

	public void setDays(Integer days) {
		this.days = days;
	}

	public BigDecimal getSalePrice() {
		return salePrice;
	}

	public void setSalePrice(BigDecimal salePrice) {
		this.salePrice = salePrice;
	}

	public BigDecimal getTotCost() {
		return totCost;
	}

	public void setTotCost(BigDecimal totCost) {
		this.totCost = totCost;
	}

	public BigDecimal getPubCost() {
		return pubCost;
	}

	public void setPubCost(BigDecimal pubCost) {
		this.pubCost = pubCost;
	}

	public BigDecimal getOwnCost() {
		return ownCost;
	}

	public void setOwnCost(BigDecimal ownCost) {
		this.ownCost = ownCost;
	}

	public BigDecimal getRebateCost() {
		return rebateCost;
	}

	public void setRebateCost(BigDecimal rebateCost) {
		this.rebateCost = rebateCost;
	}

	@Column(name = "CHARGE_TIME")
	@JsonFormat(pattern = "yyyy-MM-dd", timezone = "GMT+8")
	public Date getChargeTime() {
		return chargeTime;
	}

	public void setChargeTime(Date chargeTime) {
		this.chargeTime = chargeTime;
	}

	@ManyToOne
	@JoinColumn(name = "RECIPE_DEPT", nullable = true)
	@NotFound(action = NotFoundAction.IGNORE)
	public Department getRecipeDept() {
		return recipeDept;
	}

	public void setRecipeDept(Department recipeDept) {
		this.recipeDept = recipeDept;
	}

	@ManyToOne
	@JoinColumn(name = "RECIPE_DOC", nullable = true)
	@NotFound(action = NotFoundAction.IGNORE)
	public HcpUser getRecipeDoc() {
		return recipeDoc;
	}

	public void setRecipeDoc(HcpUser recipeDoc) {
		this.recipeDoc = recipeDoc;
	}

	@ManyToOne
	@JoinColumn(name = "EXE_DEPT", nullable = true)
	@NotFound(action = NotFoundAction.IGNORE)
	public Department getExeDept() {
		return exeDept;
	}

	public void setExeDept(Department exeDept) {
		this.exeDept = exeDept;
	}

	@ManyToOne
	@JoinColumn(name = "EXE_OPER", nullable = true)
	@NotFound(action = NotFoundAction.IGNORE)
	public HcpUser getExeOper() {
		return exeOper;
	}

	public void setExeOper(HcpUser exeOper) {
		this.exeOper = exeOper;
	}

	@Transient
	public String getDrugDeptId() {
		return drugDeptId;
	}

	public void setDrugDeptId(String drugDeptId) {
		this.drugDeptId = drugDeptId;
	}

	@ManyToOne
	@JoinColumn(name = "DRUG_DEPT", nullable = true)
	@NotFound(action = NotFoundAction.IGNORE)
	public Department getDrugDept() {
		return drugDept;
	}

	public void setDrugDept(Department drugDept) {
		this.drugDept = drugDept;
	}

	@ManyToOne
	@JoinColumn(name = "CANCEL_OPER", nullable = true)
	@NotFound(action = NotFoundAction.IGNORE)
	public HcpUser getCancelOper() {
		return cancelOper;
	}

	public void setCancelOper(HcpUser cancelOper) {
		this.cancelOper = cancelOper;
	}

	@ManyToOne
	@JoinColumn(name = "CHARGE_OPER", nullable = true)
	@NotFound(action = NotFoundAction.IGNORE)
	public HcpUser getChargeOper() {
		return chargeOper;
	}

	public void setChargeOper(HcpUser chargeOper) {
		this.chargeOper = chargeOper;
	}

	@ManyToOne
	@JoinColumn(name = "ORDER_ID", nullable = true)
	@NotFound(action = NotFoundAction.IGNORE)
	public MedicalOrder getOrder() {
		return order;
	}

	public void setOrder(MedicalOrder order) {
		this.order = order;
	}

}
