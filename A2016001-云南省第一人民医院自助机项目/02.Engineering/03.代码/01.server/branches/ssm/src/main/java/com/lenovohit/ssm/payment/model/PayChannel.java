package com.lenovohit.ssm.payment.model;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.Table;

import com.lenovohit.core.model.BaseIdModel;


@Entity
@Table(name="SSM_PAY_CHANNEL")
public class PayChannel extends BaseIdModel{
	private static final long serialVersionUID = -6376593015883279618L;
	public static final String STATUS_NO = "0";//暂停
	public static final String STATUS_OK = "1";//正常
	
	private String name;
	private String code;
	private String mchId;
	private String mchName;
	private String appId;
	private String accNo;
	private String accName;
	private String privateKey;
	private String publicKey;
	private String signCertPath;
	private String signCertUser;
	private String signCertPwd;
	private String encryptCertPath;
	private String encryptCertUser;
	private String encryptCertPwd;
	private String validateCertPath;
	private String validateCertUser;
	private String validateCertPwd;
	private String charset;
	private String payUrl;
	private String refundUrl;
	private String cancelUrl;
	private String queryUrl;
	private String checkUrl;//[ftp:ip:port：user:password];[http:url];[https:url];[socket:ip:port];[query]
	private String checkTime;
	private String refCheckUrl;//[ftp:ip:port：user:password];[http:url];[https:url];[socket:ip:port];[query]
	private String refCheckTime;
	private String retCheckUrl;//[ftp:ip:port：user:password];[http:url];[https:url];[socket:ip:port];[query]
	private String retCheckTime;
	private String frontIp;
	private String frontPort;
	private String contacts;
	private String phone;
	private String email;
	private String qq;
	private String status; //0-暂停| 1-正常
	private String memo;
	private Date updateTime;//更新时间	
	private String updateUser;//更新人
	private Date regTime;//注册时间
	private String regUser;//注册人
	
	
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getCode() {
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}
	public String getMchId() {
		return mchId;
	}
	public void setMchId(String mchId) {
		this.mchId = mchId;
	}
	public String getMchName() {
		return mchName;
	}
	public void setMchName(String mchName) {
		this.mchName = mchName;
	}
	public String getAppId() {
		return appId;
	}
	public void setAppId(String appId) {
		this.appId = appId;
	}
	public String getAccNo() {
		return accNo;
	}
	public void setAccNo(String accNo) {
		this.accNo = accNo;
	}
	public String getAccName() {
		return accName;
	}
	public void setAccName(String accName) {
		this.accName = accName;
	}
	public String getPrivateKey() {
		return privateKey;
	}
	public void setPrivateKey(String privateKey) {
		this.privateKey = privateKey;
	}
	public String getPublicKey() {
		return publicKey;
	}
	public void setPublicKey(String publicKey) {
		this.publicKey = publicKey;
	}
	public String getSignCertPath() {
		return signCertPath;
	}
	public void setSignCertPath(String signCertPath) {
		this.signCertPath = signCertPath;
	}
	public String getSignCertUser() {
		return signCertUser;
	}
	public void setSignCertUser(String signCertUser) {
		this.signCertUser = signCertUser;
	}
	public String getSignCertPwd() {
		return signCertPwd;
	}
	public void setSignCertPwd(String signCertPwd) {
		this.signCertPwd = signCertPwd;
	}
	public String getEncryptCertPath() {
		return encryptCertPath;
	}
	public void setEncryptCertPath(String encryptCertPath) {
		this.encryptCertPath = encryptCertPath;
	}
	public String getEncryptCertUser() {
		return encryptCertUser;
	}
	public void setEncryptCertUser(String encryptCertUser) {
		this.encryptCertUser = encryptCertUser;
	}
	public String getEncryptCertPwd() {
		return encryptCertPwd;
	}
	public void setEncryptCertPwd(String encryptCertPwd) {
		this.encryptCertPwd = encryptCertPwd;
	}
	public String getValidateCertPath() {
		return validateCertPath;
	}
	public void setValidateCertPath(String validateCertPath) {
		this.validateCertPath = validateCertPath;
	}
	public String getValidateCertUser() {
		return validateCertUser;
	}
	public void setValidateCertUser(String validateCertUser) {
		this.validateCertUser = validateCertUser;
	}
	public String getValidateCertPwd() {
		return validateCertPwd;
	}
	public void setValidateCertPwd(String validateCertPwd) {
		this.validateCertPwd = validateCertPwd;
	}
	public String getCharset() {
		return charset;
	}
	public void setCharset(String charset) {
		this.charset = charset;
	}
	public String getPayUrl() {
		return payUrl;
	}
	public void setPayUrl(String payUrl) {
		this.payUrl = payUrl;
	}
	public String getRefundUrl() {
		return refundUrl;
	}
	public void setRefundUrl(String refundUrl) {
		this.refundUrl = refundUrl;
	}
	public String getCancelUrl() {
		return cancelUrl;
	}
	public void setCancelUrl(String cancelUrl) {
		this.cancelUrl = cancelUrl;
	}
	public String getQueryUrl() {
		return queryUrl;
	}
	public void setQueryUrl(String queryUrl) {
		this.queryUrl = queryUrl;
	}
	public String getCheckUrl() {
		return checkUrl;
	}
	public void setCheckUrl(String checkUrl) {
		this.checkUrl = checkUrl;
	}
	public String getCheckTime() {
		return checkTime;
	}
	public void setCheckTime(String checkTime) {
		this.checkTime = checkTime;
	}
	public String getRefCheckUrl() {
		return refCheckUrl;
	}
	public void setRefCheckUrl(String refCheckUrl) {
		this.refCheckUrl = refCheckUrl;
	}
	public String getRefCheckTime() {
		return refCheckTime;
	}
	public void setRefCheckTime(String refCheckTime) {
		this.refCheckTime = refCheckTime;
	}
	public String getRetCheckUrl() {
		return retCheckUrl;
	}
	public void setRetCheckUrl(String retCheckUrl) {
		this.retCheckUrl = retCheckUrl;
	}
	public String getRetCheckTime() {
		return retCheckTime;
	}
	public void setRetCheckTime(String retCheckTime) {
		this.retCheckTime = retCheckTime;
	}
	public String getFrontIp() {
		return frontIp;
	}
	public void setFrontIp(String frontIp) {
		this.frontIp = frontIp;
	}
	public String getFrontPort() {
		return frontPort;
	}
	public void setFrontPort(String frontPort) {
		this.frontPort = frontPort;
	}
	public String getContacts() {
		return contacts;
	}
	public void setContacts(String contacts) {
		this.contacts = contacts;
	}
	public String getPhone() {
		return phone;
	}
	public void setPhone(String phone) {
		this.phone = phone;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getQq() {
		return qq;
	}
	public void setQq(String qq) {
		this.qq = qq;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getMemo() {
		return memo;
	}
	public void setMemo(String memo) {
		this.memo = memo;
	}
	public Date getUpdateTime() {
		return updateTime;
	}
	public void setUpdateTime(Date updateTime) {
		this.updateTime = updateTime;
	}
	public String getUpdateUser() {
		return updateUser;
	}
	public void setUpdateUser(String updateUser) {
		this.updateUser = updateUser;
	}
	public Date getRegTime() {
		return regTime;
	}
	public void setRegTime(Date regTime) {
		this.regTime = regTime;
	}
	public String getRegUser() {
		return regUser;
	}
	public void setRegUser(String regUser) {
		this.regUser = regUser;
	}

}
