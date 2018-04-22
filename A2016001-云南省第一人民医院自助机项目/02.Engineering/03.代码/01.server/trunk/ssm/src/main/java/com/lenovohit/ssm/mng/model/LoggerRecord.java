package com.lenovohit.ssm.mng.model;



public class LoggerRecord {
	
	private String uuid;
	private String message;
	private String createDay;
	private String url;
	private String methodCode;
	private String param;
	private String response;
	public String getUuid() {
		return uuid;
	}
	public void setUuid(String uuid) {
		this.uuid = uuid;
	}
	
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	public String getCreateDay() {
		return createDay;
	}
	public void setCreateDay(String createDay) {
		this.createDay = createDay;
	}
	public String getUrl() {
		return url;
	}
	public void setUrl(String url) {
		this.url = url;
	}
	public String getMethodCode() {
		return methodCode;
	}
	public void setMethodCode(String methodCode) {
		this.methodCode = methodCode;
	}
	public String getParam() {
		return param;
	}
	public void setParam(String param) {
		this.param = param;
	}
	public String getResponse() {
		return response;
	}
	public void setResponse(String response) {
		this.response = response;
	}
}
