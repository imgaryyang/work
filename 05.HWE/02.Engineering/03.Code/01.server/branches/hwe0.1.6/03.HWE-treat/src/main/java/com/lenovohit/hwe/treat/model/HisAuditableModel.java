package com.lenovohit.hwe.treat.model;

import javax.persistence.MappedSuperclass;

import com.lenovohit.hwe.base.model.AuditableModel;

/**
 * His业务对象审计信息实现类
 * @author zyus
 * @version 1.0.0 2017-12-14
 */

@MappedSuperclass
public class HisAuditableModel extends AuditableModel{
	private static final long serialVersionUID = 2301433230425849037L;
	
	private String hisUser;
	private String appType;
	private String appCode;
	private String terminalUser;
	private String terminalCode;
	
	
	public String getHisUser() {
		return hisUser;
	}
	public void setHisUser(String hisUser) {
		this.hisUser = hisUser;
	}
	public String getAppType() {
		return appType;
	}
	public void setAppType(String appType) {
		this.appType = appType;
	}
	public String getAppCode() {
		return appCode;
	}
	public void setAppCode(String appCode) {
		this.appCode = appCode;
	}
	public String getTerminalUser() {
		return terminalUser;
	}
	public void setTerminalUser(String terminalUser) {
		this.terminalUser = terminalUser;
	}
	public String getTerminalCode() {
		return terminalCode;
	}
	public void setTerminalCode(String terminalCode) {
		this.terminalCode = terminalCode;
	}
	
}
