package com.lenovohit.hcp.material.model;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "MATERIAL_INPUT_VIEW") // 物资库房 - 入库单
public class MatInputInfoBill {

	private String id; // 盘点单号

	private String deptId; // 库房
	
	private String inType;//库房名称

	private String hosId;
	
	private Date inTime;// '创建时间',
	
	private String inOper;// '创建人员',

	private String inputState; // 盘点状态

	@Id
	@Column(name = "IN_BILL")
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

	public String getInType() {
		return inType;
	}

	public void setInType(String inType) {
		this.inType = inType;
	}

	public Date getInTime() {
		return inTime;
	}

	public void setInTime(Date inTime) {
		this.inTime = inTime;
	}

	public String getInOper() {
		return inOper;
	}

	public void setInOper(String inOper) {
		this.inOper = inOper;
	}

	public String getInputState() {
		return inputState;
	}

	public void setInputState(String inputState) {
		this.inputState = inputState;
	}

}