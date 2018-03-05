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

import java.math.BigDecimal;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * BASE_REGION
 * 
 * @author zyus
 * @version 1.0.0 2017-12-14
 */
@Entity
@Table(name = "BASE_REGION")
public class Region extends AuditableModel implements java.io.Serializable {
    /** 版本号 */
    private static final long serialVersionUID = -4592326007128517077L;

    /** 父id */
    private String 父id;

    /** name */
    private String name;

    /** shortName */
    private String shortName;

    /** longitude */
    private BigDecimal longitude;

    /** latitude */
    private BigDecimal latitude;

    /** 等级(1省/直辖市,2地级市,3区县,4镇/街道) */
    private Integer level;

    /** sort */
    private Integer sort;

    /** 状态(0启用/1禁用) */
    private String status;

    /**
     * 获取父id
     * 
     * @return 父id
     */
    @Column(name = "父ID", nullable = true, length = 32)
    public String get父id() {
        return this.父id;
    }

    /**
     * 设置父id
     * 
     * @param 父id
     */
    public void set父id(String 父id) {
        this.父id = 父id;
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
     * 获取shortName
     * 
     * @return shortName
     */
    @Column(name = "SHORT_NAME", nullable = true, length = 50)
    public String getShortName() {
        return this.shortName;
    }

    /**
     * 设置shortName
     * 
     * @param shortName
     */
    public void setShortName(String shortName) {
        this.shortName = shortName;
    }

    /**
     * 获取longitude
     * 
     * @return longitude
     */
    @Column(name = "LONGITUDE", nullable = true)
    public BigDecimal getLongitude() {
        return this.longitude;
    }

    /**
     * 设置longitude
     * 
     * @param longitude
     */
    public void setLongitude(BigDecimal longitude) {
        this.longitude = longitude;
    }

    /**
     * 获取latitude
     * 
     * @return latitude
     */
    @Column(name = "LATITUDE", nullable = true)
    public BigDecimal getLatitude() {
        return this.latitude;
    }

    /**
     * 设置latitude
     * 
     * @param latitude
     */
    public void setLatitude(BigDecimal latitude) {
        this.latitude = latitude;
    }

    /**
     * 获取等级(1省/直辖市,2地级市,3区县,4镇/街道)
     * 
     * @return 等级(1省/直辖市
     */
    @Column(name = "LEVEL", nullable = true, length = 10)
    public Integer getLevel() {
        return this.level;
    }

    /**
     * 设置等级(1省/直辖市,2地级市,3区县,4镇/街道)
     * 
     * @param level
     *          等级(1省/直辖市
     */
    public void setLevel(Integer level) {
        this.level = level;
    }

    /**
     * 获取sort
     * 
     * @return sort
     */
    @Column(name = "SORT", nullable = true, length = 10)
    public Integer getSort() {
        return this.sort;
    }

    /**
     * 设置sort
     * 
     * @param sort
     */
    public void setSort(Integer sort) {
        this.sort = sort;
    }

    /**
     * 获取状态(0启用/1禁用)
     * 
     * @return 状态(0启用/1禁用)
     */
    @Column(name = "STATUS", nullable = true, length = 1)
    public String getStatus() {
        return this.status;
    }

    /**
     * 设置状态(0启用/1禁用)
     * 
     * @param status
     *          状态(0启用/1禁用)
     */
    public void setStatus(String status) {
        this.status = status;
    }
}