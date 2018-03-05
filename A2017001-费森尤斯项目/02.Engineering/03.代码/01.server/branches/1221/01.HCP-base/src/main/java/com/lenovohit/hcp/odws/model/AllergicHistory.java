package com.lenovohit.hcp.odws.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import com.lenovohit.hcp.base.model.HcpBaseModel;

@Entity
@Table(name = "OW_ALLERGIC") // 患者过敏历史记录
public class AllergicHistory extends HcpBaseModel {

	private static final long serialVersionUID = 1L;

	private String patientId; // 患者ID
	private String regId; // 挂号ID
	private String itemCode; // 过敏药物ID
	private String itemName; // 过敏药物名称
	private String deny; // 患者否认过敏史
	private String memo; // 备注

	public String getPatientId() {
		return patientId;
	}

	public void setPatientId(String patientId) {
		this.patientId = patientId;
	}

	public String getRegId() {
		return regId;
	}

	public void setRegId(String regId) {
		this.regId = regId;
	}

	public String getItemCode() {
		return itemCode;
	}

	public void setItemCode(String itemCode) {
		this.itemCode = itemCode;
	}

	public String getItemName() {
		return itemName;
	}

	public void setItemName(String itemName) {
		this.itemName = itemName;
	}

	@Column(name = "DENY_")
	public String getDeny() {
		return deny;
	}

	public void setDeny(String deny) {
		this.deny = deny;
	}

	public String getMemo() {
		return memo;
	}

	public void setMemo(String memo) {
		this.memo = memo;
	}

}
