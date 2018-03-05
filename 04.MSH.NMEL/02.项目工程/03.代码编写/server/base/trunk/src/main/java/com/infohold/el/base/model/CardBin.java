package com.infohold.el.base.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.infohold.bdrp.org.model.Org;
import com.infohold.core.model.BaseIdModel;
import com.infohold.core.utils.StringUtils;

@Entity
@Table(name = "EL_CARD_BIN")
public class CardBin extends BaseIdModel {
	private static final long serialVersionUID = -5893161309824662228L;
	
	private String cardBin;// 卡BIN
	private String bankCardType;// 银行卡类型 1、储蓄卡 2、信用卡 3、借记卡 4、贷记卡 5、准贷记卡 6、港币贷记卡
	private String bankCardTypeName;
	private String bankNo;// 银行代码
	private String bankName;// 银行名称
	private String orgId;// 联合发卡机构ID
	private String orgName;// 联合发卡机构名
	private String cardTypeId;// 卡种ID
	private String cardTypeName;// 卡种名称
	private int cardNum;//卡长度
	private String cardMemo;//卡名称
	
	private Org org;

	@Column(name = "CARD_BIN", length = 6)
	public String getCardBin() {
		return this.cardBin;
	}

	public void setCardBin(String cardBin) {
		this.cardBin = cardBin;
	}

	@Column(name = "BANK_CARD_TYPE", length = 1)
	public String getBankCardType() {
		return this.bankCardType;
	}

	public void setBankCardType(String bankCardType) {
		this.bankCardType = bankCardType;
	}

	@Transient
	public String getBankCardTypeName() {
		bankCardTypeName = getCardTypeNameByCardType(bankCardType);
		return bankCardTypeName;
	}

	public void setBankCardTypeName(String bankCardTypeName) {
		this.bankCardTypeName = bankCardTypeName;
	}	
	
	@Column(name = "BANK_NO", length = 30)
	public String getBankNo() {
		return this.bankNo;
	}

	public void setBankNo(String bankNo) {
		this.bankNo = bankNo;
	}

	@Column(name = "BANK_NAME", length = 100)
	public String getBankName() {
		return this.bankName;
	}

	public void setBankName(String bankName) {
		this.bankName = bankName;
	}

	@Column(name = "ORG_ID", length = 32)
	public String getOrgId() {
		return this.orgId;
	}

	public void setOrgId(String orgId) {
		this.orgId = orgId;
	}

	@Column(name = "ORG_NAME", length = 100)
	public String getOrgName() {
		return this.orgName;
	}

	public void setOrgName(String orgName) {
		this.orgName = orgName;
	}

	@Column(name = "CARD_TYPE_ID", length = 32)
	public String getCardTypeId() {
		return this.cardTypeId;
	}

	public void setCardTypeId(String cardTypeId) {
		this.cardTypeId = cardTypeId;
	}

	@Column(name = "CARD_TYPE_NAME", length = 100)
	public String getCardTypeName() {
		return this.cardTypeName;
	}

	public void setCardTypeName(String cardTypeName) {
		this.cardTypeName = cardTypeName;
	}

	@Column(name = "CARD_NUM")
	public int getCardNum() {
		return cardNum;
	}

	public void setCardNum(int cardNum) {
		this.cardNum = cardNum;
	}

	@Column(name = "CARD_MEMO")
	public String getCardMemo() {
		return cardMemo;
	}

	public void setCardMemo(String cardMemo) {
		this.cardMemo = cardMemo;
	}

	@Transient
	public Org getOrg() {
		return org;
	}

	public void setOrg(Org org) {
		this.org = org;
	}

	public String getCardTypeNameByCardType(String cardType) {
		String cardTypeName = "";
		if(StringUtils.isBlank(cardType)){
			cardType = "";
		}
		
		switch(cardType){
			case "1":
			  cardTypeName = "储蓄卡";
			  break;
			case "2":
			  cardTypeName = "信用卡";
			  break;
			case "3":
			  cardTypeName = "借记卡";
			  break;
			case "4":
			  cardTypeName = "贷记卡";
			  break;
			case "5":
			  cardTypeName = "准贷记卡";
			  break;
			case "6":
			  cardTypeName = "港币贷记卡";
			  break;
			default:
			  cardTypeName = "其他卡";
			  break;
		}
      	return cardTypeName;
	}
}