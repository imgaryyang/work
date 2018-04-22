package com.lenovohit.ssm.base.model;

import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.lenovohit.bdrp.authority.model.AuthAccount;
import com.lenovohit.bdrp.authority.model.AuthPrincipal;
import com.lenovohit.core.model.BaseIdModel;
import com.lenovohit.core.utils.BeanUtils;

@Entity
@Table(name = "SSM_USER") // 人员基本信息';
public class User  extends BaseIdModel implements AuthPrincipal {
	private static final long serialVersionUID = -6022283909583591548L;
	
	private String hosId; // '医院id|以h开头，第2、3位为等级，4-7为集团编码，8-10为序号',
	private String name; // 姓名（中文）
	private String enName; // 英文名
	private String shortName; // 简称
	private String gender = "1";// 性别
	private String idNo; // 身份证号
	private String mobile; // 手机
	private String pinyin; // 拼音
	private String folk; // 民族
	private String email; // 邮箱
	private String address; // 地址
	private String marrStatus = "0"; // 婚姻状态
	private boolean active = true; // 是否激活
	private boolean expired = false; // 是否过期
	private String bornDate; // 出生日期
	private String createDate; // 创建日期
	private String effectDate; // 生效日期
	private String expirDate; // 失效日期
	private String desciption; // 描述
	private String org; // 所属机构
	
	private AuthAccount loginAccount;//登录账户

	
	public String getHosId() {
		return hosId;
	}

	public void setHosId(String hosId) {
		this.hosId = hosId;
	}

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

	public boolean isActive() {
		return active;
	}

	public void setActive(boolean active) {
		this.active = active;
	}

	public boolean isExpired() {
		return expired;
	}

	public void setExpired(boolean expired) {
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
	
	@Transient
	public AuthAccount getLoginAccount() {
		return loginAccount;
	}

	@Override
	public AuthPrincipal clone() {
		try {
			Object clone = super.clone();
			return (User) clone;
		} catch (CloneNotSupportedException e) {
			User target = new User();
			BeanUtils.copyProperties(this, target);
			return target;
		}
	}

	@Override
	public void setLoginAccount(AuthAccount account) {
		this.loginAccount = account;
	}


}
