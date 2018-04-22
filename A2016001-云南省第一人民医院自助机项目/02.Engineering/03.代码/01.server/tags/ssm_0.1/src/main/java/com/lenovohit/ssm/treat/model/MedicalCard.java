package com.lenovohit.ssm.treat.model;
/**
 * 就诊卡
 * @author xiaweiyi
 *
 */
public class MedicalCard {
	private String id;
	private String cardNo;
	private String createDate;
	private String holderId;
	private String holderName;
	private String holderIdNo;
	private String balance;
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getCardNo() {
		return cardNo;
	}
	public void setCardNo(String cardNo) {
		this.cardNo = cardNo;
	}
	public String getCreateDate() {
		return createDate;
	}
	public void setCreateDate(String createDate) {
		this.createDate = createDate;
	}
	public String getHolderId() {
		return holderId;
	}
	public void setHolderId(String holderId) {
		this.holderId = holderId;
	}
	public String getHolderName() {
		return holderName;
	}
	public void setHolderName(String holderName) {
		this.holderName = holderName;
	}
	public String getHolderIdNo() {
		return holderIdNo;
	}
	public void setHolderIdNo(String holderIdNo) {
		this.holderIdNo = holderIdNo;
	}
	public String getBalance() {
		return balance;
	}
	public void setBalance(String balance) {
		this.balance = balance;
	}
	
}

