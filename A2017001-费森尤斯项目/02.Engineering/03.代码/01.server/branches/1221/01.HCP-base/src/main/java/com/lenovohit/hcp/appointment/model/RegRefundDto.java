package com.lenovohit.hcp.appointment.model;

import java.math.BigDecimal;
import java.util.List;

import com.lenovohit.hcp.base.model.Department;
import com.lenovohit.hcp.finance.model.PayWay;

public class RegRefundDto {
	private String id;
	private Department regDept;
	private String regLevel;
	private BigDecimal totalAmt;
	private BigDecimal refundAmt;
	private List<PayWay> payWays;

	public Department getRegDept() {
		return regDept;
	}

	public void setRegDept(Department regDept) {
		this.regDept = regDept;
	}


	public BigDecimal getTotalAmt() {
		return totalAmt;
	}

	public void setTotalAmt(BigDecimal totalAmt) {
		this.totalAmt = totalAmt;
	}

	public BigDecimal getRefundAmt() {
		return refundAmt;
	}

	public void setRefundAmt(BigDecimal refundAmt) {
		this.refundAmt = refundAmt;
	}

	public List<PayWay> getPayWays() {
		return payWays;
	}

	public void setPayWays(List<PayWay> payWays) {
		this.payWays = payWays;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getRegLevel() {
		return regLevel;
	}

	public void setRegLevel(String regLevel) {
		this.regLevel = regLevel;
	}

}
