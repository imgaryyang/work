package com.lenovohit.hcp.material.model;

import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

import com.lenovohit.hcp.base.model.Company;
import com.lenovohit.hcp.base.model.HcpBaseModel;

@Entity
@Table(name = "MATERIAL_BUYDETAIL") // 采购单明细
public class MatBuyDetail extends HcpBaseModel {

	private static final long serialVersionUID = -5785194046372935321L;
	private String buyBill;
//    private String billId;
    private String plusMinus; //正负类型|1正-1负
    private String materialCode;

    private String tradeName;
    private String materialType; //药品分类|DRUG_TYPE
    private String materialSpec; //药品分类|DRUG_TYPE
    private String batchNo;
    private String approvalNo;
    private Date procuceDate;
    private Date validDate;


	private BigDecimal buyPrice;
    private BigDecimal salePrice;
    private int buyNum;
    private String buyUnit;
    private int auitdNum;
    private BigDecimal inNum;
    private String minUnit;
    private BigDecimal buyCost;
    private BigDecimal saleCose;
    private String inOper;
    private Date inTime;
    private String comm;
    private MatBuyBill matBuyBill;
    private MatInfo matInfo;
    private Company producer;
    //本科库存
    private BigDecimal deptSum;
    //本院库存
    private BigDecimal totalSum;
    
	public String getTradeName() {
		return tradeName;
	}

	public void setTradeName(String tradeName) {
		this.tradeName = tradeName;
	}

	public String getMaterialSpec() {
		return materialSpec;
	}

	public void setMaterialSpec(String materialSpec) {
		this.materialSpec = materialSpec;
	}

	@Transient
	public BigDecimal getDeptSum() {
		return deptSum;
	}

	public void setDeptSum(BigDecimal deptSum) {
		this.deptSum = deptSum;
	}
    @Transient
    public BigDecimal getTotalSum() {
		return totalSum;
	}

	public void setTotalSum(BigDecimal totalSum) {
		this.totalSum = totalSum;
	}
	


	public String getBuyBill() {
		return buyBill;
	}
	public void setBuyBill(String buyBill) {
		this.buyBill = buyBill;
	}
	public String getPlusMinus() {
		return plusMinus;
	}
	public void setPlusMinus(String plusMinus) {
		this.plusMinus = plusMinus;
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
	public Date getProcuceDate() {
		return procuceDate;
	}
	public void setProcuceDate(Date procuceDate) {
		this.procuceDate = procuceDate;
	}
	public Date getValidDate() {
		return validDate;
	}
	public void setValidDate(Date validDate) {
		this.validDate = validDate;
	}
	@ManyToOne
	@JoinColumn(name = "producer", nullable = true)
	@NotFound(action=NotFoundAction.IGNORE)
	public Company getProducer() {
		return producer;
	}
	public void setProducer(Company producer) {
		this.producer = producer;
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
	public int getBuyNum() {
		return buyNum;
	}
	public void setBuyNum(int buyNum) {
		this.buyNum = buyNum;
	}
	public String getBuyUnit() {
		return buyUnit;
	}
	public void setBuyUnit(String buyUnit) {
		this.buyUnit = buyUnit;
	}
	public int getAuitdNum() {
		return auitdNum;
	}
	public void setAuitdNum(int auitdNum) {
		this.auitdNum = auitdNum;
	}
	public BigDecimal getInNum() {
		return inNum;
	}
	public void setInNum(BigDecimal inNum) {
		this.inNum = inNum;
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
	public BigDecimal getSaleCose() {
		return saleCose;
	}
	public void setSaleCose(BigDecimal saleCose) {
		this.saleCose = saleCose;
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
	public String getComm() {
		return comm;
	}
	public void setComm(String comm) {
		this.comm = comm;
	}
	@ManyToOne
	@JoinColumn(name = "MATERIAL_ID", nullable = false)
	@NotFound(action=NotFoundAction.IGNORE)
	public MatInfo getMatInfo() {
		return matInfo;
	}
	public void setMatInfo(MatInfo matInfo) {
		this.matInfo = matInfo;
	}

	public String getMaterialCode() {
		return materialCode;
	}

	public void setMaterialCode(String materialCode) {
		this.materialCode = materialCode;
	}


	public String getMaterialType() {
		return materialType;
	}

	public void setMaterialType(String materialType) {
		this.materialType = materialType;
	}

	@ManyToOne
	@JoinColumn(name = "BILL_ID", nullable = true)
	@NotFound(action=NotFoundAction.IGNORE)
	public MatBuyBill getMatBuyBill() {
		return matBuyBill;
	}

	public void setMatBuyBill(MatBuyBill matBuyBill) {
		this.matBuyBill = matBuyBill;
	}
    
}