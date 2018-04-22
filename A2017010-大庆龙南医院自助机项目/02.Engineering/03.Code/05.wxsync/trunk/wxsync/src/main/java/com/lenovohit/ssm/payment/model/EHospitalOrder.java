package com.lenovohit.ssm.payment.model;

import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;

import com.lenovohit.core.model.Model;

/**
 * 互联网平台 - EH_AccompanyTreatmentDiagnosisOrder
 * 
 * @author fanyang
 *
 */
@Entity
@Table(name = "EH_AccompanyTreatmentDiagnosisOrder")
public class EHospitalOrder implements Model {
	/**
	 * 
	 */
	private static final long serialVersionUID = -5490082359122976511L;
	
	private Integer id;					//OrderID
	private Integer uid;				//UID
	private Integer diagnosisHistoryID;	//DiagnosisHistoryID
	private String  state;				//State
	private Date    orderTime;			//OrderTime
	private String  payModel;			//PayModel
	private String  payTime;			//PayTime
	private String  transaction_id;		//transaction_id
	private String  refundTime;			//RefundTime
	private String  refundName;			//RefundName
	private String  moduleCode;			//ModuleCode
	private String  remark;				//Remark
	private BigDecimal refundMoney;		//RefundMoney
	
	@Id
	@Column(name = "OrderID")
	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	@Column(name = "UID")
	public Integer getUid() {
		return uid;
	}

	public void setUid(Integer uid) {
		this.uid = uid;
	}
	
	@Column(name = "DiagnosisHistoryID")
	public Integer getDiagnosisHistoryID() {
		return diagnosisHistoryID;
	}

	public void setDiagnosisHistoryID(Integer diagnosisHistoryID) {
		this.diagnosisHistoryID = diagnosisHistoryID;
	}

	@Column(name = "State")
	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}

	@Column(name = "OrderTime")
	public Date getOrderTime() {
		return orderTime;
	}

	public void setOrderTime(Date orderTime) {
		this.orderTime = orderTime;
	}

	@Column(name = "PayModel")
	public String getPayModel() {
		return payModel;
	}

	public void setPayModel(String payModel) {
		this.payModel = payModel;
	}

	@Column(name = "PayTime")
	public String getPayTime() {
		return payTime;
	}

	public void setPayTime(String payTime) {
		this.payTime = payTime;
	}

	@Column(name = "transaction_id")
	public String getTransaction_id() {
		return transaction_id;
	}

	public void setTransaction_id(String transaction_id) {
		this.transaction_id = transaction_id;
	}

	@Column(name = "RefundTime")
	public String getRefundTime() {
		return refundTime;
	}

	public void setRefundTime(String refundTime) {
		this.refundTime = refundTime;
	}

	@Column(name = "RefundName")
	public String getRefundName() {
		return refundName;
	}

	public void setRefundName(String refundName) {
		this.refundName = refundName;
	}

	@Column(name = "ModuleCode")
	public String getModuleCode() {
		return moduleCode;
	}

	public void setModuleCode(String moduleCode) {
		this.moduleCode = moduleCode;
	}

	@Column(name = "Remark")
	public String getRemark() {
		return remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	@Column(name = "RefundMoney")
	public BigDecimal getRefundMoney() {
		return refundMoney;
	}

	public void setRefundMoney(BigDecimal refundMoney) {
		this.refundMoney = refundMoney;
	}

	@Override
	public boolean _newObejct() {
		return 0 == this.getId();
	}
	
	/**
	 * 重载toString;
	 */
	public String toString() {
		return ToStringBuilder.reflectionToString(this);
	}

	/**
	 * 重载hashCode;
	 */
	public int hashCode() {
		return new HashCodeBuilder().append(this.getId()).toHashCode();
	}

	/**
	 * 重载equals
	 */
	public boolean equals(Object obj) {
		return EqualsBuilder.reflectionEquals(this, obj);
	}
	
}
