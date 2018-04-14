package com.lenovohit.ssm.payment.support.bankPay.model.builder;

import java.math.BigDecimal;

import com.lenovohit.core.utils.StringUtils;

/**
 * Created by zyus
 */
public class BankRefundRequestBuilder extends BankRequestBuilder {

	private String outTradeNo;                  //医院流水号
	private String outTradeDate;                //医院交易日期
	private String outTradeTime;                //医院交易时间
	private String cardBankCode;                //退款银行行号
	private String account;                     //退款卡号
	private String accountName;                 //退款户名
	private String amount;                      //退款金额
	
    @Override
    public boolean validate() {
    	super.validate();
    	
    	if (StringUtils.isEmpty(outTradeNo)) {
    		throw new NullPointerException("outTradeNo should not be NULL!");
    	}
    	if (StringUtils.isEmpty(outTradeDate)) {
    		throw new NullPointerException("outTradeDate should not be NULL!");
    	}
    	if (StringUtils.isEmpty(outTradeTime)) {
    		throw new NullPointerException("outTradeTime should not be NULL!");
    	}
    	if (StringUtils.isEmpty(cardBankCode)) {
    		throw new NullPointerException("cardBankCode should not be NULL!");
    	}
    	if (StringUtils.isEmpty(account)) {
    		throw new NullPointerException("account should not be NULL!");
    	}
    	if (StringUtils.isEmpty(accountName)) {
    		throw new NullPointerException("accountName should not be NULL!");
    	}
    	if (StringUtils.isEmpty(amount) || new BigDecimal(amount.trim()).compareTo(new BigDecimal(0)) != 1 ) {
    		throw new NullPointerException("amount should not be NULL or <= 0!");
    	}

    	return true;
    }

	@Override
    public String toString() {
    	final StringBuilder sb = new StringBuilder("");
    	
        sb.append(super.toString());
        sb.append(String.format("%16s",outTradeNo));
        sb.append(String.format("%8s",outTradeDate));
        sb.append(String.format("%6s",outTradeTime));
        sb.append(String.format("%12s",cardBankCode));
        sb.append(String.format("%32s",account));
        sb.append(String.format("%128s",accountName));
        sb.append(String.format("%12s",amount));
        
        return sb.toString();
    }

    @Override
	public byte[] getContentBytes(String charset) {
    	byte[] bs = new byte[232];
		System.arraycopy(super.getContentBytes(charset), 0, bs, 0, 18);
        System.arraycopy(getFillerBytes(charset, 16, (byte)32, "right", outTradeNo), 0, bs, 18, 16);
        System.arraycopy(getFillerBytes(charset, 8, (byte)32, "right", outTradeDate), 0, bs, 34, 8);
        System.arraycopy(getFillerBytes(charset, 6, (byte)32, "right", outTradeTime), 0, bs, 42, 6);
        System.arraycopy(getFillerBytes(charset, 12, (byte)32, "right", cardBankCode), 0, bs, 48, 12);
        System.arraycopy(getFillerBytes(charset, 32, (byte)32, "right", account), 0, bs, 60, 32);
        System.arraycopy(getFillerBytes(charset, 128, (byte)32, "right", accountName), 0, bs, 92, 128);
        System.arraycopy(getFillerBytes(charset, 12, (byte)48, "left", amount), 0, bs, 220, 12);
        
        return bs;
	}

	@Override
	public BankRefundRequestBuilder setLength(String length) {
		super.setLength(length);
		return this;
	}

    @Override
	public BankRefundRequestBuilder setCode(String code) {
		super.setCode(code);
		return this;
	}

    @Override
	public BankRefundRequestBuilder setHisCode(String hisCode) {
		super.setHisCode(hisCode);
		return this;
	}
    
    @Override
   	public BankRefundRequestBuilder setBankCode(String bankCode) {
   		super.setBankCode(bankCode);
   		return this;
   	}

	
    public String getOutTradeNo() {
		return outTradeNo;
	}

	public BankRefundRequestBuilder setOutTradeNo(String outTradeNo) {
		this.outTradeNo = outTradeNo;
		return this;
	}

	public String getOutTradeDate() {
		return outTradeDate;
	}

	public BankRefundRequestBuilder setOutTradeDate(String outTradeDate) {
		this.outTradeDate = outTradeDate;
		return this;
	}

	public String getOutTradeTime() {
		return outTradeTime;
	}

	public BankRefundRequestBuilder setOutTradeTime(String outTradeTime) {
		this.outTradeTime = outTradeTime;
		return this;
	}

	public String getCardBankCode() {
		return cardBankCode;
	}

	public BankRefundRequestBuilder setCardBankCode(String cardBankCode) {
		this.cardBankCode = cardBankCode;
		return this;
	}

	public String getAccount() {
		return account;
	}

	public BankRefundRequestBuilder setAccount(String account) {
		this.account = account;
		return this;
	}

	public String getAccountName() {
		return accountName;
	}

	public BankRefundRequestBuilder setAccountName(String accountName) {
		this.accountName = accountName;
		return this;
	}

	public String getAmount() {
		return amount;
	}

	public BankRefundRequestBuilder setAmount(String amount) {
		this.amount = amount;
		return this;
	}
	
}
