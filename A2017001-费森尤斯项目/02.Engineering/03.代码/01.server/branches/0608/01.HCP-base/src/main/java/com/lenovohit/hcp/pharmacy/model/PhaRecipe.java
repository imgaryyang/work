package com.lenovohit.hcp.pharmacy.model;

import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.Table;

import com.lenovohit.hcp.base.annotation.RedisSequence;
import com.lenovohit.hcp.base.model.HcpBaseModel;

@Entity
@Table(name = "PHA_RECIPE") // 药房药库 - 药品调价
public class PhaRecipe extends HcpBaseModel {

	/**
	 * 申请单状态 - 已交费未发药
	 */
	public static final String APPLY_STATE_CHARGED = "1";
	/**
	 * 申请单状态 - 已发药
	 */
	public static final String APPLY_STATE_DISPENSED = "2";
	/**
	 * 申请单状态 - 已退药
	 */
	public static final String APPLY_STATE_RETURNED = "3";
	/**
	 * 申请单状态 - 已退费
	 */
	public static final String APPLY_STATE_REFUND = "4";

	private static final long serialVersionUID = 1L;
	private String applyNo; // 发药申请单
	private String plusMinus; // 正负类型|1正-1负
	private String applyType; // 申请类型|APPLY_TYPE
	private BigDecimal applyNum; // 申请数量
	private BigDecimal days; // 草药付数|默认为1
	private Date applyTime; // 申请时间
	private String applyDept; // 申请科室
	private String applyUnit; // 申请单位
	private BigDecimal minNum; // 最小单位数量
	private String minUnit; // 最小单位
	private String deptId; // 库房
	private String drugCode; // 药品编码
	private String tradeName; // 商品名称
	private String specs; // 药品规格
	private BigDecimal salePrice; // 零售价
	private String drugType; // 药品分类
	private String outBill; // 出库单号
	private Date sentTime; // 发药时间
	private String sentOper; // 发药人员
	private String giveOper; // 配药人员
	private String comm; // 备注
	private Integer comboNo; // 组号
	private String applyState; // 申请状态|APPLY_STATE
	private String orderId; // 医嘱ID
	private BigDecimal doseOnce; // 一次剂量
	private String doseUnit; // 剂量单位
	private String application; // 用法
	private String freq; // 频次
	private String freqDesc; // 频次详情
	private String recipeId; // 处方ID
	private Integer recipeNo;	//处方序号
	private String regId;		//挂号id

	@RedisSequence
	public String getApplyNo() {
		return applyNo;
	}

	public void setApplyNo(String applyNo) {
		this.applyNo = applyNo;
	}

	public String getPlusMinus() {
		return plusMinus;
	}

	public void setPlusMinus(String plusMinus) {
		this.plusMinus = plusMinus;
	}

	public String getApplyType() {
		return applyType;
	}

	public void setApplyType(String applyType) {
		this.applyType = applyType;
	}

	public BigDecimal getApplyNum() {
		return applyNum;
	}

	public void setApplyNum(BigDecimal applyNum) {
		this.applyNum = applyNum;
	}

	public BigDecimal getDays() {
		return days;
	}

	public void setDays(BigDecimal days) {
		this.days = days;
	}

	public Date getApplyTime() {
		return applyTime;
	}

	public void setApplyTime(Date applyTime) {
		this.applyTime = applyTime;
	}

	public String getApplyDept() {
		return applyDept;
	}

	public void setApplyDept(String applyDept) {
		this.applyDept = applyDept;
	}

	public String getApplyUnit() {
		return applyUnit;
	}

	public void setApplyUnit(String applyUnit) {
		this.applyUnit = applyUnit;
	}

	public BigDecimal getMinNum() {
		return minNum;
	}

	public void setMinNum(BigDecimal minNum) {
		this.minNum = minNum;
	}

	public String getMinUnit() {
		return minUnit;
	}

	public void setMinUnit(String minUnit) {
		this.minUnit = minUnit;
	}

	public String getDeptId() {
		return deptId;
	}

	public void setDeptId(String deptId) {
		this.deptId = deptId;
	}

	public String getDrugCode() {
		return drugCode;
	}

	public void setDrugCode(String drugCode) {
		this.drugCode = drugCode;
	}

	public String getTradeName() {
		return tradeName;
	}

	public void setTradeName(String tradeName) {
		this.tradeName = tradeName;
	}

	public String getSpecs() {
		return specs;
	}

	public void setSpecs(String specs) {
		this.specs = specs;
	}

	public BigDecimal getSalePrice() {
		return salePrice;
	}

	public void setSalePrice(BigDecimal salePrice) {
		this.salePrice = salePrice;
	}

	public String getDrugType() {
		return drugType;
	}

	public void setDrugType(String drugType) {
		this.drugType = drugType;
	}

	public String getOutBill() {
		return outBill;
	}

	public void setOutBill(String outBill) {
		this.outBill = outBill;
	}

	public Date getSentTime() {
		return sentTime;
	}

	public void setSentTime(Date sentTime) {
		this.sentTime = sentTime;
	}

	public String getSentOper() {
		return sentOper;
	}

	public void setSentOper(String sentOper) {
		this.sentOper = sentOper;
	}

	public String getGiveOper() {
		return giveOper;
	}

	public void setGiveOper(String giveOper) {
		this.giveOper = giveOper;
	}

	public String getComm() {
		return comm;
	}

	public void setComm(String comm) {
		this.comm = comm;
	}

	public Integer getComboNo() {
		return comboNo;
	}

	public void setComboNo(Integer comboNo) {
		this.comboNo = comboNo;
	}

	public String getApplyState() {
		return applyState;
	}

	public void setApplyState(String applyState) {
		this.applyState = applyState;
	}

	public String getOrderId() {
		return orderId;
	}

	@RedisSequence
	public void setOrderId(String orderId) {
		this.orderId = orderId;
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

	public String getFreq() {
		return freq;
	}

	public void setFreq(String freq) {
		this.freq = freq;
	}

	public String getRecipeId() {
		return recipeId;
	}

	public void setRecipeId(String recipeId) {
		this.recipeId = recipeId;
	}

	public String getApplication() {
		return application;
	}

	public void setApplication(String application) {
		this.application = application;
	}

	public Integer getRecipeNo() {
		return recipeNo;
	}

	public void setRecipeNo(Integer recipeNo) {
		this.recipeNo = recipeNo;
	}

	public String getRegId() {
		return regId;
	}

	public void setRegId(String regId) {
		this.regId = regId;
	}

	public String getFreqDesc() {
		return freqDesc;
	}

	public void setFreqDesc(String freqDesc) {
		this.freqDesc = freqDesc;
	}

}
