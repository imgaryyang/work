package com.lenovohit.hcp.finance.model;

import java.math.BigDecimal;

public class PayWayDto {
	private String payWay;
	private String payNum;
	private BigDecimal Amt;
	private BigDecimal refundAmt;

	public String getPayWay() {
		return payWay;
	}

	public void setPayWay(String payWay) {
		this.payWay = payWay;
	}

	public BigDecimal getAmt() {
		return Amt;
	}

	public void setAmt(BigDecimal amt) {
		Amt = amt;
	}

	public BigDecimal getRefundAmt() {
		return refundAmt;
	}

	public void setRefundAmt(BigDecimal refundAmt) {
		this.refundAmt = refundAmt;
	}

	public String getPayNum() {
		return payNum;
	}

	public void setPayNum(String payNum) {
		this.payNum = payNum;
	}
}
