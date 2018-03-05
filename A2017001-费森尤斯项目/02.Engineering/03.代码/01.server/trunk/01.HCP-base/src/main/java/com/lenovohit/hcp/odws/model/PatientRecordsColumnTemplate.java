package com.lenovohit.hcp.odws.model;

import javax.persistence.Entity;
import javax.persistence.Table;

import com.lenovohit.hcp.base.model.HcpBaseModel;
/**
 * 病历列模板
 * @author victor
 *
 */
@Entity
@Table(name = "ow_record_column_model")
public class PatientRecordsColumnTemplate extends HcpBaseModel {
	private String owColumnType; // 分类|OW_COLUMN_TYPE
	private String columnCode;
	private String columnName;
	private String columnVal;
	private String spellCode; // 拼音|超过10位无检索意义
	private String wbCode;
	private String userCode;
	private String shareLevel; // 共享等级|SHARE_LEVEL
	private String deptId;
	private String stopFlag; // 停用标志|0-停1启

	public String getOwColumnType() {
		return owColumnType;
	}

	public void setOwColumnType(String owColumnType) {
		this.owColumnType = owColumnType;
	}

	public String getColumnCode() {
		return columnCode;
	}

	public void setColumnCode(String columnCode) {
		this.columnCode = columnCode;
	}

	public String getColumnName() {
		return columnName;
	}

	public void setColumnName(String columnName) {
		this.columnName = columnName;
	}

	public String getColumnVal() {
		return columnVal;
	}

	public void setColumnVal(String columnVal) {
		this.columnVal = columnVal;
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

	public String getUserCode() {
		return userCode;
	}

	public void setUserCode(String userCode) {
		this.userCode = userCode;
	}

	public String getShareLevel() {
		return shareLevel;
	}

	public void setShareLevel(String shareLevel) {
		this.shareLevel = shareLevel;
	}

	public String getDeptId() {
		return deptId;
	}

	public void setDeptId(String deptId) {
		this.deptId = deptId;
	}

	public String getStopFlag() {
		return stopFlag;
	}

	public void setStopFlag(String stopFlag) {
		this.stopFlag = stopFlag;
	}

}
