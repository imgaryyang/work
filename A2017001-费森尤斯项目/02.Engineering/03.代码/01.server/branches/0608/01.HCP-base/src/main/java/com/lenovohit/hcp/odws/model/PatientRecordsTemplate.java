package com.lenovohit.hcp.odws.model;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

import com.lenovohit.hcp.base.annotation.RedisSequence;
import com.lenovohit.hcp.base.model.Department;
import com.lenovohit.hcp.base.model.HcpBaseModel;

/**
 * 病历模板
 * 
 * @author victor CPR (Computer-based Patient Records) 电子病历(CPR)
 */
@Entity
@Table(name = "ow_inquiry_record_model")
public class PatientRecordsTemplate extends HcpBaseModel {
	private String modelId;
	private String modelName;
	private String modelType; // 模板分类
	private String chiefComplaint;
	private String presentIllness;
	private String pastHistory;
	private String allergicHistory;
	private String physicalExam;
	private String otherExam;
	private String moOrder;
	private String firstRecord;
	private String reviewRecord;
	private String shareLevel;
	private Department dept;
	private String stopFlag; // 停用标志|0-停1启
	private String phoneticCode; // 拼音码
	private String wangCode; // 五笔码

	@RedisSequence
	public String getModelId() {
		return modelId;
	}

	public void setModelId(String modelId) {
		this.modelId = modelId;
	}

	public String getModelName() {
		return modelName;
	}

	public void setModelName(String modelName) {
		this.modelName = modelName;
	}

	public String getModelType() {
		return modelType;
	}

	public void setModelType(String modelType) {
		this.modelType = modelType;
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

	public String getShareLevel() {
		return shareLevel;
	}

	public void setShareLevel(String shareLevel) {
		this.shareLevel = shareLevel;
	}

	@ManyToOne
	@JoinColumn(name = "DEPT_ID", nullable = true)
	@NotFound(action=NotFoundAction.IGNORE)
	public Department getDept() {
		return dept;
	}

	public void setDept(Department dept) {
		this.dept = dept;
	}

	public String getStopFlag() {
		return stopFlag;
	}

	public void setStopFlag(String stopFlag) {
		this.stopFlag = stopFlag;
	}

	public String getPhoneticCode() {
		return phoneticCode;
	}

	public void setPhoneticCode(String phoneticCode) {
		this.phoneticCode = phoneticCode;
	}

	public String getWangCode() {
		return wangCode;
	}

	public void setWangCode(String wangCode) {
		this.wangCode = wangCode;
	}

}
