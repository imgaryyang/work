package com.lenovohit.ssm.base.model;

import javax.persistence.Entity;
import javax.persistence.Table;

import com.lenovohit.core.model.BaseIdModel;

@Entity
@Table(name = "SSM_AREA") // 人员基本信息';
public class Area extends BaseIdModel {
	/**
	 * 
	 */
	private static final long serialVersionUID = 2785667409688656841L;
	private String orgId;
	private String code;
	private String name;
	private String location;
	public String getOrgId() {
		return orgId;
	}
	public void setOrgId(String orgId) {
		this.orgId = orgId;
	}
	public String getCode() {
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getLocation() {
		return location;
	}
	public void setLocation(String location) {
		this.location = location;
	}
	
}
