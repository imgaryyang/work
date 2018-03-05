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

package com.lenovohit.mnis.model;

import javax.persistence.Entity;
import javax.persistence.Table;

import com.lenovohit.mnis.base.model.AuditableModel;

/**
 * MNIS_HOSPITAL
 * 
 * @author zyus
 * @version 1.0.0 2018-01-31
 */
@Entity
@Table(name = "MNIS_HOSPITAL")
public class Hospital extends AuditableModel implements java.io.Serializable {
    /** 版本号 */
    private static final long serialVersionUID = 6781744719102233036L;

    /** 医院代码 */
    private String hospitalCode;

    /** 医院名称 */
    private String hospitalName;

    /** 院区代码 */
    private String hospitalAreaCode;

    /** 院区名称 */
    private String hospitalAreaName;

    /** 状态 */
    private String status;

    /**
     * 获取医院代码
     * 
     * @return 医院代码
     */
    public String getHospitalCode() {
        return this.hospitalCode;
    }

    /**
     * 设置医院代码
     * 
     * @param hospitalCode
     *          医院代码
     */
    public void setHospitalCode(String hospitalCode) {
        this.hospitalCode = hospitalCode;
    }

    /**
     * 获取医院名称
     * 
     * @return 医院名称
     */
    public String getHospitalName() {
        return this.hospitalName;
    }

    /**
     * 设置医院名称
     * 
     * @param hospitalName
     *          医院名称
     */
    public void setHospitalName(String hospitalName) {
        this.hospitalName = hospitalName;
    }

    /**
     * 获取院区代码
     * 
     * @return 院区代码
     */
    public String getHospitalAreaCode() {
        return this.hospitalAreaCode;
    }

    /**
     * 设置院区代码
     * 
     * @param hospitalAreaCode
     *          院区代码
     */
    public void setHospitalAreaCode(String hospitalAreaCode) {
        this.hospitalAreaCode = hospitalAreaCode;
    }

    /**
     * 获取院区名称
     * 
     * @return 院区名称
     */
    public String getHospitalAreaName() {
        return this.hospitalAreaName;
    }

    /**
     * 设置院区名称
     * 
     * @param hospitalAreaName
     *          院区名称
     */
    public void setHospitalAreaName(String hospitalAreaName) {
        this.hospitalAreaName = hospitalAreaName;
    }

    /**
     * 获取状态
     * 
     * @return 状态
     */
    public String getStatus() {
        return this.status;
    }

    /**
     * 设置状态
     * 
     * @param status
     *          状态
     */
    public void setStatus(String status) {
        this.status = status;
    }
}