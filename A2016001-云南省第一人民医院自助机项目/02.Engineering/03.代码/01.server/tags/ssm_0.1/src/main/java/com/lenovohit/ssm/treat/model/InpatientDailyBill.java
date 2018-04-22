package com.lenovohit.ssm.treat.model;

import java.util.List;

public class InpatientDailyBill {
	private String id;// "001",
	private String name;// "普通病房床位费",
	private String price;// 44,
	private String count;// 1,
	private String amt;// 44
	
	private List<InpatientDailyBillDetail> items;
	public List<InpatientDailyBillDetail> getItems() {
		return items;
	}
	public void setItems(List<InpatientDailyBillDetail> items) {
		this.items = items;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getPrice() {
		return price;
	}
	public void setPrice(String price) {
		this.price = price;
	}
	public String getCount() {
		return count;
	}
	public void setCount(String count) {
		this.count = count;
	}
	public String getAmt() {
		return amt;
	}
	public void setAmt(String amt) {
		this.amt = amt;
	}
}
