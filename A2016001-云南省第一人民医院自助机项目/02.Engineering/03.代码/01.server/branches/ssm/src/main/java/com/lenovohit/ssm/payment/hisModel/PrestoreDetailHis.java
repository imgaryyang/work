package com.lenovohit.ssm.payment.hisModel;

import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;

import com.lenovohit.core.model.Model;

/**
 * HIS - 预存明细
 * 
 * @author Victor Huang
 *
 */
@Entity
@Table(name = "CW_YCMX")
public class PrestoreDetailHis implements Model {
	private static final long serialVersionUID = -6142260232622377265L;

	private Integer id; // JLID 主键
	private String patientNo; // BRBH 病人编号
	private String prestoreCode; // YCDM 预存代码
	private String prestoreType; // YCFS 预存方式
	private BigDecimal amt; // YCJE 预存金额
	private String authCode; // YZM 验证码
	private String bankName; // KHYH 开户行
	private String account; // YHZH 银行账号
	private String orgName; // DWMC 单位名称
	private String areaCode; // YQDM 院区代码
	private String status; // ZTBZ 状态标志
	private Integer operId; // CZZID 操作者id
	private Date prestoreTime; // YCSJ 预存时间
	private String payeeAccount; // DLSFZH **收费账号
	private String memo; // BZ 备注
	private Integer auditOperId; // SHRYID 审核人员id
	private String source; // LY 来源

	@Id
	@Column(name = "JLID")
	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	@Column(name = "BRBH")
	public String getPatientNo() {
		return patientNo;
	}

	public void setPatientNo(String patientNo) {
		this.patientNo = patientNo;
	}

	@Column(name = "YCDM")
	public String getPrestoreCode() {
		return prestoreCode;
	}

	public void setPrestoreCode(String prestoreCode) {
		this.prestoreCode = prestoreCode;
	}

	@Column(name = "YCFS")
	public String getPrestoreType() {
		return prestoreType;
	}

	public void setPrestoreType(String prestoreType) {
		this.prestoreType = prestoreType;
	}

	@Column(name = "YCJE")
	public BigDecimal getAmt() {
		return amt;
	}

	public void setAmt(BigDecimal amt) {
		this.amt = amt;
	}

	@Column(name = "YZM")
	public String getAuthCode() {
		return authCode;
	}

	public void setAuthCode(String authCode) {
		this.authCode = authCode;
	}

	@Column(name = "KHYH")
	public String getBankName() {
		return bankName;
	}

	public void setBankName(String bankName) {
		this.bankName = bankName;
	}

	@Column(name = "YHZH")
	public String getAccount() {
		return account;
	}

	public void setAccount(String account) {
		this.account = account;
	}

	@Column(name = "DWMC")
	public String getOrgName() {
		return orgName;
	}

	public void setOrgName(String orgName) {
		this.orgName = orgName;
	}

	@Column(name = "YQDM")
	public String getAreaCode() {
		return areaCode;
	}

	public void setAreaCode(String areaCode) {
		this.areaCode = areaCode;
	}

	@Column(name = "ZTBZ")
	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	@Column(name = "CZZID")
	public Integer getOperId() {
		return operId;
	}

	public void setOperId(Integer operId) {
		this.operId = operId;
	}

	@Column(name = "YCSJ")
	public Date getPrestoreTime() {
		return prestoreTime;
	}

	public void setPrestoreTime(Date prestoreTime) {
		this.prestoreTime = prestoreTime;
	}

	@Column(name = "DLSFZH")
	public String getPayeeAccount() {
		return payeeAccount;
	}

	public void setPayeeAccount(String payeeAccount) {
		this.payeeAccount = payeeAccount;
	}

	@Column(name = "BZ")
	public String getMemo() {
		return memo;
	}

	public void setMemo(String memo) {
		this.memo = memo;
	}

	@Column(name = "SHRYID")
	public Integer getAuditOperId() {
		return auditOperId;
	}

	public void setAuditOperId(Integer auditOperId) {
		this.auditOperId = auditOperId;
	}

	@Column(name = "LY")
	public String getSource() {
		return source;
	}

	public void setSource(String source) {
		this.source = source;
	}

	@Override
	public boolean _newObejct() {
		return 0 == this.getId();
	}

	/**
	 * 重载toString;
	 */
	public String toString() {
		return ToStringBuilder.reflectionToString(this);
	}

	/**
	 * 重载hashCode;
	 */
	public int hashCode() {
		return new HashCodeBuilder().append(this.getId()).toHashCode();
	}

	/**
	 * 重载equals
	 */
	public boolean equals(Object obj) {
		return EqualsBuilder.reflectionEquals(this, obj);
	}

}
