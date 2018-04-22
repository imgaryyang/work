package com.lenovohit.ssm.app.el.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import com.lenovohit.core.model.BaseIdModel;

/**
 * 数据字典
 * @author wang
 *
 */
@Entity
@Table(name = "EL_DIC")
public class Dic extends BaseIdModel {
	private static final long serialVersionUID = -958479289406335396L;
	
	private String code;
	private String name;

	@Column(name = "CODE", length = 50)
	public String getCode() {
		return this.code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	@Column(name = "NAME", length = 100)
	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

}