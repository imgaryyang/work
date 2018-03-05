package com.lenovohit.hcp.payment.model;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.Table;

import com.lenovohit.core.model.BaseIdModel;

@Entity
@Table(name = "HCP_PAY_CHANNEL")
public class HcpPayChannel extends BaseIdModel{
	private static final long serialVersionUID = 1L;
	public static final String PAY_CODE_CASH = "1";
	public static final String PAY_CODE_ALIPAY = "8";
	public static final String PAY_CODE_WXPAY = "9";

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

    private String payUrl;

    private String refundUrl;

    private String cancelUrl;

    private String queryUrl;

    private String checkUrl;

    private String checkTime;

    private String frontIp;

    private String frontPort;

    private String contacts;

    private String phone;

    private String email;

    private String qq;

    private String isPos;

    private String isSsm;

    private String cardType;

    private String status;

    private String memo;

    private Date regTime;

    private String regUser;

    private Date updateTime;

    private String updateUser;

    private String refCheckUrl;

    private String refCheckTime;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name == null ? null : name.trim();
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code == null ? null : code.trim();
    }

    public String getMchId() {
        return mchId;
    }

    public void setMchId(String mchId) {
        this.mchId = mchId == null ? null : mchId.trim();
    }

    public String getMchName() {
        return mchName;
    }

    public void setMchName(String mchName) {
        this.mchName = mchName == null ? null : mchName.trim();
    }

    public String getAppId() {
        return appId;
    }

    public void setAppId(String appId) {
        this.appId = appId == null ? null : appId.trim();
    }

    public String getAccNo() {
        return accNo;
    }

    public void setAccNo(String accNo) {
        this.accNo = accNo == null ? null : accNo.trim();
    }

    public String getAccName() {
        return accName;
    }

    public void setAccName(String accName) {
        this.accName = accName == null ? null : accName.trim();
    }

    public String getPrivateKey() {
        return privateKey;
    }

    public void setPrivateKey(String privateKey) {
        this.privateKey = privateKey == null ? null : privateKey.trim();
    }

    public String getPublicKey() {
        return publicKey;
    }

    public void setPublicKey(String publicKey) {
        this.publicKey = publicKey == null ? null : publicKey.trim();
    }

    public String getSignCertPath() {
        return signCertPath;
    }

    public void setSignCertPath(String signCertPath) {
        this.signCertPath = signCertPath == null ? null : signCertPath.trim();
    }

    public String getSignCertUser() {
        return signCertUser;
    }

    public void setSignCertUser(String signCertUser) {
        this.signCertUser = signCertUser == null ? null : signCertUser.trim();
    }

    public String getSignCertPwd() {
        return signCertPwd;
    }

    public void setSignCertPwd(String signCertPwd) {
        this.signCertPwd = signCertPwd == null ? null : signCertPwd.trim();
    }

    public String getEncryptCertPath() {
        return encryptCertPath;
    }

    public void setEncryptCertPath(String encryptCertPath) {
        this.encryptCertPath = encryptCertPath == null ? null : encryptCertPath.trim();
    }

    public String getEncryptCertUser() {
        return encryptCertUser;
    }

    public void setEncryptCertUser(String encryptCertUser) {
        this.encryptCertUser = encryptCertUser == null ? null : encryptCertUser.trim();
    }

    public String getEncryptCertPwd() {
        return encryptCertPwd;
    }

    public void setEncryptCertPwd(String encryptCertPwd) {
        this.encryptCertPwd = encryptCertPwd == null ? null : encryptCertPwd.trim();
    }

    public String getValidateCertPath() {
        return validateCertPath;
    }

    public void setValidateCertPath(String validateCertPath) {
        this.validateCertPath = validateCertPath == null ? null : validateCertPath.trim();
    }

    public String getValidateCertUser() {
        return validateCertUser;
    }

    public void setValidateCertUser(String validateCertUser) {
        this.validateCertUser = validateCertUser == null ? null : validateCertUser.trim();
    }

    public String getValidateCertPwd() {
        return validateCertPwd;
    }

    public void setValidateCertPwd(String validateCertPwd) {
        this.validateCertPwd = validateCertPwd == null ? null : validateCertPwd.trim();
    }

    public String getPayUrl() {
        return payUrl;
    }

    public void setPayUrl(String payUrl) {
        this.payUrl = payUrl == null ? null : payUrl.trim();
    }

    public String getRefundUrl() {
        return refundUrl;
    }

    public void setRefundUrl(String refundUrl) {
        this.refundUrl = refundUrl == null ? null : refundUrl.trim();
    }

    public String getCancelUrl() {
        return cancelUrl;
    }

    public void setCancelUrl(String cancelUrl) {
        this.cancelUrl = cancelUrl == null ? null : cancelUrl.trim();
    }

    public String getQueryUrl() {
        return queryUrl;
    }

    public void setQueryUrl(String queryUrl) {
        this.queryUrl = queryUrl == null ? null : queryUrl.trim();
    }

    public String getCheckUrl() {
        return checkUrl;
    }

    public void setCheckUrl(String checkUrl) {
        this.checkUrl = checkUrl == null ? null : checkUrl.trim();
    }

    public String getCheckTime() {
        return checkTime;
    }

    public void setCheckTime(String checkTime) {
        this.checkTime = checkTime == null ? null : checkTime.trim();
    }

    public String getFrontIp() {
        return frontIp;
    }

    public void setFrontIp(String frontIp) {
        this.frontIp = frontIp == null ? null : frontIp.trim();
    }

    public String getFrontPort() {
        return frontPort;
    }

    public void setFrontPort(String frontPort) {
        this.frontPort = frontPort == null ? null : frontPort.trim();
    }

    public String getContacts() {
        return contacts;
    }

    public void setContacts(String contacts) {
        this.contacts = contacts == null ? null : contacts.trim();
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone == null ? null : phone.trim();
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email == null ? null : email.trim();
    }

    public String getQq() {
        return qq;
    }

    public void setQq(String qq) {
        this.qq = qq == null ? null : qq.trim();
    }

    public String getIsPos() {
        return isPos;
    }

    public void setIsPos(String isPos) {
        this.isPos = isPos == null ? null : isPos.trim();
    }

    public String getIsSsm() {
        return isSsm;
    }

    public void setIsSsm(String isSsm) {
        this.isSsm = isSsm == null ? null : isSsm.trim();
    }

    public String getCardType() {
        return cardType;
    }

    public void setCardType(String cardType) {
        this.cardType = cardType == null ? null : cardType.trim();
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status == null ? null : status.trim();
    }

    public String getMemo() {
        return memo;
    }

    public void setMemo(String memo) {
        this.memo = memo == null ? null : memo.trim();
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
        this.regUser = regUser == null ? null : regUser.trim();
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
        this.updateUser = updateUser == null ? null : updateUser.trim();
    }

    public String getRefCheckUrl() {
        return refCheckUrl;
    }

    public void setRefCheckUrl(String refCheckUrl) {
        this.refCheckUrl = refCheckUrl == null ? null : refCheckUrl.trim();
    }

    public String getRefCheckTime() {
        return refCheckTime;
    }

    public void setRefCheckTime(String refCheckTime) {
        this.refCheckTime = refCheckTime == null ? null : refCheckTime.trim();
    }
}