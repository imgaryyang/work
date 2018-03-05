package com.infohold.elh.treat.vom;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.infohold.elh.base.model.Department;
import com.infohold.elh.base.model.Doctor;
import com.infohold.elh.base.model.Patient;
import com.infohold.elh.treat.model.Register;
import com.infohold.elh.treat.model.TreatDetail;

/**
 * 挂号表
 * @author Administrator
 *
 */
public class RegisterVom extends TreatDetailVom{
	private  Register  register;
	@JsonIgnore
	public Register getRegister() {
		return register;
	}
	public void setRegister(Register register) {
		this.register = register;
	}
	
	public RegisterVom(){
		this.register = new Register();
		this.treatDetail = new TreatDetail();
	}
	public RegisterVom(Register  register,TreatDetail treatDetail){
		this.register = register;
		this.setTreatDetail(treatDetail);
	}
	public String getId() {
		return this.register.getId();
	}
	public void setId(String id) {
		this.treatDetail.setId(id); //TODO 共享属性
		this.register.setId(id);
	}
	
	public String getNo() {
		return this.register.getNo();
	}
	public void setNo(String no) {
		this.register.setNo(no);
	}
	
	public String getRegisterTime() {
		return this.register.getRegisterTime();
	}
	public void setRegisterTime(String registerTime) {
		this.register.setRegisterTime(registerTime);
	}
	
	public String getType() {
		return this.register.getType();
	}
	public void setType(String type) {
		this.register.setType(type);
	}
	public String getCardTypeName() {
		return this.register.getCardTypeName();
	}
	public void setCardTypeName(String cardTypeName) {
		this.register.setCardTypeName(cardTypeName);
	}
	public Double getAmount() {
		return this.register.getAmount();
	}
	public void setAmount(Double amount) {
		this.register.setAmount(amount);
	}
	
	public boolean getRepeated() {
		return this.register.getRepeated();
	}
	public void setRepeated(boolean repeated) {
		this.register.setRepeated(repeated);
	}
	
	public String getOperator() {
		return this.register.getOperator();
	}
	public void setOperator(String operator) {
		this.register.setOperator(operator);
	}
	
	public boolean isReserved() {
		return this.register.isReserved();
	}
	public void setReserved(boolean reserved) {
		this.register.setReserved(reserved);
	}
	
	public String getCardNo() {
		return this.register.getCardNo();
	}
	public void setCardNo(String cardNo) {
		this.register.setCardNo(cardNo);
	}
	
	public String getCardType() {
		return this.register.getCardType();
	}
	public void setCardType(String cardType) {
		this.register.setCardType(cardType);
	}
	
	public String getDepartmentName() {
		return this.register.getDepartmentName();
	}
	public void setDepartmentName(String departmentName) {
		this.register.setDepartmentName(departmentName);
		this.treatDetail.setDeptName(departmentName);
	}
	
	public String getDoctorName() {
		return this.register.getDoctorName();
	}
	public void setDoctorName(String doctorName) {
		this.register.setDoctorName(doctorName);
	}
	
	
	public String getAppointNo() {
		return this.register.getAppointNo();
	}
	public void setAppointNo(String appointNo) {
		this.register.setAppointNo(appointNo);
	}
	
	public Department getDepartment() {
		return this.register.getDepartment();
	}
	public void setDepartment(Department department) {
		this.register.setDepartment(department);
	}
	public Doctor getDoctor() {
		return this.register.getDoctor();
	}
	public void setDoctor(Doctor doctor) {
		this.register.setDoctor(doctor);
	}
	
	public String getDepartmentId() {
		return this.register.getDepartmentId();
	}
	public void setDepartmentId(String departmentId) {
		this.register.setDepartmentId(departmentId);
		this.treatDetail.setDeptId(departmentId);
	}
	
	public String getDoctorId() {
		return this.register.getDoctorId();
	}
	public void setDoctorId(String doctorId) {
		this.register.setDoctorId(doctorId);
	}
	
	public String getTakeNoTime() {
		return this.register.getTakeNoTime();
	}
	public void setTakeNoTime(String takeNoTime) {
		this.register.setTakeNoTime(takeNoTime);
	}
	public String getRegDate() {
		return this.register.getRegDate();
	}
	public void setRegdate(String regDate) {
		this.register.setRegDate(regDate);
	}
	/**this.treatDetail 属性**/
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

	
	/**this.treatDetail 属性 end**/
	/**this.treatDetail 共享属性 end**/
	
}
