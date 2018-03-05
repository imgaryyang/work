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
 * SSM_MATERIAL
 * 
 * @author zyus
 * @version 1.0.0 2017-12-14
 */
@Entity
@Table(name = "SSM_MATERIAL")
public class Material extends AuditableModel implements java.io.Serializable {
    /** 版本号 */
    private static final long serialVersionUID = -6636034788852417231L;

    /** name */
    private String name;

    /** unit */
    private String unit;

    /** supplier */
    private String supplier;

    /** account */
    private Integer account;

    /** remark */
    private String remark;

    /** A  - 初始
            0 - 正常
            1 - 已屏蔽 */
    private String status;

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
     * 获取unit
     * 
     * @return unit
     */
    @Column(name = "UNIT", nullable = true, length = 20)
    public String getUnit() {
        return this.unit;
    }

    /**
     * 设置unit
     * 
     * @param unit
     */
    public void setUnit(String unit) {
        this.unit = unit;
    }

    /**
     * 获取supplier
     * 
     * @return supplier
     */
    @Column(name = "SUPPLIER", nullable = true, length = 50)
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
     * 获取account
     * 
     * @return account
     */
    @Column(name = "ACCOUNT", nullable = true, length = 10)
    public Integer getAccount() {
        return this.account;
    }

    /**
     * 设置account
     * 
     * @param account
     */
    public void setAccount(Integer account) {
        this.account = account;
    }

    /**
     * 获取remark
     * 
     * @return remark
     */
    @Column(name = "REMARK", nullable = true, length = 200)
    public String getRemark() {
        return this.remark;
    }

    /**
     * 设置remark
     * 
     * @param remark
     */
    public void setRemark(String remark) {
        this.remark = remark;
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