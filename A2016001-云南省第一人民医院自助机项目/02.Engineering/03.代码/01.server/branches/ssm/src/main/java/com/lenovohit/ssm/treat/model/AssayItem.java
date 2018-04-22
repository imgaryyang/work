package com.lenovohit.ssm.treat.model;

public class AssayItem {
	
	private String id;		//检查项目ID
	private int index;	// 0,
	private String item;	//检查项目 "游离三碘甲状腺氨酸",
	private String result;	//检查结果 "1.53",
	private String state;	//状态指标 "3",
	private String range;	//参考范围 "1.80 - 4.10",
	private String unit;	//单位 "pg/ml"
	private String assayId;	//检查单ID
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public int getIndex() {
		return index;
	}
	public void setIndex(int index) {
		this.index = index;
	}
	public String getItem() {
		return item;
	}
	public void setItem(String item) {
		this.item = item;
	}
	public String getResult() {
		return result;
	}
	public void setResult(String result) {
		this.result = result;
	}
	public String getState() {
		return state;
	}
	public void setState(String state) {
		this.state = state;
	}
	public String getRange() {
		return range;
	}
	public void setRange(String range) {
		this.range = range;
	}
	public String getUnit() {
		return unit;
	}
	public void setUnit(String unit) {
		this.unit = unit;
	}
	public String getAssayId() {
		return assayId;
	}
	public void setAssayId(String assayId) {
		this.assayId = assayId;
	}
}
