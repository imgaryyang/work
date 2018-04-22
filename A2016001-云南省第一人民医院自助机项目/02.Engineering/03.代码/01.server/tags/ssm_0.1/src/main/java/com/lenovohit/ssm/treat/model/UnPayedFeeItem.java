package com.lenovohit.ssm.treat.model;

import java.math.BigDecimal;

public class UnPayedFeeItem {
	
	private int index;				//
	private String typeId;			//
	private String typeName;		//
	private String itemName;		//
	private int count;				//
	private BigDecimal price;		//
	private BigDecimal totalAmt;	//
	private String prescriptionId;	//
	
	public int getIndex() {
		return index;
	}
	public void setIndex(int index) {
		this.index = index;
	}
	public String getTypeId() {
		return typeId;
	}
	public void setTypeId(String typeId) {
		this.typeId = typeId;
	}
	public String getTypeName() {
		return typeName;
	}
	public void setTypeName(String typeName) {
		this.typeName = typeName;
	}
	public String getItemName() {
		return itemName;
	}
	public void setItemName(String itemName) {
		this.itemName = itemName;
	}
	public int getCount() {
		return count;
	}
	public void setCount(int count) {
		this.count = count;
	}
	public BigDecimal getPrice() {
		return price;
	}
	public void setPrice(BigDecimal price) {
		this.price = price;
	}
	public BigDecimal getTotalAmt() {
		return totalAmt;
	}
	public void setTotalAmt(BigDecimal totalAmt) {
		this.totalAmt = totalAmt;
	}
	public String getPrescriptionId() {
		return prescriptionId;
	}
	public void setPrescriptionId(String prescriptionId) {
		this.prescriptionId = prescriptionId;
	}
}
