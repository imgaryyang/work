package com.lenovohit.hwe.pay.support.bankpay.transfer.model.builder;

import com.lenovohit.core.utils.StringUtils;

/**
 * Created by zyus
 */
/**
 * @author lenovo
 *
 */
public class BankDownloadRequestBuilder extends BankRequestBuilder {

	private String checkDate;                	//对账日期	字符(8)YYYYMMDD	必输
	private String syncType;					//同步对账文件方式
	private String filePath;					//对账文件路径
	
    @Override
    public boolean validate() {
    	if (StringUtils.isEmpty(checkDate)) {
    		throw new NullPointerException("checkDate should not be NULL!");
    	}
        return true;
    }
    @Override
    public String toString() {
    	StringBuilder sb = new StringBuilder("");
        sb.append(super.toString());
        sb.append(String.format("%8s",checkDate));
        
        return sb.toString();
    }
    @Override
	public byte[] getContentBytes(String charset) {
    	byte[] bs = new byte[26];
		System.arraycopy(super.getContentBytes(charset), 0, bs, 0, 18);
        System.arraycopy(getFillerBytes(charset, 8, (byte)32, "right", checkDate), 0, bs, 18, 8);
        
        return bs;
	}

    @Override
	public BankDownloadRequestBuilder setLength(String length) {
		super.setLength(length);
		return this;
	}

    @Override
	public BankDownloadRequestBuilder setCode(String code) {
		super.setCode(code);
		return this;
	}

    @Override
	public BankDownloadRequestBuilder setHisCode(String hisCode) {
		super.setHisCode(hisCode);
		return this;
	}

    @Override
   	public BankDownloadRequestBuilder setBankCode(String bankCode) {
   		super.setBankCode(bankCode);
   		return this;
   	}
	
	public String getCheckDate() {
		return checkDate;
	}

	public BankDownloadRequestBuilder setCheckDate(String checkDate) {
		this.checkDate = checkDate;
		return this;
	}
	
	public String getSyncType() {
		return syncType;
	}

	public BankDownloadRequestBuilder setSyncType(String syncType) {
		this.syncType = syncType;
		return this;
	}
	
	public String getFilePath() {
		return filePath;
	}
	
	public BankDownloadRequestBuilder setFilePath(String filePath) {
		this.filePath = filePath;
		return this;
	}

}
