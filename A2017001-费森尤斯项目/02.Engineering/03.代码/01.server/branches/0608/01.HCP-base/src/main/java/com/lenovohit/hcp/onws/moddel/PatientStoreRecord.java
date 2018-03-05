package com.lenovohit.hcp.onws.moddel;

import java.math.BigDecimal;

import com.lenovohit.hcp.base.model.Department;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.card.model.Patient;

public class PatientStoreRecord {

    private String regId;
    
    private String regNo;
    
    private Department seeDept;
    
    private HcpUser seeDoc;
    
    private Patient patient;

    private String recipeId;

    private Integer recipeNo;

    private String itemId;

    private String itemName;
    
    private String unit;
    
    private BigDecimal unitPrice;

    private String combNo;

    private BigDecimal qty;

    private BigDecimal useQty;

    private BigDecimal remainQty;
    
    private BigDecimal thisQty;
    
    private BigDecimal totalMoney;
    
    public String getRegId() {
        return regId;
    }

    public void setRegId(String regId) {
        this.regId = regId == null ? null : regId.trim();
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
        this.recipeNo = recipeNo;
    }

    public String getItemId() {
        return itemId;
    }

    public void setItemId(String itemId) {
        this.itemId = itemId == null ? null : itemId.trim();
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

    public BigDecimal getQty() {
        return qty;
    }

    public void setQty(BigDecimal qty) {
        this.qty = qty;
    }

    public BigDecimal getUseQty() {
        return useQty;
    }

    public void setUseQty(BigDecimal useQty) {
        this.useQty = useQty;
    }

    public BigDecimal getRemainQty() {
        return remainQty;
    }

    public void setRemainQty(BigDecimal remainQty) {
        this.remainQty = remainQty;
    }

	public Patient getPatient() {
		return patient;
	}

	public void setPatient(Patient patient) {
		this.patient = patient;
	}

	public BigDecimal getThisQty() {
		return thisQty;
	}

	public void setThisQty(BigDecimal thisQty) {
		this.thisQty = thisQty;
	}

	public BigDecimal getTotalMoney() {
		return totalMoney;
	}

	public void setTotalMoney(BigDecimal totalMoney) {
		this.totalMoney = totalMoney;
	}

	public Department getSeeDept() {
		return seeDept;
	}

	public void setSeeDept(Department seeDept) {
		this.seeDept = seeDept;
	}

	public HcpUser getSeeDoc() {
		return seeDoc;
	}

	public void setSeeDoc(HcpUser seeDoc) {
		this.seeDoc = seeDoc;
	}

	public String getRegNo() {
		return regNo;
	}

	public void setRegNo(String regNo) {
		this.regNo = regNo;
	}

	public String getItemName() {
		return itemName;
	}

	public void setItemName(String itemName) {
		this.itemName = itemName;
	}

	public BigDecimal getUnitPrice() {
		return unitPrice;
	}

	public void setUnitPrice(BigDecimal unitPrice) {
		this.unitPrice = unitPrice;
	}
}