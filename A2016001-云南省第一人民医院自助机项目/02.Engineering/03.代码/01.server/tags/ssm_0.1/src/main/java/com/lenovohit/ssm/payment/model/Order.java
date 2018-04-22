package com.lenovohit.ssm.payment.model;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.lenovohit.core.model.BaseIdModel;


@Entity
@Table(name="SSM_ORDER")
public class Order extends BaseIdModel{

	/**
	 * 
	 */
	private static final long serialVersionUID = -3945462500258165323L;

	private String orderNo;//医院订单号
	private String hospitalNo;//医院订单号
	private String bizUrl;//业务url	BIZ_URL
	private String bizBean;//业务bean
	private String status;//订单状态
	private String patientHisId;//病人姓名
	private String patientName;//病人姓名	
	private String patientIdNo;//病人身份证号
	private String patientCardNo;//病人卡号	
	private String patientCardType;//就诊卡类型
	private String type;//订单类型	TYPE
	private String description;//描述	
	private String payChannel;
	private Date createTime;//创建时间	
	private Date updateTime;//更新时间	
	private Date payTime;//支付完成时间
	
	private BigDecimal amt = new BigDecimal(0) ;
	private BigDecimal realAmt = new BigDecimal(0) ;
	private BigDecimal lastAmt = new BigDecimal(0) ;
	private BigDecimal paAmt = new BigDecimal(0);//个人账户金额	
	private BigDecimal miAmt = new BigDecimal(0);//医保报销金额	
	private BigDecimal selfAmt = new BigDecimal(0);//个人自付金额

	private List<Settlement> settlements =  new ArrayList<Settlement>();//结算单
	private List<Fee> fees =  new ArrayList<Fee>();//费用明细
	
	public String getOrderNo() {
		return orderNo;
	}

	public void setOrderNo(String orderNo) {
		this.orderNo = orderNo;
	}

	public String getHospitalNo() {
		return hospitalNo;
	}

	public void setHospitalNo(String hospitalNo) {
		this.hospitalNo = hospitalNo;
	}

	public String getBizUrl() {
		return bizUrl;
	}

	public void setBizUrl(String bizUrl) {
		this.bizUrl = bizUrl;
	}

	public String getBizBean() {
		return bizBean;
	}

	public void setBizBean(String bizBean) {
		this.bizBean = bizBean;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getPatientHisId() {
		return patientHisId;
	}

	public void setPatientHisId(String patientHisId) {
		this.patientHisId = patientHisId;
	}

	public String getPatientName() {
		return patientName;
	}

	public void setPatientName(String patientName) {
		this.patientName = patientName;
	}

	public String getPatientIdNo() {
		return patientIdNo;
	}

	public void setPatientIdNo(String patientIdNo) {
		this.patientIdNo = patientIdNo;
	}

	public String getPatientCardNo() {
		return patientCardNo;
	}

	public void setPatientCardNo(String patientCardNo) {
		this.patientCardNo = patientCardNo;
	}

	public String getPatientCardType() {
		return patientCardType;
	}

	public void setPatientCardType(String patientCardType) {
		this.patientCardType = patientCardType;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Date getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}

	public Date getUpdateTime() {
		return updateTime;
	}

	public void setUpdateTime(Date updateTime) {
		this.updateTime = updateTime;
	}

	public Date getPayTime() {
		return payTime;
	}

	public void setPayTime(Date payTime) {
		this.payTime = payTime;
	}

	public BigDecimal getAmt() {
		return amt;
	}

	public void setAmt(BigDecimal amt) {
		this.amt = amt;
	}

	public BigDecimal getRealAmt() {
		return realAmt;
	}

	public void setRealAmt(BigDecimal realAmt) {
		this.realAmt = realAmt;
	}

	public BigDecimal getLastAmt() {
		return lastAmt;
	}

	public void setLastAmt(BigDecimal lastAmt) {
		this.lastAmt = lastAmt;
	}

	public BigDecimal getPaAmt() {
		return paAmt;
	}

	public void setPaAmt(BigDecimal paAmt) {
		this.paAmt = paAmt;
	}
	
	public BigDecimal getMiAmt() {
		return miAmt;
	}

	public void setMiAmt(BigDecimal miAmt) {
		this.miAmt = miAmt;
	}

	public BigDecimal getSelfAmt() {
		return selfAmt;
	}

	public void setSelfAmt(BigDecimal selfAmt) {
		this.selfAmt = selfAmt;
	}
	@Transient
	public String getPayChannel() {
		return payChannel;
	}

	public void setPayChannel(String payChannel) {
		this.payChannel = payChannel;
	}
	@Transient
	public List<Fee> getFees() {
		return fees;
	}

	public void setFees(List<Fee> fees) {
		this.fees = fees;
	}
	@Transient
	public List<Settlement> getSettlements() {
		return settlements;
	}

	public void setSettlements(List<Settlement> settlements) {
		this.settlements = settlements;
	}
}
