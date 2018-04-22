package com.lenovohit.ssm.payment.model;

import java.math.BigDecimal;

import javax.persistence.Entity;
import javax.persistence.Table;

import com.lenovohit.core.model.BaseIdModel;

/**
 * 支付宝交易明细
 * @author zyus
 *
 */
@Entity
@Table(name="SSM_CHECK_DETAIL_ALIPAY")
public class CheckDetailAlipay extends BaseIdModel{
	private static final long serialVersionUID = -987941633026444938L;
	
	private String checkRecord  ;		  //对账记录
	private String outTradeNo;            //商户订单号
	private String tradeNo;               //支付宝交易号
	private String tradeType;             //业务类型
	private String subject;               //商品名称
	private String createTime;            //创建时间
	private String finishTime;            //完成时间
	private String storeId;               //门店编号
	private String storeName;             //门店名称
	private String operatorId;            //操作员
	private String terminalId;            //终端号
	private String sellerId;              //对方账户
	private BigDecimal amt;               //订单金额（元）
	private BigDecimal clearAmt;          //商家实收（元）
	private BigDecimal couponAmt;         //支付宝红包（元）
	private BigDecimal pointAmt;          //集分宝（元）
	private BigDecimal discountAmt;       //支付宝优惠（元）
	private BigDecimal mDiscountAmt;      //商家优惠（元）
	private BigDecimal ticketAmt;         //券核销金额（元）
	private String ticketName;            //券名称
	private BigDecimal mCouponAmt;        //商家红包消费金额（元）
	private BigDecimal cardAmt;           //卡消费金额（元）
	private String requestNo;             //退款批次号/请求号	服务费（元）
	
	private BigDecimal serviceAmt;        //服务费（元）
	private BigDecimal commission;        //分润（元）
	private String memo;                  //备注
	
	
	public String getCheckRecord() {
		return checkRecord;
	}
	public void setCheckRecord(String checkRecord) {
		this.checkRecord = checkRecord;
	}
	public String getOutTradeNo() {
		return outTradeNo;
	}
	public void setOutTradeNo(String outTradeNo) {
		this.outTradeNo = outTradeNo;
	}
	public String getTradeNo() {
		return tradeNo;
	}
	public void setTradeNo(String tradeNo) {
		this.tradeNo = tradeNo;
	}
	public String getTradeType() {
		return tradeType;
	}
	public void setTradeType(String tradeType) {
		this.tradeType = tradeType;
	}
	public String getSubject() {
		return subject;
	}
	public void setSubject(String subject) {
		this.subject = subject;
	}
	public String getCreateTime() {
		return createTime;
	}
	public void setCreateTime(String createTime) {
		this.createTime = createTime;
	}
	public String getFinishTime() {
		return finishTime;
	}
	public void setFinishTime(String finishTime) {
		this.finishTime = finishTime;
	}
	public String getStoreId() {
		return storeId;
	}
	public void setStoreId(String storeId) {
		this.storeId = storeId;
	}
	public String getStoreName() {
		return storeName;
	}
	public void setStoreName(String storeName) {
		this.storeName = storeName;
	}
	public String getOperatorId() {
		return operatorId;
	}
	public void setOperatorId(String operatorId) {
		this.operatorId = operatorId;
	}
	public String getTerminalId() {
		return terminalId;
	}
	public void setTerminalId(String terminalId) {
		this.terminalId = terminalId;
	}
	public String getSellerId() {
		return sellerId;
	}
	public void setSellerId(String sellerId) {
		this.sellerId = sellerId;
	}
	public BigDecimal getAmt() {
		return amt;
	}
	public void setAmt(BigDecimal amt) {
		this.amt = amt;
	}
	public BigDecimal getClearAmt() {
		return clearAmt;
	}
	public void setClearAmt(BigDecimal clearAmt) {
		this.clearAmt = clearAmt;
	}
	public BigDecimal getCouponAmt() {
		return couponAmt;
	}
	public void setCouponAmt(BigDecimal couponAmt) {
		this.couponAmt = couponAmt;
	}
	public BigDecimal getPointAmt() {
		return pointAmt;
	}
	public void setPointAmt(BigDecimal pointAmt) {
		this.pointAmt = pointAmt;
	}
	public BigDecimal getDiscountAmt() {
		return discountAmt;
	}
	public void setDiscountAmt(BigDecimal discountAmt) {
		this.discountAmt = discountAmt;
	}
	public BigDecimal getmDiscountAmt() {
		return mDiscountAmt;
	}
	public void setmDiscountAmt(BigDecimal mDiscountAmt) {
		this.mDiscountAmt = mDiscountAmt;
	}
	public BigDecimal getTicketAmt() {
		return ticketAmt;
	}
	public void setTicketAmt(BigDecimal ticketAmt) {
		this.ticketAmt = ticketAmt;
	}
	public String getTicketName() {
		return ticketName;
	}
	public void setTicketName(String ticketName) {
		this.ticketName = ticketName;
	}
	public BigDecimal getmCouponAmt() {
		return mCouponAmt;
	}
	public void setmCouponAmt(BigDecimal mCouponAmt) {
		this.mCouponAmt = mCouponAmt;
	}
	public BigDecimal getCardAmt() {
		return cardAmt;
	}
	public void setCardAmt(BigDecimal cardAmt) {
		this.cardAmt = cardAmt;
	}
	public String getRequestNo() {
		return requestNo;
	}
	public void setRequestNo(String requestNo) {
		this.requestNo = requestNo;
	}
	public BigDecimal getServiceAmt() {
		return serviceAmt;
	}
	public void setServiceAmt(BigDecimal serviceAmt) {
		this.serviceAmt = serviceAmt;
	}
	public BigDecimal getCommission() {
		return commission;
	}
	public void setCommission(BigDecimal commission) {
		this.commission = commission;
	}
	public String getMemo() {
		return memo;
	}
	public void setMemo(String memo) {
		this.memo = memo;
	}
	
}
