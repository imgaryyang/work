package com.lenovohit.hcp.base.model;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * 医保基本信息
 * 
 * @author gw
 *
 */
@Entity
@Table(name = "MEDICALITEM_INFO")
public class MedicalItemInfo extends HcpBaseModel {
	private static final long serialVersionUID = 4283517513276644357L;

	private String itemId;
	private String itemCode;
	private String commonName;
	private String commonSpell;
	private String commonWb;
	private String itemSpecs;
	private String itemType;
	private String dosage;
	private String selfPayRatio;
	private String producer;
	private String comm;
	private String maternityInsuranceIspay;
	private String packUnit;
	private String packPrice;
	private String packPayPrice;
	private String splitRatio;
	private String miniUnit;
	private String miniPrice;
	private String miniPayPrice;
	private String invoiceType;
	private String medicalInsuranceIspay;
	private String stopFlag;

	public String getItemId() {
		return itemId;
	}

	public void setItemId(String itemId) {
		this.itemId = itemId;
	}

	public String getItemCode() {
		return itemCode;
	}

	public void setItemCode(String itemCode) {
		this.itemCode = itemCode;
	}

	public String getCommonName() {
		return commonName;
	}

	public void setCommonName(String commonName) {
		this.commonName = commonName;
	}

	public String getCommonSpell() {
		return commonSpell;
	}

	public void setCommonSpell(String commonSpell) {
		this.commonSpell = commonSpell;
	}

	public String getCommonWb() {
		return commonWb;
	}

	public void setCommonWb(String commonWb) {
		this.commonWb = commonWb;
	}

	public String getItemSpecs() {
		return itemSpecs;
	}

	public void setItemSpecs(String itemSpecs) {
		this.itemSpecs = itemSpecs;
	}

	public String getItemType() {
		return itemType;
	}

	public void setItemType(String itemType) {
		this.itemType = itemType;
	}

	public String getDosage() {
		return dosage;
	}

	public void setDosage(String dosage) {
		this.dosage = dosage;
	}

	public String getSelfPayRatio() {
		return selfPayRatio;
	}

	public void setSelfPayRatio(String selfPayRatio) {
		this.selfPayRatio = selfPayRatio;
	}

	public String getProducer() {
		return producer;
	}

	public void setProducer(String producer) {
		this.producer = producer;
	}

	public String getComm() {
		return comm;
	}

	public void setComm(String comm) {
		this.comm = comm;
	}

	public String getMaternityInsuranceIspay() {
		return maternityInsuranceIspay;
	}

	public void setMaternityInsuranceIspay(String maternityInsuranceIspay) {
		this.maternityInsuranceIspay = maternityInsuranceIspay;
	}

	public String getPackUnit() {
		return packUnit;
	}

	public void setPackUnit(String packUnit) {
		this.packUnit = packUnit;
	}

	public String getPackPrice() {
		return packPrice;
	}

	public void setPackPrice(String packPrice) {
		this.packPrice = packPrice;
	}

	public String getPackPayPrice() {
		return packPayPrice;
	}

	public void setPackPayPrice(String packPayPrice) {
		this.packPayPrice = packPayPrice;
	}

	public String getSplitRatio() {
		return splitRatio;
	}

	public void setSplitRatio(String splitRatio) {
		this.splitRatio = splitRatio;
	}

	public String getMiniUnit() {
		return miniUnit;
	}

	public void setMiniUnit(String miniUnit) {
		this.miniUnit = miniUnit;
	}

	public String getMiniPrice() {
		return miniPrice;
	}

	public void setMiniPrice(String miniPrice) {
		this.miniPrice = miniPrice;
	}

	public String getMiniPayPrice() {
		return miniPayPrice;
	}

	public void setMiniPayPrice(String miniPayPrice) {
		this.miniPayPrice = miniPayPrice;
	}

	public String getInvoiceType() {
		return invoiceType;
	}

	public void setInvoiceType(String invoiceType) {
		this.invoiceType = invoiceType;
	}

	public String getMedicalInsuranceIspay() {
		return medicalInsuranceIspay;
	}

	public void setMedicalInsuranceIspay(String medicalInsuranceIspay) {
		this.medicalInsuranceIspay = medicalInsuranceIspay;
	}

	public String getStopFlag() {
		return stopFlag;
	}

	public void setStopFlag(String stopFlag) {
		this.stopFlag = stopFlag;
	}

}
