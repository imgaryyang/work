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
 * APP_DL_CHANNEL
 * 
 * @author zyus
 * @version 1.0.0 2017-12-14
 */
@Entity
@Table(name = "APP_DL_CHANNEL")
public class DlChannel extends AuditableModel implements java.io.Serializable {
    /** 版本号 */
    private static final long serialVersionUID = -3261358363766342614L;

    /** appId */
    private String appId;

    /** channel */
    private String channel;

    /** downloaded */
    private Integer downloaded;

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
     * 获取channel
     * 
     * @return channel
     */
    @Column(name = "CHANNEL", nullable = true, length = 20)
    public String getChannel() {
        return this.channel;
    }

    /**
     * 设置channel
     * 
     * @param channel
     */
    public void setChannel(String channel) {
        this.channel = channel;
    }

    /**
     * 获取downloaded
     * 
     * @return downloaded
     */
    @Column(name = "DOWNLOADED", nullable = true, length = 10)
    public Integer getDownloaded() {
        return this.downloaded;
    }

    /**
     * 设置downloaded
     * 
     * @param downloaded
     */
    public void setDownloaded(Integer downloaded) {
        this.downloaded = downloaded;
    }
}