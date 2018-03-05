/***********************************************************************
 * Module:PerMng.java
 * Author:wod
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
import com.lenovohit.el.base.model.JoinedBank;

@Entity
@Table(name = "ELS_PAY_AGREEMENT")
public class PayAgreement extends BaseIdModel {
	private static final long serialVersionUID = -4661141956775703501L;
	public static final String STATUS_INVALID = "0";
	public static final String STATUS_NORMAL = "1";
	
	private String acctName;
	private String acctNo;
	private String acctNoEnc;
	private String acctNoHash;
	private String agreementId;
	private String bankId;
	private String bankName;
	private String bankNo;
	private String effectiveDate;
	private ElsOrg elsOrg;
	private String expiryDate;
	private JoinedBank joinedBank;
	private String orgId;
	private String state;

	@Column(name = "acct_name", length= 48)
	public String getAcctName() {
		return acctName;
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

	@Column(name = "agreement_id", length= 32)
	public String getAgreementId() {
		return agreementId;
	}
	@Column(name = "BANK_ID", length = 32)
	public String getBankId() {
		return bankId;
	}
	@Column(name = "bank_name", length= 48)
	public String getBankName() {
		return bankName;
	}
	@Column(name = "bank_no", length= 10)
	public String getBankNo() {
		return bankNo;
	}
	@Column(name = "effective_date", length= 10)
	public String getEffectiveDate() {
		return effectiveDate;
	}
	@Transient
	public ElsOrg getElsOrg() {
		return elsOrg;
	}

	@Column(name = "expiry_date", length= 10)
	public String getExpiryDate() {
		return expiryDate;
	}

	@Transient
	public JoinedBank getJoinedBank() {
		return joinedBank;
	}

	@Column(name = "org_id", length = 32)
	public String getOrgId() {
		return orgId;
	}

	@Column(name = "state", length= 1)
	public String getState() {
		return state;
	}

	public void setAcctName(String acctName) {
		this.acctName = acctName;
	}

	public void setAgreementId(String agreementId) {
		this.agreementId = agreementId;
	}

	public void setBankId(String bankId) {
		this.bankId = bankId;
	}
	
	public void setBankName(String bankName) {
		this.bankName = bankName;
	}
	
	public void setBankNo(String bankNo) {
		this.bankNo = bankNo;
	}
	
	public void setEffectiveDate(String effectiveDate) {
		this.effectiveDate = effectiveDate;
	}
	
	public void setElsOrg(ElsOrg elsOrg) {
		this.elsOrg = elsOrg;
	}
	
	public void setExpiryDate(String expiryDate) {
		this.expiryDate = expiryDate;
	}
	
	public void setJoinedBank(JoinedBank joinedBank) {
		this.joinedBank = joinedBank;
	}
	
	public void setOrgId(String orgId) {
		this.orgId = orgId;
	}
	
	public void setState(String state) {
		this.state = state;
	}
	

	/**
	 * 判断状态是否存在状态序列中
	 * 
	 * @param statusCode
	 * @return
	 */
	public static boolean hasStatus(String statusCode) {
		return  PayAgreement.STATUS_NORMAL.equals(statusCode) ||
				PayAgreement.STATUS_INVALID.equals(statusCode);
	}
}