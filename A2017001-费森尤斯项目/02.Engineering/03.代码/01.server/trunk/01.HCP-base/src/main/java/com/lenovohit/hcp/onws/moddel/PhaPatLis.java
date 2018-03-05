package com.lenovohit.hcp.onws.moddel;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.lenovohit.core.model.Model;
import com.lenovohit.hcp.base.annotation.RedisSequence;
import com.lenovohit.hcp.base.model.ItemInfo;
import com.lenovohit.hcp.card.model.Patient;

@Entity
@Table(name = "PHA_PATLIS")
public class PhaPatLis implements Model{

	private static final long serialVersionUID = -6240529075496406977L;

	private String patientId;			//病人ID          
		
	private String regId;                //挂号ID  
	
	private String regNo;                //就诊号  
		
	private String name;                 //姓名    
		
	private String recipeId;             //处方ID  
		
	private Integer recipeNo;            //处方序号
		
	private String itemCode;             //项目编码
		
	private String itemName;             //项目名称
		
	private String specs;                //项目规格
		
	private Integer qty;              //收费数量
		
	private String unit;                 //收费单位
		
	private String combNo;               //组号    
		
	private String stateFlag;            //状态    
		
	private Date specimendate;           //采样时间
		
	private Date senddate;               //送检时间
		
	private String specimencode;         //标本代码
		
	private String specimenname;         //标本名称
		
	private String specimencount;        //标本个数
	
	private String specimenType;        //标本类型
		
	private String memo;                 //备注    
		
	private String exambarcode;			//第三方检验条码号
	
	private ItemInfo itemInfo;
	
	private Patient patient;
	private String hosId;
	private Date createTime;// '创建时间',
	private String createOper;// '创建人员',
	private String createOperId;// '创建人员',
	private Date updateTime;// '更新时间',
	private String updateOper;// '更新人员'
	private String updateOperId;// '创建人员',
	
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

	@Transient
	public String getPatientId() {
		return patientId;
	}

	public void setPatientId(String patientId) {
		this.patientId = patientId;
	}

	public String getRegId() {
		return regId;
	}

	public void setRegId(String regId) {
		this.regId = regId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
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

	@Transient
	public String getItemCode() {
		return itemCode;
	}

	public void setItemCode(String itemCode) {
		this.itemCode = itemCode;
	}

	public String getItemName() {
		return itemName;
	}

	public void setItemName(String itemName) {
		this.itemName = itemName;
	}

	public String getSpecs() {
		return specs;
	}

	public void setSpecs(String specs) {
		this.specs = specs;
	}

	public Integer getQty() {
		return qty;
	}

	public void setQty(Integer qty) {
		this.qty = qty;
	}

	public String getUnit() {
		return unit;
	}

	public void setUnit(String unit) {
		this.unit = unit;
	}

	public String getCombNo() {
		return combNo;
	}

	public void setCombNo(String combNo) {
		this.combNo = combNo;
	}

	public String getStateFlag() {
		return stateFlag;
	}

	public void setStateFlag(String stateFlag) {
		this.stateFlag = stateFlag;
	}

	@JsonFormat(pattern = "yyyy-MM-dd", timezone = "GMT+8")
	public Date getSpecimendate() {
		return specimendate;
	}

	public void setSpecimendate(Date specimendate) {
		this.specimendate = specimendate;
	}

	@JsonFormat(pattern = "yyyy-MM-dd", timezone = "GMT+8")
	public Date getSenddate() {
		return senddate;
	}

	public void setSenddate(Date senddate) {
		this.senddate = senddate;
	}

	public String getSpecimencode() {
		return specimencode;
	}

	public void setSpecimencode(String specimencode) {
		this.specimencode = specimencode;
	}

	public String getSpecimenname() {
		return specimenname;
	}

	public void setSpecimenname(String specimenname) {
		this.specimenname = specimenname;
	}

	public String getSpecimencount() {
		return specimencount;
	}

	public void setSpecimencount(String specimencount) {
		this.specimencount = specimencount;
	}

	public String getMemo() {
		return memo;
	}

	public void setMemo(String memo) {
		this.memo = memo;
	}

	@RedisSequence
	public String getExambarcode() {
		return exambarcode;
	}

	public void setExambarcode(String exambarcode) {
		this.exambarcode = exambarcode;
	}

	public String getSpecimenType() {
		return specimenType;
	}

	public void setSpecimenType(String specimenType) {
		this.specimenType = specimenType;
	}

	@ManyToOne
	@JoinColumn(name = "ITEM_CODE", nullable = true)
	@NotFound(action=NotFoundAction.IGNORE)
	public ItemInfo getItemInfo() {
		return itemInfo;
	}

	public void setItemInfo(ItemInfo itemInfo) {
		this.itemInfo = itemInfo;
	}

	@ManyToOne
	@JoinColumn(name = "PATIENT_ID", nullable = true)
	@NotFound(action=NotFoundAction.IGNORE)
	public Patient getPatient() {
		return patient;
	}

	public void setPatient(Patient patient) {
		this.patient = patient;
	}

	public String getRegNo() {
		return regNo;
	}

	public void setRegNo(String regNo) {
		this.regNo = regNo;
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