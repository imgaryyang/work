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

package com.lenovohit.hwe.mobile.app.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import com.lenovohit.hwe.base.model.AuditableModel;

/**
 * APP_MENU
 * 
 * @author zyus
 * @version 1.0.0 2017-12-14
 */
@Entity
@Table(name = "APP_MENU")
public class AppMenu extends AuditableModel implements java.io.Serializable {
    /** 版本号 */
    private static final long serialVersionUID = 5123120272341522921L;

    /** appId */
    private String appId;

    /** code */
    private String code;

    /** text */
    private String text;

    /** textSize */
    private String textSize;

    /** textColor */
    private String textColor;

    /** icon */
    private String icon;

    /** iconSize */
    private String iconSize;

    /** iconColor */
    private String iconColor;

    /** image */
    private String image;

    /** imageResolution */
    private String imageResolution;

    /** conponent */
    private String conponent;

    /** onClick */
    private String onClick;

    /** A - 初始
            0 - 正常
            1 - 冻结 */
    private String status;

    /**
     * 获取appId
     * 
     * @return appId
     */
    @Column(name = "APP_ID", nullable = true, length = 32)
    public String getAppId() {
        return this.appId;
    }

    /**
     * 设置appId
     * 
     * @param appId
     */
    public void setAppId(String appId) {
        this.appId = appId;
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
     * 获取text
     * 
     * @return text
     */
    @Column(name = "TEXT", nullable = true, length = 20)
    public String getText() {
        return this.text;
    }

    /**
     * 设置text
     * 
     * @param text
     */
    public void setText(String text) {
        this.text = text;
    }

    /**
     * 获取textSize
     * 
     * @return textSize
     */
    @Column(name = "TEXT_SIZE", nullable = true, length = 3)
    public String getTextSize() {
        return this.textSize;
    }

    /**
     * 设置textSize
     * 
     * @param textSize
     */
    public void setTextSize(String textSize) {
        this.textSize = textSize;
    }

    /**
     * 获取textColor
     * 
     * @return textColor
     */
    @Column(name = "TEXT_COLOR", nullable = true, length = 40)
    public String getTextColor() {
        return this.textColor;
    }

    /**
     * 设置textColor
     * 
     * @param textColor
     */
    public void setTextColor(String textColor) {
        this.textColor = textColor;
    }

    /**
     * 获取icon
     * 
     * @return icon
     */
    @Column(name = "ICON", nullable = true, length = 50)
    public String getIcon() {
        return this.icon;
    }

    /**
     * 设置icon
     * 
     * @param icon
     */
    public void setIcon(String icon) {
        this.icon = icon;
    }

    /**
     * 获取iconSize
     * 
     * @return iconSize
     */
    @Column(name = "ICON_SIZE", nullable = true, length = 3)
    public String getIconSize() {
        return this.iconSize;
    }

    /**
     * 设置iconSize
     * 
     * @param iconSize
     */
    public void setIconSize(String iconSize) {
        this.iconSize = iconSize;
    }

    /**
     * 获取iconColor
     * 
     * @return iconColor
     */
    @Column(name = "ICON_COLOR", nullable = true, length = 40)
    public String getIconColor() {
        return this.iconColor;
    }

    /**
     * 设置iconColor
     * 
     * @param iconColor
     */
    public void setIconColor(String iconColor) {
        this.iconColor = iconColor;
    }

    /**
     * 获取image
     * 
     * @return image
     */
    @Column(name = "IMAGE", nullable = true, length = 200)
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
     * 获取imageResolution
     * 
     * @return imageResolution
     */
    @Column(name = "IMAGE_RESOLUTION", nullable = true, length = 50)
    public String getImageResolution() {
        return this.imageResolution;
    }

    /**
     * 设置imageResolution
     * 
     * @param imageResolution
     */
    public void setImageResolution(String imageResolution) {
        this.imageResolution = imageResolution;
    }

    /**
     * 获取conponent
     * 
     * @return conponent
     */
    @Column(name = "CONPONENT", nullable = true, length = 30)
    public String getConponent() {
        return this.conponent;
    }

    /**
     * 设置conponent
     * 
     * @param conponent
     */
    public void setConponent(String conponent) {
        this.conponent = conponent;
    }

    /**
     * 获取onClick
     * 
     * @return onClick
     */
    @Column(name = "ON_CLICK", nullable = true, length = 30)
    public String getOnClick() {
        return this.onClick;
    }

    /**
     * 设置onClick
     * 
     * @param onClick
     */
    public void setOnClick(String onClick) {
        this.onClick = onClick;
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