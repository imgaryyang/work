package com.lenovohit.hcp.finance.model;

import java.math.BigDecimal;

public class PayWayStatisticsDto {
	private String person;
	private BigDecimal cash;			//现金
	private BigDecimal cheque;			//支票
	private BigDecimal creditCard;		//信用卡
	private BigDecimal debitCard;		//借记卡
	private BigDecimal draft;			// 汇票
	private BigDecimal insureAccount;	//保险账户
	private BigDecimal hospitalAccount;	//院内账户
	private BigDecimal aliPay;			//支付宝
	private BigDecimal wxPay;			//微信
	private BigDecimal all;
	public BigDecimal getCash() {
		return cash;
	}

	public void setCash(BigDecimal cash) {
		this.cash = cash;
	}

	public BigDecimal getCheque() {
		return cheque;
	}

	public void setCheque(BigDecimal cheque) {
		this.cheque = cheque;
	}

	public BigDecimal getCreditCard() {
		return creditCard;
	}

	public void setCreditCard(BigDecimal creditCard) {
		this.creditCard = creditCard;
	}

	public BigDecimal getDebitCard() {
		return debitCard;
	}

	public void setDebitCard(BigDecimal debitCard) {
		this.debitCard = debitCard;
	}

	public BigDecimal getDraft() {
		return draft;
	}

	public void setDraft(BigDecimal draft) {
		this.draft = draft;
	}

	public BigDecimal getInsureAccount() {
		return insureAccount;
	}

	public void setInsureAccount(BigDecimal insureAccount) {
		this.insureAccount = insureAccount;
	}

	public BigDecimal getHospitalAccount() {
		return hospitalAccount;
	}

	public void setHospitalAccount(BigDecimal hospitalAccount) {
		this.hospitalAccount = hospitalAccount;
	}

	public BigDecimal getAliPay() {
		return aliPay;
	}

	public void setAliPay(BigDecimal aliPay) {
		this.aliPay = aliPay;
	}

	public BigDecimal getWxPay() {
		return wxPay;
	}

	public void setWxPay(BigDecimal wxPay) {
		this.wxPay = wxPay;
	}

	public String getPerson() {
		return person;
	}

	public void setPerson(String person) {
		this.person = person;
	}

	public BigDecimal getAll() {
		return all;
	}

	public void setAll(BigDecimal all) {
		this.all = all;
	}
}
