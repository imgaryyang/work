package com.lenovohit.elh.treat.model;

import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.hibernate.annotations.GenericGenerator;

import com.lenovohit.core.model.BaseModel;

/**
 * 取药表
 * @author Administrator
 *
 */
@Entity
@Table(name="ELH_DRUGORDER")
public class DrugOrder extends BaseModel{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 8824492270201052605L;
	
	
	//private String patient;//取药人//TODO 是否去掉
	//private String createTime;//开具时间//TODO 是否去掉
	//private String payed;//是否缴费//TODO 是否去掉
	private Double amount;//金额
	private String id;//
	private List<DrugDetail> details;
	
	@Id
	@Column(name="ID",length = 32)
	@GeneratedValue(generator="system-uuid")
	@GenericGenerator(name="system-uuid", strategy="assigned")
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public Double getAmount() {
		return amount;
	}
	public void setAmount(Double amount) {
		this.amount = amount;
	}
	@Transient
	public List<DrugDetail> getDetails() {
		return details;
	}
	public void setDetails(List<DrugDetail> details) {
		this.details = details;
	}
	@Transient
	@Override
	public boolean _newObejct() {
		return null == this.getId();
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
