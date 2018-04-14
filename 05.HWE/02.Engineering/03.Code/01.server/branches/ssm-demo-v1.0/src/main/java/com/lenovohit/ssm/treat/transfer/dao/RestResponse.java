package com.lenovohit.ssm.treat.transfer.dao;

import com.alibaba.fastjson.annotation.JSONField;
import com.lenovohit.core.utils.StringUtils;

public class RestResponse {
	@JSONField(name="RESULTCODE")
	private String resultcode;
	@JSONField(name="RESULT")
	private String result;
	@JSONField(name="CONTENT")
	private String content;
	@JSONField(name="ACCESS_TOKEN")
	private String access_token;
	@JSONField(name="EXPIRES_IN")
	private int expires_in;
	
	public String getResultcode() {
		return resultcode;
	}
	public void setResultcode(String resultcode) {
		this.resultcode = resultcode;
	}
	public String getResult() {
		return result;
	}
	public void setResult(String result) {
		this.result = result;
	}
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}

	public String getAccess_token() {
		return access_token;
	}

	public void setAccess_token(String access_token) {
		this.access_token = access_token;
	}

	public int getExpires_in() {
		return expires_in;
	}

	public void setExpires_in(int expires_in) {
		this.expires_in = expires_in;
	}
    public boolean isSuccess(){
        return StringUtils.isNotBlank(resultcode) 
        		&& StringUtils.equals("1", resultcode);
    }
}
