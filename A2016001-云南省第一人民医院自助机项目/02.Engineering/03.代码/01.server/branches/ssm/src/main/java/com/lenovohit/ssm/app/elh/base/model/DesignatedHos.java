package com.lenovohit.ssm.app.elh.base.model;

import javax.persistence.Entity;
import javax.persistence.Table;

import com.lenovohit.core.model.BaseIdModel;

/**
 * 
 * 定点医院
 */
@Entity
@Table(name="ELH_DESIGNATED_HOSPITAL")
public class DesignatedHos extends BaseIdModel {

	/**
	 * 
	 */
	private static final long serialVersionUID = -6796849509853964811L;
	public String miId;//所属医社保
	public String name;//名称
	public String area;//所属地区
	public String code;//编码
	
	public String getMiId() {
		return miId;
	}
	public void setMiId(String miId) {
		this.miId = miId;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getArea() {
		return area;
	}
	public void setArea(String area) {
		this.area = area;
	}
	public String getCode() {
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}
	
}
