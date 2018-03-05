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
 * 诊断
 * 
 * @author victor
 *
 */
@Entity
@Table(name = "OW_DIAGNOSE")
public class Diagnose extends HcpBaseModel {
	private String regId;
	private String diseaseNo;
	private String diseaseType; // 诊断类型|DISEASE_TYPE
	private String diseaseId;
	private String diseaseName;
	private Date diseaseTime;
	private Department diseaseDept;
	private HcpUser diseaseDoc;
	private String iscurrent;
	private String stopFlag; // 停用标志|0-停1启
	private Integer sortNo;

	public String getRegId() {
		return regId;
	}

	public void setRegId(String regId) {
		this.regId = regId;
	}

	@RedisSequence
	public String getDiseaseNo() {
		return diseaseNo;
	}

	public void setDiseaseNo(String diseaseNo) {
		this.diseaseNo = diseaseNo;
	}

	public String getDiseaseType() {
		return diseaseType;
	}

	public void setDiseaseType(String diseaseType) {
		this.diseaseType = diseaseType;
	}

	public String getDiseaseId() {
		return diseaseId;
	}

	public void setDiseaseId(String diseaseId) {
		this.diseaseId = diseaseId;
	}

	public String getDiseaseName() {
		return diseaseName;
	}

	public void setDiseaseName(String diseaseName) {
		this.diseaseName = diseaseName;
	}

	public Date getDiseaseTime() {
		return diseaseTime;
	}

	public void setDiseaseTime(Date diseaseTime) {
		this.diseaseTime = diseaseTime;
	}

	@ManyToOne
	@JoinColumn(name = "DISEASE_DEPT")
	public Department getDiseaseDept() {
		return diseaseDept;
	}

	public void setDiseaseDept(Department diseaseDept) {
		this.diseaseDept = diseaseDept;
	}

	@ManyToOne
	@JoinColumn(name = "DISEASE_DOC")
	public HcpUser getDiseaseDoc() {
		return diseaseDoc;
	}

	public void setDiseaseDoc(HcpUser diseaseDoc) {
		this.diseaseDoc = diseaseDoc;
	}

	public String getIscurrent() {
		return iscurrent;
	}

	public void setIscurrent(String iscurrent) {
		this.iscurrent = iscurrent;
	}

	public String getStopFlag() {
		return stopFlag;
	}

	public void setStopFlag(String stopFlag) {
		this.stopFlag = stopFlag;
	}

	public Integer getSortNo() {
		return sortNo;
	}

	public void setSortNo(Integer sortNo) {
		this.sortNo = sortNo;
	}

}
