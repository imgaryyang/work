package com.lenovohit.hwe.base.model;

import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "BASE_CONFIG")
public class Config  extends AuditableModel  {
	private static final long serialVersionUID = -4408551405034621735L;
	private String code;
	private String value;
	private String type;
	private String system;
	public String getCode() {
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}
	public String getValue() {
		return value;
	}
	public void setValue(String value) {
		this.value = value;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getSystem() {
		return system;
	}
	public void setSystem(String system) {
		this.system = system;
	}
}
