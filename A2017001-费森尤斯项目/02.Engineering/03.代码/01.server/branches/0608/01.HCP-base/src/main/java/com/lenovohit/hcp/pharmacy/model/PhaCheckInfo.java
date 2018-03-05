package com.lenovohit.hcp.pharmacy.model;

import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

import com.lenovohit.hcp.base.annotation.RedisSequence;
import com.lenovohit.hcp.base.model.HcpBaseModel;

@Entity
@Table(name = "PHA_CHECKINFO") // 药房药库 - 药品盘点
public class PhaCheckInfo extends HcpBaseModel {

	private static final long serialVersionUID = -6146559075496427977L;

    private String checkBill;		//盘点单号

    private String storeId;			//库存id

    private String deptId;			//库房

    private String drugType;		//药品分类

    private String drugCode;		//商品编码

    private String tradeName;		//商品名称

    private String specs;			//药品规格

    private String batchNo;			//批次

    private String approvalNo;		//批号

    private Date produceDate;		//生产日期

    private String producer;		//厂家

    private Date validDate;			//有效期

    private BigDecimal buyPrice;	//采购价

    private BigDecimal salePrice;	//零售价

    private String location;		//药品位置

    private BigDecimal startSum;	//开始数量

    private BigDecimal writeSum;	//录入数量

    private BigDecimal endSum;		//结存数量

    private String minUnit;			//最小单位

    private Integer profitFlag;		//盈亏标志

    private String checkState;		//盘点状态

    private String comm;			//备注

    private String checkId;			//盘点id
    
    private Integer packSum;			//盘点包装数量
    
    private Integer miniSum;			//零散数量
    
    private PhaDrugInfo drugInfo;

    @RedisSequence
    public String getCheckId() {
        return checkId;
    }

    public void setCheckId(String checkId) {
        this.checkId = checkId == null ? null : checkId.trim();
    }

    @RedisSequence
    public String getCheckBill() {
        return checkBill;
    }

    public void setCheckBill(String checkBill) {
        this.checkBill = checkBill == null ? null : checkBill.trim();
    }

    public String getStoreId() {
        return storeId;
    }

    public void setStoreId(String storeId) {
        this.storeId = storeId == null ? null : storeId.trim();
    }

    public String getDeptId() {
        return deptId;
    }

    public void setDeptId(String deptId) {
        this.deptId = deptId == null ? null : deptId.trim();
    }

    public String getDrugType() {
        return drugType;
    }

    public void setDrugType(String drugType) {
        this.drugType = drugType == null ? null : drugType.trim();
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

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location == null ? null : location.trim();
    }

    public BigDecimal getStartSum() {
        return startSum;
    }

    public void setStartSum(BigDecimal startSum) {
        this.startSum = startSum;
    }

    public BigDecimal getWriteSum() {
        return writeSum;
    }

    public void setWriteSum(BigDecimal writeSum) {
        this.writeSum = writeSum;
    }

    public BigDecimal getEndSum() {
        return endSum;
    }

    public void setEndSum(BigDecimal endSum) {
        this.endSum = endSum;
    }

    public String getMinUnit() {
        return minUnit;
    }

    public void setMinUnit(String minUnit) {
        this.minUnit = minUnit == null ? null : minUnit.trim();
    }

    public Integer getProfitFlag() {
        return profitFlag;
    }

    public void setProfitFlag(Integer profitFlag) {
        this.profitFlag = profitFlag;
    }

    public String getCheckState() {
        return checkState;
    }

    public void setCheckState(String checkState) {
        this.checkState = checkState == null ? null : checkState.trim();
    }

    public String getComm() {
        return comm;
    }

    public void setComm(String comm) {
        this.comm = comm == null ? null : comm.trim();
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

	@Transient
	public Integer getPackSum() {
		return packSum;
	}

	public void setPackSum(Integer packSum) {
		this.packSum = packSum;
	}

	@Transient
	public Integer getMiniSum() {
		return miniSum;
	}

	public void setMiniSum(Integer miniSum) {
		this.miniSum = miniSum;
	}
}