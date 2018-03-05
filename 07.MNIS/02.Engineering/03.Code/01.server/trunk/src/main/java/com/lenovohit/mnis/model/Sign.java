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
 * MNIS_SIGN
 * 
 * @author zyus
 * @version 1.0.0 2018-01-31
 */
@Entity
@Table(name = "MNIS_SIGN")
public class Sign extends AuditableModel implements java.io.Serializable {
    /** 版本号 */
    private static final long serialVersionUID = 2823998961946110885L;

    /** 序号 */
    private Integer no;

    /** 院区代码 */
    private String hospitalAreaCode;

    /** 病区代码 */
    private String inpatientAreaCode;

    /** 住院档案号 */
    private String inpatientNo;

    /** 住院ID */
    private String inpatientId;

    /** 1 一般体征；2 自定义体征；3 事件 */
    private Integer type;

    /** 时间点 */
    private Date datePiont;

    /** 项目编码 */
    private String code;

    /** 项目名称 */
    private String name;

    /** 方法代码 */
    private String methCode;

    /** 方法名称 */
    private String methName;

    /** 项目内容 */
    private String input;

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
     * 获取病区代码
     * 
     * @return 病区代码
     */
    public String getInpatientAreaCode() {
        return this.inpatientAreaCode;
    }

    /**
     * 设置病区代码
     * 
     * @param inpatientAreaCode
     *          病区代码
     */
    public void setInpatientAreaCode(String inpatientAreaCode) {
        this.inpatientAreaCode = inpatientAreaCode;
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
     * 获取1 一般体征；2 自定义体征；3 事件
     * 
     * @return 1 一般体征；2 自定义体征；3 事件
     */
    public Integer getType() {
        return this.type;
    }

    /**
     * 设置1 一般体征；2 自定义体征；3 事件
     * 
     * @param type
     *          1 一般体征；2 自定义体征；3 事件
     */
    public void setType(Integer type) {
        this.type = type;
    }

    /**
     * 获取时间点
     * 
     * @return 时间点
     */
    public Date getDatePiont() {
        return this.datePiont;
    }

    /**
     * 设置时间点
     * 
     * @param datePiont
     *          时间点
     */
    public void setDatePiont(Date datePiont) {
        this.datePiont = datePiont;
    }

    /**
     * 获取项目编码
     * 
     * @return 项目编码
     */
    public String getCode() {
        return this.code;
    }

    /**
     * 设置项目编码
     * 
     * @param code
     *          项目编码
     */
    public void setCode(String code) {
        this.code = code;
    }

    /**
     * 获取项目名称
     * 
     * @return 项目名称
     */
    public String getName() {
        return this.name;
    }

    /**
     * 设置项目名称
     * 
     * @param name
     *          项目名称
     */
    public void setName(String name) {
        this.name = name;
    }

    /**
     * 获取方法代码
     * 
     * @return 方法代码
     */
    public String getMethCode() {
        return this.methCode;
    }

    /**
     * 设置方法代码
     * 
     * @param methCode
     *          方法代码
     */
    public void setMethCode(String methCode) {
        this.methCode = methCode;
    }

    /**
     * 获取方法名称
     * 
     * @return 方法名称
     */
    public String getMethName() {
        return this.methName;
    }

    /**
     * 设置方法名称
     * 
     * @param methName
     *          方法名称
     */
    public void setMethName(String methName) {
        this.methName = methName;
    }

    /**
     * 获取项目内容
     * 
     * @return 项目内容
     */
    public String getInput() {
        return this.input;
    }

    /**
     * 设置项目内容
     * 
     * @param input
     *          项目内容
     */
    public void setInput(String input) {
        this.input = input;
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