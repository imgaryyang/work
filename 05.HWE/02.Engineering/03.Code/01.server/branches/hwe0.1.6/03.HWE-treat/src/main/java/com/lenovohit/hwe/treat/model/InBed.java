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

package com.lenovohit.hwe.treat.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import com.lenovohit.hwe.base.model.AuditableModel;

/**
 * TREAT_BED
 * 
 * @author zyus
 * @version 1.0.0 2017-12-16
 */
@Entity
@Table(name = "TREAT_BED")
public class InBed extends AuditableModel implements java.io.Serializable {
    /** 版本号 */
    private static final long serialVersionUID = -1756221321406320789L;

    /** hosId */
    private String hosId;

    /** hosNo */
    private String hosNo;

    /** hosName */
    private String hosName;

    /** depId */
    private String depId;

    /** depNo */
    private String depNo;

    /** depName */
    private String depName;

    /** areaId */
    private String areaId;

    /** areaNo */
    private String areaNo;

    /** areaName */
    private String areaName;

    /** num */
    private String num;

    /** name */
    private String name;

    /** address */
    private String address;

    /** status */
    private String status;

    /**
     * 获取hosId
     * 
     * @return hosId
     */
    @Column(name = "HOS_ID", nullable = true, length = 32)
    public String getHosId() {
        return this.hosId;
    }

    /**
     * 设置hosId
     * 
     * @param hosId
     */
    public void setHosId(String hosId) {
        this.hosId = hosId;
    }

    /**
     * 获取hosNo
     * 
     * @return hosNo
     */
    @Column(name = "HOS_NO", nullable = true, length = 50)
    public String getHosNo() {
        return this.hosNo;
    }

    /**
     * 设置hosNo
     * 
     * @param hosNo
     */
    public void setHosNo(String hosNo) {
        this.hosNo = hosNo;
    }

    /**
     * 获取hosName
     * 
     * @return hosName
     */
    @Column(name = "HOS_NAME", nullable = true, length = 50)
    public String getHosName() {
        return this.hosName;
    }

    /**
     * 设置hosName
     * 
     * @param hosName
     */
    public void setHosName(String hosName) {
        this.hosName = hosName;
    }

    /**
     * 获取depId
     * 
     * @return depId
     */
    @Column(name = "DEP_ID", nullable = true, length = 32)
    public String getDepId() {
        return this.depId;
    }

    /**
     * 设置depId
     * 
     * @param depId
     */
    public void setDepId(String depId) {
        this.depId = depId;
    }

    /**
     * 获取depNo
     * 
     * @return depNo
     */
    @Column(name = "DEP_NO", nullable = true, length = 50)
    public String getDepNo() {
        return this.depNo;
    }

    /**
     * 设置depNo
     * 
     * @param depNo
     */
    public void setDepNo(String depNo) {
        this.depNo = depNo;
    }

    /**
     * 获取depName
     * 
     * @return depName
     */
    @Column(name = "DEP_NAME", nullable = true, length = 50)
    public String getDepName() {
        return this.depName;
    }

    /**
     * 设置depName
     * 
     * @param depName
     */
    public void setDepName(String depName) {
        this.depName = depName;
    }

    /**
     * 获取areaId
     * 
     * @return areaId
     */
    @Column(name = "AREA_ID", nullable = true, length = 32)
    public String getAreaId() {
        return this.areaId;
    }

    /**
     * 设置areaId
     * 
     * @param areaId
     */
    public void setAreaId(String areaId) {
        this.areaId = areaId;
    }

    /**
     * 获取areaNo
     * 
     * @return areaNo
     */
    @Column(name = "AREA_NO", nullable = true, length = 50)
    public String getAreaNo() {
        return this.areaNo;
    }

    /**
     * 设置areaNo
     * 
     * @param areaNo
     */
    public void setAreaNo(String areaNo) {
        this.areaNo = areaNo;
    }

    /**
     * 获取areaName
     * 
     * @return areaName
     */
    @Column(name = "AREA_NAME", nullable = true, length = 50)
    public String getAreaName() {
        return this.areaName;
    }

    /**
     * 设置areaName
     * 
     * @param areaName
     */
    public void setAreaName(String areaName) {
        this.areaName = areaName;
    }

    /**
     * 获取num
     * 
     * @return num
     */
    @Column(name = "NUM", nullable = true, length = 50)
    public String getNum() {
        return this.num;
    }

    /**
     * 设置num
     * 
     * @param num
     */
    public void setNum(String num) {
        this.num = num;
    }

    /**
     * 获取name
     * 
     * @return name
     */
    @Column(name = "NAME", nullable = true, length = 50)
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
     * 获取address
     * 
     * @return address
     */
    @Column(name = "ADDRESS", nullable = true, length = 100)
    public String getAddress() {
        return this.address;
    }

    /**
     * 设置address
     * 
     * @param address
     */
    public void setAddress(String address) {
        this.address = address;
    }

    /**
     * 获取status
     * 
     * @return status
     */
    @Column(name = "STATUS", nullable = true, length = 1)
    public String getStatus() {
        return this.status;
    }

    /**
     * 设置status
     * 
     * @param status
     */
    public void setStatus(String status) {
        this.status = status;
    }
}