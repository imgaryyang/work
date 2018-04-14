package com.lenovohit.hwe.base.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import com.lenovohit.core.model.BaseIdModel;

@Entity
@Table(name = "BASE_SMSMESSAGE")
public class SmsMessage extends BaseIdModel {
	private static final long serialVersionUID = 5229386841803646058L;

	public static final String MESSAGE_TYPE_REG = "REG";
	public static final String MESSAGE_TYPE_RFO = "RFO";
	public static final String MESSAGE_TYPE_REP = "REP";
	public static final String MESSAGE_TYPE_PAY = "PAY";
	public static final String MESSAGE_TYPE_DEP = "DEP";
	public static final String MESSAGE_TYPE_REG_APP = "REG_APP"; //app登录
	public static final String MESSAGE_TYPE_REG_WX = "REG_WX";	//wx登录
	public static final String MESSAGE_TYPE_REG_ALIPAY = "REG_ALIPAY";	//支付宝登录
	public static final String MESSAGE_TYPE_REG_WEB = "REG_WEB";	//网页登录
	public static final String MESSAGE_TYPE_BIND_PRO = "BIND_PROFILE";	//绑卡验证
	
	/**
	 * 类型
	 */
	private String type;
	
	/**
	 * 手机号码
	 */
	private String mobile;
	
	/**
	 * 验证码
	 */
	private String code;
	
	/**
	 * 令牌
	 */
	private String token;

	/**
	 * 内容
	 */
	private String content;
	
	/**
	 * 发送时间
	 */
	private Date sendtime;

	/**
	 * 超时时间
	 */
	private String outTime;
	
	/**
	 * 校验次数
	 */
	private int validNum = 0;
	
	/**
	 * 状态
	 */
	private String status; // A - 初始 ，0 - 已发送  1 - 已校验  9 - 已过去
	
	private String ip;	// ip


	@Column(name = "TYPE")
	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	@Column(name = "MOBILE")
	public String getMobile() {
		return mobile;
	}

	public void setMobile(String mobile) {
		this.mobile = mobile;
	}

	@Column(name = "CODE")
	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}
	
	@Column(name = "CONTENT")
	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	@Column(name = "SEND_TIME")
	public Date getSendtime() {
		return sendtime;
	}

	public void setSendtime(Date sendtime) {
		this.sendtime = sendtime;
	}
	
	@Column(name = "OUT_TIME")
	public String getOutTime() {
		return outTime;
	}
	public void setOutTime(String outTime) {
		this.outTime = outTime;
	}
	
	@Column(name = "VALID_NUM")
	public int getValidNum() {
		return validNum;
	}

	public void setValidNum(int validNum) {
		this.validNum = validNum;
	}
	
	@Column(name = "STATUS")
	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getIp() {
		return ip;
	}

	public void setIp(String ip) {
		this.ip = ip;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}
	
}
