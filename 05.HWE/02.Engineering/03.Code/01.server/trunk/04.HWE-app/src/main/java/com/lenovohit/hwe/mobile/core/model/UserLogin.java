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

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import com.lenovohit.hwe.base.model.AuditableModel;

/**
 * APP_USER_LOGIN
 * 
 * @author zyus
 * @version 1.0.0 2017-12-14
 */
@Entity
@Table(name = "APP_USER_LOGIN")
public class UserLogin extends AuditableModel implements java.io.Serializable {
    /** 版本号 */
    private static final long serialVersionUID = -4159708390838307840L;

    /** userId */
    private String userId;

    /** appId */
    private String appId;

    /** isReg */
    private String isReg;

    /** expiryAt */
    private Date expiryAt;

    /** ios
            android
            winphone
            web */
    private String logSystem;

    /** logVersion */
    private String logVersion;

    /** logUser */
    private String logUser;

    /** logGroups */
    private String logGroups;

    /** A - 初始
            0 - 正常
            1 - 冻结 */
    private String status;

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
    @Column(name = "APP_ID", nullable = false, length = 32)
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
     * 获取isReg
     * 
     * @return isReg
     */
    @Column(name = "IS_REG", nullable = true, length = 1)
    public String getIsReg() {
        return this.isReg;
    }

    /**
     * 设置isReg
     * 
     * @param isReg
     */
    public void setIsReg(String isReg) {
        this.isReg = isReg;
    }

    /**
     * 获取expiryAt
     * 
     * @return expiryAt
     */
    @Column(name = "EXPIRY_AT", nullable = true)
    public Date getExpiryAt() {
        return this.expiryAt;
    }

    /**
     * 设置expiryAt
     * 
     * @param expiryAt
     */
    public void setExpiryAt(Date expiryAt) {
        this.expiryAt = expiryAt;
    }

    /**
     * 获取ios
            android
            winphone
            web
     * 
     * @return ios
            android
            winphone
            web
     */
    @Column(name = "LOG_SYSTEM", nullable = true, length = 50)
    public String getLogSystem() {
        return this.logSystem;
    }

    /**
     * 设置ios
            android
            winphone
            web
     * 
     * @param logSystem
     *          ios
            android
            winphone
            web
     */
    public void setLogSystem(String logSystem) {
        this.logSystem = logSystem;
    }

    /**
     * 获取logVersion
     * 
     * @return logVersion
     */
    @Column(name = "LOG_VERSION", nullable = true, length = 20)
    public String getLogVersion() {
        return this.logVersion;
    }

    /**
     * 设置logVersion
     * 
     * @param logVersion
     */
    public void setLogVersion(String logVersion) {
        this.logVersion = logVersion;
    }

    /**
     * 获取logUser
     * 
     * @return logUser
     */
    @Column(name = "LOG_USER", nullable = true, length = 50)
    public String getLogUser() {
        return this.logUser;
    }

    /**
     * 设置logUser
     * 
     * @param logUser
     */
    public void setLogUser(String logUser) {
        this.logUser = logUser;
    }

    /**
     * 获取logGroups
     * 
     * @return logGroups
     */
    @Column(name = "LOG_GROUPS", nullable = true, length = 100)
    public String getLogGroups() {
        return this.logGroups;
    }

    /**
     * 设置logGroups
     * 
     * @param logGroups
     */
    public void setLogGroups(String logGroups) {
        this.logGroups = logGroups;
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