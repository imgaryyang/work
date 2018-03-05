package com.infohold.el.base.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.infohold.core.model.BaseIdModel;

@Entity
@Table(name = "EL_BANK_CARDS")
public class BankCards extends BaseIdModel {
	private static final long serialVersionUID = -540556816727695150L;
	
	private String typeId; 		// 卡种ID
	private CardType cardType;	// 卡种
	private String personId; 	// 人员ID
	private String cardNo; 		// 银行卡号
	private String cardHolder; 	// 持卡人姓名
	private String bankOrgId; 	// 银行机构ID
	private String bankNo; 		// 银行行号
	private String bankName; 	// 银行行名
	private String bankCardType; // 银行卡类型 1、储蓄卡 2、信用卡 3、借记卡 4、贷记卡 5、准贷记卡 6、港币贷记卡
	private String bankCardTypeName;//银行卡类型名称
	private Double balance; 	// 余额 记录上一次余额，查询到最新余额后更新刷新数据
	private String orgId; 		// 联合发卡机构ID
	private String orgName; 	// 联合发卡机构名称
	private String idCardNo; 	// 身份证号
	private String bindedAt; 	// 绑卡时间
	private String unbindedAt; 	// 解绑时间
	private String state; 		// 状态 1 - 正常	2 - 已解绑
	private String mobile; 		//银行预留手机号

	@Column(name = "TYPE_ID")
	public String getTypeId() {
		return typeId;
	}

	public void setTypeId(String typeId) {
		this.typeId = typeId;
	}

	@Transient
	public CardType getCardType() {
		return this.cardType;
	}

	public void setCardType(CardType cardType) {
		this.cardType = cardType;
	}

	@Column(name = "PERSON_ID", length = 32)
	public String getPersonId() {
		return this.personId;
	}

	public void setPersonId(String personId) {
		this.personId = personId;
	}

	@Column(name = "CARD_NO", length = 32)
	public String getCardNo() {
		return this.cardNo;
	}

	public void setCardNo(String cardNo) {
		this.cardNo = cardNo;
	}

	@Column(name = "CARDHOLDER", length = 50)
	public String getCardHolder() {
		return this.cardHolder;
	}

	public void setCardHolder(String cardHolder) {
		this.cardHolder = cardHolder;
	}

	@Column(name = "BANK_ORG_ID", length = 32)
	public String getBankOrgId() {
		return this.bankOrgId;
	}

	public void setBankOrgId(String bankOrgId) {
		this.bankOrgId = bankOrgId;
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

	@Column(name = "BANK_CARD_TYPE", length = 1)
	public String getBankCardType() {
		return this.bankCardType;
	}

	public void setBankCardType(String bankCardType) {
		this.bankCardType = bankCardType;
	}

	@Transient
	public String getBankCardTypeName() {
		CardBin cardBin = new CardBin();
		bankCardTypeName = cardBin.getCardTypeNameByCardType(bankCardType);
		return bankCardTypeName;
	}

	public void setBankCardTypeName(String bankCardTypeName) {
		this.bankCardTypeName = bankCardTypeName;
	}	

	@Column(name = "BALANCE", precision = 17)
	public Double getBalance() {
		return this.balance;
	}

	public void setBalance(Double balance) {
		this.balance = balance;
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

	@Column(name = "ID_CARD_NO", length = 18)
	public String getIdCardNo() {
		return this.idCardNo;
	}

	public void setIdCardNo(String idCardNo) {
		this.idCardNo = idCardNo;
	}

	@Column(name = "BINDED_AT", length = 19)
	public String getBindedAt() {
		return this.bindedAt;
	}

	public void setBindedAt(String bindedAt) {
		this.bindedAt = bindedAt;
	}

	@Column(name = "UNBINDED_AT", length = 19)
	public String getUnbindedAt() {
		return this.unbindedAt;
	}

	public void setUnbindedAt(String unbindedAt) {
		this.unbindedAt = unbindedAt;
	}

	@Column(name = "STATE", length = 1)
	public String getState() {
		return this.state;
	}

	public void setState(String state) {
		this.state = state;
	}

	@Transient
	public String getMobile() {
		return mobile;
	}

	public void setMobile(String mobile) {
		this.mobile = mobile;
	}

}