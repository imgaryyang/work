package com.lenovohit.ssm.payment.model;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.lenovohit.core.model.BaseIdModel;
import com.lenovohit.ssm.treat.model.Fee;


@Entity
@Table(name="SSM_ORDER")
public class Order extends BaseIdModel{
	private static final long serialVersionUID = -3945462500258165323L;
	public static final String ORDER_TYPE_PAY = "OP";//支付
	public static final String ORDER_TYPE_REFUND = "OR";//退款
	public static final String ORDER_TYPE_CANCEL = "OC";//退款取消
	public static final String ORDER_TYPE_ADDITIONAL = "BP";//补录
	public static final String ORDER_TYPE_REVERSE = "RO";//支付冲账
	
	public static final String ORDER_STAT_INITIAL = "A";
	public static final String ORDER_STAT_TRAN_SUCCESS = "0";
	public static final String ORDER_STAT_PAY_SUCCESS = "1";
	public static final String ORDER_STAT_PAY_FAILURE = "2";
	public static final String ORDER_STAT_PAY_PARTIAL = "4";
	public static final String ORDER_STAT_TRAN_FAILURE = "3";
	public static final String ORDER_STAT_REFUNDING = "5";
	public static final String ORDER_STAT_REFUND_FAILURE = "6";
	public static final String ORDER_STAT_REFUND_SUCCESS = "7";
	public static final String ORDER_STAT_REFUND_CANCELED= "8";//被撤销的
	public static final String ORDER_STAT_CLOSED = "9";
	public static final String ORDER_STAT_EXCEPTIONAL = "E";// 异常  
	public static final String ORDER_STAT_CANCEL = "C";// 撤销
	public static final String ORDER_STAT_REVERSE = "R";// 冲账
	
	public static final String BIZ_TYPE_PRESTORE = "00";
	public static final String BIZ_TYPE_APPOINT = "01";
	public static final String BIZ_TYPE_REGISTER = "02";
	public static final String BIZ_TYPE_CLINIC = "03";
	public static final String BIZ_TYPE_PREPAY = "04";
	public static final String BIZ_TYPE_CARD  = "05";
	public static final String BIZ_TYPE_PROFILE  = "06";

	public static final String OPT_STAT_OK 		= "0";
	public static final String OPT_STAT_EXP  	= "E";
	public static final String OPT_STAT_SYNC  	= "S";
	public static final String OPT_STAT_ADFLAG  = "A";
	public static final String OPT_STAT_CANCEL  = "C";
	
	private String orderNo;//自助机订单号
	private String orderType;//订单类型 SP - 支付	SR - 退款 	SC - 撤销
	private String orderTitle;//订单标题
	private String orderDesc;//订单描述
	
	private String bizType;//业务类型  '00': '门诊预存','01': '预约','02': '挂号','03': '门诊缴费','04': '住院预缴','05': '补卡', '06'： '建档'},
	private String bizNo;//业务订单号 在退款情况下，可能存放三种状态的值，在原交易退款发起时存放原zzxt_yhjymx的jlid，冻结情况下存放zzxt_yhjymx_err的jlid,确认以后存放cw_ycmx的jlid
	private String bizUrl;//业务url	
	private String bizBean;//业务bean
	private String bizTime;//业务时间
	private String status;//订单状态A-初始化 0-交易成功  1-支付成功 2-支付失败  3-通知应用失败 4-交易完成  5-退款中 6-退款失败  7-退款成功  8-退款被撤销 9-交易关闭 E-异常 C-撤销

	//终端信息 银联有单独的POS终端设备号
	private String terminalId;//终端ID
	private String terminalCode;//终端编号
	private String terminalName;//终端名称
	private String terminalUser;//终端用户
	
	//自助机信息
	private String machineId;//自助机id
	private String machineMac;//自助机mac地址
	private String machineCode;//自助机编码
	private String machineName;//自助机名称
	private String machineUser;//自助机用户
	private String machineMngCode;//自助机管理方编号
		
	private String hisNo;//医院编号
	private String patientNo;//病人编号
	private String patientName;//病人姓名	
	private String patientIdNo;//病人身份证号
	private String patientCardNo;//病人卡号	
	private String patientCardType;//就诊卡类型
	private String inpatientId;//住院ID
	
	private Date createTime;//创建时间	
	private Date tranTime;//交易时间	
	private Date finishTime;//完成时间  交易完成时间 或 关闭时间
	private String outTime;// 过期时间
	
	private BigDecimal amt = new BigDecimal(0) ;//交易金额
	private BigDecimal realAmt = new BigDecimal(0) ;// 已支付金额
	private BigDecimal lastAmt = new BigDecimal(0) ;// 最后一次支付金额
	private BigDecimal paAmt = new BigDecimal(0);//个人账户金额	
	private BigDecimal miAmt = new BigDecimal(0);//医保报销金额	
	private BigDecimal selfAmt = new BigDecimal(0);//个人自付金额
	private BigDecimal reduceAmt = new BigDecimal(0);//减免金额
	
	private String optStatus;//操作状态 0-正常 E-异常 T-同步 A-补录 C-撤销	
	private Date optTime;//操作时间
	private String optId;//操作者ID
	private String optName;//操作者名称
	private String operation;//操作内容
	
	private List<Settlement> settlements =  new ArrayList<Settlement>();//结算单
	private List<Fee> fees =  new ArrayList<Fee>();//费用明细
	
	private Order oriOrder;
	private Map<String, Object> variables = new HashMap<String, Object>();

	public BigDecimal getReduceAmt() {
		return reduceAmt;
	}

	public void setReduceAmt(BigDecimal reduceAmt) {
		this.reduceAmt = reduceAmt;
	}
	public String getOrderNo() {
		return orderNo;
	}

	public void setOrderNo(String orderNo) {
		this.orderNo = orderNo;
	}

	public String getOrderType() {
		return orderType;
	}

	public void setOrderType(String orderType) {
		this.orderType = orderType;
	}

	public String getOrderTitle() {
		return orderTitle;
	}

	public void setOrderTitle(String orderTitle) {
		this.orderTitle = orderTitle;
	}

	public String getOrderDesc() {
		return orderDesc;
	}

	public void setOrderDesc(String orderDesc) {
		this.orderDesc = orderDesc;
	}

	public String getBizType() {
		return bizType;
	}

	public void setBizType(String bizType) {
		this.bizType = bizType;
	}

	public String getBizNo() {
		return bizNo;
	}

	public void setBizNo(String bizNo) {
		this.bizNo = bizNo;
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

	public String getBizTime() {
		return bizTime;
	}

	public void setBizTime(String bizTime) {
		this.bizTime = bizTime;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getHisNo() {
		return hisNo;
	}

	public void setHisNo(String hisNo) {
		this.hisNo = hisNo;
	}

	public String getTerminalId() {
		return terminalId;
	}

	public void setTerminalId(String terminalId) {
		this.terminalId = terminalId;
	}

	public String getTerminalCode() {
		return terminalCode;
	}

	public void setTerminalCode(String terminalCode) {
		this.terminalCode = terminalCode;
	}

	public String getTerminalName() {
		return terminalName;
	}

	public void setTerminalName(String terminalName) {
		this.terminalName = terminalName;
	}

	public String getTerminalUser() {
		return terminalUser;
	}

	public void setTerminalUser(String terminalUser) {
		this.terminalUser = terminalUser;
	}

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
	
	public String getInpatientId() {
		return inpatientId;
	}

	public void setInpatientId(String inpatientId) {
		this.inpatientId = inpatientId;
	}
	@JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
	public Date getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}
	
	@JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
	public Date getTranTime() {
		return tranTime;
	}
	
	public void setTranTime(Date tranTime) {
		this.tranTime = tranTime;
	}
	
	
	@JsonFormat(pattern="yyyy-MM-dd HH:mm:ss",timezone = "GMT+8")
	public Date getFinishTime() {
		return finishTime;
	}

	public void setFinishTime(Date finishTime) {
		this.finishTime = finishTime;
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

	public String getOutTime() {
		return outTime;
	}

	public void setOutTime(String outTime) {
		this.outTime = outTime;
	}

	public String getMachineId() {
		return machineId;
	}

	public void setMachineId(String machineId) {
		this.machineId = machineId;
	}

	public String getMachineMac() {
		return machineMac;
	}

	public void setMachineMac(String machineMac) {
		this.machineMac = machineMac;
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

	public String getMachineUser() {
		return machineUser;
	}

	public void setMachineUser(String machineUser) {
		this.machineUser = machineUser;
	}

	public String getMachineMngCode() {
		return machineMngCode;
	}

	public void setMachineMngCode(String machineMngCode) {
		this.machineMngCode = machineMngCode;
	}

	public String getOptStatus() {
		return optStatus;
	}

	public void setOptStatus(String optStatus) {
		this.optStatus = optStatus;
	}

	public Date getOptTime() {
		return optTime;
	}

	public void setOptTime(Date optTime) {
		this.optTime = optTime;
	}

	public String getOptId() {
		return optId;
	}

	public void setOptId(String optId) {
		this.optId = optId;
	}

	public String getOptName() {
		return optName;
	}

	public void setOptName(String optName) {
		this.optName = optName;
	}

	public String getOperation() {
		return operation;
	}

	public void setOperation(String operation) {
		this.operation = operation;
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
	
	@ManyToOne
	@JoinColumn(name="ORI_ORDER_ID")
	public Order getOriOrder() {
		return oriOrder;
	}

	public void setOriOrder(Order oriOrder) {
		this.oriOrder = oriOrder;
	}

	@Transient
	public Map<String, Object> getVariables() {
		return variables;
	}
	public void setVariables(Map<String, Object> variables) {
		this.variables = variables;
	}
}
