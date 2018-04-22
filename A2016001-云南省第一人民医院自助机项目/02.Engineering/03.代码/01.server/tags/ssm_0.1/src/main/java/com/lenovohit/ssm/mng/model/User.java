package com.lenovohit.ssm.mng.model;

import javax.persistence.Entity;
import javax.persistence.Table;

import com.lenovohit.core.model.BaseIdModel;

@Entity
@Table(name = "LH_USER")
public class User extends BaseIdModel {
	/**
	 * 
	 */
	private static final long serialVersionUID = 564708312363965271L;
	private String name;//姓名	name	
	private String enName;//英文名	
	private String shortName;//简称		
	private String gender;//性别		
	private String idNo;//身份证号		
	private String mobile;//手机号码		
	private String pinyin;//拼音		
	private String folk;//民族		
	private String email;//邮箱		
	private String address;//地址		
	private String marrStatus;//婚姻状态		
	private String active;//是否激活		
	private String expired;//是否过期		
	private String bornDate;//出生日期		
	private String createDate;//创建时间		
	private String effectDate;//生效日期		
	private String expirDate;//失效日期		
	private String desciption;//描述		
	private String org;//所属机构		
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getEnName() {
		return enName;
	}
	public void setEnName(String enName) {
		this.enName = enName;
	}
	public String getShortName() {
		return shortName;
	}
	public void setShortName(String shortName) {
		this.shortName = shortName;
	}
	public String getGender() {
		return gender;
	}
	public void setGender(String gender) {
		this.gender = gender;
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
	public String getPinyin() {
		return pinyin;
	}
	public void setPinyin(String pinyin) {
		this.pinyin = pinyin;
	}
	public String getFolk() {
		return folk;
	}
	public void setFolk(String folk) {
		this.folk = folk;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	public String getMarrStatus() {
		return marrStatus;
	}
	public void setMarrStatus(String marrStatus) {
		this.marrStatus = marrStatus;
	}
	public String getActive() {
		return active;
	}
	public void setActive(String active) {
		this.active = active;
	}
	public String getExpired() {
		return expired;
	}
	public void setExpired(String expired) {
		this.expired = expired;
	}
	public String getBornDate() {
		return bornDate;
	}
	public void setBornDate(String bornDate) {
		this.bornDate = bornDate;
	}
	public String getCreateDate() {
		return createDate;
	}
	public void setCreateDate(String createDate) {
		this.createDate = createDate;
	}
	public String getEffectDate() {
		return effectDate;
	}
	public void setEffectDate(String effectDate) {
		this.effectDate = effectDate;
	}
	public String getExpirDate() {
		return expirDate;
	}
	public void setExpirDate(String expirDate) {
		this.expirDate = expirDate;
	}
	public String getDesciption() {
		return desciption;
	}
	public void setDesciption(String desciption) {
		this.desciption = desciption;
	}
	public String getOrg() {
		return org;
	}
	public void setOrg(String org) {
		this.org = org;
	}
}
