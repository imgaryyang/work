package com.lenovohit.hwe.pay.support.alipay.app.model;

public class PrePayData {
	private String aliUrl;
	private String appId;
	private String appPrivateKey;
	private String charset;
	private String alipayPublicKey;
	private String encryptType;
	private String tradeOutTime;
	private String notifyUr;

	public PrePayData(String aliUrl, String appId, String appPrivateKey, String charset, String alipayPublicKey,
			String encryptType, String tradeOutTime, String notifyUr) {
		this.aliUrl = aliUrl;
		this.appId = appId;
		this.appPrivateKey = appPrivateKey;
		this.charset = charset;
		this.alipayPublicKey = alipayPublicKey;
		this.encryptType = encryptType;
		this.tradeOutTime = tradeOutTime;
		this.notifyUr = notifyUr;
	}

	public String getAliUrl() {
		return aliUrl;
	}

	public void setAliUrl(String aliUrl) {
		this.aliUrl = aliUrl;
	}

	public String getAppId() {
		return appId;
	}

	public void setAppId(String appId) {
		this.appId = appId;
	}

	public String getAppPrivateKey() {
		return appPrivateKey;
	}

	public void setAppPrivateKey(String appPrivateKey) {
		this.appPrivateKey = appPrivateKey;
	}

	public String getCharset() {
		return charset;
	}

	public void setCharset(String charset) {
		this.charset = charset;
	}

	public String getAlipayPublicKey() {
		return alipayPublicKey;
	}

	public void setAlipayPublicKey(String alipayPublicKey) {
		this.alipayPublicKey = alipayPublicKey;
	}

	public String getEncryptType() {
		return encryptType;
	}

	public void setEncryptType(String encryptType) {
		this.encryptType = encryptType;
	}

	public String getTradeOutTime() {
		return tradeOutTime;
	}

	public void setTradeOutTime(String tradeOutTime) {
		this.tradeOutTime = tradeOutTime;
	}

	public String getNotifyUr() {
		return notifyUr;
	}

	public void setNotifyUr(String notifyUr) {
		this.notifyUr = notifyUr;
	}

}
