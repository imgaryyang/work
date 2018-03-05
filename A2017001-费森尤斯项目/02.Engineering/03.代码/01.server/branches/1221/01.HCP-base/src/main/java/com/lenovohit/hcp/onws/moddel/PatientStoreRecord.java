package com.lenovohit.hcp.onws.moddel;

import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

import com.lenovohit.hcp.base.model.Department;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.base.model.ItemInfo;
import com.lenovohit.hcp.card.model.Patient;

@Entity
@Table(name = "PATIENTSTORE_RECORD")
public class PatientStoreRecord {

    private String id;
    
    private String hosId;
    
    private String regId;
    
    private String regNo;
    
    private String seeDeptId;
    
    private Department seeDept;
    
    private String seeDocId;

    private HcpUser seeDoc;
    
    private String patientId;
    
    private Patient patient;

    private String recipeId;

    private Integer recipeNo;

    private String itemId;

    private ItemInfo itemInfo;
    
    private String unit;

    private String combNo;

    private Date chargeTime;

    private BigDecimal qty;

    private BigDecimal useQty;

    private BigDecimal remainQty;
    
    private BigDecimal thisQty;
    
    private BigDecimal totalMoney;
    
    private String invoiceNo;
    
    private String applyState;
    
	@Id
	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

    public String getRegId() {
        return regId;
    }

    public void setRegId(String regId) {
        this.regId = regId;
    }

    @Transient
    public String getPatientId() {
        return patientId;
    }

    public void setPatientId(String patientId) {
        this.patientId = patientId;
    }

    public String getRecipeId() {
        return recipeId;
    }

    public void setRecipeId(String recipeId) {
        this.recipeId = recipeId;
    }

    public Integer getRecipeNo() {
        return recipeNo;
    }

    public void setRecipeNo(Integer recipeNo) {
        this.recipeNo = recipeNo;
    }

    @Transient
    public String getItemId() {
        return itemId;
    }

    public void setItemId(String itemId) {
        this.itemId = itemId;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public String getCombNo() {
        return combNo;
    }

    public void setCombNo(String combNo) {
        this.combNo = combNo;
    }

    public Date getChargeTime() {
        return chargeTime;
    }

    public void setChargeTime(Date chargeTime) {
        this.chargeTime = chargeTime;
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

    @ManyToOne
	@JoinColumn(name = "PATIENT_ID", nullable = true)
	@NotFound(action=NotFoundAction.IGNORE)
	public Patient getPatient() {
		return patient;
	}

	public void setPatient(Patient patient) {
		this.patient = patient;
	}

	@ManyToOne
	@JoinColumn(name = "ITEM_ID", nullable = true)
	@NotFound(action=NotFoundAction.IGNORE)
	public ItemInfo getItemInfo() {
		return itemInfo;
	}

	public void setItemInfo(ItemInfo itemInfo) {
		this.itemInfo = itemInfo;
	}

	@Transient
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

	public String getHosId() {
		return hosId;
	}

	public void setHosId(String hosId) {
		this.hosId = hosId;
	}

	@Transient
	public String getSeeDeptId() {
		return seeDeptId;
	}

	public void setSeeDeptId(String seeDeptId) {
		this.seeDeptId = seeDeptId;
	}

	@ManyToOne
	@JoinColumn(name = "SEE_DEPT_ID", nullable = true)
	@NotFound(action=NotFoundAction.IGNORE)
	public Department getSeeDept() {
		return seeDept;
	}

	public void setSeeDept(Department seeDept) {
		this.seeDept = seeDept;
	}

	@Transient
	public String getSeeDocId() {
		return seeDocId;
	}

	public void setSeeDocId(String seeDocId) {
		this.seeDocId = seeDocId;
	}

	@ManyToOne
	@JoinColumn(name = "SEE_DOC_ID", nullable = true)
	@NotFound(action=NotFoundAction.IGNORE)
	public HcpUser getSeeDoc() {
		return seeDoc;
	}

	public void setSeeDoc(HcpUser seeDoc) {
		this.seeDoc = seeDoc;
	}

	public String getInvoiceNo() {
		return invoiceNo;
	}

	public void setInvoiceNo(String invoiceNo) {
		this.invoiceNo = invoiceNo;
	}

	public String getRegNo() {
		return regNo;
	}

	public void setRegNo(String regNo) {
		this.regNo = regNo;
	}

	public String getApplyState() {
		return applyState;
	}

	public void setApplyState(String applyState) {
		this.applyState = applyState;
	}
}