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
 * SSM_TROUBLE
 * 
 * @author zyus
 * @version 1.0.0 2017-12-14
 */
@Entity
@Table(name = "SSM_TROUBLE")
public class Trouble extends AuditableModel implements java.io.Serializable {
    /** 版本号 */
    private static final long serialVersionUID = 1664391349948936803L;

    /** name */
    private String name;

    /** parentId */
    private String parentId;

    /** sort */
    private Integer sort;

    /** A  - 初始
            0 - 正常
            1 - 已屏蔽 */
    private String status;

    /**
     * 获取name
     * 
     * @return name
     */
    @Column(name = "NAME", nullable = true, length = 30)
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