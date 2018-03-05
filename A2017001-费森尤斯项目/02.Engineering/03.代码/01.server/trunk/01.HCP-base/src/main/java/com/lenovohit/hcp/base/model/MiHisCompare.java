package com.lenovohit.hcp.base.model;

import javax.persistence.Entity;
import javax.persistence.Table;


/**
 * 医保基本信息对照表
 * @author gw
 *
 */
@Entity
@Table(name = "MI_HIS_COMPARE")
public class MiHisCompare extends HcpBaseModel {
	private static final long serialVersionUID = 4283507513276644357L;

	private String itemCode;
	private String itemName;
	private String spellCode;
	private String miClass;
	private String miCode;
	private String miName;
	private String miGrade;
	private String stopFlag;
	private String comm;

	public String getItemCode() {
		return itemCode;
	}

	public void setItemCode(String itemCode) {
		this.itemCode = itemCode;
	}

	public String getItemName() {
		return itemName;
	}

	public void setItemName(String itemName) {
		this.itemName = itemName;
	}

	public String getSpellCode() {
		return spellCode;
	}

	public void setSpellCode(String spellCode) {
		this.spellCode = spellCode;
	}

	public String getMiClass() {
		return miClass;
	}

	public void setMiClass(String miClass) {
		this.miClass = miClass;
	}

	public String getMiCode() {
		return miCode;
	}

	public void setMiCode(String miCode) {
		this.miCode = miCode;
	}

	public String getMiName() {
		return miName;
	}

	public void setMiName(String miName) {
		this.miName = miName;
	}

	public String getMiGrade() {
		return miGrade;
	}

	public void setMiGrade(String miGrade) {
		this.miGrade = miGrade;
	}

	public String getStopFlag() {
		return stopFlag;
	}

	public void setStopFlag(String stopFlag) {
		this.stopFlag = stopFlag;
	}

	public String getComm() {
		return comm;
	}

	public void setComm(String comm) {
		this.comm = comm;
	}

}
