package com.infohold.elh.treat.vom;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.infohold.elh.base.model.Doctor;
import com.infohold.elh.treat.model.Diagnosis;
import com.infohold.elh.treat.model.TreatDetail;

/**
 * 看诊
 * @author Administrator
 *
 */
public class DiagnosisVom extends TreatDetailVom{
	private  Diagnosis  diagnosis;
	@JsonIgnore
	public Diagnosis getDiagnosis() {
		return diagnosis;
	}
	public void setDiagnosis(Diagnosis diagnosis) {
		this.diagnosis = diagnosis;
	}
	public DiagnosisVom(Diagnosis  diagnosis,TreatDetail treatDetail){
		this.diagnosis = diagnosis;
		this.treatDetail = treatDetail;
	}
	public DiagnosisVom(){
		this.diagnosis = new Diagnosis();
		this.treatDetail = new TreatDetail();
	}
	public void setId(String id) {
		this.treatDetail.setId(id); //TODO 共享属性
		this.diagnosis.setId(id);
	}
	public String getDoctorId() {
		return diagnosis.getDoctorId();
	}
	public Doctor getDoctor() {
		return diagnosis.getDoctor();
	}
	
	public void setDoctorId(String doctorId) {
		this.diagnosis.setDoctorId(doctorId);
	}
	public void setDoctor(Doctor doctor) {
		this.diagnosis.setDoctor(doctor);
	}
	public String getDoctorName() {
		return diagnosis.getDoctorName();
	}
	public void setDoctorName(String doctorName) {
		this.diagnosis.setDoctorName(doctorName);
	}
	
}
