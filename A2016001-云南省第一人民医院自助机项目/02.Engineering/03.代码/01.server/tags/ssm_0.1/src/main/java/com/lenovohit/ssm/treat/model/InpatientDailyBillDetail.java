package com.lenovohit.ssm.treat.model;

import java.math.BigDecimal;

//住院日清单
public class InpatientDailyBillDetail {
	private String itemId;		// "001",
	private String itemName;	//医疗收费项目/序列号（规格） "普通病房床位费",
	private BigDecimal price;	//单价 
	private int count;			//数量 
	private BigDecimal amt;		//金额
	
	public String getItemId() {
		return itemId;
	}
	public void setItemId(String itemId) {
		this.itemId = itemId;
	}
	public String getItemName() {
		return itemName;
	}
	public void setItemName(String itemName) {
		this.itemName = itemName;
	}
	public BigDecimal getPrice() {
		return price;
	}
	public void setPrice(BigDecimal price) {
		this.price = price;
	}
	public int getCount() {
		return count;
	}
	public void setCount(int count) {
		this.count = count;
	}
	public BigDecimal getAmt() {
		return amt;
	}
	public void setAmt(BigDecimal amt) {
		this.amt = amt;
	}
}
