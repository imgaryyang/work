package com.lenovohit.ssm.payment.model;

import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.lenovohit.core.model.BaseIdModel;

/**
 * 对账结果
 * @author zyus
 *
 */
@Entity
@Table(name="SSM_CHECK_DETAIL_RESULT")
public class CheckDetailResult extends BaseIdModel{
	private static final long serialVersionUID = -987941633026444938L;
	public static final String HIS_CHECK_STATUS_INITIAL = "A";
	public static final String HIS_CHECK_STATUS_SUCCESS = "0";
	public static final String HIS_CHECK_STATUS_FAILURE = "1";
	public static final String HIS_CHECK_STATUS_MNY_MORE = "2";
	public static final String HIS_CHECK_STATUS_MNY_LESS = "3";
	public static final String HIS_CHECK_STATUS_HIS_NOTRADE = "4";
	public static final String HIS_CHECK_STATUS_PCL_NOTRADE = "5";
	public static final String SSM_CHECK_STATUS_INITIAL = "A";
	public static final String SSM_CHECK_STATUS_SUCCESS = "0";
	public static final String SSM_CHECK_STATUS_FAILURE = "1";
	public static final String SSM_CHECK_STATUS_MNY_MORE = "2";
	public static final String SSM_CHECK_STATUS_MNY_LESS = "3";
	public static final String SSM_CHECK_STATUS_SSM_NOTRADE = "4";
	public static final String SSM_CHECK_STATUS_PCL_NOTRADE = "5";
	public static final String CHECK_TYPE_AUTO = "0";	
	public static final String CHECK_TYPE_HAND= "1";	
	public static final String DEAL_TYPE_AUTO = "0";	
	public static final String DEAL_TYPE_HAND = "1";	
	
	
	private String checkRecord  ;				//对账记录
	private String merchanet	;               //商户号
	private String terminal 	;               //终端号
	private String batchNo      ;               //批次号
	private BigDecimal amt      = new BigDecimal(0);               //交易金额
	private BigDecimal clearAmt = new BigDecimal(0);               //清分金额
	private String account		;				//交易账户
	private String cardType     ;               //银行卡类型
	private String cardBankCode ;               //发卡行代码
	private String tradeType    ;               //交易类型
	private String tradeNo      ;               //渠道交易参考号/交易号
	private String tradeDate    ;               //渠道交易日期
	private String tradeTime    ;               //渠道交易时间
	private String clearDate 	;               //清算日期
	private String ssmNo        ;               //自助机流水
	private Date ssmTime      	;               //自助机交易时间
	private BigDecimal ssmAmt   = new BigDecimal(0);               //自助机交易
	private String ssmCode  	;               //自助机编号
	private Date ssmCheckTime  	;               //自助机对账时间
	private String ssmCheckType ;               //自助机对账类型
	private String ssmCheckStatus;               //自助机对账状态
	private String ssmDealStatus;               //自助机差错处理状态
	private Date ssmDealTime  	;               //自助机差错处理时间
	private String ssmDealOpt   ;               //自助机差错处理操作
	private String ssmDealType  ;               //自助机差错处理类型
	private String hisNo        ;               //HIS流水
	private Date hisTime      	;               //HIS交易时间
	private BigDecimal hisAmt   = new BigDecimal(0);               //HIS交易金额
	private String hisCheckStatus;               //HIS对账状态
	private Date hisCheckTime 	;               //His对账时间
	private String hisCheckType ;               //His对账类型
	private String hisDealStatus;               //His差错处理状态
	private Date hisDealTime  	;               //His差错处理时间
	private String hisDealOpt   ;               //His差错处理操作
	private String hisDealType	;				//HIs差错处理类型
	
	
	public String getCheckRecord() {
		return checkRecord;
	}
	public void setCheckRecord(String checkRecord) {
		this.checkRecord = checkRecord;
	}
	public String getMerchanet() {
		return merchanet;
	}
	public void setMerchanet(String merchanet) {
		this.merchanet = merchanet;
	}
	public String getTerminal() {
		return terminal;
	}
	public void setTerminal(String terminal) {
		this.terminal = terminal;
	}
	public String getBatchNo() {
		return batchNo;
	}
	public void setBatchNo(String batchNo) {
		this.batchNo = batchNo;
	}
	public BigDecimal getAmt() {
		return amt;
	}
	public void setAmt(BigDecimal amt) {
		this.amt = amt;
	}
	public BigDecimal getClearAmt() {
		return clearAmt;
	}
	public void setClearAmt(BigDecimal clearAmt) {
		this.clearAmt = clearAmt;
	}
	public String getAccount() {
		return account;
	}
	public void setAccount(String account) {
		this.account = account;
	}
	public String getCardType() {
		return cardType;
	}
	public void setCardType(String cardType) {
		this.cardType = cardType;
	}
	public String getCardBankCode() {
		return cardBankCode;
	}
	public void setCardBankCode(String cardBankCode) {
		this.cardBankCode = cardBankCode;
	}
	public String getTradeType() {
		return tradeType;
	}
	public void setTradeType(String tradeType) {
		this.tradeType = tradeType;
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
	public String getClearDate() {
		return clearDate;
	}
	public void setClearDate(String clearDate) {
		this.clearDate = clearDate;
	}
	public String getSsmNo() {
		return ssmNo;
	}
	public void setSsmNo(String ssmNo) {
		this.ssmNo = ssmNo;
	}
	@JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
	public Date getSsmTime() {
		return ssmTime;
	}
	public void setSsmTime(Date ssmTime) {
		this.ssmTime = ssmTime;
	}
	public BigDecimal getSsmAmt() {
		return ssmAmt;
	}
	public void setSsmAmt(BigDecimal ssmAmt) {
		this.ssmAmt = ssmAmt;
	}
	public String getSsmCode() {
		return ssmCode;
	}
	public void setSsmCode(String ssmCode) {
		this.ssmCode = ssmCode;
	}
	@JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
	public Date getSsmCheckTime() {
		return ssmCheckTime;
	}
	public void setSsmCheckTime(Date ssmCheckTime) {
		this.ssmCheckTime = ssmCheckTime;
	}
	public String getSsmCheckType() {
		return ssmCheckType;
	}
	public void setSsmCheckType(String ssmCheckType) {
		this.ssmCheckType = ssmCheckType;
	}
	public String getSsmCheckStatus() {
		return ssmCheckStatus;
	}
	public void setSsmCheckStatus(String ssmCheckStatus) {
		this.ssmCheckStatus = ssmCheckStatus;
	}
	public String getSsmDealStatus() {
		return ssmDealStatus;
	}
	public void setSsmDealStatus(String ssmDealStatus) {
		this.ssmDealStatus = ssmDealStatus;
	}
	@JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
	public Date getSsmDealTime() {
		return ssmDealTime;
	}
	public void setSsmDealTime(Date ssmDealTime) {
		this.ssmDealTime = ssmDealTime;
	}
	public String getSsmDealOpt() {
		return ssmDealOpt;
	}
	public void setSsmDealOpt(String ssmDealOpt) {
		this.ssmDealOpt = ssmDealOpt;
	}
	public String getSsmDealType() {
		return ssmDealType;
	}
	public void setSsmDealType(String ssmDealType) {
		this.ssmDealType = ssmDealType;
	}
	public String getHisNo() {
		return hisNo;
	}
	public void setHisNo(String hisNo) {
		this.hisNo = hisNo;
	}
	@JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
	public Date getHisTime() {
		return hisTime;
	}
	public void setHisTime(Date hisTime) {
		this.hisTime = hisTime;
	}
	public BigDecimal getHisAmt() {
		return hisAmt;
	}
	public void setHisAmt(BigDecimal hisAmt) {
		this.hisAmt = hisAmt;
	}
	public String getHisCheckStatus() {
		return hisCheckStatus;
	}
	public void setHisCheckStatus(String hisCheckStatus) {
		this.hisCheckStatus = hisCheckStatus;
	}
	@JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
	public Date getHisCheckTime() {
		return hisCheckTime;
	}
	public void setHisCheckTime(Date hisCheckTime) {
		this.hisCheckTime = hisCheckTime;
	}
	public String getHisCheckType() {
		return hisCheckType;
	}
	public void setHisCheckType(String hisCheckType) {
		this.hisCheckType = hisCheckType;
	}
	public String getHisDealStatus() {
		return hisDealStatus;
	}
	public void setHisDealStatus(String hisDealStatus) {
		this.hisDealStatus = hisDealStatus;
	}
	@JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
	public Date getHisDealTime() {
		return hisDealTime;
	}
	public void setHisDealTime(Date hisDealTime) {
		this.hisDealTime = hisDealTime;
	}
	public String getHisDealOpt() {
		return hisDealOpt;
	}
	public void setHisDealOpt(String hisDealOpt) {
		this.hisDealOpt = hisDealOpt;
	}
	public String getHisDealType() {
		return hisDealType;
	}
	public void setHisDealType(String hisDealType) {
		this.hisDealType = hisDealType;
	}
	
}
