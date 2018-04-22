package com.lenovohit.ssm.client.model;

import javax.persistence.Entity;
import javax.persistence.Table;

import com.lenovohit.core.model.BaseIdModel;

@Entity
@Table(name="SSM_MACHINE")
public class Machine extends BaseIdModel{

	/**
	 * 
	 */
	private static final long serialVersionUID = -600585186342353144L;

	private String mac;
	private String code ;//编号	code	
	private String area_id ;//区域id		
	private String area_name ;//区域名称	
	private String hospital_id ;//医院id		
	private String hospital_name ;//医院名称		
	private String model_id ;//型号id		
	private String model_code ;//型号编码		
	private String supplier ;//厂商		
	private String mng_type ;//管理方类型		
	private String mng_id ;//管理方id		
	private String mng_name ;//管理方名称		
	private String description ;//描述		
	private String status ;//状态		
	public String getCode() {
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}
	public String getArea_id() {
		return area_id;
	}
	public void setArea_id(String area_id) {
		this.area_id = area_id;
	}
	public String getArea_name() {
		return area_name;
	}
	public void setArea_name(String area_name) {
		this.area_name = area_name;
	}
	public String getHospital_id() {
		return hospital_id;
	}
	public void setHospital_id(String hospital_id) {
		this.hospital_id = hospital_id;
	}
	public String getHospital_name() {
		return hospital_name;
	}
	public void setHospital_name(String hospital_name) {
		this.hospital_name = hospital_name;
	}
	public String getModel_id() {
		return model_id;
	}
	public void setModel_id(String model_id) {
		this.model_id = model_id;
	}
	public String getModel_code() {
		return model_code;
	}
	public void setModel_code(String model_code) {
		this.model_code = model_code;
	}
	public String getSupplier() {
		return supplier;
	}
	public void setSupplier(String supplier) {
		this.supplier = supplier;
	}
	public String getMng_type() {
		return mng_type;
	}
	public void setMng_type(String mng_type) {
		this.mng_type = mng_type;
	}
	public String getMng_id() {
		return mng_id;
	}
	public void setMng_id(String mng_id) {
		this.mng_id = mng_id;
	}
	public String getMng_name() {
		return mng_name;
	}
	public void setMng_name(String mng_name) {
		this.mng_name = mng_name;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getMac() {
		return mac;
	}
	public void setMac(String mac) {
		this.mac = mac;
	}
}
