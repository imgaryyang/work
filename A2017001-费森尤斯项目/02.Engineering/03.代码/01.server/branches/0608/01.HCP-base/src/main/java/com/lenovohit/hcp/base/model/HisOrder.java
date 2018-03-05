package com.lenovohit.hcp.base.model;

import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.Table;

import com.lenovohit.core.model.BaseIdModel;

@Entity
@Table(name = "HIS_ORDER")
public class HisOrder extends BaseIdModel {
	public static final String ORDER_STAT_INITIAL = "A";
	public static final String ORDER_STAT_TRAN_FAILURE = "B";
	public static final String ORDER_STAT_TRAN_SUCCESS = "0";
	public static final String ORDER_STAT_PAY_SUCCESS = "1";
	public static final String ORDER_STAT_PAY_FAILURE = "2";
	public static final String ORDER_STAT_THIRD_FAILURE = "3";
	public static final String ORDER_STAT_TRAN_FINISH = "4";
	public static final String ORDER_STAT_REFUNDING = "5";
	public static final String ORDER_STAT_REFUND_FAILURE = "6";
	public static final String ORDER_STAT_REFUND_SUCCESS = "7";
	public static final String ORDER_STAT_EXCEPTIONAL = "8";
	public static final String ORDER_STAT_CLOSED = "9";
	private static final long serialVersionUID = 1L;

	private String orderNo;

	private String orderType;

	private String orderTitle;

	private String orderDesc;

	private BigDecimal amt;

	private BigDecimal realAmt;

	private BigDecimal lastAmt;

	private BigDecimal paAmt;

	private BigDecimal miAmt;

	private BigDecimal selfAmt;

	private String status;

	private String bizBean;

	private Date createTime;

	private Date tranTime;

	private Date finishTime;

	private String outTime;

	private String operator;

	private String chargeIds;

	public String getOrderType() {
		return orderType;
	}

	public void setOrderType(String orderType) {
		this.orderType = orderType == null ? null : orderType.trim();
	}

	public String getOrderTitle() {
		return orderTitle;
	}

	public void setOrderTitle(String orderTitle) {
		this.orderTitle = orderTitle == null ? null : orderTitle.trim();
	}

	public String getOrderDesc() {
		return orderDesc;
	}

	public void setOrderDesc(String orderDesc) {
		this.orderDesc = orderDesc == null ? null : orderDesc.trim();
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

	public BigDecimal getLastAmt() {
		return lastAmt;
	}

	public void setLastAmt(BigDecimal lastAmt) {
		this.lastAmt = lastAmt;
	}

	public BigDecimal getPaAmt() {
		return paAmt;
	}

	public void setPaAmt(BigDecimal paAmt) {
		this.paAmt = paAmt;
	}

	public BigDecimal getMiAmt() {
		return miAmt;
	}

	public void setMiAmt(BigDecimal miAmt) {
		this.miAmt = miAmt;
	}

	public BigDecimal getSelfAmt() {
		return selfAmt;
	}

	public void setSelfAmt(BigDecimal selfAmt) {
		this.selfAmt = selfAmt;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status == null ? null : status.trim();
	}

	public String getBizBean() {
		return bizBean;
	}

	public void setBizBean(String bizBean) {
		this.bizBean = bizBean == null ? null : bizBean.trim();
	}

	public Date getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}

	public Date getTranTime() {
		return tranTime;
	}

	public void setTranTime(Date tranTime) {
		this.tranTime = tranTime;
	}

	public Date getFinishTime() {
		return finishTime;
	}

	public void setFinishTime(Date finishTime) {
		this.finishTime = finishTime;
	}

	public String getOutTime() {
		return outTime;
	}

	public void setOutTime(String outTime) {
		this.outTime = outTime == null ? null : outTime.trim();
	}

	public String getOperator() {
		return operator;
	}

	public void setOperator(String operator) {
		this.operator = operator == null ? null : operator.trim();
	}

	public String getChargeIds() {
		return chargeIds;
	}

	public void setChargeIds(String chargeIds) {
		this.chargeIds = chargeIds == null ? null : chargeIds.trim();
	}

	public String getOrderNo() {
		return orderNo;
	}

	public void setOrderNo(String orderNo) {
		this.orderNo = orderNo;
	}
}