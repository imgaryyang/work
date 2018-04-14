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

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

import com.lenovohit.hwe.base.model.AuditableModel;

/**
 * PAY_MERCHANT
 * 
 * @author zyus
 * @version 1.0.0 2018-01-11
 */
@Entity
@Table(name = "PAY_MERCHANT")
public class PayMerchant extends AuditableModel implements java.io.Serializable {
    /** 版本号 */
    private static final long serialVersionUID = -39632659615574463L;

//    /** pcId */
//    private String pcId;

    /** mchNo */
    private String mchNo;

    /** mchName */
    private String mchName;

    /** accNo */
    private String accNo;

    /** accName */
    private String accName;

    /** owner */
    private String owner;
    
    private String configFile;

    /** frontIp */
    private String frontIp;

    /** frontPort */
    private String frontPort;
//    
//	private String checkUrl;//[ftp:ip:port：user:password];[http:url];[https:url];[socket:ip:port];[query]
//	private String checkTime;
//	private String payCheckUrl;//[ftp:ip:port：user:password];[http:url];[https:url];[socket:ip:port];[query]
//	private String payCheckTime;
//	private String refCheckUrl;//[ftp:ip:port：user:password];[http:url];[https:url];[socket:ip:port];[query]
//	private String refCheckTime;
//	private String retCheckUrl;//[ftp:ip:port：user:password];[http:url];[https:url];[socket:ip:port];[query]
//	private String retCheckTime;

    /** charset */
    private String charset;

    /** contacts */
    private String contacts;

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
    
    private PayChannel payChannel;

//    /**
//     * 获取pcId
//     * 
//     * @return pcId
//     */
//    @Column(name = "PC_ID", nullable = true, length = 32)
//    public String getPcId() {
//        return this.pcId;
//    }
//
//    /**
//     * 设置pcId
//     * 
//     * @param pcId
//     */
//    public void setPcId(String pcId) {
//        this.pcId = pcId;
//    }

    /**
     * 获取mchNo
     * 
     * @return mchNo
     */
    @Column(name = "MCH_NO", nullable = true, length = 50)
    public String getMchNo() {
        return this.mchNo;
    }

    /**
     * 设置mchNo
     * 
     * @param mchNo
     */
    public void setMchNo(String mchNo) {
        this.mchNo = mchNo;
    }

    /**
     * 获取mchName
     * 
     * @return mchName
     */
    @Column(name = "MCH_NAME", nullable = true, length = 70)
    public String getMchName() {
        return this.mchName;
    }

    /**
     * 设置mchName
     * 
     * @param mchName
     */
    public void setMchName(String mchName) {
        this.mchName = mchName;
    }

    /**
     * 获取accNo
     * 
     * @return accNo
     */
    @Column(name = "ACC_NO", nullable = true, length = 50)
    public String getAccNo() {
        return this.accNo;
    }

    /**
     * 设置accNo
     * 
     * @param accNo
     */
    public void setAccNo(String accNo) {
        this.accNo = accNo;
    }

    /**
     * 获取accName
     * 
     * @return accName
     */
    @Column(name = "ACC_NAME", nullable = true, length = 70)
    public String getAccName() {
        return this.accName;
    }

    /**
     * 设置accName
     * 
     * @param accName
     */
    public void setAccName(String accName) {
        this.accName = accName;
    }

    /**
     * 获取owner
     * 
     * @return owner
     */
    @Column(name = "OWNER", nullable = true, length = 50)
    public String getOwner() {
        return this.owner;
    }

    /**
     * 设置owner
     * 
     * @param owner
     */
    public void setOwner(String owner) {
        this.owner = owner;
    }

    public String getConfigFile() {
		return configFile;
	}

	public void setConfigFile(String configFile) {
		this.configFile = configFile;
	}

	/**
     * 获取frontIp
     * 
     * @return frontIp
     */
    @Column(name = "FRONT_IP", nullable = true, length = 50)
    public String getFrontIp() {
        return this.frontIp;
    }

    /**
     * 设置frontIp
     * 
     * @param frontIp
     */
    public void setFrontIp(String frontIp) {
        this.frontIp = frontIp;
    }

    /**
     * 获取frontPort
     * 
     * @return frontPort
     */
    @Column(name = "FRONT_PORT", nullable = true, length = 10)
    public String getFrontPort() {
        return this.frontPort;
    }

    /**
     * 设置frontPort
     * 
     * @param frontPort
     */
    public void setFrontPort(String frontPort) {
        this.frontPort = frontPort;
    }

    /**
     * 获取charset
     * 
     * @return charset
     */
    @Column(name = "CHARSET", nullable = true, length = 10)
    public String getCharset() {
        return this.charset;
    }

    /**
     * 设置charset
     * 
     * @param charset
     */
    public void setCharset(String charset) {
        this.charset = charset;
    }

    /**
     * 获取contacts
     * 
     * @return contacts
     */
    @Column(name = "CONTACTS", nullable = true, length = 50)
    public String getContacts() {
        return this.contacts;
    }

    /**
     * 设置contacts
     * 
     * @param contacts
     */
    public void setContacts(String contacts) {
        this.contacts = contacts;
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
     * 获取
     * @return
     */
    @Column(name = "STATUS", nullable = true, length = 1)
    public String getStatus() {
        return this.status;
    }

    /**
     * 设置
     * @param status
     */
    public void setStatus(String status) {
        this.status = status;
    }
    
    @ManyToOne(cascade = CascadeType.REFRESH, fetch = FetchType.LAZY, optional = true)
   	@JoinColumn(name = "PC_ID", nullable = true)
   	@NotFound(action=NotFoundAction.IGNORE)
	public PayChannel getPayChannel() {
		return payChannel;
	}

	public void setPayChannel(PayChannel payChannel) {
		this.payChannel = payChannel;
	}
}