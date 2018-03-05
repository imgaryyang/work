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
import com.lenovohit.hcp.base.model.Department;
import com.lenovohit.hcp.base.model.HcpBaseModel;

@Entity 
@Table(name = "PHA_OUTPUTINFO")

public class PhaOutputInfo extends HcpBaseModel {

	private static final long serialVersionUID = -2604267547538227262L;

//	private String outId;

    private String outBill;

    private Integer billNo;

    private String applyNo;
    private String appBill;
    private Department deptInfo;
    private Department toDept;

    private String outType;

    private Integer plusMinus;

    private String storeId;
    private String drugCode;
    private PhaDrugInfo drugInfo;


	private String tradeName;

    private String specs;

    private String drugType;

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

//    public String getOutId() {
//        return outId;
//    }
//
//    public void setOutId(String outId) {
//        this.outId = outId == null ? null : outId.trim();
//    }

    
    
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
    
    public String getDrugCode() {
        return drugCode;
    }

    public void setDrugCode(String drugCode) {
        this.drugCode = drugCode == null ? null : drugCode.trim();
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

	@Column(name="OUT_TIME")
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
	@JoinColumn(name = "DRUG_ID", nullable = true)
	@NotFound(action = NotFoundAction.IGNORE)
	public PhaDrugInfo getDrugInfo() {
		return drugInfo;
	}

	public void setDrugInfo(PhaDrugInfo drugInfo) {
		this.drugInfo = drugInfo;
	}

}