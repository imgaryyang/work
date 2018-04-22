package com.lenovohit.ssm.payment.model;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.Table;

import com.lenovohit.core.model.BaseIdModel;

//现金打印批次
@Entity
@Table(name="SSM_CASH_ERROR")
public class CashError extends BaseIdModel{
	/**
	 * 
	 */
	private static final long serialVersionUID = -384544700206649910L;
	private String ret;
	private Date createTime;
	private String msg;
	private String machineId;
	private String machineCode;
	private String machineName;
	private String machineMac;
	private String patientName;
	private String patientNo;
	private String orderId;
	private String orderNo;
	public String getOrderId() {
		return orderId;
	}
	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}
	public String getOrderNo() {
		return orderNo;
	}
	public void setOrderNo(String orderNo) {
		this.orderNo = orderNo;
	}
	public String getPatientName() {
		return patientName;
	}
	public void setPatientName(String patientName) {
		this.patientName = patientName;
	}
	public String getPatientNo() {
		return patientNo;
	}
	public void setPatientNo(String patientNo) {
		this.patientNo = patientNo;
	}
	public String getRet() {
		return ret;
	}
	public void setRet(String ret) {
		this.ret = ret;
	}
	public Date getCreateTime() {
		return createTime;
	}
	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}
	public String getMsg() {
		return msg;
	}
	public void setMsg(String msg) {
		this.msg = msg;
	}
	public String getMachineId() {
		return machineId;
	}
	public void setMachineId(String machineId) {
		this.machineId = machineId;
	}
	public String getMachineCode() {
		return machineCode;
	}
	public void setMachineCode(String machineCode) {
		this.machineCode = machineCode;
	}
	public String getMachineName() {
		return machineName;
	}
	public void setMachineName(String machineName) {
		this.machineName = machineName;
	}
	public String getMachineMac() {
		return machineMac;
	}
	public void setMachineMac(String machineMac) {
		this.machineMac = machineMac;
	}
	
}
