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

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import com.lenovohit.hwe.base.model.AuditableModel;

/**
 * SSM_MATERIAL_OUT
 * 
 * @author zyus
 * @version 1.0.0 2017-12-14
 */
@Entity
@Table(name = "SSM_MATERIAL_OUT")
public class MaterialOut extends AuditableModel implements java.io.Serializable {
    /** 版本号 */
    private static final long serialVersionUID = -7364419436648473569L;

    /** outPutAccount */
    private Integer outPutAccount;

    /** outPutTime */
    private Date outPutTime;

    /** machineId */
    private String machineId;

    /** materialId */
    private String materialId;

    /** A  - 初始
            0 - 正常
            1 - 已屏蔽 */
    private String status;

    /**
     * 获取outPutAccount
     * 
     * @return outPutAccount
     */
    @Column(name = "OUT_PUT_ACCOUNT", nullable = true, length = 10)
    public Integer getOutPutAccount() {
        return this.outPutAccount;
    }

    /**
     * 设置outPutAccount
     * 
     * @param outPutAccount
     */
    public void setOutPutAccount(Integer outPutAccount) {
        this.outPutAccount = outPutAccount;
    }

    /**
     * 获取outPutTime
     * 
     * @return outPutTime
     */
    @Column(name = "OUT_PUT_TIME", nullable = true)
    public Date getOutPutTime() {
        return this.outPutTime;
    }

    /**
     * 设置outPutTime
     * 
     * @param outPutTime
     */
    public void setOutPutTime(Date outPutTime) {
        this.outPutTime = outPutTime;
    }

    /**
     * 获取machineId
     * 
     * @return machineId
     */
    @Column(name = "MACHINE_ID", nullable = true, length = 32)
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
     * 获取materialId
     * 
     * @return materialId
     */
    @Column(name = "MATERIAL_ID", nullable = true, length = 32)
    public String getMaterialId() {
        return this.materialId;
    }

    /**
     * 设置materialId
     * 
     * @param materialId
     */
    public void setMaterialId(String materialId) {
        this.materialId = materialId;
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