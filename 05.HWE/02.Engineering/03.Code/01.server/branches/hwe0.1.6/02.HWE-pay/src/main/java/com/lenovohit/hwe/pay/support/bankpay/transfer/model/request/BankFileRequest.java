package com.lenovohit.hwe.pay.support.bankpay.transfer.model.request;

import com.lenovohit.hwe.pay.support.bankpay.transfer.model.response.BankResponse;

/**
 * 请求文件。
 * 
 * @author zyus
 */
public abstract class BankFileRequest<T extends BankResponse> implements BankRequest<T>{
	private String filePath;

	public String getFilePath() {
		return filePath;
	}

	public void setFilePath(String filePath) {
		this.filePath = filePath;
	}	
	
}
