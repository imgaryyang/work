package com.lenovohit.ssm.payment.support.bankPay.model.request;

import com.lenovohit.ssm.payment.support.bankPay.model.response.BankResponse;

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
