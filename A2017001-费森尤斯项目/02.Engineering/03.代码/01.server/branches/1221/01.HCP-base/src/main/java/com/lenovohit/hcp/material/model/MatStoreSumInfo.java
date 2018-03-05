package com.lenovohit.hcp.material.model;

import java.math.BigDecimal;
import java.util.Date;

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
@Table(name = "MATERIAL_STORESUMINFO")	// 药房药库 - 库存信息表

public class MatStoreSumInfo extends HcpBaseModel {
	
	private static final long serialVersionUID = -2793427735876813312L;
	private String storeSumId;
    private String deptId;
    private String materialType; //药品分类|Material_TYPE
    private String materialCode;
    // private String materialId; 该字段为关联字段，为避免column specified twice错误而注释掉
	private String tradeName;
    private String materialSpecs;
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
	private MatInfo materialInfo;
	private Company companyInfo;
	private Date validDate;
	
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
	public String getMaterialType() {
		return materialType;
	}
	public void setMaterialType(String materialType) {
		this.materialType = materialType;
	}
	public String getMaterialCode() {
		return materialCode;
	}
	public void setMaterialCode(String materialCode) {
		this.materialCode = materialCode;
	}
//    public String getMaterialId() {
//		return materialId;
//	}
//	public void setMaterialId(String materialId) {
//		this.materialId = materialId;
//	}
	public String getTradeName() {
		return tradeName;
	}
	public void setTradeName(String tradeName) {
		this.tradeName = tradeName;
	}
	public String getMaterialSpecs() {
		return materialSpecs;
	}
	public void setMaterialSpecs(String materialSpecs) {
		this.materialSpecs = materialSpecs;
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
	@ManyToOne
	@JoinColumn(name = "MATERIAL_ID", nullable = true)
	@NotFound(action=NotFoundAction.IGNORE)
	public MatInfo getMaterialInfo() {
		return materialInfo;
	}
	public void setMaterialInfo(MatInfo materialInfo) {
		this.materialInfo = materialInfo;
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
	public Date getValidDate() {
		return validDate;
	}
	public void setValidDate(Date validDate) {
		this.validDate = validDate;
	}
}