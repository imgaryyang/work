package com.infohold.ebpp.bill.model;

import java.util.HashMap;
import java.util.Map;

import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;

import com.infohold.core.model.BaseIdModel;

/**
 * 日终日志表
 * @author Administrator
 *
 */
@Entity
@Table(name = "IH_EBPP_END_LOG" )
public class EndDayLog extends BaseIdModel{

	private static final long serialVersionUID = -120686350822480973L;
	@Transient
	public static final String FLAG_FAILED = "0";
	@Transient
	public static final String FLAG_SUCCESS = "1";
	@Transient
	public static final String FLAG_SUCCESS_WARN = "2";//虽然成功了，但是执行过程中存在异常情况，比如某一条日终是无效的，或某条数据插入账单表失败等等。
	@Transient
	public static final String SYNC_TYPE_NORMAL = "0";
	@Transient
	public static final String SYNC_TYPE_AGAIN= "1";
	
	/** 定时器对账类型map  */
    public static Map<String, String> SYNC_TYPE_MAP = new HashMap<String, String>();
    static{
    	SYNC_TYPE_MAP.put(EndDayLog.SYNC_TYPE_NORMAL, "正常");
    	SYNC_TYPE_MAP.put(EndDayLog.SYNC_TYPE_AGAIN, "重复执行");
    }
    
    /** 定时器对账结果map  */
    public static Map<String, String> FLAG_MAP = new HashMap<String, String>();
    static{
    	FLAG_MAP.put(EndDayLog.FLAG_FAILED, "失败");
    	FLAG_MAP.put(EndDayLog.FLAG_SUCCESS, "成功");
    	FLAG_MAP.put(EndDayLog.FLAG_SUCCESS_WARN, "带有警告的成功");
    }
	
	
	
	private String beginTime;
	private String syncDate;
	private String syncType;
	
	private long billEndHeadNum;
	private long billEndParsedNum;
	private long billEndValidNum;
	private long billEndInvalidNum;
	
	private long billLessNum;
	private long billMoreNum;
	private long billOldNum;
	private long billNewNum;
	private long billDiffNum;
	private long billSameNum;
	
	private String billSyncFlag;
	private String billSyncInfo;
	
	
	private long payEndHeadNum;
	private long payEndParsedNum;
	private long payEndValidNum;
	private long payEndInvalidNum;
	
	private long payLessNum;
	private long payMoreNum;
	private long payOldNum;
	private long payNewNum;
	private long payDiffNum;
	private long paySameNum;
	
	private String paySyncFlag;
	private String paySyncInfo;
	
	
	private String endTableMovFlag;
	private String endTableMovInfo;
	private String endFilesMovFlag;
	private String endFilesMovInfo;
	
	private String endTime;
	private long costTime;
	
	private String flag;
	private String failedCause;
	private String failedDetailInfo;
	private String warnInfo;
	private String logInfo;
	

	

	
	

	public String getBeginTime() {
		return beginTime;
	}

	public void setBeginTime(String beginTime) {
		this.beginTime = beginTime;
	}

	public String getSyncDate() {
		return syncDate;
	}

	public void setSyncDate(String syncDate) {
		this.syncDate = syncDate;
	}

	public String getSyncType() {
		return syncType;
	}

	public void setSyncType(String syncType) {
		this.syncType = syncType;
	}

	public long getBillEndHeadNum() {
		return billEndHeadNum;
	}

	public void setBillEndHeadNum(long billEndHeadNum) {
		this.billEndHeadNum = billEndHeadNum;
	}

	public long getBillEndParsedNum() {
		return billEndParsedNum;
	}

	public void setBillEndParsedNum(long billEndParsedNum) {
		this.billEndParsedNum = billEndParsedNum;
	}

	public long getBillEndValidNum() {
		return billEndValidNum;
	}

	public void setBillEndValidNum(long billEndValidNum) {
		this.billEndValidNum = billEndValidNum;
	}

	public long getBillEndInvalidNum() {
		return billEndInvalidNum;
	}

	public void setBillEndInvalidNum(long billEndInvalidNum) {
		this.billEndInvalidNum = billEndInvalidNum;
	}

	public long getBillLessNum() {
		return billLessNum;
	}

	public void setBillLessNum(long billLessNum) {
		this.billLessNum = billLessNum;
	}

	public long getBillMoreNum() {
		return billMoreNum;
	}

	public void setBillMoreNum(long billMoreNum) {
		this.billMoreNum = billMoreNum;
	}

	public long getBillOldNum() {
		return billOldNum;
	}

	public void setBillOldNum(long billOldNum) {
		this.billOldNum = billOldNum;
	}

	public long getBillNewNum() {
		return billNewNum;
	}

	public void setBillNewNum(long billNewNum) {
		this.billNewNum = billNewNum;
	}

	public long getBillDiffNum() {
		return billDiffNum;
	}

	public void setBillDiffNum(long billDiffNum) {
		this.billDiffNum = billDiffNum;
	}

	public long getBillSameNum() {
		return billSameNum;
	}

	public void setBillSameNum(long billSameNum) {
		this.billSameNum = billSameNum;
	}

	public String getBillSyncFlag() {
		return billSyncFlag;
	}

	public void setBillSyncFlag(String billSyncFlag) {
		this.billSyncFlag = billSyncFlag;
	}

	public String getBillSyncInfo() {
		return billSyncInfo;
	}

	public void setBillSyncInfo(String billSyncInfo) {
		this.billSyncInfo = billSyncInfo;
	}

	public long getPayEndHeadNum() {
		return payEndHeadNum;
	}

	public void setPayEndHeadNum(long payEndHeadNum) {
		this.payEndHeadNum = payEndHeadNum;
	}

	public long getPayEndParsedNum() {
		return payEndParsedNum;
	}

	public void setPayEndParsedNum(long payEndParsedNum) {
		this.payEndParsedNum = payEndParsedNum;
	}

	public long getPayEndValidNum() {
		return payEndValidNum;
	}

	public void setPayEndValidNum(long payEndValidNum) {
		this.payEndValidNum = payEndValidNum;
	}

	public long getPayEndInvalidNum() {
		return payEndInvalidNum;
	}

	public void setPayEndInvalidNum(long payEndInvalidNum) {
		this.payEndInvalidNum = payEndInvalidNum;
	}

	public long getPayLessNum() {
		return payLessNum;
	}

	public void setPayLessNum(long payLessNum) {
		this.payLessNum = payLessNum;
	}

	public long getPayMoreNum() {
		return payMoreNum;
	}

	public void setPayMoreNum(long payMoreNum) {
		this.payMoreNum = payMoreNum;
	}

	public long getPayOldNum() {
		return payOldNum;
	}

	public void setPayOldNum(long payOldNum) {
		this.payOldNum = payOldNum;
	}

	public long getPayNewNum() {
		return payNewNum;
	}

	public void setPayNewNum(long payNewNum) {
		this.payNewNum = payNewNum;
	}

	public long getPayDiffNum() {
		return payDiffNum;
	}

	public void setPayDiffNum(long payDiffNum) {
		this.payDiffNum = payDiffNum;
	}

	public long getPaySameNum() {
		return paySameNum;
	}

	public void setPaySameNum(long paySameNum) {
		this.paySameNum = paySameNum;
	}

	public String getPaySyncFlag() {
		return paySyncFlag;
	}

	public void setPaySyncFlag(String paySyncFlag) {
		this.paySyncFlag = paySyncFlag;
	}

	public String getPaySyncInfo() {
		return paySyncInfo;
	}

	public void setPaySyncInfo(String paySyncInfo) {
		this.paySyncInfo = paySyncInfo;
	}

	public String getEndTableMovFlag() {
		return endTableMovFlag;
	}

	public void setEndTableMovFlag(String endTableMovFlag) {
		this.endTableMovFlag = endTableMovFlag;
	}

	public String getEndTableMovInfo() {
		return endTableMovInfo;
	}

	public void setEndTableMovInfo(String endTableMovInfo) {
		this.endTableMovInfo = endTableMovInfo;
	}

	public String getEndFilesMovFlag() {
		return endFilesMovFlag;
	}

	public void setEndFilesMovFlag(String endFilesMovFlag) {
		this.endFilesMovFlag = endFilesMovFlag;
	}

	public String getEndFilesMovInfo() {
		return endFilesMovInfo;
	}

	public void setEndFilesMovInfo(String endFilesMovInfo) {
		this.endFilesMovInfo = endFilesMovInfo;
	}

	public String getEndTime() {
		return endTime;
	}

	public void setEndTime(String endTime) {
		this.endTime = endTime;
	}

	public long getCostTime() {
		return costTime;
	}

	public void setCostTime(long costTime) {
		this.costTime = costTime;
	}

	public String getFlag() {
		return flag;
	}

	public void setFlag(String flag) {
		this.flag = flag;
	}

	public String getFailedCause() {
		return failedCause;
	}

	public void setFailedCause(String failedCause) {
		this.failedCause = failedCause;
	}

	public String getFailedDetailInfo() {
		return failedDetailInfo;
	}

	public void setFailedDetailInfo(String failedDetailInfo) {
		this.failedDetailInfo = failedDetailInfo;
	}

	public String getWarnInfo() {
		return warnInfo;
	}

	public void setWarnInfo(String warnInfo) {
		this.warnInfo = warnInfo;
	}

	public String getLogInfo() {
		return logInfo;
	}

	public void setLogInfo(String logInfo) {
		this.logInfo = logInfo;
	}

	/**
	 * 重载toString;
	 */
	public String toString() {
		return ToStringBuilder.reflectionToString(this);
	}

	/**
	 * 重载hashCode;
	 */
	public int hashCode() {
		return new HashCodeBuilder().append(this.getId()).toHashCode();
	}

	/**
	 * 重载equals
	 */
	public boolean equals(Object obj) {
		return EqualsBuilder.reflectionEquals(this, obj);
	}
	
}
