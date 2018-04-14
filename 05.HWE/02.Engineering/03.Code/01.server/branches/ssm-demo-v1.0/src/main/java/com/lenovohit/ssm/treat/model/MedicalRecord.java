package com.lenovohit.ssm.treat.model;
/**
 * 就诊记录
 * @author xiaweiyi
 *
 */
public class MedicalRecord {
    private String patientNo;       //
    private String recordId;		//病情记录ID
    private String recordName;		//
    private String clinicalId;       // 诊疗活动ID
    private String specId;           // 接诊专科
    private String specName;         // 接诊专科名称
    private String doctorId;         // 接诊医师
    private String doctorName;       // 接诊医师姓名
    private String doctorTypeName;    // 接诊医师职称名称
	private String specStartTime;    // 接诊开始时间
    private String diseaseId;      	// 病种类型
    private String diseaseType;      // 病种类型
    private String diseaseName;      // 病种名称
    private String diseaseCode;      // 病种代码 
    private String printCount;		//打印次数
    private String operaterId;		//操作者Id
    private String mRSpecID;		//病例专科ID
    private String mFotmatCode;		//格式代码
    private String fristInputTime;	//首次录入时间
    private String isPrint;
    private String startTime;       //
    private String endTime;         //
    
    private String hisUserid;       //自助机对应His用户id
    
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
	public String getDiseaseName() {
		return diseaseName;
	}
	public void setDiseaseName(String diseaseName) {
		this.diseaseName = diseaseName;
	}
	public String getPatientNo() {
		return patientNo;
	}
	public void setPatientNo(String patientNo) {
		this.patientNo = patientNo;
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
	public String getRecordId() {
		return recordId;
	}
	public void setRecordId(String recordId) {
		this.recordId = recordId;
	}
	public String getRecordName() {
		return recordName;
	}
	public void setRecordName(String recordName) {
		this.recordName = recordName;
	}
	public String getClinicalId() {
		return clinicalId;
	}
	public void setClinicalId(String clinicalId) {
		this.clinicalId = clinicalId;
	}
	public String getSpecId() {
		return specId;
	}
	public void setSpecId(String specId) {
		this.specId = specId;
	}
	public String getSpecName() {
		return specName;
	}
	public void setSpecName(String specName) {
		this.specName = specName;
	}
	public String getDoctorId() {
		return doctorId;
	}
	public void setDoctorId(String doctorId) {
		this.doctorId = doctorId;
	}
	public String getSpecStartTime() {
		return specStartTime;
	}
	public void setSpecStartTime(String specStartTime) {
		this.specStartTime = specStartTime;
	}
	public String getDiseaseType() {
		return diseaseType;
	}
	public void setDiseaseType(String diseaseType) {
		this.diseaseType = diseaseType;
	}
	public String getDiseaseCode() {
		return diseaseCode;
	}
	public void setDiseaseCode(String diseaseCode) {
		this.diseaseCode = diseaseCode;
	}
	public String getIsPrint() {
		return isPrint;
	}
	public void setIsPrint(String isPrint) {
		this.isPrint = isPrint;
	}
	public String getDiseaseId() {
		return diseaseId;
	}
	public void setDiseaseId(String diseaseId) {
		this.diseaseId = diseaseId;
	}
	public String getPrintCount() {
		return printCount;
	}
	public void setPrintCount(String printCount) {
		this.printCount = printCount;
	}
	public String getOperaterId() {
		return operaterId;
	}
	public void setOperaterId(String operaterId) {
		this.operaterId = operaterId;
	}
	public String getmFotmatCode() {
		return mFotmatCode;
	}
	public void setmFotmatCode(String mFotmatCode) {
		this.mFotmatCode = mFotmatCode;
	}
	public String getFristInputTime() {
		return fristInputTime;
	}
	public void setFristInputTime(String fristInputTime) {
		this.fristInputTime = fristInputTime;
	}
	public String getHisUserid() {
		return hisUserid;
	}
	public void setHisUserid(String hisUserid) {
		this.hisUserid = hisUserid;
	}
	public String getmRSpecID() {
		return mRSpecID;
	}
	public void setmRSpecID(String mRSpecID) {
		this.mRSpecID = mRSpecID;
	}

}

