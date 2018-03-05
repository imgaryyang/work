package com.lenovohit.hcp.base.model;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

import com.lenovohit.core.model.BaseIdModel;

@Entity
@Table(name = "INTERFACE_CONFIG") // 接口配置模板
public class InterfaceConfig extends HcpBaseModel {
	private static final long serialVersionUID = 1L;
	private String comment;
	private String interfaceType;
	private Hospital hospital;
	


	private String bizName;

	private Boolean effectiveFlag;
	
	private String bizManager;
	
	
	@JoinColumn(name = "hospital_id")
	@ManyToOne
	@NotFound(action=NotFoundAction.IGNORE)
	public Hospital getHospital() {
		return hospital;
	}

	public void setHospital(Hospital hospital) {
		this.hospital = hospital;
	}
	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	

	public String getInterfaceType() {
		return interfaceType;
	}

	public void setInterfaceType(String interfaceType) {
		this.interfaceType = interfaceType;
	}

	public String getBizName() {
		return bizName;
	}

	public void setBizName(String bizName) {
		this.bizName = bizName == null ? null : bizName.trim();
	}


	public String getBizManager() {
		return bizManager;
	}

	public void setBizManager(String bizManager) {
		this.bizManager = bizManager;
	}

	public Boolean getEffectiveFlag() {
		return effectiveFlag;
	}

	public void setEffectiveFlag(Boolean effectiveFlag) {
		this.effectiveFlag = effectiveFlag;
	}


}