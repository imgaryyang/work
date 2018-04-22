package com.lenovohit.ssm.payment.support.bankPay.model.response;

/**
 * API基础响应信息。
 * 
 * @author zyus
 */
public class BankRefundResponse extends BankResponse {
	
	private String              outTradeNo; //医院流水号

    private String              tradeNo; //银行流水号

    private String              tradeDate;//银行交易日期

    private String              tradeTime;//银行交易时间

    private String              cardBankCode;//退款银行行号
    
    private String              account;//退款卡号
    
    private String              accountName;//退款户名
    
    private String 				amount;//退款金额
    

	public String getOutTradeNo() {
		return outTradeNo;
	}

	public void setOutTradeNo(String outTradeNo) {
		this.outTradeNo = outTradeNo;
	}

	public String getTradeNo() {
		return tradeNo;
	}

	public void setTradeNo(String tradeNo) {
		this.tradeNo = tradeNo;
	}

	public String getTradeDate() {
		return tradeDate;
	}

	public void setTradeDate(String tradeDate) {
		this.tradeDate = tradeDate;
	}

	public String getTradeTime() {
		return tradeTime;
	}

	public void setTradeTime(String tradeTime) {
		this.tradeTime = tradeTime;
	}

	public String getCardBankCode() {
		return cardBankCode;
	}

	public void setCardBankCode(String cardBankCode) {
		this.cardBankCode = cardBankCode;
	}

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

	public String getAmount() {
		return amount;
	}

	public void setAmount(String amount) {
		this.amount = amount;
	}

}
