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

package com.lenovohit.hwe.pay.model;

import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import com.lenovohit.hwe.base.model.AuditableModel;

/**
 * PAY_CASH_BATCH
 * 
 * @author zyus
 * @version 1.0.0 2017-12-22
 */
@Entity
@Table(name = "PAY_CASH_BATCH")
public class CashBatch extends AuditableModel implements java.io.Serializable {
    /** 版本号 */
    private static final long serialVersionUID = 3655251696801994332L;

    /** batchNo */
    private String batchNo;

    /** printTime */
    private Date printTime;

    /** importTime */
    private Date importTime;

    /** count */
    private Integer count;

    /** amt */
    private BigDecimal amt;

    /** machineId */
    private String machineId;

    /** machineCode */
    private String machineCode;

    /** machineMac */
    private String machineMac;

    /** machineName */
    private String machineName;

    /** batchDay */
    private String batchDay;

    /** bankAmt */
    private BigDecimal bankAmt;

    /** bankCount */
    private Integer bankCount;

    /** amt1 */
    private BigDecimal amt1;

    /** amt2 */
    private BigDecimal amt2;

    /** amt5 */
    private BigDecimal amt5;

    /** amt10 */
    private BigDecimal amt10;

    /** amt20 */
    private BigDecimal amt20;

    /** amt50 */
    private BigDecimal amt50;

    /** amt100 */
    private BigDecimal amt100;

    /** count1 */
    private Integer count1;

    /** count2 */
    private Integer count2;

    /** count5 */
    private Integer count5;

    /** count10 */
    private Integer count10;

    /** count20 */
    private Integer count20;

    /** count50 */
    private Integer count50;

    /** count100 */
    private Integer count100;

    /** A - 初始
            0 - 正常
            1 - 废弃 */
    private String status;

    /**
     * 获取batchNo
     * 
     * @return batchNo
     */
    @Column(name = "BATCH_NO", nullable = true, length = 16)
    public String getBatchNo() {
        return this.batchNo;
    }

    /**
     * 设置batchNo
     * 
     * @param batchNo
     */
    public void setBatchNo(String batchNo) {
        this.batchNo = batchNo;
    }

    /**
     * 获取printTime
     * 
     * @return printTime
     */
    @Column(name = "PRINT_TIME", nullable = true)
    public Date getPrintTime() {
        return this.printTime;
    }

    /**
     * 设置printTime
     * 
     * @param printTime
     */
    public void setPrintTime(Date printTime) {
        this.printTime = printTime;
    }

    /**
     * 获取importTime
     * 
     * @return importTime
     */
    @Column(name = "IMPORT_TIME", nullable = true)
    public Date getImportTime() {
        return this.importTime;
    }

    /**
     * 设置importTime
     * 
     * @param importTime
     */
    public void setImportTime(Date importTime) {
        this.importTime = importTime;
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
     * 获取amt
     * 
     * @return amt
     */
    @Column(name = "AMT", nullable = true)
    public BigDecimal getAmt() {
        return this.amt;
    }

    /**
     * 设置amt
     * 
     * @param amt
     */
    public void setAmt(BigDecimal amt) {
        this.amt = amt;
    }

    /**
     * 获取machineId
     * 
     * @return machineId
     */
    @Column(name = "MACHINE_ID", nullable = true, length = 32)
    public String getMachineId() {
        return this.machineId;
    }

    /**
     * 设置machineId
     * 
     * @param machineId
     */
    public void setMachineId(String machineId) {
        this.machineId = machineId;
    }

    /**
     * 获取machineCode
     * 
     * @return machineCode
     */
    @Column(name = "MACHINE_CODE", nullable = true, length = 20)
    public String getMachineCode() {
        return this.machineCode;
    }

    /**
     * 设置machineCode
     * 
     * @param machineCode
     */
    public void setMachineCode(String machineCode) {
        this.machineCode = machineCode;
    }

    /**
     * 获取machineMac
     * 
     * @return machineMac
     */
    @Column(name = "MACHINE_MAC", nullable = true, length = 28)
    public String getMachineMac() {
        return this.machineMac;
    }

    /**
     * 设置machineMac
     * 
     * @param machineMac
     */
    public void setMachineMac(String machineMac) {
        this.machineMac = machineMac;
    }

    /**
     * 获取machineName
     * 
     * @return machineName
     */
    @Column(name = "MACHINE_NAME", nullable = true, length = 20)
    public String getMachineName() {
        return this.machineName;
    }

    /**
     * 设置machineName
     * 
     * @param machineName
     */
    public void setMachineName(String machineName) {
        this.machineName = machineName;
    }

    /**
     * 获取batchDay
     * 
     * @return batchDay
     */
    @Column(name = "BATCH_DAY", nullable = true, length = 20)
    public String getBatchDay() {
        return this.batchDay;
    }

    /**
     * 设置batchDay
     * 
     * @param batchDay
     */
    public void setBatchDay(String batchDay) {
        this.batchDay = batchDay;
    }

    /**
     * 获取bankAmt
     * 
     * @return bankAmt
     */
    @Column(name = "BANK_AMT", nullable = true)
    public BigDecimal getBankAmt() {
        return this.bankAmt;
    }

    /**
     * 设置bankAmt
     * 
     * @param bankAmt
     */
    public void setBankAmt(BigDecimal bankAmt) {
        this.bankAmt = bankAmt;
    }

    /**
     * 获取bankCount
     * 
     * @return bankCount
     */
    @Column(name = "BANK_COUNT", nullable = true, length = 10)
    public Integer getBankCount() {
        return this.bankCount;
    }

    /**
     * 设置bankCount
     * 
     * @param bankCount
     */
    public void setBankCount(Integer bankCount) {
        this.bankCount = bankCount;
    }

    /**
     * 获取amt1
     * 
     * @return amt1
     */
    @Column(name = "AMT1", nullable = true)
    public BigDecimal getAmt1() {
        return this.amt1;
    }

    /**
     * 设置amt1
     * 
     * @param amt1
     */
    public void setAmt1(BigDecimal amt1) {
        this.amt1 = amt1;
    }

    /**
     * 获取amt2
     * 
     * @return amt2
     */
    @Column(name = "AMT2", nullable = true)
    public BigDecimal getAmt2() {
        return this.amt2;
    }

    /**
     * 设置amt2
     * 
     * @param amt2
     */
    public void setAmt2(BigDecimal amt2) {
        this.amt2 = amt2;
    }

    /**
     * 获取amt5
     * 
     * @return amt5
     */
    @Column(name = "AMT5", nullable = true)
    public BigDecimal getAmt5() {
        return this.amt5;
    }

    /**
     * 设置amt5
     * 
     * @param amt5
     */
    public void setAmt5(BigDecimal amt5) {
        this.amt5 = amt5;
    }

    /**
     * 获取amt10
     * 
     * @return amt10
     */
    @Column(name = "AMT10", nullable = true)
    public BigDecimal getAmt10() {
        return this.amt10;
    }

    /**
     * 设置amt10
     * 
     * @param amt10
     */
    public void setAmt10(BigDecimal amt10) {
        this.amt10 = amt10;
    }

    /**
     * 获取amt20
     * 
     * @return amt20
     */
    @Column(name = "AMT20", nullable = true)
    public BigDecimal getAmt20() {
        return this.amt20;
    }

    /**
     * 设置amt20
     * 
     * @param amt20
     */
    public void setAmt20(BigDecimal amt20) {
        this.amt20 = amt20;
    }

    /**
     * 获取amt50
     * 
     * @return amt50
     */
    @Column(name = "AMT50", nullable = true)
    public BigDecimal getAmt50() {
        return this.amt50;
    }

    /**
     * 设置amt50
     * 
     * @param amt50
     */
    public void setAmt50(BigDecimal amt50) {
        this.amt50 = amt50;
    }

    /**
     * 获取amt100
     * 
     * @return amt100
     */
    @Column(name = "AMT100", nullable = true)
    public BigDecimal getAmt100() {
        return this.amt100;
    }

    /**
     * 设置amt100
     * 
     * @param amt100
     */
    public void setAmt100(BigDecimal amt100) {
        this.amt100 = amt100;
    }

    /**
     * 获取count1
     * 
     * @return count1
     */
    @Column(name = "COUNT1", nullable = true, length = 10)
    public Integer getCount1() {
        return this.count1;
    }

    /**
     * 设置count1
     * 
     * @param count1
     */
    public void setCount1(Integer count1) {
        this.count1 = count1;
    }

    /**
     * 获取count2
     * 
     * @return count2
     */
    @Column(name = "COUNT2", nullable = true, length = 10)
    public Integer getCount2() {
        return this.count2;
    }

    /**
     * 设置count2
     * 
     * @param count2
     */
    public void setCount2(Integer count2) {
        this.count2 = count2;
    }

    /**
     * 获取count5
     * 
     * @return count5
     */
    @Column(name = "COUNT5", nullable = true, length = 10)
    public Integer getCount5() {
        return this.count5;
    }

    /**
     * 设置count5
     * 
     * @param count5
     */
    public void setCount5(Integer count5) {
        this.count5 = count5;
    }

    /**
     * 获取count10
     * 
     * @return count10
     */
    @Column(name = "COUNT10", nullable = true, length = 10)
    public Integer getCount10() {
        return this.count10;
    }

    /**
     * 设置count10
     * 
     * @param count10
     */
    public void setCount10(Integer count10) {
        this.count10 = count10;
    }

    /**
     * 获取count20
     * 
     * @return count20
     */
    @Column(name = "COUNT20", nullable = true, length = 10)
    public Integer getCount20() {
        return this.count20;
    }

    /**
     * 设置count20
     * 
     * @param count20
     */
    public void setCount20(Integer count20) {
        this.count20 = count20;
    }

    /**
     * 获取count50
     * 
     * @return count50
     */
    @Column(name = "COUNT50", nullable = true, length = 10)
    public Integer getCount50() {
        return this.count50;
    }

    /**
     * 设置count50
     * 
     * @param count50
     */
    public void setCount50(Integer count50) {
        this.count50 = count50;
    }

    /**
     * 获取count100
     * 
     * @return count100
     */
    @Column(name = "COUNT100", nullable = true, length = 10)
    public Integer getCount100() {
        return this.count100;
    }

    /**
     * 设置count100
     * 
     * @param count100
     */
    public void setCount100(Integer count100) {
        this.count100 = count100;
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