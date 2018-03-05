package com.lenovohit.hcp.odws.model;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.lenovohit.hcp.base.annotation.RedisSequence;
import com.lenovohit.hcp.base.model.Department;
import com.lenovohit.hcp.base.model.HcpBaseModel;
import com.lenovohit.hcp.base.model.HcpUser;

/**
 * 问诊记录
 * 
 * @author victor
 *
 */
@Entity
@Table(name = "OW_INQUIRY_RECORD")
public class InquiryRecord extends HcpBaseModel {
	private String regId;
	private String recordId;
	private String chiefComplaint;
	private String presentIllness;
	private String pastHistory;
	private String allergicHistory;
	private String physicalExam;
	private String otherExam;
	private String moOrder;
	private String weight;
	private String height;
	private String bloodPress;
	private String bloodType;
	private String firstRecord;
	private String reviewRecord;
	private Date seeTime;
	private String isreview;
	private Department seeDept;
	private HcpUser seeDoc;
	private String stopFlag; // 停用标志|0-停1启
	private String medicalRecordsType; // 病历分型
	
	private String bloodPressureprMin; //血压下限
	private String bloodPressureprMax; //血压上限
	private String temperature;     //体温
	private String pulseRate;       //心率/脉搏
	private String breath;       //呼吸 

	public String getRegId() {
		return regId;
	}

	public void setRegId(String regId) {
		this.regId = regId;
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

	public String getBloodPress() {
		return bloodPress;
	}

	public void setBloodPress(String bloodPress) {
		this.bloodPress = bloodPress;
	}

	public Date getSeeTime() {
		return seeTime;
	}

	public void setSeeTime(Date seeTime) {
		this.seeTime = seeTime;
	}

	public String getIsreview() {
		return isreview;
	}

	public void setIsreview(String isreview) {
		this.isreview = isreview;
	}

	@ManyToOne
	@JoinColumn(name = "SEE_DEPT")
	public Department getSeeDept() {
		return seeDept;
	}

	public void setSeeDept(Department seeDept) {
		this.seeDept = seeDept;
	}

	@ManyToOne
	@JoinColumn(name = "SEE_DOC")
	public HcpUser getSeeDoc() {
		return seeDoc;
	}

	public void setSeeDoc(HcpUser seeDoc) {
		this.seeDoc = seeDoc;
	}

	public String getStopFlag() {
		return stopFlag;
	}

	public void setStopFlag(String stopFlag) {
		this.stopFlag = stopFlag;
	}

	@RedisSequence
	public String getRecordId() {
		return recordId;
	}

	public void setRecordId(String recordId) {
		this.recordId = recordId;
	}

	public String getBloodType() {
		return bloodType;
	}

	public void setBloodType(String bloodType) {
		this.bloodType = bloodType;
	}

	public String getFirstRecord() {
		return firstRecord;
	}

	public void setFirstRecord(String firstRecord) {
		this.firstRecord = firstRecord;
	}

	public String getReviewRecord() {
		return reviewRecord;
	}

	public void setReviewRecord(String reviewRecord) {
		this.reviewRecord = reviewRecord;
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

	
	
	

}
