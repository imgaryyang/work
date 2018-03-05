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

import com.lenovohit.hwe.base.model.AuditableModel;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * SSM_MACHINE_PAY_TYPE
 * 
 * @author zyus
 * @version 1.0.0 2018-01-11
 */
@Entity
@Table(name = "SSM_MACHINE_PAY_TYPE")
public class MachinePayType extends AuditableModel implements java.io.Serializable {
    /** 版本号 */
    private static final long serialVersionUID = 8794839485891971414L;

    /** ptId */
    private String ptId;

    /** machineId */
    private String machineId;

    /** bizs */
    private String bizs;

    /** A  - 初始
            0 - 正常
            1 - 已屏蔽 */
    private String status;

    /**
     * 获取ptId
     * 
     * @return ptId
     */
    @Id
    @Column(name = "PT_ID", unique = true, nullable = false, length = 32)
    public String getPtId() {
        return this.ptId;
    }

    /**
     * 设置ptId
     * 
     * @param ptId
     */
    public void setPtId(String ptId) {
        this.ptId = ptId;
    }

    /**
     * 获取machineId
     * 
     * @return machineId
     */
    @Id
    @Column(name = "MACHINE_ID", unique = true, nullable = false, length = 32)
    public String getMachineId() {
        return this.machineId;
    }

    /**
     * 设置machineId
     * 
     * @param machineId
     */
    public void setMachineId(String machineId) {
        this.machineId = machineId;
    }

    /**
     * 获取bizs
     * 
     * @return bizs
     */
    @Column(name = "BIZS", nullable = true, length = 200)
    public String getBizs() {
        return this.bizs;
    }

    /**
     * 设置bizs
     * 
     * @param bizs
     */
    public void setBizs(String bizs) {
        this.bizs = bizs;
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