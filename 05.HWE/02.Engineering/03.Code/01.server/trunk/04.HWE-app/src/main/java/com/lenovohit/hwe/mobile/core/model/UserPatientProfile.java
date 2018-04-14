package com.lenovohit.hwe.mobile.core.model;



import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.lenovohit.hwe.base.model.AuditableModel;
import com.lenovohit.hwe.treat.model.Profile;

@Entity
@Table(name = "APP_USER_PATIENT_PROFILE")
public class UserPatientProfile extends AuditableModel implements java.io.Serializable{
	private static final long serialVersionUID = -465670348514872096L;
	
	public static final String IDENFITY_OK = "1"; //认证
	public static final String IDENFITY_NO = "0"; //未认证
	
	public static final String DEFAULT_OK = "1"; //默认档案
	public static final String DEFAULT_NO = "0"; //非默认
	
	private UserPatient userPatient;
	
	private Profile profile;
   
	private String status;
	
	private String hospitalId;
	
	private String identify;// 是否认证
	
	
	
	@JoinColumn(name = "UP_ID")
	@ManyToOne
	public UserPatient getUserPatient() {
		return userPatient;
	}
	public void setUserPatient(UserPatient userPatient) {
		this.userPatient = userPatient;
	}
	
	@JoinColumn(name = "PRO_ID")
	@ManyToOne
	public Profile getProfile() {
		return profile;
	}
	public void setProfile(Profile profile) {
		this.profile = profile;
	}

	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	
	@Column(name = "HOS_ID", nullable = true, length = 32)
	public String getHospitalId() {
		return hospitalId;
	}
	public void setHospitalId(String hospitalId) {
		this.hospitalId = hospitalId;
	}
	
	@Column(name = "IDENTIFY", nullable = true, length = 1)
	public String getIdentify() {
		return identify;
	}
	public void setIdentify(String identify) {
		this.identify = identify;
	}
	
}
