package com.lenovohit.hcp.payment.model;

import java.math.BigDecimal;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.lenovohit.core.model.BaseIdModel;

@Entity
@Table(name = "HCP_SETTLEMENT")
public class HcpSettlement extends BaseIdModel {
	private static final long serialVersionUID = 1L;
	public static final String SETTLE_TYPE_PAY = "SP";// 支付
	public static final String SETTLE_TYPE_REFUND = "SR";// 退款
	public static final String SETTLE_TYPE_CANCEL = "SC";// 撤销

	public static final String SETTLE_STAT_INITIAL = "A";// 初始化
	public static final String SETTLE_STAT_PAY_SUCCESS = "0";// 支付成功
	public static final String SETTLE_STAT_PAY_FAILURE = "1";// 支付失败
	public static final String SETTLE_STAT_PAY_FINISH = "2";// 支付完成
	public static final String SETTLE_STAT_REFUNDING = "5";// 正在退款
	public static final String SETTLE_STAT_REFUND_FAILURE = "6";// 退款失败
	public static final String SETTLE_STAT_REFUND_SUCCESS = "7";// 退款成功
	public static final String SETTLE_STAT_EXCEPTIONAL = "8";// 异常
	public static final String SETTLE_STAT_CLOSED = "9";// 关闭 超时关闭 手工关闭 废单

	public static final String SETTLE_TRADE_SUCCESS = "0";// 交易成功
	public static final String SETTLE_TRADE_FAILURE = "1";// 交易失败
	public static final String SETTLE_TRADE_CLOSED = "9";// 交易关闭
	public static final String SETTLE_TRADE_EXCEPTIONAL = "E";// 交易异常

	private String settleNo;

	private String settleType;

	private BigDecimal amt;

	private BigDecimal realAmt;

	private String settleTitle;

	private String settleDesc;

	private String terminalId;

	private String terminalCode;

	private String terminalName;

	private String terminalUser;

	private String machineId;

	private String machineCode;

	private String machineName;

	private String machineMac;

	private String machineUser;

	private String payChannelId;

	private String payChannelCode;

	private String payChannelName;

	private String payTypeId;

	private String payTypeCode;

	private String payTypeName;

	private String payerNo;

	private String payerName;

	private String payerAccount;

	private String payerAcctType;

	private String payerAcctBank;

	private String payerPhone;

	private String payerIp;

	private String tradeNo;

	private Date tradeTime;

	private String tradeStatus;

	private String tradeRspCode;

	private String tradeRspMsg;

	private Date createTime;

	private Date finishTime;

	private String outTime;

	private String orderId;

	private HcpOrder order;

	private String oriSettleId;
	private HcpSettlement oriSettlement;
	private String checkStat;

	private Date checkTime;

	private Integer syncNum;

	private String qrCode;

	private String status;

	private String respText;
	private Map<String, Object> variables = new HashMap<String, Object>();

	public String getSettleNo() {
		return settleNo;
	}

	public void setSettleNo(String settleNo) {
		this.settleNo = settleNo == null ? null : settleNo.trim();
	}

	public String getSettleType() {
		return settleType;
	}

	public void setSettleType(String settleType) {
		this.settleType = settleType == null ? null : settleType.trim();
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

	public String getSettleTitle() {
		return settleTitle;
	}

	public void setSettleTitle(String settleTitle) {
		this.settleTitle = settleTitle == null ? null : settleTitle.trim();
	}

	public String getSettleDesc() {
		return settleDesc;
	}

	public void setSettleDesc(String settleDesc) {
		this.settleDesc = settleDesc == null ? null : settleDesc.trim();
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

	public String getPayChannelId() {
		return payChannelId;
	}

	public void setPayChannelId(String payChannelId) {
		this.payChannelId = payChannelId == null ? null : payChannelId.trim();
	}

	public String getPayChannelCode() {
		return payChannelCode;
	}

	public void setPayChannelCode(String payChannelCode) {
		this.payChannelCode = payChannelCode == null ? null : payChannelCode.trim();
	}

	public String getPayChannelName() {
		return payChannelName;
	}

	public void setPayChannelName(String payChannelName) {
		this.payChannelName = payChannelName == null ? null : payChannelName.trim();
	}

	public String getPayTypeId() {
		return payTypeId;
	}

	public void setPayTypeId(String payTypeId) {
		this.payTypeId = payTypeId == null ? null : payTypeId.trim();
	}

	public String getPayTypeCode() {
		return payTypeCode;
	}

	public void setPayTypeCode(String payTypeCode) {
		this.payTypeCode = payTypeCode == null ? null : payTypeCode.trim();
	}

	public String getPayTypeName() {
		return payTypeName;
	}

	public void setPayTypeName(String payTypeName) {
		this.payTypeName = payTypeName == null ? null : payTypeName.trim();
	}

	public String getPayerNo() {
		return payerNo;
	}

	public void setPayerNo(String payerNo) {
		this.payerNo = payerNo == null ? null : payerNo.trim();
	}

	public String getPayerName() {
		return payerName;
	}

	public void setPayerName(String payerName) {
		this.payerName = payerName == null ? null : payerName.trim();
	}

	public String getPayerAccount() {
		return payerAccount;
	}

	public void setPayerAccount(String payerAccount) {
		this.payerAccount = payerAccount == null ? null : payerAccount.trim();
	}

	public String getPayerAcctType() {
		return payerAcctType;
	}

	public void setPayerAcctType(String payerAcctType) {
		this.payerAcctType = payerAcctType == null ? null : payerAcctType.trim();
	}

	public String getPayerAcctBank() {
		return payerAcctBank;
	}

	public void setPayerAcctBank(String payerAcctBank) {
		this.payerAcctBank = payerAcctBank == null ? null : payerAcctBank.trim();
	}

	public String getPayerPhone() {
		return payerPhone;
	}

	public void setPayerPhone(String payerPhone) {
		this.payerPhone = payerPhone == null ? null : payerPhone.trim();
	}

	public String getPayerIp() {
		return payerIp;
	}

	public void setPayerIp(String payerIp) {
		this.payerIp = payerIp == null ? null : payerIp.trim();
	}

	public String getTradeNo() {
		return tradeNo;
	}

	public void setTradeNo(String tradeNo) {
		this.tradeNo = tradeNo == null ? null : tradeNo.trim();
	}

	public String getTradeStatus() {
		return tradeStatus;
	}

	public void setTradeStatus(String tradeStatus) {
		this.tradeStatus = tradeStatus == null ? null : tradeStatus.trim();
	}

	public String getTradeRspCode() {
		return tradeRspCode;
	}

	public void setTradeRspCode(String tradeRspCode) {
		this.tradeRspCode = tradeRspCode == null ? null : tradeRspCode.trim();
	}

	public String getTradeRspMsg() {
		return tradeRspMsg;
	}

	public void setTradeRspMsg(String tradeRspMsg) {
		this.tradeRspMsg = tradeRspMsg == null ? null : tradeRspMsg.trim();
	}

	public Date getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
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

	@ManyToOne
	@JoinColumn(name = "ORDER_ID")
	public HcpOrder getOrder() {
		return order;
	}

	public void setOrder(HcpOrder order) {
		this.order = order;
	}

	@Transient
	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId == null ? null : orderId.trim();
	}

	@ManyToOne
	@JoinColumn(name = "ORI_SETTLE_ID")
	public HcpSettlement getOriSettlement() {
		return oriSettlement;
	}

	public void setOriSettlement(HcpSettlement oriSettlement) {
		this.oriSettlement = oriSettlement;
	}

	@Transient
	public String getOriSettleId() {
		return oriSettleId;
	}

	public void setOriSettleId(String oriSettleId) {
		this.oriSettleId = oriSettleId == null ? null : oriSettleId.trim();
	}

	public String getCheckStat() {
		return checkStat;
	}

	public void setCheckStat(String checkStat) {
		this.checkStat = checkStat == null ? null : checkStat.trim();
	}

	public Date getCheckTime() {
		return checkTime;
	}

	public void setCheckTime(Date checkTime) {
		this.checkTime = checkTime;
	}

	public Integer getSyncNum() {
		return syncNum;
	}

	public void setSyncNum(Integer syncNum) {
		this.syncNum = syncNum;
	}

	public String getQrCode() {
		return qrCode;
	}

	public void setQrCode(String qrCode) {
		this.qrCode = qrCode == null ? null : qrCode.trim();
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status == null ? null : status.trim();
	}

	public String getRespText() {
		return respText;
	}

	public void setRespText(String respText) {
		this.respText = respText == null ? null : respText.trim();
	}

	@Transient
	public Map<String, Object> getVariables() {
		return variables;
	}

	public void setVariables(Map<String, Object> variables) {
		this.variables = variables;
	}

	public Date getTradeTime() {
		return tradeTime;
	}

	public void setTradeTime(Date tradeTime) {
		this.tradeTime = tradeTime;
	}
}