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
 * PAY_CASH_ERROR
 * 
 * @author zyus
 * @version 1.0.0 2017-12-22
 */
@Entity
@Table(name = "PAY_CASH_ERROR")
public class CashError extends AuditableModel implements java.io.Serializable {
    /** 版本号 */
    private static final long serialVersionUID = -7199491244543238242L;

    /** ret */
    private String ret;

    /** msg */
    private String msg;

    /** appChannel */
    private String appChannel;

    /** appId */
    private String appId;

    /** appName */
    private String appName;

    /** machineId */
    private String machineId;

    /** machineCode */
    private String machineCode;

    /** machineMac */
    private String machineMac;

    /** machineName */
    private String machineName;

    /** userId */
    private String userId;

    /** userCode */
    private String userCode;

    /** userName */
    private String userName;

    /** profileId */
    private String profileId;

    /** profileNo */
    private String profileNo;

    /** profileName */
    private String profileName;

    /** orderId */
    private String orderId;

    /** orderNo */
    private String orderNo;

    /** settleId */
    private String settleId;

    /** settleNo */
    private String settleNo;

    /**
     * 获取ret
     * 
     * @return ret
     */
    @Column(name = "RET", nullable = true, length = 20)
    public String getRet() {
        return this.ret;
    }

    /**
     * 设置ret
     * 
     * @param ret
     */
    public void setRet(String ret) {
        this.ret = ret;
    }

    /**
     * 获取msg
     * 
     * @return msg
     */
    @Column(name = "MSG", nullable = true, length = 500)
    public String getMsg() {
        return this.msg;
    }

    /**
     * 设置msg
     * 
     * @param msg
     */
    public void setMsg(String msg) {
        this.msg = msg;
    }

    /**
     * 获取appChannel
     * 
     * @return appChannel
     */
    @Column(name = "APP_CHANNEL", nullable = true, length = 2)
    public String getAppChannel() {
        return this.appChannel;
    }

    /**
     * 设置appChannel
     * 
     * @param appChannel
     */
    public void setAppChannel(String appChannel) {
        this.appChannel = appChannel;
    }

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
     * 获取appName
     * 
     * @return appName
     */
    @Column(name = "APP_NAME", nullable = true, length = 50)
    public String getAppName() {
        return this.appName;
    }

    /**
     * 设置appName
     * 
     * @param appName
     */
    public void setAppName(String appName) {
        this.appName = appName;
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
    @Column(name = "MACHINE_MAC", nullable = true, length = 50)
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
    @Column(name = "MACHINE_NAME", nullable = true, length = 50)
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
     * 获取userId
     * 
     * @return userId
     */
    @Column(name = "USER_ID", nullable = true, length = 32)
    public String getUserId() {
        return this.userId;
    }

    /**
     * 设置userId
     * 
     * @param userId
     */
    public void setUserId(String userId) {
        this.userId = userId;
    }

    /**
     * 获取userCode
     * 
     * @return userCode
     */
    @Column(name = "USER_CODE", nullable = true, length = 50)
    public String getUserCode() {
        return this.userCode;
    }

    /**
     * 设置userCode
     * 
     * @param userCode
     */
    public void setUserCode(String userCode) {
        this.userCode = userCode;
    }

    /**
     * 获取userName
     * 
     * @return userName
     */
    @Column(name = "USER_NAME", nullable = true, length = 50)
    public String getUserName() {
        return this.userName;
    }

    /**
     * 设置userName
     * 
     * @param userName
     */
    public void setUserName(String userName) {
        this.userName = userName;
    }

    /**
     * 获取profileId
     * 
     * @return profileId
     */
    @Column(name = "PROFILE_ID", nullable = true, length = 32)
    public String getProfileId() {
        return this.profileId;
    }

    /**
     * 设置profileId
     * 
     * @param profileId
     */
    public void setProfileId(String profileId) {
        this.profileId = profileId;
    }

    /**
     * 获取profileNo
     * 
     * @return profileNo
     */
    @Column(name = "PROFILE_NO", nullable = true, length = 50)
    public String getProfileNo() {
        return this.profileNo;
    }

    /**
     * 设置profileNo
     * 
     * @param profileNo
     */
    public void setProfileNo(String profileNo) {
        this.profileNo = profileNo;
    }

    /**
     * 获取profileName
     * 
     * @return profileName
     */
    @Column(name = "PROFILE_NAME", nullable = true, length = 50)
    public String getProfileName() {
        return this.profileName;
    }

    /**
     * 设置profileName
     * 
     * @param profileName
     */
    public void setProfileName(String profileName) {
        this.profileName = profileName;
    }

    /**
     * 获取orderId
     * 
     * @return orderId
     */
    @Column(name = "ORDER_ID", nullable = true, length = 32)
    public String getOrderId() {
        return this.orderId;
    }

    /**
     * 设置orderId
     * 
     * @param orderId
     */
    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    /**
     * 获取orderNo
     * 
     * @return orderNo
     */
    @Column(name = "ORDER_NO", nullable = true, length = 50)
    public String getOrderNo() {
        return this.orderNo;
    }

    /**
     * 设置orderNo
     * 
     * @param orderNo
     */
    public void setOrderNo(String orderNo) {
        this.orderNo = orderNo;
    }

    /**
     * 获取settleId
     * 
     * @return settleId
     */
    @Column(name = "SETTLE_ID", nullable = true, length = 32)
    public String getSettleId() {
        return this.settleId;
    }

    /**
     * 设置settleId
     * 
     * @param settleId
     */
    public void setSettleId(String settleId) {
        this.settleId = settleId;
    }

    /**
     * 获取settleNo
     * 
     * @return settleNo
     */
    @Column(name = "SETTLE_NO", nullable = true, length = 50)
    public String getSettleNo() {
        return this.settleNo;
    }

    /**
     * 设置settleNo
     * 
     * @param settleNo
     */
    public void setSettleNo(String settleNo) {
        this.settleNo = settleNo;
    }
}