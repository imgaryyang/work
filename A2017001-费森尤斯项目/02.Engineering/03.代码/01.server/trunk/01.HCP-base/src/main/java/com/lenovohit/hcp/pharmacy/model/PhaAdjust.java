package com.lenovohit.hcp.pharmacy.model;

import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.Table;

import com.lenovohit.hcp.base.annotation.RedisSequence;
import com.lenovohit.hcp.base.model.HcpBaseModel;


@Entity
@Table(name = "PHA_ADJUST") // 药房药库 - 药品调价
public class PhaAdjust extends HcpBaseModel {


	private static final long serialVersionUID = -6146529075496427977L;

    private String adjustBill;		//调价单号

    private String storeId;			//库存id

    private Integer serialNo;		//序号

    private String deptId;			//库房

    private String drugType;		//药品分类			

    private String drugCode;		//药品编号

    private String tradeName;		//商品名称

    private String specs;			//药品规格

    private BigDecimal startBuy;	//起始采购价

    private BigDecimal endBuy;   	//结束采购价

    private BigDecimal startSale; 	//起始零售价

    private BigDecimal endSale;		//结束零售价

    private BigDecimal chargeSum;	//调价数量

    private String minUnit;			//最小单位

    private Date exeTime;			//执行时间

    private Integer profitFlag;		//盈亏标志

    private String adjustState;		//调价状态

    private String comm;			//调价原因
    
    private String adjustId;		//调价id

    @RedisSequence
    public String getAdjustId() {
        return adjustId;
    }

    public void setAdjustId(String adjustId) {
        this.adjustId = adjustId == null ? null : adjustId.trim();
    }

    @RedisSequence
    public String getAdjustBill() {
        return adjustBill;
    }

    public void setAdjustBill(String adjustBill) {
        this.adjustBill = adjustBill == null ? null : adjustBill.trim();
    }

    public String getStoreId() {
        return storeId;
    }

    public void setStoreId(String storeId) {
        this.storeId = storeId == null ? null : storeId.trim();
    }

    public Integer getSerialNo() {
        return serialNo;
    }

    public void setSerialNo(Integer serialNo) {
        this.serialNo = serialNo;
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

    public BigDecimal getStartBuy() {
        return startBuy;
    }

    public void setStartBuy(BigDecimal startBuy) {
        this.startBuy = startBuy;
    }

    public BigDecimal getEndBuy() {
        return endBuy;
    }

    public void setEndBuy(BigDecimal endBuy) {
        this.endBuy = endBuy;
    }

    public BigDecimal getStartSale() {
        return startSale;
    }

    public void setStartSale(BigDecimal startSale) {
        this.startSale = startSale;
    }

    public BigDecimal getEndSale() {
        return endSale;
    }

    public void setEndSale(BigDecimal endSale) {
        this.endSale = endSale;
    }

    public BigDecimal getChargeSum() {
        return chargeSum;
    }

    public void setChargeSum(BigDecimal chargeSum) {
        this.chargeSum = chargeSum;
    }

    public String getMinUnit() {
        return minUnit;
    }

    public void setMinUnit(String minUnit) {
        this.minUnit = minUnit == null ? null : minUnit.trim();
    }

    public Date getExeTime() {
        return exeTime;
    }

    public void setExeTime(Date exeTime) {
        this.exeTime = exeTime;
    }

    public Integer getProfitFlag() {
        return profitFlag;
    }

    public void setProfitFlag(Integer profitFlag) {
        this.profitFlag = profitFlag;
    }

    public String getAdjustState() {
        return adjustState;
    }

    public void setAdjustState(String adjustState) {
        this.adjustState = adjustState == null ? null : adjustState.trim();
    }

    public String getComm() {
        return comm;
    }

    public void setComm(String comm) {
        this.comm = comm == null ? null : comm.trim();
    }
}