/**
 * 
 */
package com.lenovohit.hcp.pharmacy.model;

import javax.persistence.Transient;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.transaction.Transactional;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.lenovohit.hcp.base.model.ChargeDetail;
import com.lenovohit.hcp.base.model.HcpBaseModel;

/**
 * @author duanyanshan
 * @date 2017年11月6日 下午3:24:54
 */
@Entity
@Table(name = "RECIPE_INFO") // 病人基本信息;
public class RecipeInfo extends HcpBaseModel{
	
	/**
	 * 申请单状态 - 已交费未发药
	 */
	public static final String APPLY_STATE_CHARGED = "1";
	/**
	 * 申请单状态 - 已发药
	 */
	public static final String APPLY_STATE_DISPENSED = "2";
	/**
	 * 申请单状态 - 已退药
	 */
	public static final String APPLY_STATE_RETURNED = "3";
	/**
	 * 申请单状态 - 已退费
	 */
	public static final String APPLY_STATE_REFUND = "4";
	/**
	 * 申请单状态 - 已申请未退药
	 */
	public static final String APPLY_STATE_APPLY = "5";
	
	private static final long serialVersionUID = 1L;
	private String patientId;
	private String recipeId;
	private String name;
	private String applyState;
	private String regTime;
	private String regDept;
	private String deptName;
	private String dataFrom;
	private String medicalCardNo;// 诊疗卡号
	private String miCardNo;// 医保卡号
	private String idNo;
	private List<PhaRecipe> detailList;
	public String getPatientId() {
		return patientId;
	}
	public void setPatientId(String patientId) {
		this.patientId = patientId;
	}
	
	public String getRecipeId() {
		return recipeId;
	}
	public void setRecipeId(String recipeId) {
		this.recipeId = recipeId;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getMedicalCardNo() {
		return medicalCardNo;
	}
	public void setMedicalCardNo(String medicalCardNo) {
		this.medicalCardNo = medicalCardNo;
	}
	public String getMiCardNo() {
		return miCardNo;
	}
	public void setMiCardNo(String miCardNo) {
		this.miCardNo = miCardNo;
	}
	public String getApplyState() {
		return applyState;
	}
	public void setApplyState(String applyState) {
		this.applyState = applyState;
	}
	@Transient
	public List<PhaRecipe> getDetailList() {
		return detailList;
	}
	
	public void setDetailList(List<PhaRecipe> detailList) {
		this.detailList = detailList;
	}
	@Column(name="REG_TIME")
	@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
	public String getRegTime() {
		return regTime;
	}
	public void setRegTime(String regTime) {
		this.regTime = regTime;
	}
	public String getRegDept() {
		return regDept;
	}
	public void setRegDept(String regDept) {
		this.regDept = regDept;
	}
	public String getDataFrom() {
		return dataFrom;
	}
	public void setDataFrom(String dataFrom) {
		this.dataFrom = dataFrom;
	}
	public String getIdNo() {
		return idNo;
	}
	public void setIdNo(String idNo) {
		this.idNo = idNo;
	}
	public String getDeptName() {
		return deptName;
	}
	public void setDeptName(String deptName) {
		this.deptName = deptName;
	}
	
	
	

}
