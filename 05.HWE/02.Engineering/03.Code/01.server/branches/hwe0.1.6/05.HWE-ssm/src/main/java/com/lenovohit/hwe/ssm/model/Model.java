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

package com.lenovohit.hwe.ssm.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import com.lenovohit.hwe.base.model.AuditableModel;

/**
 * SSM_MODEL
 * 
 * @author zyus
 * @version 1.0.0 2017-12-14
 */
@Entity
@Table(name = "SSM_MODEL")
public class Model extends AuditableModel implements java.io.Serializable {
    /** 版本号 */
    private static final long serialVersionUID = 1093198642201757452L;

    /** code */
    private String code;

    /** name */
    private String name;

    /** sort */
    private Integer sort;

    /** parentId */
    private String parentId;

    /** supplier */
    private String supplier;

    /** A  - 初始
            0 - 正常
            1 - 已屏蔽 */
    private String status;

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
     * 获取name
     * 
     * @return name
     */
    @Column(name = "NAME", nullable = true, length = 20)
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
     * 获取parentId
     * 
     * @return parentId
     */
    @Column(name = "PARENT_ID", nullable = true, length = 32)
    public String getParentId() {
        return this.parentId;
    }

    /**
     * 设置parentId
     * 
     * @param parentId
     */
    public void setParentId(String parentId) {
        this.parentId = parentId;
    }

    /**
     * 获取supplier
     * 
     * @return supplier
     */
    @Column(name = "SUPPLIER", nullable = true, length = 100)
    public String getSupplier() {
        return this.supplier;
    }

    /**
     * 设置supplier
     * 
     * @param supplier
     */
    public void setSupplier(String supplier) {
        this.supplier = supplier;
    }

    /**
     * 获取A  - 初始
            0 - 正常
            1 - 已屏蔽
     * 
     * @return A  - 初始
            0 - 正常
            1 - 已屏蔽
     */
    @Column(name = "STATUS", nullable = true, length = 1)
    public String getStatus() {
        return this.status;
    }

    /**
     * 设置A  - 初始
            0 - 正常
            1 - 已屏蔽
     * 
     * @param status
     *          A  - 初始
            0 - 正常
            1 - 已屏蔽
     */
    public void setStatus(String status) {
        this.status = status;
    }
}