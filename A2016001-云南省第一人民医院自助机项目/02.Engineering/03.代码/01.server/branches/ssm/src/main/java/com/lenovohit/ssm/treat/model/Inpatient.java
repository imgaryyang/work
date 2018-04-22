package com.lenovohit.ssm.treat.model;

//住院基本信息
public class Inpatient {
	
	private String medicalRecordId;      //病历ID
	private String inpatientId;          //住院ID
	private String inpatientNo;          //住院号
	private String patientNo;            //病人编号
	private String patientName;          //病人姓名
	private String deptId;               //专科编号
	private String deptName;             //专科名称
	private String wardId;				 //病区ID
	private String wardName;			 //病区名称
	private String bedNo;                //床位号
	private String hospitalArea;		 //入院院区
	private String admission;		 	 //入院情况 1:一般 2:差 3:危急
	private String cardNo;               //门诊病历号
	private String inDate;               //入院时间
	private String outDate;              //出院时间
	private String status;               //状态标志 0:普通 1:挂账 2:呆账 5:特殊回归 7:普通回归 9:病区出院
	private String sex;                  //病人性别
	private String idenNo;               //身份证号
	private String mobile;               //联系电话
	private String birthday;             //出生日期
	private String inDiagnoseNo;         //入院诊断代码
	private String inDiagnose;           //入院诊断
	private String payment;          	 //自付预缴款
	private String drId;                 //主管医生编码
	private String drName;               //主管医生姓名
	private String nurId;                //病区编码
	private String nurName;              //病区名称
	private String nursingLevel;		 //护理级别 1:I级护理(常规护理)2:I级护理(优质护理)3:II级护理(常规护理)4:II级护理(优质护理)
	
    private String beginDate;
    private String endDate;
	
	
	public String getMedicalRecordId() {
		return medicalRecordId;
	}
	public void setMedicalRecordId(String medicalRecordId) {
		this.medicalRecordId = medicalRecordId;
	}
	public String getInpatientId() {
		return inpatientId;
	}
	public void setInpatientId(String inpatientId) {
		this.inpatientId = inpatientId;
	}
	public String getInpatientNo() {
		return inpatientNo;
	}
	public void setInpatientNo(String inpatientNo) {
		this.inpatientNo = inpatientNo;
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
	public String getDeptId() {
		return deptId;
	}
	public void setDeptId(String deptId) {
		this.deptId = deptId;
	}
	public String getDeptName() {
		return deptName;
	}
	public void setDeptName(String deptName) {
		this.deptName = deptName;
	}
	public String getWardId() {
		return wardId;
	}
	public void setWardId(String wardId) {
		this.wardId = wardId;
	}
	public String getWardName() {
		return wardName;
	}
	public void setWardName(String wardName) {
		this.wardName = wardName;
	}
	public String getBedNo() {
		return bedNo;
	}
	public void setBedNo(String bedNo) {
		this.bedNo = bedNo;
	}
	public String getHospitalArea() {
		return hospitalArea;
	}
	public void setHospitalArea(String hospitalArea) {
		this.hospitalArea = hospitalArea;
	}
	public String getAdmission() {
		return admission;
	}
	public void setAdmission(String admission) {
		this.admission = admission;
	}
	public String getCardNo() {
		return cardNo;
	}
	public void setCardNo(String cardNo) {
		this.cardNo = cardNo;
	}
	public String getInDate() {
		return inDate;
	}
	public void setInDate(String inDate) {
		this.inDate = inDate;
	}
	public String getOutDate() {
		return outDate;
	}
	public void setOutDate(String outDate) {
		this.outDate = outDate;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getSex() {
		return sex;
	}
	public void setSex(String sex) {
		this.sex = sex;
	}
	public String getIdenNo() {
		return idenNo;
	}
	public void setIdenNo(String idenNo) {
		this.idenNo = idenNo;
	}
	public String getMobile() {
		return mobile;
	}
	public void setMobile(String mobile) {
		this.mobile = mobile;
	}
	public String getBirthday() {
		return birthday;
	}
	public void setBirthday(String birthday) {
		this.birthday = birthday;
	}
	public String getInDiagnoseNo() {
		return inDiagnoseNo;
	}
	public void setInDiagnoseNo(String inDiagnoseNo) {
		this.inDiagnoseNo = inDiagnoseNo;
	}
	public String getInDiagnose() {
		return inDiagnose;
	}
	public void setInDiagnose(String inDiagnose) {
		this.inDiagnose = inDiagnose;
	}
	public String getPayment() {
		return payment;
	}
	public void setPayment(String payment) {
		this.payment = payment;
	}
	public String getDrId() {
		return drId;
	}
	public void setDrId(String drId) {
		this.drId = drId;
	}
	public String getDrName() {
		return drName;
	}
	public void setDrName(String drName) {
		this.drName = drName;
	}
	public String getNurId() {
		return nurId;
	}
	public void setNurId(String nurId) {
		this.nurId = nurId;
	}
	public String getNurName() {
		return nurName;
	}
	public void setNurName(String nurName) {
		this.nurName = nurName;
	}
	public String getNursingLevel() {
		return nursingLevel;
	}
	public void setNursingLevel(String nursingLevel) {
		this.nursingLevel = nursingLevel;
	}
	public String getBeginDate() {
		return beginDate;
	}
	public void setBeginDate(String beginDate) {
		this.beginDate = beginDate;
	}
	public String getEndDate() {
		return endDate;
	}
	public void setEndDate(String endDate) {
		this.endDate = endDate;
	}
	
}
