package com.lenovohit.hcp.base.model;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.Table;

import com.lenovohit.core.model.BaseIdModel;
import com.lenovohit.hcp.base.annotation.RedisSequence;

@Entity
@Table(name = "B_DEPTINFO")
public class Department extends HcpBaseModel {
	/**
	* 科室
	*/
	private static final long serialVersionUID = -6974475242575059523L;
	private String parentId;// '上级科室id',
	private String deptId;// '科室id',
	private String deptName;// '科室名称',
	private String spellCode;// '拼音|超过10位无检索意义',
	private String wbCode;// '五笔',
	private String customCode;// '自定义码',
	private String eName;// '英文名称',
	private String otherName;// '别名',
	private String deptType;// '科室类型|dept_type',
	private String isRegdept;// '是否为挂号科室'
	private String master;// '主管医生',
	private String linkTel;// '联系电话',
	private String pAddress;// '地址',
	private String introduce;// '简介',
	private String busiTime;// '开业时间',
	private String stopFlag;// '停用标志|0-停1启',


	@RedisSequence
	public String getDeptId() {
		return deptId;
	}

	public void setDeptId(String deptId) {
		this.deptId = deptId;
	}

	public String getDeptName() {
		return deptName;
	}

	public void setDeptName(String deptName) {
		this.deptName = deptName;
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

	public String geteName() {
		return eName;
	}

	public void seteName(String eName) {
		this.eName = eName;
	}

	public String getOtherName() {
		return otherName;
	}

	public void setOtherName(String otherName) {
		this.otherName = otherName;
	}

	public String getDeptType() {
		return deptType;
	}

	public void setDeptType(String deptType) {
		this.deptType = deptType;
	}

	public String getMaster() {
		return master;
	}

	public void setMaster(String master) {
		this.master = master;
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

	public String getIntroduce() {
		return introduce;
	}

	public void setIntroduce(String introduce) {
		this.introduce = introduce;
	}

	public String getBusiTime() {
		return busiTime;
	}

	public void setBusiTime(String busiTime) {
		this.busiTime = busiTime;
	}

	public String getStopFlag() {
		return stopFlag;
	}

	public void setStopFlag(String stopFlag) {
		this.stopFlag = stopFlag;
	}

	public String getCustomCode() {
		return customCode;
	}

	public void setCustomCode(String customCode) {
		this.customCode = customCode;
	}

	public String getParentId() {
		return parentId;
	}

	public void setParentId(String parentId) {
		this.parentId = parentId;
	}

	public String getIsRegdept() {
		return isRegdept;
	}

	public void setIsRegdept(String isRegdept) {
		this.isRegdept = isRegdept;
	}

}