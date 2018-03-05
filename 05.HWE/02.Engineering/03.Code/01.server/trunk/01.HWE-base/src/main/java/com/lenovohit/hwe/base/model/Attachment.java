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
 * BASE_ATTACHMENT
 * 
 * @author zyus
 * @version 1.0.0 2017-12-14
 */
@Entity
@Table(name = "BASE_ATTACHMENT")
public class Attachment extends AuditableModel implements java.io.Serializable {
    /** 版本号 */
    private static final long serialVersionUID = 6074887862014154259L;

    /** fkId */
    private String fkId;

    /** fkType */
    private String fkType;

    /** memo */
    private String memo;

    /** path */
    private String path;

    /** fileName */
    private String fileName;

    /** extName */
    private String extName;

    /** 同一业务有多个图片时，如果需要对图片显示进行排序，则在此记录排列顺序。 */
    private Integer sort;

    /** A - 初始
            0 - 正常
            1 - 废弃 */
    private String status;

    /**
     * 获取fkId
     * 
     * @return fkId
     */
    @Column(name = "FK_ID", nullable = true, length = 32)
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
    @Column(name = "FK_TYPE", nullable = true, length = 2)
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
     * 获取memo
     * 
     * @return memo
     */
    @Column(name = "MEMO", nullable = true, length = 50)
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
     * 获取path
     * 
     * @return path
     */
    @Column(name = "PATH", nullable = true, length = 200)
    public String getPath() {
        return this.path;
    }

    /**
     * 设置path
     * 
     * @param path
     */
    public void setPath(String path) {
        this.path = path;
    }

    /**
     * 获取fileName
     * 
     * @return fileName
     */
    @Column(name = "FILE_NAME", nullable = true, length = 50)
    public String getFileName() {
        return this.fileName;
    }

    /**
     * 设置fileName
     * 
     * @param fileName
     */
    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    /**
     * 获取extName
     * 
     * @return extName
     */
    @Column(name = "EXT_NAME", nullable = true, length = 10)
    public String getExtName() {
        return this.extName;
    }

    /**
     * 设置extName
     * 
     * @param extName
     */
    public void setExtName(String extName) {
        this.extName = extName;
    }

    /**
     * 获取同一业务有多个图片时，如果需要对图片显示进行排序，则在此记录排列顺序。
     * 
     * @return 同一业务有多个图片时
     */
    @Column(name = "SORT", nullable = true, length = 10)
    public Integer getSort() {
        return this.sort;
    }

    /**
     * 设置同一业务有多个图片时，如果需要对图片显示进行排序，则在此记录排列顺序。
     * 
     * @param sort
     *          同一业务有多个图片时
     */
    public void setSort(Integer sort) {
        this.sort = sort;
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