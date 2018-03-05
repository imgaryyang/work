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

package com.lenovohit.mnis.base.model;

import java.util.HashMap;
import java.util.Map;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;

/**
 * BASE_NOTICE
 * 
 * @author zyus
 * @version 1.0.0 2017-12-14
 */
@Entity
@Table(name = "BASE_NOTICE")
public class Notice extends AuditableModel implements java.io.Serializable {
	
	public static String NOT_STATUE_INIT = "0";
	public static String NOT_STATUE_SENT = "1";
	public static String NOT_STATUE_READ = "2";
	public static String NOT_STATUE_ANSWERED = "2";
	public static String NOT_STATUE_FAILED = "4";
	public static String NOT_STATUE_CLOSED = "9";
	

	public static String NOT_MODE_ALL = "0";
	public static String NOT_MODE_APP = "1";
	public static String NOT_MODE_WEB = "2";
	public static String NOT_MODE_MSG = "3";
	public static String NOT_MODE_MAIL = "4";
	public static String NOT_MODE_QQ = "5";
	public static String NOT_MODE_WX = "6";
	public static String NOT_MODE_OHTER = "9";
	
	
	public static String NOT_TYPE_SYS = "00";
	public static String NOT_TYPE_APP_PAY = "10";
	public static String NOT_TYPE_APP_GUI = "11";
	public static String NOT_TYPE_APP_SAL = "12";

	public static String NOT_TYPE_MSG_REG = "20";
	public static String NOT_TYPE_MSG_RET = "21";
	public static String NOT_TYPE_MSG_CHK = "22";
    /** 版本号 */
    private static final long serialVersionUID = -471516318495080938L;

    /** title */
    private String title;

    /** content */
    private String content;

    /** target */
    private String target;

    /** 系统公告
            00 - 系统公告
            应用通知
            10 - 支付通知
            11 - 导诊提醒
            12 - 工资通知
            短信
            20 - 注册验证
            21 - 找回密码
            22 - 验证码 */
    private String type;

    /** 0 - ALL
            1 - APP
            2 - WEB
            3 - MSG 
            4 - MAIL
            5 - QQ
            6 - WX
            9 - OTHER */
    private String mode;

    /** appChannel */
    private String appChannel;

    /** appId */
    private String appId;

    /** 0 - 所有
            1 - 用户
            2 - 组别
            
             */
    private String receiverType;

    /** receiverValue */
    private String receiverValue;

    /** orgId */
    private String orgId;

    /** orgName */
    private String orgName;

    /** memo */
    private String memo;

    /** A - 初始
            0 - 已发送
            1 - 已读
            2 - 已回复
            3 - 发送失败
            9 - 关闭 */
    private String status;
    
    private Map<String, String> extraParams = new HashMap<String, String>();

    /**
     * 获取title
     * 
     * @return title
     */
    @Column(name = "TITLE", nullable = true, length = 255)
    public String getTitle() {
        return this.title;
    }

    /**
     * 设置title
     * 
     * @param title
     */
    public void setTitle(String title) {
        this.title = title;
    }

    /**
     * 获取content
     * 
     * @return content
     */
    @Column(name = "CONTENT", nullable = true, length = 2000)
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
     * 获取target
     * 
     * @return target
     */
    @Column(name = "TARGET", nullable = true, length = 255)
    public String getTarget() {
        return this.target;
    }

    /**
     * 设置target
     * 
     * @param target
     */
    public void setTarget(String target) {
        this.target = target;
    }

    /**
     * 获取系统公告
            00 - 系统公告
            应用通知
            10 - 支付通知
            11 - 导诊提醒
            12 - 工资通知
            短信
            20 - 注册验证
            21 - 找回密码
            22 - 验证码
     * 
     * @return 系统公告
            00 - 系统公告
            应用通知
            10 - 支付通知
            11 - 导诊提醒
            12 - 工资通知
            短信
            20 - 注册验证
            21 - 找回密码
            22 - 验证码
     */
    @Column(name = "TYPE", nullable = true, length = 2)
    public String getType() {
        return this.type;
    }

    /**
     * 设置系统公告
            00 - 系统公告
            应用通知
            10 - 支付通知
            11 - 导诊提醒
            12 - 工资通知
            短信
            20 - 注册验证
            21 - 找回密码
            22 - 验证码
     * 
     * @param type
     *          系统公告
            00 - 系统公告
            应用通知
            10 - 支付通知
            11 - 导诊提醒
            12 - 工资通知
            短信
            20 - 注册验证
            21 - 找回密码
            22 - 验证码
     */
    public void setType(String type) {
        this.type = type;
    }

    /**
     * 获取0 - ALL
            1 - APP
            2 - WEB
            3 - MSG 
            4 - MAIL
            5 - QQ
            6 - WX
            9 - OTHER
     * 
     * @return 0 - ALL
            1 - APP
            2 - WEB
            3 - MSG 
            4 - MAIL
            5 - QQ
            6 - WX
            9 - OTHER
     */
    @Column(name = "MODE", nullable = true, length = 1)
    public String getMode() {
        return this.mode;
    }

    /**
     * 设置0 - ALL
            1 - APP
            2 - WEB
            3 - MSG 
            4 - MAIL
            5 - QQ
            6 - WX
            9 - OTHER
     * 
     * @param mode
     *          0 - ALL
            1 - APP
            2 - WEB
            3 - MSG 
            4 - MAIL
            5 - QQ
            6 - WX
            9 - OTHER
     */
    public void setMode(String mode) {
        this.mode = mode;
    }

    /**
     * 获取appChannel
     * 
     * @return appChannel
     */
    @Column(name = "APP_CHANNEL", nullable = true, length = 3)
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
     * 获取0 - 所有
            1 - 用户
            2 - 组别
            
            
     * 
     * @return 0 - 所有
            1 - 用户
            2 - 组别
            
            
     */
    @Column(name = "RECEIVER_TYPE", nullable = true, length = 1)
    public String getReceiverType() {
        return this.receiverType;
    }

    /**
     * 设置0 - 所有
            1 - 用户
            2 - 组别
            
            
     * 
     * @param receiverType
     *          0 - 所有
            1 - 用户
            2 - 组别
            
            
     */
    public void setReceiverType(String receiverType) {
        this.receiverType = receiverType;
    }

    /**
     * 获取receiverValue
     * 
     * @return receiverValue
     */
    @Column(name = "RECEIVER_VALUE", nullable = true, length = 2000)
    public String getReceiverValue() {
        return this.receiverValue;
    }

    /**
     * 设置receiverValue
     * 
     * @param receiverValue
     */
    public void setReceiverValue(String receiverValue) {
        this.receiverValue = receiverValue;
    }

    /**
     * 获取orgId
     * 
     * @return orgId
     */
    @Column(name = "ORG_ID", nullable = true, length = 32)
    public String getOrgId() {
        return this.orgId;
    }

    /**
     * 设置orgId
     * 
     * @param orgId
     */
    public void setOrgId(String orgId) {
        this.orgId = orgId;
    }

    /**
     * 获取orgName
     * 
     * @return orgName
     */
    @Column(name = "ORG_NAME", nullable = true, length = 70)
    public String getOrgName() {
        return this.orgName;
    }

    /**
     * 设置orgName
     * 
     * @param orgName
     */
    public void setOrgName(String orgName) {
        this.orgName = orgName;
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
            0 - 已发送
            1 - 已读
            2 - 已回复
            3 - 发送失败
            9 - 关闭
     * 
     * @return A - 初始
            0 - 已发送
            1 - 已读
            2 - 已回复
            3 - 发送失败
            9 - 关闭
     */
    @Column(name = "STATUS", nullable = true, length = 1)
    public String getStatus() {
        return this.status;
    }

    /**
     * 设置A - 初始
            0 - 已发送
            1 - 已读
            2 - 已回复
            3 - 发送失败
            9 - 关闭
     * 
     * @param status
     *          A - 初始
            0 - 已发送
            1 - 已读
            2 - 已回复
            3 - 发送失败
            9 - 关闭
     */
    public void setStatus(String status) {
        this.status = status;
    }
    
    @Transient
	public Map<String, String> getExtraParams() {
		return extraParams;
	}
	public void setExtraParams(Map<String, String> extraParams) {
		this.extraParams = extraParams;
	}
}