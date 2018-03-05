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

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * BASE_CONTACT_WAYS
 * 
 * @author zyus
 * @version 1.0.0 2017-12-14
 */
@Entity
@Table(name = "BASE_CONTACT_WAYS")
public class ContactWays extends AuditableModel implements java.io.Serializable {
    /** 版本号 */
    private static final long serialVersionUID = 2285882680881948001L;

    /** fkId */
    private String fkId;

    /** fkType */
    private String fkType;

    /** 1 - 手机号
            2 - 电话
            3 - 传真
            4 - 400电话
            5 - 微信
            6 - 微博
            7 - QQ
            8 - EMAIL */
    private String type;

    /** content */
    private String content;

    /** memo */
    private String memo;

    /** A - 初始
            0 - 正常
            1 - 已作废 */
    private String status;

    /**
     * 获取fkId
     * 
     * @return fkId
     */
    @Column(name = "FK_ID", nullable = false, length = 32)
    public String getFkId() {
        return this.fkId;
    }

    /**
     * 设置fkId
     * 
     * @param fkId
     */
    public void setFkId(String fkId) {
        this.fkId = fkId;
    }

    /**
     * 获取fkType
     * 
     * @return fkType
     */
    @Column(name = "FK_TYPE", nullable = true, length = 10)
    public String getFkType() {
        return this.fkType;
    }

    /**
     * 设置fkType
     * 
     * @param fkType
     */
    public void setFkType(String fkType) {
        this.fkType = fkType;
    }

    /**
     */
    @Column(name = "TYPE", nullable = false, length = 1)
    public String getType() {
        return this.type;
    }

    /**
     * 设置
     */
    public void setType(String type) {
        this.type = type;
    }

    /**
     * 获取content
     * 
     * @return content
     */
    @Column(name = "CONTENT", nullable = false, length = 50)
    public String getContent() {
        return this.content;
    }

    /**
     * 设置content
     * 
     * @param content
     */
    public void setContent(String content) {
        this.content = content;
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
     * 获取A - 初始
            0 - 正常
            1 - 已作废
     * 
     * @return A - 初始
            0 - 正常
            1 - 已作废
     */
    @Column(name = "STATUS", nullable = true, length = 1)
    public String getStatus() {
        return this.status;
    }

    /**
     * 设置A - 初始
            0 - 正常
            1 - 已作废
     * 
     * @param status
     *          A - 初始
            0 - 正常
            1 - 已作废
     */
    public void setStatus(String status) {
        this.status = status;
    }
}