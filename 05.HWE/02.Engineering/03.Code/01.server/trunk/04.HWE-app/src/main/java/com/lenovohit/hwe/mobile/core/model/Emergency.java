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

import javax.persistence.Entity;
import javax.persistence.Table;

import com.lenovohit.hwe.base.model.AuditableModel;



/**
 * Emergency 急救
 * 
 * @author redstar
 * @version 1.0.0 2017-12-14
 */
@Entity
@Table(name = "APP_EMERGENCY")
public class Emergency extends AuditableModel implements java.io.Serializable {
	/** 版本号 */
	private static final long serialVersionUID = 5123120272341522921L;
	
	private String fakId;
	private String classificationId;
	private String fakName;
	private String sort;
	private String fakDetails;
	
	
	public String getFakId() {
		return fakId;
	}
	public void setFakId(String fakId) {
		this.fakId = fakId;
	}
	public String getClassificationId() {
		return classificationId;
	}
	public void setClassificationId(String classificationId) {
		this.classificationId = classificationId;
	}
	public String getFakName() {
		return fakName;
	}
	public void setFakName(String fakName) {
		this.fakName = fakName;
	}
	public String getSort() {
		return sort;
	}
	public void setSort(String sort) {
		this.sort = sort;
	}
	public String getFakDetails() {
		return fakDetails;
	}
	public void setFakDetails(String fakDetails) {
		this.fakDetails = fakDetails;
	}

}
