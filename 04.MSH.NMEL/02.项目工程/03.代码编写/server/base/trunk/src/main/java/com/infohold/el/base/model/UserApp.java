package com.infohold.el.base.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.infohold.core.model.BaseIdModel;

@Entity
@Table(name = "EL_USER_APP")
public class UserApp extends BaseIdModel {

	private static final long serialVersionUID = -3860145281627961601L;
	
	private String appId;
	private String userId;
	private User user;
	private Apps apps;
	private String ios;
	private String android;
	private String version;

	@Column(name = "APP_ID")
	public String getAppId() {
		return appId;
	}

	public void setAppId(String appId) {
		this.appId = appId;
	}

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

	@Transient
	public Apps getApps() {
		return this.apps;
	}

	public void setApps(Apps apps) {
		this.apps = apps;
	}

	@Column(name = "IOS", length = 1)
	public String getIos() {
		return this.ios;
	}

	public void setIos(String ios) {
		this.ios = ios;
	}

	@Column(name = "ANDROID", length = 1)
	public String getAndroid() {
		return this.android;
	}

	public void setAndroid(String android) {
		this.android = android;
	}

	@Column(name = "VERSION", length = 10)
	public String getVersion() {
		return this.version;
	}

	public void setVersion(String version) {
		this.version = version;
	}

}