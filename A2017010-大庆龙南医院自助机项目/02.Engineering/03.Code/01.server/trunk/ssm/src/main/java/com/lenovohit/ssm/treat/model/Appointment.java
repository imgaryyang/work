package com.lenovohit.ssm.treat.model;
/**
 * 号源 、预约记录 
 *
 */
public class Appointment {
	
	private String bookingPlatform;//预约平台
	private String scheduleId;
	private String appointmentId;
	private String appointmentNo;//预约序号
	private String appointmentTime;//预约时间
	private String appointmentDate;//预约日期
	private String appointmentState;// 0预留，1预约，2等待，3已呼叫，4已刷卡，5完成，9放弃
	private String appointmentInfo;//预约信息
	private String cardNo;
	private String patientNo;//病人编号
	private String patientName;//病人姓名
	private String patientSex;//病人性别
	private String patientBirthday;//出生日期
	private String patientAge;//年龄
	private String patientPhone;
	private String patientIdNo;
	private String doctorName;//医生姓名
	private String doctorTypeName;
	private String deptName;//预约科室
	private String clinicTypeName;//
	private String clinicDurationName;//全天、上午、下午
	private String clinicHouse;//预约诊室
	private String hospitalDistrictName;//院区
	private String remarks;
	private String verifyCode;//取号凭证
	private String scheduleDeptName;//值班科室
	private String houseLocation;//房间位置
	private String operaterUserID;
	private String lhz;//是否是老会展标志
	private int    age;//年龄
	
	public String getClinicDurationName() {
		return clinicDurationName;
	}
	public void setClinicDurationName(String clinicDurationName) {
		this.clinicDurationName = clinicDurationName;
	}
	public String getAppointmentDate() {
		return appointmentDate;
	}
	public void setAppointmentDate(String appointmentDate) {
		this.appointmentDate = appointmentDate;
	}
	public String getBookingPlatform() {
		return bookingPlatform;
	}
	public void setBookingPlatform(String bookingPlatform) {
		this.bookingPlatform = bookingPlatform;
	}
	public String getScheduleId() {
		return scheduleId;
	}
	public void setScheduleId(String scheduleId) {
		this.scheduleId = scheduleId;
	}
	public String getAppointmentId() {
		return appointmentId;
	}
	public void setAppointmentId(String appointmentId) {
		this.appointmentId = appointmentId;
	}
	public String getAppointmentNo() {
		return appointmentNo;
	}
	public void setAppointmentNo(String appointmentNo) {
		this.appointmentNo = appointmentNo;
	}
	public String getAppointmentTime() {
		return appointmentTime;
	}
	public void setAppointmentTime(String appointmentTime) {
		this.appointmentTime = appointmentTime;
	}
	public String getAppointmentState() {
		return appointmentState;
	}
	public void setAppointmentState(String appointmentState) {
		this.appointmentState = appointmentState;
	}
	public String getAppointmentInfo() {
		return appointmentInfo;
	}
	public void setAppointmentInfo(String appointmentInfo) {
		this.appointmentInfo = appointmentInfo;
	}
	public String getCardNo() {
		return cardNo;
	}
	public void setCardNo(String cardNo) {
		this.cardNo = cardNo;
	}
	public String getPatientNo() {
		return patientNo;
	}
	public void setPatientNo(String patientNo) {
		this.patientNo = patientNo;
	}
	public String getPatientName() {
		return patientName;
	}
	public void setPatientName(String patientName) {
		this.patientName = patientName;
	}
	public String getPatientSex() {
		return patientSex;
	}
	public void setPatientSex(String patientSex) {
		this.patientSex = patientSex;
	}
	public String getPatientBirthday() {
		return patientBirthday;
	}
	public void setPatientBirthday(String patientBirthday) {
		this.patientBirthday = patientBirthday;
	}
	public String getPatientAge() {
		return patientAge;
	}
	public void setPatientAge(String patientAge) {
		this.patientAge = patientAge;
	}
	public String getPatientPhone() {
		return patientPhone;
	}
	public void setPatientPhone(String patientPhone) {
		this.patientPhone = patientPhone;
	}
	public String getPatientIdNo() {
		return patientIdNo;
	}
	public void setPatientIdNo(String patientIdNo) {
		this.patientIdNo = patientIdNo;
	}
	public String getDoctorName() {
		return doctorName;
	}
	public void setDoctorName(String doctorName) {
		this.doctorName = doctorName;
	}
	public String getDoctorTypeName() {
		return doctorTypeName;
	}
	public void setDoctorTypeName(String doctorTypeName) {
		this.doctorTypeName = doctorTypeName;
	}
	public String getDeptName() {
		return deptName;
	}
	public void setDeptName(String deptName) {
		this.deptName = deptName;
	}
	public String getClinicTypeName() {
		return clinicTypeName;
	}
	public void setClinicTypeName(String clinicTypeName) {
		this.clinicTypeName = clinicTypeName;
	}
	public String getHospitalDistrictName() {
		return hospitalDistrictName;
	}
	public void setHospitalDistrictName(String hospitalDistrictName) {
		this.hospitalDistrictName = hospitalDistrictName;
	}
	public String getClinicHouse() {
		return clinicHouse;
	}
	public void setClinicHouse(String clinicHouse) {
		this.clinicHouse = clinicHouse;
	}
	public String getRemarks() {
		return remarks;
	}
	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}
	public String getVerifyCode() {
		return verifyCode;
	}
	public void setVerifyCode(String verifyCode) {
		this.verifyCode = verifyCode;
	}
    public String getScheduleDeptName() {
        return scheduleDeptName;
    }
    public void setScheduleDeptName(String scheduleDeptName) {
        this.scheduleDeptName = scheduleDeptName;
    }
    public String getHouseLocation() {
        return houseLocation;
    }
    public void setHouseLocation(String houseLocation) {
        this.houseLocation = houseLocation;
    }
	public String getOperaterUserID() {
		return operaterUserID;
	}
	public void setOperaterUserID(String operaterUserID) {
		this.operaterUserID = operaterUserID;
	}
	public String getLhz() {
		return lhz;
	}
	public void setLhz(String lhz) {
		this.lhz = lhz;
	}
	public int getAge() {
		return age;
	}
	public void setAge(int age) {
		this.age = age;
	}
	
}
