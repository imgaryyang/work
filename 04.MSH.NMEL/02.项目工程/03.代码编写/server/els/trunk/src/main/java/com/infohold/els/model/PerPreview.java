/***********************************************************************
 * Module:  PerMng.java
 * Author:  wod
 * Purpose: Defines the Class PerMng
 ***********************************************************************/
package com.infohold.els.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import com.infohold.core.model.BaseIdModel;

@Entity
@Table(name = "ELS_PER_PREVIEW")
public class PerPreview extends BaseIdModel {
	private static final long serialVersionUID = -3040277135292447199L;

	private String idNo;
	private String name;
	private String bankNo;
	private String bankName;
	private String acctNo;
	private String department;
	private String mobile;
	private String batchNo;

	@Column(name = "ID_NO", length = 18)
	public String getIdNo() {
		return idNo;
	}

	public void setIdNo(String idNo) {
		this.idNo = idNo;
	}

	@Column(name = "Name", length = 48)
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "BANK_NO", length = 10)
	public String getBankNo() {
		return bankNo;
	}

	public void setBankNo(String bankNo) {
		this.bankNo = bankNo;
	}

	@Column(name = "BANK_NAME", length = 48)
	public String getBankName() {
		return bankName;
	}

	public void setBankName(String bankName) {
		this.bankName = bankName;
	}

	@Column(name = "ACCT_NO", length = 32)
	public String getAcctNo() {
		return acctNo;
	}

	public void setAcctNo(String acctNo) {
		this.acctNo = acctNo;
	}

	@Column(name = "DEPARTMENT", length = 48)
	public String getDepartment() {
		return department;
	}

	public void setDepartment(String department) {
		this.department = department;
	}

	@Column(name = "MOBILE", length = 20)
	public String getMobile() {
		return mobile;
	}

	public void setMobile(String mobile) {
		this.mobile = mobile;
	}

	@Column(name = "BATCH_NO", length = 32)
	public String getBatchNo() {
		return batchNo;
	}

	public void setBatchNo(String batchNo) {
		this.batchNo = batchNo;
	}

}