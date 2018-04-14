package com.lenovohit.ssm.treat.model;
/**
 * 预存记录
 *
 */
public class ForegiftRecord {
    
    private String requestNo;   //请求流水号
    private String cardNo;      //卡号
    private String paymentWay;  //支付类型
    private String outTradeNo;  //订单号
    private String amount;      //金额
    private String userId;      //用户id
    private String paymentTime; //交易时间  Yyyy-mm-dd hh24:mi:ss
    private String patientNo;	//病人编号
    
    private String balance;		//余额 2位小数
    
    private String receipt;		//HiS住院预缴收据
    
    
    public String getRequestNo() {
        return requestNo;
    }
    public void setRequestNo(String requestNo) {
        this.requestNo = requestNo;
    }
    public String getCardNo() {
        return cardNo;
    }
    public void setCardNo(String cardNo) {
        this.cardNo = cardNo;
    }
    public String getPaymentWay() {
        return paymentWay;
    }
    public void setPaymentWay(String paymentWay) {
        this.paymentWay = paymentWay;
    }
    public String getOutTradeNo() {
        return outTradeNo;
    }
    public void setOutTradeNo(String outTradeNo) {
        this.outTradeNo = outTradeNo;
    }
    public String getAmount() {
        return amount;
    }
    public void setAmount(String amount) {
        this.amount = amount;
    }
    public String getUserId() {
        return userId;
    }
    public void setUserId(String userId) {
        this.userId = userId;
    }
    public String getPaymentTime() {
        return paymentTime;
    }
    public void setPaymentTime(String paymentTime) {
        this.paymentTime = paymentTime;
    }
	public String getPatientNo() {
		return patientNo;
	}
	public void setPatientNo(String patientNo) {
		this.patientNo = patientNo;
	}
	public String getBalance() {
		return balance;
	}
	public void setBalance(String balance) {
		this.balance = balance;
	}
	public String getReceipt() {
		return receipt;
	}
	public void setReceipt(String receipt) {
		this.receipt = receipt;
	}
}
