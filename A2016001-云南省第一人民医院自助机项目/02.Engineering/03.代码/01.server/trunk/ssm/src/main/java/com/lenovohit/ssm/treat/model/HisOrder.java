package com.lenovohit.ssm.treat.model;

/**
 * 非持久化类，用于传输数据
 * @author xiaweiyi
 *
 */
public class HisOrder {
	
	private String rechargeNumber;	//HIS预存流水号 zzxt_yhjymx jlid
	private String patientNo;		//病人编号	
	private String patientName;		//病人姓名
	private String paymentWay;		//交易方式 0：银行卡 1：支付宝 2：微信
	private String account;			//支付宝、微信用户在第三方平台的ID 或者银行卡号
	private String accountName;		//户名
	private String cardType;		//卡类型 0：信用卡 1：非信用卡,非银行卡交易值为空
	private String cardBankCode;	//发卡行行号 9999 支付宝9998 微信以及银联返回的发卡行代码
	private String recharge;		//预存金额
	private String refund;			//已退款金额
	private String outTradeNo;		//原交易号、银联检索参考号
	private String paymentTime;		//交易时间
	
	private String frozenNumber;	//HIS预冻结流水号  新 zzxt_yhjymx jlid， 老 cw_ycmx jlid
    private String serialNumber;	//HIS预存交易流水号 cw_ycmx jlid
	private String balance;			//预存余额；
	private String allowRefund;		//允许退款金额
	private String amount;			//退款金额
	private String machineId;		//自助机编号
	private String machineCode;		//自助机编号
	private String machineBankCode; //自助机所属银行代码
	private String tranBankCode;	//交易银行代码
	private String tranDate;		//交易日期
	private String tranTime;		//交易时间
	private String areaCode; 		//院区代码
	private String hisUserId;		//HIS用户
	private String frozenTime;		//预冻结时间
	private String notifySource;	//来源
	
	
	private String startTime;		//开始时间Yyyy-mm-dd
	private String endTime;			//结束时间Yyyy-mm-dd

	public String getRechargeNumber() {
		return rechargeNumber;
	}
	public void setRechargeNumber(String rechargeNumber) {
		this.rechargeNumber = rechargeNumber;
	}
	public String getFrozenNumber() {
		return frozenNumber;
	}
	public void setFrozenNumber(String frozenNumber) {
		this.frozenNumber = frozenNumber;
	}
	
	public String getSerialNumber() {
		return serialNumber;
	}
	public void setSerialNumber(String serialNumber) {
		this.serialNumber = serialNumber;
	}
	public String getPatientNo() {
		return patientNo;
	}
	public void setPatientNo(String patientNo) {
		this.patientNo = patientNo;
	}
	public String getPatientName() {
		return patientName;
	}
	public void setPatientName(String patientName) {
		this.patientName = patientName;
	}
	public String getPaymentWay() {
		return paymentWay;
	}
	public void setPaymentWay(String paymentWay) {
		this.paymentWay = paymentWay;
	}
	public String getAccount() {
		return account;
	}
	public void setAccount(String account) {
		this.account = account;
	}
	public String getCardType() {
		return cardType;
	}
	public void setCardType(String cardType) {
		this.cardType = cardType;
	}
	public String getCardBankCode() {
		return cardBankCode;
	}
	public void setCardBankCode(String cardBankCode) {
		this.cardBankCode = cardBankCode;
	}
	public String getRecharge() {
		return recharge;
	}
	public void setRecharge(String recharge) {
		this.recharge = recharge;
	}
	public String getRefund() {
		return refund;
	}
	public void setRefund(String refund) {
		this.refund = refund;
	}
	public String getOutTradeNo() {
		return outTradeNo;
	}
	public void setOutTradeNo(String outTradeNo) {
		this.outTradeNo = outTradeNo;
	}
	public String getPaymentTime() {
		return paymentTime;
	}
	public void setPaymentTime(String paymentTime) {
		this.paymentTime = paymentTime;
	}
	public String getAmount() {
		return amount;
	}
	public void setAmount(String amount) {
		this.amount = amount;
	}
	public String getMachineCode() {
		return machineCode;
	}
	public void setMachineCode(String machineCode) {
		this.machineCode = machineCode;
	}
	public String getMachineBankCode() {
		return machineBankCode;
	}
	public void setMachineBankCode(String machineBankCode) {
		this.machineBankCode = machineBankCode;
	}
	public String getTranBankCode() {
		return tranBankCode;
	}
	public void setTranBankCode(String tranBankCode) {
		this.tranBankCode = tranBankCode;
	}
	public String getAreaCode() {
		return areaCode;
	}
	public void setAreaCode(String areaCode) {
		this.areaCode = areaCode;
	}
	public String getHisUserId() {
		return hisUserId;
	}
	public void setHisUserId(String hisUserId) {
		this.hisUserId = hisUserId;
	}
	public String getBalance() {
		return balance;
	}
	public void setBalance(String balance) {
		this.balance = balance;
	}
	public String getAllowRefund() {
		return allowRefund;
	}
	public void setAllowRefund(String allowRefund) {
		this.allowRefund = allowRefund;
	}
	public String getFrozenTime() {
		return frozenTime;
	}
	public void setFrozenTime(String frozenTime) {
		this.frozenTime = frozenTime;
	}
	public String getAccountName() {
		return accountName;
	}
	public void setAccountName(String accountName) {
		this.accountName = accountName;
	}
	public String getTranDate() {
		return tranDate;
	}
	public void setTranDate(String tranDate) {
		this.tranDate = tranDate;
	}
	public String getTranTime() {
		return tranTime;
	}
	public void setTranTime(String tranTime) {
		this.tranTime = tranTime;
	}
	public String getStartTime() {
		return startTime;
	}
	public void setStartTime(String startTime) {
		this.startTime = startTime;
	}
	public String getEndTime() {
		return endTime;
	}
	public void setEndTime(String endTime) {
		this.endTime = endTime;
	}
	public String getNotifySource() {
		return notifySource;
	}
	public void setNotifySource(String notifySource) {
		this.notifySource = notifySource;
	}
	public String getMachineId() {
		return machineId;
	}
	public void setMachineId(String machineId) {
		this.machineId = machineId;
	}
	
}
