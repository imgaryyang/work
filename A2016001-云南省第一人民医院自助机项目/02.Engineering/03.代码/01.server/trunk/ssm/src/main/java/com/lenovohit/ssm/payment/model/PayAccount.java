package com.lenovohit.ssm.payment.model;

import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.lenovohit.core.model.BaseIdModel;

/**
 * 付款账户
 */
@Entity
@Table(name="SSM_PAY_ACCOUNT")
public class PayAccount extends BaseIdModel{
	private static final long serialVersionUID = 6564771787279938724L;

	private String patientNo  	;
	private String patientName	;
	private String paymentWay   ;
	private String accNo      	;//账户：支付宝buyer_logon_id,微信帐号,银行卡号
	private String accName    	;
	private String accId		;//账户标识:支付宝userId,微信Openid，银行卡号
	private String accType    	;//账户类型 0：银行卡，1：支付宝 2：微信
	private String cardBank	  	;//卡所属银行
	private String cardType   	;//卡类型 0：信用卡 1：非信用卡
	private Date openDate     	;
	private String openCity   	;
	private String openCityName	;
	private String openBank   	;//发卡行代码 9999 支付宝9998 微信以及银联返回的发卡行代码
	private String openBankName	; 
	private BigDecimal tranQuota = new BigDecimal(0);
	private BigDecimal dayQuota = new BigDecimal(0) ;
	private BigDecimal dayBalance = new BigDecimal(0);
	private String cashFlag   	; //结算标志：0-付款 1-收款
	private String status     	; //状态 A - 初始 0 - 开通 1-注销 2-过期 
	private String memo       	; 
	private Date createTime 	;
	private Date updateTime 	;
	
	
	public String getPatientNo() {
		return patientNo;
	}
	public void setPatientNo(String patientNo) {
		this.patientNo = patientNo;
	}
	public String getPatientName() {
		return patientName;
	}
	public void setPatientName(String patientName) {
		this.patientName = patientName;
	}
	
	public String getPaymentWay() {
		return paymentWay;
	}
	public void setPaymentWay(String paymentWay) {
		this.paymentWay = paymentWay;
	}
	public String getAccNo() {
		return accNo;
	}
	public void setAccNo(String accNo) {
		this.accNo = accNo;
	}
	public String getAccName() {
		return accName;
	}
	public void setAccName(String accName) {
		this.accName = accName;
	}
	public String getAccId() {
		return accId;
	}
	public void setAccId(String accId) {
		this.accId = accId;
	}
	public String getAccType() {
		return accType;
	}
	public void setAccType(String accType) {
		this.accType = accType;
	}
	public String getCardType() {
		return cardType;
	}
	public void setCardType(String cardType) {
		this.cardType = cardType;
	}
	public String getCardBank() {
		return cardBank;
	}
	public void setCardBank(String cardBank) {
		this.cardBank = cardBank;
	}
	@JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
	public Date getOpenDate() {
		return openDate;
	}
	public void setOpenDate(Date openDate) {
		this.openDate = openDate;
	}
	public String getOpenCity() {
		return openCity;
	}
	public void setOpenCity(String openCity) {
		this.openCity = openCity;
	}
	public String getOpenCityName() {
		return openCityName;
	}
	public void setOpenCityName(String openCityName) {
		this.openCityName = openCityName;
	}
	public String getOpenBank() {
		return openBank;
	}
	public void setOpenBank(String openBank) {
		this.openBank = openBank;
	}
	public String getOpenBankName() {
		return openBankName;
	}
	public void setOpenBankName(String openBankName) {
		this.openBankName = openBankName;
	}
	public BigDecimal getTranQuota() {
		return tranQuota;
	}
	public void setTranQuota(BigDecimal tranQuota) {
		this.tranQuota = tranQuota;
	}
	public BigDecimal getDayQuota() {
		return dayQuota;
	}
	public void setDayQuota(BigDecimal dayQuota) {
		this.dayQuota = dayQuota;
	}
	public BigDecimal getDayBalance() {
		return dayBalance;
	}
	public void setDayBalance(BigDecimal dayBalance) {
		this.dayBalance = dayBalance;
	}
	public String getCashFlag() {
		return cashFlag;
	}
	public void setCashFlag(String cashFlag) {
		this.cashFlag = cashFlag;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getMemo() {
		return memo;
	}
	public void setMemo(String memo) {
		this.memo = memo;
	}
	@JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
	public Date getCreateTime() {
		return createTime;
	}
	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}
	@JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
	public Date getUpdateTime() {
		return updateTime;
	}
	public void setUpdateTime(Date updateTime) {
		this.updateTime = updateTime;
	}
	
}
