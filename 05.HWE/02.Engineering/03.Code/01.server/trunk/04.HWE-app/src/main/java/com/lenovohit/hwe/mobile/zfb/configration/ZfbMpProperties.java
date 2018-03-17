package com.lenovohit.hwe.mobile.zfb.configration;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "zfb.mp")
public class ZfbMpProperties {
	private String appid;
	private String open_api_domain;
	private String private_key;
	private String public_key;
	private String alipay_public_key;
	private String sign_type;
	private String mpBaseUrl;
	
	public String getAppid() {
		return appid;
	}
	public void setAppid(String appid) {
		this.appid = appid;
	}
	
	public String getOpen_api_domain() {
		return open_api_domain;
	}
	public void setOpen_api_domain(String open_api_domain) {
		this.open_api_domain = open_api_domain;
	}
	public String getPrivate_key() {
		return private_key;
	}
	public void setPrivate_key(String private_key) {
		this.private_key = private_key;
	}
	public String getPublic_key() {
		return public_key;
	}
	public void setPublic_key(String public_key) {
		this.public_key = public_key;
	}
	public String getAlipay_public_key() {
		return alipay_public_key;
	}
	public void setAlipay_public_key(String alipay_public_key) {
		this.alipay_public_key = alipay_public_key;
	}
	public String getSign_type() {
		return sign_type;
	}
	public void setSign_type(String sign_type) {
		this.sign_type = sign_type;
	}
	public String getMpBaseUrl() {
		return mpBaseUrl;
	}
	public void setMpBaseUrl(String mpBaseUrl) {
		this.mpBaseUrl = mpBaseUrl;
	}
}
