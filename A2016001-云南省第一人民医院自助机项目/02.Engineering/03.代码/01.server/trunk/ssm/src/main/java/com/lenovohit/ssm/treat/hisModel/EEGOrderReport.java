package com.lenovohit.ssm.treat.hisModel;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;

import com.lenovohit.core.model.Model;

@Entity
@Table(name = "V_Self_help_Print")
public class EEGOrderReport implements Model{
	private static final long serialVersionUID = -8673736384440120270L;
	
	private String name;//姓名
	private String sex;//性别
	private String age;//年龄
	private String patientNo;//门诊号
	private String inpatientNo;//住院号
	private String caseNo;//病案号
	private String cardNo;//健康卡号
	private String applyNo;//申请单号
	private String reportDoctor;//报告医生
	private String auditDoctor;//审核医生
	private String department;//科室
	private Date reportTime;//报告时间
	private String status;//报告状态
	private String printFlag;//打印标识
	private String source;//来源
	private String reportType;//报告类型
	private String reportPath;//报告路径；
	private String reportFileName;//文件名
	private String startDate;//开始时间
	private String endDate;//结束时间
	

	@Column(name="XM")
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name="XB")
	public String getSex() {
		return sex;
	}

	public void setSex(String sex) {
		this.sex = sex;
	}
	
	@Column(name="NL")
	public String getAge() {
		return age;
	}

	public void setAge(String age) {
		this.age = age;
	}
	
	@Column(name="MZH")
	public String getPatientNo() {
		return patientNo;
	}

	public void setPatientNo(String patientNo) {
		this.patientNo = patientNo;
	}
	
	@Column(name="ZYH")
	public String getInpatientNo() {
		return inpatientNo;
	}

	public void setInpatientNo(String inpatientNo) {
		this.inpatientNo = inpatientNo;
	}
	
	@Column(name="BAH")
	public String getCaseNo() {
		return caseNo;
	}

	public void setCaseNo(String caseNo) {
		this.caseNo = caseNo;
	}

	@Column(name="JKKH")
	public String getCardNo() {
		return cardNo;
	}

	public void setCardNo(String cardNo) {
		this.cardNo = cardNo;
	}
	
	@Column(name="SQH")
	public String getApplyNo() {
		return applyNo;
	}

	public void setApplyNo(String applyNo) {
		this.applyNo = applyNo;
	}

	@Column(name="BGYS")
	public String getReportDoctor() {
		return reportDoctor;
	}

	public void setReportDoctor(String reportDoctor) {
		this.reportDoctor = reportDoctor;
	}

	@Column(name="SHYY")
	public String getAuditDoctor() {
		return auditDoctor;
	}

	public void setAuditDoctor(String auditDoctor) {
		this.auditDoctor = auditDoctor;
	}
	
	@Column(name="BGSJ")
	public Date getReportTime() {
		return reportTime;
	}

	public void setReportTime(Date reportTime) {
		this.reportTime = reportTime;
	}
	
	@Column(name="SQKS")
	public String getDepartment() {
		return department;
	}
	
	public void setDepartment(String department) {
		this.department = department;
	}
	
	@Column(name="LY")
	public String getSource() {
		return source;
	}

	public void setSource(String source) {
		this.source = source;
	}
	
	@Column(name="BGZT")
	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}
	
	@Column(name="DYZT")
	public String getPrintFlag() {
		return printFlag;
	}

	public void setPrintFlag(String printFlag) {
		this.printFlag = printFlag;
	}

	@Column(name="TPLX")
	public String getReportType() {
		return reportType;
	}

	public void setReportType(String reportType) {
		this.reportType = reportType;
	}

	@Column(name="BGLJ")
	public String getReportPath() {
		return reportPath;
	}

	public void setReportPath(String reportPath) {
		this.reportPath = reportPath;
	}
	
	@Id
	@Column(name="BGWJM")
	public String getReportFileName() {
		return reportFileName;
	}

	public void setReportFileName(String reportFileName) {
		this.reportFileName = reportFileName;
	}

	@Transient
	public String getStartDate() {
		return startDate;
	}

	public void setStartDate(String startDate) {
		this.startDate = startDate;
	}

	@Transient
	public String getEndDate() {
		return endDate;
	}

	public void setEndDate(String endDate) {
		this.endDate = endDate;
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
		return new HashCodeBuilder().append(this.getReportFileName()).toHashCode();
	}

	/**
	 * 重载equals
	 */
	public boolean equals(Object obj) {
		return EqualsBuilder.reflectionEquals(this, obj);
	}
	
	@Override
	public boolean _newObejct() {
		return null == this.getReportFileName();
	}
}
