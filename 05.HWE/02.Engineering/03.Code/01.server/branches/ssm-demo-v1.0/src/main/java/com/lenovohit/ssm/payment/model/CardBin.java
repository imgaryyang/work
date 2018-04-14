package com.lenovohit.ssm.payment.model;

import javax.persistence.Entity;
import javax.persistence.Table;

import com.lenovohit.core.model.BaseIdModel;


@Entity
@Table(name="SSM_CARD_BIN")
public class CardBin extends BaseIdModel{
	private static final long serialVersionUID = -7003365712988553134L;
	private String cardBin;			//卡bin
	private int cardBinNum;		//卡bin长度
	private String cardName;		//卡名
	private int cardNum;			//卡长度
	private String cardType;		//卡类型
	private String bankCode;		//银行行号
	private String bankName;		//银行名
	private String cleanBankCode;	//清算行行号
	private String cleanBankName;	//清算行名
	private String privince;		//省份
	private String city;			//城市
	private String cityCode;		//城市编码
	
	public String getCardBin() {
		return cardBin;
	}
	public void setCardBin(String cardBin) {
		this.cardBin = cardBin;
	}
	public int getCardBinNum() {
		return cardBinNum;
	}
	public void setCardBinNum(int cardBinNum) {
		this.cardBinNum = cardBinNum;
	}
	public String getCardName() {
		return cardName;
	}
	public void setCardName(String cardName) {
		this.cardName = cardName;
	}
	public int getCardNum() {
		return cardNum;
	}
	public void setCardNum(int cardNum) {
		this.cardNum = cardNum;
	}
	public String getCardType() {
		return cardType;
	}
	public void setCardType(String cardType) {
		this.cardType = cardType;
	}
	public String getBankCode() {
		return bankCode;
	}
	public void setBankCode(String bankCode) {
		this.bankCode = bankCode;
	}
	public String getBankName() {
		return bankName;
	}
	public void setBankName(String bankName) {
		this.bankName = bankName;
	}
	public String getCleanBankCode() {
		return cleanBankCode;
	}
	public void setCleanBankCode(String cleanBankCode) {
		this.cleanBankCode = cleanBankCode;
	}
	public String getCleanBankName() {
		return cleanBankName;
	}
	public void setCleanBankName(String cleanBankName) {
		this.cleanBankName = cleanBankName;
	}
	public String getPrivince() {
		return privince;
	}
	public void setPrivince(String privince) {
		this.privince = privince;
	}
	public String getCity() {
		return city;
	}
	public void setCity(String city) {
		this.city = city;
	}
	public String getCityCode() {
		return cityCode;
	}
	public void setCityCode(String cityCode) {
		this.cityCode = cityCode;
	}
	
}
