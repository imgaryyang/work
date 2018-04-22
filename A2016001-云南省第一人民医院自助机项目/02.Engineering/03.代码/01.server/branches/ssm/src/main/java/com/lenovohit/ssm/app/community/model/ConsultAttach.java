package com.lenovohit.ssm.app.community.model;

import javax.persistence.Entity;
import javax.persistence.Table;

import com.lenovohit.core.model.BaseIdModel;

@Entity
@Table(name = "CONSULT_ATTACH")
public class ConsultAttach extends BaseIdModel {
	private static final long serialVersionUID = 2785667409688656841L;
	private String businessId;					
	private String businessType;					
	private String filePath;					
	private String fileName;
	private String fileType;
	private String stopFlag;					
	private String createTime; 					
	private String createOper;					
	private String updateTime;					
	private String updateOper;					
	private String createOperId;					
	private String updateOperId;
	public String getStopFlag() {
		return stopFlag;
	}
	public void setStopFlag(String stopFlag) {
		this.stopFlag = stopFlag;
	}
	public String getCreateTime() {
		return createTime;
	}
	public void setCreateTime(String createTime) {
		this.createTime = createTime;
	}
	public String getCreateOper() {
		return createOper;
	}
	public void setCreateOper(String createOper) {
		this.createOper = createOper;
	}
	public String getUpdateTime() {
		return updateTime;
	}
	public void setUpdateTime(String updateTime) {
		this.updateTime = updateTime;
	}
	public String getUpdateOper() {
		return updateOper;
	}
	public void setUpdateOper(String updateOper) {
		this.updateOper = updateOper;
	}
	public String getCreateOperId() {
		return createOperId;
	}
	public void setCreateOperId(String createOperId) {
		this.createOperId = createOperId;
	}
	public String getUpdateOperId() {
		return updateOperId;
	}
	public void setUpdateOperId(String updateOperId) {
		this.updateOperId = updateOperId;
	}
}
