package com.lenovohit.hcp.finance.model;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.lenovohit.hcp.base.annotation.RedisSequence;
import com.lenovohit.hcp.base.model.HcpBaseModel;

@Entity
@Table(name = "OC_PAYWAY") // 门诊支付方式
public class PayWay extends HcpBaseModel {
	public static void main(String[] args) {
		BigDecimal bigDecimal = new BigDecimal("10");
		System.out.println(bigDecimal.add(null));
	}
	public static final String CANCELED = "1";
	public static final String UN_CANCELED = "0";
	public static final String PLUS = "1";
	public static final String MINUS = "-1";
	private static final long serialVersionUID = 1L;
	private String payId;
	private String regId;
	private String patientId;
	private String payNum;
	private Integer plusMinus; // 正负类型|1正-1负
	private String recipeId;
	private String invoiceNo;
	private String payWay;
	private BigDecimal payCost;
	private String cancelFlag;
	private String cancelOper;
	private Date cancelTime;

	@RedisSequence
	public String getPayId() {
		return payId;
	}

	public void setPayId(String payId) {
		this.payId = payId;
	}

	public String getPatientId() {
		return patientId;
	}

	public void setPatientId(String patientId) {
		this.patientId = patientId;
	}

	public String getPayNum() {
		return payNum;
	}

	public void setPayNum(String payNum) {
		this.payNum = payNum;
	}

	public Integer getPlusMinus() {
		return plusMinus;
	}

	public void setPlusMinus(Integer plusMinus) {
		this.plusMinus = plusMinus;
	}

	@RedisSequence
	public String getRecipeId() {
		return recipeId;
	}

	public void setRecipeId(String recipeId) {
		this.recipeId = recipeId;
	}

	public String getInvoiceNo() {
		return invoiceNo;
	}

	public void setInvoiceNo(String invoiceNo) {
		this.invoiceNo = invoiceNo;
	}

	public String getPayWay() {
		return payWay;
	}

	public void setPayWay(String payWay) {
		this.payWay = payWay;
	}

	public String getCancelFlag() {
		return cancelFlag;
	}

	public void setCancelFlag(String cancelFlag) {
		this.cancelFlag = cancelFlag;
	}

	public String getCancelOper() {
		return cancelOper;
	}

	public void setCancelOper(String cancelOper) {
		this.cancelOper = cancelOper;
	}

	@Column(name = "CANCEL_TIME")
	@JsonFormat(pattern = "yyyy-MM-dd", timezone = "GMT+8")
	public Date getCancelTime() {
		return cancelTime;
	}

	public void setCancelTime(Date cancelTime) {
		this.cancelTime = cancelTime;
	}

	public String getRegId() {
		return regId;
	}

	public void setRegId(String regId) {
		this.regId = regId;
	}

	public BigDecimal getPayCost() {
		return payCost;
	}

	public void setPayCost(BigDecimal payCost) {
		this.payCost = payCost;
	}

}
