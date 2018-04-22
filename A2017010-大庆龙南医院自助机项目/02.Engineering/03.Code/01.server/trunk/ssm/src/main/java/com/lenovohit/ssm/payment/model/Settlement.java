package com.lenovohit.ssm.payment.model;

import java.math.BigDecimal;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.lenovohit.core.model.BaseIdModel;


@Entity
@Table(name="SSM_SETTLEMENT")
public class Settlement extends BaseIdModel{
	private static final long serialVersionUID = 2390477403094369238L;
	public static final String SETTLE_TYPE_PAY = "SP";//支付
	public static final String SETTLE_TYPE_REFUND = "SR";//退款
	public static final String SETTLE_TYPE_CANCEL = "SC";//撤销
	public static final String SETTLE_TYPE_REVERSE = "RS";//支付冲账
	
	
	public static final String SETTLE_STAT_INITIAL = "A";// 初始化
	public static final String SETTLE_STAT_PAY_SUCCESS = "0";// 支付成功
	public static final String SETTLE_STAT_PAY_FAILURE = "1";// 支付失败
	public static final String SETTLE_STAT_PAY_FINISH = "2";// 支付完成 
	public static final String SETTLE_STAT_REFUNDING = "5";// 正在退款
	public static final String SETTLE_STAT_REFUND_FAILURE = "6";// 退款失败
	public static final String SETTLE_STAT_REFUND_SUCCESS = "7";// 退款成功
	public static final String SETTLE_STAT_REFUND_CANCELED= "8";//被撤销的
	public static final String SETTLE_STAT_CLOSED = "9";// 关闭  超时关闭  手工关闭  废单
	public static final String SETTLE_STAT_EXCEPTIONAL = "E";// 异常  
	public static final String SETTLE_STAT_REVERSE = "R";// 冲账
	
	public static final String SETTLE_TRADE_INITIAL = "A";// 交易成功
	public static final String SETTLE_TRADE_SUCCESS = "0";// 交易成功
	public static final String SETTLE_TRADE_FAILURE = "1";// 交易失败
	public static final String SETTLE_TRADE_CLOSED = "9";// 交易关闭
	public static final String SETTLE_TRADE_EXCEPTIONAL = "E";// 交易异常
	
	//基本信息
	private String settleNo;//结算单号	
	private String settleType;//结算类型	 【支付  退款 撤销】
	private String settleTitle;//结算单标题
	private String settleDesc;//结算单描述
	private BigDecimal amt = new BigDecimal(0) ;//结算单金额
	private BigDecimal realAmt = new BigDecimal(0) ;//实际支付完成的金额
	private BigDecimal oriAmt = new BigDecimal(0) ;//原交易金额
	private String qrCode;//支付二维码
	private String status;//结算状态
	
	//渠道信息 【 银联 支付宝 微信  现金】
	private String payChannelId;//支付渠道 
	private String payChannelCode;//支付渠道编码
	private String payChannelName;//支付渠道名称
	
	//支付方式 
	// 银联【 pos 闪付 网关 主扫  被扫 】
	// 微信 支付宝 【主扫  被扫 网关】
	// 现金 【 钱箱 】
	// 余额支付
	private String payTypeId;//支付方式
	private String payTypeCode;//支付方式
	private String payTypeName;//支付方式名称
	
	//付款人信息
	private String payerNo;			// 付款人编号
	private String payerName;		// 付款人名称
	private String payerAccount;	// 付款人账户
	private String payerAcctType;	// 付款人账户类型
	private String payerAcctBank;	// 付款人账户所属银行
	private String payerPhone;		// 付款人手机号
	private String payerLogin;
	
	//终端信息 银联有单独的POS终端设备号
	private String terminalId;//终端ID
	private String terminalCode;//终端编号
	private String terminalName;//终端名称
	private String terminalUser;//终端用户
	
	//自助机信息
	private String machineId;//自助机id
	private String machineMac;//自助机mac地址
	private String machineCode;//自助机编码
	private String machineName;//自助机名称
	private String machineUser;//自助机用户
	private String machineMngCode;//自助机管理方编号
	
	//交易信息
	private String tradeNo;//交易流水 ---支付渠道流水
	private Date tradeTime;//交易时间 
	private String tradeStatus;//交易状态
	private String tradeRspCode;//交易返回码
	private String tradeRspMsg;//交易返回说明
	
	private String respText;//回调返回报文全文
	
	//审计信息
	private Date createTime;//创建时间	
	private Date finishTime;//完成时间	
	private String outTime;//超时时间
	
	//对账信息
	private int syncNum;//同步对账次数
	private String checkTime;//	对账时间
	private String checkStat;//	对账状态
	
	private Order order;
	private PayChannel payChannel;
	private Settlement oriSettlement;//原流水
	
	private String printStat;//		打印状态
	private String printBatchNo;//	打印批次号
	private String flag;//更新标记
	
	private Map<String, Object> variables = new HashMap<String, Object>();
	
	public String getMachineCode() {
		return machineCode;
	}
	public void setMachineCode(String machineCode) {
		this.machineCode = machineCode;
	}
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
	public BigDecimal getOriAmt() {
		return oriAmt;
	}
	public void setOriAmt(BigDecimal oriAmt) {
		this.oriAmt = oriAmt;
	}
	public String getSettleTitle() {
		return settleTitle;
	}
	public void setSettleTitle(String settleTitle) {
		this.settleTitle = settleTitle;
	}
	public String getSettleDesc() {
		return settleDesc;
	}
	public void setSettleDesc(String settleDesc) {
		this.settleDesc = settleDesc;
	}
	public String getTerminalId() {
		return terminalId;
	}
	public void setTerminalId(String terminalId) {
		this.terminalId = terminalId;
	}
	public String getTerminalCode() {
		return terminalCode;
	}
	public void setTerminalCode(String terminalCode) {
		this.terminalCode = terminalCode;
	}
	public String getTerminalUser() {
		return terminalUser;
	}
	public void setTerminalUser(String terminalUser) {
		this.terminalUser = terminalUser;
	}
	public String getTerminalName() {
		return terminalName;
	}
	public void setTerminalName(String terminalName) {
		this.terminalName = terminalName;
	}
	@Transient
	public String getPayChannelId() {
		if(null != this.payChannel)
			return this.payChannel.getId();
		return payChannelId;
	}
	public void setPayChannelId(String payChannelId) {
		this.payChannelId = payChannelId;
	}
	public String getPayChannelCode() {
		return payChannelCode;
	}
	public void setPayChannelCode(String payChannelCode) {
		this.payChannelCode = payChannelCode;
	}
	public String getPayChannelName() {
		return payChannelName;
	}
	public void setPayChannelName(String payChannelName) {
		this.payChannelName = payChannelName;
	}
	public String getPayTypeId() {
		return payTypeId;
	}
	public void setPayTypeId(String payTypeId) {
		this.payTypeId = payTypeId;
	}
	public String getPayTypeCode() {
		return payTypeCode;
	}
	public void setPayTypeCode(String payTypeCode) {
		this.payTypeCode = payTypeCode;
	}
	public String getPayTypeName() {
		return payTypeName;
	}
	public void setPayTypeName(String payTypeName) {
		this.payTypeName = payTypeName;
	}
	public String getPayerNo() {
		return payerNo;
	}
	public void setPayerNo(String payerNo) {
		this.payerNo = payerNo;
	}
	public String getPayerName() {
		return payerName;
	}
	public void setPayerName(String payerName) {
		this.payerName = payerName;
	}
	public String getPayerAccount() {
		return payerAccount;
	}
	public void setPayerAccount(String payerAccount) {
		this.payerAccount = payerAccount;
	}
	public String getPayerPhone() {
		return payerPhone;
	}
	public void setPayerPhone(String payerPhone) {
		this.payerPhone = payerPhone;
	}
	public String getPayerLogin() {
		return payerLogin;
	}
	public void setPayerLogin(String payerLogin) {
		this.payerLogin = payerLogin;
	}
	public String getTradeNo() {
		return tradeNo;
	}
	public void setTradeNo(String tradeNo) {
		this.tradeNo = tradeNo;
	}
	@JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
	public Date getTradeTime() {
		return tradeTime;
	}
	public void setTradeTime(Date tradeTime) {
		this.tradeTime = tradeTime;
	}
	public String getTradeStatus() {
		return tradeStatus;
	}
	public void setTradeStatus(String tradeStatus) {
		this.tradeStatus = tradeStatus;
	}
	public String getTradeRspCode() {
		return tradeRspCode;
	}
	public void setTradeRspCode(String tradeRspCode) {
		this.tradeRspCode = tradeRspCode;
	}
	public String getTradeRspMsg() {
		return tradeRspMsg;
	}
	public void setTradeRspMsg(String tradeRspMsg) {
		this.tradeRspMsg = tradeRspMsg;
	}
	@JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
	public Date getCreateTime() {
		return createTime;
	}
	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}
	@JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
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
		this.outTime = outTime;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getCheckStat() {
		return checkStat;
	}
	public void setCheckStat(String checkStat) {
		this.checkStat = checkStat;
	}
	public String getCheckTime() {
		return checkTime;
	}
	public void setCheckTime(String checkTime) {
		this.checkTime = checkTime;
	}
	public int getSyncNum() {
		return syncNum;
	}
	public void setSyncNum(int syncNum) {
		this.syncNum = syncNum;
	}
	public String getQrCode() {
		return qrCode;
	}
	public void setQrCode(String qrCode) {
		this.qrCode = qrCode;
	}
	
	@ManyToOne
	@JoinColumn(name="ORDER_ID")
	public Order getOrder() {
		return order;
	}
	public void setOrder(Order order) {
		this.order = order;
	}
	@ManyToOne
	@JoinColumn(name="ORI_SETTLE_ID")
	public Settlement getOriSettlement() {
		return oriSettlement;
	}
	public void setOriSettlement(Settlement oriSettlement) {
		this.oriSettlement = oriSettlement;
	}
	@Transient
	public Map<String, Object> getVariables() {
		return variables;
	}
	public void setVariables(Map<String, Object> variables) {
		this.variables = variables;
	}
	public String getMachineId() {
		return machineId;
	}
	public void setMachineId(String machineId) {
		this.machineId = machineId;
	}
	public String getMachineMac() {
		return machineMac;
	}
	public void setMachineMac(String machineMac) {
		this.machineMac = machineMac;
	}
	public String getMachineName() {
		return machineName;
	}
	public void setMachineName(String machineName) {
		this.machineName = machineName;
	}
	public String getRespText() {
		return respText;
	}
	public void setRespText(String respText) {
		this.respText = respText;
	}
	public String getPayerAcctType() {
		return payerAcctType;
	}
	public void setPayerAcctType(String payerAcctType) {
		this.payerAcctType = payerAcctType;
	}
	public String getMachineUser() {
		return machineUser;
	}
	public void setMachineUser(String machineUser) {
		this.machineUser = machineUser;
	}
	public String getMachineMngCode() {
		return machineMngCode;
	}
	public void setMachineMngCode(String machineMngCode) {
		this.machineMngCode = machineMngCode;
	}
	@ManyToOne
	@JoinColumn(name="PAY_CHANNEL_ID")
	public PayChannel getPayChannel() {
		return payChannel;
	}
	public void setPayChannel(PayChannel payChannel) {
		this.payChannel = payChannel;
	}
	public String getPayerAcctBank() {
		return payerAcctBank;
	}
	public void setPayerAcctBank(String payerAcctBank) {
		this.payerAcctBank = payerAcctBank;
	}
	public String getPrintStat() {
		return printStat;
	}
	public void setPrintStat(String printStat) {
		this.printStat = printStat;
	}
	public String getPrintBatchNo() {
		return printBatchNo;
	}
	public void setPrintBatchNo(String printBatchNo) {
		this.printBatchNo = printBatchNo;
	}
	public String getFlag() {
		return flag;
	}
	public void setFlag(String flag) {
		this.flag = flag;
	}
}
