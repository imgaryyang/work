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

package com.lenovohit.hwe.treat.model;

import java.math.BigDecimal;
import java.util.Date;
import com.lenovohit.core.utils.DateUtils;

	
public class Trade {
	public static final String SETTLE_TYPE_PAY = "SP";// 支付
	public static final String SETTLE_TYPE_REFUND = "SR";// 退款
	public static final String SETTLE_TYPE_CANCEL = "SC";// 撤销

	public static final String SETTLE_STAT_INITIAL = "A";// 初始化
	public static final String SETTLE_STAT_PAY_SUCCESS = "0";// 支付成功
	public static final String SETTLE_STAT_PAY_FAILURE = "1";// 支付失败
	public static final String SETTLE_STAT_PAY_FINISH = "2";// 交易完成
	public static final String SETTLE_STAT_PAY_PARTIAL = "4";// 部分支付
	public static final String SETTLE_STAT_REFUNDING = "5";// 正在退款
	public static final String SETTLE_STAT_REFUND_FAILURE = "6";// 退款失败
	public static final String SETTLE_STAT_REFUND_SUCCESS = "7";// 退款成功
	public static final String SETTLE_STAT_REFUND_CANCELED= "8";//被撤销的
	public static final String SETTLE_STAT_CLOSED = "9";// 关闭 超时关闭 手工关闭 废单
	public static final String SETTLE_STAT_EXCEPTIONAL = "E";// 异常  
	public static final String SETTLE_STAT_REVERSE = "R";// 冲账

	public static final String SETTLE_TRADE_INITIAL = "A";// 初始化 第三方支付渠道状态
	public static final String SETTLE_TRADE_SUCCESS = "0";// 交易成功
	public static final String SETTLE_TRADE_FAILURE = "1";// 交易失败
	public static final String SETTLE_TRADE_CLOSED = "9";// 交易关闭
	public static final String SETTLE_TRADE_EXCEPTIONAL = "E";// 交易异常
	
	public static final String SETTLE_TRAN_INITIAL = "A";// 初始化  业务应用渠道状态
	public static final String SETTLE_TRAN_SUCCESS = "0";// 交易成功
	public static final String SETTLE_TRAN_FAILURE = "1";// 交易失败
	public static final String SETTLE_TRAN_CLOSED = "9";// 交易关闭
	public static final String SETTLE_TRAN_EXCEPTIONAL = "E";// 交易异常
	
	private String bizType;
	private String bizNo;
	private BigDecimal amt;
    private BigDecimal realAmt;
    private String status;

    private String payChannleCode;
    private String payChannleName;
    private String payMerchantNo;
    private String payMerchantName;
    private String payTypeCode;
    private String payTypeType;
    private String payTypeName;
    private String payerNo;
    private String payerName;
    private String payerAccount;
    private String payerPhone;
    private String payerLogin;
    private String tradeNo;
    private Date tradeTime;
    private String tradeStatus;
    private String tradeRspCode;
    private String tradeRspMsg;
    private String respText;
	
	public String getBizType() {
		return bizType;
	}
	public void setBizType(String bizType) {
		this.bizType = bizType;
	}
	public String getBizNo() {
		return bizNo;
	}
	public void setBizNo(String bizNo) {
		this.bizNo = bizNo;
	}
	public BigDecimal getAmt() {
		return amt;
	}
	public void setAmt(BigDecimal amt) {
		this.amt = amt;
	}
	public BigDecimal getRealAmt() {
		return realAmt;
	}
	public void setRealAmt(BigDecimal realAmt) {
		this.realAmt = realAmt;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getPayChannleCode() {
		return payChannleCode;
	}
	public void setPayChannleCode(String payChannleCode) {
		this.payChannleCode = payChannleCode;
	}
	public String getPayChannleName() {
		return payChannleName;
	}
	public void setPayChannleName(String payChannleName) {
		this.payChannleName = payChannleName;
	}
	public String getPayMerchantNo() {
		return payMerchantNo;
	}
	public void setPayMerchantNo(String payMerchantNo) {
		this.payMerchantNo = payMerchantNo;
	}
	public String getPayMerchantName() {
		return payMerchantName;
	}
	public void setPayMerchantName(String payMerchantName) {
		this.payMerchantName = payMerchantName;
	}
	public String getPayTypeCode() {
		return payTypeCode;
	}
	public void setPayTypeCode(String payTypeCode) {
		this.payTypeCode = payTypeCode;
	}
	public String getPayTypeType() {
		return payTypeType;
	}
	public void setPayTypeType(String payTypeType) {
		this.payTypeType = payTypeType;
	}
	public String getPayTypeName() {
		return payTypeName;
	}
	public void setPayTypeName(String payTypeName) {
		this.payTypeName = payTypeName;
	}
	public String getPayerNo() {
		return payerNo;
	}
	public void setPayerNo(String payerNo) {
		this.payerNo = payerNo;
	}
	public String getPayerName() {
		return payerName;
	}
	public void setPayerName(String payerName) {
		this.payerName = payerName;
	}
	public String getPayerAccount() {
		return payerAccount;
	}
	public void setPayerAccount(String payerAccount) {
		this.payerAccount = payerAccount;
	}
	public String getPayerPhone() {
		return payerPhone;
	}
	public void setPayerPhone(String payerPhone) {
		this.payerPhone = payerPhone;
	}
	public String getPayerLogin() {
		return payerLogin;
	}
	public void setPayerLogin(String payerLogin) {
		this.payerLogin = payerLogin;
	}
	public String getTradeNo() {
		return tradeNo;
	}
	public void setTradeNo(String tradeNo) {
		this.tradeNo = tradeNo;
	}
	public Date getTradeTime() {
		return tradeTime;
	}
	public void setTradeTime(Date tradeTime) {
		this.tradeTime = tradeTime;
	}
	
	public String getTradeStatus() {
		return tradeStatus;
	}
	public void setTradeStatus(String tradeStatus) {
		this.tradeStatus = tradeStatus;
	}
	
	public String getTradeRspCode() {
		return tradeRspCode;
	}
	public void setTradeRspCode(String tradeRspCode) {
		this.tradeRspCode = tradeRspCode;
	}
	
	public String getTradeRspMsg() {
		return tradeRspMsg;
	}
	public void setTradeRspMsg(String tradeRspMsg) {
		this.tradeRspMsg = tradeRspMsg;
	}
	
	public String getRespText() {
		return respText;
	}
	public void setRespText(String respText) {
		this.respText = respText;
	}
}