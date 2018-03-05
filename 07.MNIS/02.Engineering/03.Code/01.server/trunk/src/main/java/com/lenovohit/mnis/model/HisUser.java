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
 * MNIS_USER
 * 
 * @author zyus
 * @version 1.0.0 2018-01-31
 */
@Entity
@Table(name = "HIS_USER")
public class HisUser extends AuditableModel implements java.io.Serializable {
    /** 版本号 */
    private static final long serialVersionUID = 8011836056949725389L;

    /** 用户ID */
    private String userId;

    /** 用户账号 */
    private String account;

    /** 用户姓名 */
    private String name;

    /** 用户性别 */
    private String gender;

    /** 性别名称 */
    private String genderName;

    /** 用户类型 */
    private String type;

    /** 医院代码 */
    private String hospitalCode;

    /** 医院名称 */
    private String hospitalName;

    /** 院区代码 */
    private String hospitalAreaCode;

    /** 院区名称 */
    private String hospitalAreaName;

    /** 所属科室代码 */
    private String deptCode;

    /** 所属科室名称 */
    private String deptName;

    /** 当前病区代码 */
    private String inpatientAreaCode;

    /** 当前病区名称 */
    private String inpatientAreaName;

    /** 状态 */
    private String status;

    /**
     * 获取用户ID
     * 
     * @return 用户ID
     */
    public String getUserId() {
        return this.userId;
    }

    /**
     * 设置用户ID
     * 
     * @param userId
     *          用户ID
     */
    public void setUserId(String userId) {
        this.userId = userId;
    }

    /**
     * 获取用户账号
     * 
     * @return 用户账号
     */
    public String getAccount() {
        return this.account;
    }

    /**
     * 设置用户账号
     * 
     * @param account
     *          用户账号
     */
    public void setAccount(String account) {
        this.account = account;
    }

    /**
     * 获取用户姓名
     * 
     * @return 用户姓名
     */
    public String getName() {
        return this.name;
    }

    /**
     * 设置用户姓名
     * 
     * @param name
     *          用户姓名
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * 获取用户性别
     * 
     * @return 用户性别
     */
    public String getGender() {
        return this.gender;
    }

    /**
     * 设置用户性别
     * 
     * @param gender
     *          用户性别
     */
    public void setGender(String gender) {
        this.gender = gender;
    }

    /**
     * 获取性别名称
     * 
     * @return 性别名称
     */
    public String getGenderName() {
        return this.genderName;
    }

    /**
     * 设置性别名称
     * 
     * @param genderName
     *          性别名称
     */
    public void setGenderName(String genderName) {
        this.genderName = genderName;
    }

    /**
     * 获取用户类型
     * 
     * @return 用户类型
     */
    public String getType() {
        return this.type;
    }

    /**
     * 设置用户类型
     * 
     * @param type
     *          用户类型
     */
    public void setType(String type) {
        this.type = type;
    }

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
     * 获取所属科室代码
     * 
     * @return 所属科室代码
     */
    public String getDeptCode() {
        return this.deptCode;
    }

    /**
     * 设置所属科室代码
     * 
     * @param deptCode
     *          所属科室代码
     */
    public void setDeptCode(String deptCode) {
        this.deptCode = deptCode;
    }

    /**
     * 获取所属科室名称
     * 
     * @return 所属科室名称
     */
    public String getDeptName() {
        return this.deptName;
    }

    /**
     * 设置所属科室名称
     * 
     * @param deptName
     *          所属科室名称
     */
    public void setDeptName(String deptName) {
        this.deptName = deptName;
    }

    /**
     * 获取当前病区代码
     * 
     * @return 当前病区代码
     */
    public String getInpatientAreaCode() {
        return this.inpatientAreaCode;
    }

    /**
     * 设置当前病区代码
     * 
     * @param inpatientAreaCode
     *          当前病区代码
     */
    public void setInpatientAreaCode(String inpatientAreaCode) {
        this.inpatientAreaCode = inpatientAreaCode;
    }

    /**
     * 获取当前病区名称
     * 
     * @return 当前病区名称
     */
    public String getInpatientAreaName() {
        return this.inpatientAreaName;
    }

    /**
     * 设置当前病区名称
     * 
     * @param inpatientAreaName
     *          当前病区名称
     */
    public void setInpatientAreaName(String inpatientAreaName) {
        this.inpatientAreaName = inpatientAreaName;
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