/***********************************************************************
 * Module:  PerMng.java
 * Author:  wod
 * Purpose: Defines the Class PerMng
 ***********************************************************************/
package com.infohold.els.model;

import java.math.BigDecimal;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import com.infohold.core.model.BaseIdModel;

@Entity
@Table(name = "ELS_STUB_BATCH")
public class StubBatch extends BaseIdModel {
	private static final long serialVersionUID = -3040277135292447199L;
	public static final String STATUS_NOTYET = "0";
	public static final String STATUS_ALREADY = "1";

	private String templateId;
	private String orgId;
	private String template;
	private String batchNo;
	private String month;
	private int num;
	private BigDecimal amount;
	private String state;
	private String submitTime;
	private String note;

	@Column(name = "BATCH_NO", length = 20)
	public String getBatchNo() {
		return batchNo;
	}

	public void setBatchNo(String batchNo) {
		this.batchNo = batchNo;
	}

	@Column(name = "TEMPLATE_ID", length = 32)
	public String getTemplateId() {
		return templateId;
	}

	public void setTemplateId(String templateId) {
		this.templateId = templateId;
	}

	@Column(name = "ORG_ID", length = 32)
	public String getOrgId() {
		return orgId;
	}

	public void setOrgId(String orgId) {
		this.orgId = orgId;
	}

	@Column(name = "TEMPLATE", length = 48)
	public String getTemplate() {
		return template;
	}

	public void setTemplate(String template) {
		this.template = template;
	}

	@Column(name = "MONTH", length = 6)
	public String getMonth() {
		return month;
	}

	public void setMonth(String month) {
		this.month = month;
	}

	@Column(name = "NUM")
	public int getNum() {
		return num;
	}

	public void setNum(int num) {
		this.num = num;
	}

	@Column(name = "AMOUNT")
	public BigDecimal getAmount() {
		return amount;
	}

	public void setAmount(BigDecimal amount) {
		this.amount = amount;
	}

	@Column(name = "STATE", length = 1)
	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}

	@Column(name = "SUBMIT_TIME", length = 19)
	public String getSubmitTime() {
		return submitTime;
	}

	public void setSubmitTime(String submitTime) {
		this.submitTime = submitTime;
	}

	@Column(name = "NOTE", length = 200)
	public String getNote() {
		return note;
	}

	public void setNote(String note) {
		this.note = note;
	}


	/**
	 * 判断状态是否存在状态序列中
	 * 
	 * @param statusCode
	 * @return
	 */
	public static boolean hasStatus(String statusCode) {
		return StubBatch.STATUS_NOTYET.equals(statusCode) || StubBatch.STATUS_ALREADY.equals(statusCode);
	}

}