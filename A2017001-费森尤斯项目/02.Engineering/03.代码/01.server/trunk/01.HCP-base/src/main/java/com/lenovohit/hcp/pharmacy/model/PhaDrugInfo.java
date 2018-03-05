package com.lenovohit.hcp.pharmacy.model;

import java.math.BigDecimal;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

import com.lenovohit.hcp.base.annotation.RedisSequence;
import com.lenovohit.hcp.base.model.Company;
import com.lenovohit.hcp.base.model.HcpBaseModel;

@Entity 
@Table(name = "PHA_DRUGINFO")	// 药房药库 - 药品信息表
public class PhaDrugInfo extends HcpBaseModel {

	/**
	 * @Author xlbd
	 */
	private static final long serialVersionUID = 1L;

	private String drugCode;			// 药品编码
	private String centerCode;			// 中心药品编码
	private String barcode;				// 药品条码
	private String approvedId;			// 国标准字
	private String commonName;			// 通用名称
	private String tradeName;			// 商品名称
	private String commonSpell;			// 通用拼音
	private String tradeSpell;			// 商品拼音
	private String commonWb;			// 通用五笔
	private String tradeWb;				// 商品五笔
	private String userCode;			// 自定义码
	private BigDecimal baseDose;		// 基本剂量
	private String doseUnit;			// 剂量单位
	private Integer packQty;			// 包装数量
	private String miniUnit;			// 最小单位
	private String packUnit;			// 包装单位
	private String drugSpecs;			// 药品规格
	private String drugType;			// 药品分类
	private String dosage;				// 剂型编码
	private String producer;			// 生产厂家
	private Boolean isskin;				// 需要皮试
	private Boolean isrecipe;			// 处方药
	private String priceCase;			// 加价方案
	private BigDecimal buyPrice;		// 进价
	private BigDecimal wholePrice;		// 批发价
	
	private BigDecimal salePrice;		// 售价
	private BigDecimal taxBuyPrice;     // 含税进价
	private BigDecimal taxSalePrice;    // 含税售价
	private String drugQuality;			// 药品性质
	private String priceCode;			// 物价编码
	private String usage;				// 用法编码
	private String freqCode;			// 频次编码
	private String antCode;				// 抗菌药编码
	private Boolean stopFlag;			// 停用标志
	private Company companyInfo;
	
	@RedisSequence
	public String getDrugCode() {
		return drugCode;
	}
	public void setDrugCode(String drugCode) {
		this.drugCode = drugCode;
	}
	public String getCenterCode() {
		return centerCode;
	}
	public void setCenterCode(String centerCode) {
		this.centerCode = centerCode;
	}
	public String getBarcode() {
		return barcode;
	}
	public void setBarcode(String barcode) {
		this.barcode = barcode;
	}
	public String getApprovedId() {
		return approvedId;
	}
	public void setApprovedId(String approvedId) {
		this.approvedId = approvedId;
	}
	public String getCommonName() {
		return commonName;
	}
	public void setCommonName(String commonName) {
		this.commonName = commonName;
	}
	public BigDecimal getWholePrice() {
		return wholePrice;
	}
	public void setWholePrice(BigDecimal wholePrice) {
		this.wholePrice = wholePrice;
	}
	public String getTradeName() {
		return tradeName;
	}
	public void setTradeName(String tradeName) {
		this.tradeName = tradeName;
	}
	public String getCommonSpell() {
		return commonSpell;
	}
	public void setCommonSpell(String commonSpell) {
		this.commonSpell = commonSpell;
	}
	public String getTradeSpell() {
		return tradeSpell;
	}
	public void setTradeSpell(String tradeSpell) {
		this.tradeSpell = tradeSpell;
	}
	public String getCommonWb() {
		return commonWb;
	}
	public void setCommonWb(String commonWb) {
		this.commonWb = commonWb;
	}
	public String getTradeWb() {
		return tradeWb;
	}
	public void setTradeWb(String tradeWb) {
		this.tradeWb = tradeWb;
	}
	public String getUserCode() {
		return userCode;
	}
	public void setUserCode(String userCode) {
		this.userCode = userCode;
	}
	public BigDecimal getBaseDose() {
		return baseDose;
	}
	public void setBaseDose(BigDecimal baseDose) {
		this.baseDose = baseDose;
	}
	public String getDoseUnit() {
		return doseUnit;
	}
	public void setDoseUnit(String doseUnit) {
		this.doseUnit = doseUnit;
	}
	public Integer getPackQty() {
		return packQty;
	}
	public void setPackQty(Integer packQty) {
		this.packQty = packQty;
	}
	public String getMiniUnit() {
		return miniUnit;
	}
	public void setMiniUnit(String miniUnit) {
		this.miniUnit = miniUnit;
	}
	public String getPackUnit() {
		return packUnit;
	}
	public void setPackUnit(String packUnit) {
		this.packUnit = packUnit;
	}
	public String getDrugSpecs() {
		return drugSpecs;
	}
	public void setDrugSpecs(String drugSpecs) {
		this.drugSpecs = drugSpecs;
	}
	public String getDrugType() {
		return drugType;
	}
	public void setDrugType(String drugType) {
		this.drugType = drugType;
	}
	public String getDosage() {
		return dosage;
	}
	public void setDosage(String dosage) {
		this.dosage = dosage;
	}
//	public String getProducer() {
//		return producer;
//	}
//	public void setProducer(String producer) {
//		this.producer = producer;
//	}
	@ManyToOne//(cascade=(CascadeType.REFRESH)) 要把companyInfo.id传回来，就不会报级联相关错误
	@JoinColumn(name = "PRODUCER", nullable = true)
	@NotFound(action=NotFoundAction.IGNORE)
	public Company getCompanyInfo() {
		return companyInfo;
	}
	public void setCompanyInfo(Company companyInfo) {
		this.companyInfo = companyInfo;
	}
	public Boolean getIsskin() {
		return isskin;
	}
	public void setIsskin(Boolean isskin) {
		this.isskin = isskin;
	}
	public Boolean getIsrecipe() {
		return isrecipe;
	}
	public void setIsrecipe(Boolean isrecipe) {
		this.isrecipe = isrecipe;
	}
	public String getPriceCase() {
		return priceCase;
	}
	public void setPriceCase(String priceCase) {
		this.priceCase = priceCase;
	}
	public BigDecimal getBuyPrice() {
		return buyPrice;
	}
	public void setBuyPrice(BigDecimal buyPrice) {
		this.buyPrice = buyPrice;
	}
	public BigDecimal getSalePrice() {
		return salePrice;
	}
	public void setSalePrice(BigDecimal salePrice) {
		this.salePrice = salePrice;
	}
	public String getDrugQuality() {
		return drugQuality;
	}
	public void setDrugQuality(String drugQuality) {
		this.drugQuality = drugQuality;
	}
	public String getPriceCode() {
		return priceCode;
	}
	public void setPriceCode(String priceCode) {
		this.priceCode = priceCode;
	}
	@Column(name = "USAGE_")
	public String getUsage() {
		return usage;
	}
	public void setUsage(String usage) {
		this.usage = usage;
	}
	public String getFreqCode() {
		return freqCode;
	}
	public void setFreqCode(String freqCode) {
		this.freqCode = freqCode;
	}
	public String getAntCode() {
		return antCode;
	}
	public void setAntCode(String antCode) {
		this.antCode = antCode;
	}
	public Boolean getStopFlag() {
		return stopFlag;
	}
	public void setStopFlag(Boolean stopFlag) {
		this.stopFlag = stopFlag;
	}
	@Transient
	public String getProducer() {
		return producer;
	}
	public void setProducer(String producer) {
		this.producer = producer;
	}
	public BigDecimal getTaxBuyPrice() {
		return taxBuyPrice;
	}
	public void setTaxBuyPrice(BigDecimal taxBuyPrice) {
		this.taxBuyPrice = taxBuyPrice;
	}
	public BigDecimal getTaxSalePrice() {
		return taxSalePrice;
	}
	public void setTaxSalePrice(BigDecimal taxSalePrice) {
		this.taxSalePrice = taxSalePrice;
	}
	
	
}
