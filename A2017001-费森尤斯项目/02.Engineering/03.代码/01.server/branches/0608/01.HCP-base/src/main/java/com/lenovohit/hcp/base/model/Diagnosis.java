package com.lenovohit.hcp.base.model;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.Table;

import com.lenovohit.core.model.BaseIdModel;

@Entity
@Table(name = "b_diagnosis")
public class Diagnosis extends BaseIdModel {

	private static final long serialVersionUID = 1L;
	
	private String diagnosisCode; // 诊断代码
	private String diagnosisName; // 诊断名称
	private Integer serialNo;
	private String phoneticCode; // 拼音码
	private String wangCode; // 五笔码
	private String stopFlag; // 停用标志|0-停1启
	private Date createTime;// 创建时间
	private String createOper;// 创建人员
	private String createOperId;// 创建人员
	private Date updateTime;// 更新时间
	private String updateOper;// 更新人员
	private String updateOperId;// 创建人员

	public String getDiagnosisCode() {
		return diagnosisCode;
	}

	public void setDiagnosisCode(String diagnosisCode) {
		this.diagnosisCode = diagnosisCode;
	}

	public String getDiagnosisName() {
		return diagnosisName;
	}

	public void setDiagnosisName(String diagnosisName) {
		this.diagnosisName = diagnosisName;
	}

	public Integer getSerialNo() {
		return serialNo;
	}

	public void setSerialNo(Integer serialNo) {
		this.serialNo = serialNo;
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

	public String getStopFlag() {
		return stopFlag;
	}

	public void setStopFlag(String stopFlag) {
		this.stopFlag = stopFlag;
	}

	public Date getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}

	public String getCreateOper() {
		return createOper;
	}

	public void setCreateOper(String createOper) {
		this.createOper = createOper;
	}

	public String getCreateOperId() {
		return createOperId;
	}

	public void setCreateOperId(String createOperId) {
		this.createOperId = createOperId;
	}

	public Date getUpdateTime() {
		return updateTime;
	}

	public void setUpdateTime(Date updateTime) {
		this.updateTime = updateTime;
	}

	public String getUpdateOper() {
		return updateOper;
	}

	public void setUpdateOper(String updateOper) {
		this.updateOper = updateOper;
	}

	public String getUpdateOperId() {
		return updateOperId;
	}

	public void setUpdateOperId(String updateOperId) {
		this.updateOperId = updateOperId;
	}

}
