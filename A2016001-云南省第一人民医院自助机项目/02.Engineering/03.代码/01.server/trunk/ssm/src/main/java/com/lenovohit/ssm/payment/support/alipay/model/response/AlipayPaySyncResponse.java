package com.lenovohit.ssm.payment.support.alipay.model.response;

import java.io.Serializable;

import com.google.gson.annotations.SerializedName;

public class AlipayPaySyncResponse implements Serializable{
	private static final long serialVersionUID = -4030721199226914176L;
	/** 
	 * 通知时间 格式为yyyy-MM-dd HH:mm:ss
	 */
	@SerializedName("notify_time")
	private String notifyTime;

	/** 
	 * 通知类型 trade_status_sync
	 */
	@SerializedName("notify_type")
	private String notifyType;

	/** 
	 * 通知校验ID
	 */
	@SerializedName("notify_id")
	private String notifyId;

	/** 
	 * 签名类型 RSA2
	 */
	@SerializedName("sign_type")
	private String signType;
	/** 
	 * 签名
	 */
	@SerializedName("sign")
	private String sign;
	/** 
	 * 支付宝交易号
	 */
	@SerializedName("trade_no")
	private String tradeNo;
	/** 
	 * 商户订单号
	 */
	@SerializedName("out_trade_no")
	private String outTradeNo;
	/** 
	 * 商户业务号
	 */
	@SerializedName("out_biz_no")
	private String outBizNo;
	/** 
	 * 买家支付宝用户号
	 */
	@SerializedName("buyer_id")
	private String buyerId;
	/** 
	 * 买家支付宝账号
	 */
	@SerializedName("buyer_logon_id")
	private String buyerLogonId;
	/** 
	 * 卖家支付宝用户号
	 */
	@SerializedName("seller_id")
	private String sellerId;
	/** 
	 * 卖家支付宝账号
	 */
	@SerializedName("seller_email")
	private String sellerEmail;
	/** 
	 * 交易状态
	 */
	@SerializedName("trade_status")
	private String tradeStatus;
	/** 
	 * 订单金额
	 */
	@SerializedName("total_amount")
	private String totalAmount;
	/** 
	 * 实收金额
	 */
	@SerializedName("receipt_amount")
	private String receiptAmount;
	/** 
	 * 开票金额
	 */
	@SerializedName("invoice_amount")
	private String invoiceAmount;
	/** 
	 * 付款金额
	 */
	@SerializedName("buyer_pay_amount")
	private String buyerPayAmount;
	/** 
	 * 集分宝金额
	 */
	@SerializedName("point_amount")
	private String pointAmount;
	/** 
	 * 总退款金额
	 */
	@SerializedName("refund_fee")
	private String refundFee;
	/** 
	 * 实际退款金额
	 */
	@SerializedName("send_back_fee")
	private String sendBackFee;
	/** 
	 * 订单标题
	 */
	@SerializedName("subject")
	private String subject;
	/** 
	 * 商品描述
	 */
	@SerializedName("body")
	private String body;
	/** 
	 * 交易创建时间
	 */
	@SerializedName("gmt_create")
	private String gmtCreate;
	/** 
	 * 交易付款时间
	 */
	@SerializedName("gmt_payment")
	private String gmtPayment;
	/** 
	 * 交易退款时间
	 */
	@SerializedName("gmt_refund")
	private String gmtRefund;
	/** 
	 * 交易结束时间
	 */
	@SerializedName("gmt_close")
	private String gmtClose;
	/** 
	 * 支付金额信息
	 */
	@SerializedName("fund_bill_list")
	private String fundBillList;
	
	
	
	public String getNotifyTime() {
		return notifyTime;
	}
	public void setNotifyTime(String notifyTime) {
		this.notifyTime = notifyTime;
	}
	public String getNotifyType() {
		return notifyType;
	}
	public void setNotifyType(String notifyType) {
		this.notifyType = notifyType;
	}
	public String getNotifyId() {
		return notifyId;
	}
	public void setNotifyId(String notifyId) {
		this.notifyId = notifyId;
	}
	public String getSignType() {
		return signType;
	}
	public void setSignType(String signType) {
		this.signType = signType;
	}
	public String getSign() {
		return sign;
	}
	public void setSign(String sign) {
		this.sign = sign;
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
	public String getOutBizNo() {
		return outBizNo;
	}
	public void setOutBizNo(String outBizNo) {
		this.outBizNo = outBizNo;
	}
	public String getBuyerId() {
		return buyerId;
	}
	public void setBuyerId(String buyerId) {
		this.buyerId = buyerId;
	}
	public String getBuyerLogonId() {
		return buyerLogonId;
	}
	public void setBuyerLogonId(String buyerLogonId) {
		this.buyerLogonId = buyerLogonId;
	}
	public String getSellerId() {
		return sellerId;
	}
	public void setSellerId(String sellerId) {
		this.sellerId = sellerId;
	}
	public String getSellerEmail() {
		return sellerEmail;
	}
	public void setSellerEmail(String sellerEmail) {
		this.sellerEmail = sellerEmail;
	}
	public String getTradeStatus() {
		return tradeStatus;
	}
	public void setTradeStatus(String tradeStatus) {
		this.tradeStatus = tradeStatus;
	}
	public String getTotalAmount() {
		return totalAmount;
	}
	public void setTotalAmount(String totalAmount) {
		this.totalAmount = totalAmount;
	}
	public String getReceiptAmount() {
		return receiptAmount;
	}
	public void setReceiptAmount(String receiptAmount) {
		this.receiptAmount = receiptAmount;
	}
	public String getInvoiceAmount() {
		return invoiceAmount;
	}
	public void setInvoiceAmount(String invoiceAmount) {
		this.invoiceAmount = invoiceAmount;
	}
	public String getBuyerPayAmount() {
		return buyerPayAmount;
	}
	public void setBuyerPayAmount(String buyerPayAmount) {
		this.buyerPayAmount = buyerPayAmount;
	}
	public String getPointAmount() {
		return pointAmount;
	}
	public void setPointAmount(String pointAmount) {
		this.pointAmount = pointAmount;
	}
	public String getRefundFee() {
		return refundFee;
	}
	public void setRefundFee(String refundFee) {
		this.refundFee = refundFee;
	}
	public String getSendBackFee() {
		return sendBackFee;
	}
	public void setSendBackFee(String sendBackFee) {
		this.sendBackFee = sendBackFee;
	}
	public String getSubject() {
		return subject;
	}
	public void setSubject(String subject) {
		this.subject = subject;
	}
	public String getBody() {
		return body;
	}
	public void setBody(String body) {
		this.body = body;
	}
	public String getGmtCreate() {
		return gmtCreate;
	}
	public void setGmtCreate(String gmtCreate) {
		this.gmtCreate = gmtCreate;
	}
	public String getGmtPayment() {
		return gmtPayment;
	}
	public void setGmtPayment(String gmtPayment) {
		this.gmtPayment = gmtPayment;
	}
	public String getGmtRefund() {
		return gmtRefund;
	}
	public void setGmtRefund(String gmtRefund) {
		this.gmtRefund = gmtRefund;
	}
	public String getGmtClose() {
		return gmtClose;
	}
	public void setGmtClose(String gmtClose) {
		this.gmtClose = gmtClose;
	}
	public String getFundBillList() {
		return fundBillList;
	}
	public void setFundBillList(String fundBillList) {
		this.fundBillList = fundBillList;
	}
}
