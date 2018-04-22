package com.lenovohit.ssm.payment.model;

import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.Table;

import com.lenovohit.core.model.BaseIdModel;


@Entity
@Table(name="SSM_SETTLEMENT")
public class Settlement extends BaseIdModel{

	/**
	 * 
	 */
	private static final long serialVersionUID = 2390477403094369238L;
	
	private BigDecimal amt= new BigDecimal(0) ;//结算单金额
	private BigDecimal realAmt= new BigDecimal(0) ;
	private String settleNo;//结算单号	
	private String settleType;//结算类型	
	private String settleTypeName;//结算类型名称	
	private String payChannelCode;//支付渠道编码
	private String payChannelName;//支付渠道名称	
	private String payChannelId;//支付渠道
	private String tradeNo;//支付渠道	
	private String payStatus;//支付状态
	private Date createTime;//创建时间	
	private Date payTime;//支付时间	
	private int payCount;//支付次数	
	private String description;//描述	
	private String orderId;//订单id	
	private String orderNo;//订单号
	
	public String getSettleNo() {
		return settleNo;
	}

	public void setSettleNo(String settleNo) {
		this.settleNo = settleNo;
	}

	public String getSettleType() {
		return settleType;
	}

	public void setSettleType(String settleType) {
		this.settleType = settleType;
	}

	public String getSettleTypeName() {
		return settleTypeName;
	}

	public void setSettleTypeName(String settleTypeName) {
		this.settleTypeName = settleTypeName;
	}

	public String getPayChannelCode() {
		return payChannelCode;
	}

	public void setPayChannelCode(String payChannelCode) {
		this.payChannelCode = payChannelCode;
	}

	public String getTradeNo() {
		return tradeNo;
	}

	public void setTradeNo(String tradeNo) {
		this.tradeNo = tradeNo;
	}

	public String getPayChannelName() {
		return payChannelName;
	}

	public void setPayChannelName(String payChannelName) {
		this.payChannelName = payChannelName;
	}

	public String getPayChannelId() {
		return payChannelId;
	}

	public void setPayChannelId(String payChannelId) {
		this.payChannelId = payChannelId;
	}

	public String getPayStatus() {
		return payStatus;
	}

	public void setPayStatus(String payStatus) {
		this.payStatus = payStatus;
	}

	public Date getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}

	public Date getPayTime() {
		return payTime;
	}

	public void setPayTime(Date payTime) {
		this.payTime = payTime;
	}

	public int getPayCount() {
		return payCount;
	}

	public void setPayCount(int payCount) {
		this.payCount = payCount;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getOrderNo() {
		return orderNo;
	}

	public void setOrderNo(String orderNo) {
		this.orderNo = orderNo;
	}

	public BigDecimal getRealAmt() {
		return realAmt;
	}

	public void setRealAmt(BigDecimal realAmt) {
		this.realAmt = realAmt;
	}

	
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public BigDecimal getAmt() {
		return amt;
	}

	public void setAmt(BigDecimal amt) {
		this.amt = amt;
	}
	
}
