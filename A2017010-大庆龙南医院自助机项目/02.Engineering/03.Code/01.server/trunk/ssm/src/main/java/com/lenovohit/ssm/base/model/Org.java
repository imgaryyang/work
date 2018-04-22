package com.lenovohit.ssm.base.model;

import javax.persistence.Entity;
import javax.persistence.Table;

import com.lenovohit.core.model.BaseIdModel;

@Entity
@Table(name = "SSM_ORG") // 人员基本信息';
public class Org extends BaseIdModel {
	/**
	 * 
	 */
	private static final long serialVersionUID = -4775664296632200668L;
	private String name;
	private String code;
	private String type;
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getCode() {
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
}
