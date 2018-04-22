package com.lenovohit.ssm.app.el.model;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.lenovohit.core.model.BaseIdModel;

@Entity
@Table(name = "EL_HOME_MENU")
public class HomeMenu extends BaseIdModel {

	private static final long serialVersionUID = 8263458830257202726L;
	
	private String appId;	
	private Apps apps;	
	private String code;	//菜单编码
	private String text;	//菜单显示文字
	private String textSize;//文字显示大小
	private String textColor;//文字显示颜色
	private String icon;	//图标
	private String iconSize;//图标大小
	private String iconColor;//图标颜色
	private String image;	//图片
	private String imageResolution;//图片分辨率
	private String conponent;//跳转到的组件
	private String onClick;	//点击触发的事件
	private Set<AppDownloadChannel> appDownloadChannels = new HashSet<AppDownloadChannel>();

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

	@Column(name = "CODE", length = 20)
	public String getCode() {
		return this.code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	@Column(name = "TEXT", length = 20)
	public String getText() {
		return this.text;
	}

	public void setText(String text) {
		this.text = text;
	}

	@Column(name = "TEXT_SIZE", length = 3)
	public String getTextSize() {
		return this.textSize;
	}

	public void setTextSize(String textSize) {
		this.textSize = textSize;
	}

	@Column(name = "TEXT_COLOR", length = 40)
	public String getTextColor() {
		return this.textColor;
	}

	public void setTextColor(String textColor) {
		this.textColor = textColor;
	}

	@Column(name = "ICON", length = 50)
	public String getIcon() {
		return this.icon;
	}

	public void setIcon(String icon) {
		this.icon = icon;
	}

	@Column(name = "ICON_SIZE", length = 3)
	public String getIconSize() {
		return this.iconSize;
	}

	public void setIconSize(String iconSize) {
		this.iconSize = iconSize;
	}

	@Column(name = "ICON_COLOR", length = 40)
	public String getIconColor() {
		return this.iconColor;
	}

	public void setIconColor(String iconColor) {
		this.iconColor = iconColor;
	}

	@Column(name = "IMAGE", length = 200)
	public String getImage() {
		return this.image;
	}

	public void setImage(String image) {
		this.image = image;
	}

	@Column(name = "IMAGE_RESOLUTION", length = 50)
	public String getImageResolution() {
		return this.imageResolution;
	}

	public void setImageResolution(String imageResolution) {
		this.imageResolution = imageResolution;
	}

	@Column(name = "CONPONENT", length = 30)
	public String getConponent() {
		return this.conponent;
	}

	public void setConponent(String conponent) {
		this.conponent = conponent;
	}

	@Column(name = "ON_CLICK", length = 30)
	public String getOnClick() {
		return this.onClick;
	}

	public void setOnClick(String onClick) {
		this.onClick = onClick;
	}

	@Transient
	public Set<AppDownloadChannel> getAppDownloadChannels() {
		return this.appDownloadChannels;
	}

	public void setAppDownloadChannels(
			Set<AppDownloadChannel> appDownloadChannels) {
		this.appDownloadChannels = appDownloadChannels;
	}

}