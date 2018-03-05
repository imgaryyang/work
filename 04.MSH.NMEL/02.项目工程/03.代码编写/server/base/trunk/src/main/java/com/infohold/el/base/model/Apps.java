package com.infohold.el.base.model;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.infohold.core.model.BaseIdModel;

@Entity
@Table(name = "EL_APPS")
public class Apps extends BaseIdModel {
	private static final long serialVersionUID = -5164045043210920135L;
	
	private String type;
	private String bizId;
	private String name;
	private String state;
	private String onlineAt;
	private String offlineAt;
	private Set<HomeMenu> homeMenus = new HashSet<HomeMenu>(0);
	private Set<UserApp> userApps = new HashSet<UserApp>(0);
	private Set<AppFeedBack> appFeedBacks = new HashSet<AppFeedBack>(0);
	private Set<AppUser> appUsers = new HashSet<AppUser>(0);
	private Set<AppAdPos> appAdPoses = new HashSet<AppAdPos>(0);

	@Column(name = "TYPE", nullable = false, length = 1)
	public String getType() {
		return this.type;
	}

	public void setType(String type) {
		this.type = type;
	}

	@Column(name = "BIZ_ID", length = 50)
	public String getBizId() {
		return bizId;
	}

	public void setBizId(String bizId) {
		this.bizId = bizId;
	}

	@Column(name = "NAME", nullable = false, length = 50)
	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "STATE", length = 1)
	public String getState() {
		return this.state;
	}

	public void setState(String state) {
		this.state = state;
	}

	@Column(name = "ONLINE_AT", length = 19)
	public String getOnlineAt() {
		return this.onlineAt;
	}

	public void setOnlineAt(String onlineAt) {
		this.onlineAt = onlineAt;
	}

	@Column(name = "OFFLINE_AT", length = 19)
	public String getOfflineAt() {
		return this.offlineAt;
	}

	public void setOfflineAt(String offlineAt) {
		this.offlineAt = offlineAt;
	}

	@Transient
	public Set<HomeMenu> getHomeMenus() {
		return this.homeMenus;
	}

	public void setHomeMenus(Set<HomeMenu> homeMenus) {
		this.homeMenus = homeMenus;
	}

	@Transient
	public Set<UserApp> getUserApps() {
		return this.userApps;
	}

	public void setUserApps(Set<UserApp> userApps) {
		this.userApps = userApps;
	}

	@Transient
	public Set<AppFeedBack> getAppFeedBacks() {
		return this.appFeedBacks;
	}

	public void setAppFeedBacks(Set<AppFeedBack> appFeedBacks) {
		this.appFeedBacks = appFeedBacks;
	}

	@Transient
	public Set<AppUser> getAppUsers() {
		return this.appUsers;
	}

	public void setAppUsers(Set<AppUser> appUsers) {
		this.appUsers = appUsers;
	}

	@Transient
	public Set<AppAdPos> getAppAdPoses() {
		return this.appAdPoses;
	}

	public void setAppAdPoses(Set<AppAdPos> appAdPoses) {
		this.appAdPoses = appAdPoses;
	}

}