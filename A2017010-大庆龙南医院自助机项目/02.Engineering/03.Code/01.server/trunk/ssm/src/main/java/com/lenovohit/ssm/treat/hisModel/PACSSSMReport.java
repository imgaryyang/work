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
@Table(name = "v_zzjreport")
public class PACSSSMReport implements Model {

    /**
	 * 
	 */
	private static final long serialVersionUID = 5357151742208871392L;
	private PACSSSMReport id;
	private String name;
    private String applyNo;
    private String printStatus;//0-未打印1-已打印
    
    @Id
    public PACSSSMReport getId() {
		return id;
	}
	public void setId(PACSSSMReport id) {
		this.id = id;
	}
	
	@Column(name="NAME")
    public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	
	@Column(name="APPLYNO")
	public String getApplyNo() {
		return applyNo;
	}
	public void setApplyNo(String applyNo) {
		this.applyNo = applyNo;
	}
	
	@Column(name="PRINT_STATUS")
	public String getPrintStatus() {
		return printStatus;
	}
	public void setPrintStatus(String printStatus) {
		this.printStatus = printStatus;
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
        return new HashCodeBuilder().append(this.getApplyNo()).toHashCode();
    }

    /**
     * 重载equals
     */
    public boolean equals(Object obj) {
        return EqualsBuilder.reflectionEquals(this, obj);
    }
    @Override
    public boolean _newObejct() {
        return null == this.getApplyNo();
    }

}
