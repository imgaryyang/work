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

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import com.lenovohit.hwe.base.model.AuditableModel;

/**
 * APP_USER_INSTALL
 * 
 * @author zyus
 * @version 1.0.0 2017-12-14
 */
@Entity
@Table(name = "APP_USER_INSTALL")
public class UserInstall extends AuditableModel implements java.io.Serializable {
    /** 版本号 */
    private static final long serialVersionUID = 5118578023101220146L;

    /** userId */
    private String userId;

    /** appId */
    private String appId;

    /** ios */
    private String ios;

    /** android */
    private String android;

    /** version */
    private String version;

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
     * 获取appId
     * 
     * @return appId
     */
    @Column(name = "APP_ID", nullable = true, length = 32)
    public String getAppId() {
        return this.appId;
    }

    /**
     * 设置appId
     * 
     * @param appId
     */
    public void setAppId(String appId) {
        this.appId = appId;
    }

    /**
     * 获取ios
     * 
     * @return ios
     */
    @Column(name = "IOS", nullable = true, length = 1)
    public String getIos() {
        return this.ios;
    }

    /**
     * 设置ios
     * 
     * @param ios
     */
    public void setIos(String ios) {
        this.ios = ios;
    }

    /**
     * 获取android
     * 
     * @return android
     */
    @Column(name = "ANDROID", nullable = true, length = 1)
    public String getAndroid() {
        return this.android;
    }

    /**
     * 设置android
     * 
     * @param android
     */
    public void setAndroid(String android) {
        this.android = android;
    }

    /**
     * 获取version
     * 
     * @return version
     */
    @Column(name = "VERSION", nullable = true, length = 10)
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
}