package com.lenovohit.hcp.base.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.lenovohit.core.model.BaseIdModel;

@Entity
@Table(name = "B_DICVALUE")
public class Dictionary extends HcpBaseModel {
	/**
	 * 
	 */
	private static final long serialVersionUID = -1770624887063184496L;
	private String columnGroup;// '列分组|column_group',
	private String columnName;// '列编码',
	private String columnDis;// '列名称',
	private String columnKey;// '列显示',
	private String columnVal;// '列值',
	private String sortId;// '序号',
	private Boolean defaulted = false;// '是否默认',
	private String spellCode;// '拼音|超过10位无检索意义',
	private String wbCode;// '五笔',
	private String userCode;// '自定义码',
	private Boolean stop;// '停用标志|1启用0-停用',

	public String getColumnGroup() {
		return columnGroup;
	}

	public void setColumnGroup(String columnGroup) {
		this.columnGroup = columnGroup;
	}

	public String getColumnName() {
		return columnName;
	}

	public void setColumnName(String columnName) {
		this.columnName = columnName;
	}

	public String getColumnKey() {
		return columnKey;
	}

	public void setColumnKey(String columnKey) {
		this.columnKey = columnKey;
	}

	public String getColumnVal() {
		return columnVal;
	}

	public void setColumnVal(String columnVal) {
		this.columnVal = columnVal;
	}

	public String getColumnDis() {
		return columnDis;
	}

	public void setColumnDis(String columnDis) {
		this.columnDis = columnDis;
	}

	public String getSortId() {
		return sortId;
	}

	public void setSortId(String sortId) {
		this.sortId = sortId;
	}

	@Column(name = "ISDEFAULT")
	public Boolean isDefaulted() {
		return defaulted;
	}

	public void setDefaulted(Boolean defaulted) {
		this.defaulted = defaulted;
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

	@Column(name = "STOP_FLAG")
	public Boolean isStop() {
		return stop;
	}

	public void setStop(Boolean stop) {
		this.stop = stop;
	}
}
