/***********************************************************************
 * Module:PerMng.java
 * Author:wod
 * Purpose: Defines the Class PerMng
 ***********************************************************************/
package com.lenovohit.els.model;

import java.math.BigDecimal;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import com.lenovohit.core.model.BaseIdModel;

@Entity
@Table(name = "ELS_PAY_PREVIEW")
public class PayPreview extends BaseIdModel {
	private static final long serialVersionUID = -3015113962087159650L;
	
	private String perId;
	private String batchId;
	private String batchNo;
	private String month;
	private String name;
	private String acctNo;
	private BigDecimal amount;

	@Column( name = "PER_ID", length = 32 )
	public String getPerId() {
		return perId;
	}

	public void setPerId(String perId) {
		this.perId = perId;
	}

	@Column( name = "BATCH_ID", length = 32 )
	public String getBatchId() {
		return batchId;
	}

	public void setBatchId(String batchId) {
		this.batchId = batchId;
	}

	@Column( name = "BATCH_NO", length = 20 )
	public String getBatchNo() {
		return batchNo;
	}

	public void setBatchNo(String batchNo) {
		this.batchNo = batchNo;
	}

	@Column( name = "MONTH", length = 6 )
	public String getMonth() {
		return month;
	}

	public void setMonth(String month) {
		this.month = month;
	}

	@Column( name = "NAME", length = 48 )
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column( name = "ACCT_NO", length = 32 )
	public String getAcctNo() {
		return acctNo;
	}

	public void setAcctNo(String acctNo) {
		this.acctNo = acctNo;
	}

	@Column( name = "AMOUNT")
	public BigDecimal getAmount() {
		return amount;
	}

	public void setAmount(BigDecimal amount) {
		this.amount = amount;
	}

}