package com.lenovohit.hcp.base.model;

import javax.persistence.Entity;
import javax.persistence.Table;

import com.lenovohit.hcp.base.annotation.RedisSequence;

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
}
