package com.lenovohit.hcp.pharmacy.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "OUTPUT_BILL") // 药房药库 - 入库单
public class OutputInfoBill {

	private String id; // 盘点单号

	private String deptId; // 库房
	
	private String outType;//库房名称

	private String hosId;
	
	private Date outTime;// '创建时间',
	
	private String outOper;// '创建人员',

	private String outputState; // 盘点状态

	@Id
	@Column(name = "OUT_BILL")
	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getDeptId() {
		return deptId;
	}

	public void setDeptId(String deptId) {
		this.deptId = deptId;
	}

	public String getHosId() {
		return hosId;
	}

	public void setHosId(String hosId) {
		this.hosId = hosId;
	}

	public String getOutType() {
		return outType;
	}

	public void setOutType(String outType) {
		this.outType = outType;
	}

	public Date getOutTime() {
		return outTime;
	}

	public void setOutTime(Date outTime) {
		this.outTime = outTime;
	}

	public String getOutOper() {
		return outOper;
	}

	public void setOutOper(String outOper) {
		this.outOper = outOper;
	}

	public String getOutputState() {
		return outputState;
	}

	public void setOutputState(String outputState) {
		this.outputState = outputState;
	}

}