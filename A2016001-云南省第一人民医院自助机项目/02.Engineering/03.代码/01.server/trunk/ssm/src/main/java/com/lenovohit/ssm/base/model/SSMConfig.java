package com.lenovohit.ssm.base.model;

import javax.persistence.Entity;
import javax.persistence.Table;

import com.lenovohit.core.model.BaseIdModel;
@Entity 
@Table(name = "SSM_CONFIG")//账户基本信息，用于登录;
public class SSMConfig extends BaseIdModel {
	private static final long serialVersionUID = 267752745251654331L;
	private String code;	//密码
	private String value;		//用户ID
	private String type;		//用户类型
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
}