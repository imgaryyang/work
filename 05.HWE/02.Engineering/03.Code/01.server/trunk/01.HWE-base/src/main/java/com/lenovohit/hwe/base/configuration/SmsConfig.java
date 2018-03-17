package com.lenovohit.hwe.base.configuration;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "sms")
public class SmsConfig {
	//用户名
	private String Uid;

	//接口安全秘钥
	private String Key;

	//手机号码，多个号码如13800000000,13800000001,13800000002
	private String smsMob;

	//短信内容
	private String smsText;

	public String getUid() {
		return Uid;
	}

	public void setUid(String uid) {
		Uid = uid;
	}

	public String getKey() {
		return Key;
	}

	public void setKey(String key) {
		Key = key;
	}

	public String getSmsMob() {
		return smsMob;
	}

	public void setSmsMob(String smsMob) {
		this.smsMob = smsMob;
	}

	public String getSmsText() {
		return smsText;
	}

	public void setSmsText(String smsText) {
		this.smsText = smsText;
	}
}
