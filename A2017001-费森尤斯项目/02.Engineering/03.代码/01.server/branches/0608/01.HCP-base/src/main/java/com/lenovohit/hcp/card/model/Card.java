package com.lenovohit.hcp.card.model;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.Table;

import com.lenovohit.hcp.base.model.HcpBaseModel;

@Entity
@Table(name = "CARD_MASTER_INFO") //就诊卡信息'
public class Card extends HcpBaseModel {

	private static final long serialVersionUID = -7692302756410456697L;

	private String patientId;//病人ID
	private String name;// '姓名',
	private String cardNo;//卡号
	private String cardFlag;//卡状态
	private String cardType;//卡类型
	private String comm;//备注

	public String getPatientId() {
		return patientId;
	}

	public void setPatientId(String patientId) {
		this.patientId = patientId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getCardNo() {
		return cardNo;
	}

	public void setCardNo(String cardNo) {
		this.cardNo = cardNo;
	}

	public String getCardFlag() {
		return cardFlag;
	}

	public void setCardFlag(String cardFlag) {
		this.cardFlag = cardFlag;
	}

	public String getCardType() {
		return cardType;
	}

	public void setCardType(String cardType) {
		this.cardType = cardType;
	}

	public String getComm() {
		return comm;
	}

	public void setComm(String comm) {
		this.comm = comm;
	}

}