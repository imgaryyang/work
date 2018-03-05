package com.infohold.elh.pay.model;

import javax.persistence.Entity;
import javax.persistence.Table;

import com.infohold.core.model.BaseIdModel;

/**
 * 收费项表
 * @author Administrator
 *
 */
@Entity
@Table(name="ELH_CHARGE")
public class Charge extends BaseIdModel {//TODO 不考虑非就医项收费
	private static final long serialVersionUID = -6165675026927905337L;
	
	private String idHlht;
	private String name;
	private Double receiveAmount;
	private Double realAmount;
	private String status;
	private String patient;//TODO 增加字段
	private String bizSource;
	private String bizId;//记录医院端收费项所属的医疗项的id
	private String treatdetail;
	private String treatment;
	private String type;
	private String pricePer;
	private String chargePer;
	private String orderPer;
	private String comment;
	private String createTime;
	private String occurTime;
	private String regTime;
	private String payTime;
	private String orderNo;
	private String orderId ;
	
	
	public String getIdHlht() {
		return idHlht;
	}
	public void setIdHlht(String idHlht) {
		this.idHlht = idHlht;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public Double getReceiveAmount() {
		return receiveAmount;
	}
	public void setReceiveAmount(Double receiveAmount) {
		this.receiveAmount = receiveAmount;
	}
	public Double getRealAmount() {
		return realAmount;
	}
	public void setRealAmount(Double realAmount) {
		this.realAmount = realAmount;
	}
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	public String getPatient() {
		return patient;
	}
	public void setPatient(String patient) {
		this.patient = patient;
	}
	public String getBizSource() {
		return bizSource;
	}
	public void setBizSource(String bizSource) {
		this.bizSource = bizSource;
	}
	public String getBizId() {
		return bizId;
	}
	public void setBizId(String bizId) {
		this.bizId = bizId;
	}
	public String getTreatdetail() {
		return treatdetail;
	}
	public void setTreatdetail(String treatdetail) {
		this.treatdetail = treatdetail;
	}
	public String getTreatment() {
		return treatment;
	}
	public void setTreatment(String treatment) {
		this.treatment = treatment;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getPricePer() {
		return pricePer;
	}
	public void setPricePer(String pricePer) {
		this.pricePer = pricePer;
	}
	public String getChargePer() {
		return chargePer;
	}
	public void setChargePer(String chargePer) {
		this.chargePer = chargePer;
	}
	public String getOrderPer() {
		return orderPer;
	}
	public void setOrderPer(String orderPer) {
		this.orderPer = orderPer;
	}
	public String getComment() {
		return comment;
	}
	public void setComment(String comment) {
		this.comment = comment;
	}
	public String getCreateTime() {
		return createTime;
	}
	public void setCreateTime(String createTime) {
		this.createTime = createTime;
	}
	public String getOccurTime() {
		return occurTime;
	}
	public void setOccurTime(String occurTime) {
		this.occurTime = occurTime;
	}
	public String getRegTime() {
		return regTime;
	}
	public void setRegTime(String regTime) {
		this.regTime = regTime;
	}
	public String getPayTime() {
		return payTime;
	}
	public void setPayTime(String payTime) {
		this.payTime = payTime;
	}
	public String getOrderNo() {
		return orderNo;
	}
	public void setOrderNo(String orderNo) {
		this.orderNo = orderNo;
	}
	public String getOrderId() {
		return orderId;
	}
	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}
	public static long getSerialversionuid() {
		return serialVersionUID;
	}
	
	
}
