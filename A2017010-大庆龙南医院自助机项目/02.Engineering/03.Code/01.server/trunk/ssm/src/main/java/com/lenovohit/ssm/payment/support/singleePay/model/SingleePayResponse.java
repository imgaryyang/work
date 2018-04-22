package com.lenovohit.ssm.payment.support.singleePay.model;

import java.io.Serializable;
import java.io.UnsupportedEncodingException;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.apache.cxf.common.util.StringUtils;

import com.lenovohit.core.utils.DateUtils;

public class SingleePayResponse implements Serializable {
	private static final long serialVersionUID = 2027415790150844217L;

	public SingleePayResponse(String respText) throws UnsupportedEncodingException {
		this.respText = respText;
		System.out.println(respText);
		
		this.chars = respText.getBytes("GBK");
		
//		String temp = new String(this.respText.getBytes("GBK"),"GBK");
//		System.out.println("temp :"+temp.length());
		System.out.println("respText :"+respText.length());
		System.out.println("chars :"+chars.length);
		if (StringUtils.isEmpty(respText))
			return;
		if (chars.length != 263) 
			return;
		
		String respCode = this.sub(this.chars, 0, 6);//.trim();// 1 返回码 1-6 6 
		System.out.println("respCode : "+respCode+",lenght "+respCode.getBytes("GBK").length);
		this.respCode = respCode.trim();
		
		String respInfo = this.sub(this.chars, 6, 46);//.trim();//2 返回码含义 7-46 40 
		System.out.println("respInfo : "+respInfo+",lenght "+respInfo.getBytes("GBK").length);
		this.respInfo  = respInfo.trim();
		if(!"000000".equals(this.respCode))return;//非正常交易可能导致数组越界
		
		String trace = this.sub(this.chars, 46, 52);//.trim();// 3 POS 流水号 47-52 6 
		System.out.println("trace : "+trace+",lenght "+trace.getBytes("GBK").length);
		this.trace = trace.trim();
		
		String auth = this.sub(this.chars, 52, 58);//.trim();// 4 授权号 53-58 6 
		System.out.println("auth: "+auth+",lenght "+auth.getBytes("GBK").length);
		this.auth = auth.trim();
		
		String batch = this.sub(this.chars, 58, 64);//.trim();// 5 批次号 59-64 6 
		System.out.println("batch : "+batch+",lenght "+batch.getBytes("GBK").length);
		this.batch = batch.trim();
		
		String cardNo = this.sub(this.chars, 64, 83);//.trim();// 6 卡号 65-83 19 
		System.out.println("cardNo : "+cardNo+",lenght "+cardNo.getBytes("GBK").length);
		this.cardNo = cardNo.trim();
		
		String effectiveTime = this.sub(this.chars, 83, 87);//.trim();// 7 有效期 84-87 4 
		System.out.println("effectiveTime : "+effectiveTime+",lenght "+effectiveTime.getBytes("GBK").length);
		this.effectiveTime = effectiveTime.trim();
		
		String bankNo = this.sub(this.chars, 87, 89);//.trim();// 8 银行号 88-89 2 
		System.out.println("bankNo : "+bankNo+",lenght "+bankNo.getBytes("GBK").length);
		this.bankNo = bankNo.trim();
		
		String ref = this.sub(this.chars, 89, 101);//.trim();//9 参考号 90-101 12  
		System.out.println("ref : "+ref+",lenght "+ref.getBytes("GBK").length);
		this.ref = ref.trim();
		
		String tid = this.sub(this.chars, 101, 116);//.trim();//10 终端号 102-116 15 
		System.out.println("tid: "+tid+",lenght "+tid.getBytes("GBK").length);
		this.tid = tid.trim();
		
		String mid = this.sub(this.chars, 116, 131);//.trim();// 11 商户号 117-131 15 
		System.out.println("mid: "+mid+",lenght "+mid.getBytes("GBK").length);
		this.mid = mid.trim();
		
		String amount = this.sub(this.chars, 131, 143);//.trim();// 12 交易金额 132-143 12 
		System.out.println("amount : "+amount+",lenght "+amount.getBytes("GBK").length);
		this.amount = amount.trim();
		
		String transIndex = this.sub(this.chars, 143, 159);//.trim();// 13 交易索引号 144-159 16  
		System.out.println("transIndex : "+transIndex+",lenght "+transIndex.getBytes("GBK").length);
		this.transIndex = transIndex.trim();
		
		
		String memo = this.sub(this.chars, 159, 233);//14 自定义域 160-234 74  
		System.out.println("memo: "+memo+",lenght "+memo.getBytes("GBK").length);
		this.memo = memo.trim();
		
		String issueBankNo = this.sub(this.chars, 233, 241);//.trim();// 15 发卡行代码 235-242 8  
		System.out.println("issueBankNo : "+issueBankNo+",lenght "+issueBankNo.getBytes("GBK").length);
		this.issueBankNo = issueBankNo.trim();
		Date date = new Date();
		//新版报文不返回时间，时间字段取系统当前时间
		// DateUtils.string2Date(DateUtils.getCurrentYear() + unionPay.getTransDate() + unionPay.getTransTime(), "yyyyMMddHHmmss")
		this.transDate = new SimpleDateFormat("yyyyMMdd").format(date);
		this.transTime = new SimpleDateFormat("HHmmss").format(date);
		
//		String transDate = this.sub(this.chars, 241, 249);//.trim();// 16 银行主机日期 243-251 8 
//		System.out.println("transDate : "+transDate+",lenght "+transDate.getBytes("GBK").length);
//		this.transDate = transDate.trim();
//		
//		String transTime = this.sub(this.chars, 249, 255);//.trim();// 17 银行主机时间 252-257 6 
//		System.out.println("transTime : "+transTime+",lenght "+transTime.getBytes("GBK").length);
//		this.transTime = transTime.trim();
		
		//新版报文只有263位，以下字符不能解析。
//		String orderNo = this.sub(this.chars, 255, 270);//.trim();// 18 订单号 256-270 15 
//		System.out.println("orderNo : "+orderNo+",lenght "+orderNo.getBytes("GBK").length);
//		this.orderNo = orderNo.trim();
//		
//		String tradeCode = this.sub(this.chars, 270, 272);//.trim();// 19 交易代码 271-272 2 
//		System.out.println("tradeCode : "+tradeCode+",lenght "+tradeCode.getBytes("GBK").length);
//		this.tradeCode = tradeCode.trim();
//		
//		String printType = this.sub(this.chars, 270, 277);//.trim();// 20 小票打印方式 273 1 
//		System.out.println("printType : "+printType+",lenght "+printType.getBytes("GBK").length);
//		this.printType = printType.trim();
	}

	private byte[] chars;
	private String respCode;
	private String respInfo;
	private String cardNo;
	private String amount = "0";
	private String trace;
	private String batch;
	private String transDate;
	private String transTime;
	private String ref;
	private String auth;
	private String mid;
	private String tid;
	private String memo;
	
	private String respText;
	private String settlementId;

	private String effectiveTime;
	private String bankNo;
	private String transIndex;
	private String issueBankNo;
	private String orderNo;
	private String tradeCode;
	private String printType;
	
	
	public byte[] getChars() {
		return chars;
	}

	public void setChars(byte[] chars) {
		this.chars = chars;
	}

	public String getEffectiveTime() {
		return effectiveTime;
	}

	public void setEffectiveTime(String effectiveTime) {
		this.effectiveTime = effectiveTime;
	}

	public String getBankNo() {
		return bankNo;
	}

	public void setBankNo(String bankNo) {
		this.bankNo = bankNo;
	}

	public String getTransIndex() {
		return transIndex;
	}

	public void setTransIndex(String transIndex) {
		this.transIndex = transIndex;
	}

	public String getIssueBankNo() {
		return issueBankNo;
	}

	public void setIssueBankNo(String issueBankNo) {
		this.issueBankNo = issueBankNo;
	}

	public String getOrderNo() {
		return orderNo;
	}

	public void setOrderNo(String orderNo) {
		this.orderNo = orderNo;
	}

	public String getTradeCode() {
		return tradeCode;
	}

	public void setTradeCode(String tradeCode) {
		this.tradeCode = tradeCode;
	}

	public String getPrintType() {
		return printType;
	}

	public void setPrintType(String printType) {
		this.printType = printType;
	}

	public String getRespCode() {
		return respCode;
	}

	public void setRespCode(String respCode) {
		this.respCode = respCode;
	}

	public String getRespInfo() {
		return respInfo;
	}

	public void setRespInfo(String respInfo) {
		this.respInfo = respInfo;
	}

	public String getCardNo() {
		return cardNo;
	}

	public void setCardNo(String cardNo) {
		this.cardNo = cardNo;
	}

	public String getAmount() {
		return amount;
	}

	public void setAmount(String amount) {
		this.amount = amount;
	}

	public String getTrace() {
		return trace;
	}

	public void setTrace(String trace) {
		this.trace = trace;
	}

	public String getBatch() {
		return batch;
	}

	public void setBatch(String batch) {
		this.batch = batch;
	}

	public String getTransDate() {
		return transDate;
	}

	public void setTransDate(String transDate) {
		this.transDate = transDate;
	}

	public String getTransTime() {
		return transTime;
	}

	public void setTransTime(String transTime) {
		this.transTime = transTime;
	}

	public String getRef() {
		return ref;
	}

	public void setRef(String ref) {
		this.ref = ref;
	}

	public String getAuth() {
		return auth;
	}

	public void setAuth(String auth) {
		this.auth = auth;
	}

	public String getMid() {
		return mid;
	}

	public void setMid(String mid) {
		this.mid = mid;
	}

	public String getTid() {
		return tid;
	}

	public void setTid(String tid) {
		this.tid = tid;
	}

	public String getMemo() {
		return memo;
	}

	public void setMemo(String memo) {
		this.memo = memo;
	}

	public String getRespText() {
		return respText;
	}

	public void setRespText(String respText) {
		this.respText = respText;
	}

	public String getSettlementId() {
		return settlementId;
	}

	public void setSettlementId(String settlementId) {
		this.settlementId = settlementId;
	}

	public static void main(String args[]) throws UnsupportedEncodingException {
		System.out.println("交易成功".getBytes("GBK").length);
		String msg = "000000交易成功                                000045A5432100011243674212174845534663810  72271259551912345678       123456789012345000000000100                                                                                                  20170904201923               01 ";
		SingleePayResponse resp = new SingleePayResponse(msg);
		// resp.print();
	}

	private String sub(byte[] bytes, int start, int limit) throws UnsupportedEncodingException {
		int length = limit - start;
		byte[] bs = new byte[length];
		for (int i = 0; i < length; i++) {
			bs[i] = bytes[i + start];
		}
		return new String(bs,"GBK");
	}
	public void print() throws UnsupportedEncodingException {
//		System.out.println(this.respCode+",length:["+this.respCode.length()+","+this.respCode.getBytes("GBK").length+"]");
//		System.out.println(this.respInfo+",length:["+this.respInfo.length()+","+this.respInfo.getBytes("GBK").length+"]");
//		System.out.println(this.cardNo+",length:["+this.cardNo.length()+","+this.cardNo.getBytes("GBK").length+"]");
//		System.out.println(this.amount+",length:["+this.amount.length()+","+this.amount.getBytes("GBK").length+"]");
//		System.out.println(this.trace+",length:["+this.trace.length()+","+this.trace.getBytes("GBK").length+"]");
//		System.out.println(this.batch +",length:["+this.batch.length()+","+this.batch.getBytes("GBK").length+"]");
//		System.out.println(this.transDate+",length:["+this.transDate.length()+","+this.transDate.getBytes("GBK").length+"]");
//		System.out.println(this.transTime +",length:["+this.transTime.length()+","+this.transTime.getBytes("GBK").length+"]");
//		System.out.println(this.ref +",length:["+this.ref.length()+","+this.ref.getBytes("GBK").length+"]");
//		System.out.println(this.auth+",length:["+this.auth.length()+","+this.auth.getBytes("GBK").length+"]");
//		System.out.println(this.mid+",length:["+this.mid.length()+","+this.mid.getBytes("GBK").length+"]");
//		System.out.println(this.tid+",length:["+this.tid.length()+","+this.tid.getBytes("GBK").length+"]");
//		System.out.println(this.memo+",length:["+this.memo.length()+","+this.memo.getBytes("GBK").length+"]");
//		System.out.println(this.lrc+",length:["+this.lrc.length()+","+this.lrc.getBytes("GBK").length+"]");
//		System.out.println(this.cardType);// = "2";// TODO
	}
}
