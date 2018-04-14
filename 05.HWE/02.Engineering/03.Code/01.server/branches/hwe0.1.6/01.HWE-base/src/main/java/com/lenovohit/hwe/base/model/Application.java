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

package com.lenovohit.hwe.base.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * BASE_APPLICATION
 * 
 * @author zyus
 * @version 1.0.0 2018-03-22
 */
@Entity
@Table(name = "BASE_APPLICATION")
public class Application extends AuditableModel implements java.io.Serializable {
    /** 版本号 */
    private static final long serialVersionUID = 577048264262848333L;

    /** name */
    private String name;

	/**
	 * SSM - 自助机 BOX - 盒子 APP - 手机APP W&A - 微信公众号&支付宝服务窗
	 */
	private String type;

    /** code */
    private String code;

    /** version */
    private String version;

    /** onlineAt */
    private Date onlineAt;

    /** offlineAt */
    private Date offlineAt;

    /** contacts */
    private String contacts;

    /** mobile */
    private String mobile;

    /** orgId */
    private String orgId;

    /** orgName */
    private String orgName;

    /** memo */
    private String memo;

	/**
	 * A - 初始 0 - 已上线 1 - 开发中 2 - 测试 3 - 实施 9 - 已关闭
	 */
	private String status;

    /**
     * 获取name
     * 
     * @return name
     */
    @Column(name = "NAME", nullable = true, length = 255)
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
     * 获取 TYPE 
     * 
     * @return TYPE 
            
     */
    @Column(name = "TYPE", nullable = true, length = 3)
    public String getType() {
        return this.type;
    }

    /**
     */
    public void setType(String type) {
        this.type = type;
    }

    /**
     * 获取code
     * 
     * @return code
     */
    @Column(name = "CODE", nullable = true, length = 20)
    public String getCode() {
        return this.code;
    }

    /**
     * 设置code
     * 
     * @param code
     */
    public void setCode(String code) {
        this.code = code;
    }

    /**
     * 获取version
     * 
     * @return version
     */
    @Column(name = "VERSION", nullable = true, length = 20)
    public String getVersion() {
        return this.version;
    }

    /**
     * 设置version
     * 
     * @param version
     */
    public void setVersion(String version) {
        this.version = version;
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
     * 获取contacts
     * 
     * @return contacts
     */
    @Column(name = "CONTACTS", nullable = true, length = 70)
    public String getContacts() {
        return this.contacts;
    }

    /**
     * 设置contacts
     * 
     * @param contacts
     */
    public void setContacts(String contacts) {
        this.contacts = contacts;
    }

    /**
     * 获取mobile
     * 
     * @return mobile
     */
    @Column(name = "MOBILE", nullable = true, length = 20)
    public String getMobile() {
        return this.mobile;
    }

    /**
     * 设置mobile
     * 
     * @param mobile
     */
    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    /**
     * 获取orgId
     * 
     * @return orgId
     */
    @Column(name = "ORG_ID", nullable = true, length = 32)
    public String getOrgId() {
        return this.orgId;
    }

    /**
     * 设置orgId
     * 
     * @param orgId
     */
    public void setOrgId(String orgId) {
        this.orgId = orgId;
    }

    /**
     * 获取orgName
     * 
     * @return orgName
     */
    @Column(name = "ORG_NAME", nullable = true, length = 70)
    public String getOrgName() {
        return this.orgName;
    }

    /**
     * 设置orgName
     * 
     * @param orgName
     */
    public void setOrgName(String orgName) {
        this.orgName = orgName;
    }

    /**
     * 获取memo
     * 
     * @return memo
     */
    @Column(name = "MEMO", nullable = true, length = 255)
    public String getMemo() {
        return this.memo;
    }

    /**
     * 设置memo
     * 
     * @param memo
     */
    public void setMemo(String memo) {
        this.memo = memo;
    }

    /**
     * 获取 status
     */
    @Column(name = "STATUS", nullable = true, length = 1)
    public String getStatus() {
        return this.status;
    }

    /**
     * @param status
     */
    public void setStatus(String status) {
        this.status = status;
    }
}