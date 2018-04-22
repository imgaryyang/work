package com.lenovohit.ssm.treat.model;

/**
 * 处方记录
 * @author fanyang
 *
 */
public class PrescriptionRecord {
	private String pharmacyWindow;	//取药药房:
	private String date;			//处方生成日期:2018-01-25T16:36:42
	private String prescriptionNo;	//处方号:
	private String department;		//科室:甲状腺乳腺外科
	private String patientNo;		//病人编号:
	private String unit;			//单位:
	private String patientName;		//病人姓名:
	private String gender;			//性别:
	private String age;				//年龄:
	private String costType;		//费别:
	private String address;			//地址:黑龙江省绥化市安达市任民镇1委6组51号
	private String mobilPhone;		//手机:
	private String clinicalDiagnosis;//临床诊断:健康查体
	private String remarks;			//备注:
	//private String drugDetail;
	//private List<PrescriptionItem> items = new ArrayList<PrescriptionItem>();//处方单的药品明细，1条至多条
	private String dispensing;		//发药人
	private String auditor;			//审核人
	private String distributor;		//调配人
	private String checker;			//核对人
	private String doctor;			//医生
	private String totalAmount;		//处方单总金额
	private String prescriptionType;//处方单类型
	private String printCount;		//打印次数
	private String printFlag;		//打印标志
    private String operaterId;		//操作者Id
    private String isPrint;
    private String startTime;       
    private String endTime;         
    private String hisUserid;       //自助机对应His用户id
    
	public String getPharmacyWindow() {
		return pharmacyWindow;
	}
	public void setPharmacyWindow(String pharmacyWindow) {
		this.pharmacyWindow = pharmacyWindow;
	}
	public String getDate() {
		return date;
	}
	public void setDate(String date) {
		this.date = date;
	}
	public String getPrescriptionNo() {
		return prescriptionNo;
	}
	public void setPrescriptionNo(String prescriptionNo) {
		this.prescriptionNo = prescriptionNo;
	}
	public String getDepartment() {
		return department;
	}
	public void setDepartment(String department) {
		this.department = department;
	}
	public String getPatientNo() {
		return patientNo;
	}
	public void setPatientNo(String patientNo) {
		this.patientNo = patientNo;
	}
	public String getUnit() {
		return unit;
	}
	public void setUnit(String unit) {
		this.unit = unit;
	}
	public String getPatientName() {
		return patientName;
	}
	public void setPatientName(String patientName) {
		this.patientName = patientName;
	}
	public String getGender() {
		return gender;
	}
	public void setGender(String gender) {
		this.gender = gender;
	}
	public String getAge() {
		return age;
	}
	public void setAge(String age) {
		this.age = age;
	}
	public String getCostType() {
		return costType;
	}
	public void setCostType(String costType) {
		this.costType = costType;
	}
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	public String getMobilPhone() {
		return mobilPhone;
	}
	public void setMobilPhone(String mobilPhone) {
		this.mobilPhone = mobilPhone;
	}
	public String getClinicalDiagnosis() {
		return clinicalDiagnosis;
	}
	public void setClinicalDiagnosis(String clinicalDiagnosis) {
		this.clinicalDiagnosis = clinicalDiagnosis;
	}
	public String getRemarks() {
		return remarks;
	}
	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}
	/*public String getDrugDetail() {
		return drugDetail;
	}
	public void setDrugDetail(String drugDetail) {
		this.drugDetail = drugDetail;
	}
	public List<PrescriptionItem> getItems() {
		return items;
	}
	public void setItems(List<PrescriptionItem> items) {
		this.items = items;
	}*/
	public String getDispensing() {
		return dispensing;
	}
	public void setDispensing(String dispensing) {
		this.dispensing = dispensing;
	}
	public String getAuditor() {
		return auditor;
	}
	public void setAuditor(String auditor) {
		this.auditor = auditor;
	}
	public String getDistributor() {
		return distributor;
	}
	public void setDistributor(String distributor) {
		this.distributor = distributor;
	}
	public String getChecker() {
		return checker;
	}
	public void setChecker(String checker) {
		this.checker = checker;
	}
	public String getDoctor() {
		return doctor;
	}
	public void setDoctor(String doctor) {
		this.doctor = doctor;
	}
	public String getTotalAmount() {
		return totalAmount;
	}
	public void setTotalAmount(String totalAmount) {
		this.totalAmount = totalAmount;
	}
	public String getPrescriptionType() {
		return prescriptionType;
	}
	public void setPrescriptionType(String prescriptionType) {
		this.prescriptionType = prescriptionType;
	}
	public String getPrintCount() {
		return printCount;
	}
	public void setPrintCount(String printCount) {
		this.printCount = printCount;
	}
	public String getPrintFlag() {
		return printFlag;
	}
	public void setPrintFlag(String printFlag) {
		this.printFlag = printFlag;
	}
	public String getOperaterId() {
		return operaterId;
	}
	public void setOperaterId(String operaterId) {
		this.operaterId = operaterId;
	}
	public String getIsPrint() {
		return isPrint;
	}
	public void setIsPrint(String isPrint) {
		this.isPrint = isPrint;
	}
	public String getStartTime() {
		return startTime;
	}
	public void setStartTime(String startTime) {
		this.startTime = startTime;
	}
	public String getEndTime() {
		return endTime;
	}
	public void setEndTime(String endTime) {
		this.endTime = endTime;
	}
	public String getHisUserid() {
		return hisUserid;
	}
	public void setHisUserid(String hisUserid) {
		this.hisUserid = hisUserid;
	}
}
