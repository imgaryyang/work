package com.lenovohit.hcp.base.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.lenovohit.hcp.base.annotation.RedisSequence;
import com.lenovohit.hcp.base.model.HcpBaseModel;

/**
 * 生产厂商及供应商信息表 药品、物资、资产均公用此表
 * 
 * @author victor
 *
 */
@Entity
@Table(name = "B_COMPANY")
public class Company extends HcpBaseModel {

	private static final long serialVersionUID = 4283597513276644357L;

	/**
	 * 厂商服务范围：药品
	 */
	public static final String COMPANY_SERVICES_DRUG = "1";

	/**
	 * 厂商服务范围：物资
	 */
	public static final String COMPANY_SERVICES_MATERIAL = "2";

	/**
	 * 厂商服务范围：固定资产
	 */
	public static final String COMPANY_SERVICES_ASSET = "3";

	/**
	 * 厂商类型：生产厂商
	 */
	public static final String COMPANY_TYPE_MANUFACTURER = "1";

	/**
	 * 厂商类型：供应商
	 */
	public static final String COMPANY_TYPE_SUPPLIER = "2";

	/**
	 * 厂商编码
	 */
	private String companyId;

	/**
	 * 自定义编码
	 */
	private String userCode;
	/**
	 * 中心码
	 */
	private String centerCode;
	

	/**
	 * 厂商名称
	 */
	private String companyName;

	/**
	 * 厂商名称拼音码
	 */
	private String companySpell;

	/**
	 * 厂商名称五笔码
	 */
	private String companyWb;

	/**
	 * 用户自定义搜索码
	 */
	private String userSearchCode;

	/**
	 * 服务范围 1 - 药品 2 - 物资 3 - 资产
	 */
	private String services;

	/**
	 * 厂商分类 1 - 生产厂商 2 - 供应商
	 */
	private String companyType;

	/**
	 * 停用标志
	 */
	private String stopFlag;
	
	/**
	 * 税号
	 */
	private String taxNumber;
	
	/**
	 * 证照开始时间
	 */
	private Date licenseSdate;
	
	/**
	 * 证照结束时间
	 */
	private Date licenseEdate;
	/**
	 * GSP证照号
	 */
	private String GSPlicenseNo;
	/**
	 * 证照号
	 */
	private String licenseNo;
	/**
	 * GSP证照开始时间
	 */
	private Date GSPlicenseSdate;
	
	/**
	 * GSP证照结束时间
	 */
	private Date GSPlicenseEdate;
	
	private Integer level;
	
	@Column(name="GSPLICENSE_NO")
	public String getGSPlicenseNo() {
		return GSPlicenseNo;
	}

	public void setGSPlicenseNo(String gSPlicenseNo) {
		GSPlicenseNo = gSPlicenseNo;
	}
	@Column(name="GSPLICENSE_SDATE")
	@JsonFormat(pattern = "yyyy-MM-dd", timezone = "GMT+8")
	public Date getGSPlicenseSdate() {
		return GSPlicenseSdate;
	}

	public void setGSPlicenseSdate(Date gSPlicenseSdate) {
		GSPlicenseSdate = gSPlicenseSdate;
	}
	@Column(name="GSPLICENSE_EDATE")
	@JsonFormat(pattern = "yyyy-MM-dd", timezone = "GMT+8")
	public Date getGSPlicenseEdate() {
		return GSPlicenseEdate;
	}

	public void setGSPlicenseEdate(Date gSPlicenseEdate) {
		GSPlicenseEdate = gSPlicenseEdate;
	}

	public String getLicenseNo() {
		return licenseNo;
	}

	public void setLicenseNo(String licenseNo) {
		this.licenseNo = licenseNo;
	}
	public String getCenterCode() {
		return centerCode;
	}

	public void setCenterCode(String centerCode) {
		this.centerCode = centerCode;
	}
	
	@RedisSequence
	public String getCompanyId() {
		return companyId;
	}

	public void setCompanyId(String companyId) {
		this.companyId = companyId;
	}

	public String getCompanyName() {
		return companyName;
	}

	public void setCompanyName(String companyName) {
		this.companyName = companyName;
	}

	public String getCompanyType() {
		return companyType;
	}

	public void setCompanyType(String companyType) {
		this.companyType = companyType;
	}

	public String getUserCode() {
		return userCode;
	}

	public void setUserCode(String userCode) {
		this.userCode = userCode;
	}

	public String getCompanySpell() {
		return companySpell;
	}

	public void setCompanySpell(String companySpell) {
		this.companySpell = companySpell;
	}

	public String getCompanyWb() {
		return companyWb;
	}

	public void setCompanyWb(String companyWb) {
		this.companyWb = companyWb;
	}

	public String getUserSearchCode() {
		return userSearchCode;
	}

	public void setUserSearchCode(String userSearchCode) {
		this.userSearchCode = userSearchCode;
	}

	public String getServices() {
		return services;
	}

	public void setServices(String services) {
		this.services = services;
	}

	public String getStopFlag() {
		return stopFlag;
	}

	public void setStopFlag(String stopFlag) {
		this.stopFlag = stopFlag;
	}

	public String getTaxNumber() {
		return taxNumber;
	}

	public void setTaxNumber(String taxNumber) {
		this.taxNumber = taxNumber;
	}

	@Column(name="LICENSE_SDATE")
	@JsonFormat(pattern = "yyyy-MM-dd", timezone = "GMT+8")
	public Date getLicenseSdate() {
		return licenseSdate;
	}

	public void setLicenseSdate(Date licenseSdate) {
		this.licenseSdate = licenseSdate;
	}
	
	@Column(name="LICENSE_EDATE")
	@JsonFormat(pattern = "yyyy-MM-dd", timezone = "GMT+8")
	public Date getLicenseEdate() {
		return licenseEdate;
	}

	public void setLicenseEdate(Date licenseEdate) {
		this.licenseEdate = licenseEdate;
	}

	public Integer getLevel() {
		return level;
	}

	public void setLevel(Integer level) {
		this.level = level;
	}
	
	
}
