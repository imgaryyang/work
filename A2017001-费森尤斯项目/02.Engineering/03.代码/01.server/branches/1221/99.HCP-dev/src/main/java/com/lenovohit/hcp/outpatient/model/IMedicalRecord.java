/*
 * Welcome to use the TableGo Tools.
 * 
 * http://vipbooks.iteye.com
 * http://blog.csdn.net/vipbooks
 * http://www.cnblogs.com/vipbooks
 * 
 * Author:bianj
 * Email:edinsker@163.com
 * Version:5.8.0
 */

package com.lenovohit.hcp.outpatient.model;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.Table;


/**
 * TREAT_MEDICAL_RECORD
 * 
 * @author zyus
 * @version 1.0.0 2017-12-16
 */
public class IMedicalRecord  implements java.io.Serializable {
	private String hosNo;
	private String hosName;
	private String proNo;
	private String proName;
	private String cardNo;
	private String cardType;
	private String actNo;
	private String appointNo;
	private String chiefComplaint;
	private String presentIllness;
	private String pastHistory;
	private String allergicHistory;
	private String physicalExam;
	private String otherExam;
	private String moOrder;
	private String weight;
	private String height;
	private Date seeTime;
	private String seeDept;
	private String seeDoc;
	private String medicalRecordsType;
	private String bloodPressureprMin;
	private String bloodPressureprMax;
	private String temperature;
	private String pulseRate;
	private String breath;
	private Date startDate;
	private Date endDate;
	public Date getStartDate() {
		return startDate;
	}
	public void setStartDate(Date startDate) {
		this.startDate = startDate;
	}
	public Date getEndDate() {
		return endDate;
	}
	public void setEndDate(Date endDate) {
		this.endDate = endDate;
	}
	public String getHosNo() {
		return hosNo;
	}
	public void setHosNo(String hosNo) {
		this.hosNo = hosNo;
	}
	public String getHosName() {
		return hosName;
	}
	public void setHosName(String hosName) {
		this.hosName = hosName;
	}
	public String getProNo() {
		return proNo;
	}
	public void setProNo(String proNo) {
		this.proNo = proNo;
	}
	public String getProName() {
		return proName;
	}
	public void setProName(String proName) {
		this.proName = proName;
	}
	public String getCardNo() {
		return cardNo;
	}
	public void setCardNo(String cardNo) {
		this.cardNo = cardNo;
	}
	public String getCardType() {
		return cardType;
	}
	public void setCardType(String cardType) {
		this.cardType = cardType;
	}
	public String getActNo() {
		return actNo;
	}
	public void setActNo(String actNo) {
		this.actNo = actNo;
	}
	public String getAppointNo() {
		return appointNo;
	}
	public void setAppointNo(String appointNo) {
		this.appointNo = appointNo;
	}
	public String getChiefComplaint() {
		return chiefComplaint;
	}
	public void setChiefComplaint(String chiefComplaint) {
		this.chiefComplaint = chiefComplaint;
	}
	public String getPresentIllness() {
		return presentIllness;
	}
	public void setPresentIllness(String presentIllness) {
		this.presentIllness = presentIllness;
	}
	public String getPastHistory() {
		return pastHistory;
	}
	public void setPastHistory(String pastHistory) {
		this.pastHistory = pastHistory;
	}
	public String getAllergicHistory() {
		return allergicHistory;
	}
	public void setAllergicHistory(String allergicHistory) {
		this.allergicHistory = allergicHistory;
	}
	public String getPhysicalExam() {
		return physicalExam;
	}
	public void setPhysicalExam(String physicalExam) {
		this.physicalExam = physicalExam;
	}
	public String getOtherExam() {
		return otherExam;
	}
	public void setOtherExam(String otherExam) {
		this.otherExam = otherExam;
	}
	public String getMoOrder() {
		return moOrder;
	}
	public void setMoOrder(String moOrder) {
		this.moOrder = moOrder;
	}
	public String getWeight() {
		return weight;
	}
	public void setWeight(String weight) {
		this.weight = weight;
	}
	public String getHeight() {
		return height;
	}
	public void setHeight(String height) {
		this.height = height;
	}
	public Date getSeeTime() {
		return seeTime;
	}
	public void setSeeTime(Date seeTime) {
		this.seeTime = seeTime;
	}
	public String getSeeDept() {
		return seeDept;
	}
	public void setSeeDept(String seeDept) {
		this.seeDept = seeDept;
	}
	public String getSeeDoc() {
		return seeDoc;
	}
	public void setSeeDoc(String seeDoc) {
		this.seeDoc = seeDoc;
	}
	public String getMedicalRecordsType() {
		return medicalRecordsType;
	}
	public void setMedicalRecordsType(String medicalRecordsType) {
		this.medicalRecordsType = medicalRecordsType;
	}
	public String getBloodPressureprMin() {
		return bloodPressureprMin;
	}
	public void setBloodPressureprMin(String bloodPressureprMin) {
		this.bloodPressureprMin = bloodPressureprMin;
	}
	public String getBloodPressureprMax() {
		return bloodPressureprMax;
	}
	public void setBloodPressureprMax(String bloodPressureprMax) {
		this.bloodPressureprMax = bloodPressureprMax;
	}
	public String getTemperature() {
		return temperature;
	}
	public void setTemperature(String temperature) {
		this.temperature = temperature;
	}
	public String getPulseRate() {
		return pulseRate;
	}
	public void setPulseRate(String pulseRate) {
		this.pulseRate = pulseRate;
	}
	public String getBreath() {
		return breath;
	}
	public void setBreath(String breath) {
		this.breath = breath;
	}

	
    /** 版本号 */
}