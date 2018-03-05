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
 * SSM_TROUBLE_DETAIL
 * 
 * @author zyus
 * @version 1.0.0 2017-12-14
 */
@Entity
@Table(name = "SSM_TROUBLE_DETAIL")
public class TroubleDetail extends AuditableModel implements java.io.Serializable {
    /** 版本号 */
    private static final long serialVersionUID = -9098500189512676077L;

    /** troubleId */
    private String troubleId;

    /** machineId */
    private String machineId;

    /** dealWay */
    private String dealWay;

    /** description */
    private String description;

    /** A  - 初始
            0 - 正常
            1 - 已屏蔽 */
    private String status;

    /**
     * 获取troubleId
     * 
     * @return troubleId
     */
    @Column(name = "TROUBLE_ID", nullable = true, length = 32)
    public String getTroubleId() {
        return this.troubleId;
    }

    /**
     * 设置troubleId
     * 
     * @param troubleId
     */
    public void setTroubleId(String troubleId) {
        this.troubleId = troubleId;
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
     * 获取dealWay
     * 
     * @return dealWay
     */
    @Column(name = "DEAL_WAY", nullable = true, length = 200)
    public String getDealWay() {
        return this.dealWay;
    }

    /**
     * 设置dealWay
     * 
     * @param dealWay
     */
    public void setDealWay(String dealWay) {
        this.dealWay = dealWay;
    }

    /**
     * 获取description
     * 
     * @return description
     */
    @Column(name = "DESCRIPTION", nullable = true, length = 200)
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