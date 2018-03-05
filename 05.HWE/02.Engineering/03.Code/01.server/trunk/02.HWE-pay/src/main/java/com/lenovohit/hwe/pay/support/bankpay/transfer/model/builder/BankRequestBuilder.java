package com.lenovohit.hwe.pay.support.bankpay.transfer.model.builder;

import java.io.UnsupportedEncodingException;

import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.utils.StringUtils;

/**
 * Created by zyus
 */
public abstract class BankRequestBuilder {

    private String length; //报文长度
    
    private String code; //交易代码
    
    private String hisCode; //医院代码
    
    private String bankCode; //交易银行

    // 验证请求对象
    public boolean validate() {
    	if (StringUtils.isEmpty(length)) {
    		throw new NullPointerException("length should not be NULL!");
    	}
    	if (StringUtils.isEmpty(code)) {
    		throw new NullPointerException("code should not be NULL!");
    	}
    	if (StringUtils.isEmpty(hisCode)) {
    		throw new NullPointerException("hisCode should not be NULL!");
    	}
    	if (StringUtils.isEmpty(bankCode)) {
    		throw new NullPointerException("bankCode should not be NULL!");
    	}
        return true;
    }
    
    @Override
    public String toString() {
        final StringBuilder sb = new StringBuilder("");
        sb.append(String.format("%4s", length));
        sb.append(String.format("%4s", code));
        sb.append(String.format("%6s", hisCode));
        sb.append(String.format("%4s", bankCode));
        
        return sb.toString();
    }

	public byte[] getContentBytes(String charset) {
		byte[] bs = new byte[18];
		System.arraycopy(getFillerBytes(charset, 4, (byte) 48, "left", length), 0, bs, 0, 4);
		System.arraycopy(getFillerBytes(charset, 4, (byte) 32, "right", code), 0, bs, 4, 4);
		System.arraycopy(getFillerBytes(charset, 6, (byte) 32, "right", hisCode), 0, bs, 8, 6);
		System.arraycopy(getFillerBytes(charset, 4, (byte) 32, "right", bankCode), 0, bs, 14, 4);
		
		return bs;
	}

    public String getLength() {
		return length;
	}

	public BankRequestBuilder setLength(String length) {
		this.length = length;
		return this;
	}

	public String getCode() {
		return code;
	}

	public BankRequestBuilder setCode(String code) {
		this.code = code;
		return this;
	}


	public String getHisCode() {
		return hisCode;
	}


	public BankRequestBuilder setHisCode(String hisCode) {
		this.hisCode = hisCode;
		return this;
	}

	public String getBankCode() {
		return bankCode;
	}


	public BankRequestBuilder setBankCode(String bankCode) {
		this.bankCode = bankCode;
		return this;
	}

	
	public byte[] getFillerBytes(String charset, int length, byte filler, String pattern, String value) {
		byte[] bt = null;
		byte[] _bt = new byte[length];
		try {
			bt = value.getBytes(charset);
			switch (pattern) {
				case "right":
					for (int i = 0; i < length; i++) {
						if (i < bt.length) {
							_bt[i] = bt[i];
						} else {
							_bt[i] = filler;
						}
					}
					break;
				case "left":
					for (int i = 0; i < length; i++) {
						if (i < bt.length) {
							_bt[length - 1 - i] = bt[bt.length - 1 -i];
						} else {
							_bt[length - 1 - i] = filler;
						}
					}
					break;
				default:
			}
			
			return _bt;
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
			new BaseException("系统错误，不支持的字符！");
		} catch (Exception e) {
			e.printStackTrace();
			new BaseException("字符串转固定长度字节错误！");
		}
		return _bt;
	}
}
