package com.infohold.el.base.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.infohold.core.model.BaseIdModel;

@Entity
@Table(name = "EL_APP_USER_REL")
public class AppUser  extends BaseIdModel{
	private static final long serialVersionUID = 2109050090566663110L;
	
	public static String APPUSER_ISREG_YES = "1";
	public static String APPUSER_ISREG_NO = "2";
	public static String APPUSER_STATE_ON = "1";
	public static String APPUSER_STATE_OFF = "2";
	
	private String appId;
	private String userId;
	private String isReg;
	private String state;
	private String createdAt;
	private String expiryAt;
	private String logSystem;
	private String logVersion;
	private String logUser;
	private String logGroups;
	private User user;
	private Apps apps;

	@Column(name = "APP_ID", nullable = false, length = 32)
	public String getAppId() {
		return this.appId;
	}

	public void setAppId(String appId) {
		this.appId = appId;
	}

	@Column(name = "USER_ID", nullable = false, length = 32)
	public String getUserId() {
		return this.userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	@Column(name = "IS_REG", length = 1)
	public String getIsReg() {
		return this.isReg;
	}

	public void setIsReg(String isReg) {
		this.isReg = isReg;
	}

	@Column(name = "STATE", length = 1)
	public String getState() {
		return this.state;
	}

	public void setState(String state) {
		this.state = state;
	}

	@Column(name = "CREATED_AT", length = 19)
	public String getCreatedAt() {
		return this.createdAt;
	}

	public void setCreatedAt(String createdAt) {
		this.createdAt = createdAt;
	}

	@Column(name = "EXPIRY_AT", length = 19)
	public String getExpiryAt() {
		return this.expiryAt;
	}

	public void setExpiryAt(String expiryAt) {
		this.expiryAt = expiryAt;
	}

	@Column(name = "LOG_USER")
	public String getLogUser() {
		return logUser;
	}

	public void setLogUser(String logUser) {
		this.logUser = logUser;
	}
	
	@Column(name = "LOG_GROUPS")
	public String getLogGroups() {
		return logGroups;
	}

	public void setLogGroups(String logGroups) {
		this.logGroups = logGroups;
	}
	
	@Column(name = "LOG_SYSTEM")
	public String getLogSystem() {
		return logSystem;
	}

	public void setLogSystem(String logSystem) {
		this.logSystem = logSystem;
	}
	
	@Column(name = "LOG_VERSION")
	public String getLogVersion() {
		return logVersion;
	}

	public void setLogVersion(String logVersion) {
		this.logVersion = logVersion;
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

}