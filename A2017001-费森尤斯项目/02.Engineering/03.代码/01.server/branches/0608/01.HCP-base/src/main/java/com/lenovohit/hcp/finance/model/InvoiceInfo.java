package com.lenovohit.hcp.finance.model;

import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.lenovohit.hcp.base.model.HcpBaseModel;
import com.lenovohit.hcp.card.model.Patient;

@Entity
@Table(name = "OC_INVOICEINFO") // 发票信息表
public class InvoiceInfo extends HcpBaseModel {
	private static final long serialVersionUID = 5656133755509036257L;
	public static final String INVOICE_PRINTED = "1";
	public static final String INVOICE_UNPRINT = "0";
	public static final String PLUSMINUS_PLUS = "1";
	public static final String PLUSMINUS_MINUS = "-1";
	public static final String CANCELED = "1";
	public static final String UN_CANCELED = "0";
	public static final String UN_BALANCE = "0";
	public static final String BALANCED = "1";
	public static final String INVOICE_SOURCE_REGIST = "1";//挂号来源
	public static final String INVOICE_SOURCE_PAY = "2";//收费来演
	private String patientId;
	private String regId;
	private String feeType; // 就诊类型|SEE_TYPE
	private String payType; // 待遇类别|PAY_TYPE
	private Integer plusMinus; // 正负类型|1正-1负
	private String invoiceNo;
	private BigDecimal totCost;
	private BigDecimal pubCost;
	private BigDecimal ownCost;
	private String rebateType; // 减免类型|REBATE_TYPE
	private BigDecimal rebateCost;
	private String payId;
	private String invoiceOper;
	private String invoiceOperName;
	private String printState;
	private Date invoiceTime;
	private String printLastNo;
	private String cancelFlag;// 0-未取消 1-取消
	private String cancelOper;
	private String cancelOperName;
	private Date cancelTime;
	private String isbalance;// 0-未 1-已经结账
	private String balanceId;
	private Date balanceTime;
	private String comm;
	private String invoiceSource;
	private String invoiceType;
	private Patient patientInfo;

	// 退费、发票重打 @Transient
	private Date startDate;
	private Date endDate;
	private String patientName;
	private String cardNo;
	// private List<PayWay> payWay;
	// private HcpUser chargeOper; //收款员信息

	@Transient
	public String getPatientId() {
		return patientId;
	}

	public void setPatientId(String patientId) {
		this.patientId = patientId;
	}

	public String getRegId() {
		return regId;
	}

	public void setRegId(String regId) {
		this.regId = regId;
	}

	public String getFeeType() {
		return feeType;
	}

	public void setFeeType(String feeType) {
		this.feeType = feeType;
	}

	public String getPayType() {
		return payType;
	}

	public void setPayType(String payType) {
		this.payType = payType;
	}

	public Integer getPlusMinus() {
		return plusMinus;
	}

	public void setPlusMinus(Integer plusMinus) {
		this.plusMinus = plusMinus;
	}

	public String getInvoiceNo() {
		return invoiceNo;
	}

	public void setInvoiceNo(String invoiceNo) {
		this.invoiceNo = invoiceNo;
	}

	public BigDecimal getTotCost() {
		return totCost;
	}

	public void setTotCost(BigDecimal totCost) {
		this.totCost = totCost;
	}

	public BigDecimal getPubCost() {
		return pubCost;
	}

	public void setPubCost(BigDecimal pubCost) {
		this.pubCost = pubCost;
	}

	public BigDecimal getOwnCost() {
		return ownCost;
	}

	public void setOwnCost(BigDecimal ownCost) {
		this.ownCost = ownCost;
	}

	public String getRebateType() {
		return rebateType;
	}

	public void setRebateType(String rebateType) {
		this.rebateType = rebateType;
	}

	public BigDecimal getRebateCost() {
		return rebateCost;
	}

	public void setRebateCost(BigDecimal rebateCost) {
		this.rebateCost = rebateCost;
	}

	public String getPayId() {
		return payId;
	}

	public void setPayId(String payId) {
		this.payId = payId;
	}

	public String getInvoiceOper() {
		return invoiceOper;
	}

	public void setInvoiceOper(String invoiceOper) {
		this.invoiceOper = invoiceOper;
	}

	public String getPrintState() {
		return printState;
	}

	public void setPrintState(String printState) {
		this.printState = printState;
	}

	@Column(name = "INVOICE_TIME")
	@JsonFormat(pattern = "yyyy-MM-dd", timezone = "GMT+8")
	public Date getInvoiceTime() {
		return invoiceTime;
	}

	public void setInvoiceTime(Date invoiceTime) {
		this.invoiceTime = invoiceTime;
	}

	public String getPrintLastNo() {
		return printLastNo;
	}

	public void setPrintLastNo(String printLastNo) {
		this.printLastNo = printLastNo;
	}

	public String getCancelFlag() {
		return cancelFlag;
	}

	public void setCancelFlag(String cancelFlag) {
		this.cancelFlag = cancelFlag;
	}

	public String getCancelOper() {
		return cancelOper;
	}

	public void setCancelOper(String cancelOper) {
		this.cancelOper = cancelOper;
	}

	@Column(name = "CANCEL_TIME")
	@JsonFormat(pattern = "yyyy-MM-dd", timezone = "GMT+8")
	public Date getCancelTime() {
		return cancelTime;
	}

	public void setCancelTime(Date cancelTime) {
		this.cancelTime = cancelTime;
	}

	public String getIsbalance() {
		return isbalance;
	}

	public void setIsbalance(String isbalance) {
		this.isbalance = isbalance;
	}

	public String getBalanceId() {
		return balanceId;
	}

	public void setBalanceId(String balanceId) {
		this.balanceId = balanceId;
	}

	@Column(name = "BALANCE_TIME")
	@JsonFormat(pattern = "yyyy-MM-dd", timezone = "GMT+8")
	public Date getBalanceTime() {
		return balanceTime;
	}

	public void setBalanceTime(Date balanceTime) {
		this.balanceTime = balanceTime;
	}

	public String getComm() {
		return comm;
	}

	public void setComm(String comm) {
		this.comm = comm;
	}

	@JoinColumn(name = "PATIENT_ID", nullable = true)
	@ManyToOne // (cascade=(CascadeType.REFRESH)) 要把patient.id传回来，就不会报级联相关错误
	@NotFound(action=NotFoundAction.IGNORE)
	public Patient getPatientInfo() {
		return patientInfo;
	}

	public void setPatientInfo(Patient patientInfo) {
		this.patientInfo = patientInfo;
	}

	@Transient
	public Date getStartDate() {
		return startDate;
	}

	public void setStartDate(Date startDate) {
		this.startDate = startDate;
	}

	@Transient
	public Date getEndDate() {
		return endDate;
	}

	public void setEndDate(Date endDate) {
		this.endDate = endDate;
	}

	public String getInvoiceOperName() {
		return invoiceOperName;
	}

	public void setInvoiceOperName(String invoiceOperName) {
		this.invoiceOperName = invoiceOperName;
	}

	@Transient
	public String getPatientName() {
		return patientName;
	}

	public void setPatientName(String patientName) {
		this.patientName = patientName;
	}

	public String getCancelOperName() {
		return cancelOperName;
	}

	public void setCancelOperName(String cancelOperName) {
		this.cancelOperName = cancelOperName;
	}

	@Transient
	public String getCardNo() {
		return cardNo;
	}

	public void setCardNo(String cardNo) {
		this.cardNo = cardNo;
	}
	// @JoinColumn(name = "INVOICE_NO")
	// @OneToMany
	// public List<PayWay> getPayWay() {
	// return payWay;
	// }
	//
	// public void setPayWay(List<PayWay> payWay) {
	// this.payWay = payWay;
	// }

	public String getInvoiceSource() {
		return invoiceSource;
	}

	public void setInvoiceSource(String invoiceSource) {
		this.invoiceSource = invoiceSource;
	}

	public String getInvoiceType() {
		return invoiceType;
	}

	public void setInvoiceType(String invoiceType) {
		this.invoiceType = invoiceType;
	}

	// @JoinColumn(name = "INVOICE_OPER")
	// @OneToOne
	// public HcpUser getChargeOper() {
	// return chargeOper;
	// }
	//
	// public void setChargeOper(HcpUser chargeOper) {
	// this.chargeOper = chargeOper;
	// }
}
