package com.lenovohit.hcp.finance.model;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

/**
 * 结账dto，用于跟前台通讯
 * @description
 * @author jatesun
 * @version 1.0.0
 * @date 2017年4月17日
 */
public class CheckOutDto {
	private String invoiceOper;
	private String balanceId;
	private String invoiceOperName;
	private String invoiceSource;
	private Date beginDate;
	private Date endDate;
	private Date checkOutDate;
	private BigDecimal totalAmt;
	private String totalCount;
	private String minInvoiceNo;
	private String maxinvoiceNo;
	private BigDecimal refundAmt;
	private String refundCount;
	private List<FeeTypeDto> feeType;
	private List<PayWayDto> payWay;

	public String getInvoiceOper() {
		return invoiceOper;
	}

	public void setInvoiceOper(String invoiceOper) {
		this.invoiceOper = invoiceOper;
	}

	public String getInvoiceOperName() {
		return invoiceOperName;
	}

	public void setInvoiceOperName(String invoiceOperName) {
		this.invoiceOperName = invoiceOperName;
	}

	public BigDecimal getTotalAmt() {
		return totalAmt;
	}

	public void setTotalAmt(BigDecimal totalAmt) {
		this.totalAmt = totalAmt;
	}

	public String getTotalCount() {
		return totalCount;
	}

	public void setTotalCount(String totalCount) {
		this.totalCount = totalCount;
	}

	public String getMinInvoiceNo() {
		return minInvoiceNo;
	}

	public void setMinInvoiceNo(String minInvoiceNo) {
		this.minInvoiceNo = minInvoiceNo;
	}

	public String getMaxinvoiceNo() {
		return maxinvoiceNo;
	}

	public void setMaxinvoiceNo(String maxinvoiceNo) {
		this.maxinvoiceNo = maxinvoiceNo;
	}

	public BigDecimal getRefundAmt() {
		return refundAmt;
	}

	public void setRefundAmt(BigDecimal refundAmt) {
		this.refundAmt = refundAmt;
	}

	public String getRefundCount() {
		return refundCount;
	}

	public void setRefundCount(String refundCount) {
		this.refundCount = refundCount;
	}

	public List<FeeTypeDto> getFeeType() {
		return feeType;
	}

	public void setFeeType(List<FeeTypeDto> feeType) {
		this.feeType = feeType;
	}

	public List<PayWayDto> getPayWay() {
		return payWay;
	}

	public void setPayWay(List<PayWayDto> payWay) {
		this.payWay = payWay;
	}

	@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
	public Date getBeginDate() {
		return beginDate;
	}

	public void setBeginDate(Date beginDate) {
		this.beginDate = beginDate;
	}

	@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
	public Date getEndDate() {
		return endDate;
	}

	public void setEndDate(Date endDate) {
		this.endDate = endDate;
	}

	public String getInvoiceSource() {
		return invoiceSource;
	}

	public void setInvoiceSource(String invoiceSource) {
		this.invoiceSource = invoiceSource;
	}

	public String getBalanceId() {
		return balanceId;
	}

	public void setBalanceId(String balanceId) {
		this.balanceId = balanceId;
	}

	@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
	public Date getCheckOutDate() {
		return checkOutDate;
	}

	public void setCheckOutDate(Date checkOutDate) {
		this.checkOutDate = checkOutDate;
	}
}
