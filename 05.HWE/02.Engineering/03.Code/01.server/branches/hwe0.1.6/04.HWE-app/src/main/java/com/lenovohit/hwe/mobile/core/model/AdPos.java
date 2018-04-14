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
 * APP_AD_POS
 * 
 * @author zyus
 * @version 1.0.0 2017-12-14
 */
@Entity
@Table(name = "APP_AD_POS")
public class AdPos extends AuditableModel implements java.io.Serializable {
    /** 版本号 */
    private static final long serialVersionUID = 8135617267031126987L;

    /** appId */
    private String appId;

    /** memo */
    private String memo;

    /** A - 初始
            0 - 正常
            1 - 冻结 */
    private String status;

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
     * 获取memo
     * 
     * @return memo
     */
    @Column(name = "MEMO", nullable = true, length = 100)
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