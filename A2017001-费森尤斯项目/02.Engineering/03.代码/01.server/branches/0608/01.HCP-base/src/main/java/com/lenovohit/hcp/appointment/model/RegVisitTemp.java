package com.lenovohit.hcp.appointment.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.lenovohit.hcp.base.model.HcpBaseModel;

@Entity
@Table(name = "REG_VISITMODEL") // 门急诊挂号 - 挂号模版
public class RegVisitTemp extends HcpBaseModel {

	/**
	 * @author xlbd
	 */
	private static final long serialVersionUID = 1L;

	private String week;
	private String deptId;
	private String deptName;
	private String docId;
	private String docName;
	private String noon;
	private Date startTime;
	private Date endTime;
	private Integer regLmt;
	private Integer orderLmt;
	private Boolean allowAdd;
	private String regLevel;
	private String levelName;
	private String areaId;
	private String areaName;
	private Boolean stopFlag;
	private String numSourceId;

	public String getWeek() {
		return week;
	}

	public void setWeek(String week) {
		this.week = week;
	}

	public String getDeptId() {
		return deptId;
	}

	public void setDeptId(String deptId) {
		this.deptId = deptId;
	}

	public String getDeptName() {
		return deptName;
	}

	public void setDeptName(String deptName) {
		this.deptName = deptName;
	}

	public String getDocId() {
		return docId;
	}

	public void setDocId(String docId) {
		this.docId = docId;
	}

	public String getDocName() {
		return docName;
	}

	public void setDocName(String docName) {
		this.docName = docName;
	}

	public String getNoon() {
		return noon;
	}

	public void setNoon(String noon) {
		this.noon = noon;
	}

	@Column(name = "START_TIME")
	@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
	public Date getStartTime() {
		return startTime;
	}

	public void setStartTime(Date startTime) {
		this.startTime = startTime;
	}

	@Column(name = "END_TIME")
	@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
	public Date getEndTime() {
		return endTime;
	}

	public void setEndTime(Date endTime) {
		this.endTime = endTime;
	}

	public Integer getRegLmt() {
		return regLmt;
	}

	public void setRegLmt(Integer regLmt) {
		this.regLmt = regLmt;
	}

	public Integer getOrderLmt() {
		return orderLmt;
	}

	public void setOrderLmt(Integer orderLmt) {
		this.orderLmt = orderLmt;
	}

	public Boolean getAllowAdd() {
		return allowAdd;
	}

	public void setAllowAdd(Boolean allowAdd) {
		this.allowAdd = allowAdd;
	}

	public String getRegLevel() {
		return regLevel;
	}

	public void setRegLevel(String regLevel) {
		this.regLevel = regLevel;
	}

	public String getLevelName() {
		return levelName;
	}

	public void setLevelName(String levelName) {
		this.levelName = levelName;
	}

	public String getAreaId() {
		return areaId;
	}

	public void setAreaId(String areaId) {
		this.areaId = areaId;
	}

	public String getAreaName() {
		return areaName;
	}

	public void setAreaName(String areaName) {
		this.areaName = areaName;
	}

	public Boolean getStopFlag() {
		return stopFlag;
	}

	public void setStopFlag(Boolean stopFlag) {
		this.stopFlag = stopFlag;
	}

	public String getNumSourceId() {
		return numSourceId;
	}

	public void setNumSourceId(String numSourceId) {
		this.numSourceId = numSourceId;
	}
}
