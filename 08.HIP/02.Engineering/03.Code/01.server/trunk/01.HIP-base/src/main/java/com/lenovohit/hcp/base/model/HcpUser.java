package com.lenovohit.hcp.base.model;

import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.lenovohit.bdrp.authority.model.AuthPrincipal;
import com.lenovohit.core.model.BaseIdModel;
import com.lenovohit.core.utils.BeanUtils;
import com.lenovohit.hcp.base.annotation.RedisSequence;

@Entity
@Table(name = "HCP_USER") // 人员基本信息';
public class HcpUser extends BaseIdModel implements AuthPrincipal {
	
	private static final long serialVersionUID = -6022283909583591548L;
	
	public static final String USER_TYPE_DOCTOR = "1";
	public static final String USER_TYPE_NURSE = "2";
	public static final String USER_TYPE_PHARMACIST = "3";// 药剂
	public static final String USER_TYPE_MEDICALTEC = "4";// 卫生技术
	public static final String USER_TYPE_CASHIER = "5";// 收款员
	public static final String USER_TYPE_ACCOUNTER = "6";// 会计
	public static final String USER_TYPE_COUNTER = "7";// 统计
	public static final String USER_TYPE_OTHER = "8";// 其他
	
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
	private String deptId; // 所属科室ID
	private String deptCode; // 所属科室Code
	private String deptName; // 所属科室名称
	// 从employee合并过来的信息
	private String userId; // 工号
	private String nurseId; // 所属病区id
	private String userType; // 员工类型
	private String posiCode; // 职务
	private String lvlCode; // 职级
	private String eduCode; // 学历
	private String hrCode; // hr编号
	private String contractNo; // 合同号
	private String workId; // 工牌号
	private String operLevel; // 权限级别
	// 维护用户信息时暂存选择的可登录科室
	private String loginDepts;
	private String loginDeptsCode;
	private String loginDeptsName;
	// 暂存用户登录时选择的登录科室
	private Department loginDepartment;
	
	private String licenseCode;

	public String getLicenseCode() {
		return licenseCode;
	}

	public void setLicenseCode(String licenseCode) {
		this.licenseCode = licenseCode;
	}

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

	public String getDeptId() {
		return deptId;
	}

	public void setDeptId(String deptId) {
		this.deptId = deptId;
	}

	public String getDeptCode() {
		return deptCode;
	}

	public void setDeptCode(String deptCode) {
		this.deptCode = deptCode;
	}

	public String getDeptName() {
		return deptName;
	}

	public void setDeptName(String deptName) {
		this.deptName = deptName;
	}

	@Transient
	public String getLoginDepts() {
		return loginDepts;
	}

	public void setLoginDepts(String loginDepts) {
		this.loginDepts = loginDepts;
	}

	@Transient
	public String getLoginDeptsCode() {
		return loginDeptsCode;
	}

	public void setLoginDeptsCode(String loginDeptsCode) {
		this.loginDeptsCode = loginDeptsCode;
	}

	@Transient
	public String getLoginDeptsName() {
		return loginDeptsName;
	}

	public void setLoginDeptsName(String loginDeptsName) {
		this.loginDeptsName = loginDeptsName;
	}

	@Transient
	public Department getLoginDepartment() {
		return loginDepartment;
	}

	public void setLoginDepartment(Department loginDepartment) {
		this.loginDepartment = loginDepartment;
	}

	@Override
	public AuthPrincipal clone() {
		try {
			Object clone = super.clone();
			return (HcpUser) clone;
		} catch (CloneNotSupportedException e) {
			HcpUser target = new HcpUser();
			BeanUtils.copyProperties(this, target);
			return target;
		}
	}

	@RedisSequence
	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getNurseId() {
		return nurseId;
	}

	public void setNurseId(String nurseId) {
		this.nurseId = nurseId;
	}

	public String getUserType() {
		return userType;
	}

	public void setUserType(String userType) {
		this.userType = userType;
	}

	public String getPosiCode() {
		return posiCode;
	}

	public void setPosiCode(String posiCode) {
		this.posiCode = posiCode;
	}

	public String getLvlCode() {
		return lvlCode;
	}

	public void setLvlCode(String lvlCode) {
		this.lvlCode = lvlCode;
	}

	public String getEduCode() {
		return eduCode;
	}

	public void setEduCode(String eduCode) {
		this.eduCode = eduCode;
	}

	public String getHrCode() {
		return hrCode;
	}

	public void setHrCode(String hrCode) {
		this.hrCode = hrCode;
	}

	public String getContractNo() {
		return contractNo;
	}

	public void setContractNo(String contractNo) {
		this.contractNo = contractNo;
	}

	public String getWorkId() {
		return workId;
	}

	public void setWorkId(String workId) {
		this.workId = workId;
	}

	public String getOperLevel() {
		return operLevel;
	}

	public void setOperLevel(String operLevel) {
		this.operLevel = operLevel;
	}
}