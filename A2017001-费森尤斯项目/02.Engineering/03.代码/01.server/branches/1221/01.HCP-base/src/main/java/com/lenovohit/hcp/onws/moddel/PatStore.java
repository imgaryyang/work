package com.lenovohit.hcp.onws.moddel;

import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.lenovohit.hcp.base.annotation.RedisSequence;
import com.lenovohit.hcp.base.model.HcpBaseModel;

@Entity
@Table(name = "PHA_PATSTORE")
public class PatStore extends HcpBaseModel{

	private static final long serialVersionUID = -6246529075496406977L;

    private String patientId;

    private String execNo;

    private String name;

    private String recipeId;

    private Integer recipeNo;

    private String itemCode;

    private String itemName;

    private String specs;

    private BigDecimal qty;

    private String unit;
    
    private BigDecimal unitPrice;

    private String combNo;

    private String usage;

    private String freq;

    private BigDecimal dosage;

    private String dosageUnit;

    private String maker;

    private String execOper;

    private String cancelOper;
    
    private String cancelId;
    
    private Date cancelTime;
    
    private String state;
    
    private String regId;
    
    public String getPatientId() {
        return patientId;
    }

    public void setPatientId(String patientId) {
        this.patientId = patientId == null ? null : patientId.trim();
    }

    @RedisSequence
    public String getExecNo() {
        return execNo;
    }

    public void setExecNo(String execNo) {
        this.execNo = execNo == null ? null : execNo.trim();
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name == null ? null : name.trim();
    }

    public String getRecipeId() {
        return recipeId;
    }

    public void setRecipeId(String recipeId) {
        this.recipeId = recipeId == null ? null : recipeId.trim();
    }

    public Integer getRecipeNo() {
        return recipeNo;
    }

    public void setRecipeNo(Integer recipeNo) {
        this.recipeNo = recipeNo == null ? null : recipeNo;
    }

    public String getItemCode() {
        return itemCode;
    }

    public void setItemCode(String itemCode) {
        this.itemCode = itemCode == null ? null : itemCode.trim();
    }

    public String getItemName() {
        return itemName;
    }

    public void setItemName(String itemName) {
        this.itemName = itemName == null ? null : itemName.trim();
    }

    public String getSpecs() {
        return specs;
    }

    public void setSpecs(String specs) {
        this.specs = specs == null ? null : specs.trim();
    }

    public BigDecimal getQty() {
        return qty;
    }

    public void setQty(BigDecimal qty) {
        this.qty = qty;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit == null ? null : unit.trim();
    }

    public String getCombNo() {
        return combNo;
    }

    public void setCombNo(String combNo) {
        this.combNo = combNo == null ? null : combNo.trim();
    }

    @Column(name = "USAGE_", length = 30)
    public String getUsage() {
        return usage;
    }

    public void setUsage(String usage) {
        this.usage = usage == null ? null : usage.trim();
    }

    public String getFreq() {
        return freq;
    }

    public void setFreq(String freq) {
        this.freq = freq == null ? null : freq.trim();
    }

    public BigDecimal getDosage() {
        return dosage;
    }

    public void setDosage(BigDecimal dosage) {
        this.dosage = dosage;
    }

    public String getDosageUnit() {
        return dosageUnit;
    }

    public void setDosageUnit(String dosageUnit) {
        this.dosageUnit = dosageUnit == null ? null : dosageUnit.trim();
    }

    public String getMaker() {
        return maker;
    }

    public void setMaker(String maker) {
        this.maker = maker == null ? null : maker.trim();
    }

    public String getExecOper() {
        return execOper;
    }

    public void setExecOper(String execOper) {
        this.execOper = execOper == null ? null : execOper.trim();
    }

	public BigDecimal getUnitPrice() {
		return unitPrice;
	}

	public void setUnitPrice(BigDecimal unitPrice) {
		this.unitPrice = unitPrice;
	}

	public String getCancelOper() {
		return cancelOper;
	}

	public void setCancelOper(String cancelOper) {
		this.cancelOper = cancelOper;
	}

	public String getCancelId() {
		return cancelId;
	}

	public void setCancelId(String cancelId) {
		this.cancelId = cancelId;
	}

	@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
	public Date getCancelTime() {
		return cancelTime;
	}

	public void setCancelTime(Date cancelTime) {
		this.cancelTime = cancelTime;
	}

	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}

	public String getRegId() {
		return regId;
	}

	public void setRegId(String regId) {
		this.regId = regId;
	}

}