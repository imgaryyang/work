package com.lenovohit.hcp.onws.moddel;

import java.util.Date;

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

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.lenovohit.core.model.Model;

@Entity
@Table(name = "PHA_LISRESULT")
public class PhaLisResult implements Model{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private String patientId;		//病人ID          
    
	private String regId;          //挂号ID          
	                   
	private String recipeId;		//处方ID          
	                   
	private Integer recipeNo;       //处方序号        
	                   
	private String exambarcode;    //第三方检验条码号
	                   
	private String itemNo;         //检测项目序号    
	                   
	private String sinonym;        //检测项目名称    
	                   
	private String specs;          //检测项目别名    
	                   
	private String analyte;        //检测分析项目    
	                   
	private String unit;           //检测项目单位    
	                   
	private String value;          //检测项目值      
	                   
	private String displowhigh;    //参考值          
	                   
	private String displowhighM;  //男性参考值      
	                   
	private String displowhighF;  //女性参考值      
	                   
	private String dept;           //检测实验室      
	                   
	private String servgrp;        //检测科室        
	                   
	private String usrnam ;        //检测人          
	                   
	private String apprvedby;      //审核人          
	                   
	private Date apprdate;       //报告发布时间    
	                   
	private String Memo;           //备注            
	
	private String hosId;
	private Date createTime;// '创建时间',
	private String createOper;// '创建人员',
	private String createOperId;// '创建人员',
	private Date updateTime;// '更新时间',
	private String updateOper;// '更新人员'
	private String updateOperId;// '创建人员',
	private String flag; //标志, 化验结果高低（0正常，1高，2，低）
	
	public String getFlag() {
		return flag;
	}
	public void setFlag(String flag) {
		this.flag = flag;
	}
	@Column(name="HOS_ID")
	public String getHosId() {
		return hosId;
	}
	public void setHosId(String hosId) {
		this.hosId = hosId;
	}
	
	@Column(name="CREATE_TIME")
	@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
	public Date getCreateTime() {
		return createTime;
	}
	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}
	@Column(name="CREATE_OPER_ID")
	public String getCreateOperId() {
		return createOperId;
	}
	public void setCreateOperId(String createOperId) {
		this.createOperId = createOperId;
	}
	@Column(name="CREATE_OPER")
	public String getCreateOper() {
		return createOper;
	}
	public void setCreateOper(String createOper) {
		this.createOper = createOper;
	}
	@Column(name="UPDATE_TIME")
	@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
	public Date getUpdateTime() {
		return updateTime;
	}
	public void setUpdateTime(Date updateTime) {
		this.updateTime = updateTime;
	}
	@Column(name="UPDATE_OPER_ID")
	public String getUpdateOperId() {
		return updateOperId;
	}
	public void setUpdateOperId(String updateOperId) {
		this.updateOperId = updateOperId;
	}
	@Column(name="UPDATE_OPER")
	public String getUpdateOper() {
		return updateOper;
	}
	public void setUpdateOper(String updateOper) {
		this.updateOper = updateOper;
	}
	
	private String id;
	
	@Id
	@Column(name="ID", length=32)
	@GeneratedValue(generator="system-uuid")
	@GenericGenerator(name="system-uuid",strategy="uuid")
	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}


	public String getPatientId() {
		return patientId;
	}

	public void setPatientId(String patientId) {
		this.patientId = patientId == null ? null : patientId.trim();
	}

	public String getRegId() {
		return regId;
	}

	public void setRegId(String regId) {
		this.regId = regId;
	}

	public String getRecipeId() {
		return recipeId;
	}

	public void setRecipeId(String recipeId) {
		this.recipeId = recipeId;
	}

	public Integer getRecipeNo() {
		return recipeNo;
	}

	public void setRecipeNo(Integer recipeNo) {
		this.recipeNo = recipeNo;
	}

	public String getExambarcode() {
		return exambarcode;
	}

	public void setExambarcode(String exambarcode) {
		this.exambarcode = exambarcode;
	}

	public String getItemNo() {
		return itemNo;
	}

	public void setItemNo(String itemNo) {
		this.itemNo = itemNo;
	}

	public String getSinonym() {
		return sinonym;
	}

	public void setSinonym(String sinonym) {
		this.sinonym = sinonym;
	}

	public String getSpecs() {
		return specs;
	}

	public void setSpecs(String specs) {
		this.specs = specs;
	}

	public String getAnalyte() {
		return analyte;
	}

	public void setAnalyte(String analyte) {
		this.analyte = analyte;
	}

	public String getUnit() {
		return unit;
	}

	public void setUnit(String unit) {
		this.unit = unit;
	}

	@Column(name="FINAL")
	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}

	public String getDisplowhigh() {
		return displowhigh;
	}

	public void setDisplowhigh(String displowhigh) {
		this.displowhigh = displowhigh;
	}
	@Column(name="DISPLOWHIGH_M", length=512)
	public String getDisplowhighM() {
		return displowhighM;
	}

	public void setDisplowhighM(String displowhighM) {
		this.displowhighM = displowhighM;
	}

	@Column(name="DISPLOWHIGH_F", length=512)
	public String getDisplowhighF() {
		return displowhighF;
	}

	public void setDisplowhighF(String displowhighF) {
		this.displowhighF = displowhighF;
	}

	public String getDept() {
		return dept;
	}

	public void setDept(String dept) {
		this.dept = dept;
	}

	public String getServgrp() {
		return servgrp;
	}

	public void setServgrp(String servgrp) {
		this.servgrp = servgrp;
	}

	public String getUsrnam() {
		return usrnam;
	}

	public void setUsrnam(String usrnam) {
		this.usrnam = usrnam;
	}

	public String getApprvedby() {
		return apprvedby;
	}

	public void setApprvedby(String apprvedby) {
		this.apprvedby = apprvedby;
	}

	
	@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
	public Date getApprdate() {
		return apprdate;
	}

	public void setApprdate(Date apprdate) {
		this.apprdate = apprdate;
	}

	public String getMemo() {
		return Memo;
	}

	public void setMemo(String memo) {
		Memo = memo;
	}

	@Transient
	@Deprecated
	@JsonIgnore
	public boolean isNew() {
		return null == this.getId();
	}
	
	@Transient
	@Override
	public boolean _newObejct() {
		return null == this.getId();
	}
	
	/**
	 * 閲嶈浇toString;
	 */
	public String toString() {
		return ToStringBuilder.reflectionToString(this);
	}

	/**
	 * 閲嶈浇hashCode;
	 */
	public int hashCode() {
		return new HashCodeBuilder().append(this.getId()).toHashCode();
	}

	/**
	 * 閲嶈浇equals
	 */
	public boolean equals(Object obj) {
		return EqualsBuilder.reflectionEquals(this, obj);
	}
}