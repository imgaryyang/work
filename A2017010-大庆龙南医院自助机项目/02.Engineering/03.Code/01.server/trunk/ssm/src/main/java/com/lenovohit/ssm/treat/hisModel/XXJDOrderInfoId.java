package com.lenovohit.ssm.treat.hisModel;

import javax.persistence.Column;
import javax.persistence.Embeddable;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;

import com.lenovohit.core.model.Model;

@Embeddable
public class XXJDOrderInfoId implements Model{
	private static final long serialVersionUID = -1556263208245070678L;
	
	private String orderno;//标本号
	private String itemCode;//项目代码
	
	@Column(name="ORDERNO")
	public String getOrderno() {
		return orderno;
	}
	public void setOrderno(String orderno) {
		this.orderno = orderno;
	}

	@Column(name="ITEMCODE")
    public String getItemCode() {
		return itemCode;
	}
	public void setItemCode(String itemCode) {
		this.itemCode = itemCode;
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
		return new HashCodeBuilder().append(this.getOrderno()).append(this.getItemCode()).toHashCode();
	}

	/**
	 * 重载equals
	 */
	public boolean equals(Object obj) {
		return EqualsBuilder.reflectionEquals(this, obj);
	}
	
	@Override
	public boolean _newObejct() {
		return null == this.getOrderno() && null == this.getItemCode();
	}
}
