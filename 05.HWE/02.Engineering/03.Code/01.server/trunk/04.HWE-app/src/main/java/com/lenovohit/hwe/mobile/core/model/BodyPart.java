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
 * APP_BODY_PART
 * 
 * @author zyus
 * @version 1.0.0 2017-12-14
 */
@Entity
@Table(name = "APP_BODY_PART")
public class BodyPart extends AuditableModel implements java.io.Serializable {
    /** 版本号 */
    private static final long serialVersionUID = 5123120272341522921L;
    
    private String partId;
    private String partName;
    private String sort;
    
    
	public String getPartId() {
		return partId;
	}
	public void setPartId(String partId) {
		this.partId = partId;
	}
	public String getPartName() {
		return partName;
	}
	public void setPartName(String partName) {
		this.partName = partName;
	}
	public String getSort() {
		return sort;
	}
	public void setSort(String sort) {
		this.sort = sort;
	}
 
}