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
 * BASE_DESCRIPTION
 * 
 * @author zyus
 * @version 1.0.0 2017-12-14
 */
@Entity
@Table(name = "BASE_DESCRIPTION")
public class Description extends AuditableModel implements java.io.Serializable {
    /** 版本号 */
    private static final long serialVersionUID = 1733981999739893120L;

    /** fkId */
    private String fkId;

    /** fkType */
    private String fkType;

    /** caption */
    private String caption;

    /** body */
    private String body;

    /** sort */
    private Integer sort;

    /** A - 初始
            0 - 正常
            1 - 废弃 */
    private String status;

    /**
     * 获取fkId
     * 
     * @return fkId
     */
    @Column(name = "FK_ID", nullable = true, length = 32)
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
    @Column(name = "FK_TYPE", nullable = true, length = 20)
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
     * 获取caption
     * 
     * @return caption
     */
    @Column(name = "CAPTION", nullable = true, length = 100)
    public String getCaption() {
        return this.caption;
    }

    /**
     * 设置caption
     * 
     * @param caption
     */
    public void setCaption(String caption) {
        this.caption = caption;
    }

    /**
     * 获取body
     * 
     * @return body
     */
    @Column(name = "BODY", nullable = true, length = 500)
    public String getBody() {
        return this.body;
    }

    /**
     * 设置body
     * 
     * @param body
     */
    public void setBody(String body) {
        this.body = body;
    }

    /**
     * 获取sort
     * 
     * @return sort
     */
    @Column(name = "SORT", nullable = true, length = 10)
    public Integer getSort() {
        return this.sort;
    }

    /**
     * 设置sort
     * 
     * @param sort
     */
    public void setSort(Integer sort) {
        this.sort = sort;
    }

    /**
     * 获取A - 初始
            0 - 正常
            1 - 废弃
     * 
     * @return A - 初始
            0 - 正常
            1 - 废弃
     */
    @Column(name = "STATUS", nullable = true, length = 1)
    public String getStatus() {
        return this.status;
    }

    /**
     * 设置A - 初始
            0 - 正常
            1 - 废弃
     * 
     * @param status
     *          A - 初始
            0 - 正常
            1 - 废弃
     */
    public void setStatus(String status) {
        this.status = status;
    }
}