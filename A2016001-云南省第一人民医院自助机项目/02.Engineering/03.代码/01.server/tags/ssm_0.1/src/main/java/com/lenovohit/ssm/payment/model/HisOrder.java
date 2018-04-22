package com.lenovohit.ssm.payment.model;

import java.math.BigDecimal;

/**
 * 非持久化类，用于传输数据
 * @author xiaweiyi
 *
 */
public class HisOrder {
	private BigDecimal amt;
	private String no;
	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}

	public BigDecimal getAmt() {
		return amt;
	}

	public void setAmt(BigDecimal amt) {
		this.amt = amt;
	}
}
