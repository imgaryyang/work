package com.lenovohit.hcp.appointment.model;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

import com.lenovohit.hcp.base.annotation.RedisSequence;
import com.lenovohit.hcp.base.model.Department;
import com.lenovohit.hcp.base.model.HcpBaseModel;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.card.model.Patient;

@Entity
@Table(name = "REG_INFO") // 门诊挂号
public class RegInfo extends HcpBaseModel {

	/**
	 * 挂号状态 - 已预约，未取号
	 */
	public static final String REG_RESERVED = "11";
	/**
	 * 挂号状态 - 预约已取
	 */
	public static final String REG_RESERVE_NUMED = "21";
	/**
	 * 挂号状态 - 正在就诊
	 */
	public static final String REG_VISITING = "30";
	/**
	 * 挂号状态 - 已完成就诊
	 */
	public static final String REG_TREAT_DONE = "31";
	/**
	 * 挂号状态 - 已退号
	 */
	public static final String REG_CANCELED = "12";

	private static final long serialVersionUID = 1L;

	private String patientId; // 暂存，用于接收从前端传入的查询条件
	private Date[] dateRange;
	private Patient patient;

	private String regId;

	private String regState;

	private String feeType;

	private String payType;

	private String regLevel;

	private Department regDept;
	private String regDeptId;

	private HcpUser regDoc;

	private Date regTime;

	private Department seeDept;

	private HcpUser seeDoc;

	private String seeNo;

	private Date seeBegin;

	private Date seeEnd;

	private Boolean reviewFlag;

	private Boolean emergencyFlag;
	private String cancelFlag;
	private String cancelOper;

	private Date cancelTime;

	private Date createBeginTime;
	private Date createEndTime;

	private String invoiceNo;

	// 暂存诊疗卡号、医保卡号、患者编码及患者姓名，从前端接收查询条件
	private String medicalCardNo;
	private String miCardNo;
	private String patientCode;
	private String patientName;

	public String getRegState() {
		return regState;
	}

	public void setRegState(String regState) {
		this.regState = regState == null ? null : regState.trim();
	}

	public String getFeeType() {
		return feeType;
	}

	public void setFeeType(String feeType) {
		this.feeType = feeType == null ? null : feeType.trim();
	}

	public String getPayType() {
		return payType;
	}

	public void setPayType(String payType) {
		this.payType = payType == null ? null : payType.trim();
	}

	public String getRegLevel() {
		return regLevel;
	}

	public void setRegLevel(String regLevel) {
		this.regLevel = regLevel == null ? null : regLevel.trim();
	}

	@ManyToOne
	@JoinColumn(name = "REG_DOC")
	@NotFound(action = NotFoundAction.IGNORE)
	public HcpUser getRegDoc() {
		return regDoc;
	}

	public void setRegDoc(HcpUser regDoc) {
		this.regDoc = regDoc == null ? null : regDoc;
	}

	public Date getRegTime() {
		return regTime;
	}

	public void setRegTime(Date regTime) {
		this.regTime = regTime;
	}

	@ManyToOne
	@JoinColumn(name = "SEE_DEPT")
	public Department getSeeDept() {
		return seeDept;
	}

	public void setSeeDept(Department seeDept) {
		this.seeDept = seeDept;
	}

	@ManyToOne
	@JoinColumn(name = "SEE_DOC")
	public HcpUser getSeeDoc() {
		return seeDoc;
	}

	public void setSeeDoc(HcpUser seeDoc) {
		this.seeDoc = seeDoc;
	}

	public String getSeeNo() {
		return seeNo;
	}

	public void setSeeNo(String seeNo) {
		this.seeNo = seeNo == null ? null : seeNo.trim();
	}

	public Date getSeeBegin() {
		return seeBegin;
	}

	public void setSeeBegin(Date seeBegin) {
		this.seeBegin = seeBegin;
	}

	public Date getSeeEnd() {
		return seeEnd;
	}

	public void setSeeEnd(Date seeEnd) {
		this.seeEnd = seeEnd;
	}

	public String getCancelOper() {
		return cancelOper;
	}

	public void setCancelOper(String cancelOper) {
		this.cancelOper = cancelOper == null ? null : cancelOper.trim();
	}

	public Date getCancelTime() {
		return cancelTime;
	}

	public void setCancelTime(Date cancelTime) {
		this.cancelTime = cancelTime;
	}

	@Transient
	public String getPatientId() {
		return patientId;
	}

	public void setPatientId(String patientId) {
		this.patientId = patientId;
	}

	@ManyToOne
	@JoinColumn(name = "PATIENT_ID")
	public Patient getPatient() {
		return patient;
	}

	public void setPatient(Patient patient) {
		this.patient = patient;
	}

	@RedisSequence
	public String getRegId() {
		return regId;
	}

	public void setRegId(String regId) {
		this.regId = regId;
	}

	public String getInvoiceNo() {
		return invoiceNo;
	}

	public void setInvoiceNo(String invoiceNo) {
		this.invoiceNo = invoiceNo;
	}

	@Transient
	public Date getCreateBeginTime() {
		return createBeginTime;
	}

	public void setCreateBeginTime(Date createBeginTime) {
		this.createBeginTime = createBeginTime;
	}

	@Transient
	public Date getCreateEndTime() {
		return createEndTime;
	}

	public void setCreateEndTime(Date createEndTime) {
		this.createEndTime = createEndTime;
	}

	@Transient
	public String getMedicalCardNo() {
		return medicalCardNo;
	}

	public void setMedicalCardNo(String medicalCardNo) {
		this.medicalCardNo = medicalCardNo;
	}

	@Transient
	public String getMiCardNo() {
		return miCardNo;
	}

	public void setMiCardNo(String miCardNo) {
		this.miCardNo = miCardNo;
	}

	@Transient
	public String getPatientCode() {
		return patientCode;
	}

	public void setPatientCode(String patientCode) {
		this.patientCode = patientCode;
	}

	@Transient
	public String getPatientName() {
		return patientName;
	}

	public void setPatientName(String patientName) {
		this.patientName = patientName;
	}

	@Transient
	public Date[] getDateRange() {
		return dateRange;
	}

	public void setDateRange(Date[] dateRange) {
		this.dateRange = dateRange;
	}

	public String getCancelFlag() {
		return cancelFlag;
	}

	public void setCancelFlag(String cancelFlag) {
		this.cancelFlag = cancelFlag;
	}

	public Boolean getReviewFlag() {
		return reviewFlag;
	}

	public void setReviewFlag(Boolean reviewFlag) {
		this.reviewFlag = reviewFlag;
	}

	public Boolean getEmergencyFlag() {
		return emergencyFlag;
	}

	public void setEmergencyFlag(Boolean emergencyFlag) {
		this.emergencyFlag = emergencyFlag;
	}

	@ManyToOne
	@JoinColumn(name = "REG_DEPT")
	public Department getRegDept() {
		return regDept;
	}

	public void setRegDept(Department regDept) {
		this.regDept = regDept;
	}

	@Transient
	public String getRegDeptId() {
		return regDeptId;
	}

	public void setRegDeptId(String regDeptId) {
		this.regDeptId = regDeptId;
	}

}