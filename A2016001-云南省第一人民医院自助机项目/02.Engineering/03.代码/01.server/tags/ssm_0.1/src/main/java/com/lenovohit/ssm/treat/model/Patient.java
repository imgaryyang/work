package com.lenovohit.ssm.treat.model;

public class Patient {
	
	private String miCardNo;
	private String medicalCardNo;
	private String idNo;
	private String id;
	private String name;
	private String gender;
	private String actStatus;	//账户开通 0 未开通 1已开通 9已注销
	private String accountNo;	//虚拟账户账号？TODO 
	private String birthday;	// "1986-09-11", 
	private String age;			// "31", 
	private String mobile;		// "13657869099", 
	private String medium;		// "1",
	private String nation;//
	private String address;
	private String idIssuer;
	private String idEffectiveDate;
	  
	
	private HisAccount account;
	private MedicalCard medicalCard;
	
	
	public String getNation() {
		return nation;
	}
	public void setNation(String nation) {
		this.nation = nation;
	}
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	public String getIdIssuer() {
		return idIssuer;
	}
	public void setIdIssuer(String idIssuer) {
		this.idIssuer = idIssuer;
	}
	public String getIdEffectiveDate() {
		return idEffectiveDate;
	}
	public void setIdEffectiveDate(String idEffectiveDate) {
		this.idEffectiveDate = idEffectiveDate;
	}
	
	public String getIdNo() {
		return idNo;
	}
	public void setIdNo(String idNo) {
		this.idNo = idNo;
	}
	public String getMedicalCardNo() {
		return medicalCardNo;
	}
	public void setMedicalCardNo(String medicalCardNo) {
		this.medicalCardNo = medicalCardNo;
	}
	public String getMiCardNo() {
		return miCardNo;
	}
	public void setMiCardNo(String miCardNo) {
		this.miCardNo = miCardNo;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
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
	public String getActStatus() {
		return actStatus;
	}
	public void setActStatus(String actStatus) {
		this.actStatus = actStatus;
	}
	public String getAccountNo() {
		return accountNo;
	}
	public void setAccountNo(String accountNo) {
		this.accountNo = accountNo;
	}
	public HisAccount getAccount() {
		return account;
	}
	public void setAccount(HisAccount account) {
		this.account = account;
	}
	public MedicalCard getMedicalCard() {
		return medicalCard;
	}
	public void setMedicalCard(MedicalCard medicalCard) {
		this.medicalCard = medicalCard;
	}
	public String getBirthday() {
		return birthday;
	}
	public void setBirthday(String birthday) {
		this.birthday = birthday;
	}
	public String getAge() {
		return age;
	}
	public void setAge(String age) {
		this.age = age;
	}
	public String getMobile() {
		return mobile;
	}
	public void setMobile(String mobile) {
		this.mobile = mobile;
	}
	public String getMedium() {
		return medium;
	}
	public void setMedium(String medium) {
		this.medium = medium;
	}
	
}
