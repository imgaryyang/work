package com.lenovohit.ssm.app.elh.treat.model;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * 就医项分组（无表映射）
 * @author Administrator
 *
 */
public class TreatGroup {
	private String name;
	private String bizType;
	private String updateTime;
	private String date;
	private boolean today;
	private List<Object> treatDetails = new ArrayList<Object>();
	private List<TreatStep> steps;
	
	public List<TreatStep> getSteps() {
		return steps;
	}
	public void setSteps(List<TreatStep> steps) {
		this.steps = steps;
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
	@JsonIgnore
	public List<Object> getTreatDetails() {
		return treatDetails;
	}
	public void setTreatDetails(List<Object> treatDetails) {
		this.treatDetails = treatDetails;
	}
	public void addDetail(Object detail){
		this.treatDetails.add(detail);
	}
	public void addStep(TreatStep step){
		if(null==steps)steps = new ArrayList<TreatStep>();
		this.steps.add(step);
	}
}
