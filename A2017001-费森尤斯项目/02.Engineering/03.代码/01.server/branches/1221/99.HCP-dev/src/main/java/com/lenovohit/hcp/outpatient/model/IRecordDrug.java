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

package com.lenovohit.hcp.outpatient.model;

import java.math.BigDecimal;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;


/**
 * TREAT_RECORD_DRUG
 * 
 * @author zyus
 * @version 1.0.0 2017-12-16
 */
public class IRecordDrug  implements java.io.Serializable {
    /** 版本号 */
    private static final long serialVersionUID = -2000478153685239451L;
    private String id;
    public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	/** recordId */
    private String recordId;

    /** recordNo */
    private String recordNo;

    /** drugId */
    private String drugId;

    /** drugNo */
    private String drugNo;

    /** dsId */
    private String dsId;

    /** dsNo */
    private String dsNo;

    /** name */
    private String name;

    /** unit */
    private String unit;

    /** form */
    private String form;

    /** dose */
    private String dose;

    /** packages */
    private String packages;

    /** price */
    private BigDecimal price;

    /** count */
    private BigDecimal count;

    /** num */
    private Integer num;

    /** frequency */
    private String frequency;

    /** oneSize */
    private BigDecimal oneSize;

    /** metUnit */
    private String metUnit;

    /** way */
    private String way;

    /** specialWay */
    private String specialWay;

    /** myslefAmt */
    private BigDecimal myslefAmt;

    /** myslefScan */
    private BigDecimal myslefScan;

    /** groupNo */
    private String groupNo;

    /** groupSort */
    private Integer groupSort;
    private String hosNo;
    private String hosName;

    public String getHosNo() {
		return hosNo;
	}

	public void setHosNo(String hosNo) {
		this.hosNo = hosNo;
	}

	public String getHosName() {
		return hosName;
	}

	public void setHosName(String hosName) {
		this.hosName = hosName;
	}

	/** A - 初始
            0 - 正常
            1 - 废弃 */
    private String status;

    /**
     * 获取recordId
     * 
     * @return recordId
     */
    @Column(name = "RECORD_ID", nullable = true, length = 32)
    public String getRecordId() {
        return this.recordId;
    }

    /**
     * 设置recordId
     * 
     * @param recordId
     */
    public void setRecordId(String recordId) {
        this.recordId = recordId;
    }

    /**
     * 获取recordNo
     * 
     * @return recordNo
     */
    public String getRecordNo() {
        return this.recordNo;
    }

    /**
     * 设置recordNo
     * 
     * @param recordNo
     */
    public void setRecordNo(String recordNo) {
        this.recordNo = recordNo;
    }

    /**
     * 获取drugId
     * 
     * @return drugId
     */
    public String getDrugId() {
        return this.drugId;
    }

    /**
     * 设置drugId
     * 
     * @param drugId
     */
    public void setDrugId(String drugId) {
        this.drugId = drugId;
    }

    /**
     * 获取drugNo
     * 
     * @return drugNo
     */
    public String getDrugNo() {
        return this.drugNo;
    }

    /**
     * 设置drugNo
     * 
     * @param drugNo
     */
    public void setDrugNo(String drugNo) {
        this.drugNo = drugNo;
    }

    /**
     * 获取dsId
     * 
     * @return dsId
     */
    public String getDsId() {
        return this.dsId;
    }

    /**
     * 设置dsId
     * 
     * @param dsId
     */
    public void setDsId(String dsId) {
        this.dsId = dsId;
    }

    /**
     * 获取dsNo
     * 
     * @return dsNo
     */
    public String getDsNo() {
        return this.dsNo;
    }

    /**
     * 设置dsNo
     * 
     * @param dsNo
     */
    public void setDsNo(String dsNo) {
        this.dsNo = dsNo;
    }

    /**
     * 获取name
     * 
     * @return name
     */
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
     * 获取unit
     * 
     * @return unit
     */
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
     * 获取form
     * 
     * @return form
     */
    public String getForm() {
        return this.form;
    }

    /**
     * 设置form
     * 
     * @param form
     */
    public void setForm(String form) {
        this.form = form;
    }

    /**
     * 获取dose
     * 
     * @return dose
     */
    public String getDose() {
        return this.dose;
    }

    /**
     * 设置dose
     * 
     * @param dose
     */
    public void setDose(String dose) {
        this.dose = dose;
    }

    /**
     * 获取packages
     * 
     * @return packages
     */
    public String getPackages() {
        return this.packages;
    }

    /**
     * 设置packages
     * 
     * @param packages
     */
    public void setPackages(String packages) {
        this.packages = packages;
    }

    /**
     * 获取price
     * 
     * @return price
     */
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

    

    public BigDecimal getCount() {
		return count;
	}

	public void setCount(BigDecimal count) {
		this.count = count;
	}

	/**
     * 获取num
     * 
     * @return num
     */
    public Integer getNum() {
        return this.num;
    }

    /**
     * 设置num
     * 
     * @param num
     */
    public void setNum(Integer num) {
        this.num = num;
    }

    /**
     * 获取frequency
     * 
     * @return frequency
     */
    public String getFrequency() {
        return this.frequency;
    }

    /**
     * 设置frequency
     * 
     * @param frequency
     */
    public void setFrequency(String frequency) {
        this.frequency = frequency;
    }

    /**
     * 获取oneSize
     * 
     * @return oneSize
     */
    public BigDecimal getOneSize() {
        return this.oneSize;
    }

    /**
     * 设置oneSize
     * 
     * @param oneSize
     */
    public void setOneSize(BigDecimal oneSize) {
        this.oneSize = oneSize;
    }

    /**
     * 获取metUnit
     * 
     * @return metUnit
     */
    public String getMetUnit() {
        return this.metUnit;
    }

    /**
     * 设置metUnit
     * 
     * @param metUnit
     */
    public void setMetUnit(String metUnit) {
        this.metUnit = metUnit;
    }

    /**
     * 获取way
     * 
     * @return way
     */
    public String getWay() {
        return this.way;
    }

    /**
     * 设置way
     * 
     * @param way
     */
    public void setWay(String way) {
        this.way = way;
    }

    /**
     * 获取specialWay
     * 
     * @return specialWay
     */
    public String getSpecialWay() {
        return this.specialWay;
    }

    /**
     * 设置specialWay
     * 
     * @param specialWay
     */
    public void setSpecialWay(String specialWay) {
        this.specialWay = specialWay;
    }

    /**
     * 获取myslefAmt
     * 
     * @return myslefAmt
     */
    public BigDecimal getMyslefAmt() {
        return this.myslefAmt;
    }

    /**
     * 设置myslefAmt
     * 
     * @param myslefAmt
     */
    public void setMyslefAmt(BigDecimal myslefAmt) {
        this.myslefAmt = myslefAmt;
    }

    /**
     * 获取myslefScan
     * 
     * @return myslefScan
     */
    public BigDecimal getMyslefScan() {
        return this.myslefScan;
    }

    /**
     * 设置myslefScan
     * 
     * @param myslefScan
     */
    public void setMyslefScan(BigDecimal myslefScan) {
        this.myslefScan = myslefScan;
    }

    /**
     * 获取groupNo
     * 
     * @return groupNo
     */
    public String getGroupNo() {
        return this.groupNo;
    }

    /**
     * 设置groupNo
     * 
     * @param groupNo
     */
    public void setGroupNo(String groupNo) {
        this.groupNo = groupNo;
    }

    /**
     * 获取groupSort
     * 
     * @return groupSort
     */
    public Integer getGroupSort() {
        return this.groupSort;
    }

    /**
     * 设置groupSort
     * 
     * @param groupSort
     */
    public void setGroupSort(Integer groupSort) {
        this.groupSort = groupSort;
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