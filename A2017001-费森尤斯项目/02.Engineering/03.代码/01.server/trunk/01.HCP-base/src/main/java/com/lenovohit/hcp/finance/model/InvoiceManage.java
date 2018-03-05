package com.lenovohit.hcp.finance.model;

import java.math.BigInteger;
import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.lenovohit.hcp.base.model.HcpBaseModel;

@Entity
@Table(name = "FM_INVOICE_MANAGE") // 票据管理
public class InvoiceManage extends HcpBaseModel {
	private static final long serialVersionUID = 1L;
	public static final String INVOICE_TYPE_REGIST = "2";// 挂号发票
	public static final String INVOICE_TYPE_CLINIC = "2";// 门诊发票
	public static final String INVOICE_TYPE_CLINIC_PREPAY = "3";// 门诊预交金
	public static final String INVOICE_TYPE_HOSPITAL_PREPAY = "4";// 住院预交金
	public static final String INVOICE_TYPE_HSOPITAL = "5";// 住院发票
	public static final boolean INVOICE_STATE_USE = true;// 为停用
	public static final boolean INVOICE_STATE_STOP = false;// 已停用
	private String invoiceType; // 发票分类|INVOICE_TYPE
	private BigInteger invoiceStart;
	private BigInteger invoiceEnd;
	private BigInteger invoiceNo;
	private BigInteger invoiceUse;
	private String getOper;
	private Date getTime;
	private Boolean isshare;// 0-不共享、1-共享
	private Boolean invoiceState; // 停用标志|0-停用、1-使用

	public String getInvoiceType() {
		return invoiceType;
	}

	public void setInvoiceType(String invoiceType) {
		this.invoiceType = invoiceType;
	}

	public String getGetOper() {
		return getOper;
	}

	public void setGetOper(String getOper) {
		this.getOper = getOper;
	}

	@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
	public Date getGetTime() {
		return getTime;
	}

	public void setGetTime(Date getTime) {
		this.getTime = getTime;
	}

	public Boolean getIsshare() {
		return isshare;
	}

	public void setIsshare(Boolean isshare) {
		this.isshare = isshare;
	}

	public Boolean getInvoiceState() {
		return invoiceState;
	}

	public void setInvoiceState(Boolean invoiceState) {
		this.invoiceState = invoiceState;
	}

	public BigInteger getInvoiceStart() {
		return invoiceStart;
	}

	public void setInvoiceStart(BigInteger invoiceStart) {
		this.invoiceStart = invoiceStart;
	}

	public BigInteger getInvoiceEnd() {
		return invoiceEnd;
	}

	public void setInvoiceEnd(BigInteger invoiceEnd) {
		this.invoiceEnd = invoiceEnd;
	}

	public BigInteger getInvoiceUse() {
		return invoiceUse;
	}

	public void setInvoiceUse(BigInteger invoiceUse) {
		this.invoiceUse = invoiceUse;
	}

	@Transient
	public BigInteger getInvoiceNo() {
		return invoiceNo;
	}

	public void setInvoiceNo(BigInteger invoiceNo) {
		this.invoiceNo = invoiceNo;
	}

}
