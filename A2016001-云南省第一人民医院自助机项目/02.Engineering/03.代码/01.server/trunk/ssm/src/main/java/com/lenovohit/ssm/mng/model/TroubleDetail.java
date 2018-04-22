package com.lenovohit.ssm.mng.model;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.lenovohit.core.model.BaseIdModel;
import com.lenovohit.ssm.base.model.Machine;

@Entity
@Table(name="SSM_TROUBLE_DETAIL")
public class TroubleDetail extends BaseIdModel {	
	private static final long serialVersionUID = 2075225661446307495L;
	
	private int account;//次数
	private String operator;//操作人
	private String createTime;//故障时间
	private String createDay;//故障日期
	private Trouble trouble;//故障编号
	private Machine machine;//机器编号
	private String description;//故障描述
	private String dealWay;//处理方式
	
	public int getAccount() {
		return account;
	}
	public void setAccount(int account) {
		this.account = account;
	}
	public String getOperator() {
		return operator;
	}
	public void setOperator(String operator) {
		this.operator = operator;
	}
	public String getCreateTime() {
		return createTime;
	}
	public void setCreateTime(String createTime) {
		this.createTime = createTime;
	}
	public String getCreateDay() {
		return createDay;
	}
	public void setCreateDay(String createDay) {
		this.createDay = createDay;
	}
	@ManyToOne(targetEntity=Trouble.class,fetch=FetchType.EAGER)
	@JoinColumn(name="TROUBLE_ID")
	public Trouble getTrouble() {
		return trouble;
	}
	public void setTrouble(Trouble trouble) {
		this.trouble = trouble;
	}
	@ManyToOne(targetEntity=Machine.class,fetch=FetchType.EAGER)
	@JoinColumn(name="MACHINE_ID")
	public Machine getMachine() {
		return machine;
	}
	public void setMachine(Machine machine) {
		this.machine = machine;
	}
	public String getDealWay() {
		return dealWay;
	}
	public void setDealWay(String dealWay) {
		this.dealWay = dealWay;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	
}
