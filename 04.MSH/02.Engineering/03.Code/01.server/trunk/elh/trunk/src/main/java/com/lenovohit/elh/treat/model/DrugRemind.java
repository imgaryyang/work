package com.lenovohit.elh.treat.model;

import javax.persistence.Entity;
import javax.persistence.Table;

import com.lenovohit.core.model.BaseIdModel;

/**
 * 医嘱表
 * @author Administrator
 *
 */
@Entity
@Table(name="ELH_DRUG_REMIND")
public class DrugRemind extends BaseIdModel {
	private static final long serialVersionUID = -4209316405105869971L;
	
	private String userId ;
	private String beginDate;
	private String endDate;
	private String alarmTime;
	private String alarmId;
	private String drugOrderId;
	private String type;
	private String state;
	private String medUsage;
	
	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getBeginDate() {
		return beginDate;
	}

	public void setBeginDate(String beginDate) {
		this.beginDate = beginDate;
	}

	public String getEndDate() {
		return endDate;
	}

	public void setEndDate(String endDate) {
		this.endDate = endDate;
	}

	public String getAlarmTime() {
		return alarmTime;
	}

	public void setAlarmTime(String alarmTime) {
		this.alarmTime = alarmTime;
	}

	public String getAlarmId() {
		return alarmId;
	}

	public void setAlarmId(String alarmId) {
		this.alarmId = alarmId;
	}

	public String getDrugOrderId() {
		return drugOrderId;
	}

	public void setDrugOrderId(String drugOrderId) {
		this.drugOrderId = drugOrderId;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}

	public String getMedUsage() {
		return medUsage;
	}

	public void setMedUsage(String medUsage) {
		this.medUsage = medUsage;
	}

	
	
	public static long getSerialversionuid() {
		return serialVersionUID;
	}
	
}
