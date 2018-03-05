package com.lenovohit.hcp.base.model;

import java.math.BigDecimal;

/**
 * 收费套餐明细
 */
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import com.lenovohit.core.model.BaseIdModel;

@Entity
@Table(name = "ITEM_GROUP_DETAIL")
public class ChargeDetail extends BaseIdModel {

	private static final long serialVersionUID = 1L;

	private String hosId;
	private String comboId;// 套餐ID,
	private Integer comboNo;// 组合号,
	private Integer comboSort;// 组内序号,
	private String itemId;// 项目id
	private String itemCode;// 项目编码
	private String itemName;// 项目名称
	private String specs;
	private String feeCode;
	private String usage;// 用法,
	private String freq;// 频次
	private String freqDesc;
	private String defaultDept;// 默认科室,
	private BigDecimal defaultNum;// 默认数量,
	private String unit;// 单位,
	private BigDecimal days;// 付数
	private BigDecimal dosage;// 一次剂量
	private String dosageUnit;// 剂量单位
	private String comm;// 备注
	private String drugFlag; // 药品标志

	private boolean stop;// 停用标志|1停0-启,

	public String getHosId() {
		return hosId;
	}

	public void setHosId(String hosId) {
		this.hosId = hosId;
	}

	public String getComboId() {
		return comboId;
	}

	public void setComboId(String comboId) {
		this.comboId = comboId;
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

	public String getItemCode() {
		return itemCode;
	}

	public void setItemCode(String itemCode) {
		this.itemCode = itemCode;
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

	public String getDefaultDept() {
		return defaultDept;
	}

	public void setDefaultDept(String defaultDept) {
		this.defaultDept = defaultDept;
	}

	public String getUnit() {
		return unit;
	}

	public void setUnit(String unit) {
		this.unit = unit;
	}

	public String getDosageUnit() {
		return dosageUnit;
	}

	public void setDosageUnit(String dosageUnit) {
		this.dosageUnit = dosageUnit;
	}

	public String getComm() {
		return comm;
	}

	public void setComm(String comm) {
		this.comm = comm;
	}

	@Column(name = "STOP_FLAG")
	public boolean isStop() {
		return stop;
	}

	public void setStop(boolean stop) {
		this.stop = stop;
	}

	public String getDrugFlag() {
		return drugFlag;
	}

	public void setDrugFlag(String drugFlag) {
		this.drugFlag = drugFlag;
	}

	public Integer getComboNo() {
		return comboNo;
	}

	public void setComboNo(Integer comboNo) {
		this.comboNo = comboNo;
	}

	public Integer getComboSort() {
		return comboSort;
	}

	public void setComboSort(Integer comboSort) {
		this.comboSort = comboSort;
	}

	public BigDecimal getDefaultNum() {
		return defaultNum;
	}

	public void setDefaultNum(BigDecimal defaultNum) {
		this.defaultNum = defaultNum;
	}

	public BigDecimal getDays() {
		return days;
	}

	public void setDays(BigDecimal days) {
		this.days = days;
	}

	public BigDecimal getDosage() {
		return dosage;
	}

	public void setDosage(BigDecimal dosage) {
		this.dosage = dosage;
	}

	public String getSpecs() {
		return specs;
	}

	public void setSpecs(String specs) {
		this.specs = specs;
	}

	public String getFeeCode() {
		return feeCode;
	}

	public void setFeeCode(String feeCode) {
		this.feeCode = feeCode;
	}

	public String getFreqDesc() {
		return freqDesc;
	}

	public void setFreqDesc(String freqDesc) {
		this.freqDesc = freqDesc;
	}

}
