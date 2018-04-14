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

package com.lenovohit.hwe.treat.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import com.lenovohit.hwe.base.model.AuditableModel;

/**
 * TREAT_RECORD_LOG
 * 
 * @author zyus
 * @version 1.0.0 2017-12-16
 */
@Entity
@Table(name = "TREAT_RECORD_LOG")
public class RecordLog extends AuditableModel implements java.io.Serializable {
    /** 版本号 */
    private static final long serialVersionUID = 2951187885828419181L;

    /** name */
    private String name;

    /** bizId */
    private String bizId;

    /** biz */
    private String biz;

    /** bizName */
    private String bizName;

    /** notification */
    private String notification;

    /** treatment */
    private String treatment;

    /** updateTime */
    private Date updateTime;

    /** createTime */
    private Date createTime;

    /** needPay */
    private String needPay;

    /** payed */
    private String payed;

    /** description */
    private String description;

    /** operate */
    private String operate;

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
     * 获取bizId
     * 
     * @return bizId
     */
    @Column(name = "BIZ_ID", nullable = true, length = 32)
    public String getBizId() {
        return this.bizId;
    }

    /**
     * 设置bizId
     * 
     * @param bizId
     */
    public void setBizId(String bizId) {
        this.bizId = bizId;
    }

    /**
     * 获取biz
     * 
     * @return biz
     */
    @Column(name = "BIZ", nullable = true, length = 50)
    public String getBiz() {
        return this.biz;
    }

    /**
     * 设置biz
     * 
     * @param biz
     */
    public void setBiz(String biz) {
        this.biz = biz;
    }

    /**
     * 获取bizName
     * 
     * @return bizName
     */
    @Column(name = "BIZ_NAME", nullable = true, length = 50)
    public String getBizName() {
        return this.bizName;
    }

    /**
     * 设置bizName
     * 
     * @param bizName
     */
    public void setBizName(String bizName) {
        this.bizName = bizName;
    }

    /**
     * 获取notification
     * 
     * @return notification
     */
    @Column(name = "NOTIFICATION", nullable = true, length = 200)
    public String getNotification() {
        return this.notification;
    }

    /**
     * 设置notification
     * 
     * @param notification
     */
    public void setNotification(String notification) {
        this.notification = notification;
    }

    /**
     * 获取treatment
     * 
     * @return treatment
     */
    @Column(name = "TREATMENT", nullable = true, length = 32)
    public String getTreatment() {
        return this.treatment;
    }

    /**
     * 设置treatment
     * 
     * @param treatment
     */
    public void setTreatment(String treatment) {
        this.treatment = treatment;
    }

    /**
     * 获取updateTime
     * 
     * @return updateTime
     */
    @Column(name = "UPDATE_TIME", nullable = false)
    public Date getUpdateTime() {
        return this.updateTime;
    }

    /**
     * 设置updateTime
     * 
     * @param updateTime
     */
    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
    }

    /**
     * 获取createTime
     * 
     * @return createTime
     */
    @Column(name = "CREATE_TIME", nullable = false)
    public Date getCreateTime() {
        return this.createTime;
    }

    /**
     * 设置createTime
     * 
     * @param createTime
     */
    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    /**
     * 获取needPay
     * 
     * @return needPay
     */
    @Column(name = "NEED_PAY", nullable = true, length = 1)
    public String getNeedPay() {
        return this.needPay;
    }

    /**
     * 设置needPay
     * 
     * @param needPay
     */
    public void setNeedPay(String needPay) {
        this.needPay = needPay;
    }

    /**
     * 获取payed
     * 
     * @return payed
     */
    @Column(name = "PAYED", nullable = true, length = 1)
    public String getPayed() {
        return this.payed;
    }

    /**
     * 设置payed
     * 
     * @param payed
     */
    public void setPayed(String payed) {
        this.payed = payed;
    }

    /**
     * 获取description
     * 
     * @return description
     */
    @Column(name = "DESCRIPTION", nullable = true, length = 2000)
    public String getDescription() {
        return this.description;
    }

    /**
     * 设置description
     * 
     * @param description
     */
    public void setDescription(String description) {
        this.description = description;
    }

    /**
     * 获取operate
     * 
     * @return operate
     */
    @Column(name = "OPERATE", nullable = true, length = 200)
    public String getOperate() {
        return this.operate;
    }

    /**
     * 设置operate
     * 
     * @param operate
     */
    public void setOperate(String operate) {
        this.operate = operate;
    }
}