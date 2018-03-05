package com.lenovohit.el.base.model;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.lenovohit.core.model.BaseIdModel;

@Entity
@Table(name = "EL_JOINED_BANK")
public class JoinedBank extends BaseIdModel {
	private static final long serialVersionUID = -1761892414641470317L;
	
	private String bankNo; //银行行号
	private String bankName; //银行名称
	private String servicePhone; //服务电话
	private String effectiveOn; //生效日期
	private String expiryOn; //失效日期
	private Set<BankBranch> bankBranchs = new HashSet<BankBranch>(0);

	@Column(name = "BANK_NO", length = 30)
	public String getBankNo() {
		return this.bankNo;
	}

	public void setBankNo(String bankNo) {
		this.bankNo = bankNo;
	}

	@Column(name = "BANK_NAME", length = 100)
	public String getBankName() {
		return this.bankName;
	}

	public void setBankName(String bankName) {
		this.bankName = bankName;
	}

	@Column(name = "SERVICE_PHONE", length = 20)
	public String getServicePhone() {
		return this.servicePhone;
	}

	public void setServicePhone(String servicePhone) {
		this.servicePhone = servicePhone;
	}

	@Column(name = "EFFECTIVE_ON", length = 10)
	public String getEffectiveOn() {
		return this.effectiveOn;
	}

	public void setEffectiveOn(String effectiveOn) {
		this.effectiveOn = effectiveOn;
	}

	@Column(name = "EXPIRY_ON", length = 10)
	public String getExpiryOn() {
		return this.expiryOn;
	}

	public void setExpiryOn(String expiryOn) {
		this.expiryOn = expiryOn;
	}

	@Transient
	public Set<BankBranch> getBankBranchs() {
		return this.bankBranchs;
	}

	public void setBankBranchs(Set<BankBranch> bankBranchs) {
		this.bankBranchs = bankBranchs;
	}

}