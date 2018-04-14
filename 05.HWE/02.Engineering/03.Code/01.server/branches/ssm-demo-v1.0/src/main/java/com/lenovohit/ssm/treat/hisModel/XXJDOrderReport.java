package com.lenovohit.ssm.treat.hisModel;

import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Transient;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;

import com.lenovohit.core.model.Model;

public class XXJDOrderReport implements Model {

    /**
     * 
     */
    private static final long serialVersionUID = -6002107081174983942L;
    private String orderno;//标本号
    private String patientNo;//病案号
    private String jymodelname;//项目名称
    private String patientName;//姓名
    private String patientDeptname;//科室
    private String orderdate;//接收时间
    private String jsdoctor;//接收人
    private String patientSex;//性别
    private String startDate;//
    private String endDate;//
    private String reqdatetime;//申请时间
    private String reqDoctor;//开单医生
    private String titleName;//职称
    private String state;//状态
    private String patientAge;//年龄
    private String clinicalDiagnosis;//临床诊断
    private String bedNo;//床号
    private String inpatientArea;//病区
    private String auditDate;//审核日期
    private String reviewer;//审核者
    private String jyname;//检验项目
    private String result;//结果
    private String result_fygj;//格局
    private String jydate;//检验日期
    @Id
    @Column(name="orderno")
    @GeneratedValue(strategy = GenerationType.AUTO)
    public String getOrderno() {
        return orderno;
    }
    public void setOrderno(String orderno) {
        this.orderno = orderno;
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
    
    public String getJymodelname() {
        return jymodelname;
    }
    public void setJymodelname(String jymodelname) {
        this.jymodelname = jymodelname;
    }
    public String getOrderdate() {
        return orderdate;
    }
    public void setOrderdate(String orderdate) {
        this.orderdate = orderdate;
    }
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
    @Column(name="JYNAME")
    public String getJyname() {
        return jyname;
    }
    public void setJyname(String jyname) {
        this.jyname = jyname;
    }
    @Column(name="RESULT")
    public String getResult() {
        return result;
    }
    public void setResult(String result) {
        this.result = result;
    }
    @Column(name="RESULT_FYGJ")
    public String getResult_fygj() {
        return result_fygj;
    }
    public void setResult_fygj(String result_fygj) {
        this.result_fygj = result_fygj;
    }
    @Column(name="JYDATE")
    public String getJydate() {
        return jydate;
    }
    public void setJydate(String jydate) {
        this.jydate = jydate;
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
        return new HashCodeBuilder().append(this.getOrderno()).toHashCode();
    }

    /**
     * 重载equals
     */
    public boolean equals(Object obj) {
        return EqualsBuilder.reflectionEquals(this, obj);
    }
    @Override
    public boolean _newObejct() {
        return null == this.getOrderno();
    }

}
