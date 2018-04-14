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
 * BASE_NEWS
 * 
 * @author zyus
 * @version 1.0.0 2017-12-14
 */
@Entity
@Table(name = "BASE_NEWS")
public class News extends AuditableModel implements java.io.Serializable {
    /** 版本号 */
    private static final long serialVersionUID = -8886424861980425646L;

    /** 机构id(医院ID) */
    private String fkId;

    /** H1 - 院报
            H2 - 特色
            H3 - 政策信息
            H4 - 健康指导
            HA - 广告 */
    private String fkType;

    /** caption */
    private String caption;

    /** digest */
    private String digest;

    /** body */
    private String body;

    /** image */
    private String image;

    /** feededBy */
    private String feededBy;

    /** A - 初始
            0 - 正常
            1 - 下线
            9 - 关闭 */
    private String status;

    /**
     * 获取机构id(医院ID)
     * 
     * @return 机构id(医院ID)
     */
    @Column(name = "FK_ID", nullable = true, length = 32)
    public String getFkId() {
        return this.fkId;
    }

    /**
     * 设置机构id(医院ID)
     * 
     * @param fkId
     *          机构id(医院ID)
     */
    public void setFkId(String fkId) {
        this.fkId = fkId;
    }

    /**
     * 获取H1 - 院报
            H2 - 特色
            H3 - 政策信息
            H4 - 健康指导
            HA - 广告
     * 
     * @return H1 - 院报
            H2 - 特色
            H3 - 政策信息
            H4 - 健康指导
            HA - 广告
     */
    @Column(name = "FK_TYPE", nullable = false, length = 20)
    public String getFkType() {
        return this.fkType;
    }

    /**
     * 设置H1 - 院报
            H2 - 特色
            H3 - 政策信息
            H4 - 健康指导
            HA - 广告
     * 
     * @param fkType
     *          H1 - 院报
            H2 - 特色
            H3 - 政策信息
            H4 - 健康指导
            HA - 广告
     */
    public void setFkType(String fkType) {
        this.fkType = fkType;
    }

    /**
     * 获取caption
     * 
     * @return caption
     */
    @Column(name = "CAPTION", nullable = false, length = 100)
    public String getCaption() {
        return this.caption;
    }

    /**
     * 设置caption
     * 
     * @param caption
     */
    public void setCaption(String caption) {
        this.caption = caption;
    }

    /**
     * 获取digest
     * 
     * @return digest
     */
    @Column(name = "DIGEST", nullable = true, length = 300)
    public String getDigest() {
        return this.digest;
    }

    /**
     * 设置digest
     * 
     * @param digest
     */
    public void setDigest(String digest) {
        this.digest = digest;
    }

    /**
     * 获取body
     * 
     * @return body
     */
    @Column(name = "BODY")
    public String getBody() {
        return this.body;
    }

    /**
     * 设置body
     * 
     * @param body
     */
    public void setBody(String body) {
        this.body = body;
    }

    /**
     * 获取image
     * 
     * @return image
     */
    @Column(name = "IMAGE", nullable = false, length = 100)
    public String getImage() {
        return this.image;
    }

    /**
     * 设置image
     * 
     * @param image
     */
    public void setImage(String image) {
        this.image = image;
    }

    /**
     * 获取feededBy
     * 
     * @return feededBy
     */
    @Column(name = "FEEDED_BY", nullable = true, length = 50)
    public String getFeededBy() {
        return this.feededBy;
    }

    /**
     * 设置feededBy
     * 
     * @param feededBy
     */
    public void setFeededBy(String feededBy) {
        this.feededBy = feededBy;
    }

    /**
     * 获取A - 初始
            0 - 正常
            1 - 下线
            9 - 关闭
     * 
     * @return A - 初始
            0 - 正常
            1 - 下线
            9 - 关闭
     */
    @Column(name = "STATUS", nullable = false, length = 1)
    public String getStatus() {
        return this.status;
    }

    /**
     * 设置A - 初始
            0 - 正常
            1 - 下线
            9 - 关闭
     * 
     * @param status
     *          A - 初始
            0 - 正常
            1 - 下线
            9 - 关闭
     */
    public void setStatus(String status) {
        this.status = status;
    }
}