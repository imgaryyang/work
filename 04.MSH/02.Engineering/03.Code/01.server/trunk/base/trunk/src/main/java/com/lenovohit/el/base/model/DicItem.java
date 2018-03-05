package com.lenovohit.el.base.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.lenovohit.core.model.BaseIdModel;

@Entity
@Table(name = "EL_DIC_ITEM")
public class DicItem extends BaseIdModel {
	private static final long serialVersionUID = -4846622924311800974L;

	private Dic dic;
	private String dicId;
	private String parentId;
	private String code;
	private String text;

	@Column(name = "DIC_ID")
	public String getDicId() {
		return dicId;
	}

	public void setDicId(String dicId) {
		this.dicId = dicId;
	}

	@Column(name = "PARENT_ID", length = 32)
	public String getParentId() {
		return this.parentId;
	}

	public void setParentId(String parentId) {
		this.parentId = parentId;
	}

	@Column(name = "CODE", length = 32)
	public String getCode() {
		return this.code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	@Column(name = "TEXT", length = 200)
	public String getText() {
		return this.text;
	}

	public void setText(String text) {
		this.text = text;
	}

	@Transient
	public Dic getDic() {
		return this.dic;
	}

	public void setDic(Dic dic) {
		this.dic = dic;
	}

}