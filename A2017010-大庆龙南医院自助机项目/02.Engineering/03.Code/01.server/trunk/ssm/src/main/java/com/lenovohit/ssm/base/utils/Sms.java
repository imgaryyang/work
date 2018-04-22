package com.lenovohit.ssm.base.utils;

public class Sms {
	private String msg;
	private String mobiles;
	private boolean success = false;
	private String content;
	public String getMsg() {
		return msg;
	}
	public void setMsg(String msg) {
		this.msg = msg;
	}
	public String getMobiles() {
		return mobiles;
	}
	public void setMobiles(String mobiles) {
		this.mobiles = mobiles;
	}
	public boolean isSuccess() {
		return success;
	}
	public void setSuccess(boolean success) {
		this.success = success;
	}
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}
}
