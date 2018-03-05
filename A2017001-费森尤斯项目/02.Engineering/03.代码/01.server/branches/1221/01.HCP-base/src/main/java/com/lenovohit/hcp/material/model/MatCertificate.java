package com.lenovohit.hcp.material.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import com.lenovohit.hcp.base.annotation.RedisSequence;
import com.lenovohit.hcp.base.model.HcpBaseModel;

/**
 * 物资 - 物资证书
 * @author victor
 *
 */
@Entity
@Table(name = "MATERIAL_CERTIFICATE")
public class MatCertificate extends HcpBaseModel {
	private static final long serialVersionUID = -1L;

	private String regId;
	private String regNo;
	private String regName;
	private String regNameSpell;
	private String regNameWb;
	private String regType;
	private String stopFlag;
	private String tradeName;
	private String producer;
	private String producerName;
	private Date regStartDate;
	private Date regStopDate;
	private String comm;

	@RedisSequence
	public String getRegId() {
		return regId;
	}

	public void setRegId(String regId) {
		this.regId = regId;
	}

	public String getRegNo() {
		return regNo;
	}

	public void setRegNo(String regNo) {
		this.regNo = regNo;
	}

	public String getRegName() {
		return regName;
	}

	public void setRegName(String regName) {
		this.regName = regName;
	}

	public String getRegNameSpell() {
		return regNameSpell;
	}

	public void setRegNameSpell(String regNameSpell) {
		this.regNameSpell = regNameSpell;
	}

	public String getRegNameWb() {
		return regNameWb;
	}

	public void setRegNameWb(String regNameWb) {
		this.regNameWb = regNameWb;
	}

	public String getRegType() {
		return regType;
	}

	public void setRegType(String regType) {
		this.regType = regType;
	}

	public String getStopFlag() {
		return stopFlag;
	}

	public void setStopFlag(String stopFlag) {
		this.stopFlag = stopFlag;
	}

	public String getTradeName() {
		return tradeName;
	}

	public void setTradeName(String tradeName) {
		this.tradeName = tradeName;
	}
	
	/* @JoinColumn(name = "PRODUCER", nullable = true)
	@NotFound(action=NotFoundAction.IGNORE)
	@ManyToOne
	public MatCompanyInfo getProducer() {
		return producer;
	}

	public void setProducer(MatCompanyInfo producer) {
		this.producer = producer;
	}*/
	
	public String getProducer() {
		return producer;
	}

	public void setProducer(String producer) {
		this.producer = producer;
	}

	public String getProducerName() {
		return producerName;
	}

	public void setProducerName(String producerName) {
		this.producerName = producerName;
	}

	@Column(name = "REG_STARTDATE")
	public Date getRegStartDate() {
		return regStartDate;
	}

	public void setRegStartDate(Date regStartDate) {
		this.regStartDate = regStartDate;
	}

	@Column(name = "REG_STOPDATE")
	public Date getRegStopDate() {
		return regStopDate;
	}

	public void setRegStopDate(Date regStopDate) {
		this.regStopDate = regStopDate;
	}

	public String getComm() {
		return comm;
	}

	public void setComm(String comm) {
		this.comm = comm;
	}

}
