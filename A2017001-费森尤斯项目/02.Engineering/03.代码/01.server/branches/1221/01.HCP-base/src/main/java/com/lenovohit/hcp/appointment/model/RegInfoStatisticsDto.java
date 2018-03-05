package com.lenovohit.hcp.appointment.model;

import java.math.BigDecimal;

public class RegInfoStatisticsDto {
	private String person;
	public int regCount;
	private BigDecimal regFee;
	private BigDecimal regClinicFee;
	private BigDecimal regAddFee;
	private BigDecimal regFeeSum;
	public int refundCount;
	private BigDecimal refundFee;
	private BigDecimal refundClinicFee;
	private BigDecimal refundAddFee;
	private BigDecimal refundFeeSum;
	public int totalCount;
	private BigDecimal totalFee;
	private BigDecimal totalClinicFee;
	private BigDecimal totalAddFee;
	private BigDecimal totalFeeSum;

	public String getPerson() {
		return person;
	}

	public void setPerson(String person) {
		this.person = person;
	}

	public Integer getRegCount() {
		return regCount;
	}

	public void setRegCount(Integer regCount) {
		this.regCount = regCount;
	}

	public BigDecimal getRegFee() {
		return regFee;
	}

	public void setRegFee(BigDecimal regFee) {
		this.regFee = regFee;
	}

	public BigDecimal getRegClinicFee() {
		return regClinicFee;
	}

	public void setRegClinicFee(BigDecimal regClinicFee) {
		this.regClinicFee = regClinicFee;
	}

	public BigDecimal getRegAddFee() {
		return regAddFee;
	}

	public void setRegAddFee(BigDecimal regAddFee) {
		this.regAddFee = regAddFee;
	}

	public BigDecimal getRegFeeSum() {
		return regFeeSum;
	}

	public void setRegFeeSum(BigDecimal regFeeSum) {
		this.regFeeSum = regFeeSum;
	}

	public Integer getRefundCount() {
		return refundCount;
	}

	public void setRefundCount(Integer refundCount) {
		this.refundCount = refundCount;
	}

	public BigDecimal getRefundFee() {
		return refundFee;
	}

	public void setRefundFee(BigDecimal refundFee) {
		this.refundFee = refundFee;
	}

	public BigDecimal getRefundClinicFee() {
		return refundClinicFee;
	}

	public void setRefundClinicFee(BigDecimal refundClinicFee) {
		this.refundClinicFee = refundClinicFee;
	}

	public BigDecimal getRefundAddFee() {
		return refundAddFee;
	}

	public void setRefundAddFee(BigDecimal refundAddFee) {
		this.refundAddFee = refundAddFee;
	}

	public BigDecimal getRefundFeeSum() {
		return refundFeeSum;
	}

	public void setRefundFeeSum(BigDecimal refundFeeSum) {
		this.refundFeeSum = refundFeeSum;
	}

	public Integer getTotalCount() {
		return totalCount;
	}

	public void setTotalCount(Integer totalCount) {
		this.totalCount = totalCount;
	}

	public BigDecimal getTotalFee() {
		return totalFee;
	}

	public void setTotalFee(BigDecimal totalFee) {
		this.totalFee = totalFee;
	}

	public BigDecimal getTotalClinicFee() {
		return totalClinicFee;
	}

	public void setTotalClinicFee(BigDecimal totalClinicFee) {
		this.totalClinicFee = totalClinicFee;
	}

	public BigDecimal getTotalAddFee() {
		return totalAddFee;
	}

	public void setTotalAddFee(BigDecimal totalAddFee) {
		this.totalAddFee = totalAddFee;
	}

	public BigDecimal getTotalFeeSum() {
		return totalFeeSum;
	}

	public void setTotalFeeSum(BigDecimal totalFeeSum) {
		this.totalFeeSum = totalFeeSum;
	}

}
