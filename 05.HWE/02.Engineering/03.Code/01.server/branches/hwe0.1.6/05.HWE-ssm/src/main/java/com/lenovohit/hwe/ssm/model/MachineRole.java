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
import javax.persistence.Id;
import javax.persistence.Table;

import com.lenovohit.hwe.base.model.AuditableModel;

/**
 * SSM_MACHINE_ROLE
 * 
 * @author zyus
 * @version 1.0.0 2017-12-14
 */
@Entity
@Table(name = "SSM_MACHINE_ROLE")
public class MachineRole extends AuditableModel implements java.io.Serializable {
    /** 版本号 */
    private static final long serialVersionUID = -5938471360472347639L;

    /** roleId */
    private String roleId;

    /** machineId */
    private String machineId;

    /**
     * 获取roleId
     * 
     * @return roleId
     */
    @Id
    @Column(name = "ROLE_ID", unique = true, nullable = false, length = 32)
    public String getRoleId() {
        return this.roleId;
    }

    /**
     * 设置roleId
     * 
     * @param roleId
     */
    public void setRoleId(String roleId) {
        this.roleId = roleId;
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
}