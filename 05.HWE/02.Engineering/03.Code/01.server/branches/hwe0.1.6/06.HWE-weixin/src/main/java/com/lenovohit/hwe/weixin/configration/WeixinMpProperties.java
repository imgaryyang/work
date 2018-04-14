package com.lenovohit.hwe.weixin.configration;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "weixin.mp")
public class WeixinMpProperties {
	private String appid;//wxc861b86da5958607
	private String secret;
	private String mpBaseUrl;
	public String getAppid() {
		return appid;
	}
	public void setAppid(String appid) {
		this.appid = appid;
	}
	public String getSecret() {
		return secret;
	}
	public void setSecret(String secret) {
		this.secret = secret;
	}
	public String getMpBaseUrl() {
		return mpBaseUrl;
	}
	public void setMpBaseUrl(String mpBaseUrl) {
		this.mpBaseUrl = mpBaseUrl;
	}
}
