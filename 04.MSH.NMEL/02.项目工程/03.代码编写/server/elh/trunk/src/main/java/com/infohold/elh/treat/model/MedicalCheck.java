package com.infohold.elh.treat.model;

import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.hibernate.annotations.GenericGenerator;

import com.infohold.core.model.BaseModel;

/**
 * 检查表
 * 
 * @author Administrator
 *
 */
@Entity
@Table(name = "ELH_MEDICAL_CHECK")
public class MedicalCheck extends BaseModel{

	/**
	 * 
	 */
	private static final long serialVersionUID = -275205485159640188L;
	private String applyDoctor;// 申请医生//TODO 修改字段
	private String optDoctor;// 申请医生//TODO 修改字段
	//private String hospital;// 就诊医院
	private String subject;// 申请项目
	private String caseNo;// 病历号
	private String department;// 科室
	private String bedNo;// 床号
	private String specimenNo;// 样本号
	private String specimen;// 标本
	private String checkTime;// 取样时间
	private String submitTime;// 接收时间
	private String reportTime;// 报告时间
	private String operator;// 检查者
	private String audit;// 审核者
	private String machine;// 检查仪器
	private String comment;// 备注
	private String diagnosis;// 检查结果
	private List<CheckDetail> details;
	private String id;//
	@Id
	@Column(name="ID",length = 32)
	@GeneratedValue(generator="system-uuid")
	@GenericGenerator(name="system-uuid", strategy="assigned")
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	@Transient
	public List<CheckDetail> getDetails() {
		return details;
	}

	public void setDetails(List<CheckDetail> checkDetails) {
		this.details = checkDetails;
	}

	public String getSubject() {
		return subject;
	}

	public void setSubject(String subject) {
		this.subject = subject;
	}

	public String getCaseNo() {
		return caseNo;
	}

	public void setCaseNo(String caseNo) {
		this.caseNo = caseNo;
	}

	public String getDepartment() {
		return department;
	}

	public void setDepartment(String department) {
		this.department = department;
	}

	public String getBedNo() {
		return bedNo;
	}

	public void setBedNo(String bedNo) {
		this.bedNo = bedNo;
	}

	public String getSpecimenNo() {
		return specimenNo;
	}

	public void setSpecimenNo(String specimenNo) {
		this.specimenNo = specimenNo;
	}

	public String getSpecimen() {
		return specimen;
	}

	public void setSpecimen(String specimen) {
		this.specimen = specimen;
	}

	public String getCheckTime() {
		return checkTime;
	}

	public void setCheckTime(String checkTime) {
		this.checkTime = checkTime;
	}

	public String getSubmitTime() {
		return submitTime;
	}

	public void setSubmitTime(String submitTime) {
		this.submitTime = submitTime;
	}

	public String getReportTime() {
		return reportTime;
	}

	public void setReportTime(String reportTime) {
		this.reportTime = reportTime;
	}

	public String getOperator() {
		return operator;
	}

	public void setOperator(String operator) {
		this.operator = operator;
	}

	public String getAudit() {
		return audit;
	}

	public void setAudit(String audit) {
		this.audit = audit;
	}

	public String getMachine() {
		return machine;
	}

	public void setMachine(String machine) {
		this.machine = machine;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public String getDiagnosis() {
		return diagnosis;
	}

	public void setDiagnosis(String diagnosis) {
		this.diagnosis = diagnosis;
	}
	public String getOptDoctor() {
		return optDoctor;
	}

	public void setOptDoctor(String optDoctor) {
		this.optDoctor = optDoctor;
	}

	public String getApplyDoctor() {
		return applyDoctor;
	}

	public void setApplyDoctor(String applyDoctor) {
		this.applyDoctor = applyDoctor;
	}
	@Transient
	@Override
	public boolean _newObejct() {
		return null == this.getId();
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
