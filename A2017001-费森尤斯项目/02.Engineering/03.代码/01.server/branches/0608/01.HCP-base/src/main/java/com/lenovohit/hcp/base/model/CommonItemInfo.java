package com.lenovohit.hcp.base.model;

import java.math.BigDecimal;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;

@Entity
@Table(name = "V_COM_ITEM") // 收费项目信息
public class CommonItemInfo {
	private String id; // 项目id（或药品id）
	private String itemCode; // 项目编码
	private String itemName; // 项目名称
	private String itemSpecs; // 规格
	private String itemUnit; // 单位
	private BigDecimal packQty;	//包装数量
	private String miniUnit;	//最小包装单位
	private BigDecimal salePrice; // 价格
	private String manufacturer; // 生产厂家
	private String companyName; // 厂商名称
	private BigDecimal stock; // 库存
	private String tradeSpell; // 商用拼音码
	private String commonSpell; // 通用拼音码
	private String commonWb; // 通用五笔
	private String tradeWb; // 商用五笔
	private String userCode; // 自定义码
	private String itemFlag; // 项目标志
	private String exeDept; // 执行科室
	private String feeCode; // 费用分类
	private int amount; // 数量
	private String recipeId; // 处方id
	private String dosage; // 剂量
	private String doseUnit; // 剂量单位

	@Id
	@Column(name = "ITEM_ID", length = 32)
	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getItemCode() {
		return itemCode;
	}

	public void setItemCode(String itemCode) {
		this.itemCode = itemCode;
	}

	public String getItemName() {
		return itemName;
	}

	public void setItemName(String itemName) {
		this.itemName = itemName;
	}

	public String getItemSpecs() {
		return itemSpecs;
	}

	public void setItemSpecs(String itemSpecs) {
		this.itemSpecs = itemSpecs;
	}

	public String getItemUnit() {
		return itemUnit;
	}

	public void setItemUnit(String itemUnit) {
		this.itemUnit = itemUnit;
	}

	public BigDecimal getSalePrice() {
		return salePrice;
	}

	public void setSalePrice(BigDecimal salePrice) {
		this.salePrice = salePrice;
	}

	public String getManufacturer() {
		return manufacturer;
	}

	public void setManufacturer(String manufacturer) {
		this.manufacturer = manufacturer;
	}

	public BigDecimal getStock() {
		return stock;
	}

	public void setStock(BigDecimal stock) {
		this.stock = stock;
	}

	public String getTradeSpell() {
		return tradeSpell;
	}

	public void setTradeSpell(String tradeSpell) {
		this.tradeSpell = tradeSpell;
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

	public String getItemFlag() {
		return itemFlag;
	}

	public void setItemFlag(String itemFlag) {
		this.itemFlag = itemFlag;
	}

	public String getExeDept() {
		return exeDept;
	}

	public void setExeDept(String exeDept) {
		this.exeDept = exeDept;
	}

	public String getFeeCode() {
		return feeCode;
	}

	public void setFeeCode(String feeCode) {
		this.feeCode = feeCode;
	}

	@Transient
	public int getAmount() {
		return amount;
	}

	public void setAmount(int amount) {
		this.amount = amount;
	}

	public String getCompanyName() {
		return companyName;
	}

	public void setCompanyName(String companyName) {
		this.companyName = companyName;
	}

	@Transient
	public String getRecipeId() {
		return recipeId;
	}

	public void setRecipeId(String recipeId) {
		this.recipeId = recipeId;
	}

	public String getDosage() {
		return dosage;
	}

	public void setDosage(String dosage) {
		this.dosage = dosage;
	}

	public String getDoseUnit() {
		return doseUnit;
	}

	public void setDoseUnit(String doseUnit) {
		this.doseUnit = doseUnit;
	}

	public BigDecimal getPackQty() {
		return packQty;
	}

	public void setPackQty(BigDecimal packQty) {
		this.packQty = packQty;
	}

	public String getMiniUnit() {
		return miniUnit;
	}

	public void setMiniUnit(String miniUnit) {
		this.miniUnit = miniUnit;
	}

}
