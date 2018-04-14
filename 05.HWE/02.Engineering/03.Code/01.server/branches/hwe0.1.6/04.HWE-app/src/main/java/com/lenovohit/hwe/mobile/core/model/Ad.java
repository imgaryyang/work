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

package com.lenovohit.hwe.mobile.core.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import com.lenovohit.hwe.base.model.AuditableModel;

/**
 * APP_AD
 * 
 * @author zyus
 * @version 1.0.0 2017-12-14
 */
@Entity
@Table(name = "APP_AD")
public class Ad extends AuditableModel implements java.io.Serializable {
    /** 版本号 */
    private static final long serialVersionUID = -867722878297738196L;

    /** adPosId */
    private String adPosId;

    /** image */
    private String image;

    /** memo */
    private String memo;

    /** sort */
    private Integer sort;

    /** linkArticle */
    private String linkArticle;

    /** article */
    private String article;

    /** A - 初始
            0 - 正常
            1 - 冻结 */
    private String status;

    /**
     * 获取adPosId
     * 
     * @return adPosId
     */
    @Column(name = "AD_POS_ID", nullable = true, length = 32)
    public String getAdPosId() {
        return this.adPosId;
    }

    /**
     * 设置adPosId
     * 
     * @param adPosId
     */
    public void setAdPosId(String adPosId) {
        this.adPosId = adPosId;
    }

    /**
     * 获取image
     * 
     * @return image
     */
    @Column(name = "IMAGE", nullable = true, length = 100)
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
     * 获取memo
     * 
     * @return memo
     */
    @Column(name = "MEMO", nullable = true, length = 100)
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
     * 获取sort
     * 
     * @return sort
     */
    @Column(name = "SORT", nullable = true, length = 10)
    public Integer getSort() {
        return this.sort;
    }

    /**
     * 设置sort
     * 
     * @param sort
     */
    public void setSort(Integer sort) {
        this.sort = sort;
    }

    /**
     * 获取linkArticle
     * 
     * @return linkArticle
     */
    @Column(name = "LINK_ARTICLE", nullable = true, length = 1)
    public String getLinkArticle() {
        return this.linkArticle;
    }

    /**
     * 设置linkArticle
     * 
     * @param linkArticle
     */
    public void setLinkArticle(String linkArticle) {
        this.linkArticle = linkArticle;
    }

    /**
     * 获取article
     * 
     * @return article
     */
    @Column(name = "ARTICLE", nullable = true, length = 32)
    public String getArticle() {
        return this.article;
    }

    /**
     * 设置article
     * 
     * @param article
     */
    public void setArticle(String article) {
        this.article = article;
    }

    /**
     * 获取A - 初始
            0 - 正常
            1 - 冻结
     * 
     * @return A - 初始
            0 - 正常
            1 - 冻结
     */
    @Column(name = "STATUS", nullable = true, length = 1)
    public String getStatus() {
        return this.status;
    }

    /**
     * 设置A - 初始
            0 - 正常
            1 - 冻结
     * 
     * @param status
     *          A - 初始
            0 - 正常
            1 - 冻结
     */
    public void setStatus(String status) {
        this.status = status;
    }
}