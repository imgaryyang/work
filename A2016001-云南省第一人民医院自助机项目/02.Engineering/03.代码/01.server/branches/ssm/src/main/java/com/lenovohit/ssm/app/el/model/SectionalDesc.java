package com.lenovohit.ssm.app.el.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import com.lenovohit.core.model.BaseIdModel;

@Entity
@Table(name = "EL_SECTIONAL_DESC")
public class SectionalDesc extends BaseIdModel {
	private static final long serialVersionUID = 3559956331353876090L;
	
	private String fkId;
	private String fkType;
	private String caption;
	private String body;
	private Integer sortNum;

	@Column(name = "FK_ID", length = 32)
	public String getFkId() {
		return this.fkId;
	}

	public void setFkId(String fkId) {
		this.fkId = fkId;
	}

	@Column(name = "FK_TYPE", length = 20)
	public String getFkType() {
		return this.fkType;
	}

	public void setFkType(String fkType) {
		this.fkType = fkType;
	}

	@Column(name = "CAPTION", length = 100)
	public String getCaption() {
		return this.caption;
	}

	public void setCaption(String caption) {
		this.caption = caption;
	}

	@Column(name = "BODY", length = 500)
	public String getBody() {
		return this.body;
	}

	public void setBody(String body) {
		this.body = body;
	}

	@Column(name = "SORT_NUM")
	public Integer getSortNum() {
		return this.sortNum;
	}

	public void setSortNum(Integer sortNum) {
		this.sortNum = sortNum;
	}

}