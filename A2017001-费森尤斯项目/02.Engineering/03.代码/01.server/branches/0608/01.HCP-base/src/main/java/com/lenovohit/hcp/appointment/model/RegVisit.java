package com.lenovohit.hcp.appointment.model;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.Table;

import com.lenovohit.hcp.base.model.HcpBaseModel;

@Entity
@Table(name = "REG_VISIT") // 门诊挂号 - 挂号模版
public class RegVisit extends HcpBaseModel {
	private static final long serialVersionUID = 1L;

	private Date visitDate;

	private String week;

	private String deptId;

	private String deptName;

	private String docId;

	private String docName;

	private String noon;

	private Date startTime;

	private Date endTime;

	private Long regLmt;

	private Long orderLmt;

	private Long reged;

	private Long ordered;

	private Boolean allowAdd;

	private Long added;

	private String regLevel;

	private String levelName;

	private String areaId;

	private String areaName;

	private String stopReson;

	private Boolean stopFlag;

	public Date getVisitDate() {
		return visitDate;
	}

	public void setVisitDate(Date visitDate) {
		this.visitDate = visitDate;
	}

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

	public Date getStartTime() {
		return startTime;
	}

	public void setStartTime(Date startTime) {
		this.startTime = startTime;
	}

	public Date getEndTime() {
		return endTime;
	}

	public void setEndTime(Date endTime) {
		this.endTime = endTime;
	}

	public Long getRegLmt() {
		return regLmt;
	}

	public void setRegLmt(Long regLmt) {
		this.regLmt = regLmt;
	}

	public Long getOrderLmt() {
		return orderLmt;
	}

	public void setOrderLmt(Long orderLmt) {
		this.orderLmt = orderLmt;
	}

	public Long getReged() {
		return reged;
	}

	public void setReged(Long reged) {
		this.reged = reged;
	}

	public Long getOrdered() {
		return ordered;
	}

	public void setOrdered(Long ordered) {
		this.ordered = ordered;
	}

	public Long getAdded() {
		return added;
	}

	public void setAdded(Long added) {
		this.added = added;
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

	public String getStopReson() {
		return stopReson;
	}

	public void setStopReson(String stopReson) {
		this.stopReson = stopReson;
	}

	public Boolean getAllowAdd() {
		return allowAdd;
	}

	public void setAllowAdd(Boolean allowAdd) {
		this.allowAdd = allowAdd;
	}

	public Boolean getStopFlag() {
		return stopFlag;
	}

	public void setStopFlag(Boolean stopFlag) {
		this.stopFlag = stopFlag;
	}
}
