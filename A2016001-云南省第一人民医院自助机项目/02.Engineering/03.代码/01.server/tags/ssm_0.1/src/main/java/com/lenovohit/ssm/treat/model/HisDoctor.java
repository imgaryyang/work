package com.lenovohit.ssm.treat.model;

public class HisDoctor {
	private String id;
	private String departmentId;//"001001002",
    private String departmentName;//"物理康复", 
    private String name;//"蒋建光", 
    private String gender;//"1", 
    private String jobTitleId;//"001", 
    private String jobTitle;//"主任医师", 
    private String shortPinYin;//"JJG"
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
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
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getGender() {
		return gender;
	}
	public void setGender(String gender) {
		this.gender = gender;
	}
	public String getJobTitleId() {
		return jobTitleId;
	}
	public void setJobTitleId(String jobTitleId) {
		this.jobTitleId = jobTitleId;
	}
	public String getJobTitle() {
		return jobTitle;
	}
	public void setJobTitle(String jobTitle) {
		this.jobTitle = jobTitle;
	}
	public String getShortPinYin() {
		return shortPinYin;
	}
	public void setShortPinYin(String shortPinYin) {
		this.shortPinYin = shortPinYin;
	}
}
