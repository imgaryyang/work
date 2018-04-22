package com.lenovohit.ssm.app.elh.base.model;

import javax.persistence.Entity;
import javax.persistence.Table;

import com.lenovohit.core.model.BaseIdModel;

/**
 * 
 * 支持的卡种类
 */
@Entity
@Table(name="ELH_SUPP_CARD_TYPE")
public class SupportCard extends BaseIdModel {
	private static final long serialVersionUID = -6796849509853964811L;
	   
	private String hospId;         //医院ID	
	private String cardTypeId;     //卡种ID	
	private String cardTypeName;   //卡种名称
	
	public String getHospId() {
		return hospId;
	}
	public void setHospId(String hospId) {
		this.hospId = hospId;
	}
	public String getCardTypeId() {
		return cardTypeId;
	}
	public void setCardTypeId(String cardTypeId) {
		this.cardTypeId = cardTypeId;
	}
	public String getCardTypeName() {
		return cardTypeName;
	}
	public void setCardTypeName(String cardTypeName) {
		this.cardTypeName = cardTypeName;
	}
	
	
}
