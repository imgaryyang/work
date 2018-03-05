package com.lenovohit.hcp.base.model;

import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * 频次信息表
 * 
 * @author victor
 *
 */
@Entity
@Table(name = "B_FREQ")
public class Frequency extends HcpBaseModel {

	private static final long serialVersionUID = 1L;
	
	private String freqId;
	private String freqName;
	private String spellCode; // 拼音|超过10位无检索意义
	private String wbCode;
	private String customCode;
	private String eName; // 英文名称
	private String intervalNum;
	private String intervalUnit;
	private String freqQty;
	private String freqTime;
	private String stopFlag; // 停用标志|0-停1启

	public String getFreqId() {
		return freqId;
	}

	public void setFreqId(String freqId) {
		this.freqId = freqId;
	}

	public String getFreqName() {
		return freqName;
	}

	public void setFreqName(String freqName) {
		this.freqName = freqName;
	}

	public String getSpellCode() {
		return spellCode;
	}

	public void setSpellCode(String spellCode) {
		this.spellCode = spellCode;
	}

	public String getWbCode() {
		return wbCode;
	}

	public void setWbCode(String wbCode) {
		this.wbCode = wbCode;
	}

	public String getCustomCode() {
		return customCode;
	}

	public void setCustomCode(String customCode) {
		this.customCode = customCode;
	}

	public String geteName() {
		return eName;
	}

	public void seteName(String eName) {
		this.eName = eName;
	}

	public String getIntervalNum() {
		return intervalNum;
	}

	public void setIntervalNum(String intervalNum) {
		this.intervalNum = intervalNum;
	}

	public String getIntervalUnit() {
		return intervalUnit;
	}

	public void setIntervalUnit(String intervalUnit) {
		this.intervalUnit = intervalUnit;
	}

	public String getFreqQty() {
		return freqQty;
	}

	public void setFreqQty(String freqQty) {
		this.freqQty = freqQty;
	}

	public String getFreqTime() {
		return freqTime;
	}

	public void setFreqTime(String freqTime) {
		this.freqTime = freqTime;
	}

	public String getStopFlag() {
		return stopFlag;
	}

	public void setStopFlag(String stopFlag) {
		this.stopFlag = stopFlag;
	}

}
