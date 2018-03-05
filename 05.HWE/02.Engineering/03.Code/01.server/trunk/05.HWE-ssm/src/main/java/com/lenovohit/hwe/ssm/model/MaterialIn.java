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
 * SSM_MATERIAL_IN
 * 
 * @author zyus
 * @version 1.0.0 2017-12-14
 */
@Entity
@Table(name = "SSM_MATERIAL_IN")
public class MaterialIn extends AuditableModel implements java.io.Serializable {
    /** 版本号 */
    private static final long serialVersionUID = -5857230990968868745L;

    /** inPutAccount */
    private Integer inPutAccount;

    /** inPutTime */
    private Date inPutTime;

    /** materialId */
    private String materialId;

    /** A  - 初始
            0 - 正常
            1 - 已屏蔽 */
    private String status;

    /**
     * 获取inPutAccount
     * 
     * @return inPutAccount
     */
    @Column(name = "IN_PUT_ACCOUNT", nullable = true, length = 10)
    public Integer getInPutAccount() {
        return this.inPutAccount;
    }

    /**
     * 设置inPutAccount
     * 
     * @param inPutAccount
     */
    public void setInPutAccount(Integer inPutAccount) {
        this.inPutAccount = inPutAccount;
    }

    /**
     * 获取inPutTime
     * 
     * @return inPutTime
     */
    @Column(name = "IN_PUT_TIME", nullable = true)
    public Date getInPutTime() {
        return this.inPutTime;
    }

    /**
     * 设置inPutTime
     * 
     * @param inPutTime
     */
    public void setInPutTime(Date inPutTime) {
        this.inPutTime = inPutTime;
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