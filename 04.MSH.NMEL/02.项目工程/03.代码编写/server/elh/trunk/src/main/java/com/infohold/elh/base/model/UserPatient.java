package com.infohold.elh.base.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.infohold.core.model.BaseIdModel;

/**
 * 常用就诊人（就诊人关系表）
 * @author Administrator
 *
 */
@Entity
@Table(name="ELH_PATIENT_RELA")
public class UserPatient extends BaseIdModel{
	private static final long serialVersionUID = 4690782012865466902L;
	private String idHlht;//院方数据ID
	private String userId         ;   //用户	
	private String patientId     ;   //就诊人	
	private String userType    ;    //用户类型
	private String name         ;   //姓名	
	private String gender       ;   //性别	
	private String relationshi  ;   //关系	
	private String alias        ;   //别名	
	private String idno         ;   //身份证号码
	private String photo        ;   //头像	
	private String mobile       ;   //手机	
	private String email        ;   //邮箱	
	private String address      ;   //地址	
	private String status       ;   //状态	
	private String birthday     ;   //出生日期	
	private double height       ;   //身高	
	private double weight       ;
	private Patient patient     ;   //就诊人	
	private long cardCount       ;
	
	@Column(name = "user_id")
	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}
	
	@Column(name = "patient_id")
	public String getPatientId() {
		return patientId;
	}
	public void setPatientId(String patientId) {
		this.patientId = patientId;
	}
	
	@Column(name = "user_type")
	public String getUserType() {
		return userType;
	}
	public void setUserType(String userType) {
		this.userType = userType;
	}
	
	@Column(name = "name")
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	
	@Column(name = "gender")
	public String getGender() {
		return gender;
	}
	public void setGender(String gender) {
		this.gender = gender;
	}
	
	@Column(name = "relationshi")
	public String getRelationshi() {
		return relationshi;
	}
	public void setRelationshi(String relationshi) {
		this.relationshi = relationshi;
	}
	
	@Column(name = "alias")
	public String getAlias() {
		return alias;
	}
	public void setAlias(String alias) {
		this.alias = alias;
	}
	
	@Column(name = "idno")
	public String getIdno() {
		return idno;
	}
	public void setIdno(String idno) {
		this.idno = idno;
	}
	
	@Column(name = "photo")
	public String getPhoto() {
		return photo;
	}
	public void setPhoto(String photo) {
		this.photo = photo;
	}
	
	@Column(name = "mobile")
	public String getMobile() {
		return mobile;
	}
	public void setMobile(String mobile) {
		this.mobile = mobile;
	}
	
	@Column(name = "email")
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	
	@Column(name = "address")
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	
	@Column(name = "status")
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	
	@Column(name = "birthday")
	public String getBirthday() {
		return birthday;
	}
	public void setBirthday(String birthday) {
		this.birthday = birthday;
	}
	
	@Column(name = "height")
	public double getHeight() {
		return height;
	}
	public void setHeight(double height) {
		this.height = height;
	}
	
	@Column(name = "weight")
	public double getWeight() {
		return weight;
	}
	public void setWeight(double weight) {
		this.weight = weight;
	}

	@Transient
	public String getIdHlht() {
		return idHlht;
	}
	public void setIdHlht(String idHlht) {
		this.idHlht = idHlht;
	}
	
	@Transient
	public Patient getPatient() {
		return patient;
	}
	public void setPatient(Patient patient) {
		this.patient = patient;
	}

	@Transient
	public long getCardCount() {
		return cardCount;
	}
	public void setCardCount(long cardCount) {
		this.cardCount = cardCount;
	} 
	
}
