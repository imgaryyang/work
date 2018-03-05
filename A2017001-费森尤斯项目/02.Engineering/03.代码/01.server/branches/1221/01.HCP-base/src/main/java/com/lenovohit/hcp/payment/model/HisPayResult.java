package com.lenovohit.hcp.payment.model;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

/**
 * 
 * @description his平台返回model
 * @author jatesun
 * @version 1.0.0
 * @date 2017年4月12日
 */
public class HisPayResult {
	private String type;//类型，收费？退费？
	private boolean success;
	private String orderNo;
	private BigDecimal amt;
	private String operator;
	private Map<String, BigDecimal> resultMap = new HashMap<>();

	public String getOperator() {
		return operator;
	}

	public Map<String, BigDecimal> getResultMap() {
		return resultMap;
	}

	public void setSuccess(boolean success) {
		this.success = success;
	}

	public boolean isSuccess() {
		return success;
	}

	public BigDecimal getAmt() {
		return amt;
	}

	public void setAmt(BigDecimal amt) {
		this.amt = amt;
	}

	public void setOperator(String operator) {
		this.operator = operator;
	}

	public String getOrderNo() {
		return orderNo;
	}

	public void setOrderNo(String orderNo) {
		this.orderNo = orderNo;
	}

}
