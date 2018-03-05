package com.lenovohit.hcp.base.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.lenovohit.core.model.BaseIdModel;
import com.lenovohit.hcp.base.annotation.RedisSequence;

@Entity 
@Table(name = "B_HOSINFO")//医院信息表
public class Hospital extends BaseIdModel {
	/**
	 * 
	 */
	private static final long serialVersionUID = 7922779261617099919L;
	private String parentId            ;// '上级机构'
	private String hosId               ;// '医院id|以h开头，第2、3位为等级，4-7为集团编码，8-10为序号',
	private String hosArea             ;// '院区'
	private String hosName             ;// '医院名称',
	private String spellCode           ;// '拼音|超过10位无检索意义',
	private String wbCode              ;// '五笔',
	private String customCode          ;// '自定义码',
	private String hName               ;// '医院简称',
	private String eName               ;// '英文名称',
	private String hosGrade            ;// '医院等级|hos_grade',
	private String hosType             ;// '医院类型|综合医院、专科医院、民营、门诊',
	private String groupId             ;// '组织机构代码',
	private String introduce           ;// '简介',
	private String linkTel             ;// '联系电话|多个电话用英文逗号隔开',
	private String pAddress            ;// '地址',
	private String hosLocation         ;//'医院坐标',
	private Date busiTime              ;//'开业时间',
	private Boolean stopFlag            ;//'停用标志|0-停1启',
	private Date createTime            ;//'创建时间',
	private String createOper          ;//'创建人员',
	private Date updateTime            ;//'更新时间',
	private String updateOper          ;//'更新人员',
	
	public String getParentId() {
		return parentId;
	}
	public void setParentId(String parentId) {
		this.parentId = parentId;
	}
	@RedisSequence
	public String getHosId() {
		return hosId;
	}
	public void setHosId(String hosId) {
		this.hosId = hosId;
	}
	public String getHosArea() {
		return hosArea;
	}
	public void setHosArea(String hosArea) {
		this.hosArea = hosArea;
	}
	public String getHosName() {
		return hosName;
	}
	public void setHosName(String hosName) {
		this.hosName = hosName;
	}
	public String getSpellCode() {
		return spellCode;
	}
	public void setSpellCode(String spellCode) {
		this.spellCode = spellCode;
	}
	public String getWbCode() {
		return wbCode;
	}
	public void setWbCode(String wbCode) {
		this.wbCode = wbCode;
	}
	public String getCustomCode() {
		return customCode;
	}
	public void setCustomCode(String customCode) {
		this.customCode = customCode;
	}
	public String gethName() {
		return hName;
	}
	public void sethName(String hName) {
		this.hName = hName;
	}
	public String geteName() {
		return eName;
	}
	public void seteName(String eName) {
		this.eName = eName;
	}
	public String getHosGrade() {
		return hosGrade;
	}
	public void setHosGrade(String hosGrade) {
		this.hosGrade = hosGrade;
	}
	public String getHosType() {
		return hosType;
	}
	public void setHosType(String hosType) {
		this.hosType = hosType;
	}
	public String getGroupId() {
		return groupId;
	}
	public void setGroupId(String groupId) {
		this.groupId = groupId;
	}
	public String getIntroduce() {
		return introduce;
	}
	public void setIntroduce(String introduce) {
		this.introduce = introduce;
	}
	public String getLinkTel() {
		return linkTel;
	}
	public void setLinkTel(String linkTel) {
		this.linkTel = linkTel;
	}
	public String getpAddress() {
		return pAddress;
	}
	public void setpAddress(String pAddress) {
		this.pAddress = pAddress;
	}
	public String getHosLocation() {
		return hosLocation;
	}
	public void setHosLocation(String hosLocation) {
		this.hosLocation = hosLocation;
	}
	@Column(name="BUSI_TIME")
	@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
	public Date getBusiTime() {
		return busiTime;
	}
	public void setBusiTime(Date busiTime) {
		this.busiTime = busiTime;
	}
	public Boolean getStopFlag() {
		return stopFlag;
	}
	public void setStopFlag(Boolean stopFlag) {
		this.stopFlag = stopFlag;
	}
	@Column(name="CREATE_TIME")
	@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
	public Date getCreateTime() {
		return createTime;
	}
	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}
	public String getCreateOper() {
		return createOper;
	}
	public void setCreateOper(String createOper) {
		this.createOper = createOper;
	}
	@Column(name="UPDATE_TIME")
	@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
	public Date getUpdateTime() {
		return updateTime;
	}
	public void setUpdateTime(Date updateTime) {
		this.updateTime = updateTime;
	}
	public String getUpdateOper() {
		return updateOper;
	}
	public void setUpdateOper(String updateOper) {
		this.updateOper = updateOper;
	}

}