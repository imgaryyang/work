package com.lenovohit.ssm.app.elh.treat.model;


import javax.persistence.Entity;
import javax.persistence.Table;

import com.lenovohit.core.model.BaseIdModel;

/**
 * 医嘱表
 * @author Administrator
 *
 */
@Entity
@Table(name="ELH_ADVICE")
public class Advice extends BaseIdModel {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1976544580645432508L;
	
	
	
	private String patient;//就诊人
	private String doctor;//医生
	private String content;//医嘱内容
	private String createDepartment;//科室
	private String startTime;//开始时间
	private String total;//总量
	private String dosage;//单量
	private String rate;//频率
	private String useMethod;//用法
	private String exeDepartment;//执行科室
	private String createTime;//开嘱时间
	private String treatment;//所属就医记录
	public String getPatient() {
		return patient;
	}
	public void setPatient(String patient) {
		this.patient = patient;
	}
	public String getDoctor() {
		return doctor;
	}
	public void setDoctor(String doctor) {
		this.doctor = doctor;
	}
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}
	public String getCreateDepartment() {
		return createDepartment;
	}
	public void setCreateDepartment(String createDepartment) {
		this.createDepartment = createDepartment;
	}
	public String getStartTime() {
		return startTime;
	}
	public void setStartTime(String startTime) {
		this.startTime = startTime;
	}
	public String getTotal() {
		return total;
	}
	public void setTotal(String total) {
		this.total = total;
	}
	public String getDosage() {
		return dosage;
	}
	public void setDosage(String dosage) {
		this.dosage = dosage;
	}
	public String getRate() {
		return rate;
	}
	public void setRate(String rate) {
		this.rate = rate;
	}
	public String getUseMethod() {
		return useMethod;
	}
	public void setUseMethod(String useMethod) {
		this.useMethod = useMethod;
	}
	public String getExeDepartment() {
		return exeDepartment;
	}
	public void setExeDepartment(String exeDepartment) {
		this.exeDepartment = exeDepartment;
	}
	public String getCreateTime() {
		return createTime;
	}
	public void setCreateTime(String createTime) {
		this.createTime = createTime;
	}
	public String getTreatment() {
		return treatment;
	}
	public void setTreatment(String treatment) {
		this.treatment = treatment;
	}

}
