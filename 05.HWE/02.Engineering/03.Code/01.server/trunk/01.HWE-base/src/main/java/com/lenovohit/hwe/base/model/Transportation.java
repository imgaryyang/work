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

package com.lenovohit.hwe.base.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * BASE_TRANSPORTATION
 * 
 * @author zyus
 * @version 1.0.0 2017-12-14
 */
@Entity
@Table(name = "BASE_TRANSPORTATION")
public class Transportation extends AuditableModel implements java.io.Serializable {
    /** 版本号 */
    private static final long serialVersionUID = -2562501894721356676L;

    /** fkId */
    private String fkId;

    /** fkType */
    private String fkType;

    /** 1 - 公交
            2 - 地铁
            3 - 火车
            4 - 飞机
            9 - 其他 */
    private String type;

    /** content */
    private String content;

    /** memo */
    private String memo;

    /** A - 初始
            0 - 正常
            1 - 废弃 */
    private String status;

    /**
     * 获取fkId
     * 
     * @return fkId
     */
    @Column(name = "FK_ID", nullable = false, length = 32)
    public String getFkId() {
        return this.fkId;
    }

    /**
     * 设置fkId
     * 
     * @param fkId
     */
    public void setFkId(String fkId) {
        this.fkId = fkId;
    }

    /**
     * 获取fkType
     * 
     * @return fkType
     */
    @Column(name = "FK_TYPE", nullable = true, length = 10)
    public String getFkType() {
        return this.fkType;
    }

    /**
     * 设置fkType
     * 
     * @param fkType
     */
    public void setFkType(String fkType) {
        this.fkType = fkType;
    }

    /**
     * 获取1 - 公交
            2 - 地铁
            3 - 火车
            4 - 飞机
            9 - 其他
     * 
     * @return 1 - 公交
            2 - 地铁
            3 - 火车
            4 - 飞机
            9 - 其他
     */
    @Column(name = "TYPE", nullable = false, length = 1)
    public String getType() {
        return this.type;
    }

    /**
     * 设置1 - 公交
            2 - 地铁
            3 - 火车
            4 - 飞机
            9 - 其他
     * 
     * @param type
     *          1 - 公交
            2 - 地铁
            3 - 火车
            4 - 飞机
            9 - 其他
     */
    public void setType(String type) {
        this.type = type;
    }

    /**
     * 获取content
     * 
     * @return content
     */
    @Column(name = "CONTENT", nullable = false, length = 50)
    public String getContent() {
        return this.content;
    }

    /**
     * 设置content
     * 
     * @param content
     */
    public void setContent(String content) {
        this.content = content;
    }

    /**
     * 获取memo
     * 
     * @return memo
     */
    @Column(name = "MEMO", nullable = true, length = 255)
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