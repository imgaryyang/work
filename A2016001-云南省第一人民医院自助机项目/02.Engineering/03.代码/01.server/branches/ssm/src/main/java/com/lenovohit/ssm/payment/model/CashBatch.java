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
	
	private long count1;
	private long count2;
	private long count5;
	private long count10;
	private long count20;
	private long count50;
	private long count100;
	
	private BigDecimal amt1;
	private BigDecimal amt2;
	private BigDecimal amt5;
	private BigDecimal amt10;
	private BigDecimal amt20;
	private BigDecimal amt50;
	private BigDecimal amt100;
	
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
	
	
	public long getCount1() {
		return count1;
	}
	public void setCount1(long count1) {
		this.count1 = count1;
	}
	public long getCount2() {
		return count2;
	}
	public void setCount2(long count2) {
		this.count2 = count2;
	}
	public long getCount5() {
		return count5;
	}
	public void setCount5(long count5) {
		this.count5 = count5;
	}
	public long getCount10() {
		return count10;
	}
	public void setCount10(long count10) {
		this.count10 = count10;
	}
	public long getCount20() {
		return count20;
	}
	public void setCount20(long count20) {
		this.count20 = count20;
	}
	public long getCount50() {
		return count50;
	}
	public void setCount50(long count50) {
		this.count50 = count50;
	}
	public long getCount100() {
		return count100;
	}
	public void setCount100(long count100) {
		this.count100 = count100;
	}
	public BigDecimal getAmt1() {
		return amt1;
	}
	public void setAmt1(BigDecimal amt1) {
		this.amt1 = amt1;
	}
	public BigDecimal getAmt2() {
		return amt2;
	}
	public void setAmt2(BigDecimal amt2) {
		this.amt2 = amt2;
	}
	public BigDecimal getAmt5() {
		return amt5;
	}
	public void setAmt5(BigDecimal amt5) {
		this.amt5 = amt5;
	}
	public BigDecimal getAmt10() {
		return amt10;
	}
	public void setAmt10(BigDecimal amt10) {
		this.amt10 = amt10;
	}
	public BigDecimal getAmt20() {
		return amt20;
	}
	public void setAmt20(BigDecimal amt20) {
		this.amt20 = amt20;
	}
	public BigDecimal getAmt50() {
		return amt50;
	}
	public void setAmt50(BigDecimal amt50) {
		this.amt50 = amt50;
	}
	public BigDecimal getAmt100() {
		return amt100;
	}
	public void setAmt100(BigDecimal amt100) {
		this.amt100 = amt100;
	}
}
