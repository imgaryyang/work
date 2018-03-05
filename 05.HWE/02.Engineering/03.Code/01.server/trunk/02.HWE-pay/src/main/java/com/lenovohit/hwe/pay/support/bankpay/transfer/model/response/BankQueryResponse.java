package com.lenovohit.hwe.pay.support.bankpay.transfer.model.response;

/**
 * API基础响应信息。
 * 
 * @author zyus
 */
public class BankQueryResponse extends BankResponse {

	private String			    tradeType; //交易类型
	
	private String              outTradeNo; //医院流水号

    private String              tradeNo; //银行流水号

    private String              tradeDate;//银行交易日期

    private String              tradeTime;//银行交易时间

    private String              account;//退款卡号
    
    private String 				amount;//退款金额
    
    

	public String getTradeType() {
		return tradeType;
	}

	public void setTradeType(String tradeType) {
		this.tradeType = tradeType;
	}

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

	public String getAccount() {
		return account;
	}

	public void setAccount(String account) {
		this.account = account;
	}

	public String getAmount() {
		return amount;
	}

	public void setAmount(String amount) {
		this.amount = amount;
	}
    
}
