package com.lenovohit.ssm.app.el.model;

// default package

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import com.lenovohit.core.model.BaseIdModel;

@Entity
@Table(name = "EL_VIRTUAL_ACCOUNT")
public class VirtualAccount extends BaseIdModel {
	private static final long serialVersionUID = -3457113128215647900L;
	
	private String fkId;
	private String acctType;
	private String acctNo;

	@Column(name = "FK_ID", length = 32)
	public String getFkId() {
		return this.fkId;
	}

	public void setFkId(String fkId) {
		this.fkId = fkId;
	}

	@Column(name = "ACCT_TYPE", length = 2)
	public String getAcctType() {
		return this.acctType;
	}

	public void setAcctType(String acctType) {
		this.acctType = acctType;
	}

	@Column(name = "ACCT_NO", length = 32)
	public String getAcctNo() {
		return this.acctNo;
	}

	public void setAcctNo(String acctNo) {
		this.acctNo = acctNo;
	}

}