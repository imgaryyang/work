package com.infohold.elh.treat.model;

import com.infohold.elh.pay.model.Order;

/**
 * 就医项分组（无表映射）
 * @author Administrator
 *
 */
public class TreatStep {
	private String name;
	private String bizType;
	private String updateTime;
	private String date;
	private boolean today;
	private Object bizObject;
	public TreatStep(){}
	public TreatStep(TreatDetail detail){
		this.bizObject=detail;
		this.name = detail.getBizName();
		this.bizType = detail.getBiz();
		this.updateTime = detail.getUpdateTime();
	}
	public TreatStep(Object bizObject,String name ,String bizType,String updateTime){
		this.bizObject=bizObject;
		this.name = name;
		this.bizType = bizType;
		this.updateTime = updateTime;
	}
	public TreatStep(Order order ){
		this.bizObject=order;
		this.name = "订单";
		this.bizType = "order";
		this.updateTime = order.getUpdateTime();
	}
	public Object getBizObject() {
		return bizObject;
	}
	public void setBizObject(Object bizObject) {
		this.bizObject = bizObject;
	}
	public String getBizType() {
		return bizType;
	}
	public void setBizType(String bizType) {
		this.bizType = bizType;
	}
	
	public String getUpdateTime() {
		return updateTime;
	}
	public void setUpdateTime(String updateTime) {
		this.updateTime = updateTime;
	}
	
	public String getDate() {
		return date;
	}
	public void setDate(String date) {
		this.date = date;
	}
	public boolean isToday() {
		return today;
	}
	public void setToday(boolean today) {
		this.today = today;
	}

	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
}
