package com.lenovohit.hcp.base.model;

import java.io.Serializable;
import java.math.BigDecimal;

import com.alibaba.fastjson.JSONObject;
import com.lenovohit.hcp.HCPConstants;
import com.lenovohit.hcp.base.configuration.RedisSequenceConfig;

public class RedisSequence implements Serializable {

	private static final long serialVersionUID = -1L;
	
	/**
	 * 序列号配置项
	 */
	private RedisSequenceConfig config = null;

	/**
	 * sequence 键值
	 */
	private String key = null;

	/**
	 * sequence 值
	 */
	private BigDecimal seq = new BigDecimal(1);

	/**
	 * 组合后的序列号
	 */
	private String seqStr = null;
	
	/**
	 * 日期型序列对象
	 */
	private JSONObject dateSeq = null;

	/**
	 * 构造定长字符型序列或数字型序列
	 * @param key
	 * @param seq
	 */
	public RedisSequence(String key, BigDecimal seq) {
		super();
		this.config = HCPConstants.SEQUENCE_RULE.get(key);
		this.key = key;
		this.seq = seq;
		// 定长字符型序列
		if (RedisSequenceConfig.SEQ_TYPE_FIXED_STRING == this.config.getType()) {
			// 组合字符序列
			StringBuffer sb = new StringBuffer(this.config.getPrefix());
			for (int i = 0; i < this.config.getLength() - this.seq.toString().length(); i++) {
				sb.append("0");
			}
			sb.append(seq.toString());
			this.seqStr = sb.toString();
		}
	}
	
	/**
	 * 构造日期型序列
	 * @param key
	 * @param dateSeq
	 */
	public RedisSequence(String key, JSONObject dateSeq) {
		super();
		this.config = HCPConstants.SEQUENCE_RULE.get(key);
		this.key = key;
		this.dateSeq = dateSeq;
		String date = (String)(dateSeq.keySet().toArray()[0]);
		this.seq = dateSeq.getBigDecimal(date);
		// 日期型序列
		if (RedisSequenceConfig.SEQ_TYPE_DATE_STRING == this.config.getType()) {
			// 组合字符序列
			StringBuffer sb = new StringBuffer(this.config.getPrefix());
			sb.append(date);
			for (int i = 0; i < this.config.getLength() - this.seq.toString().length(); i++) {
				sb.append("0");
			}
			sb.append(seq.toString());
			this.seqStr = sb.toString();
		}
	}

	public RedisSequenceConfig getConfig() {
		return config;
	}

	public void setConfig(RedisSequenceConfig config) {
		this.config = config;
	}

	public String getKey() {
		return key;
	}

	public void setKey(String key) {
		this.key = key;
	}

	public BigDecimal getSeq() {
		return seq;
	}

	public void setSeq(BigDecimal seq) {
		this.seq = seq;
	}

	public String getSeqStr() {
		return seqStr;
	}

	public void setSeqStr(String seqStr) {
		this.seqStr = seqStr;
	}

	public JSONObject getDateSeq() {
		return dateSeq;
	}

	public void setDateSeq(JSONObject dateSeq) {
		this.dateSeq = dateSeq;
	}

}
