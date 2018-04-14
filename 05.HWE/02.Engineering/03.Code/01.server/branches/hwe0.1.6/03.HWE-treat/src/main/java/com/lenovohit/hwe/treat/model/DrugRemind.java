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
 * TREAT_DRUG_REMIND
 * 
 * @author zyus
 * @version 1.0.0 2017-12-16
 */
@Entity
@Table(name = "TREAT_DRUG_REMIND")
public class DrugRemind extends AuditableModel implements java.io.Serializable {
    /** 版本号 */
    private static final long serialVersionUID = 4931773867317385943L;

    /** drugName */
    private String drugName;

    /** useTime */
    private String useTime;

    /** dosage */
    private String dosage;

    /** frequency */
    private String frequency;

    /** startDate */
    private String startDate;

    /** endDate */
    private String endDate;

    /** remarks */
    private String remarks;

    /**
     * 获取drugName
     * 
     * @return drugName
     */
    @Column(name = "DRUG_NAME", nullable = true, length = 100)
    public String getDrugName() {
        return this.drugName;
    }

    /**
     * 设置drugName
     * 
     * @param drugName
     */
    public void setDrugName(String drugName) {
        this.drugName = drugName;
    }

    /**
     * 获取useTime
     * 
     * @return useTime
     */
    @Column(name = "USE_TIME", nullable = true, length = 8)
    public String getUseTime() {
        return this.useTime;
    }

    /**
     * 设置useTime
     * 
     * @param useTime
     */
    public void setUseTime(String useTime) {
        this.useTime = useTime;
    }

    /**
     * 获取dosage
     * 
     * @return dosage
     */
    @Column(name = "DOSAGE", nullable = true, length = 20)
    public String getDosage() {
        return this.dosage;
    }

    /**
     * 设置dosage
     * 
     * @param dosage
     */
    public void setDosage(String dosage) {
        this.dosage = dosage;
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
     * 获取startDate
     * 
     * @return startDate
     */
    @Column(name = "START_DATE", nullable = true, length = 10)
    public String getStartDate() {
        return this.startDate;
    }

    /**
     * 设置startDate
     * 
     * @param startDate
     */
    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    /**
     * 获取endDate
     * 
     * @return endDate
     */
    @Column(name = "END_DATE", nullable = true, length = 10)
    public String getEndDate() {
        return this.endDate;
    }

    /**
     * 设置endDate
     * 
     * @param endDate
     */
    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }

    /**
     * 获取remarks
     * 
     * @return remarks
     */
    @Column(name = "REMARKS", nullable = true, length = 200)
    public String getRemarks() {
        return this.remarks;
    }

    /**
     * 设置remarks
     * 
     * @param remarks
     */
    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}