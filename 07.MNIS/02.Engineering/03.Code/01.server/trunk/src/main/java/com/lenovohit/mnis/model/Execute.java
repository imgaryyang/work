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

import com.lenovohit.mnis.base.model.AuditableModel;
import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * MNIS_EXECUTE
 * 
 * @author zyus
 * @version 1.0.0 2018-01-31
 */
@Entity
@Table(name = "MNIS_EXECUTE")
public class Execute extends AuditableModel implements java.io.Serializable {
    /** 版本号 */
    private static final long serialVersionUID = -8023606830122850918L;

    /** 序号 */
    private Integer no;

    /** 院区 */
    private String hospitalAreaCode;

    /** 病区代码 */
    private String deptCode;

    /** 住院档案号 */
    private String inpatientNo;

    /** 住院ID */
    private String inpatientId;

    /** 1 输液医嘱；2 口服药；3 LIS项目 */
    private Integer type;

    /** HIS医嘱ID */
    private Integer proId;

    /** groupNo */
    private String groupNo;

    /** sortNo */
    private String sortNo;

    /** 医嘱名称（组套名称） */
    private String proName;

    /** 医嘱说明 */
    private String remark;

    /** 规格（试管） */
    private String specs;

    /** 用法（标本类型） */
    private String usages;

    /** 剂量 */
    private String dose;

    /** 频次 */
    private String freq;

    /** 数量 */
    private String quantity;

    /** 单位 */
    private String unit;

    /** 条码号 */
    private String barcode;

    /** 急诊：1是，2否 */
    private String emergency;

    /** 应执行时间 */
    private Date planTime;

    /** 执行人 */
    private String executeCode;

    /** 执行人姓名 */
    private String executeName;

    /** 执行时间 */
    private Date executeTime;

    /** 1 待执行；2已执行 */
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
     * 获取院区
     * 
     * @return 院区
     */
    public String getHospitalAreaCode() {
        return this.hospitalAreaCode;
    }

    /**
     * 设置院区
     * 
     * @param hospitalAreaCode
     *          院区
     */
    public void setHospitalAreaCode(String hospitalAreaCode) {
        this.hospitalAreaCode = hospitalAreaCode;
    }

    /**
     * 获取病区代码
     * 
     * @return 病区代码
     */
    public String getDeptCode() {
        return this.deptCode;
    }

    /**
     * 设置病区代码
     * 
     * @param deptCode
     *          病区代码
     */
    public void setDeptCode(String deptCode) {
        this.deptCode = deptCode;
    }

    /**
     * 获取住院档案号
     * 
     * @return 住院档案号
     */
    public String getInpatientNo() {
        return this.inpatientNo;
    }

    /**
     * 设置住院档案号
     * 
     * @param inpatientNo
     *          住院档案号
     */
    public void setInpatientNo(String inpatientNo) {
        this.inpatientNo = inpatientNo;
    }

    /**
     * 获取住院ID
     * 
     * @return 住院ID
     */
    public String getInpatientId() {
        return this.inpatientId;
    }

    /**
     * 设置住院ID
     * 
     * @param inpatientId
     *          住院ID
     */
    public void setInpatientId(String inpatientId) {
        this.inpatientId = inpatientId;
    }

    /**
     * 获取1 输液医嘱；2 口服药；3 LIS项目
     * 
     * @return 1 输液医嘱；2 口服药；3 LIS项目
     */
    public Integer getType() {
        return this.type;
    }

    /**
     * 设置1 输液医嘱；2 口服药；3 LIS项目
     * 
     * @param type
     *          1 输液医嘱；2 口服药；3 LIS项目
     */
    public void setType(Integer type) {
        this.type = type;
    }

    /**
     * 获取HIS医嘱ID
     * 
     * @return HIS医嘱ID
     */
    public Integer getProId() {
        return this.proId;
    }

    /**
     * 设置HIS医嘱ID
     * 
     * @param proId
     *          HIS医嘱ID
     */
    public void setProId(Integer proId) {
        this.proId = proId;
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
     * 获取sortNo
     * 
     * @return sortNo
     */
    public String getSortNo() {
        return this.sortNo;
    }

    /**
     * 设置sortNo
     * 
     * @param sortNo
     */
    public void setSortNo(String sortNo) {
        this.sortNo = sortNo;
    }

    /**
     * 获取医嘱名称（组套名称）
     * 
     * @return 医嘱名称（组套名称）
     */
    public String getProName() {
        return this.proName;
    }

    /**
     * 设置医嘱名称（组套名称）
     * 
     * @param proName
     *          医嘱名称（组套名称）
     */
    public void setProName(String proName) {
        this.proName = proName;
    }

    /**
     * 获取医嘱说明
     * 
     * @return 医嘱说明
     */
    public String getRemark() {
        return this.remark;
    }

    /**
     * 设置医嘱说明
     * 
     * @param remark
     *          医嘱说明
     */
    public void setRemark(String remark) {
        this.remark = remark;
    }

    /**
     * 获取规格（试管）
     * 
     * @return 规格（试管）
     */
    public String getSpecs() {
        return this.specs;
    }

    /**
     * 设置规格（试管）
     * 
     * @param specs
     *          规格（试管）
     */
    public void setSpecs(String specs) {
        this.specs = specs;
    }

    /**
     * 获取用法（标本类型）
     * 
     * @return 用法（标本类型）
     */
    public String getUsages() {
        return this.usages;
    }

    /**
     * 设置用法（标本类型）
     * 
     * @param usages
     *          用法（标本类型）
     */
    public void setUsages(String usages) {
        this.usages = usages;
    }

    /**
     * 获取剂量
     * 
     * @return 剂量
     */
    public String getDose() {
        return this.dose;
    }

    /**
     * 设置剂量
     * 
     * @param dose
     *          剂量
     */
    public void setDose(String dose) {
        this.dose = dose;
    }

    /**
     * 获取频次
     * 
     * @return 频次
     */
    public String getFreq() {
        return this.freq;
    }

    /**
     * 设置频次
     * 
     * @param freq
     *          频次
     */
    public void setFreq(String freq) {
        this.freq = freq;
    }

    /**
     * 获取数量
     * 
     * @return 数量
     */
    public String getQuantity() {
        return this.quantity;
    }

    /**
     * 设置数量
     * 
     * @param quantity
     *          数量
     */
    public void setQuantity(String quantity) {
        this.quantity = quantity;
    }

    /**
     * 获取单位
     * 
     * @return 单位
     */
    public String getUnit() {
        return this.unit;
    }

    /**
     * 设置单位
     * 
     * @param unit
     *          单位
     */
    public void setUnit(String unit) {
        this.unit = unit;
    }

    /**
     * 获取条码号
     * 
     * @return 条码号
     */
    public String getBarcode() {
        return this.barcode;
    }

    /**
     * 设置条码号
     * 
     * @param barcode
     *          条码号
     */
    public void setBarcode(String barcode) {
        this.barcode = barcode;
    }

    /**
     * 获取急诊：1是，2否
     * 
     * @return 急诊：1是
     */
    public String getEmergency() {
        return this.emergency;
    }

    /**
     * 设置急诊：1是，2否
     * 
     * @param emergency
     *          急诊：1是
     */
    public void setEmergency(String emergency) {
        this.emergency = emergency;
    }

    /**
     * 获取应执行时间
     * 
     * @return 应执行时间
     */
    public Date getPlanTime() {
        return this.planTime;
    }

    /**
     * 设置应执行时间
     * 
     * @param planTime
     *          应执行时间
     */
    public void setPlanTime(Date planTime) {
        this.planTime = planTime;
    }

    /**
     * 获取执行人
     * 
     * @return 执行人
     */
    public String getExecuteCode() {
        return this.executeCode;
    }

    /**
     * 设置执行人
     * 
     * @param executeCode
     *          执行人
     */
    public void setExecuteCode(String executeCode) {
        this.executeCode = executeCode;
    }

    /**
     * 获取执行人姓名
     * 
     * @return 执行人姓名
     */
    public String getExecuteName() {
        return this.executeName;
    }

    /**
     * 设置执行人姓名
     * 
     * @param executeName
     *          执行人姓名
     */
    public void setExecuteName(String executeName) {
        this.executeName = executeName;
    }

    /**
     * 获取执行时间
     * 
     * @return 执行时间
     */
    public Date getExecuteTime() {
        return this.executeTime;
    }

    /**
     * 设置执行时间
     * 
     * @param executeTime
     *          执行时间
     */
    public void setExecuteTime(Date executeTime) {
        this.executeTime = executeTime;
    }

    /**
     * 获取1 待执行；2已执行
     * 
     * @return 1 待执行；2已执行
     */
    public String getStatus() {
        return this.status;
    }

    /**
     * 设置1 待执行；2已执行
     * 
     * @param status
     *          1 待执行；2已执行
     */
    public void setStatus(String status) {
        this.status = status;
    }
}