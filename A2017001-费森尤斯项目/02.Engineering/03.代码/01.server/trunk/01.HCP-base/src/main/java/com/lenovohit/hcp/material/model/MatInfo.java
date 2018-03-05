package com.lenovohit.hcp.material.model;

import java.math.BigDecimal;

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
@Table(name = "MATERIAL_INFO") // 物资信息表
public class MatInfo extends HcpBaseModel {

	/**
	 * @Author xlbd
	 */
	private static final long serialVersionUID = 1L;

	private String materialCode;
	private String materialType;
	private String userCode; // 自定义编码
	private String centerCode; // 中心编码
	private String barcode; // 条码
	private String commonName; // 物资名称
	private String commonSpell; // 名称拼音码
	private String commonWb; // 名称五笔码
	private String alias; // 别名
	private String aliasSpell; // 别名拼音码
	private String aliasWb; // 别名五笔码
	private String feeFlag; // 收费对应标志
	private String itemCode; // 收费项
	private String itemName; // 收费项名称
	private String materialSpecs; // 规格
	private String materialUnit; // 单位
	private String maxUnit; // 最大包装单位
	private BigDecimal materialQuantity; // 包装数量
	private String producer; // 暂存 - 厂商id
	private Company companyInfo; // 生产厂商
	private BigDecimal buyPrice; // 采购价
	private BigDecimal wholePrice; // 批发价
	private BigDecimal salePrice; // 零售价
	private BigDecimal taxBuyPrice; // 含税采购价
	private BigDecimal taxSalePrice; // 含税售价
	//private MatCertificate certificate; // 证书
	private String registerId;
	private String registerCode; // 注册证代码
	private String registerName;
	private String countryCode; // 国家码 ?
	private String priceCode; // ?
	private String stopFlag; // 停用标志
	private String disposable; // 是否一次性物资
	private String implant; // 是否植入物

	@RedisSequence
	public String getMaterialCode() {
		return materialCode;
	}

	public void setMaterialCode(String materialCode) {
		this.materialCode = materialCode;
	}

	public String getItemCode() {
		return itemCode;
	}

	public void setItemCode(String itemCode) {
		this.itemCode = itemCode;
	}

	public String getMaterialUnit() {
		return materialUnit;
	}

	public void setMaterialUnit(String materialUnit) {
		this.materialUnit = materialUnit;
	}

	public String getMaterialSpecs() {
		return materialSpecs;
	}

	public void setMaterialSpecs(String materialSpecs) {
		this.materialSpecs = materialSpecs;
	}

	public String getMaterialType() {
		return materialType;
	}

	public void setMaterialType(String materialType) {
		this.materialType = materialType;
	}

	public String getCountryCode() {
		return countryCode;
	}

	public void setCountryCode(String countryCode) {
		this.countryCode = countryCode;
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

	public String getUserCode() {
		return userCode;
	}

	public void setUserCode(String userCode) {
		this.userCode = userCode;
	}

	@ManyToOne
	@JoinColumn(name = "PRODUCER", nullable = true)
	@NotFound(action = NotFoundAction.IGNORE)
	public Company getCompanyInfo() {
		return companyInfo;
	}

	public void setCompanyInfo(Company companyInfo) {
		this.companyInfo = companyInfo;
	}

	public BigDecimal getBuyPrice() {
		return buyPrice;
	}

	public void setBuyPrice(BigDecimal buyPrice) {
		this.buyPrice = buyPrice;
	}

	public BigDecimal getWholePrice() {
		return wholePrice;
	}

	public void setWholePrice(BigDecimal wholePrice) {
		this.wholePrice = wholePrice;
	}

	public BigDecimal getSalePrice() {
		return salePrice;
	}

	public void setSalePrice(BigDecimal salePrice) {
		this.salePrice = salePrice;
	}

	public String getPriceCode() {
		return priceCode;
	}

	public void setPriceCode(String priceCode) {
		this.priceCode = priceCode;
	}

	public String getStopFlag() {
		return stopFlag;
	}

	public void setStopFlag(String stopFlag) {
		this.stopFlag = stopFlag;
	}

	@Transient
	public String getProducer() {
		return producer;
	}

	public void setProducer(String producer) {
		this.producer = producer;
	}

	public String getAlias() {
		return alias;
	}

	public void setAlias(String alias) {
		this.alias = alias;
	}

	public String getAliasSpell() {
		return aliasSpell;
	}

	public void setAliasSpell(String aliasSpell) {
		this.aliasSpell = aliasSpell;
	}

	public String getAliasWb() {
		return aliasWb;
	}

	public void setAliasWb(String aliasWb) {
		this.aliasWb = aliasWb;
	}

	public String getFeeFlag() {
		return feeFlag;
	}

	public void setFeeFlag(String feeFlag) {
		this.feeFlag = feeFlag;
	}

	public String getItemName() {
		return itemName;
	}

	public void setItemName(String itemName) {
		this.itemName = itemName;
	}

	public String getMaxUnit() {
		return maxUnit;
	}

	public void setMaxUnit(String maxUnit) {
		this.maxUnit = maxUnit;
	}

	public BigDecimal getMaterialQuantity() {
		return materialQuantity;
	}

	public void setMaterialQuantity(BigDecimal materialQuantity) {
		this.materialQuantity = materialQuantity;
	}

	/*@ManyToOne
	@JoinColumn(name = "REGISTER_ID", nullable = true)
	@NotFound(action = NotFoundAction.IGNORE)
	public MatCertificate getCertificate() {
		return certificate;
	}

	public void setCertificate(MatCertificate certificate) {
		this.certificate = certificate;
	}*/

	public String getDisposable() {
		return disposable;
	}

	public void setDisposable(String disposable) {
		this.disposable = disposable;
	}

	public String getImplant() {
		return implant;
	}

	public void setImplant(String implant) {
		this.implant = implant;
	}

	public String getRegisterCode() {
		return registerCode;
	}

	public void setRegisterCode(String registerCode) {
		this.registerCode = registerCode;
	}

	public String getRegisterId() {
		return registerId;
	}

	public void setRegisterId(String registerId) {
		this.registerId = registerId;
	}

	public String getRegisterName() {
		return registerName;
	}

	public void setRegisterName(String registerName) {
		this.registerName = registerName;
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
