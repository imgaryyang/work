package com.lenovohit.ssm.payment.support.bankPay.model.request;

import com.lenovohit.ssm.payment.support.bankPay.config.Constants;
import com.lenovohit.ssm.payment.support.bankPay.model.response.BankRefundResponse;

/**
 * 请求接口。
 * 
 * @author zyus
 */
public class BankRefundRequest implements BankRequest<BankRefundResponse>{
	private String content;
	private byte[] contentBytes;
	
	public String getContent(){
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}
	
	public byte[] getContentBytes() {
		return contentBytes;
	}
	public void setContentBytes(byte[] contentBytes) {
		this.contentBytes = contentBytes;
	}
	
	public Class<BankRefundResponse> getResponseClass() {
		return BankRefundResponse.class;
	}
	
	@Override
	public int getResponseLength() {
		int lengthSize = 4;
		return Integer.valueOf(Constants.TRADE_REFUND_RSP_SIZE) + lengthSize;
	}
    
}
