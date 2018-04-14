package com.lenovohit.ssm.base.model;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.lenovohit.core.model.BaseIdModel;


/**
 * 材料
 * @author wang
 */

@Entity
@Table(name="SSM_MATERIAL")
public class Material extends BaseIdModel{
	private static final long serialVersionUID = -7351251080372351118L;
	

	private String name;//材料名称
	private String unit;//单位
	private int account;//数量
	private String createUser;//操作人员
	private String supplier;//供应商
	private String remark;//备注
	private String createTime; //创建时间
	
	private Set<MaterialDetailIn> inDetails = new HashSet<MaterialDetailIn>();
	private Set<MaterialDetailOut> outDetails = new HashSet<MaterialDetailOut>();
	
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getUnit() {
		return unit;
	}
	public void setUnit(String unit) {
		this.unit = unit;
	}
	
	public int getAccount() {
		return account;
	}
	public void setAccount(int account) {
		this.account = account;
	}
	public String getCreateTime() {
		return createTime;
	}
	public void setCreateTime(String createTime) {
		this.createTime = createTime;
	}
	public String getCreateUser() {
		return createUser;
	}
	public void setCreateUser(String createUser) {
		this.createUser = createUser;
	}
	public String getSupplier() {
		return supplier;
	}
	public void setSupplier(String supplier) {
		this.supplier = supplier;
	}
	public String getRemark() {
		return remark;
	}
	public void setRemark(String remark) {
		this.remark = remark;
	}
	@OneToMany(targetEntity=MaterialDetailIn.class)
	@JoinColumn(name="MATERIAL_ID",referencedColumnName="ID")
	public Set<MaterialDetailIn> getInDetails() {
		return inDetails;
	}
	public void setInDetails(Set<MaterialDetailIn> inDetails) {
		this.inDetails = inDetails;
	}
	@OneToMany(targetEntity=MaterialDetailOut.class)
	@JoinColumn(name="MATERIAL_ID",referencedColumnName="ID")
	public Set<MaterialDetailOut> getOutDetails() {
		return outDetails;
	}
	public void setOutDetails(Set<MaterialDetailOut> outDetails) {
		this.outDetails = outDetails;
	}
	
}
