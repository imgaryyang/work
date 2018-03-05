package com.infohold.el.base.model;

import java.util.HashMap;
import java.util.Map;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.infohold.core.model.BaseIdModel;

@Entity
@Table(name = "EL_NOTICE")
public class Notice extends BaseIdModel{
	private static final long serialVersionUID = 4201929958279618676L;
	public static String NOT_STATUE_INIT = "0";
	public static String NOT_STATUE_SENT = "1";
	public static String NOT_STATUE_READ = "2";
	public static String NOT_STATUE_ANSWERED = "2";
	public static String NOT_STATUE_FAILED = "4";
	public static String NOT_STATUE_CLOSED = "9";
	

	public static String NOT_MODE_ALL = "0";
	public static String NOT_MODE_APP = "1";
	public static String NOT_MODE_WEB = "2";
	public static String NOT_MODE_MSG = "3";
	public static String NOT_MODE_MAIL = "4";
	public static String NOT_MODE_QQ = "5";
	public static String NOT_MODE_WX = "6";
	public static String NOT_MODE_OHTER = "9";
	
	
	public static String NOT_TYPE_SYS = "00";
	public static String NOT_TYPE_APP_PAY = "10";
	public static String NOT_TYPE_APP_GUI = "11";
	public static String NOT_TYPE_APP_SAL = "12";

	public static String NOT_TYPE_MSG_REG = "20";
	public static String NOT_TYPE_MSG_RET = "21";
	public static String NOT_TYPE_MSG_CHK = "22";
	
	
	private String title;
	private String content;
	private String target;
	private String type;
	private String mode;
	private String apps;
	private String receiverType;
	private String receiverValue;
	private String orgId;
	private String orgName;
	private String memo;
	private String state;
	private String createdBy;
	private String createdAt;
	private String updatedBy;
	private String updatedAt;
	
	private Map<String, String> extraParams = new HashMap<String, String>();
	
	
	@Column(name = "TITLE")
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	
	@Column(name = "CONTENT")
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}
	
	@Column(name = "TARGET")
	public String getTarget() {
		return target;
	}
	public void setTarget(String target) {
		this.target = target;
	}
	
	@Column(name = "TYPE")
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	
	@Column(name = "MODE")
	public String getMode() {
		return mode;
	}
	public void setMode(String mode) {
		this.mode = mode;
	}
	
	@Column(name = "APPS")
	public String getApps() {
		return apps;
	}
	public void setApps(String apps) {
		this.apps = apps;
	}
	
	@Column(name = "RECEIVER_TYPE")
	public String getReceiverType() {
		return receiverType;
	}
	public void setReceiverType(String receiverType) {
		this.receiverType = receiverType;
	}
	
	@Column(name = "RECEIVER_VALUE")
	public String getReceiverValue() {
		return receiverValue;
	}
	public void setReceiverValue(String receiverValue) {
		this.receiverValue = receiverValue;
	}
	
	@Column(name = "ORG_ID")
	public String getOrgId() {
		return orgId;
	}
	public void setOrgId(String orgId) {
		this.orgId = orgId;
	}
	
	@Column(name = "ORG_NAME")
	public String getOrgName() {
		return orgName;
	}
	public void setOrgName(String orgName) {
		this.orgName = orgName;
	}
	
	@Column(name = "MEMO")
	public String getMemo() {
		return memo;
	}
	public void setMemo(String memo) {
		this.memo = memo;
	}
	
	@Column(name = "STATE")
	public String getState() {
		return state;
	}
	public void setState(String state) {
		this.state = state;
	}
	
	@Column(name = "CREATED_BY")
	public String getCreatedBy() {
		return createdBy;
	}
	public void setCreatedBy(String createdBy) {
		this.createdBy = createdBy;
	}
	
	@Column(name = "CREATED_AT")
	public String getCreatedAt() {
		return createdAt;
	}
	public void setCreatedAt(String createdAt) {
		this.createdAt = createdAt;
	}
	
	@Column(name = "UPDATED_BY")
	public String getUpdatedBy() {
		return updatedBy;
	}
	public void setUpdatedBy(String updatedBy) {
		this.updatedBy = updatedBy;
	}
	
	@Column(name = "UPDATED_AT")
	public String getUpdatedAt() {
		return updatedAt;
	}
	public void setUpdatedAt(String updatedAt) {
		this.updatedAt = updatedAt;
	}
	
	@Transient
	public Map<String, String> getExtraParams() {
		return extraParams;
	}
	public void setExtraParams(Map<String, String> extraParams) {
		this.extraParams = extraParams;
	}
	
}