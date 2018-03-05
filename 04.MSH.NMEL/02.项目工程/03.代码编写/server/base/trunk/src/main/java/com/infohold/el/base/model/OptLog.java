package com.infohold.el.base.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import com.infohold.core.model.BaseIdModel;

@Entity
@Table(name = "EL_OPT_LOG")
public class OptLog extends BaseIdModel {
	private static final long serialVersionUID = -5668769350549318171L;

	private String optType;
	private String optName;
	private String optResult;
	private String optAt;
	private String optBy;
	private String memo;
	private String mac;
	private String ip;

	@Column(name = "OPT_TYPE", length = 2)
	public String getOptType() {
		return this.optType;
	}

	public void setOptType(String optType) {
		this.optType = optType;
	}

	@Column(name = "OPT_NAME", length = 30)
	public String getOptName() {
		return this.optName;
	}

	public void setOptName(String optName) {
		this.optName = optName;
	}

	@Column(name = "OPT_RESULT", length = 10)
	public String getOptResult() {
		return this.optResult;
	}

	public void setOptResult(String optResult) {
		this.optResult = optResult;
	}

	@Column(name = "OPT_AT", length = 19)
	public String getOptAt() {
		return this.optAt;
	}

	public void setOptAt(String optAt) {
		this.optAt = optAt;
	}

	@Column(name = "OPT_BY", length = 50)
	public String getOptBy() {
		return this.optBy;
	}

	public void setOptBy(String optBy) {
		this.optBy = optBy;
	}

	@Column(name = "MEMO", length = 200)
	public String getMemo() {
		return this.memo;
	}

	public void setMemo(String memo) {
		this.memo = memo;
	}

	@Column(name = "MAC", length = 20)
	public String getMac() {
		return this.mac;
	}

	public void setMac(String mac) {
		this.mac = mac;
	}

	@Column(name = "IP", length = 20)
	public String getIp() {
		return this.ip;
	}

	public void setIp(String ip) {
		this.ip = ip;
	}

}