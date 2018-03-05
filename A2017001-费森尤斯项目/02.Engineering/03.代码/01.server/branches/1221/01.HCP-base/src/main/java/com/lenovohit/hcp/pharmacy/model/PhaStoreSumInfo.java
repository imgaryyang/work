package com.lenovohit.hcp.pharmacy.model;

import java.math.BigDecimal;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

import com.lenovohit.hcp.base.annotation.RedisSequence;
import com.lenovohit.hcp.base.model.Company;
import com.lenovohit.hcp.base.model.HcpBaseModel;

@Entity 
@Table(name = "PHA_STORESUMINFO")	// 药房药库 - 库存信息表

public class PhaStoreSumInfo extends HcpBaseModel {
	
	private static final long serialVersionUID = -2793427735876813312L;
	private String storeSumId;
    private String deptId;
    private String drugType; //药品分类|DRUG_TYPE
    private String drugCode;
    // private String drugId; 该字段为关联字段，为避免column specified twice错误而注释掉
	private String tradeName;
    private String specs;
    // private String producer; 该字段为关联字段，为避免column specified twice错误而注释掉
    private BigDecimal buyPrice;
    private BigDecimal salePrice;
    private BigDecimal storeSum;
    private BigDecimal alertNum;

	private String minUnit;
    private BigDecimal buyCost;
    private BigDecimal saleCost;
    private String location;
    private boolean stop; //停用标志|0-停1启
    private String comm;
	private PhaDrugInfo drugInfo;
	private Company companyInfo;
	
	@RedisSequence
	public String getStoreSumId() {
		return storeSumId;
	}
	public void setStoreSumId(String storeSumId) {
		this.storeSumId = storeSumId;
	}
	public String getDeptId() {
		return deptId;
	}
	public void setDeptId(String deptId) {
		this.deptId = deptId;
	}
	public String getDrugType() {
		return drugType;
	}
	public void setDrugType(String drugType) {
		this.drugType = drugType;
	}
	public String getDrugCode() {
		return drugCode;
	}
	public void setDrugCode(String drugCode) {
		this.drugCode = drugCode;
	}
//    public String getDrugId() {
//		return drugId;
//	}
//	public void setDrugId(String drugId) {
//		this.drugId = drugId;
//	}
	public String getTradeName() {
		return tradeName;
	}
	public void setTradeName(String tradeName) {
		this.tradeName = tradeName;
	}
	public String getSpecs() {
		return specs;
	}
	public void setSpecs(String specs) {
		this.specs = specs;
	}
//	public String getProducer() {
//		return producer;
//	}
//	public void setProducer(String producer) {
//		this.producer = producer;
//	}
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
	public BigDecimal getStoreSum() {
		return storeSum;
	}
	public void setStoreSum(BigDecimal storeSum) {
		this.storeSum = storeSum;
	}
    public BigDecimal getAlertNum() {
		return alertNum;
	}
	public void setAlertNum(BigDecimal alertNum) {
		this.alertNum = alertNum;
	}
	public String getMinUnit() {
		return minUnit;
	}
	public void setMinUnit(String minUnit) {
		this.minUnit = minUnit;
	}
	public BigDecimal getBuyCost() {
		return buyCost;
	}
	public void setBuyCost(BigDecimal buyCost) {
		this.buyCost = buyCost;
	}
	public BigDecimal getSaleCost() {
		return saleCost;
	}
	public void setSaleCost(BigDecimal saleCost) {
		this.saleCost = saleCost;
	}
	public String getLocation() {
		return location;
	}
	public void setLocation(String location) {
		this.location = location;
	}
	@Column(name = "STOP_FLAG")
	public boolean isStop() {
		return stop;
	}
	public void setStop(boolean stop) {
		this.stop = stop;
	}
	public String getComm() {
		return comm;
	}
	public void setComm(String comm) {
		this.comm = comm;
	}
	@JoinColumn(name = "DRUG_ID", nullable = true)
	@NotFound(action=NotFoundAction.IGNORE)
	@ManyToOne
	public PhaDrugInfo getDrugInfo() {
		return drugInfo;
	}
	public void setDrugInfo(PhaDrugInfo drugInfo) {
		this.drugInfo = drugInfo;
	}

	@ManyToOne //要把companyInfo.id传回来，就不会报级联相关错误
	@JoinColumn(name = "PRODUCER", nullable = true)
	@NotFound(action=NotFoundAction.IGNORE)
	public Company getCompanyInfo() {
		return companyInfo;
	}
	public void setCompanyInfo(Company companyInfo) {
		this.companyInfo = companyInfo;
	}
}