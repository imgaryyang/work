package com.lenovohit.ssm.app.el.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.lenovohit.core.model.BaseIdModel;

@Entity
@Table(name = "EL_APP_DOWNLOAD_CHANNEL")
public class AppDownloadChannel extends BaseIdModel {

	private static final long serialVersionUID = 2684654524099560333L;
	
	private String appId;
	private HomeMenu homeMenu;
	private String channel;		//渠道
	private Integer downloaded;	//下载数量

	@Column(name = "APP_ID")
	public String getAppId() {
		return appId;
	}

	public void setAppId(String appId) {
		this.appId = appId;
	}

	@Transient
	public HomeMenu getHomeMenu() {
		return this.homeMenu;
	}

	public void setHomeMenu(HomeMenu homeMenu) {
		this.homeMenu = homeMenu;
	}

	@Column(name = "CHANNEL", length = 20)
	public String getChannel() {
		return this.channel;
	}

	public void setChannel(String channel) {
		this.channel = channel;
	}

	@Column(name = "DOWNLOADED")
	public Integer getDownloaded() {
		return this.downloaded;
	}

	public void setDownloaded(Integer downloaded) {
		this.downloaded = downloaded;
	}

}