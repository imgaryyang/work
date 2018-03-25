/*
 * Welcome to use the TableGo Tools.
 * 
 * http://vipbooks.iteye.com
 * http://blog.csdn.net/vipbooks
 * http://www.cnblogs.com/vipbooks
 * 
 * Author:bianj
 * Email:edinsker@163.com
 * Version:5.8.0
 */

package com.lenovohit.hwe.treat.model;

import java.math.BigDecimal;
import java.util.Date;

public class Trade implements java.io.Serializable {
	private String bizNo;
    private BigDecimal realAmt;
    private String bizType;
    private String tradeNo;
    private String payMerchantName;
    private BigDecimal amt;
    private String payChannleName;
    private String payerPhone;
    private String payerLogin;
    private String payerNo;
    private String payTypeName;
    private String payerAccount;
    private Date tradeTime;
    private String payMerchantNo;
    private String payTypeCode;
    private String payChannleCode;
    private String payerName;
    private String status;
    
    public String getBizNo() {
		return bizNo;
	}
	public void setBizNo(String bizNo) {
		this.bizNo = bizNo;
	}
	public BigDecimal getRealAmt() {
		return realAmt;
	}
	public void setRealAmt(BigDecimal realAmt) {
		this.realAmt = realAmt;
	}
	public String getBizType() {
		return bizType;
	}
	public void setBizType(String bizType) {
		this.bizType = bizType;
	}
	public String getTradeNo() {
		return tradeNo;
	}
	public void setTradeNo(String tradeNo) {
		this.tradeNo = tradeNo;
	}
	public String getPayMerchantName() {
		return payMerchantName;
	}
	public void setPayMerchantName(String payMerchantName) {
		this.payMerchantName = payMerchantName;
	}
	public BigDecimal getAmt() {
		return amt;
	}
	public void setAmt(BigDecimal amt) {
		this.amt = amt;
	}
	public String getPayChannleName() {
		return payChannleName;
	}
	public void setPayChannleName(String payChannleName) {
		this.payChannleName = payChannleName;
	}
	public String getPayerPhone() {
		return payerPhone;
	}
	public void setPayerPhone(String payerPhone) {
		this.payerPhone = payerPhone;
	}
	public String getPayerLogin() {
		return payerLogin;
	}
	public void setPayerLogin(String payerLogin) {
		this.payerLogin = payerLogin;
	}
	public String getPayerNo() {
		return payerNo;
	}
	public void setPayerNo(String payerNo) {
		this.payerNo = payerNo;
	}
	public String getPayTypeName() {
		return payTypeName;
	}
	public void setPayTypeName(String payTypeName) {
		this.payTypeName = payTypeName;
	}
	public String getPayerAccount() {
		return payerAccount;
	}
	public void setPayerAccount(String payerAccount) {
		this.payerAccount = payerAccount;
	}
	public Date getTradeTime() {
		return tradeTime;
	}
	public void setTradeTime(Date tradeTime) {
		this.tradeTime = tradeTime;
	}
	public String getPayMerchantNo() {
		return payMerchantNo;
	}
	public void setPayMerchantNo(String payMerchantNo) {
		this.payMerchantNo = payMerchantNo;
	}
	public String getPayTypeCode() {
		return payTypeCode;
	}
	public void setPayTypeCode(String payTypeCode) {
		this.payTypeCode = payTypeCode;
	}
	public String getPayChannleCode() {
		return payChannleCode;
	}
	public void setPayChannleCode(String payChannleCode) {
		this.payChannleCode = payChannleCode;
	}
	public String getPayerName() {
		return payerName;
	}
	public void setPayerName(String payerName) {
		this.payerName = payerName;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
}