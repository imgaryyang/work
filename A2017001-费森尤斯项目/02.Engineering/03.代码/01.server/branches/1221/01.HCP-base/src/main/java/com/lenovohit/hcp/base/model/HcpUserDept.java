package com.lenovohit.hcp.base.model;

import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "HCP_USER_DEPT") // 人员可登录科室
public class HcpUserDept extends HcpBaseModel {

	private String userId;
	private String userName;
	private String deptId;
	private String deptCode;
	private String deptName;
	private String stopFlag; // 停用标志|0-停1启

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getDeptId() {
		return deptId;
	}

	public void setDeptId(String deptId) {
		this.deptId = deptId;
	}

	public String getDeptCode() {
		return deptCode;
	}

	public void setDeptCode(String deptCode) {
		this.deptCode = deptCode;
	}

	public String getDeptName() {
		return deptName;
	}

	public void setDeptName(String deptName) {
		this.deptName = deptName;
	}

	public String getStopFlag() {
		return stopFlag;
	}

	public void setStopFlag(String stopFlag) {
		this.stopFlag = stopFlag;
	}

}
