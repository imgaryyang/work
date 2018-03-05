package com.lenovohit.elh.base.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.lenovohit.core.model.BaseIdModel;

/**
 * 就诊人
 * @author Administrator
 *
 */
@Entity
@Table(name="ELH_PATIENT")
public class Patient extends BaseIdModel {
	private static final long serialVersionUID = -6270132686252825491L;
	private String idHlht;//院方数据ID 暂态
	private String personId;	//人员
	private String userType;    //用户类型 
	private String name    ;    //姓名  
	private String photo   ;    //头像	  
	private String idno    ;    //身份证号码	 
	private String mobile  ;    //手机	
	private String email   ;    //邮箱	
	private String gender  ;    //性别	
	private String address ;    //地址	
	private String status  ;    //状态	
	private String birthday;    //出生日期	
	private double height  ;    //身高	
	private double weight  ;    //体重
	
	@Transient
	public String getIdHlht() {
		return idHlht;
	}
	public void setIdHlht(String idHlht) {
		this.idHlht = idHlht;
	}
	@Column(name = "PERSON_ID")
	public String getPersonId() {
		return personId;
	}
	public void setPersonId(String personId) {
		this.personId = personId;
	}
	@Column(name = "USER_TYPE")
	public String getUserType() {
		return userType;
	}
	public void setUserType(String userType) {
		this.userType = userType;
	}
	
	@Column(name = "NAME")
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	
	@Column(name = "PHOTO")
	public String getPhoto() {
		return photo;
	}
	public void setPhoto(String photo) {
		this.photo = photo;
	}
	
	@Column(name = "IDNO")
	public String getIdno() {
		return idno;
	}
	public void setIdno(String idno) {
		this.idno = idno;
	}
	
	@Column(name = "MOBILE")
	public String getMobile() {
		return mobile;
	}
	public void setMobile(String mobile) {
		this.mobile = mobile;
	}
	
	@Column(name = "EMAIL")
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	
	@Column(name = "GENDER")
	public String getGender() {
		return gender;
	}
	public void setGender(String gender) {
		this.gender = gender;
	}
	
	@Column(name = "ADDRESS")
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	
	@Column(name = "STATUS")
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	
	@Column(name = "BIRTHDAY")
	public String getBirthday() {
		return birthday;
	}
	public void setBirthday(String birthday) {
		this.birthday = birthday;
	}
	
	@Column(name = "HEIGHT")
	public double getHeight() {
		return height;
	}
	public void setHeight(double height) {
		this.height = height;
	}
	
	@Column(name = "WEIGHT")
	public double getWeight() {
		return weight;
	}
	public void setWeight(double weight) {
		this.weight = weight;
	}

}
