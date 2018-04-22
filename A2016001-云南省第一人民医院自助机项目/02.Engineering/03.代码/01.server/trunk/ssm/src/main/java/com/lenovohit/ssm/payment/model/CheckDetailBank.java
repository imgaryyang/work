package com.lenovohit.ssm.payment.model;

import java.math.BigDecimal;

import javax.persistence.Entity;
import javax.persistence.Table;

import com.lenovohit.core.model.BaseIdModel;

/**
 * 银行交易明细
 * @author zyus
 *
 */
@Entity
@Table(name="SSM_CHECK_DETAIL_BANK")
public class CheckDetailBank extends BaseIdModel{
	private static final long serialVersionUID = -987941633026444938L;
	
	private String checkRecord  ;				//对账记录
	private String merchanet	;               //商户号
	private String terminal 	;               //终端号
	private String batchNo      ;               //批次号
	private String account      ;               //银行卡号
	private BigDecimal amt      ;               //交易金额
	private BigDecimal clearAmt ;               //清分金额
	private String cardType 	;               //银行卡类型
	private String cardBankCode ;               //发卡行代码
	private String outTradeNo	;				//医院流水
	private String tradeNo      ;               //交易参考号/交易号
	private String tradeType    ;               //交易类型 S22-消费| HB02-退款 | HB10-退汇
	private String tradeDate    ;               //交易日期
	private String tradeTime    ;               //交易时间
	private String tradeStatus 	;				//交易状态 S-成功，F-失败，B-退汇，P-处理中
	private String clearDate 	;               //清算日期
	private String memo;						//备注

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
	public String getAccount() {
		return account;
	}
	public void setAccount(String account) {
		this.account = account;
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
	public String getOutTradeNo() {
		return outTradeNo;
	}
	public void setOutTradeNo(String outTradeNo) {
		this.outTradeNo = outTradeNo;
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
	public String getTradeStatus() {
		return tradeStatus;
	}
	public void setTradeStatus(String tradeStatus) {
		this.tradeStatus = tradeStatus;
	}
	public String getClearDate() {
		return clearDate;
	}
	public void setClearDate(String clearDate) {
		this.clearDate = clearDate;
	}
	public String getMemo() {
		return memo;
	}
	public void setMemo(String memo) {
		this.memo = memo;
	}
}
