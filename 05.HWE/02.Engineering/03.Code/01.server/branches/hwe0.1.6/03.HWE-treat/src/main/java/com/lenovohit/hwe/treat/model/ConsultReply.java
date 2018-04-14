package com.lenovohit.hwe.treat.model;

import javax.persistence.Entity;
import javax.persistence.Table;

import com.lenovohit.hwe.base.model.AuditableModel;

@Entity
@Table(name = "CONSULT_REPLY")
public class ConsultReply extends AuditableModel implements java.io.Serializable{
	
	public static final String STATUS_NO_READ ="0";    //未读
	public static final String STATUS_READ ="1";       //已读
	
	private static final long serialVersionUID = 2785667409688656841L;
	private String businessId;
	private String sendId;
	private String sendName;
	private String sendContent;
	private String status;      //  0未读   1已读
	private String type;
	private String stopFlag;					
	public String getBusinessId() {
		return businessId;
	}
	public void setBusinessId(String businessId) {
		this.businessId = businessId;
	}
	public String getSendId() {
		return sendId;
	}
	public void setSendId(String sendId) {
		this.sendId = sendId;
	}
	public String getSendName() {
		return sendName;
	}
	public void setSendName(String sendName) {
		this.sendName = sendName;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getStopFlag() {
		return stopFlag;
	}
	public void setStopFlag(String stopFlag) {
		this.stopFlag = stopFlag;
	}
	public String getSendContent() {
		return sendContent;
	}
	public void setSendContent(String sendContent) {
		this.sendContent = sendContent;
	}
	
	

}
