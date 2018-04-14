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

import com.lenovohit.hwe.base.model.AuditableModel;

/**
 * TREAT_RECORD_DRUG
 * 
 * @author zyus
 * @version 1.0.0 2017-12-16
 */
@Entity
@Table(name = "TREAT_RECORD_DRUG")
public class RecordDrug extends AuditableModel implements java.io.Serializable {
    /** 版本号 */
    private static final long serialVersionUID = -2000478153685239451L;
    /** hosId */
    private String hosId;

    /** hosNo */
    private String hosNo;

    /** hosName */
    private String hosName;

    /** proId */
    private String proId;

    /** proNo */
    private String proNo;

    /** proName */
    private String proName;
    
    /** recordId */
    private String recordId;

    /** recordNo */
    private String recordNo;
    
    /** actId */
    private String actId;

    /** actNo */
    private String actNo;

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
    private Integer count;

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

    /** A - 初始
            0 - 正常
            1 - 废弃 */
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
     * 获取proId
     * 
     * @return proId
     */
    @Column(name = "PRO_ID", nullable = true, length = 32)
    public String getProId() {
        return this.proId;
    }

    /**
     * 设置proId
     * 
     * @param proId
     */
    public void setProId(String proId) {
        this.proId = proId;
    }

    /**
     * 获取proNo
     * 
     * @return proNo
     */
    @Column(name = "PRO_NO", nullable = true, length = 50)
    public String getProNo() {
        return this.proNo;
    }

    /**
     * 设置proNo
     * 
     * @param proNo
     */
    public void setProNo(String proNo) {
        this.proNo = proNo;
    }

    /**
     * 获取proName
     * 
     * @return proName
     */
    @Column(name = "PRO_NAME", nullable = true, length = 70)
    public String getProName() {
        return this.proName;
    }

    /**
     * 设置proName
     * 
     * @param proName
     */
    public void setProName(String proName) {
        this.proName = proName;
    }
    
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
    @Column(name = "RECORD_NO", nullable = true, length = 50)
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
     * 获取actId
     * 
     * @return actId
     */
    @Column(name = "ACT_ID", nullable = true, length = 32)
    public String getActId() {
		return actId;
	}
    
    /**
     * 设置actId
     * 
     * @param actId
     */
	public void setActId(String actId) {
		this.actId = actId;
	}
	
	/**
     * 获取actNo
     * 
     * @return actNo
     */
	@Column(name = "ACT_NO", nullable = true, length = 50)
	public String getActNo() {
		return actNo;
	}
	/**
     * 设置actNo
     * 
     * @param actNo
     */
	public void setActNo(String actNo) {
		this.actNo = actNo;
	}


    /**
     * 获取drugId
     * 
     * @return drugId
     */
    @Column(name = "DRUG_ID", nullable = true, length = 32)
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
    @Column(name = "DRUG_NO", nullable = true, length = 50)
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
    @Column(name = "DS_ID", nullable = true, length = 32)
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
    @Column(name = "DS_NO", nullable = true, length = 50)
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
    @Column(name = "NAME", nullable = true, length = 100)
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
     * 获取form
     * 
     * @return form
     */
    @Column(name = "FORM", nullable = true, length = 20)
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
    @Column(name = "DOSE", nullable = true, length = 20)
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
    @Column(name = "PACKAGES", nullable = true, length = 20)
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
     * 获取count
     * 
     * @return count
     */
    @Column(name = "COUNT", nullable = true, length = 10)
    public Integer getCount() {
        return this.count;
    }

    /**
     * 设置count
     * 
     * @param count
     */
    public void setCount(Integer count) {
        this.count = count;
    }

    /**
     * 获取num
     * 
     * @return num
     */
    @Column(name = "NUM", nullable = true, length = 10)
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
    @Column(name = "FREQUENCY", nullable = true, length = 20)
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
    @Column(name = "ONE_SIZE", nullable = true)
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
    @Column(name = "MET_UNIT", nullable = true, length = 20)
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
    @Column(name = "WAY", nullable = true, length = 50)
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
    @Column(name = "SPECIAL_WAY", nullable = true, length = 50)
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
    @Column(name = "MYSLEF_AMT", nullable = true)
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
    @Column(name = "MYSLEF_SCAN", nullable = true)
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
    @Column(name = "GROUP_NO", nullable = true, length = 50)
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
    @Column(name = "GROUP_SORT", nullable = true, length = 10)
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