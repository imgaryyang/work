package com.infohold.elh.base.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.infohold.core.model.BaseIdModel;

/**
 * 科室表
 * @author Administrator
 *
 */
@Entity
@Table(name="ELH_DEPARTMENT")
public class Department extends BaseIdModel {
	private static final long serialVersionUID = -8065557954490776645L;
	
	public String idHlht;//院方数据ID
	public String code;//编码
	public String name;//名称
	public String address;//位置
	public String brief;//摘要
	public String description;//描述
	public String flag;//标志 0 已删除 1 正常
	public String hospitalId;//所属医院
	public Hospital hospital;//所属医院
	public boolean isSpecial;//是否特色
	public String type;//科室类型
	public int sortno;//排序
	
	public String getIdHlht() {
		return idHlht;
	}
	public void setIdHlht(String idHlht) {
		this.idHlht = idHlht;
	}
	public String getCode() {
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	public String getBrief() {
		return brief;
	}
	public void setBrief(String brief) {
		this.brief = brief;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getFlag() {
		return flag;
	}
	public void setFlag(String flag) {
		this.flag = flag;
	}
	@Column(name = "hospital")
	public String getHospitalId() {
		return hospitalId;
	}
	public void setHospitalId(String hospitalId) {
		this.hospitalId = hospitalId;
	}
	@Transient
	public Hospital getHospital() {
		return hospital;
	}
	public void setHospital(Hospital hospital) {
		this.hospital = hospital;
	}
	public boolean getIsSpecial() {
		return isSpecial;
	}
	public void setIsSpecial(boolean isSpecial) {
		this.isSpecial = isSpecial;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public int getSortno() {
		return sortno;
	}
	public void setSortno(int sortno) {
		this.sortno = sortno;
	}
	
}
