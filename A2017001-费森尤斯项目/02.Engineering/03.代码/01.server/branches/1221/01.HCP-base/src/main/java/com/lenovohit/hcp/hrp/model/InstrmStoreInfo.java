package com.lenovohit.hcp.hrp.model;

import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.lenovohit.hcp.base.annotation.RedisSequence;
import com.lenovohit.hcp.base.model.Company;
import com.lenovohit.hcp.base.model.HcpBaseModel;

@Entity
@Table(name = "INSTRM_STOREINFO") // 药房药库 - 库存信息表

public class InstrmStoreInfo extends HcpBaseModel {

	private static final long serialVersionUID = -6539577899938860312L;

	private String storeId;
	private String deptId;
	private String instrmType; // 药品分类|INSTRM_TYPE
	private String instrmCode;
	private String instrmId; // 该字段为关联字段，为避免column specified twice错误而注释掉
	private String tradeName;
	private String batchNo;
	private String approvalNo;
	private Date produceDate;
	private Date validDate;
	private BigDecimal buyPrice;
	private BigDecimal salePrice;
	private BigDecimal storeSum;
	private BigDecimal buyCost;
	private BigDecimal saleCost;
	private String location;
	private boolean stop; // 停用标志|0-停1启
	private String comm;
	private InstrmInfo instrmInfo;
	private Company companySupply; // 供货商
	private Company companyInfo;// 生产厂商

	private String instrmSpecs;

	private String producer;

	private String company;

	private String instrmUnit;

	private Date purchaseDate;

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

	public String getInstrmType() {
		return instrmType;
	}

	public void setInstrmType(String instrmType) {
		this.instrmType = instrmType;
	}

	public String getInstrmCode() {
		return instrmCode;
	}

	public void setInstrmCode(String instrmCode) {
		this.instrmCode = instrmCode;
	}

	@Transient
	public String getInstrmId() {
		return instrmId;
	}

	public void setInstrmId(String instrmId) {
		this.instrmId = instrmId;
	}

	public String getTradeName() {
		return tradeName;
	}

	public void setTradeName(String tradeName) {
		this.tradeName = tradeName;
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

	@Column(name = "PRODUCE_DATE")
	@JsonFormat(pattern = "yyyy-MM-dd", timezone = "GMT+8")
	public Date getProduceDate() {
		return produceDate;
	}

	public void setProduceDate(Date produceDate) {
		this.produceDate = produceDate;
	}

	@Column(name = "VALID_DATE")
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

	@JoinColumn(name = "INSTRM_ID", nullable = true)
	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne
	public InstrmInfo getInstrmInfo() {
		return instrmInfo;
	}

	public void setInstrmInfo(InstrmInfo instrmInfo) {
		this.instrmInfo = instrmInfo;
	}

	@ManyToOne // 要把companyInfo.id传回来，就不会报级联相关错误
	@JoinColumn(name = "PRODUCER", nullable = true)
	@NotFound(action = NotFoundAction.IGNORE)
	public Company getCompanyInfo() {
		return companyInfo;
	}

	public void setCompanyInfo(Company companyInfo) {
		this.companyInfo = companyInfo;
	}

	@ManyToOne // 要把companyInfo.id传回来，就不会报级联相关错误
	@JoinColumn(name = "COMPANY", nullable = true)
	@NotFound(action = NotFoundAction.IGNORE)
	public Company getCompanySupply() {
		return companySupply;
	}

	public void setCompanySupply(Company companySupply) {
		this.companySupply = companySupply;
	}

	public String getInstrmSpecs() {
		return instrmSpecs;
	}

	public void setInstrmSpecs(String instrmSpecs) {
		this.instrmSpecs = instrmSpecs;
	}

	@Transient
	public String getProducer() {
		return producer;
	}

	public void setProducer(String producer) {
		this.producer = producer;
	}

	@Transient
	public String getCompany() {
		return company;
	}

	public void setCompany(String company) {
		this.company = company;
	}

	public String getInstrmUnit() {
		return instrmUnit;
	}

	public void setInstrmUnit(String instrmUnit) {
		this.instrmUnit = instrmUnit;
	}

	@JsonFormat(pattern = "yyyy-MM-dd", timezone = "GMT+8")
	public Date getPurchaseDate() {
		return purchaseDate;
	}

	public void setPurchaseDate(Date purchaseDate) {
		this.purchaseDate = purchaseDate;
	}

}