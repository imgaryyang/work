/*
 * Welcome to use the TableGo Tools.
 * 
 * http://vipbooks.iteye.com
 * http://blog.csdn.net/vipbooks
 * http://www.cnblogs.com/vipbooks
 * 
 * Author:bianj
 * Email:edinsker@163.com
 * Version:5.8.0
 */

package com.lenovohit.hwe.mobile.core.model;

import javax.persistence.Entity;
import javax.persistence.Table;

import com.lenovohit.hwe.base.model.AuditableModel;

/**
 * DRUG
 * 
 * @author redstar
 * @version 1.0.0 2017-12-14
 */
@Entity
@Table(name = "APP_DRUG")
public class DrugInfo  extends AuditableModel implements java.io.Serializable {
    /** 版本号 */
    private static final long serialVersionUID = 5123120272341522921L;
   
    /** drugId 名称 */
    private String drugId;
    
    /** classificationId 分类 */
    private String classificationId;
    
	/** isRescue 抢救药物 */
    private String isRescue;
    
    /** abbreviation 药品简写 */
    private String abbreviation; 

    /** summary 概要  */
    private String summary;
    
    /** drugName 药品名称  */
    private String drugName;
    
    /** drugType 药品类别  */
    private String drugType;

	/** ingredients 成分*/
    private String ingredients;

    /** dosage 剂量 */
    private String dosage;

    /** indication 适应症 */
    private String indication;

    /** taboo 禁忌 */
    private String taboo;
    
    /** notes  注意事项*/
    private String notes;

    /** adverseReactions 不良反应 */
    private String adverseReactions;
    
    

	public String getDrugId() {
		return drugId;
	}

	public void setDrugId(String drugId) {
		this.drugId = drugId;
	}

	public String getClassificationId() {
		return classificationId;
	}

	public void setClassificationId(String classificationId) {
		this.classificationId = classificationId;
	}

	public String getIsRescue() {
		return isRescue;
	}

	public void setIsRescue(String isRescue) {
		this.isRescue = isRescue;
	}

	public String getAbbreviation() {
		return abbreviation;
	}

	public void setAbbreviation(String abbreviation) {
		this.abbreviation = abbreviation;
	}

	public String getSummary() {
		return summary;
	}

	public void setSummary(String summary) {
		this.summary = summary;
	}

	public String getDrugName() {
		return drugName;
	}

	public void setDrugName(String drugName) {
		this.drugName = drugName;
	}

	public String getDrugType() {
		return drugType;
	}

	public void setDrugType(String drugType) {
		this.drugType = drugType;
	}

	public String getIngredients() {
		return ingredients;
	}

	public void setIngredients(String ingredients) {
		this.ingredients = ingredients;
	}

	public String getDosage() {
		return dosage;
	}

	public void setDosage(String dosage) {
		this.dosage = dosage;
	}

	public String getIndication() {
		return indication;
	}

	public void setIndication(String indication) {
		this.indication = indication;
	}

	public String getTaboo() {
		return taboo;
	}

	public void setTaboo(String taboo) {
		this.taboo = taboo;
	}

	public String getNotes() {
		return notes;
	}

	public void setNotes(String notes) {
		this.notes = notes;
	}

	public String getAdverseReactions() {
		return adverseReactions;
	}

	public void setAdverseReactions(String adverseReactions) {
		this.adverseReactions = adverseReactions;
	}

}