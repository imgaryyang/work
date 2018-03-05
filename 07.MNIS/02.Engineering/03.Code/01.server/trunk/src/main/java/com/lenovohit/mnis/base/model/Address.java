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

package com.lenovohit.mnis.base.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * BASE_ADDRESS
 * 
 * @author zyus
 * @version 1.0.0 2017-12-14
 */
@Entity
@Table(name = "BASE_ADDRESS")
public class Address extends AuditableModel implements java.io.Serializable {
    /** 版本号 */
    private static final long serialVersionUID = -3398789039031164203L;

    /** fkId */
    private String fkId;

    /** fkType */
    private String fkType;

    /** zipCode */
    private String zipCode;

    /** areaCode */
    private String areaCode;

    /** areaName */
    private String areaName;

    /** address */
    private String address;

    /** memo */
    private String memo;

    /** A - 初始
            0 - 正常
            1 - 废弃 */
    private String status;

    /**
     * 获取fkId
     * 
     * @return fkId
     */
    @Column(name = "FK_ID", nullable = false, length = 32)
    public String getFkId() {
        return this.fkId;
    }

    /**
     * 设置fkId
     * 
     * @param fkId
     */
    public void setFkId(String fkId) {
        this.fkId = fkId;
    }

    /**
     * 获取fkType
     * 
     * @return fkType
     */
    @Column(name = "FK_TYPE", nullable = true, length = 10)
    public String getFkType() {
        return this.fkType;
    }

    /**
     * 设置fkType
     * 
     * @param fkType
     */
    public void setFkType(String fkType) {
        this.fkType = fkType;
    }

    /**
     * 获取zipCode
     * 
     * @return zipCode
     */
    @Column(name = "ZIP_CODE", nullable = true, length = 6)
    public String getZipCode() {
        return this.zipCode;
    }

    /**
     * 设置zipCode
     * 
     * @param zipCode
     */
    public void setZipCode(String zipCode) {
        this.zipCode = zipCode;
    }

    /**
     * 获取areaCode
     * 
     * @return areaCode
     */
    @Column(name = "AREA_CODE", nullable = true, length = 6)
    public String getAreaCode() {
        return this.areaCode;
    }

    /**
     * 设置areaCode
     * 
     * @param areaCode
     */
    public void setAreaCode(String areaCode) {
        this.areaCode = areaCode;
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
     * 获取address
     * 
     * @return address
     */
    @Column(name = "ADDRESS", nullable = false, length = 255)
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
     * 获取memo
     * 
     * @return memo
     */
    @Column(name = "MEMO", nullable = true, length = 255)
    public String getMemo() {
        return this.memo;
    }

    /**
     * 设置memo
     * 
     * @param memo
     */
    public void setMemo(String memo) {
        this.memo = memo;
    }

    /**
     * 获取A - 初始
            0 - 正常
            1 - 废弃
     * 
     * @return A - 初始
            0 - 正常
            1 - 废弃
     */
    @Column(name = "STATUS", nullable = true, length = 1)
    public String getStatus() {
        return this.status;
    }

    /**
     * 设置A - 初始
            0 - 正常
            1 - 废弃
     * 
     * @param status
     *          A - 初始
            0 - 正常
            1 - 废弃
     */
    public void setStatus(String status) {
        this.status = status;
    }
}