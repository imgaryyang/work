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
 * TREAT_TEST_DETAIL
 * 
 * @author zyus
 * @version 1.0.0 2017-12-16
 */
@Entity
@Table(name = "TREAT_TEST_DETAIL")
public class TestDetail extends AuditableModel implements java.io.Serializable {
    /** 版本号 */
    private static final long serialVersionUID = 3077345804976891816L;

    /** testId */
    private String testId;

    /** subjectCode */
    private String subjectCode;

    /** subject */
    private String subject;

    /** result */
    private String result;

    /** flag */
    private String flag;

    /** unit */
    private String unit;

    /** reference */
    private String reference;

    /** status */
    private String status;

    /**
     * 获取testId
     * 
     * @return testId
     */
    @Column(name = "TEST_ID", nullable = true, length = 32)
    public String getTestId() {
        return this.testId;
    }

    /**
     * 设置testId
     * 
     * @param testId
     */
    public void setTestId(String testId) {
        this.testId = testId;
    }

    /**
     * 获取subjectCode
     * 
     * @return subjectCode
     */
    @Column(name = "SUBJECT_CODE", nullable = true, length = 50)
    public String getSubjectCode() {
        return this.subjectCode;
    }

    /**
     * 设置subjectCode
     * 
     * @param subjectCode
     */
    public void setSubjectCode(String subjectCode) {
        this.subjectCode = subjectCode;
    }

    /**
     * 获取subject
     * 
     * @return subject
     */
    @Column(name = "SUBJECT", nullable = true, length = 100)
    public String getSubject() {
        return this.subject;
    }

    /**
     * 设置subject
     * 
     * @param subject
     */
    public void setSubject(String subject) {
        this.subject = subject;
    }

    /**
     * 获取result
     * 
     * @return result
     */
    @Column(name = "RESULT", nullable = true, length = 50)
    public String getResult() {
        return this.result;
    }

    /**
     * 设置result
     * 
     * @param result
     */
    public void setResult(String result) {
        this.result = result;
    }

    /**
     * 获取flag
     * 
     * @return flag
     */
    @Column(name = "FLAG", nullable = true, length = 1)
    public String getFlag() {
        return this.flag;
    }

    /**
     * 设置flag
     * 
     * @param flag
     */
    public void setFlag(String flag) {
        this.flag = flag;
    }

    /**
     * 获取unit
     * 
     * @return unit
     */
    @Column(name = "UNIT", nullable = true, length = 50)
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
     * 获取reference
     * 
     * @return reference
     */
    @Column(name = "REFERENCE", nullable = true, length = 50)
    public String getReference() {
        return this.reference;
    }

    /**
     * 设置reference
     * 
     * @param reference
     */
    public void setReference(String reference) {
        this.reference = reference;
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