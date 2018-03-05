package com.lenovohit.hwe.pay.support.unionpay.pos.model;

import java.io.Serializable;
import java.io.UnsupportedEncodingException;

import com.lenovohit.core.utils.StringUtils;

public class PosPayResponse implements Serializable {
	private static final long serialVersionUID = 2027415790150844217L;

	public PosPayResponse(String respText) throws UnsupportedEncodingException {
		this.respText = respText;
		this.chars = respText.getBytes("GBK");
		System.out.println(respText.length());
		System.out.println(chars.length);
		if (StringUtils.isEmpty(respText))
			return;
		if (chars.length != 1164)
			return;
		String respCode = this.sub(this.chars, 0, 2);//.trim();// 2 应答码;
		System.out.println("respCode : "+respCode+",lenght "+respCode.getBytes("GBK").length);
		this.respCode = respCode.trim();
		
		String respInfo = this.sub(this.chars, 2, 42);//.trim();// 40 应答码说明信息（汉字）
		System.out.println("respInfo : "+respInfo+",lenght "+respInfo.getBytes("GBK").length);
		this.respInfo  = respInfo.trim();
		
		String cardNo = this.sub(this.chars, 42, 62);//.trim();// 20 交易卡号
		System.out.println("cardNo : "+cardNo+",lenght "+cardNo.getBytes("GBK").length);
		this.cardNo = cardNo.trim();
		
		String amount = this.sub(this.chars, 62, 74);//.trim();// 12 金额
		System.out.println("amount : "+amount+",lenght "+amount.getBytes("GBK").length);
		this.amount = amount.trim();
		
		String trace = this.sub(this.chars, 74, 80);//.trim();// 6 终端流水号（凭证号）
		System.out.println("trace : "+trace+",lenght "+trace.getBytes("GBK").length);
		this.trace = trace.trim();
		
		String batch = this.sub(this.chars, 80, 86);//.trim();// 6 批次号
		System.out.println("batch : "+batch+",lenght "+batch.getBytes("GBK").length);
		this.batch = batch.trim();
		
		String transDate = this.sub(this.chars, 86, 90);//.trim();// 4 交易日期MMDD
		System.out.println("transDate : "+transDate+",lenght "+transDate.getBytes("GBK").length);
		this.transDate = transDate.trim();
		
		String transTime = this.sub(this.chars, 90, 96);//.trim();// 6 交易时间hhmmss
		System.out.println("transTime : "+transTime+",lenght "+transTime.getBytes("GBK").length);
		this.transTime = transTime.trim();
		
		String ref = this.sub(this.chars, 96, 108);//.trim();// 12 系统参考号（中心流水号）
		System.out.println("ref : "+ref+",lenght "+ref.getBytes("GBK").length);
		this.ref = ref.trim();
		
		String auth = this.sub(this.chars, 108, 114);//.trim();// 6 授权号
		System.out.println("auth: "+auth+",lenght "+auth.getBytes("GBK").length);
		this.auth = auth.trim();
		
		String mid = this.sub(this.chars, 114, 129);//.trim();// 15 商户号
		System.out.println("mid: "+mid+",lenght "+mid.getBytes("GBK").length);
		this.mid = mid.trim();
		
		String tid = this.sub(this.chars, 129, 137);//.trim();// 8 终端号
		System.out.println("tid: "+tid+",lenght "+tid.getBytes("GBK").length);
		this.tid = tid.trim();
		
		String memo = this.sub(this.chars, 137, 1161);// 1024 48域附加信息（采用第4章所述格式传出）
		System.out.println("memo: "+memo+",lenght "+memo.getBytes("GBK").length);
		this.memo = memo.trim();
		
		String lrc = this.sub(this.chars, 1161, 1164);//.trim();// 3 3个校验字符
		System.out.println("lrc: "+lrc+",lenght "+lrc.getBytes("GBK").length);
		this.lrc = lrc.trim();
		
		if(!StringUtils.isEmpty(this.memo)){
			String types[] = this.memo.split("_");
			if(types.length == 2 ){
				this.cardType = types[0];
				this.cardTypeName = types[1];
			}
		}
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
	private String lrc;
	private String respText;
	private String settlementId;
	private String cardType;
	private String cardTypeName;
	public String getCardTypeName() {
		return cardTypeName;
	}

	public void setCardTypeName(String cardTypeName) {
		this.cardTypeName = cardTypeName;
	}

	public String getCardType() {
		return cardType;
	}

	public void setCardType(String cardType) {
		this.cardType = cardType;
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

	public String getLrc() {
		return lrc;
	}

	public void setLrc(String lrc) {
		this.lrc = lrc;
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
		String msg = "00交易成功                                5201088008025653    0000000000052831100002110421100432000109628597      1032900701115121234051202_贷记卡                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     ";
		PosPayResponse resp = new PosPayResponse(msg);
		resp.print();
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
		System.out.println(this.respCode+",length:["+this.respCode.length()+","+this.respCode.getBytes("GBK").length+"]");
		System.out.println(this.respInfo+",length:["+this.respInfo.length()+","+this.respInfo.getBytes("GBK").length+"]");
		System.out.println(this.cardNo+",length:["+this.cardNo.length()+","+this.cardNo.getBytes("GBK").length+"]");
		System.out.println(this.amount+",length:["+this.amount.length()+","+this.amount.getBytes("GBK").length+"]");
		System.out.println(this.trace+",length:["+this.trace.length()+","+this.trace.getBytes("GBK").length+"]");
		System.out.println(this.batch +",length:["+this.batch.length()+","+this.batch.getBytes("GBK").length+"]");
		System.out.println(this.transDate+",length:["+this.transDate.length()+","+this.transDate.getBytes("GBK").length+"]");
		System.out.println(this.transTime +",length:["+this.transTime.length()+","+this.transTime.getBytes("GBK").length+"]");
		System.out.println(this.ref +",length:["+this.ref.length()+","+this.ref.getBytes("GBK").length+"]");
		System.out.println(this.auth+",length:["+this.auth.length()+","+this.auth.getBytes("GBK").length+"]");
		System.out.println(this.mid+",length:["+this.mid.length()+","+this.mid.getBytes("GBK").length+"]");
		System.out.println(this.tid+",length:["+this.tid.length()+","+this.tid.getBytes("GBK").length+"]");
		System.out.println(this.memo+",length:["+this.memo.length()+","+this.memo.getBytes("GBK").length+"]");
		System.out.println(this.lrc+",length:["+this.lrc.length()+","+this.lrc.getBytes("GBK").length+"]");
		System.out.println(this.cardType);// = "2";// TODO
	}
}
