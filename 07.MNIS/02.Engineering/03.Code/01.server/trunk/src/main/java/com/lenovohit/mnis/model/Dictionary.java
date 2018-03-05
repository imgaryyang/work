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
 * MNIS_DICTIONARY
 * 
 * @author zyus
 * @version 1.0.0 2018-02-02
 */
@Entity
@Table(name = "MNIS_DICTIONARY")
public class Dictionary extends AuditableModel implements java.io.Serializable {
    /** 版本号 */
    private static final long serialVersionUID = -4020157681011501899L;

    /** 序号 */
    private Integer no;

    /** 类型编码 */
    private String dicCode;

    /** 名称 */
    private String dicName;

    /** 项目编码1 */
    private String code1;

    /** 项目名称1 */
    private String name1;

    /** 单位1 */
    private String unit1;

    /** 项目备注信息 */
    private String remark;

    /** 项目编码2 */
    private String code2;

    /** 项目名称2 */
    private String name2;

    /** 单位2 */
    private String unit2;

    /** 组内序号 */
    private Integer sortId;

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
     * 获取序号
     * 
     * @return 序号
     */
    public Integer getNo() {
        return this.no;
    }

    /**
     * 设置序号
     * 
     * @param no
     *          序号
     */
    public void setNo(Integer no) {
        this.no = no;
    }

    /**
     * 获取类型编码
     * 
     * @return 类型编码
     */
    public String getDicCode() {
        return this.dicCode;
    }

    /**
     * 设置类型编码
     * 
     * @param dicCode
     *          类型编码
     */
    public void setDicCode(String dicCode) {
        this.dicCode = dicCode;
    }

    /**
     * 获取名称
     * 
     * @return 名称
     */
    public String getDicName() {
        return this.dicName;
    }

    /**
     * 设置名称
     * 
     * @param dicName
     *          名称
     */
    public void setDicName(String dicName) {
        this.dicName = dicName;
    }

    /**
     * 获取项目编码1
     * 
     * @return 项目编码1
     */
    public String getCode1() {
        return this.code1;
    }

    /**
     * 设置项目编码1
     * 
     * @param code1
     *          项目编码1
     */
    public void setCode1(String code1) {
        this.code1 = code1;
    }

    /**
     * 获取项目名称1
     * 
     * @return 项目名称1
     */
    public String getName1() {
        return this.name1;
    }

    /**
     * 设置项目名称1
     * 
     * @param name1
     *          项目名称1
     */
    public void setName1(String name1) {
        this.name1 = name1;
    }

    /**
     * 获取单位1
     * 
     * @return 单位1
     */
    public String getUnit1() {
        return this.unit1;
    }

    /**
     * 设置单位1
     * 
     * @param unit1
     *          单位1
     */
    public void setUnit1(String unit1) {
        this.unit1 = unit1;
    }

    /**
     * 获取项目备注信息
     * 
     * @return 项目备注信息
     */
    public String getRemark() {
        return this.remark;
    }

    /**
     * 设置项目备注信息
     * 
     * @param remark
     *          项目备注信息
     */
    public void setRemark(String remark) {
        this.remark = remark;
    }

    /**
     * 获取项目编码2
     * 
     * @return 项目编码2
     */
    public String getCode2() {
        return this.code2;
    }

    /**
     * 设置项目编码2
     * 
     * @param code2
     *          项目编码2
     */
    public void setCode2(String code2) {
        this.code2 = code2;
    }

    /**
     * 获取项目名称2
     * 
     * @return 项目名称2
     */
    public String getName2() {
        return this.name2;
    }

    /**
     * 设置项目名称2
     * 
     * @param name2
     *          项目名称2
     */
    public void setName2(String name2) {
        this.name2 = name2;
    }

    /**
     * 获取单位2
     * 
     * @return 单位2
     */
    public String getUnit2() {
        return this.unit2;
    }

    /**
     * 设置单位2
     * 
     * @param unit2
     *          单位2
     */
    public void setUnit2(String unit2) {
        this.unit2 = unit2;
    }

    /**
     * 获取组内序号
     * 
     * @return 组内序号
     */
    public Integer getSortId() {
        return this.sortId;
    }

    /**
     * 设置组内序号
     * 
     * @param sortId
     *          组内序号
     */
    public void setSortId(Integer sortId) {
        this.sortId = sortId;
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