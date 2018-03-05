package com.lenovohit.hcp.base.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name = "B_TREE_VALUE")
public class Tree extends HcpBaseModel {

	private static final long serialVersionUID = -1770624887063184496L;

	private String parentId;
	private String dictType;
	private String key;
	private String value;
	private Integer sortId;
	private Boolean defaulted = false;// '是否默认'
	private String spellCode;// '拼音|超过10位无检索意义'
	private String wbCode;// '五笔'
	private String userCode;// '自定义码'
	private Boolean stop;// '停用标志|1停0-启'
	private String comment;
	private Boolean leaf;

	public String getParentId() {
		return parentId;
	}

	public void setParentId(String parentId) {
		this.parentId = parentId;
	}

	public String getDictType() {
		return dictType;
	}

	public void setDictType(String dictType) {
		this.dictType = dictType;
	}

	@Column(name = "DICT_KEY")
	public String getKey() {
		return key;
	}

	public void setKey(String key) {
		this.key = key;
	}

	@Column(name = "DICT_VALUE")
	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}

	public Integer getSortId() {
		return sortId;
	}

	public void setSortId(Integer sortId) {
		this.sortId = sortId;
	}

	@Column(name = "ISDEFAULT")
	public Boolean getDefaulted() {
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

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	@Column(name = "IS_LEAF")
	public Boolean isLeaf() {
		return leaf;
	}

	public void setLeaf(Boolean leaf) {
		this.leaf = leaf;
	}

}
