package com.lenovohit.hcp.odws.model;

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

import com.lenovohit.hcp.appointment.model.RegInfo;
import com.lenovohit.hcp.base.annotation.RedisSequence;
import com.lenovohit.hcp.base.model.HcpBaseModel;
import com.lenovohit.hcp.card.model.Patient;
import com.lenovohit.hcp.pharmacy.model.PhaDrugInfo;

/**
 * 医嘱
 * 
 * @author victor
 *
 */
@Entity
@Table(name = "ow_order")
public class MedicalOrder extends HcpBaseModel {

	/**
	 * 医嘱状态 - 新开立
	 */
	public static final String ORDER_STATE_NEW = "1";
	/**
	 * 医嘱状态 - 已计费
	 */
	public static final String ORDER_STATE_CHARGED = "2";
	/**
	 * 医嘱状态 - 已执行
	 */
	public static final String ORDER_STATE_EXECUTED = "3";
	
	/**
	 * 医嘱状态 - 正在申请退药
	 */
	public static final String ORDER_STATE_PROCESSING = "4";
	/**
	 * 医嘱状态 - 已作废
	 */
	public static final String ORDER_STATE_END = "5";
	
	/**
	 * 申请单状态 - 抵充
	 */
	public static final String APPLY_STATE_TAKE_OUT = "6";
	
	/**
	 * 药品标识 - 西药/成药
	 */
	public static final String DRUG_FLAG_PATENT_MEDICINE = "1";
	/**
	 * 药品标识 - 草药
	 */
	public static final String DRUG_FLAG_HERBAL_MEDICINE = "2";
	/**
	 * 药品标识 - 非药
	 */
	public static final String DRUG_FLAG_NON_DRUG = "3";
	

	private Patient patientInfo; // 患者信息
	
	private String regId; // 挂号id
	private String orderState; // 医嘱状态|ORDER_STATE
	private Integer comboNo; // 组号
	private String orderId; // 医嘱id
	private String orderName;
	private String itemId;
	private String itemCode;
	private String itemName;
	private String specs; // 规格
	private BigDecimal doseOnce;
	private String doseUnit;
	private BigDecimal qty;
	private BigDecimal days; // 草药付数|默认为1
	private String unit;
	private String usage;
	private String freq; // 频次代码
	private String freqDesc; // 频次详情
	private String recipeId; // 处方id
	private Integer recipeNo; // 处方序号
	private String recipeDept; // 开放科室
	private String recipeDoc; // 开方医生
	private Date recipeTime; // 开方时间
	private String drugFlag;
	private String exeDept; // 执行科室
	private String exeOper; // 执行医生
	private String chargeFlag; // 收费标识
	private BigDecimal salePrice; // 单价
	private Date confirmTime; // 确认时间
	private String drugDept; // 发药科室
	private String applyNo;
	private String comm;
	private String feeCode; // 费用分类|FEE_CODE
	private String dispenseState;

	// 暂存诊疗卡号、身份证号、患者姓名，日期 从前端接收查询条件
	private String medicalCardNo;
	private String idNo;
	private Date[] dateRange;
	private String dataFrom;   //退药关联
	private BigDecimal packQty;  //输入数量
	private String packUnit;  //输入单位
	
	private PhaDrugInfo phaDrugInfo;
	
	
	
	public String getDataFrom() {
		return dataFrom;
	}

	public void setDataFrom(String dataFrom) {
		this.dataFrom = dataFrom;
	}

	@Transient
	public RegInfo getRegeinfo() {
		return regeinfo;
	}

	public void setRegeinfo(RegInfo regeinfo) {
		this.regeinfo = regeinfo;
	}

	private String patientName;
	private RegInfo regeinfo;
	
	@Transient
	public String getMedicalCardNo() {
		return medicalCardNo;
	}

	public void setMedicalCardNo(String medicalCardNo) {
		this.medicalCardNo = medicalCardNo;
	}
	@Transient
	public String getIdNo() {
		return idNo;
	}

	public void setIdNo(String idNo) {
		this.idNo = idNo;
	}
	@Transient
	public Date[] getDateRange() {
		return dateRange;
	}

	public void setDateRange(Date[] dateRange) {
		this.dateRange = dateRange;
	}
	@Transient
	public String getPatientName() {
		return patientName;
	}

	public void setPatientName(String patientName) {
		this.patientName = patientName;
	}

	public String getRegId() {
		return regId;
	}

	public void setRegId(String regId) {
		this.regId = regId;
	}

	public String getOrderState() {
		return orderState;
	}

	public void setOrderState(String orderState) {
		this.orderState = orderState;
	}

	public Integer getComboNo() {
		return comboNo;
	}

	public void setComboNo(Integer comboNo) {
		this.comboNo = comboNo;
	}

	@RedisSequence
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public String getOrderName() {
		return orderName;
	}

	public void setOrderName(String orderName) {
		this.orderName = orderName;
	}

	public String getItemId() {
		return itemId;
	}

	public void setItemId(String itemId) {
		this.itemId = itemId;
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

	public BigDecimal getDoseOnce() {
		return doseOnce;
	}

	public void setDoseOnce(BigDecimal doseOnce) {
		this.doseOnce = doseOnce;
	}

	public String getDoseUnit() {
		return doseUnit;
	}

	public void setDoseUnit(String doseUnit) {
		this.doseUnit = doseUnit;
	}

	public BigDecimal getQty() {
		return qty;
	}

	public void setQty(BigDecimal qty) {
		this.qty = qty;
	}

	public BigDecimal getDays() {
		return days;
	}

	public void setDays(BigDecimal days) {
		this.days = days;
	}

	public String getUnit() {
		return unit;
	}

	public void setUnit(String unit) {
		this.unit = unit;
	}

	@Column(name = "USAGE_")
	public String getUsage() {
		return usage;
	}

	public void setUsage(String usage) {
		this.usage = usage;
	}

	public String getFreq() {
		return freq;
	}

	public void setFreq(String freq) {
		this.freq = freq;
	}

	public String getFreqDesc() {
		return freqDesc;
	}

	public void setFreqDesc(String freqDesc) {
		this.freqDesc = freqDesc;
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

	public String getRecipeDept() {
		return recipeDept;
	}

	public void setRecipeDept(String recipeDept) {
		this.recipeDept = recipeDept;
	}

	public String getRecipeDoc() {
		return recipeDoc;
	}

	public void setRecipeDoc(String recipeDoc) {
		this.recipeDoc = recipeDoc;
	}

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

	public String getExeDept() {
		return exeDept;
	}

	public void setExeDept(String exeDept) {
		this.exeDept = exeDept;
	}

	public String getExeOper() {
		return exeOper;
	}

	public void setExeOper(String exeOper) {
		this.exeOper = exeOper;
	}

	public String getChargeFlag() {
		return chargeFlag;
	}

	public void setChargeFlag(String chargeFlag) {
		this.chargeFlag = chargeFlag;
	}

	public BigDecimal getSalePrice() {
		return salePrice;
	}

	public void setSalePrice(BigDecimal salePrice) {
		this.salePrice = salePrice;
	}

	public Date getConfirmTime() {
		return confirmTime;
	}

	public void setConfirmTime(Date confirmTime) {
		this.confirmTime = confirmTime;
	}

	public String getDrugDept() {
		return drugDept;
	}

	public void setDrugDept(String drugDept) {
		this.drugDept = drugDept;
	}

	public String getApplyNo() {
		return applyNo;
	}

	public void setApplyNo(String applyNo) {
		this.applyNo = applyNo;
	}

	public String getComm() {
		return comm;
	}

	public void setComm(String comm) {
		this.comm = comm;
	}

	public String getFeeCode() {
		return feeCode;
	}

	public void setFeeCode(String feeCode) {
		this.feeCode = feeCode;
	}

	public String getDispenseState() {
		return dispenseState;
	}

	public void setDispenseState(String dispenseState) {
		this.dispenseState = dispenseState;
	}

	@ManyToOne
	@JoinColumn(name = "PATIENT_ID", nullable = true)
	@NotFound(action = NotFoundAction.IGNORE)
	public Patient getPatientInfo() {
		return patientInfo;
	}

	public void setPatientInfo(Patient patientInfo) {
		this.patientInfo = patientInfo;
	}

	public BigDecimal getPackQty() {
		return packQty;
	}

	public void setPackQty(BigDecimal packQty) {
		this.packQty = packQty;
	}

	public String getPackUnit() {
		return packUnit;
	}

	public void setPackUnit(String packUnit) {
		this.packUnit = packUnit;
	}

	@Transient
	public PhaDrugInfo getPhaDrugInfo() {
		return phaDrugInfo;
	}

	public void setPhaDrugInfo(PhaDrugInfo phaDrugInfo) {
		this.phaDrugInfo = phaDrugInfo;
	}
	

}
