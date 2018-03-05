package com.lenovohit.hcp.base.model;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonFormat;
@Entity 
@Table(name = "TRAIN_EXPERIENCE")//患者培训经历;
public class TrainExperience extends HcpBaseModel{

	private static final long serialVersionUID = -7731028339917102932L;
	
	private String userId;		//用户ID
	
	private String trainOrg;	//培训机构
	
	private String trainType;	//培训类型
	
	private String trainContent;//培训内容
	
	private Date startTime;		//培训开始时间
	
	private Date endTime;		//培训结束时间

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getTrainOrg() {
		return trainOrg;
	}

	public void setTrainOrg(String trainOrg) {
		this.trainOrg = trainOrg;
	}

	public String getTrainType() {
		return trainType;
	}

	public void setTrainType(String trainType) {
		this.trainType = trainType;
	}

	public String getTrainContent() {
		return trainContent;
	}

	public void setTrainContent(String trainContent) {
		this.trainContent = trainContent;
	}

	@JsonFormat(pattern = "yyyy-MM-dd", timezone = "GMT+8")
	public Date getStartTime() {
		return startTime;
	}

	public void setStartTime(Date startTime) {
		this.startTime = startTime;
	}

	@JsonFormat(pattern = "yyyy-MM-dd", timezone = "GMT+8")
	public Date getEndTime() {
		return endTime;
	}

	public void setEndTime(Date endTime) {
		this.endTime = endTime;
	}
	
}