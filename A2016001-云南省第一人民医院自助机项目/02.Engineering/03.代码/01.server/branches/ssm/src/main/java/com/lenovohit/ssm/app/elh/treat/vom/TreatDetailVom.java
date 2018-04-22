package com.lenovohit.ssm.app.elh.treat.vom;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.lenovohit.ssm.app.elh.base.model.Hospital;
import com.lenovohit.ssm.app.elh.treat.model.TreatDetail;
import com.lenovohit.ssm.treat.model.Patient;

/**
 * 挂号表
 * @author Administrator
 *
 */
public class TreatDetailVom{
	protected  TreatDetail treatDetail;
	@JsonIgnore
	public TreatDetail getTreatDetail() {
		return treatDetail;
	}

	public void setTreatDetail(TreatDetail treatDetail) {
		this.treatDetail = treatDetail;
	}

	/*public TreatDetailVom(){
	}
	public TreatDetailVom(T  t,TreatDetail treatDetail){
		this.t = t;
		this.treatDetail = treatDetail;
	}*/
	/**treatdetail 属性**/
	public String getName() {
		return this.treatDetail.getName();
	}
	
	public String getIdHlht() {
		return this.treatDetail.getIdHlht();
	}
	
	public String getBiz() {
		return this.treatDetail.getBiz();
	}
	public String getBizName() {
		return this.treatDetail.getBizName();
	}
	public String getDescription() {
		return this.treatDetail.getDescription();
	}
	public String getNotification() {
		return this.treatDetail.getNotification();
	}
	public String getTreatment() {
		return this.treatDetail.getTreatment();
	}
	public String getStartTime() {
		return this.treatDetail.getStartTime();
	}
	public String getEndTime() {
		return this.treatDetail.getEndTime();
	}
	public String getUpdateTime() {
		return this.treatDetail.getUpdateTime();
	}
	public String getCreateTime() {
		return this.treatDetail.getCreateTime();
	}
	public String getStatus() {
		return this.treatDetail.getStatus();
	}
	public boolean getNeedPay() {
		return this.treatDetail.getNeedPay();
	}
	public boolean getPayed() {
		return this.treatDetail.getPayed();
	}
	public String getMedicalResult() {
		return this.treatDetail.getMedicalResult();
	}
	public String getPatientId() {
		return this.treatDetail.getPatientId();
	}
	public Patient getPatient() {
		return this.treatDetail.getPatient();
	}
	public String getPatientName() {
		return this.treatDetail.getPatientName();
	}
	
	public void setPatientId(String patientId) {
		this.treatDetail.setPatientId(patientId);
	}
	public void setPatient(Patient patient) {
		this.treatDetail.setPatient(patient);
	}
	public void setIdHlht(String idHlht) {
		this.treatDetail.setIdHlht(idHlht);
	}
	
	public void setName(String name) {
		this.treatDetail.setName(name);
	}
	public void setBiz(String biz) {
		this.treatDetail.setBiz(biz);
	}
	public void setBizName(String bizName) {
		this.treatDetail.setBizName(bizName);
	}
	public void setDescription(String description) {
		this.treatDetail.setDescription(description);
	}
	public void setNotification(String notification) {
		this.treatDetail.setNotification(notification);
	}
	public void setTreatment(String treatment) {
		this.treatDetail.setTreatment(treatment);
	}
	public void setStartTime(String startTime) {
		this.treatDetail.setStartTime(startTime);
	}
	public void setEndTime(String endTime) {
		this.treatDetail.setEndTime(endTime);
	}
	public void setUpdateTime(String updateTime) {
		this.treatDetail.setUpdateTime(updateTime);
	}
	public void setCreateTime(String createTime) {
		this.treatDetail.setCreateTime(createTime);
	}
	public void setStatus(String status) {
		this.treatDetail.setStatus(status);
	}
	public void setNeedPay(boolean needPay) {
		this.treatDetail.setNeedPay(needPay);
	}
	public void setPayed(boolean payed) {
		this.treatDetail.setPayed(payed);
	}
	public void setMedicalResult(String medicalResult) {
		this.treatDetail.setMedicalResult(medicalResult);
	}
	public void setPatientName(String patientName) {
		this.treatDetail.setPatientName(patientName);
	}

	
	/**treatdetail 属性 end**/
	/**treatdetail 共享属性 end**/
	public String getHospitalId() {
		return this.treatDetail.getHospitalId();
	}
	public void setHospitalId(String hospitalId) {
		// this.register.setHospitalId(hospitalId);
		this.treatDetail.setHospitalId(hospitalId);// TODO 共享属性
	}
	public Hospital getHospital() {
		return this.treatDetail.getHospital();
	}
	public void setHospital(Hospital hospital) {
		//this.register.setHospital(hospital);//TODO 共享属性
		this.treatDetail.setHospital(hospital);
	}
	public String getHospitalName() {
		return this.treatDetail.getHospitalName();
	}
	public void setHospitalName(String hospitalName) {
		//this.register.setHospitalName(hospitalName);//TODO 共享属性
		this.treatDetail.setHospitalName(hospitalName);
	}
	public String getDeptId(){
		return this.treatDetail.getDeptId();
	}
	public void setDeptId(String deptId){
		this.treatDetail.setDeptId(deptId);
	}
	public String getDeptName() {
		return this.treatDetail.getDeptName();
	}
	public void setDeptName(String deptName) {
		this.treatDetail.setDeptName(deptName);
	}
}
