/***********************************************************************
 * Module:PerMng.java
 * Author:wod
 * Purpose: Defines the Class PerMng
 ***********************************************************************/
package com.lenovohit.els.model;

import java.math.BigDecimal;

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
@Table(name = "ELS_PAY_BATCHINFO")
public class PayBatchinfo extends BaseIdModel {
	private static final long serialVersionUID = 5280554750433683890L;
	public static final String STATUS_WAIT = "0";
	public static final String STATUS_SUCCESS = "1";
	public static final String STATUS_FAIL = "2";
	
	private String perId;
	private String batchId;
	private String batchNo;
	private String month;
	private String name;
	private String acctNo;
	private String acctNoEnc;
	private String acctNoHash;
	private BigDecimal amount;
	private String payTime;
	private String payState;
	private String stateMemo;
	
	public PayBatchinfo() {
		
	}
	
	public PayBatchinfo(PayPreview perview) {
		this.setAcctNo(perview.getAcctNo());
		this.amount = perview.getAmount();
		this.batchId = perview.getBatchId();
		this.batchNo = perview.getBatchNo();
		this.month = perview.getMonth();
		this.name = perview.getName();
		this.payState = "0";
		this.perId = perview.getPerId();
		
	}
	
	@Column( name = "PER_ID", length = 32 )
	public String getPerId() {
		return perId;
	}

	public void setPerId(String perId) {
		this.perId = perId;
	}

	@Column( name = "BATCH_ID", length = 32 )
	public String getBatchId() {
		return batchId;
	}

	public void setBatchId(String batchId) {
		this.batchId = batchId;
	}

	@Column( name = "BATCH_NO", length = 20 )
	public String getBatchNo() {
		return batchNo;
	}

	public void setBatchNo(String batchNo) {
		this.batchNo = batchNo;
	}

	@Column( name = "MONTH", length = 6 )
	public String getMonth() {
		return month;
	}

	public void setMonth(String month) {
		this.month = month;
	}

	@Column( name = "NAME", length = 48 )
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
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

	@Column( name = "AMOUNT" )
	public BigDecimal getAmount() {
		return amount;
	}

	public void setAmount(BigDecimal amount) {
		this.amount = amount;
	}

	@Column( name = "PAY_TIME", length = 19 )
	public String getPayTime() {
		return payTime;
	}

	public void setPayTime(String payTime) {
		this.payTime = payTime;
	}

	@Column( name = "PAY_STATE", length = 1 )
	public String getPayState() {
		return payState;
	}

	public void setPayState(String payState) {
		this.payState = payState;
	}

	@Column( name = "STATE_MEMO", length = 128 )
	public String getStateMemo() {
		return stateMemo;
	}

	public void setStateMemo(String stateMemo) {
		this.stateMemo = stateMemo;
	}

	/**
	 * 判断状态是否存在状态序列中
	 * 
	 * @param statusCode
	 * @return
	 */
	public static boolean hasStatus(String statusCode) {
		return  PayBatchinfo.STATUS_WAIT.equals(statusCode) ||
				PayBatchinfo.STATUS_SUCCESS.equals(statusCode) ||
				PayBatchinfo.STATUS_FAIL.equals(statusCode);
	}
}