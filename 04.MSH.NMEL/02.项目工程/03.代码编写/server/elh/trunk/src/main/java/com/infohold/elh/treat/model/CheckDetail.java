package com.infohold.elh.treat.model;

import javax.persistence.Entity;
import javax.persistence.Table;

import com.infohold.core.model.BaseIdModel;

/**
 * 检查明细表
 * @author Administrator
 *
 */
@Entity
@Table(name="ELH_CHECK_DETAIL")
public class CheckDetail extends BaseIdModel {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = -1952827070730700679L;
	
	
	private String subjectCode;//项目代号
	private String subject;//项目名称
	private String result;//结果
	private String flag;//标志
	private String unit;//单位
	private String reference;//参考值
	private String checkOrder;//医技id
	public String getSubjectCode() {
		return subjectCode;
	}
	public void setSubjectCode(String subjectCode) {
		this.subjectCode = subjectCode;
	}
	public String getSubject() {
		return subject;
	}
	public void setSubject(String subject) {
		this.subject = subject;
	}
	public String getResult() {
		return result;
	}
	public void setResult(String result) {
		this.result = result;
	}
	public String getFlag() {
		return flag;
	}
	public void setFlag(String flag) {
		this.flag = flag;
	}
	public String getUnit() {
		return unit;
	}
	public void setUnit(String unit) {
		this.unit = unit;
	}
	public String getReference() {
		return reference;
	}
	public void setReference(String reference) {
		this.reference = reference;
	}
	public String getCheckOrder() {
		return checkOrder;
	}
	public void setCheckOrder(String checkOrder) {
		this.checkOrder = checkOrder;
	}

}
