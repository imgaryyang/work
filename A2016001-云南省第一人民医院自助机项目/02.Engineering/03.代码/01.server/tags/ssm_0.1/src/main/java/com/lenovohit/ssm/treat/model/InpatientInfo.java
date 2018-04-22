package com.lenovohit.ssm.treat.model;

import java.math.BigDecimal;

//住院基本信息
public class InpatientInfo {
	private String id;				//住院ID
	private String bedArea;			//病区 	"02",
	private String bedNo;			//床位号 	"15",
	private String inpatientId;		//病人ID 	"02993030",
	private String inpatientName;	//病人姓名 	"王洁实",
	private String admissionDate;	//入院日期 	"2017-02-01",
	private String billDate;		//账单日期 	"2017-02-10",
	private String feeType;			//费用类别编码 "001",
	private String feeTypeName;		//费用类别 	"自费",

	private String billStartDate;;	//费用起始日期 "2017-02-01",
	private String billEndDate;		//费用截止日期 "2017-02-09",

	private BigDecimal totalAmt = new BigDecimal(0);		//合计总金额 	990.86,
	private BigDecimal totalSelfPaid = new BigDecimal(0);	//合计自付金额 	990.86,
	private BigDecimal totalBookAmt = new BigDecimal(0);	//合计记账金额 	0.00,
	private BigDecimal totalReductionAmt = new BigDecimal(0);//合计减免金额 	0.00
	private BigDecimal prepaidBalance;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getBedArea() {
		return bedArea;
	}

	public void setBedArea(String bedArea) {
		this.bedArea = bedArea;
	}

	public String getBedNo() {
		return bedNo;
	}

	public void setBedNo(String bedNo) {
		this.bedNo = bedNo;
	}

	public String getInpatientId() {
		return inpatientId;
	}

	public void setInpatientId(String inpatientId) {
		this.inpatientId = inpatientId;
	}

	public String getInpatientName() {
		return inpatientName;
	}

	public void setInpatientName(String inpatientName) {
		this.inpatientName = inpatientName;
	}

	public String getAdmissionDate() {
		return admissionDate;
	}

	public void setAdmissionDate(String admissionDate) {
		this.admissionDate = admissionDate;
	}
	public String getBillDate() {
		return billDate;
	}

	public void setBillDate(String billDate) {
		this.billDate = billDate;
	}

	public String getFeeType() {
		return feeType;
	}

	public void setFeeType(String feeType) {
		this.feeType = feeType;
	}

	public String getFeeTypeName() {
		return feeTypeName;
	}

	public void setFeeTypeName(String feeTypeName) {
		this.feeTypeName = feeTypeName;
	}

	public String getBillStartDate() {
		return billStartDate;
	}

	public void setBillStartDate(String billStartDate) {
		this.billStartDate = billStartDate;
	}

	public String getBillEndDate() {
		return billEndDate;
	}

	public void setBillEndDate(String billEndDate) {
		this.billEndDate = billEndDate;
	}

	public BigDecimal getTotalAmt() {
		return totalAmt;
	}

	public void setTotalAmt(BigDecimal totalAmt) {
		this.totalAmt = totalAmt;
	}

	public BigDecimal getTotalSelfPaid() {
		return totalSelfPaid;
	}

	public void setTotalSelfPaid(BigDecimal totalSelfPaid) {
		this.totalSelfPaid = totalSelfPaid;
	}

	public BigDecimal getTotalBookAmt() {
		return totalBookAmt;
	}

	public void setTotalBookAmt(BigDecimal totalBookAmt) {
		this.totalBookAmt = totalBookAmt;
	}

	public BigDecimal getTotalReductionAmt() {
		return totalReductionAmt;
	}

	public void setTotalReductionAmt(BigDecimal totalReductionAmt) {
		this.totalReductionAmt = totalReductionAmt;
	}

	public BigDecimal getPrepaidBalance() {
		return prepaidBalance;
	}

	public void setPrepaidBalance(BigDecimal prepaidBalance) {
		this.prepaidBalance = prepaidBalance;
	}
}
