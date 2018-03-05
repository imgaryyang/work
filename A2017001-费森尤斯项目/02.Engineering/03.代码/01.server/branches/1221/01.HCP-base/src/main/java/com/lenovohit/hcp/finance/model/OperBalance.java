package com.lenovohit.hcp.finance.model;

import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.lenovohit.hcp.base.annotation.RedisSequence;
import com.lenovohit.hcp.base.model.HcpBaseModel;

@Entity
@Table(name = "OC_OPER_BALANCE") // 收费员结账信息
public class OperBalance extends HcpBaseModel {
	private static final long serialVersionUID = 1L;
	public static final boolean UN_CHECK = false;
	public static final boolean CHECKED = true;
	private String balanceId;
	private Date balanceTime;
	private Date[] dateRange;
	private Date balanceStartTime;
	private Date balanceEndTime;
	private String invoiceOper;
	private String invoiceSource;
	private Date startTime;
	private Date endTime;
	private String plusCount;
	private BigDecimal plusTot;
	private String plusPub;
	private String plusOwn;
	private String plusRebate;
	private String minusCount;
	private BigDecimal minusTot;
	private String minusPut;
	private String minusOwn;
	private String minusRebate;
	private Boolean ischeck;
	private String checkOper;
	private String checkOperId;
	private Date checkTime;
	private String cancelOper;
	private Date cancelTime;
	private String comm;
	private String maxInvoiceNo;
	private String minInvoiceNo;

	@RedisSequence
	public String getBalanceId() {
		return balanceId;
	}

	public void setBalanceId(String balanceId) {
		this.balanceId = balanceId;
	}

	@Column(name = "BALANCE_TIME")
	@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
	public Date getBalanceTime() {
		return balanceTime;
	}

	public void setBalanceTime(Date balanceTime) {
		this.balanceTime = balanceTime;
	}

	public String getInvoiceOper() {
		return invoiceOper;
	}

	public void setInvoiceOper(String invoiceOper) {
		this.invoiceOper = invoiceOper;
	}

	@Column(name = "START_TIME")
	@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
	public Date getStartTime() {
		return startTime;
	}

	public void setStartTime(Date startTime) {
		this.startTime = startTime;
	}

	@Column(name = "END_TIME")
	@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
	public Date getEndTime() {
		return endTime;
	}

	public void setEndTime(Date endTime) {
		this.endTime = endTime;
	}

	public String getPlusCount() {
		return plusCount;
	}

	public void setPlusCount(String plusCount) {
		this.plusCount = plusCount;
	}

	public String getPlusPub() {
		return plusPub;
	}

	public void setPlusPub(String plusPub) {
		this.plusPub = plusPub;
	}

	public String getPlusOwn() {
		return plusOwn;
	}

	public void setPlusOwn(String plusOwn) {
		this.plusOwn = plusOwn;
	}

	public String getPlusRebate() {
		return plusRebate;
	}

	public void setPlusRebate(String plusRebate) {
		this.plusRebate = plusRebate;
	}

	public String getMinusCount() {
		return minusCount;
	}

	public void setMinusCount(String minusCount) {
		this.minusCount = minusCount;
	}

	public String getMinusPut() {
		return minusPut;
	}

	public void setMinusPut(String minusPut) {
		this.minusPut = minusPut;
	}

	public String getMinusOwn() {
		return minusOwn;
	}

	public void setMinusOwn(String minusOwn) {
		this.minusOwn = minusOwn;
	}

	public String getMinusRebate() {
		return minusRebate;
	}

	public void setMinusRebate(String minusRebate) {
		this.minusRebate = minusRebate;
	}

	public String getCheckOper() {
		return checkOper;
	}

	public void setCheckOper(String checkOper) {
		this.checkOper = checkOper;
	}

	public Date getCheckTime() {
		return checkTime;
	}

	public void setCheckTime(Date checkTime) {
		this.checkTime = checkTime;
	}

	public String getCancelOper() {
		return cancelOper;
	}

	public void setCancelOper(String cancelOper) {
		this.cancelOper = cancelOper;
	}

	public Date getCancelTime() {
		return cancelTime;
	}

	public void setCancelTime(Date cancelTime) {
		this.cancelTime = cancelTime;
	}

	public String getComm() {
		return comm;
	}

	public void setComm(String comm) {
		this.comm = comm;
	}

	public BigDecimal getPlusTot() {
		return plusTot;
	}

	public void setPlusTot(BigDecimal plusTot) {
		this.plusTot = plusTot;
	}

	public BigDecimal getMinusTot() {
		return minusTot;
	}

	public void setMinusTot(BigDecimal minusTot) {
		this.minusTot = minusTot;
	}

	public String getInvoiceSource() {
		return invoiceSource;
	}

	public void setInvoiceSource(String invoiceSource) {
		this.invoiceSource = invoiceSource;
	}

	@Transient
	public Date getBalanceStartTime() {
		return balanceStartTime;
	}

	public void setBalanceStartTime(Date balanceStartTime) {
		this.balanceStartTime = balanceStartTime;
	}

	@Transient
	public Date getBalanceEndTime() {
		return balanceEndTime;
	}

	public void setBalanceEndTime(Date balanceEndTime) {
		this.balanceEndTime = balanceEndTime;
	}

	@Transient
	public Date[] getDateRange() {
		return dateRange;
	}

	public void setDateRange(Date[] dateRange) {
		this.dateRange = dateRange;
	}

	public Boolean getIscheck() {
		return ischeck;
	}

	public void setIscheck(Boolean ischeck) {
		this.ischeck = ischeck;
	}

	public String getMaxInvoiceNo() {
		return maxInvoiceNo;
	}

	public void setMaxInvoiceNo(String maxInvoiceNo) {
		this.maxInvoiceNo = maxInvoiceNo;
	}

	public String getMinInvoiceNo() {
		return minInvoiceNo;
	}

	public void setMinInvoiceNo(String minInvoiceNo) {
		this.minInvoiceNo = minInvoiceNo;
	}

	public String getCheckOperId() {
		return checkOperId;
	}

	public void setCheckOperId(String checkOperId) {
		this.checkOperId = checkOperId;
	}

}
