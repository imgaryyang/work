package com.lenovohit.hcp.payment.model;

import javax.persistence.Entity;
import javax.persistence.Table;

import com.lenovohit.core.model.BaseIdModel;

@Entity
@Table(name = "HCP_PAY_TYPE")
public class HcpPayType extends BaseIdModel {
	private static final long serialVersionUID = 1L;

	private String payChaneelId;

	private String name;

	private String code;

	private String description;

	public String getPayChaneelId() {
		return payChaneelId;
	}

	public void setPayChaneelId(String payChaneelId) {
		this.payChaneelId = payChaneelId == null ? null : payChaneelId.trim();
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name == null ? null : name.trim();
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code == null ? null : code.trim();
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description == null ? null : description.trim();
	}
}