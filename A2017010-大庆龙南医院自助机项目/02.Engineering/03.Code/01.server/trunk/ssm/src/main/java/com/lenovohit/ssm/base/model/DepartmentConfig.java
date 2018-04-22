package com.lenovohit.ssm.base.model;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.lenovohit.core.model.BaseIdModel;

/**
 * 科室配置表
 * @author xiaweiyi
 *
 */
@Entity
@Table(name="SSM_DEPARTMENT")
public class DepartmentConfig extends BaseIdModel{
	/**
	 * 
	 */
	private static final long serialVersionUID = 3830265018942019222L;
	private String hisId;			//部门ID
	private String code; 		//部门代码
	private String custom_code; 		//自定义码
	private String pinyin; 		//自定义码
	private String wubi; 		//自定义码
	private String area; 		//院区
	private String full_code; 		//位码
	private String status; 		//状态
	private String name;		//部门名称
	private String type;		//类型 内科 外科 等
	private String clazz;		//2 住院 1 门诊 0 住院门诊
	private String clazz_name;		//2 住院 1 门诊 0 住院门诊
	private String description;		//部门介绍
	private List<DepartmentConfig> children = new ArrayList<DepartmentConfig>();;
	
	@Transient
	public List<DepartmentConfig> getChildren() {
		return children;
	}
	public void setChildren(List<DepartmentConfig> children) {
		this.children = children;
	}
	public String getHisId() {
		return hisId;
	}
	public void setHisId(String hisId) {
		this.hisId = hisId;
	}
	public String getCode() {
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}
	public String getCustom_code() {
		return custom_code;
	}
	public void setCustom_code(String custom_code) {
		this.custom_code = custom_code;
	}
	public String getPinyin() {
		return pinyin;
	}
	public void setPinyin(String pinyin) {
		this.pinyin = pinyin;
	}
	public String getWubi() {
		return wubi;
	}
	public void setWubi(String wubi) {
		this.wubi = wubi;
	}
	public String getArea() {
		return area;
	}
	public void setArea(String area) {
		this.area = area;
	}
	public String getFull_code() {
		return full_code;
	}
	public void setFull_code(String full_code) {
		this.full_code = full_code;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getClazz() {
		return clazz;
	}
	public void setClazz(String clazz) {
		this.clazz = clazz;
	}
	public String getClazz_name() {
		return clazz_name;
	}
	public void setClazz_name(String clazz_name) {
		this.clazz_name = clazz_name;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	

}
