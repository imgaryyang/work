package com.lenovohit.hwe.pay.support.bankpay.transfer.model.builder;

import com.lenovohit.core.utils.StringUtils;

/**
 * Created by zyus
 */
public class BankCardQueryRequestBuilder extends BankRequestBuilder {

	private String account;                  	//银行卡号	字符(32)	必输
	
    @Override
    public boolean validate() {
    	if (StringUtils.isEmpty(account)) {
    		throw new NullPointerException("account should not be NULL!");
    	}
        return true;
    }

    @Override
    public String toString() {
    	StringBuilder sb = new StringBuilder("");
        sb.append(super.toString());
        sb.append(String.format("%32s",account));
        
        return sb.toString();
    }
    
    @Override
	public byte[] getContentBytes(String charset) {
    	byte[] bs = new byte[50];
		System.arraycopy(super.getContentBytes(charset), 0, bs, 0, 18);
        System.arraycopy(getFillerBytes(charset, 32, (byte)32, "right", account), 0, bs, 18, 32);
        
        return bs;
	}

    @Override
	public BankCardQueryRequestBuilder setLength(String length) {
		super.setLength(length);
		return this;
	}

    @Override
	public BankCardQueryRequestBuilder setCode(String code) {
		super.setCode(code);
		return this;
	}

    @Override
	public BankCardQueryRequestBuilder setHisCode(String hisCode) {
		super.setHisCode(hisCode);
		return this;
	}
    
    @Override
   	public BankCardQueryRequestBuilder setBankCode(String bankCode) {
   		super.setBankCode(bankCode);
   		return this;
   	}

	public String getAccount() {
		return account;
	}

	public BankCardQueryRequestBuilder setAccount(String account) {
		this.account = account;
		return this;
	}
	
	
}
