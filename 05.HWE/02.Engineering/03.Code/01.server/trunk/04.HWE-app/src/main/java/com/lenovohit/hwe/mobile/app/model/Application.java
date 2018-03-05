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

package com.lenovohit.hwe.mobile.app.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import com.lenovohit.hwe.base.model.AuditableModel;

/**
 * APP_APPLICATION
 * 
 * @author zyus
 * @version 1.0.0 2017-12-14
 */
@Entity
@Table(name = "APP_APPLICATION")
public class Application extends AuditableModel implements java.io.Serializable {
    /** 版本号 */
    private static final long serialVersionUID = 7474824813783342394L;

    /** 1 - 易民生
            2 - 医院专属APP */
    private String type;

    /** 当为某医院专属APP时，需要关联医院ID */
    private String orgId;
    
    /** app打包标识 ***/
    private String appKey;

    /** name */
    private String name;

    /** onlineAt */
    private Date onlineAt;

    /** offlineAt */
    private Date offlineAt;

    /** A - 初始
            0 - 正常
            1 - 冻结 */
    private String status;
    //联系我们
    private String contactUs;
  //关于我们
    private String aboutUs;
    
    @Column(name = "CONTACT_US", nullable = true)
    public String getContactUs() {
		return contactUs;
	}

	public void setContactUs(String contactUs) {
		this.contactUs = contactUs;
	}
	
	@Column(name = "ABOUT_US", nullable = true)
	public String getAboutUs() {
		return aboutUs;
	}

	public void setAboutUs(String aboutUs) {
		this.aboutUs = aboutUs;
	}
	

	/**
     * 获取1 - 易民生
            2 - 医院专属APP
     * 
     * @return 1 - 易民生
            2 - 医院专属APP
     */
    @Column(name = "TYPE", nullable = true, length = 1)
    public String getType() {
        return this.type;
    }

    /**
     * 设置1 - 易民生
            2 - 医院专属APP
     * 
     * @param type
     *          1 - 易民生
            2 - 医院专属APP
     */
    public void setType(String type) {
        this.type = type;
    }

    /**
     * 获取当为某医院专属APP时，需要关联医院ID
     * 
     * @return 当为某医院专属APP时
     */
    @Column(name = "ORG_ID", nullable = true, length = 32)
    public String getOrgId() {
        return this.orgId;
    }
    
	/**
     * 设置当为某医院专属APP时，需要关联医院ID
     * 
     * @param orgId
     *          当为某医院专属APP时
     */
    public void setOrgId(String orgId) {
        this.orgId = orgId;
    }

    @Column(name = "APP_KEY", nullable = true, length = 50)
    public String getAppKey() {
		return appKey;
	}

	public void setAppKey(String appKey) {
		this.appKey = appKey;
	}
	
    /**
     * 获取name
     * 
     * @return name
     */
    @Column(name = "NAME", nullable = true, length = 50)
    public String getName() {
        return this.name;
    }

    /**
     * 设置name
     * 
     * @param name
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * 获取onlineAt
     * 
     * @return onlineAt
     */
    @Column(name = "ONLINE_AT", nullable = true)
    public Date getOnlineAt() {
        return this.onlineAt;
    }

    /**
     * 设置onlineAt
     * 
     * @param onlineAt
     */
    public void setOnlineAt(Date onlineAt) {
        this.onlineAt = onlineAt;
    }

    /**
     * 获取offlineAt
     * 
     * @return offlineAt
     */
    @Column(name = "OFFLINE_AT", nullable = true)
    public Date getOfflineAt() {
        return this.offlineAt;
    }

    /**
     * 设置offlineAt
     * 
     * @param offlineAt
     */
    public void setOfflineAt(Date offlineAt) {
        this.offlineAt = offlineAt;
    }

    /**
     * 获取A - 初始
            0 - 正常
            1 - 冻结
     * 
     * @return A - 初始
            0 - 正常
            1 - 冻结
     */
    @Column(name = "STATUS", nullable = true, length = 1)
    public String getStatus() {
        return this.status;
    }

    /**
     * 设置A - 初始
            0 - 正常
            1 - 冻结
     * 
     * @param status
     *          A - 初始
            0 - 正常
            1 - 冻结
     */
    public void setStatus(String status) {
        this.status = status;
    }
}