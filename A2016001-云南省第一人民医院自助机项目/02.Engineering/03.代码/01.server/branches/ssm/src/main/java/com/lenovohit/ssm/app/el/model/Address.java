package com.lenovohit.ssm.app.el.model;


import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import com.lenovohit.core.model.BaseIdModel;

@Entity
@Table(name = "EL_ADDRESS")
public class Address extends BaseIdModel {
	private static final long serialVersionUID = 31697185029592357L;
	
	private String fkId;	//外联id
	private String fkType;	//外联类型
	private String zipcode;	//邮编
	private String areaCode;//区域代码
	private String areaName;//区域名称
	private String address;	//地址
	private String memo;	//备注

	@Column(name = "FK_ID", nullable = false, length = 32)
	public String getFkId() {
		return this.fkId;
	}

	public void setFkId(String fkId) {
		this.fkId = fkId;
	}

	@Column(name = "FK_TYPE", length = 10)
	public String getFkType() {
		return this.fkType;
	}

	public void setFkType(String fkType) {
		this.fkType = fkType;
	}

	@Column(name = "ZIPCODE", length = 6)
	public String getZipcode() {
		return this.zipcode;
	}

	public void setZipcode(String zipcode) {
		this.zipcode = zipcode;
	}

	@Column(name = "AREA_CODE", length = 6)
	public String getAreaCode() {
		return this.areaCode;
	}

	public void setAreaCode(String areaCode) {
		this.areaCode = areaCode;
	}

	@Column(name = "AREA_NAME", length = 50)
	public String getAreaName() {
		return this.areaName;
	}

	public void setAreaName(String areaName) {
		this.areaName = areaName;
	}

	@Column(name = "ADDRESS", nullable = false, length = 100)
	public String getAddress() {
		return this.address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	@Column(name = "MEMO", length = 100)
	public String getMemo() {
		return this.memo;
	}

	public void setMemo(String memo) {
		this.memo = memo;
	}

}