/***********************************************************************
 * Module:  PerMng.java
 * Author:  wod
 * Purpose: Defines the Class PerMng
 ***********************************************************************/
package com.lenovohit.els.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;


import com.lenovohit.bdrp.Constants;
import com.lenovohit.bdrp.tools.security.SecurityUtil;
import com.lenovohit.bdrp.tools.security.impl.SecurityConstants;
import com.lenovohit.core.model.BaseIdModel;
import com.lenovohit.core.utils.StringUtils;

@Entity
@Table(name = "ELS_PER_MNG")
public class PerMng extends BaseIdModel {
	private static final long serialVersionUID = -3040277135292447199L;
	public static final String STATUS_DISABLED = "0";//失效
	public static final String STATUS_ENABLED = "1";//正常

	private String orgId;
	private String idNo;
	private String idNoEnc;
	private String idNoHash;
	private String name;
	private String bankNo;
	private String bankName;
	private String acctNo;
	private String acctNoEnc;
	private String acctNoHash;
	private String department;
	private String mobile;
	private String mobileEnc;
	private String mobileHash;
	private String state;
	private String effectiveTime;
	private String expiryTime;

	public PerMng() {
		super();
	}

	public PerMng(PerPreview p) {
		super();
		this.setIdNo(p.getIdNo());
		this.name=p.getName();
		this.bankNo=p.getBankNo();
		this.bankName=p.getBankName();
		this.setAcctNo(p.getAcctNo());
		this.department=p.getDepartment();
		this.setMobile(p.getMobile());
		
	}
	
	@Column(name = "ORG_ID", length = 32)
	public String getOrgId() {
		return orgId;
	}

	public void setOrgId(String orgId) {
		this.orgId = orgId;
	}

//	@Column(name = "ID_NO", length = 18)
	@Transient
	public String getIdNo() {
		if(StringUtils.isNotEmpty(this.getIdNoEnc())){
			this.idNo = SecurityUtil.decryptData(SecurityConstants.DATA_TYPE_ID, Constants.APP_SUPER_ID, this.getIdNoEnc(), SecurityConstants.KEY_MASTER_KEY_NAME, null);
		}
		return this.idNo;
	}

	public void setIdNo(String idNo) {
		this.idNo = idNo;
		if(StringUtils.isNotEmpty(idNo)){
			String[] enc = SecurityUtil.encryptData(SecurityConstants.DATA_TYPE_ID, Constants.APP_SUPER_ID, idNo, SecurityConstants.KEY_MASTER_KEY_NAME, null).split(SecurityConstants.ARRAY_TOSTRING_SEP);
			this.setIdNoEnc(enc[0]);
			this.setIdNoHash(enc[1]);
		}
	}

	@Column(name = "ID_NO_ENC", length = 50)
	public String getIdNoEnc() {
		return idNoEnc;
	}

	public void setIdNoEnc(String idNoEnc) {
		this.idNoEnc = idNoEnc;
	}

	@Column(name = "ID_NO_HASH", length = 50)
	public String getIdNoHash() {
		return idNoHash;
	}

	public void setIdNoHash(String idNoHash) {
		this.idNoHash = idNoHash;
	}

	@Column(name = "Name", length = 48)
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "BANK_NO", length = 10)
	public String getBankNo() {
		return bankNo;
	}

	public void setBankNo(String bankNo) {
		this.bankNo = bankNo;
	}

	@Column(name = "BANK_NAME", length = 10)
	public String getBankName() {
		return bankName;
	}

	public void setBankName(String bankName) {
		this.bankName = bankName;
	}

	@Transient
	public String getAcctNo() {
		if(StringUtils.isNotEmpty(this.getAcctNoEnc())){
			this.acctNo = SecurityUtil.decryptData(SecurityConstants.DATA_TYPE_ACCOUNT, Constants.APP_SUPER_ID, this.getAcctNoEnc(), SecurityConstants.KEY_MASTER_KEY_NAME, null);
		}
		return this.acctNo;
	}

	public void setAcctNo(String acctNo) {
		this.acctNo = acctNo;
		if(StringUtils.isNotEmpty(acctNo)){
			String[] enc = SecurityUtil.encryptData(SecurityConstants.DATA_TYPE_ACCOUNT, Constants.APP_SUPER_ID, acctNo, SecurityConstants.KEY_MASTER_KEY_NAME, null).split(SecurityConstants.ARRAY_TOSTRING_SEP);
			this.setAcctNoEnc(enc[0]);
			this.setAcctNoHash(enc[1]);
		}
	}

	@Column(name = "ACCT_NO_ENC", length = 50)
	public String getAcctNoEnc() {
		return acctNoEnc;
	}

	public void setAcctNoEnc(String acctNoEnc) {
		this.acctNoEnc = acctNoEnc;
	}

	@Column(name = "ACCT_NO_HASH", length = 50)
	public String getAcctNoHash() {
		return acctNoHash;
	}

	public void setAcctNoHash(String acctNoHash) {
		this.acctNoHash = acctNoHash;
	}

	@Column(name = "DEPARTMENT", length = 48)
	public String getDepartment() {
		return department;
	}

	public void setDepartment(String department) {
		this.department = department;
	}

	@Transient
	public String getMobile() {
		if(StringUtils.isNotEmpty(this.getMobileEnc())){
			this.mobile = SecurityUtil.decryptData(SecurityConstants.DATA_TYPE_PHONE, Constants.APP_SUPER_ID, this.getMobileEnc(), SecurityConstants.KEY_MASTER_KEY_NAME, null);
		}
		return this.mobile;
	}

	public void setMobile(String mobile) {
		this.mobile = mobile;
		if(StringUtils.isNotEmpty(mobile)){
			String[] enc = SecurityUtil.encryptData(SecurityConstants.DATA_TYPE_PHONE, Constants.APP_SUPER_ID, mobile, SecurityConstants.KEY_MASTER_KEY_NAME, null).split(SecurityConstants.ARRAY_TOSTRING_SEP);
			this.setMobileEnc(enc[0]);
			this.setMobileHash(enc[1]);
		}
	}

	@Column(name = "MOBILE_ENC", length = 50)
	public String getMobileEnc() {
		return mobileEnc;
	}

	public void setMobileEnc(String mobileEnc) {
		this.mobileEnc = mobileEnc;
	}

	@Column(name = "MOBILE_HASH", length = 50)
	public String getMobileHash() {
		return mobileHash;
	}

	public void setMobileHash(String mobileHash) {
		this.mobileHash = mobileHash;
	}

	@Column(name = "STATE", length = 1)
	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}

	@Column(name = "EFFECTIVE_TIME", length = 19)
	public String getEffectiveTime() {
		return effectiveTime;
	}

	public void setEffectiveTime(String effectiveTime) {
		this.effectiveTime = effectiveTime;
	}

	@Column(name = "EXPIRY_TIME", length = 19)
	public String getExpiryTime() {
		return expiryTime;
	}

	public void setExpiryTime(String expiryTime) {
		this.expiryTime = expiryTime;
	}

	@Transient
	public boolean isNew() {
		return StringUtils.isEmpty(this.id);
	}

	/**
	 * 判断状态是否存在状态序列中
	 * 
	 * @param statusCode
	 * @return
	 */
	public static boolean hasStatus(String statusCode) {
		return PerMng.STATUS_DISABLED.equals(statusCode) || PerMng.STATUS_ENABLED.equals(statusCode);
	}

}