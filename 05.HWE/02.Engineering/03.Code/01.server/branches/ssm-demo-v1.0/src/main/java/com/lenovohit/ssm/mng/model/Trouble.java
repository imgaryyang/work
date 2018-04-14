package com.lenovohit.ssm.mng.model;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.lenovohit.core.model.BaseIdModel;

@Entity
@Table(name="SSM_TROUBLE")
public class Trouble extends BaseIdModel {
	private static final long serialVersionUID = 1101578377643975237L;
	private String name;//名称
	private String operator;//操作人
	private String createTime;//操作时间
	private int sort;
	private String parent;//父故障
	
	private Set<TroubleDetail> details = new HashSet<TroubleDetail>();
	
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getOperator() {
		return operator;
	}
	public void setOperator(String operator) {
		this.operator = operator;
	}
	public String getCreateTime() {
		return createTime;
	}
	public void setCreateTime(String createTime) {
		this.createTime = createTime;
	}
	@OneToMany(targetEntity=TroubleDetail.class)
	@JoinColumn(name="TROUBLE_ID",referencedColumnName="ID")
	public Set<TroubleDetail> getDetails() {
		return details;
	}
	public void setDetails(Set<TroubleDetail> details) {
		this.details = details;
	}
	
	public String getParent() {
		return parent;
	}
	public void setParent(String parent) {
		this.parent = parent;
	}
	public int getSort() {
		return sort;
	}
	public void setSort(int sort) {
		this.sort = sort;
	}
	
}
