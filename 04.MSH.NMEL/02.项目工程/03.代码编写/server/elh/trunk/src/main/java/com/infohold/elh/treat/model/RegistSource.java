package com.infohold.elh.treat.model;


/**
 * 号源model
 * @author Administrator
 *
 */
public class RegistSource {
	//以下属性用于查询时展示剩余数量
	private String date;		//号源时间
	private String noon;		//号源午别 am上午pm下午
	private double amt;		//号费用
	private String type;		//号别 比如专家门诊
	private int total;			//可挂数量
	private int last;			//剩余数量
	
	//以下属性用于与医院通信时承载数据
	private String no;// 真实号码，不支付是预约号码
	private String appointNo;// 预约号码
	private String hospital;
	private String department;
	private String doctor;
	private String hospitalName;
	private String departmentName;
	private String doctorName;
	private String patientName;
	private String patient;
	private String cardNo;
	private String cardType;
	private String cardTypeName;//所持卡类型
	private String hospitalHlht;
	private String departmentHlht;
	private String doctorHlht;
	private String patientHlht;
	private String optAccount;
	public String getOptAccount() {
		return optAccount;
	}
	public void setOptAccount(String optAccount) {
		this.optAccount = optAccount;
	}
	public String getHospitalHlht() {
		return hospitalHlht;
	}
	public void setHospitalHlht(String hospitalHlht) {
		this.hospitalHlht = hospitalHlht;
	}
	public String getDepartmentHlht() {
		return departmentHlht;
	}
	public void setDepartmentHlht(String departmentHlht) {
		this.departmentHlht = departmentHlht;
	}
	public String getDoctorHlht() {
		return doctorHlht;
	}
	public void setDoctorHlht(String doctorHlht) {
		this.doctorHlht = doctorHlht;
	}
	public String getPatientHlht() {
		return patientHlht;
	}
	public void setPatientHlht(String patientHlht) {
		this.patientHlht = patientHlht;
	}
	public String getAppointNo() {
		return appointNo;
	}
	public void setAppointNo(String appointNo) {
		this.appointNo = appointNo;
	}
	public String getCardTypeName() {
		return cardTypeName;
	}
	public void setCardTypeName(String cardTypeName) {
		this.cardTypeName = cardTypeName;
	}
	public String getNo() {
		return no;
	}
	public void setNo(String no) {
		this.no = no;
	}
	public String getCardNo() {
		return cardNo;
	}
	public void setCardNo(String cardNo) {
		this.cardNo = cardNo;
	}
	public String getCardType() {
		return cardType;
	}
	public void setCardType(String cardType) {
		this.cardType = cardType;
	}
	public String getPatient() {
		return patient;
	}
	public void setPatient(String patient) {
		this.patient = patient;
	}
	public String getHospital() {
		return hospital;
	}
	public void setHospital(String hospital) {
		this.hospital = hospital;
	}
	public String getDepartment() {
		return department;
	}
	public void setDepartment(String department) {
		this.department = department;
	}
	public String getDoctor() {
		return doctor;
	}
	public void setDoctor(String doctor) {
		this.doctor = doctor;
	}
	public RegistSource() {
		super();
	}
	/**
	 * 
	 * @param date 号源时间
	 * @param noon 号源午别 am上午pm下午
	 * @param amt  号费用
	 * @param type 号别 比如专家门诊
	 * @param total 可挂数量
	 * @param last 剩余数量
	 */
	
	public String getDate() {
		return date;
	}
	public void setDate(String date) {
		this.date = date;
	}
	public String getNoon() {
		return noon;
	}
	public void setNoon(String noon) {
		this.noon = noon;
	}
	public double getAmt() {
		return amt;
	}
	public void setAmt(double amt) {
		this.amt = amt;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public int getTotal() {
		return total;
	}
	public void setTotal(int total) {
		this.total = total;
	}
	public int getLast() {
		return last;
	}
	public void setLast(int last) {
		this.last = last;
	}
	public String getHospitalName() {
		return hospitalName;
	}
	public void setHospitalName(String hospitalName) {
		this.hospitalName = hospitalName;
	}
	public String getDepartmentName() {
		return departmentName;
	}
	public void setDepartmentName(String departmentName) {
		this.departmentName = departmentName;
	}
	public String getDoctorName() {
		return doctorName;
	}
	public void setDoctorName(String doctorName) {
		this.doctorName = doctorName;
	}
	public String getPatientName() {
		return patientName;
	}
	public void setPatientName(String patientName) {
		this.patientName = patientName;
	}
}
