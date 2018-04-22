package com.lenovohit.ssm.treat.model;

import java.math.BigDecimal;

//住院清单明细
public class InpatientBillDetail {
	private String billId;			//账单ID，对应InpatientBill的id字段
	private String typeCode;		//类别编码 	"01",
	private String typeName;		//类别名称 	"材料费",
	private String itemId;			//项目ID 	"01",
	private String itemName;		//项目 	"材料费",
	private BigDecimal price = new BigDecimal(0);		//单价
	private int count;				//数量
	private BigDecimal amt = new BigDecimal(0);			//总额
	private BigDecimal selfPaid = new BigDecimal(0);	//自付金额 2.95,
	private BigDecimal bookAmt = new BigDecimal(0);		//记账金额 2.95,
	private BigDecimal reductionAmt = new BigDecimal(0);//减免金额
	
	public String getTypeCode() {
		return typeCode;
	}
	public void setTypeCode(String typeCode) {
		this.typeCode = typeCode;
	}
	public String getTypeName() {
		return typeName;
	}
	public void setTypeName(String typeName) {
		this.typeName = typeName;
	}
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
	public BigDecimal getSelfPaid() {
		return selfPaid;
	}
	public void setSelfPaid(BigDecimal selfPaid) {
		this.selfPaid = selfPaid;
	}
	public BigDecimal getBookAmt() {
		return bookAmt;
	}
	public void setBookAmt(BigDecimal bookAmt) {
		this.bookAmt = bookAmt;
	}
	public BigDecimal getReductionAmt() {
		return reductionAmt;
	}
	public void setReductionAmt(BigDecimal reductionAmt) {
		this.reductionAmt = reductionAmt;
	}
	public String getBillId() {
		return billId;
	}
	public void setBillId(String billId) {
		this.billId = billId;
	}
}
