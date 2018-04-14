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

import java.math.BigDecimal;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.lenovohit.hwe.base.model.AuditableModel;

/**
 * TREAT_FEEITEM
 * 
 * @author zyus
 * @version 1.0.0 2017-12-16
 */
@Entity
@Table(name = "TREAT_FEEITEM")
public class Feeitem extends AuditableModel implements java.io.Serializable {
    /** 版本号 */
    private static final long serialVersionUID = 252250936817467285L;

    /** hosId */
    private String hosId;

    /** hosNo */
    private String hosNo;

    /** hosName */
    private String hosName;

    /** code */
    private String code;

    /** name */
    private String name;

    /** pinyin */
    private String pinyin;

    /** wubi */
    private String wubi;

    /** price */
    private BigDecimal price;

    /** unit */
    private String unit;

    /** spec */
    private String spec;

    /** miFlag */
    private String miFlag;

    /** status */
    private String status;
    
    private Hospital hospital;
    
    
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
     * 获取code
     * 
     * @return code
     */
    @Column(name = "CODE", nullable = true, length = 50)
    public String getCode() {
        return this.code;
    }

    /**
     * 设置code
     * 
     * @param code
     */
    public void setCode(String code) {
        this.code = code;
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
     * 获取pinyin
     * 
     * @return pinyin
     */
    @Column(name = "PINYIN", nullable = true, length = 50)
    public String getPinyin() {
        return this.pinyin;
    }

    /**
     * 设置pinyin
     * 
     * @param pinyin
     */
    public void setPinyin(String pinyin) {
        this.pinyin = pinyin;
    }

    /**
     * 获取wubi
     * 
     * @return wubi
     */
    @Column(name = "WUBI", nullable = true, length = 50)
    public String getWubi() {
        return this.wubi;
    }

    /**
     * 设置wubi
     * 
     * @param wubi
     */
    public void setWubi(String wubi) {
        this.wubi = wubi;
    }

    /**
     * 获取price
     * 
     * @return price
     */
    @Column(name = "PRICE", nullable = true)
    public BigDecimal getPrice() {
        return this.price;
    }

    /**
     * 设置price
     * 
     * @param price
     */
    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    /**
     * 获取unit
     * 
     * @return unit
     */
    @Column(name = "UNIT", nullable = true, length = 20)
    public String getUnit() {
        return this.unit;
    }

    /**
     * 设置unit
     * 
     * @param unit
     */
    public void setUnit(String unit) {
        this.unit = unit;
    }

    /**
     * 获取spec
     * 
     * @return spec
     */
    @Column(name = "SPEC", nullable = true, length = 20)
    public String getSpec() {
        return this.spec;
    }

    /**
     * 设置spec
     * 
     * @param spec
     */
    public void setSpec(String spec) {
        this.spec = spec;
    }

    /**
     * 获取miFlag
     * 
     * @return miFlag
     */
    @Column(name = "MI_FLAG", nullable = true, length = 1)
    public String getMiFlag() {
        return this.miFlag;
    }

    /**
     * 设置miFlag
     * 
     * @param miFlag
     */
    public void setMiFlag(String miFlag) {
        this.miFlag = miFlag;
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
    
    @Transient
   	public Hospital getHospital() {
   		return hospital;
   	}

   	public void setHospital(Hospital hospital) {
   		this.hospital = hospital;
   	}
}