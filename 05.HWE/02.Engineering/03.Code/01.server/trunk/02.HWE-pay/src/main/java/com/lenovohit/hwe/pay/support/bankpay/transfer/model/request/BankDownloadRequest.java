package com.lenovohit.hwe.pay.support.bankpay.transfer.model.request;

import com.lenovohit.hwe.pay.support.bankpay.transfer.config.Constants;
import com.lenovohit.hwe.pay.support.bankpay.transfer.model.response.BankDownloadResponse;

/**
 * 请求接口。
 * 
 * @author zyus
 */
public class BankDownloadRequest extends BankFileRequest<BankDownloadResponse>{

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
	
	public Class<BankDownloadResponse> getResponseClass() {
		return BankDownloadResponse.class;
	}
	
	@Override
	public int getResponseLength() {
		int lengthSize = 4;
		return Integer.valueOf(Constants.TRADE_CHECK_RSP_SIZE) + lengthSize;
	}
}
