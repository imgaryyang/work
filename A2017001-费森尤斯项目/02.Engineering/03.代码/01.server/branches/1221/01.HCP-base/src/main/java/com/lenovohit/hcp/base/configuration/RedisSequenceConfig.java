package com.lenovohit.hcp.base.configuration;

import java.math.BigDecimal;

public class RedisSequenceConfig {

	private static final long serialVersionUID = -1L;
	
	/**
	 * sequence类型 - 数字型
	 */
	public static final int SEQ_TYPE_NUMBER = 1;
	
	/**
	 * sequence类型 - 定长字符串，[ 前缀（可空） + 序列 ]，不足位补“0”
	 */
	public static final int SEQ_TYPE_FIXED_STRING = 2;
	
	/**
	 * sequence类型 - 含日期的定长字符串，[ 前缀（可空） + 日期 + 序列 ]，不足位补“0”
	 */
	public static final int SEQ_TYPE_DATE_STRING = 3;
	
	/**
	 * 构造函数
	 * @param type
	 */
	public RedisSequenceConfig (int type) {
		super();
		this.type = type;
	}
	
	/**
	 * 构造函数
	 * @param type
	 */
	public RedisSequenceConfig (int type, int startWith, int step) {
		super();
		this.type = type;
		this.startWith = startWith;
		this.step = step;
	}
	
	/**
	 * 构造函数
	 * @param type
	 * @param prefix
	 * @param length
	 */
	public RedisSequenceConfig (int type, String prefix, int length) {
		super();
		this.type = type;
		this.prefix = prefix;
		this.length = length;
	}
	
	/**
	 * 构造函数
	 * @param type
	 * @param prefix
	 * @param length
	 */
	public RedisSequenceConfig (int type, String prefix, int length, int startWith, int step) {
		super();
		this.type = type;
		this.prefix = prefix;
		this.length = length;
		this.startWith = startWith;
		this.step = step;
	}
	
	/**
	 * 编码类型
	 */
	private int type;

	/**
	 * 前缀
	 */
	private String prefix;

	/**
	 * 长度
	 */
	private int length;
	
	/**
	 * 步增基数
	 */
	private int startWith = 1;
	
	/**
	 * 步长
	 */
	private int step = 1;

	public int getType() {
		return type;
	}

	public void setType(int type) {
		this.type = type;
	}

	public String getPrefix() {
		return prefix;
	}

	public void setPrefix(String prefix) {
		this.prefix = prefix;
	}

	public int getLength() {
		return length;
	}

	public void setLength(int length) {
		this.length = length;
	}

	public int getStartWith() {
		return startWith;
	}

	public void setStartWith(int startWith) {
		this.startWith = startWith;
	}

	public int getStep() {
		return step;
	}

	public void setStep(int step) {
		this.step = step;
	}
	
}
