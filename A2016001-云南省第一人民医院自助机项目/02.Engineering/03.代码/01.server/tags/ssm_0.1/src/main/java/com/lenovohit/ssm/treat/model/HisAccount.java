package com.lenovohit.ssm.treat.model;

import java.math.BigDecimal;

public class HisAccount {
	private String id;
	private String actNo;
	private String holder;
	private String holderName;
	private BigDecimal balance;
	private String openTime;
	private String state;
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getActNo() {
		return actNo;
	}
	public void setActNo(String actNo) {
		this.actNo = actNo;
	}
	public String getHolder() {
		return holder;
	}
	public void setHolder(String holder) {
		this.holder = holder;
	}
	public String getHolderName() {
		return holderName;
	}
	public void setHolderName(String holderName) {
		this.holderName = holderName;
	}
	public BigDecimal getBalance() {
		return balance;
	}
	public void setBalance(BigDecimal balance) {
		this.balance = balance;
	}
	public String getOpenTime() {
		return openTime;
	}
	public void setOpenTime(String openTime) {
		this.openTime = openTime;
	}
	public String getState() {
		return state;
	}
	public void setState(String state) {
		this.state = state;
	}
}
