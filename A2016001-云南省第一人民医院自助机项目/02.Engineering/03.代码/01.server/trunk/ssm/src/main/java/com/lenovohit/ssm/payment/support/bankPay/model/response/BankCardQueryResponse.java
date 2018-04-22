package com.lenovohit.ssm.payment.support.bankPay.model.response;

/**
 * API基础响应信息。
 * 
 * @author zyus
 */
public class BankCardQueryResponse extends BankResponse {
	private String              account;//退款卡号
    
    private String              accountName;//退款户名

	public String getAccount() {
		return account;
	}

	public void setAccount(String account) {
		this.account = account;
	}

	public String getAccountName() {
		return accountName;
	}

	public void setAccountName(String accountName) {
		this.accountName = accountName;
	}
    
    
}
