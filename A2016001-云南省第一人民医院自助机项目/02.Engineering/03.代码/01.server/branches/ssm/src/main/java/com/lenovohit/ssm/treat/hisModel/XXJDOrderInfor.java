package com.lenovohit.ssm.treat.hisModel;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;

import com.lenovohit.core.model.Model;

@Entity
@Table(name = "VIEW_XXJD_ORDERINFOR")
public class XXJDOrderInfor implements Model{
	private static final long serialVersionUID = -1556263208245070678L;
	
	private XXJDOrderInfoId id;
	private String unitCode;//单位编号
	private String patientCardNo;
	private String patientNo;//病案号
	private String jymodelname;//项目名称
	private String patientName;//姓名
	private String patientDeptname;//科室
	private String orderdate;//接收时间
	private String jsdoctor;//接收人
	private String patientSex;//性别
	private String startDate;//开始时间
	private String endDate;//结束时间
	private String reqdatetime;//申请时间
	private String reqDoctor;//开单医生
	private String titleName;//职称
	private String state;//状态 1-已签收；2-已检验；3-已审核；4-已打印;
	private String patientAge;//年龄
	private String clinicalDiagnosis;//临床诊断
	private String bedNo;//床号
	private String inpatientArea;//病区
	private String auditDate;//审核日期
	private String reviewer;//审核者
	private int printtimes;//打印次数
	
	
	@Id
	public XXJDOrderInfoId getId() {
		return id;
	}
	public void setId(XXJDOrderInfoId id) {
		this.id = id;
	}
	@Transient
	public String getPatientCardNo() {
		return patientCardNo;
	}
	public void setPatientCardNo(String patientCardNo) {
		this.patientCardNo = patientCardNo;
	}
	@Transient
	public String getUnitCode() {
		return unitCode;
	}
	public void setUnitCode(String unitCode) {
		this.unitCode = unitCode;
	}
	@Transient
	public String getStartDate() {
		return startDate;
	}
	public void setStartDate(String startDate) {
		this.startDate = startDate;
	}
	@Transient
	public String getEndDate() {
		return endDate;
	}
	public void setEndDate(String endDate) {
		this.endDate = endDate;
	}
	@Column(name="P_NO")
	public String getPatientNo() {
		return patientNo;
	}
	public void setPatientNo(String patientNo) {
		this.patientNo = patientNo;
	}
	@Column(name="P_NAME")
	public String getPatientName() {
		return patientName;
	}
	public void setPatientName(String patientName) {
		this.patientName = patientName;
	}
	@Column(name="P_DEPTNAME")
	public String getPatientDeptname() {
		return patientDeptname;
	}
	public void setPatientDeptname(String patientDeptname) {
		this.patientDeptname = patientDeptname;
	}
	@Column(name="P_SEX")
	public String getPatientSex() {
		return patientSex;
	}
	public void setPatientSex(String patientSex) {
		this.patientSex = patientSex;
	}
	@Column(name="jymodelname")
	public String getJymodelname() {
		return jymodelname;
	}
	public void setJymodelname(String jymodelname) {
		this.jymodelname = jymodelname;
	}
	@Column(name="orderdate")
	public String getOrderdate() {
		return orderdate;
	}
	public void setOrderdate(String orderdate) {
		this.orderdate = orderdate;
	}
	@Column(name="jsdoctor")
	public String getJsdoctor() {
		return jsdoctor;
	}
	public void setJsdoctor(String jsdoctor) {
		this.jsdoctor = jsdoctor;
	}
	@Column(name="REQDATETIME")
	public String getReqdatetime() {
        return reqdatetime;
    }
    public void setReqdatetime(String reqdatetime) {
        this.reqdatetime = reqdatetime;
    }
    @Column(name="REQDOCTOR")
    public String getReqDoctor() {
        return reqDoctor;
    }
    public void setReqDoctor(String reqDoctor) {
        this.reqDoctor = reqDoctor;
    }
    @Column(name="TITLE_NAME")
    public String getTitleName() {
        return titleName;
    }
    public void setTitleName(String titleName) {
        this.titleName = titleName;
    }
    @Column(name="STATE")
    public String getState() {
        return state;
    }
    public void setState(String state) {
        this.state = state;
    }
    @Column(name="P_AGE")
    public String getPatientAge() {
        return patientAge;
    }
    public void setPatientAge(String patientAge) {
        this.patientAge = patientAge;
    }
    @Column(name="P_DIAGNOSE")
    public String getClinicalDiagnosis() {
        return clinicalDiagnosis;
    }
    public void setClinicalDiagnosis(String clinicalDiagnosis) {
        this.clinicalDiagnosis = clinicalDiagnosis;
    }
    @Column(name="P_BEDNO")
    public String getBedNo() {
        return bedNo;
    }
    public void setBedNo(String bedNo) {
        this.bedNo = bedNo;
    }
    @Column(name="P_WARDNAME")
    public String getInpatientArea() {
        return inpatientArea;
    }
    public void setInpatientArea(String inpatientArea) {
        this.inpatientArea = inpatientArea;
    }
    @Column(name="SHDATE")
    public String getAuditDate() {
        return auditDate;
    }
    public void setAuditDate(String auditDate) {
        this.auditDate = auditDate;
    }
    @Column(name="SHZ")
    public String getReviewer() {
        return reviewer;
    }
    public void setReviewer(String reviewer) {
        this.reviewer = reviewer;
    }
    @Column(name="PRINTTIMES")
    public int getPrinttimes() {
        return printtimes;
    }
    public void setPrinttimes(int printtimes) {
        this.printtimes = printtimes;
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
