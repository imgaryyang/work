package com.lenovohit.elh.pay.model;

import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.lenovohit.core.model.BaseIdModel;
import com.lenovohit.elh.base.model.Hospital;
import com.lenovohit.elh.base.model.Patient;

/**
 * 
 * @author LongFeng 订单表
 */
@Entity
@Table(name = "ELH_ORDER")
public class Order extends BaseIdModel {

	private static final long serialVersionUID = 5338300363151214589L;

	private String orderNo;// 订单号
	private String treatmentId;// 所属就医记录
	private String patientId;// 就诊人
	private String hospitalId;// 就诊医院
	private String status;// 0状态1 已支付0 未支付2 支付失败 9作废
	private Double amount;// 金额
	private Double cash;// 现金
	private Double miPayed;// 报销
	private String payTime;// 支付时间
	private String createTime;// 创建时间
	private String updateTime;// 更新时间
	private String description;// 描述
	private String optAccount;
	private List<Charge> charges;
	private Hospital hospital;
	private Patient patient; // 就诊人信息

	@Column(name = "ORDER_NO")
	public String getOrderNo() {
		return orderNo;
	}

	public void setOrderNo(String orderNo) {
		this.orderNo = orderNo;
	}

	@Column(name = "TREATMENT")
	public String getTreatmentId() {
		return treatmentId;
	}

	public void setTreatmentId(String treatmentId) {
		this.treatmentId = treatmentId;
	}

	@Column(name = "PATIENT")
	public String getPatientId() {
		return patientId;
	}

	public void setPatientId(String patientId) {
		this.patientId = patientId;
	}

	@Column(name = "HOSPITAL")
	public String getHospitalId() {
		return hospitalId;
	}

	public void setHospitalId(String hospitalId) {
		this.hospitalId = hospitalId;
	}

	@Column(name = "STATUS")
	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	@Column(name = "AMOUNT")
	public Double getAmount() {
		return amount;
	}

	public void setAmount(Double amount) {
		this.amount = amount;
	}

	@Column(name = "CASH")
	public Double getCash() {
		return cash;
	}

	public void setCash(Double cash) {
		this.cash = cash;
	}

	@Column(name = "MI_PAYED")
	public Double getMiPayed() {
		return miPayed;
	}

	public void setMiPayed(Double miPayed) {
		this.miPayed = miPayed;
	}

	@Column(name = "PAY_TIME")
	public String getPayTime() {
		return payTime;
	}

	public void setPayTime(String payTime) {
		this.payTime = payTime;
	}

	@Column(name = "CREATE_TIME")
	public String getCreateTime() {
		return createTime;
	}

	public void setCreateTime(String createTime) {
		this.createTime = createTime;
	}

	@Column(name = "UPDATE_TIME")
	public String getUpdateTime() {
		return updateTime;
	}

	public void setUpdateTime(String updateTime) {
		this.updateTime = updateTime;
	}

	@Column(name = "DESCRIPTION")
	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	@Transient
	public List<Charge> getCharges() {
		return charges;
	}

	public void setCharges(List<Charge> charges) {
		this.charges = charges;
	}

	@Transient
	public Hospital getHospital() {
		return hospital;
	}

	public void setHospital(Hospital hospital) {
		this.hospital = hospital;
	}

	@Transient
	public Patient getPatient() {
		return patient;
	}

	public void setPatient(Patient patient) {
		this.patient = patient;
	}

	@Transient
	public String getOptAccount() {
		return optAccount;
	}

	public void setOptAccount(String optAccount) {
		this.optAccount = optAccount;
	}
}
