package com.lenovohit.hcp.pharmacy.model;

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
@Table(name = "PHA_INPUTINFO")

public class PhaInputInfo extends HcpBaseModel {

	private static final long serialVersionUID = -2305191990391126750L;

	private String buyBill;
	
    private String inBill;

    private String deptId;

    private String inType;
    private String storeId;


	private Integer plusMinus;
    private String drugCode;
    private String drugId;

    private String tradeName;

    private String specs;

    private String drugType;

    private String batchNo;

    private String approvalNo;

    private Date produceDate;

    private String producer;
    
    private String company;
    
    private Company companyInfo;

    private Date validDate;

    private BigDecimal buyPrice;

    private BigDecimal salePrice;

    private BigDecimal inSum;

    private String minUnit;

    private BigDecimal buyCost;

    private BigDecimal saleCost;

    private String inOper;

    private Date inTime;
    
    

    private String inputState;
    private PhaDrugInfo drugInfo;

//    private String stopFlag;

    private String comm;


    public String getBuyBill() {
        return buyBill;
    }

    public void setBuyBill(String buyBill) {
        this.buyBill = buyBill == null ? null : buyBill.trim();
    }
    
	@RedisSequence
    public String getInBill() {
        return inBill;
    }

    public void setInBill(String inBill) {
        this.inBill = inBill == null ? null : inBill.trim();
    }

    public String getDeptId() {
        return deptId;
    }

    public void setDeptId(String deptId) {
        this.deptId = deptId == null ? null : deptId.trim();
    }

    public String getInType() {
        return inType;
    }

    public void setInType(String inType) {
        this.inType = inType == null ? null : inType.trim();
    }

    public Integer getPlusMinus() {
        return plusMinus;
    }

    public void setPlusMinus(Integer plusMinus) {
        this.plusMinus = plusMinus;
    }

    public String getDrugCode() {
        return drugCode;
    }

    public void setDrugCode(String drugCode) {
        this.drugCode = drugCode == null ? null : drugCode.trim();
    }
    
//    public String getDrugId() {
//        return drugId;
//    }
//
//    public void setDrugId(String drugId) {
//        this.drugId = drugId == null ? null : drugId.trim();
//    }

	@JoinColumn(name = "DRUG_ID", nullable = true)
	@NotFound(action=NotFoundAction.IGNORE)
	@ManyToOne
	public PhaDrugInfo getDrugInfo() {
		return drugInfo;
	}
	public void setDrugInfo(PhaDrugInfo drugInfo) {
		this.drugInfo = drugInfo;
	}

    public String getTradeName() {
        return tradeName;
    }

    public void setTradeName(String tradeName) {
        this.tradeName = tradeName == null ? null : tradeName.trim();
    }

    public String getSpecs() {
        return specs;
    }

    public void setSpecs(String specs) {
        this.specs = specs == null ? null : specs.trim();
    }

    public String getDrugType() {
        return drugType;
    }

    public void setDrugType(String drugType) {
        this.drugType = drugType == null ? null : drugType.trim();
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
    
	@Column(name="PRODUCE_DATE")
	@JsonFormat(pattern = "yyyy-MM-dd", timezone = "GMT+8")
    public Date getProduceDate() {
        return produceDate;
    }

    public void setProduceDate(Date produceDate) {
        this.produceDate = produceDate;
    }


    public String getProducer() {
        return producer;
    }

    public void setProducer(String producer) {
        this.producer = producer == null ? null : producer.trim();
    }
    
    @Transient
    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company == null ? null : company.trim();
    }
    
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

    public BigDecimal getInSum() {
        return inSum;
    }

    public void setInSum(BigDecimal inSum) {
        this.inSum = inSum;
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

    public String getInOper() {
        return inOper;
    }

    public void setInOper(String inOper) {
        this.inOper = inOper == null ? null : inOper.trim();
    }

	@Column(name="IN_TIME")
	@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    public Date getInTime() {
        return inTime;
    }

    public void setInTime(Date inTime) {
        this.inTime = inTime;
    }

    public String getInputState() {
        return inputState;
    }

    public void setInputState(String inputState) {
        this.inputState = inputState == null ? null : inputState.trim();
    }

//    public String getStopFlag() {
//        return stopFlag;
//    }
//
//    public void setStopFlag(String stopFlag) {
//        this.stopFlag = stopFlag == null ? null : stopFlag.trim();
//    }

    public String getComm() {
        return comm;
    }

    public void setComm(String comm) {
        this.comm = comm == null ? null : comm.trim();
    }
    
    public String getStoreId() {
		return storeId;
	}

	public void setStoreId(String storeId) {
		this.storeId = storeId;
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
}