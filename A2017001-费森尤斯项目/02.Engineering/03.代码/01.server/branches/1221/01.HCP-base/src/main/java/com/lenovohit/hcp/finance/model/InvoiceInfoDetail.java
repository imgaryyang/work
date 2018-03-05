package com.lenovohit.hcp.finance.model;

import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.lenovohit.core.model.BaseIdModel;
import com.lenovohit.hcp.base.annotation.RedisSequence;
import com.lenovohit.hcp.base.model.Department;

@Entity
@Table(name = "OC_INVOICEINFO_DETAIL") // 发票信息详情表
public class InvoiceInfoDetail extends BaseIdModel {
	private static final long serialVersionUID = 1L;
	private String regId;
	private String hosId;
	private Integer plusMinus; // 正负类型|1正-1负
	private String invoiceNo;
	private String recipeId;
	private String feeCode; // 费用分类|FEE_CODE
	private BigDecimal totCost;
	private Department recipeDept;
	private Department exeDept;
	private String cancelFlag; // 停用标志|0-停1启
	private String cancelOper;
	private Date cancelTime;

	@ManyToOne
	@JoinColumn(name = "RECIPE_DEPT")
	public Department getRecipeDept() {
		return recipeDept;
	}

	public void setRecipeDept(Department recipeDept) {
		this.recipeDept = recipeDept;
	}

	public String getRegId() {
		return regId;
	}

	public void setRegId(String regId) {
		this.regId = regId;
	}

	public void setPlusMinus(Integer plusMinus) {
		this.plusMinus = plusMinus;
	}

	public Integer getPlusMinus() {
		return plusMinus;
	}

	public String getInvoiceNo() {
		return invoiceNo;
	}

	public void setInvoiceNo(String invoiceNo) {
		this.invoiceNo = invoiceNo;
	}

	@RedisSequence
	public String getRecipeId() {
		return recipeId;
	}

	public void setRecipeId(String recipeId) {
		this.recipeId = recipeId;
	}

	public String getFeeCode() {
		return feeCode;
	}

	public void setFeeCode(String feeCode) {
		this.feeCode = feeCode;
	}

	public BigDecimal getTotCost() {
		return totCost;
	}

	public void setTotCost(BigDecimal totCost) {
		this.totCost = totCost;
	}

	public String getCancelFlag() {
		return cancelFlag;
	}

	public void setCancelFlag(String cancelFlag) {
		this.cancelFlag = cancelFlag;
	}

	public String getHosId() {
		return hosId;
	}

	public void setHosId(String hosId) {
		this.hosId = hosId;
	}

	public String getCancelOper() {
		return cancelOper;
	}

	public void setCancelOper(String cancelOper) {
		this.cancelOper = cancelOper;
	}

	public Date getCancelTime() {
		return cancelTime;
	}

	public void setCancelTime(Date cancelTime) {
		this.cancelTime = cancelTime;
	}

	@ManyToOne
	@JoinColumn(name = "EXE_DEPT")
	public Department getExeDept() {
		return exeDept;
	}

	public void setExeDept(Department exeDept) {
		this.exeDept = exeDept;
	}

}