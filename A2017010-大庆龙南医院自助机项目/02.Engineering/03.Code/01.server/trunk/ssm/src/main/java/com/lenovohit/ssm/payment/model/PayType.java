package com.lenovohit.ssm.payment.model;

import javax.persistence.Entity;
import javax.persistence.Table;

import com.lenovohit.core.model.BaseIdModel;


@Entity
@Table(name="SSM_PAY_TYPE")
public class PayType extends BaseIdModel{
	private static final long serialVersionUID = -6376593015883279618L;
	private String name;
	private String code;
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
}
