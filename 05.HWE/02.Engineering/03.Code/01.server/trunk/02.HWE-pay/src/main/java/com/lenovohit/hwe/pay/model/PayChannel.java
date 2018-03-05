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

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import com.lenovohit.hwe.base.model.AuditableModel;

/**
 * PAY_CHANNEL
 * 
 * @author zyus
 * @version 1.0.0 2018-01-12
 */
@Entity
@Table(name = "PAY_CHANNEL")
public class PayChannel extends AuditableModel implements java.io.Serializable {
    /** 版本号 */
    private static final long serialVersionUID = 4537836953223677560L;


	public static final String PAY_CODE_CASH = "0000";
	public static final String PAY_CODE_ALIPAY = "9999";
	public static final String PAY_CODE_WXPAY = "9998";
	
	
    /** name */
    private String name;

    /** code */
    private String code;

    /** phone */
    private String phone;

    /** email */
    private String email;

    /** qq */
    private String qq;

    /** memo */
    private String memo;

    /** A - 初始
            0 - 正式
            1 - 测试
            9 - 停用 */
    private String status;

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
     * 获取code
     * 
     * @return code
     */
    @Column(name = "CODE", nullable = true, length = 20)
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
     * 获取phone
     * 
     * @return phone
     */
    @Column(name = "PHONE", nullable = true, length = 20)
    public String getPhone() {
        return this.phone;
    }

    /**
     * 设置phone
     * 
     * @param phone
     */
    public void setPhone(String phone) {
        this.phone = phone;
    }

    /**
     * 获取email
     * 
     * @return email
     */
    @Column(name = "EMAIL", nullable = true, length = 50)
    public String getEmail() {
        return this.email;
    }

    /**
     * 设置email
     * 
     * @param email
     */
    public void setEmail(String email) {
        this.email = email;
    }

    /**
     * 获取qq
     * 
     * @return qq
     */
    @Column(name = "QQ", nullable = true, length = 20)
    public String getQq() {
        return this.qq;
    }

    /**
     * 设置qq
     * 
     * @param qq
     */
    public void setQq(String qq) {
        this.qq = qq;
    }

    /**
     * 获取memo
     * 
     * @return memo
     */
    @Column(name = "MEMO", nullable = true, length = 200)
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
            0 - 正式
            1 - 测试
            9 - 停用
     * 
     * @return A - 初始
            0 - 正式
            1 - 测试
            9 - 停用
     */
    @Column(name = "STATUS", nullable = true, length = 1)
    public String getStatus() {
        return this.status;
    }

    /**
     * 设置A - 初始
            0 - 正式
            1 - 测试
            9 - 停用
     * 
     * @param status
     *          A - 初始
            0 - 正式
            1 - 测试
            9 - 停用
     */
    public void setStatus(String status) {
        this.status = status;
    }
}