package com.infohold.el.base.model;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.infohold.core.model.BaseIdModel;

@Entity
@Table(name = "EL_APP_AD_POS")
public class AppAdPos extends BaseIdModel {

	private static final long serialVersionUID = 2750569797508657792L;
	
	private String appId;
	private Apps apps;
	private String memo;
	private Set<AppAd> appAds = new HashSet<AppAd>(0);

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

	@Column(name = "MEMO", length = 100)
	public String getMemo() {
		return this.memo;
	}

	public void setMemo(String memo) {
		this.memo = memo;
	}

	@Transient
	public Set<AppAd> getAppAds() {
		return this.appAds;
	}

	public void setAppAds(Set<AppAd> appAds) {
		this.appAds = appAds;
	}

}