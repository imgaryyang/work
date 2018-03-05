/**
 * 
 */
package com.lenovohit.hcp.material.model;

import java.math.BigDecimal;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

import com.lenovohit.hcp.base.model.Company;
import com.lenovohit.hcp.base.model.HcpBaseModel;

/**
 * @author duanyanshan
 * @date 2017年10月23日 下午3:01:44
 */
@Entity
@Table(name = "MATERIAL_PRICE") // 物资_价格表
public class MatPrice extends HcpBaseModel {

	private static final long serialVersionUID = 1L;

	private MatInfo matInfo;
	private String materialCode;
	private String centerCode; // 中心编码
	private BigDecimal buyPrice; // 采购价
	private BigDecimal wholePrice; // 批发价
	private BigDecimal salePrice; // 零售价
	private BigDecimal taxBuyPrice; // 含税采购价
	private BigDecimal taxSalePrice; // 含税售价
	private String stopFlag; // 停用标志
	private String itemCode; // 收费项
	private String feeFlag; // 收费对应标志
	public String getFeeFlag() {
		return feeFlag;
	}
	public void setFeeFlag(String feeFlag) {
		this.feeFlag = feeFlag;
	}
	public String getItemCode() {
		return itemCode;
	}
	public void setItemCode(String itemCode) {
		this.itemCode = itemCode;
	}
	public String getMaterialCode() {
		return materialCode;
	}
	public void setMaterialCode(String materialCode) {
		this.materialCode = materialCode;
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
	public String getStopFlag() {
		return stopFlag;
	}
	public void setStopFlag(String stopFlag) {
		this.stopFlag = stopFlag;
	}
	
	@ManyToOne
	@JoinColumn(name = "MATERIAL_ID", nullable = true)
	@NotFound(action = NotFoundAction.IGNORE)
	public MatInfo getMatInfo() {
		return matInfo;
	}
	public void setMatInfo(MatInfo matInfo) {
		this.matInfo = matInfo;
	}
	
	
	
	
}
