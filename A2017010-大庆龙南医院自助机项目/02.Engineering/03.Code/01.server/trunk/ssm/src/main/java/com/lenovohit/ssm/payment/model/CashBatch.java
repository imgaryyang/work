package com.lenovohit.ssm.payment.model;

import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.lenovohit.core.model.BaseIdModel;
import com.lenovohit.ssm.base.model.Machine;

//现金打印批次
@Entity
@Table(name="SSM_CASH_BATCH")
public class CashBatch extends BaseIdModel{
	private static final long serialVersionUID = 5578125996822876373L;
	public static final String PRINT_STAT_INIT = "0";//已清钞
	public static final String PRINT_STAT_PRINTED = "1";//已打印
	
	private String batchNo;
	private Date createTime;
	private String status;
	private Date printTime;
	private long count;
	private BigDecimal amt;
	private Machine machine;
	private String machineCode;
	private String machineName;
	private String machineMac;
	private String batchDay;
	private long bankCount;
	private BigDecimal bankAmt;
	private Date importTime;
	
	public String getBatchDay() {
		return batchDay;
	}
	public void setBatchDay(String batchDay) {
		this.batchDay = batchDay;
	}
	@ManyToOne
	@JoinColumn(name="MACHINE_ID")
	public Machine getMachine() {
		return machine;
	}
	public void setMachine(Machine machine) {
		this.machine = machine;
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
	public BigDecimal getAmt() {
		return amt;
	}
	public void setAmt(BigDecimal amt) {
		this.amt = amt;
	}
	public String getBatchNo() {
		return batchNo;
	}
	public void setBatchNo(String batchNo) {
		this.batchNo = batchNo;
	}
	@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
	public Date getCreateTime() {
		return createTime;
	}
	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
	public Date getPrintTime() {
		return printTime;
	}
	public void setPrintTime(Date printTime) {
		this.printTime = printTime;
	}
	public long getCount() {
		return count;
	}
	public void setCount(long count) {
		this.count = count;
	}
	public long getBankCount() {
		return bankCount;
	}
	public void setBankCount(long bankCount) {
		this.bankCount = bankCount;
	}
	public BigDecimal getBankAmt() {
		return bankAmt;
	}
	public void setBankAmt(BigDecimal bankAmt) {
		this.bankAmt = bankAmt;
	}
	@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
	public Date getImportTime() {
		return importTime;
	}
	public void setImportTime(Date importTime) {
		this.importTime = importTime;
	}
}
