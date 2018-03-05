package com.lenovohit.hcp.pharmacy.model;

import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.lenovohit.hcp.base.annotation.RedisSequence;
import com.lenovohit.hcp.base.model.Company;
import com.lenovohit.hcp.base.model.HcpBaseModel;

@Entity 
@Table(name = "PHA_STOREINFO")	// 药房药库 - 库存信息表

public class PhaStoreInfo extends HcpBaseModel {

	private static final long serialVersionUID = -6539577899938860312L;
	
	private String storeId;
    private String deptId;
    private String drugType; //药品分类|DRUG_TYPE
    private String drugCode;
//    private String drugId;	该字段为关联字段，为避免column specified twice错误而注释掉
	private String tradeName;
    private String specs;
    private String batchNo;
    private String approvalNo;
    private Date produceDate;
//    private String producer;	该字段为关联字段，为避免column specified twice错误而注释掉
    private Date validDate;
    private BigDecimal buyPrice;
    private BigDecimal salePrice;
    private BigDecimal storeSum;
    private String minUnit;
    private BigDecimal buyCost;
    private BigDecimal saleCost;
    private String location;
    private boolean stop; //停用标志|0-停1启
    private String comm;
	private PhaDrugInfo drugInfo;
	private Company companySupply;	//供货商
	private Company companyInfo;//生产厂商
	private BigDecimal stayAlert;		//滞留预警天数

	
	@RedisSequence
	public String getStoreId() {
		return storeId;
	}
	public void setStoreId(String storeId) {
		this.storeId = storeId;
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
	public String getBatchNo() {
		return batchNo;
	}
	public void setBatchNo(String batchNo) {
		this.batchNo = batchNo;
	}
	public String getApprovalNo() {
		return approvalNo;
	}
	public void setApprovalNo(String approvalNo) {
		this.approvalNo = approvalNo;
	}
	@Column(name="PRODUCE_DATE")
	@JsonFormat(pattern = "yyyy-MM-dd", timezone = "GMT+8")
	public Date getProduceDate() {
		return produceDate;
	}
	public void setProduceDate(Date produceDate) {
		this.produceDate = produceDate;
	}
//	public String getProducer() {
//		return producer;
//	}
//	public void setProducer(String producer) {
//		this.producer = producer;
//	}
	@Column(name="VALID_DATE")
	@JsonFormat(pattern = "yyyy-MM-dd", timezone = "GMT+8")
	public Date getValidDate() {
		return validDate;
	}
	public void setValidDate(Date validDate) {
		this.validDate = validDate;
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
	public BigDecimal getStoreSum() {
		return storeSum;
	}
	public void setStoreSum(BigDecimal storeSum) {
		this.storeSum = storeSum;
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
	@ManyToOne //要把companyInfo.id传回来，就不会报级联相关错误
	@JoinColumn(name = "COMPANY", nullable = true)
	@NotFound(action=NotFoundAction.IGNORE)
	public Company getCompanySupply() {
		return companySupply;
	}
	public void setCompanySupply(Company companySupply) {
		this.companySupply = companySupply;
	}
	public BigDecimal getStayAlert() {
		return stayAlert;
	}
	public void setStayAlert(BigDecimal stayAlert) {
		this.stayAlert = stayAlert;
	}
	
}