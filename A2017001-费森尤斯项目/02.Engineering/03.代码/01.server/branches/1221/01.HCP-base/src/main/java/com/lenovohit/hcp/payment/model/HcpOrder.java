package com.lenovohit.hcp.payment.model;

import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.Table;

import com.lenovohit.core.model.BaseIdModel;

@Entity
@Table(name = "HCP_ORDER") // 收银台-订单表
public class HcpOrder extends BaseIdModel {
	public static final String ORDER_TYPE_PAY = "OP";
	public static final String ORDER_TYPE_REFUND = "OR";
	public static final String ORDER_TYPE_CANCEL = "OC";

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

	public HcpOrder() {
	}

	public HcpOrder(String orderNo, String operator, BigDecimal amt) {
		this.orderNo = orderNo;
		this.operator = operator;
		this.amt = amt;
	}

	private static final long serialVersionUID = 1L;

	private String orderNo;

	private String orderType;// 订单类型 SP - 支付 SR - 退款 SC - 撤销

	private String orderTitle;

	private String orderDesc;

	private BigDecimal amt;

	private BigDecimal realAmt;

	private BigDecimal lastAmt;

	private BigDecimal paAmt;

	private BigDecimal miAmt;

	private BigDecimal selfAmt;

	private String status;// 订单状态A-初始化 0-交易成功 1-支付成功 2-支付失败 3-通知应用失败 4-交易完成
							// 5-退款中 6-退款失败 7-退款成功 8-交易异常 9-交易关闭

	private String hisNo;

	private String patientNo;

	private String patientName;

	private String patientIdNo;

	private String patientCardNo;

	private String patientCardType;

	private String inpatientId;

	private String terminalId;

	private String terminalCode;

	private String terminalName;

	private String terminalUser;

	private String machineId;

	private String machineCode;

	private String machineName;

	private String machineMac;

	private String machineUser;

	private String bizType;

	private String bizNo;

	private String bizUrl;

	private String bizBean;

	private Date createTime;

	private Date tranTime;

	private Date finishTime;

	private String outTime;

	private String oriOrderId;

	private String operator;

	public String getOrderNo() {
		return orderNo;
	}

	public void setOrderNo(String orderNo) {
		this.orderNo = orderNo == null ? null : orderNo.trim();
	}

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

	public String getHisNo() {
		return hisNo;
	}

	public void setHisNo(String hisNo) {
		this.hisNo = hisNo == null ? null : hisNo.trim();
	}

	public String getPatientNo() {
		return patientNo;
	}

	public void setPatientNo(String patientNo) {
		this.patientNo = patientNo == null ? null : patientNo.trim();
	}

	public String getPatientName() {
		return patientName;
	}

	public void setPatientName(String patientName) {
		this.patientName = patientName == null ? null : patientName.trim();
	}

	public String getPatientIdNo() {
		return patientIdNo;
	}

	public void setPatientIdNo(String patientIdNo) {
		this.patientIdNo = patientIdNo == null ? null : patientIdNo.trim();
	}

	public String getPatientCardNo() {
		return patientCardNo;
	}

	public void setPatientCardNo(String patientCardNo) {
		this.patientCardNo = patientCardNo == null ? null : patientCardNo.trim();
	}

	public String getPatientCardType() {
		return patientCardType;
	}

	public void setPatientCardType(String patientCardType) {
		this.patientCardType = patientCardType == null ? null : patientCardType.trim();
	}

	public String getInpatientId() {
		return inpatientId;
	}

	public void setInpatientId(String inpatientId) {
		this.inpatientId = inpatientId == null ? null : inpatientId.trim();
	}

	public String getTerminalId() {
		return terminalId;
	}

	public void setTerminalId(String terminalId) {
		this.terminalId = terminalId == null ? null : terminalId.trim();
	}

	public String getTerminalCode() {
		return terminalCode;
	}

	public void setTerminalCode(String terminalCode) {
		this.terminalCode = terminalCode == null ? null : terminalCode.trim();
	}

	public String getTerminalName() {
		return terminalName;
	}

	public void setTerminalName(String terminalName) {
		this.terminalName = terminalName == null ? null : terminalName.trim();
	}

	public String getTerminalUser() {
		return terminalUser;
	}

	public void setTerminalUser(String terminalUser) {
		this.terminalUser = terminalUser == null ? null : terminalUser.trim();
	}

	public String getMachineId() {
		return machineId;
	}

	public void setMachineId(String machineId) {
		this.machineId = machineId == null ? null : machineId.trim();
	}

	public String getMachineCode() {
		return machineCode;
	}

	public void setMachineCode(String machineCode) {
		this.machineCode = machineCode == null ? null : machineCode.trim();
	}

	public String getMachineName() {
		return machineName;
	}

	public void setMachineName(String machineName) {
		this.machineName = machineName == null ? null : machineName.trim();
	}

	public String getMachineMac() {
		return machineMac;
	}

	public void setMachineMac(String machineMac) {
		this.machineMac = machineMac == null ? null : machineMac.trim();
	}

	public String getMachineUser() {
		return machineUser;
	}

	public void setMachineUser(String machineUser) {
		this.machineUser = machineUser == null ? null : machineUser.trim();
	}

	public String getBizType() {
		return bizType;
	}

	public void setBizType(String bizType) {
		this.bizType = bizType == null ? null : bizType.trim();
	}

	public String getBizNo() {
		return bizNo;
	}

	public void setBizNo(String bizNo) {
		this.bizNo = bizNo == null ? null : bizNo.trim();
	}

	public String getBizUrl() {
		return bizUrl;
	}

	public void setBizUrl(String bizUrl) {
		this.bizUrl = bizUrl == null ? null : bizUrl.trim();
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

	public String getOriOrderId() {
		return oriOrderId;
	}

	public void setOriOrderId(String oriOrderId) {
		this.oriOrderId = oriOrderId == null ? null : oriOrderId.trim();
	}

	public String getOperator() {
		return operator;
	}

	public void setOperator(String operator) {
		this.operator = operator;
	}
}