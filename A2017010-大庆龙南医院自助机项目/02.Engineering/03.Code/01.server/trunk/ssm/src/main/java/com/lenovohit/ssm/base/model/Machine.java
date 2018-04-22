package com.lenovohit.ssm.base.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.lenovohit.core.model.BaseIdModel;

@Entity
@Table(name="SSM_MACHINE")
public class Machine extends BaseIdModel{
	private static final long serialVersionUID = -600585186342353144L;

	private String code ;//编号
	private String name;//名称
	private String hospitalNo ;//医院编号		
	private String hospitalName ;//医院名称
	private String areaId ;//区域id
	private String areaCode;//区域代码
	private String areaName ;//区域名称
	private String mngId ;//管理方id		
	private String mngCode ;//管理方编号			
	private String mngName ;//管理方名称	
	private String mngType ;//管理方类型	
	private String hisUser;//HIS用户
	private String mac;	//MAC
	private String ip;//Ip
	private String modelId ;//型号id		
	private String modelCode ;//型号编码		
	private String supplier ;//厂商
	
	private int medicalRecords;
	private String isMedicalRecord;// 是否允许打印病历
	private int cardRecords;
	private String isCardRecord;// 是否允许打印就诊卡
	private int a4Records;
	private String isA4Record;// 是否允许a4打印
	private int a5Records;
	private String isA5Record;// 是否允a5打印

	private Date updateTime;//更新时间	
	private String updateUser;//更新人
	private Date regTime;//注册时间
	private String regUser;//注册人
	private String description ;//描述		
	private String status ;//状态		
	
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
	public String getHospitalNo() {
		return hospitalNo;
	}
	public void setHospitalNo(String hospitalNo) {
		this.hospitalNo = hospitalNo;
	}
	public String getHospitalName() {
		return hospitalName;
	}
	public void setHospitalName(String hospitalName) {
		this.hospitalName = hospitalName;
	}
	public String getAreaId() {
		return areaId;
	}
	public void setAreaId(String areaId) {
		this.areaId = areaId;
	}
	public String getAreaCode() {
		return areaCode;
	}
	public void setAreaCode(String areaCode) {
		this.areaCode = areaCode;
	}
	public String getAreaName() {
		return areaName;
	}
	public void setAreaName(String areaName) {
		this.areaName = areaName;
	}
	public String getMngId() {
		return mngId;
	}
	public void setMngId(String mngId) {
		this.mngId = mngId;
	}
	public String getMngType() {
		return mngType;
	}
	public void setMngType(String mngType) {
		this.mngType = mngType;
	}
	public String getMngCode() {
		return mngCode;
	}
	public void setMngCode(String mngCode) {
		this.mngCode = mngCode;
	}
	public String getMngName() {
		return mngName;
	}
	public void setMngName(String mngName) {
		this.mngName = mngName;
	}
	public String getHisUser() {
		return hisUser;
	}
	public void setHisUser(String hisUser) {
		this.hisUser = hisUser;
	}
	public String getMac() {
		return mac;
	}
	public void setMac(String mac) {
		this.mac = mac;
	}
	public String getIp() {
		return ip;
	}
	public void setIp(String ip) {
		this.ip = ip;
	}
	public String getModelId() {
		return modelId;
	}
	public void setModelId(String modelId) {
		this.modelId = modelId;
	}
	public String getModelCode() {
		return modelCode;
	}
	public void setModelCode(String modelCode) {
		this.modelCode = modelCode;
	}
	public String getSupplier() {
		return supplier;
	}
	public void setSupplier(String supplier) {
		this.supplier = supplier;
	}
	public int getMedicalRecords() {
		return medicalRecords;
	}
	public void setMedicalRecords(int medicalRecords) {
		this.medicalRecords = medicalRecords;
	}
	public String getIsMedicalRecord() {
		return isMedicalRecord;
	}
	public void setIsMedicalRecord(String isMedicalRecord) {
		this.isMedicalRecord = isMedicalRecord;
	}
	public int getCardRecords() {
		return cardRecords;
	}
	public void setCardRecords(int cardRecords) {
		this.cardRecords = cardRecords;
	}
	public String getIsCardRecord() {
		return isCardRecord;
	}
	public void setIsCardRecord(String isCardRecord) {
		this.isCardRecord = isCardRecord;
	}
	
	@Column(name = "A4_RECORDS")
	public int getA4Records() {
		return a4Records;
	}
	public void setA4Records(int a4Records) {
		this.a4Records = a4Records;
	}
	@Column(name = "IS_A4_RECORD")
	public String getIsA4Record() {
		return isA4Record;
	}
	public void setIsA4Record(String isA4Record) {
		this.isA4Record = isA4Record;
	}
	@Column(name = "A5_RECORDS")
	public int getA5Records() {
		return a5Records;
	}
	public void setA5Records(int a5Records) {
		this.a5Records = a5Records;
	}
	@Column(name = "IS_A5_RECORD")
	public String getIsA5Record() {
		return isA5Record;
	}
	public void setIsA5Record(String isA5Record) {
		this.isA5Record = isA5Record;
	}
	@JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
	public Date getUpdateTime() {
		return updateTime;
	}
	public void setUpdateTime(Date updateTime) {
		this.updateTime = updateTime;
	}
	public String getUpdateUser() {
		return updateUser;
	}
	public void setUpdateUser(String updateUser) {
		this.updateUser = updateUser;
	}
	@JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
	public Date getRegTime() {
		return regTime;
	}
	public void setRegTime(Date regTime) {
		this.regTime = regTime;
	}
	public String getRegUser() {
		return regUser;
	}
	public void setRegUser(String regUser) {
		this.regUser = regUser;
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

}