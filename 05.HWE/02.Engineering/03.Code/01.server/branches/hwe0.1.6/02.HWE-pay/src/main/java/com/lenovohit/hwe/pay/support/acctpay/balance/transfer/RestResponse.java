package com.lenovohit.hwe.pay.support.acctpay.balance.transfer;

import com.alibaba.fastjson.annotation.JSONField;

public class RestResponse {
	@JSONField(name="SUCCESS")
	private String success;
	@JSONField(name="RESULT")
	private String result;
	@JSONField(name="MSG")
	private String msg;
	
	public RestResponse(){
		super();
	}
	
	public RestResponse(String success, String result, String msg){
		super();
		this.success = success;
		this.result = result;
		this.msg = msg;
	}
	
    public String getSuccess() {
		return success;
	}


	public void setSuccess(String success) {
		this.success = success;
	}


	public String getResult() {
		return result;
	}


	public void setResult(String result) {
		this.result = result;
	}


	public String getMsg() {
		return msg;
	}


	public void setMsg(String msg) {
		this.msg = msg;
	}


	public boolean isSuccess(){
        return success != null && ("true".equals(success) || "ok".equals(success.toLowerCase())); 
    }
}
