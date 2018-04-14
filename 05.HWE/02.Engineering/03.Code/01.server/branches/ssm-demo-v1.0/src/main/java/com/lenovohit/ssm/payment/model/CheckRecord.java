package com.lenovohit.ssm.payment.model;

import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.lenovohit.core.model.BaseIdModel;
import com.lenovohit.ssm.payment.schedule.TradeSchedule;

/**
 * 对账记录
 * @author zyus
 *
 */
@Entity
@Table(name="SSM_CHECK_RECORD")
public class CheckRecord extends BaseIdModel{
	private static final long serialVersionUID = -987941633026444938L;
	public static String CHK_TYPE_ALL = "0";	
	public static String CHK_TYPE_PAY = "1";	
	public static String CHK_TYPE_REFUND = "2";	
	public static String CHK_TYPE_RETURN = "3";	
	public static String CHK_OPTTYPE_AUTO = "0";	
	public static String CHK_OPTTYPE_HAND= "1";	
	
	public static String CHK_STAT_INITIAL = "A";	
	public static String CHK_STAT_FINISH = "0";	
	public static String CHK_STAT_FAILURE = "9";	
	public static String CHK_STAT_FILE_SUCCESS = "1";	
	public static String CHK_STAT_FILE_FAILURE = "2";	
	public static String CHK_STAT_IMP_SUCCESS = "3";	
	public static String CHK_STAT_IMP_FAILURE = "4";	
	public static String CHK_STAT_CHK_SUCCESS = "5";	
	
	
	
	private PayChannel payChannel;
	private String chkDate;
	private String chkType;
	private String chkFile;
	private String optType;
	private String opterator;
	private int total;
	private BigDecimal amt;
	private int successTotal;
	private BigDecimal successAmt;
	private String status;
	private String syncType; //socket | ftp | http | https | query | sftp
	private int syncNum = 0;
	private Date syncTime;
	private Date impTime;
	private Date chkTime;
	
	
	@ManyToOne
	@JoinColumn(name="PAY_CHANNEL_ID")
	public PayChannel getPayChannel() {
		return payChannel;
	}
	public void setPayChannel(PayChannel payChannel) {
		this.payChannel = payChannel;
	}
	public String getChkType() {
		return chkType;
	}
	public void setChkType(String chkType) {
		this.chkType = chkType;
	}
	public String getChkFile() {
		return chkFile;
	}
	public void setChkFile(String chkFile) {
		this.chkFile = chkFile;
	}
	public String getOptType() {
		return optType;
	}
	public void setOptType(String optType) {
		this.optType = optType;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	
	public String getChkDate() {
		return chkDate;
	}
	public void setChkDate(String chkDate) {
		this.chkDate = chkDate;
	}
	public int getTotal() {
		return total;
	}
	public void setTotal(int total) {
		this.total = total;
	}
	public BigDecimal getAmt() {
		return amt;
	}
	public void setAmt(BigDecimal amt) {
		this.amt = amt;
	}
	public int getSuccessTotal() {
		return successTotal;
	}
	public void setSuccessTotal(int successTotal) {
		this.successTotal = successTotal;
	}
	public BigDecimal getSuccessAmt() {
		return successAmt;
	}
	public void setSuccessAmt(BigDecimal successAmt) {
		this.successAmt = successAmt;
	}
	public String getOpterator() {
		return opterator;
	}
	public void setOpterator(String opterator) {
		this.opterator = opterator;
	}
	public int getSyncNum() {
		return syncNum;
	}
	public void setSyncNum(int syncNum) {
		this.syncNum = syncNum;
	}
	public String getSyncType() {
		return syncType;
	}
	public void setSyncType(String syncType) {
		this.syncType = syncType;
	}
	@JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
	public Date getSyncTime() {
		return syncTime;
	}
	public void setSyncTime(Date syncTime) {
		this.syncTime = syncTime;
	}
	@JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
	public Date getImpTime() {
		return impTime;
	}
	public void setImpTime(Date impTime) {
		this.impTime = impTime;
	}
	@JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
	public Date getChkTime() {
		return chkTime;
	}
	public void setChkTime(Date chkTime) {
		this.chkTime = chkTime;
	}
	
	@Transient
	public String getFilePath(){
		return TradeSchedule.CHECK_DIR + "/" + payChannel.getCode() + "/";
	}
}
