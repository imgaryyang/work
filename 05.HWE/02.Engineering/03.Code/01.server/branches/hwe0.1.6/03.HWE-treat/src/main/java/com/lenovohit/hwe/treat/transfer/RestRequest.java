package com.lenovohit.hwe.treat.transfer;

import com.alibaba.fastjson.annotation.JSONField;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.lenovohit.core.utils.JSONUtils;

public class RestRequest {

	@JSONField(name = "AS_TOKEN")
	private String token;
	@JSONField(name = "AS_CODE")
	private String code;
	@JSONField(name = "AS_DATA")
	private String data;
	@JsonIgnore
	private Object param;
	@JsonIgnore
	private String sendType;
	
	
	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getData() {
		if (data == null && param != null) {
			return JSONUtils.serialize(param);
		} else
			return "";
	}

	public void setData(String data) {
		this.data = data;
	}

	public Object getParam() {
		return param;
	}

	public void setParam(Object param) {
		this.param = param;
	}

	public String getSendType() {
		return sendType;
	}

	public void setSendType(String sendType) {
		this.sendType = sendType;
	}
	
}
