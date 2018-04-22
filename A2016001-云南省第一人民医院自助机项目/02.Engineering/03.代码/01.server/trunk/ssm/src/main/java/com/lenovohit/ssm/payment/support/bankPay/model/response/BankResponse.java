package com.lenovohit.ssm.payment.support.bankPay.model.response;

/**
 * Created by zyus
 */
public abstract class BankResponse {

    private String length; //报文长度
    
    private String code; //交易代码
    
    private String bankCode; //交易银行
    
    private String respCode; //反馈码

    private String respMsg;	//反馈信息
    
    private String body;	//返回报文
    
	public String getLength() {
		return length;
	}


	public void setLength(String length) {
		this.length = length;
	}


	public String getCode() {
		return code;
	}


	public void setCode(String code) {
		this.code = code;
	}


	public String getBankCode() {
		return bankCode;
	}


	public void setBankCode(String bankCode) {
		this.bankCode = bankCode;
	}
	
	
	public String getRespCode() {
		return respCode;
	}


	public void setRespCode(String respCode) {
		this.respCode = respCode;
	}


	public String getRespMsg() {
		return respMsg;
	}


	public void setRespMsg(String respMsg) {
		this.respMsg = respMsg;
	}


	public String getBody() {
		return body;
	}


	public void setBody(String body) {
		this.body = body;
	}
	
}
