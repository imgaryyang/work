/***********************************************************************
 * Module:PerMng.java
 * Author:wod
 * Purpose: Defines the Class PerMng
 ***********************************************************************/
package com.infohold.els.model;

import java.math.BigDecimal;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import com.infohold.core.model.BaseIdModel;

@Entity
@Table(name = "ELS_PAY_BATCH")
public class PayBatch extends BaseIdModel {
	private static final long serialVersionUID = -3495590691669011573L;
	public static final String STATUS_CREATE = "0";
	public static final String STATUS_REVIEW = "1";
	public static final String STATUS_COMMIT = "2";
	public static final String STATUS_FINISH = "3";

	private String orgId;
	private String batchNo;
	private String month;
	private int num;
	private BigDecimal amount;
	private String state;
	private String submitTime;
	private String payTime;
	private int succNum;
	private BigDecimal succAmount;
	private String note;

	@Column(name = "AMOUNT")
	public BigDecimal getAmount() {
		return amount;
	}

	@Column(name = "BATCH_NO", length = 32)
	public String getBatchNo() {
		return batchNo;
	}

	@Column(name = "MONTH", length = 32)
	public String getMonth() {
		return month;
	}

	@Column(name = "NOTE", length = 200)
	public String getNote() {
		return note;
	}

	@Column(name = "NUM")
	public int getNum() {
		return num;
	}

	@Column(name = "ORG_ID", length = 32)
	public String getOrgId() {
		return orgId;
	}

	@Column(name = "PAY_TIME", length = 19)
	public String getPayTime() {
		return payTime;
	}

	@Column(name = "STATE", length = 1)
	public String getState() {
		return state;
	}

	@Column(name = "SUBMIT_TIME", length = 19)
	public String getSubmitTime() {
		return submitTime;
	}

	@Column(name = "SUCC_AMOUNT")
	public BigDecimal getSuccAmount() {
		return succAmount;
	}

	@Column(name = "SUCC_NUM")
	public int getSuccNum() {
		return succNum;
	}

	public void setAmount(BigDecimal amount) {
		this.amount = amount;
	}

	public void setBatchNo(String batchNo) {
		this.batchNo = batchNo;
	}

	public void setMonth(String month) {
		this.month = month;
	}

	public void setNote(String note) {
		this.note = note;
	}

	public void setNum(int num) {
		this.num = num;
	}

	public void setOrgId(String orgId) {
		this.orgId = orgId;
	}

	public void setPayTime(String payTime) {
		this.payTime = payTime;
	}

	public void setState(String state) {
		this.state = state;
	}

	public void setSubmitTime(String submitTime) {
		this.submitTime = submitTime;
	}

	public void setSuccAmount(BigDecimal succAmount) {
		this.succAmount = succAmount;
	}

	public void setSuccNum(int succNum) {
		this.succNum = succNum;
	}

	/**
	 * 判断状态是否存在状态序列中
	 * 
	 * @param statusCode
	 * @return
	 */
	public static boolean hasStatus(String statusCode) {
		return PayBatch.STATUS_CREATE.equals(statusCode)
				|| PayBatch.STATUS_REVIEW.equals(statusCode)
				|| PayBatch.STATUS_COMMIT.equals(statusCode)
				|| PayBatch.STATUS_FINISH.equals(statusCode);
	}
}