package com.lenovohit.hcp.finance.model;

import java.math.BigDecimal;

public class FeeTypeDto {
	private String feeType;
	private BigDecimal feeAmt;

	public String getFeeType() {
		return feeType;
	}

	public void setFeeType(String feeType) {
		this.feeType = feeType;
	}

	public BigDecimal getFeeAmt() {
		return feeAmt;
	}

	public void setFeeAmt(BigDecimal feeAmt) {
		this.feeAmt = feeAmt;
	}

}
