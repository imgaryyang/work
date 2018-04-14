package com.lenovohit.ssm.payment.model;

import java.math.BigDecimal;

import javax.persistence.Entity;
import javax.persistence.Table;

import com.lenovohit.core.model.BaseIdModel;

/**
 * 微信交易明细
 * @author zyus
 *
 */
@Entity
@Table(name="SSM_CHECK_DETAIL_WXPAY")
public class CheckDetailWxpay extends BaseIdModel{
	private static final long serialVersionUID = -987941633026444938L;
	
	private String checkRecord  ;		  	//对账记录
	private String tradeTime;            	//交易时间
	private String appId;            	 	//公众账号ID
	private String mchId;				 	//商户号
	private String childMchId;			 	//子商户号
	private String deviceInfo;				//设备号
	private String tradeNo;               	//微信订单号
	private String outTradeNo;            	//商户订单号
	private String openId;					//用户标识
	private String tradeType;             	//交易类型
	private String tradeStatus;             //交易状态
	private String bankType;               	//付款银行
	private String feeType;            		//货币种类
	private BigDecimal totalFee;           	//总金额
	private BigDecimal mpCouponFee;        	//企业红包金额
	private String refTradeNo;              //微信退款单号
	private String refOutTradeNo;           //商户退款单号
	private BigDecimal refundFee;         	//退款金额
	private BigDecimal mrCouponFee;        	//企业红包退款金额
	private String refType;            		//退款类型
	private String refStatus;				//退款状态
	private String body;            		//商品名称
	private String attach;              	//商户数据包
	private BigDecimal fee;        			//手续费（元）
	private String feeRate;        			//费率
	
	
	public String getCheckRecord() {
		return checkRecord;
	}
	public void setCheckRecord(String checkRecord) {
		this.checkRecord = checkRecord;
	}
	public String getTradeTime() {
		return tradeTime;
	}
	public void setTradeTime(String tradeTime) {
		this.tradeTime = tradeTime;
	}
	public String getAppId() {
		return appId;
	}
	public void setAppId(String appId) {
		this.appId = appId;
	}
	public String getMchId() {
		return mchId;
	}
	public void setMchId(String mchId) {
		this.mchId = mchId;
	}
	public String getChildMchId() {
		return childMchId;
	}
	public void setChildMchId(String childMchId) {
		this.childMchId = childMchId;
	}
	public String getDeviceInfo() {
		return deviceInfo;
	}
	public void setDeviceInfo(String deviceInfo) {
		this.deviceInfo = deviceInfo;
	}
	public String getTradeNo() {
		return tradeNo;
	}
	public void setTradeNo(String tradeNo) {
		this.tradeNo = tradeNo;
	}
	public String getOutTradeNo() {
		return outTradeNo;
	}
	public void setOutTradeNo(String outTradeNo) {
		this.outTradeNo = outTradeNo;
	}
	public String getOpenId() {
		return openId;
	}
	public void setOpenId(String openId) {
		this.openId = openId;
	}
	public String getTradeType() {
		return tradeType;
	}
	public void setTradeType(String tradeType) {
		this.tradeType = tradeType;
	}
	public String getTradeStatus() {
		return tradeStatus;
	}
	public void setTradeStatus(String tradeStatus) {
		this.tradeStatus = tradeStatus;
	}
	public String getBankType() {
		return bankType;
	}
	public void setBankType(String bankType) {
		this.bankType = bankType;
	}
	public String getFeeType() {
		return feeType;
	}
	public void setFeeType(String feeType) {
		this.feeType = feeType;
	}
	public BigDecimal getTotalFee() {
		return totalFee;
	}
	public void setTotalFee(BigDecimal totalFee) {
		this.totalFee = totalFee;
	}
	public BigDecimal getMpCouponFee() {
		return mpCouponFee;
	}
	public void setMpCouponFee(BigDecimal mpCouponFee) {
		this.mpCouponFee = mpCouponFee;
	}
	public String getRefTradeNo() {
		return refTradeNo;
	}
	public void setRefTradeNo(String refTradeNo) {
		this.refTradeNo = refTradeNo;
	}
	public String getRefOutTradeNo() {
		return refOutTradeNo;
	}
	public void setRefOutTradeNo(String refOutTradeNo) {
		this.refOutTradeNo = refOutTradeNo;
	}
	public BigDecimal getRefundFee() {
		return refundFee;
	}
	public void setRefundFee(BigDecimal refundFee) {
		this.refundFee = refundFee;
	}
	public BigDecimal getMrCouponFee() {
		return mrCouponFee;
	}
	public void setMrCouponFee(BigDecimal mrCouponFee) {
		this.mrCouponFee = mrCouponFee;
	}
	public String getRefType() {
		return refType;
	}
	public void setRefType(String refType) {
		this.refType = refType;
	}
	public String getRefStatus() {
		return refStatus;
	}
	public void setRefStatus(String refStatus) {
		this.refStatus = refStatus;
	}
	public String getBody() {
		return body;
	}
	public void setBody(String body) {
		this.body = body;
	}
	public String getAttach() {
		return attach;
	}
	public void setAttach(String attach) {
		this.attach = attach;
	}
	public BigDecimal getFee() {
		return fee;
	}
	public void setFee(BigDecimal fee) {
		this.fee = fee;
	}
	public String getFeeRate() {
		return feeRate;
	}
	public void setFeeRate(String feeRate) {
		this.feeRate = feeRate;
	}
	
}
