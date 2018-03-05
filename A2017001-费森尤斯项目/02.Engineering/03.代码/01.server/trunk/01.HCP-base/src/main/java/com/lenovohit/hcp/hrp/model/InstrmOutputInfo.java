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
import com.lenovohit.hcp.base.model.Department;
import com.lenovohit.hcp.base.model.HcpBaseModel;

@Entity
@Table(name = "INSTRM_OUTPUTINFO")

public class InstrmOutputInfo extends HcpBaseModel {

	private static final long serialVersionUID = -2604267547538227262L;

	private String outBill;

	private Integer billNo;

	private String applyNo;
	private String appBill;
	private Department deptInfo;
	private Department toDept;

	private String outType;

	private Integer plusMinus;

	private String storeId;
	private String instrmCode;
	private InstrmInfo instrmInfo;

	private String tradeName;

	private String instrmType;

	private String batchNo;

	private String approvalNo;

	private Date produceDate;

	private Company producerInfo;

	private Date validDate;

	private Company companyInfo;

	private BigDecimal buyPrice;

	private BigDecimal salePrice;

	private BigDecimal outSum;

	private String minUnit;

	private BigDecimal buyCost;

	private BigDecimal saleCost;

	private String outOper;

	private Date outTime;

	private String outputState;

	private String comm;

	private String deptId;

	private String instrmId;

	private String instrmSpecs;

	private String producer;

	private String company;
	
	private String outId;

	public String getOutId() {
		return outId;
	}

	public void setOutId(String outId) {
		this.outId = outId;
	}

	private Date purchaseDate;
	

	@Transient
	public String getDeptId() {
		return deptId;
	}

	public void setDeptId(String deptId) {
		this.deptId = deptId;
	}

	@Transient
	public String getInstrmId() {
		return instrmId;
	}

	public void setInstrmId(String instrmId) {
		this.instrmId = instrmId;
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

	@ManyToOne
	@JoinColumn(name = "PRODUCER", nullable = true)
	@NotFound(action = NotFoundAction.IGNORE)
	public Company getProducerInfo() {
		return producerInfo;
	}

	public void setProducerInfo(Company producerInfo) {
		this.producerInfo = producerInfo;
	}

	@ManyToOne
	@JoinColumn(name = "COMPANY", nullable = true)
	@NotFound(action = NotFoundAction.IGNORE)
	public Company getCompanyInfo() {
		return companyInfo;
	}

	public void setCompanyInfo(Company companyInfo) {
		this.companyInfo = companyInfo;
	}

	@RedisSequence
	public String getOutBill() {
		return outBill;
	}

	public void setOutBill(String outBill) {
		this.outBill = outBill == null ? null : outBill.trim();
	}

	public Integer getBillNo() {
		return billNo;
	}

	public void setBillNo(Integer billNo) {
		this.billNo = billNo;
	}

	public String getApplyNo() {
		return applyNo;
	}

	public void setApplyNo(String applyNo) {
		this.applyNo = applyNo == null ? null : applyNo.trim();
	}

	public String getAppBill() {
		return appBill;
	}

	public void setAppBill(String appBill) {
		this.appBill = appBill;
	}

	public String getOutType() {
		return outType;
	}

	public void setOutType(String outType) {
		this.outType = outType == null ? null : outType.trim();
	}

	public Integer getPlusMinus() {
		return plusMinus;
	}

	public void setPlusMinus(Integer plusMinus) {
		this.plusMinus = plusMinus;
	}

	public String getStoreId() {
		return storeId;
	}

	public void setStoreId(String storeId) {
		this.storeId = storeId == null ? null : storeId.trim();
	}

	public String getInstrmCode() {
		return instrmCode;
	}

	public void setInstrmCode(String instrmCode) {
		this.instrmCode = instrmCode == null ? null : instrmCode.trim();
	}

	public String getTradeName() {
		return tradeName;
	}

	public void setTradeName(String tradeName) {
		this.tradeName = tradeName == null ? null : tradeName.trim();
	}

	public String getInstrmType() {
		return instrmType;
	}

	public void setInstrmType(String instrmType) {
		this.instrmType = instrmType == null ? null : instrmType.trim();
	}

	public String getBatchNo() {
		return batchNo;
	}

	public void setBatchNo(String batchNo) {
		this.batchNo = batchNo == null ? null : batchNo.trim();
	}

	public String getApprovalNo() {
		return approvalNo;
	}

	public void setApprovalNo(String approvalNo) {
		this.approvalNo = approvalNo == null ? null : approvalNo.trim();
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

	public BigDecimal getOutSum() {
		return outSum;
	}

	public void setOutSum(BigDecimal outSum) {
		this.outSum = outSum;
	}

	public String getMinUnit() {
		return minUnit;
	}

	public void setMinUnit(String minUnit) {
		this.minUnit = minUnit == null ? null : minUnit.trim();
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

	public String getOutOper() {
		return outOper;
	}

	public void setOutOper(String outOper) {
		this.outOper = outOper == null ? null : outOper.trim();
	}

	@Column(name = "OUT_TIME")
	@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
	public Date getOutTime() {
		return outTime;
	}

	public void setOutTime(Date outTime) {
		this.outTime = outTime;
	}

	public String getOutputState() {
		return outputState;
	}

	public void setOutputState(String outputState) {
		this.outputState = outputState == null ? null : outputState.trim();
	}

	public String getComm() {
		return comm;
	}

	public void setComm(String comm) {
		this.comm = comm == null ? null : comm.trim();
	}

	@ManyToOne
	@JoinColumn(name = "DEPT_ID", nullable = true)
	@NotFound(action = NotFoundAction.IGNORE)
	public Department getDeptInfo() {
		return deptInfo;
	}

	public void setDeptInfo(Department deptInfo) {
		this.deptInfo = deptInfo;
	}

	@ManyToOne
	@JoinColumn(name = "TO_DEPT", nullable = true)
	@NotFound(action = NotFoundAction.IGNORE)
	public Department getToDept() {
		return toDept;
	}

	public void setToDept(Department toDept) {
		this.toDept = toDept;
	}

	@ManyToOne
	@JoinColumn(name = "INSTRM_ID", nullable = true)
	@NotFound(action = NotFoundAction.IGNORE)
	public InstrmInfo getInstrmInfo() {
		return instrmInfo;
	}

	public void setInstrmInfo(InstrmInfo instrmInfo) {
		this.instrmInfo = instrmInfo;
	}

	@JsonFormat(pattern = "yyyy-MM-dd", timezone = "GMT+8")
	public Date getPurchaseDate() {
		return purchaseDate;
	}

	public void setPurchaseDate(Date purchaseDate) {
		this.purchaseDate = purchaseDate;
	}

}