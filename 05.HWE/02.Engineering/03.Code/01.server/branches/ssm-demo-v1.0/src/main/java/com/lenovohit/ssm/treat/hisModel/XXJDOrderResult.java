package com.lenovohit.ssm.treat.hisModel;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;

import com.lenovohit.core.model.Model;

@Entity
@Table(name = "VIEW_XXJD_ORDERRESULT")
public class XXJDOrderResult implements Model{
	private static final long serialVersionUID = -1556263208245070678L;
	private XXJDOrderResultId id;
	private String result;//结果
	private String jydate;//检验日期
	private String jydoctor;//检验者
	private String result_fygj;//反映格局
	
	
	@Id
	public XXJDOrderResultId getId() {
		return id;
	}
	public void setId(XXJDOrderResultId id) {
		this.id = id;
	}
	@Column(name="RESULT")
	public String getResult() {
		return result;
	}
	public void setResult(String result) {
		this.result = result;
	}
	@Column(name="JYDATE")
	public String getJydate() {
		return jydate;
	}
	public void setJydate(String jydate) {
		this.jydate = jydate;
	}
	@Column(name="JYDOCTOR")
	public String getJydoctor() {
		return jydoctor;
	}
	public void setJydoctor(String jydoctor) {
		this.jydoctor = jydoctor;
	}
	@Column(name="RESULT_FYGJ")
	public String getResult_fygj() {
        return result_fygj;
    }
    public void setResult_fygj(String result_fygj) {
        this.result_fygj = result_fygj;
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
	
	@Override
	public boolean _newObejct() {
		return null == this.getId();
	}
}
