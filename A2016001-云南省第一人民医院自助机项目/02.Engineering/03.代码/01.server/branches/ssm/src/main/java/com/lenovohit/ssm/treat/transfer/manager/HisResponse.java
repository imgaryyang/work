package com.lenovohit.ssm.treat.transfer.manager;

import com.alibaba.fastjson.annotation.JSONField;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.ssm.treat.transfer.dao.RestResponse;

public class HisResponse {
	@JSONField(name="RESULTCODE")
	private String resultcode;
	@JSONField(name="RESULT")
	private String result;
	@JSONField(name="CONTENT")
	private String content;
	public HisResponse(){}
	public HisResponse(RestResponse reponse){
		this.setResult(reponse.getResult());
		String resultCode = reponse.getResultcode();
		this.setResultcode(resultCode);
		String content = reponse.getContent();
		this.setContent(content);
	}
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
    public boolean isSuccess(){
        return StringUtils.isNotBlank(resultcode) 
        		&& StringUtils.equals("1", resultcode);
    }
}
