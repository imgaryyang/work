package com.lenovohit.hcp.hrp.model;

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
@Table(name = "INSTRM_INFO") // 固定资产信息表
public class InstrmInfo extends HcpBaseModel {

	/**
	 * @Author xlbd
	 */
	private static final long serialVersionUID = 1L;

	private String instrmCode; // 固定资产编码
	private String userCode; // 自定义码
	private String centerCode; // 中心固定资产编码
	private String barcode; // 固定资产条码
	private String instrmType; // 固定资产分类

	private String commonName; // 通用名称
	private String commonSpell; // 通用拼音
	private String commonWb; // 通用五笔

	private String alias; // 别名
	private String aliasSpell; // 别名拼音码
	private String aliasWb; // 别名五笔码

	private String tradeName; // 商品名称

	private String producer; // 生产厂家
	private Company companyInfo; // 关联厂家对象
	private String instrmSpecs; // 固定资产规格
	private String instrmUnit; // 单位
	private String batchNo; // 型号
	private Integer limitMonth; // 折旧
	
	private BigDecimal buyPrice; // 进价
	private BigDecimal salePrice; // 售价
	
	private String stopFlag; // 停用标志

	private String countryCode;

	@RedisSequence
	public String getInstrmCode() {
		return instrmCode;
	}

	public void setInstrmCode(String instrmCode) {
		this.instrmCode = instrmCode;
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

	public String getInstrmSpecs() {
		return instrmSpecs;
	}

	public void setInstrmSpecs(String instrmSpecs) {
		this.instrmSpecs = instrmSpecs;
	}

	public String getInstrmType() {
		return instrmType;
	}

	public void setInstrmType(String instrmType) {
		this.instrmType = instrmType;
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

	public BigDecimal getSalePrice() {
		return salePrice;
	}

	public void setSalePrice(BigDecimal salePrice) {
		this.salePrice = salePrice;
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

	public String getInstrmUnit() {
		return instrmUnit;
	}

	public void setInstrmUnit(String instrmUnit) {
		this.instrmUnit = instrmUnit;
	}

	public Integer getLimitMonth() {
		return limitMonth;
	}

	public void setLimitMonth(Integer limitMonth) {
		this.limitMonth = limitMonth;
	}

	public String getCountryCode() {
		return countryCode;
	}

	public void setCountryCode(String countryCode) {
		this.countryCode = countryCode;
	}

	public String getBatchNo() {
		return batchNo;
	}

	public void setBatchNo(String batchNo) {
		this.batchNo = batchNo;
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
}
