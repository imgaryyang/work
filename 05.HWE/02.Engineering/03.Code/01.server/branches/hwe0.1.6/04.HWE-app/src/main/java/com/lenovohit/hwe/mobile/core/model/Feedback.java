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
 * APP_FEEDBACK
 * 
 * @author zyus
 * @version 1.0.0 2017-12-14
 */
@Entity
@Table(name = "APP_FEEDBACK")
public class Feedback extends AuditableModel implements java.io.Serializable {
    /** 版本号 */
    private static final long serialVersionUID = -4595362512841762253L;

    /** userId */
    private String userId;

    /** appId */
    private String appId;

    /** 当为某医院专属APP时，需要关联医院ID */
    private String hospId;

    /** feedback */
    private String feedback;

    /** feededAt */
    private Date feededAt;

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
     * 获取当为某医院专属APP时，需要关联医院ID
     * 
     * @return 当为某医院专属APP时
     */
    @Column(name = "HOSP_ID", nullable = true, length = 32)
    public String getHospId() {
        return this.hospId;
    }

    /**
     * 设置当为某医院专属APP时，需要关联医院ID
     * 
     * @param hospId
     *          当为某医院专属APP时
     */
    public void setHospId(String hospId) {
        this.hospId = hospId;
    }

    /**
     * 获取feedback
     * 
     * @return feedback
     */
    @Column(name = "FEEDBACK", nullable = true, length = 500)
    public String getFeedback() {
        return this.feedback;
    }

    /**
     * 设置feedback
     * 
     * @param feedback
     */
    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }

    /**
     * 获取feededAt
     * 
     * @return feededAt
     */
    @Column(name = "FEEDED_AT", nullable = true)
    public Date getFeededAt() {
        return this.feededAt;
    }

    /**
     * 设置feededAt
     * 
     * @param feededAt
     */
    public void setFeededAt(Date feededAt) {
        this.feededAt = feededAt;
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