package com.lenovohit.elh.treat.vom;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.lenovohit.elh.treat.model.CheckDetail;
import com.lenovohit.elh.treat.model.MedicalCheck;
import com.lenovohit.elh.treat.model.TreatDetail;

/**
 * 检查表
 * 
 * @author Administrator
 *
 */
public class MedicalCheckVom extends TreatDetailVom{
	
	private  MedicalCheck  medicalCheck;
	@JsonIgnore
	public MedicalCheck getMedicalCheck() {
		return medicalCheck;
	}
	public void setMedicalCheck(MedicalCheck medicalCheck) {
		this.medicalCheck = medicalCheck;
	}
	@JsonIgnore
	public TreatDetail getTreatDetail() {
		return treatDetail;
	}
	public void setTreatDetail(TreatDetail treatDetail) {
		this.treatDetail = treatDetail;
	}
	public MedicalCheckVom(MedicalCheck  medicalCheck,TreatDetail treatDetail){
		this.medicalCheck = medicalCheck;
		this.treatDetail = treatDetail;
	}
	public MedicalCheckVom(){
		this.medicalCheck = new MedicalCheck();
		this.treatDetail = new TreatDetail();
	}
	
	
	public void setDetails(List<CheckDetail> checkDetails) {
		this.medicalCheck.setDetails(checkDetails);
	}
	public void setSubject(String subject) {
		this.medicalCheck.setSubject(subject);
	}
	public void setCaseNo(String caseNo) {
		this.medicalCheck.setCaseNo(caseNo);
	}
	public void setDepartment(String department) {
		this.medicalCheck.setDepartment(department);
	}
	public void setBedNo(String bedNo) {
		this.medicalCheck.setBedNo(bedNo);
	}
	public void setSpecimenNo(String specimenNo) {
		this.medicalCheck.setSpecimenNo(specimenNo);
	}
	public void setSpecimen(String specimen) {
		this.medicalCheck.setSpecimen(specimen);
	}
	public void setCheckTime(String checkTime) {
		this.medicalCheck.setCheckTime(checkTime);
	}
	public void setSubmitTime(String submitTime) {
		this.medicalCheck.setSubmitTime(submitTime);
	}
	public void setReportTime(String reportTime) {
		this.medicalCheck.setReportTime(reportTime);
	}
	public void setOperator(String operator) {
		this.medicalCheck.setOperator(operator);
	}
	public void setAudit(String audit) {
		this.medicalCheck.setAudit(audit);
	}
	public void setMachine(String machine) {
		this.medicalCheck.setMachine(machine);
	}
	public void setComment(String comment) {
		this.medicalCheck.setComment(comment);
	}
	public void setDiagnosis(String diagnosis) {
		this.medicalCheck.setDiagnosis(diagnosis);
	}
	public void setOptDoctor(String optDoctor) {
		this.medicalCheck.setOptDoctor(optDoctor);
	}
	public void setApplyDoctor(String applyDoctor) {
		this.medicalCheck.setApplyDoctor(applyDoctor);
	}
	
	public void setId(String id) {
		this.treatDetail.setId(id); //TODO 共享属性
		this.medicalCheck.setId(id);
	}
	public List<CheckDetail> getDetails() {
		return this.medicalCheck.getDetails();
	}
	public String getId() {
		return this.medicalCheck.getId();
	}

	public String getSubject() {
		return this.medicalCheck.getSubject();
	}

	public String getCaseNo() {
		return this.medicalCheck.getCaseNo();
	}

	public String getDepartment() {
		return this.medicalCheck.getDepartment();
	}

	public String getBedNo() {
		return this.medicalCheck.getBedNo();
	}

	public String getSpecimenNo() {
		return this.medicalCheck.getSpecimenNo();
	}

	public String getSpecimen() {
		return this.medicalCheck.getSpecimen();
	}

	public String getCheckTime() {
		return this.medicalCheck.getCheckTime();
	}

	public String getSubmitTime() {
		return this.medicalCheck.getSubmitTime();
	}

	public String getReportTime() {
		return this.medicalCheck.getReportTime();
	}

	public String getOperator() {
		return this.medicalCheck.getOperator();
	}

	public String getAudit() {
		return this.medicalCheck.getAudit();
	}

	public String getMachine() {
		return this.medicalCheck.getMachine();
	}

	public String getComment() {
		return this.medicalCheck.getComment();
	}

	public String getDiagnosis() {
		return this.medicalCheck.getDiagnosis();
	}
	public String getOptDoctor() {
		return this.medicalCheck.getOptDoctor();
	}
	public String getApplyDoctor() {
		return this.medicalCheck.getApplyDoctor();
	}
}
