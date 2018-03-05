package com.infohold.elh.base.model;

import javax.persistence.Entity;
import javax.persistence.Table;

import com.infohold.core.model.BaseIdModel;

/**
 * 医生常规就诊时间安排
 * @author Administrator
 *
 */
@Entity
@Table(name="ELH_DOCTOR_DUTY")
public class DoctorDuty extends BaseIdModel {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1826210740042076986L;
	private String doctor;//医生
	private String name; //医生名字
	private String dayBy;//时间单位
	private int day;//日期
	private String noon;//上下午
	private int startHour;//开始时间（小时）
	private int endHour;//结束时间（小时）
	private String amount;//挂号费
	
	public String getDoctor() {
		return doctor;
	}
	public void setDoctor(String doctor) {
		this.doctor = doctor;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getDayBy() {
		return dayBy;
	}
	public void setDayBy(String dayBy) {
		this.dayBy = dayBy;
	}
	public int getDay() {
		return day;
	}
	public void setDay(int day) {
		this.day = day;
	}
	public String getNoon() {
		return noon;
	}
	public void setNoon(String noon) {
		this.noon = noon;
	}
	public int getStartHour() {
		return startHour;
	}
	public void setStartHour(int startHour) {
		this.startHour = startHour;
	}
	public int getEndHour() {
		return endHour;
	}
	public void setEndHour(int endHour) {
		this.endHour = endHour;
	}
	public String getAmount() {
		return amount;
	}
	public void setAmount(String amount) {
		this.amount = amount;
	}

}
