package com.infohold.ebpp.bill.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;

import com.infohold.core.model.BaseIdModel;

/**
 * 日终对账状态表
 * @author Administrator
 *
 */
@Entity
@Table(name = "IH_EBPP_END_COM_STA")
public class EndDayComSta extends BaseIdModel{

	private static final long serialVersionUID = 7461989015504327467L;
	
	private String compareDate;
	private String flag;
	
	
	@Column(name="COMPARE_DATE",length=10)
	public String getCompareDate() {
		return compareDate;
	}
	public void setCompareDate(String compareDate) {
		this.compareDate = compareDate;
	}
	@Column(name = "FLAG" , length=1)
	public String getFlag() {
		return flag;
	}
	public void setFlag(String flag) {
		this.flag = flag;
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
