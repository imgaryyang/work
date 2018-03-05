package com.lenovohit.el.base.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.lenovohit.core.model.BaseIdModel;

@Entity
@Table(name = "EL_APP_FEEDBACK")
public class AppFeedBack extends BaseIdModel {

	private static final long serialVersionUID = 1397233870880781368L;
	
	private String userId;
	private String appId;
	private User user;
	private Apps apps;
	private String hospId;
	private String feedback;
	private String feededAt;

	@Column(name = "USER_ID")
	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	@Transient
	public User getUser() {
		return this.user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	@Column(name = "APP_ID")
	public String getAppId() {
		return appId;
	}

	public void setAppId(String appId) {
		this.appId = appId;
	}

	@Transient
	public Apps getApps() {
		return this.apps;
	}

	public void setApps(Apps apps) {
		this.apps = apps;
	}

	@Column(name = "HOSP_ID", length = 32)
	public String getHospId() {
		return this.hospId;
	}

	public void setHospId(String hospId) {
		this.hospId = hospId;
	}

	@Column(name = "FEEDBACK", length = 500)
	public String getFeedback() {
		return this.feedback;
	}

	public void setFeedback(String feedback) {
		this.feedback = feedback;
	}

	@Column(name = "FEEDED_AT", length = 19)
	public String getFeededAt() {
		return this.feededAt;
	}

	public void setFeededAt(String feededAt) {
		this.feededAt = feededAt;
	}

}