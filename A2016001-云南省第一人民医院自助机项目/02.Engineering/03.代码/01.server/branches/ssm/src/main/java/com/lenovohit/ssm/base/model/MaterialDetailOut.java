package com.lenovohit.ssm.base.model;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.lenovohit.core.model.BaseIdModel;

/**
 * 出库明细
 * @author wang
 *
 */
@Entity
@Table(name="SSM_MATERIAL_DETAIL_OUT")
public class MaterialDetailOut extends BaseIdModel {
	private static final long serialVersionUID = -5855416698692933351L;
	
	private int outPutAccount;//出库数量
	private String outPutTime;//出库时间
	private String operator;//操作人
	private Machine machine;//自助机编号
	private Material material;//材料编号
	private String outTime;//时间
	
	public int getOutPutAccount() {
		return outPutAccount;
	}
	public void setOutPutAccount(int outPutAccount) {
		this.outPutAccount = outPutAccount;
	}
	public String getOutPutTime() {
		return outPutTime;
	}
	public void setOutPutTime(String outPutTime) {
		this.outPutTime = outPutTime;
	}
	public String getOperator() {
		return operator;
	}
	public void setOperator(String operator) {
		this.operator = operator;
	}
	@JoinColumn(name = "MACHINE_ID")
	@ManyToOne
	public Machine getMachine() {
		return machine;
	}
	public void setMachine(Machine machine) {
		this.machine = machine;
	}
	@JoinColumn(name = "MATERIAL_ID")
	@ManyToOne
	public Material getMaterial() {
		return material;
	}
	public void setMaterial(Material material) {
		this.material = material;
	}
	public String getOutTime() {
		return outTime;
	}
	public void setOutTime(String outTime) {
		this.outTime = outTime;
	}
	
}
