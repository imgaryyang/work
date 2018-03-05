package com.lenovohit.hcp.card.model;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.lenovohit.hcp.base.annotation.RedisSequence;
import com.lenovohit.hcp.base.model.HcpBaseModel;

@Entity
@Table(name = "B_PATIENTINFO") // 病人基本信息;
public class Patient extends HcpBaseModel {

	private static final long serialVersionUID = -7692302756410456697L;
	private String patientId;// 病人id,

	private String medicalCardNo;// 诊疗卡号
	private String miCardNo;// 医保卡号

	private String idNo;// 身份证,
	private String name;// 姓名,
	private String alias;// 隐私别名,
	private String sex;// 性别|sex,
	private Date birthday;// 生日,
	private String idAddress;// 住址,

	private String nationality;// 国籍|nationality,
	private String nation;// 民族|nation,

	private String province;// 省份|province,
	private String city;// 地市|city,
	private String area;// 区县|area,
	private String linkAddress;// 通讯地址,
	private String othDetail;// 余址详细,

	private String mobile;// 手机号,
	private String wechat;// 微信,
	private String qq;// qq,
	private String eMail;// 邮箱,

	private String linkRelation;// 家属关系
	private String linkName;// 家属姓名,
	private String linkIdNo;// 家属身份证号
	private String linkTel;// 家属电话,

	private String infoSource;// 信息来源,

	private String allergic; // 过敏史

	 private String stopFlag;// 停用标志|0-停1启,
	
	private String infectiousDisease; // 传染病(使用数据字典) added by BLB
	
	private String leaveCause; // 转出原因
	
	private String leaveRemark; // 备注
	
	private Date leaveTime; // 转出时间
	
	private String identityPic;	//身份证照片
	
	
	@RedisSequence
	public String getPatientId() {
		return patientId;
	}

	public void setPatientId(String patientId) {
		this.patientId = patientId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getAlias() {
		return alias;
	}

	public void setAlias(String alias) {
		this.alias = alias;
	}

	public String getSex() {
		return sex;
	}

	public void setSex(String sex) {
		this.sex = sex;
	}

	public String getNation() {
		return nation;
	}

	public void setNation(String nation) {
		this.nation = nation;
	}

	public String getIdAddress() {
		return idAddress;
	}

	public void setIdAddress(String idAddress) {
		this.idAddress = idAddress;
	}

	public String getIdNo() {
		return idNo;
	}

	public void setIdNo(String idNo) {
		this.idNo = idNo;
	}

	public String getMobile() {
		return mobile;
	}

	public void setMobile(String mobile) {
		this.mobile = mobile;
	}

	public String getWechat() {
		return wechat;
	}

	public void setWechat(String wechat) {
		this.wechat = wechat;
	}

	public String getQq() {
		return qq;
	}

	public void setQq(String qq) {
		this.qq = qq;
	}

	public String geteMail() {
		return eMail;
	}

	public void seteMail(String eMail) {
		this.eMail = eMail;
	}

	public String getLinkAddress() {
		return linkAddress;
	}

	public void setLinkAddress(String linkAddress) {
		this.linkAddress = linkAddress;
	}

	public String getNationality() {
		return nationality;
	}

	public void setNationality(String nationality) {
		this.nationality = nationality;
	}

	public String getProvince() {
		return province;
	}

	public void setProvince(String province) {
		this.province = province;
	}

	public String getCity() {
		return city;
	}

	public void setCity(String city) {
		this.city = city;
	}

	public String getArea() {
		return area;
	}

	public void setArea(String area) {
		this.area = area;
	}

	public String getLinkName() {
		return linkName;
	}

	public void setLinkName(String linkName) {
		this.linkName = linkName;
	}

	public String getLinkTel() {
		return linkTel;
	}

	public void setLinkTel(String linkTel) {
		this.linkTel = linkTel;
	}

	public String getMedicalCardNo() {
		return medicalCardNo;
	}

	public void setMedicalCardNo(String medicalCardNo) {
		this.medicalCardNo = medicalCardNo;
	}

	public String getMiCardNo() {
		return miCardNo;
	}

	public void setMiCardNo(String miCardNo) {
		this.miCardNo = miCardNo;
	}

	 public String getStopFlag() {
	 return stopFlag;
	 }
	
	 public void setStopFlag(String stopFlag) {
	 this.stopFlag = stopFlag;
	 }

	public String getOthDetail() {
		return othDetail;
	}

	public void setOthDetail(String othDetail) {
		this.othDetail = othDetail;
	}

	public String getLinkRelation() {
		return linkRelation;
	}

	public void setLinkRelation(String linkRelation) {
		this.linkRelation = linkRelation;
	}

	public String getLinkIdNo() {
		return linkIdNo;
	}

	public void setLinkIdNo(String linkIdNo) {
		this.linkIdNo = linkIdNo;
	}

	public String getInfoSource() {
		return infoSource;
	}

	public void setInfoSource(String infoSource) {
		this.infoSource = infoSource;
	}

	public String getAllergic() {
		return allergic;
	}

	public void setAllergic(String allergic) {
		this.allergic = allergic;
	}

	@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
	public Date getBirthday() {
		return birthday;
	}

	public void setBirthday(Date birthday) {
		this.birthday = birthday;
	}

	public String getInfectiousDisease() {
		return infectiousDisease;
	}

	public void setInfectiousDisease(String infectiousDisease) {
		this.infectiousDisease = infectiousDisease;
	}

	public String getLeaveCause() {
		return leaveCause;
	}

	public void setLeaveCause(String leaveCause) {
		this.leaveCause = leaveCause;
	}

	public String getLeaveRemark() {
		return leaveRemark;
	}

	public void setLeaveRemark(String leaveRemark) {
		this.leaveRemark = leaveRemark;
	}

	@JsonFormat(pattern = "yyyy-MM-dd", timezone = "GMT+8")
	public Date getLeaveTime() {
		return leaveTime;
	}

	public void setLeaveTime(Date leaveTime) {
		this.leaveTime = leaveTime;
	}

	public String getIdentityPic() {
		return identityPic;
	}

	public void setIdentityPic(String identityPic) {
		this.identityPic = identityPic;
	}

}