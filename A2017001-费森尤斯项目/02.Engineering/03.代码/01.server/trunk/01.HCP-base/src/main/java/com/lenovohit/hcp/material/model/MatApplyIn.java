package com.lenovohit.hcp.material.model;

import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

import com.lenovohit.hcp.base.model.HcpBaseModel;


@Entity 
@Table(name = "MATERIAL_APPLYIN")	// 药房药库 - 入库申请信息
public class MatApplyIn extends HcpBaseModel {

	/**
	 * 
	 */
	private static final long serialVersionUID = -1137312786966949151L;
	private String  appBill;
	private String  deptId;
	private String  storeId;
	
	private String  fromDeptId;
	private int  plusMinus;
	private String  materialCode;

	private String  tradeName;
	private String  materialSpec;
	private String  materialType;
	private String  batchNo;
	private String  approvalNo;
	private Date  produceDate;
	private Date  validDate;
	private String  producer;
	private String  company;
	private BigDecimal  buyPrice;
	private BigDecimal  salePrice;
	private BigDecimal  appNum;
	private String  appUnit;
	private BigDecimal  checkNum;
	private String  minUnit;
	private BigDecimal  buyCost;
	private BigDecimal  saleCost;
	private String  appOper;
	private Date  appTime;
	private String  checkOper;
	private Date  checkTime;
	private String  inOper;
	private Date  inTime;
	private String  invoiceNo;
	private String  appState;
	private String  comm;
	private MatInfo matInfo;

	
	
	public String getFromDeptId() {
		return fromDeptId;
	}
	public void setFromDeptId(String fromDeptId) {
		this.fromDeptId = fromDeptId;
	}
	public String getAppBill() {
		return appBill;
	}
	public void setAppBill(String appBill) {
		this.appBill = appBill;
	}
	public String getDeptId() {
		return deptId;
	}
	public void setDeptId(String deptId) {
		this.deptId = deptId;
	}
	public int getPlusMinus() {
		return plusMinus;
	}
	public void setPlusMinus(int plusMinus) {
		this.plusMinus = plusMinus;
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
	public Date getProduceDate() {
		return produceDate;
	}
	public void setProduceDate(Date produceDate) {
		this.produceDate = produceDate;
	}
	public Date getValidDate() {
		return validDate;
	}
	public void setValidDate(Date validDate) {
		this.validDate = validDate;
	}
	public String getProducer() {
		return producer;
	}
	public void setProducer(String producer) {
		this.producer = producer;
	}
	public String getCompany() {
		return company;
	}
	public void setCompany(String company) {
		this.company = company;
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
	public BigDecimal getAppNum() {
		return appNum;
	}
	public void setAppNum(BigDecimal appNum) {
		this.appNum = appNum;
	}
	public String getAppUnit() {
		return appUnit;
	}
	public void setAppUnit(String appUnit) {
		this.appUnit = appUnit;
	}
	public BigDecimal getCheckNum() {
		return checkNum;
	}
	public void setCheckNum(BigDecimal checkNum) {
		this.checkNum = checkNum;
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
	public String getAppOper() {
		return appOper;
	}
	public void setAppOper(String appOper) {
		this.appOper = appOper;
	}
	public Date getAppTime() {
		return appTime;
	}
	public void setAppTime(Date appTime) {
		this.appTime = appTime;
	}
	public String getCheckOper() {
		return checkOper;
	}
	public void setCheckOper(String checkOper) {
		this.checkOper = checkOper;
	}
	public Date getCheckTime() {
		return checkTime;
	}
	public void setCheckTime(Date checkTime) {
		this.checkTime = checkTime;
	}
	public String getInOper() {
		return inOper;
	}
	public void setInOper(String inOper) {
		this.inOper = inOper;
	}
	public Date getInTime() {
		return inTime;
	}
	public void setInTime(Date inTime) {
		this.inTime = inTime;
	}
	public String getInvoiceNo() {
		return invoiceNo;
	}
	public void setInvoiceNo(String invoiceNo) {
		this.invoiceNo = invoiceNo;
	}
	public String getAppState() {
		return appState;
	}
	public void setAppState(String appState) {
		this.appState = appState;
	}
	
	public String getComm() {
		return comm;
	}
	public void setComm(String comm) {
		this.comm = comm;
	}


	public String getStoreId() {
		return storeId;
	}
	public void setStoreId(String storeId) {
		this.storeId = storeId;
	}
	public String getMaterialCode() {
		return materialCode;
	}
	public void setMaterialCode(String materialCode) {
		this.materialCode = materialCode;
	}
	
	@JoinColumn(name = "MATERIAL_ID", nullable = true)
	@NotFound(action=NotFoundAction.IGNORE)
	@ManyToOne//(cascade=(CascadeType.REFRESH)) 要把drugInfo.id传回来，就不会报级联相关错误
	public MatInfo getMatInfo() {
		return matInfo;
	}
	public void setMatInfo(MatInfo matInfo) {
		this.matInfo = matInfo;
	}
	public void setMaterialSpec(String materialSpec) {
		this.materialSpec = materialSpec;
	}
	public String getMaterialSpec() {
		return materialSpec;
	}
	public String getMaterialType() {
		return materialType;
	}
	public void setMaterialType(String materialType) {
		this.materialType = materialType;
	}
	
	
}
