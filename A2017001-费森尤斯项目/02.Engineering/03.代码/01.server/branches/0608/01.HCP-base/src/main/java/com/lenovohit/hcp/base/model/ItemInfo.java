package com.lenovohit.hcp.base.model;

import java.math.BigDecimal;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "ITEM_INFO")
public class ItemInfo extends HcpBaseModel {
	
	private static final long serialVersionUID = 718909301658042669L;
	private String itemCode;
	private String itemName;
	private String specs;
	private String spellCode;
	private String wbCode;
	private String userCode;
	private String groupCode;
	private String priceCode;
	private BigDecimal unitPrice;
	private String unit;
	private String classCode;
	private String feeCode;
	private String defaultDept;
	private String comm;
	private boolean isgather;
	private boolean stop;
	private boolean exec;
	
	public String getItemCode() {
		return itemCode;
	}
	public void setItemCode(String itemCode) {
		this.itemCode = itemCode;
	}
	public String getItemName() {
		return itemName;
	}
	public void setItemName(String itemName) {
		this.itemName = itemName;
	}
	public String getSpecs() {
		return specs;
	}
	public void setSpecs(String specs) {
		this.specs = specs;
	}
	public String getSpellCode() {
		return spellCode;
	}
	public void setSpellCode(String spellCode) {
		this.spellCode = spellCode;
	}
	public String getWbCode() {
		return wbCode;
	}
	public void setWbCode(String wbCode) {
		this.wbCode = wbCode;
	}
	public String getUserCode() {
		return userCode;
	}
	public void setUserCode(String userCode) {
		this.userCode = userCode;
	}
	public String getGroupCode() {
		return groupCode;
	}
	public void setGroupCode(String groupCode) {
		this.groupCode = groupCode;
	}
	public String getPriceCode() {
		return priceCode;
	}
	public void setPriceCode(String priceCode) {
		this.priceCode = priceCode;
	}
	public BigDecimal getUnitPrice() {
		return unitPrice;
	}
	public void setUnitPrice(BigDecimal unitPrice) {
		this.unitPrice = unitPrice;
	}
	public String getUnit() {
		return unit;
	}
	public void setUnit(String unit) {
		this.unit = unit;
	}
	public String getClassCode() {
		return classCode;
	}
	public void setClassCode(String classCode) {
		this.classCode = classCode;
	}
	public String getFeeCode() {
		return feeCode;
	}
	public void setFeeCode(String feeCode) {
		this.feeCode = feeCode;
	}
	public String getDefaultDept() {
		return defaultDept;
	}
	public void setDefaultDept(String defaultDept) {
		this.defaultDept = defaultDept;
	}
	public String getComm() {
		return comm;
	}
	public void setComm(String comm) {
		this.comm = comm;
	}
	public boolean getIsgather() {
		return isgather;
	}
	public void setIsgather(boolean isgather) {
		this.isgather = isgather;
	}
	@Column(name = "STOP_FLAG")
	public Boolean isStop() {
		return stop;
	}

	public void setStop(Boolean stop) {
		this.stop = stop;
	}
	
	@Column(name = "EXEC_FLAG")
	public Boolean isExec() {
		return exec;
	}

	public void setExec(Boolean exec) {
		this.exec = exec;
	}
}
