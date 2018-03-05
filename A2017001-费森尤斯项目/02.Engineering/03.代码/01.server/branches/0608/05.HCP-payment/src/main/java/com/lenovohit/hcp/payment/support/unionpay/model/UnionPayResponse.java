package com.lenovohit.hcp.payment.support.unionpay.model;

import java.io.Serializable;

import com.lenovohit.core.utils.StringUtils;

public class UnionPayResponse implements Serializable {

	private static final long serialVersionUID = 2027415790150844217L;

	public UnionPayResponse(String respText) {
		this.respText = respText;
		if (StringUtils.isEmpty(respText) || respText.length() != 1164)
			return;
		this.respCode = respText.substring(0, 2).trim();// 2 应答码
		this.respInfo = respText.substring(2, 42).trim();// 40 应答码说明信息（汉字）
		this.cardNo = respText.substring(42, 62).trim();// 20 交易卡号
		this.amount = respText.substring(62, 74).trim();// 12 金额
		this.trace = respText.substring(74, 80).trim();// 6 终端流水号（凭证号）
		this.batch = respText.substring(80, 86).trim();// 6 批次号
		this.transDate = respText.substring(86, 90).trim();// 4 交易日期MMDD
		this.transTime = respText.substring(90, 96).trim();// 6 交易时间hhmmss
		this.ref = respText.substring(96, 108).trim();// 12 系统参考号（中心流水号）
		this.auth = respText.substring(108, 114).trim();// 6 授权号
		this.mid = respText.substring(114, 129).trim();// 15 商户号
		this.tid = respText.substring(129, 137).trim();// 8 终端号
		this.memo = respText.substring(137, 1161);// 1024 48域附加信息（采用第4章所述格式传出）
		this.lrc = respText.substring(1161, 1164).trim();// 3 3个校验字符
		this.cardType = "1";// TODO
	}

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

	public static void main(String args[]) {
		String msg = "00"// 2 应答码
				+ "交易成功" + "          " + "          " + "          " + "      "// 40
																				// 应答码说明信息（汉字）
				+ "6228480402564890018 "// 20 交易卡号
				+ "18.00          "// 12 金额
				+ "123456"// 6 终端流水号（凭证号）
				+ "654321"// 6 批次号
				+ "0323"// 4 交易日期MMDD
				+ "121112"// 6 交易时间hhmmss
				+ "1234567890Ab"// 12 系统参考号（中心流水号）
				+ "111111"// 6 授权号
				+ "abcdefghigklmno"// 15 商户号
				+ "88888888"// 8 终端号
				+ ""// 1024 48域附加信息（采用第4章所述格式传出）
				+ "123"// 3 3个校验字符
		;
		UnionPayResponse resp = new UnionPayResponse(msg);
		System.out.println(resp.getCardNo());
	}

}
