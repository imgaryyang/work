package com.lenovohit.hcp.pharmacy.model;

import java.math.BigDecimal;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

import com.lenovohit.hcp.base.model.HcpBaseModel;

@Entity
@Table(name = "PHA_DRUG_PRICE") // 药房药库 - 药品信息表
public class PhaDrugPrice extends HcpBaseModel {

	/**
	 * @Author xlbd
	 */
	private static final long serialVersionUID = 1L;

	private String drugCode; // 药品编码
	private String centerCode; // 中心药品编码

	private BigDecimal buyPrice; // 进价
	private BigDecimal wholePrice; // 批发价
	private BigDecimal salePrice; // 售价
	private BigDecimal taxBuyPrice; // 含税进价
	private BigDecimal taxSalePrice; // 含税售价
	private Boolean stopFlag; // 停用标志
	private PhaDrugInfo drugInfo;

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

	public Boolean getStopFlag() {
		return stopFlag;
	}

	public void setStopFlag(Boolean stopFlag) {
		this.stopFlag = stopFlag;
	}

	@ManyToOne
	@JoinColumn(name = "DRUG_ID", nullable = true)
	@NotFound(action=NotFoundAction.IGNORE)
	public PhaDrugInfo getDrugInfo() {
		return drugInfo;
	}

	public void setDrugInfo(PhaDrugInfo drugInfo) {
		this.drugInfo = drugInfo;
	}

}
