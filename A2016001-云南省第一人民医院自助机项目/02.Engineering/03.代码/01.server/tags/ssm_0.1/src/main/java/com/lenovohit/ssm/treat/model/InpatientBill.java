package com.lenovohit.ssm.treat.model;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

//住院清单
public class InpatientBill {
	private String id;					//
	private String feeType;				//费用类别编码 "01",
	private String feeTypeName;			//费用类别 "材料费",
	private BigDecimal totalAmt;		//合计 2.95,
	private BigDecimal totalSelfPaid;	//自费合计 2.95,
	private List<InpatientBillDetail> items = new ArrayList<InpatientBillDetail>();//明细
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
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
	public List<InpatientBillDetail> getItems() {
		return items;
	}
	public void setItems(List<InpatientBillDetail> items) {
		this.items = items;
	}
}
