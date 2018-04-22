package com.lenovohit.ssm.payment.support.bankPay.model.builder;

import com.lenovohit.core.utils.StringUtils;

/**
 * Created by zyus
 */
public class BankQueryRequestBuilder extends BankRequestBuilder {

	private String tradeType;                  	//交易类型	字符(2)	02表示退款
	private String outTradeNo;                  //医院流水号	字符(12)	必输
	private String outTradeDate;                //医院交易日期	字符(8)YYYYMMDD	必输
	private String outTradeTime;                //医院交易时间	字符(6) hhmmss	必输
	
    @Override
    public boolean validate() {
    	if (StringUtils.isEmpty(tradeType)) {
    		throw new NullPointerException("tradeType should not be NULL!");
    	}
    	if (StringUtils.isEmpty(outTradeNo)) {
    		throw new NullPointerException("outTradeNo should not be NULL!");
    	}
    	if (StringUtils.isEmpty(outTradeDate)) {
    		throw new NullPointerException("outTradeDate should not be NULL!");
    	}
    	if (StringUtils.isEmpty(outTradeTime)) {
    		throw new NullPointerException("outTradeTime should not be NULL!");
    	}
        return true;
    }

    @Override
    public String toString() {
    	StringBuilder sb = new StringBuilder("");
        sb.append(super.toString());
        sb.append(String.format("%2s",tradeType));
        sb.append(String.format("%16s",outTradeNo));
        sb.append(String.format("%8s",outTradeDate));
        sb.append(String.format("%6s",outTradeTime));
        
        return sb.toString();
    }
    
    @Override
	public byte[] getContentBytes(String charset) {
    	byte[] bs = new byte[50];
		System.arraycopy(super.getContentBytes(charset), 0, bs, 0, 18);
        System.arraycopy(getFillerBytes(charset, 2, (byte)32, "right", tradeType), 0, bs, 18, 2);
        System.arraycopy(getFillerBytes(charset, 16, (byte)32, "right", outTradeNo), 0, bs, 20, 16);
        System.arraycopy(getFillerBytes(charset, 8, (byte)32, "right", outTradeDate), 0, bs, 36, 8);
        System.arraycopy(getFillerBytes(charset, 6, (byte)32, "right", outTradeTime), 0, bs, 44, 6);
        
        return bs;
	}

    @Override
	public BankQueryRequestBuilder setLength(String length) {
		super.setLength(length);
		return this;
	}

    @Override
	public BankQueryRequestBuilder setCode(String code) {
		super.setCode(code);
		return this;
	}

    @Override
	public BankQueryRequestBuilder setHisCode(String hisCode) {
		super.setHisCode(hisCode);
		return this;
	}
    
    @Override
   	public BankQueryRequestBuilder setBankCode(String bankCode) {
   		super.setBankCode(bankCode);
   		return this;
   	}
	
    public String getOutTradeNo() {
		return outTradeNo;
	}

	public BankQueryRequestBuilder setOutTradeNo(String outTradeNo) {
		this.outTradeNo = outTradeNo;
		return this;
	}

	public String getOutTradeDate() {
		return outTradeDate;
	}

	public BankQueryRequestBuilder setOutTradeDate(String outTradeDate) {
		this.outTradeDate = outTradeDate;
		return this;
	}

	public String getOutTradeTime() {
		return outTradeTime;
	}

	public BankQueryRequestBuilder setOutTradeTime(String outTradeTime) {
		this.outTradeTime = outTradeTime;
		return this;
	}

	public String getTradeType() {
		return tradeType;
	}

	public BankQueryRequestBuilder setTradeType(String tradeType) {
		this.tradeType = tradeType;
		return this;
	}

}
