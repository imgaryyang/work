package com.lenovohit.hcp.base.model;

import javax.persistence.Entity;
import javax.persistence.Table;

import com.lenovohit.core.model.BaseIdModel;

@Entity
@Table(name = "HCP_PRINT_TEMPLATE") // 打印模板管理
public class HcpPrintTemplate extends HcpBaseModel {
	private static final long serialVersionUID = 1L;

	private String bizCode;

	private String bizName;

	private Boolean effectiveFlag;

	private String version;

	private String printTemplate;
	
	private String printDataManager;

	public String getBizCode() {
		return bizCode;
	}

	public void setBizCode(String bizCode) {
		this.bizCode = bizCode == null ? null : bizCode.trim();
	}

	public String getBizName() {
		return bizName;
	}

	public void setBizName(String bizName) {
		this.bizName = bizName == null ? null : bizName.trim();
	}

	public String getVersion() {
		return version;
	}

	public void setVersion(String version) {
		this.version = version == null ? null : version.trim();
	}

	public String getPrintTemplate() {
		return printTemplate;
	}

	public void setPrintTemplate(String printTemplate) {
		this.printTemplate = printTemplate == null ? null : printTemplate.trim();
	}

	public Boolean getEffectiveFlag() {
		return effectiveFlag;
	}

	public void setEffectiveFlag(Boolean effectiveFlag) {
		this.effectiveFlag = effectiveFlag;
	}

	public String getPrintDataManager() {
		return printDataManager;
	}

	public void setPrintDataManager(String printDataManager) {
		this.printDataManager = printDataManager;
	}
}