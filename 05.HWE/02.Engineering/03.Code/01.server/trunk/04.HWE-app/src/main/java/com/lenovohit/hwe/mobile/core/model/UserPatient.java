/*
 * Welcome to use the TableGo Tools.
 * 
 * http://vipbooks.iteye.com
 * http://blog.csdn.net/vipbooks
 * http://www.cnblogs.com/vipbooks
 * 
 * Author:bianj
 * Email:edinsker@163.com
 * Version:5.8.0
 */

package com.lenovohit.hwe.mobile.core.model;

import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.lenovohit.hwe.base.model.AuditableModel;
import com.lenovohit.hwe.treat.model.Profile;

/**
 * TREAT_USER_PATIENT
 * 
 * @author zyus
 * @version 1.0.0 2017-12-14
 */
@Entity
@Table(name = "APP_USER_PATIENT")
public class UserPatient extends AuditableModel implements java.io.Serializable {
    /** 版本号 */
    private static final long serialVersionUID = -3330618678101308255L;
	public static final String REL_ME = "0"; // 本人
	public static final String REL_PARENT = "1"; // 父母
	public static final String REL_SPOUSE = "2"; // 夫妻
	public static final String REL_CHILDREN = "3"; // 子女
	public static final String REL_OTHER = "4"; // 其他

    /** patientId */
    private String patientId;

    /** userId */
    private String userId;

    /** relation */
    private String relation;

    /** alias */
    private String alias;

    /** photo */
    private String photo;

    /** status */
    private String status;
    
    /** patient name*/
    private String name;
    
    /** patient gender*/
    private String gender;
    
    private String idNo;
    
    private String mobile;
    
    private String address;
    
    private List<Profile> profiles;

    /**
     * 获取patientId
     * 
     * @return patientId
     */
    @Column(name = "PATIENT_ID", nullable = true, length = 32)
    public String getPatientId() {
        return this.patientId;
    }

    /**
     * 设置patientId
     * 
     * @param patientId
     */
    public void setPatientId(String patientId) {
        this.patientId = patientId;
    }

    /**
     * 获取userId
     * 
     * @return userId
     */
    @Column(name = "USER_ID", nullable = true, length = 32)
    public String getUserId() {
        return this.userId;
    }

    /**
     * 设置userId
     * 
     * @param userId
     */
    public void setUserId(String userId) {
        this.userId = userId;
    }

    /**
     * 获取relation
     * 
     * @return relation
     */
    @Column(name = "RELATION", nullable = true, length = 2)
    public String getRelation() {
        return this.relation;
    }

    /**
     * 设置relation
     * 
     * @param relation
     */
    public void setRelation(String relation) {
        this.relation = relation;
    }

    /**
     * 获取alias
     * 
     * @return alias
     */
    @Column(name = "ALIAS", nullable = true, length = 50)
    public String getAlias() {
        return this.alias;
    }

    /**
     * 设置alias
     * 
     * @param alias
     */
    public void setAlias(String alias) {
        this.alias = alias;
    }

    /**
     * 获取photo
     * 
     * @return photo
     */
    @Column(name = "PHOTO", nullable = true, length = 200)
    public String getPhoto() {
        return this.photo;
    }

    /**
     * 设置photo
     * 
     * @param photo
     */
    public void setPhoto(String photo) {
        this.photo = photo;
    }

    /**
     * 获取status
     * 
     * @return status
     */
    @Column(name = "STATUS", nullable = true, length = 1)
    public String getStatus() {
        return this.status;
    }

    /**
     * 设置status
     * 
     * @param status
     */
    public void setStatus(String status) {
        this.status = status;
    }

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Column(name = "GENDER", nullable = true, length = 1)
	public String getGender() {
		return gender;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}

	public String getIdNo() {
		return idNo;
	}

	public void setIdNo(String idNo) {
		this.idNo = idNo;
	}

	public String getMobile() {
		return mobile;
	}

	public void setMobile(String mobile) {
		this.mobile = mobile;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	@Transient
	public List<Profile> getProfiles() {
		return profiles;
	}

	public void setProfiles(List<Profile> profiles) {
		this.profiles = profiles;
	}
    
    
}