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
 * BASE_DIC_ITEM
 * 
 * @author zyus
 * @version 1.0.0 2017-12-14
 */
@Entity
@Table(name = "BASE_DIC_ITEM")
public class DicItem extends AuditableModel implements java.io.Serializable {
    /** 版本号 */
    private static final long serialVersionUID = -1656852862107468964L;

    /** parentId */
    private String parentId;

    /** dicId */
    private String dicId;

    /** code */
    private String code;

    /** text */
    private String text;

    /** A - 初始
            0 - 正常
            1 - 废弃 */
    private String status;

    /**
     * 获取patientId
     * 
     * @return patientId
     */
    @Column(name = "PARENT_ID", nullable = true, length = 32)
    public String getParentId() {
        return this.parentId;
    }

    /**
     * 设置patientId
     * 
     * @param parentId
     */
    public void setParentId(String parentId) {
        this.parentId = parentId;
    }

    /**
     * 获取dicId
     * 
     * @return dicId
     */
    @Column(name = "DIC_ID", nullable = true, length = 32)
    public String getDicId() {
        return this.dicId;
    }

    /**
     * 设置dicId
     * 
     * @param dicId
     */
    public void setDicId(String dicId) {
        this.dicId = dicId;
    }

    /**
     * 获取code
     * 
     * @return code
     */
    @Column(name = "CODE", nullable = true, length = 32)
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
     * 获取text
     * 
     * @return text
     */
    @Column(name = "TEXT", nullable = true, length = 200)
    public String getText() {
        return this.text;
    }

    /**
     * 设置text
     * 
     * @param text
     */
    public void setText(String text) {
        this.text = text;
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