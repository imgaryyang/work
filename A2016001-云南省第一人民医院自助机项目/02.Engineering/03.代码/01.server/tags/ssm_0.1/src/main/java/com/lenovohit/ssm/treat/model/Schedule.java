package com.lenovohit.ssm.treat.model;
/**
 * 排班
 * @author xiaweiyi
 *
 */
public class Schedule {
	private String id;
	private String date;			//2017-01-15", 
	private String time;			//09:00", 
	private String dayPeriod;		//am", 
	private String departmentId;	//001001002", 
	private String departmentName;	//物理康复", 
	private String diagnosisType;	//专科", 
	private String doctorId;		//0001", 
	private String doctorName;		//蒋建光", 
	private String doctorJobTitleId;//001", 
	private String doctorJobTitle;	//主任医师", 
	private String amt;				//2000", 
	private int totolBookNum;		//30", 
    private int unusedBookNum;		//12", 
    private int usedBookNum;		//18",
	private String address;			//门诊楼二楼东侧外科诊室", 
	private String state;			//1"
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getDate() {
		return date;
	}
	public void setDate(String date) {
		this.date = date;
	}
	public String getTime() {
		return time;
	}
	public void setTime(String time) {
		this.time = time;
	}
	public String getDayPeriod() {
		return dayPeriod;
	}
	public void setDayPeriod(String dayPeriod) {
		this.dayPeriod = dayPeriod;
	}
	public String getDepartmentId() {
		return departmentId;
	}
	public void setDepartmentId(String departmentId) {
		this.departmentId = departmentId;
	}
	public String getDepartmentName() {
		return departmentName;
	}
	public void setDepartmentName(String departmentName) {
		this.departmentName = departmentName;
	}
	public String getDiagnosisType() {
		return diagnosisType;
	}
	public void setDiagnosisType(String diagnosisType) {
		this.diagnosisType = diagnosisType;
	}
	public String getDoctorId() {
		return doctorId;
	}
	public void setDoctorId(String doctorId) {
		this.doctorId = doctorId;
	}
	public String getDoctorName() {
		return doctorName;
	}
	public void setDoctorName(String doctorName) {
		this.doctorName = doctorName;
	}
	public String getDoctorJobTitleId() {
		return doctorJobTitleId;
	}
	public void setDoctorJobTitleId(String doctorJobTitleId) {
		this.doctorJobTitleId = doctorJobTitleId;
	}
	public String getDoctorJobTitle() {
		return doctorJobTitle;
	}
	public void setDoctorJobTitle(String doctorJobTitle) {
		this.doctorJobTitle = doctorJobTitle;
	}
	public String getAmt() {
		return amt;
	}
	public void setAmt(String amt) {
		this.amt = amt;
	}
	public int getTotolBookNum() {
		return totolBookNum;
	}
	public void setTotolBookNum(int totolBookNum) {
		this.totolBookNum = totolBookNum;
	}
	public int getUnusedBookNum() {
		return unusedBookNum;
	}
	public void setUnusedBookNum(int unusedBookNum) {
		this.unusedBookNum = unusedBookNum;
	}
	public int getUsedBookNum() {
		return usedBookNum;
	}
	public void setUsedBookNum(int usedBookNum) {
		this.usedBookNum = usedBookNum;
	}
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	public String getState() {
		return state;
	}
	public void setState(String state) {
		this.state = state;
	}
	
}

