package com.lenovohit.ssm.treat.model;

import com.lenovohit.core.model.BaseIdModel;

/**
 * 预存消费记录
 * @author xiaweiyi
 *
 */
public class ConsumeRecord extends BaseIdModel{
	private static final long serialVersionUID = 1098286956401539056L;

	private String patientNo;           //病人编号
	private String patientName;   		//患者姓名
	private String amount   ;           //消费金额
	private String type     ;           //消费类型 1:挂号 2:门诊收费  3:体检收费 4.医院授权透支冲账
	private String time     ;           //消费时间
	private String doctor	;			//医生
	private String cashier 	;			//收款员
	
	
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
	public String getAmount() {
		return amount;
	}
	public void setAmount(String amount) {
		this.amount = amount;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getTime() {
		return time;
	}
	public void setTime(String time) {
		this.time = time;
	}
	public String getDoctor() {
		return doctor;
	}
	public void setDoctor(String doctor) {
		this.doctor = doctor;
	}
	public String getCashier() {
		return cashier;
	}
	public void setCashier(String cashier) {
		this.cashier = cashier;
	}

}
