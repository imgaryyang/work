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

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

import com.lenovohit.hwe.base.model.AuditableModel;

/**
 * Disease
 * 
 * @author redstar
 * @version 1.0.0 2017-12-14
 */
@Entity
@Table(name = "APP_DISEASE")
public class Disease  extends AuditableModel implements java.io.Serializable {
    /** 版本号 */
    private static final long serialVersionUID = 5123120272341522921L;
   
    /** diseaseId id */
    private String diseaseId;
	/** name 名称 */
    private String diseaseName;
    /** diseasePinyin 疾病拼音 */
    private String diseasePinyin;
    /** summary 概况 */
    private String summary; 

    /** deptName 科室名称 */
    private String deptName;

    /** pathogeny 病因 */
    private String pathogeny;

    /** symptom 病症 */
    private String symptom;

    /** diseaseCheck 检查 */
    private String diseaseCheck;

    /** identify 诊断 */
    private String identify;

    /** prevention 预防 */
    private String prevention;

    /** complication 并发症 */
    private String complication;

    /** treatment 治疗 */
    private String treatment;
    
    private String urgentNeedVisit;
    
    /** isCommon  是否是常见病 (1-常见 2-不常见)*/
    private String isCommon;

    /** partId 所属部位 */
    private String partId;
    private String depId;
    private String sort;
    
    @Column(name = "disease_id")
	public String getDiseaseId() {
		return diseaseId;
	}
	public void setDiseaseId(String diseaseId) {
		this.diseaseId = diseaseId;
	}
	@Column(name = "disease_name")
	public String getDiseaseName() {
		return diseaseName;
	}
	public void setDiseaseName(String diseaseName) {
		this.diseaseName = diseaseName;
	}
	@Column(name = "disease_pinyin")
	public String getDiseasePinyin() {
		return diseasePinyin;
	}
	public void setDiseasePinyin(String diseasePinyin) {
		this.diseasePinyin = diseasePinyin;
	}
	@Column(name = "summary")
	public String getSummary() {
		return summary;
	}
	public void setSummary(String summary) {
		this.summary = summary;
	}
	@Column(name = "dept_name")
	public String getDeptName() {
		return deptName;
	}
	public void setDeptName(String deptName) {
		this.deptName = deptName;
	}
	@Column(name = "pathogeny")
	public String getPathogeny() {
		return pathogeny;
	}
	public void setPathogeny(String pathogeny) {
		this.pathogeny = pathogeny;
	}
	@Column(name = "symptom")
	public String getSymptom() {
		return symptom;
	}
	public void setSymptom(String symptom) {
		this.symptom = symptom;
	}
	@Column(name = "disease_check")
	public String getDiseaseCheck() {
		return diseaseCheck;
	}
	public void setDiseaseCheck(String diseaseCheck) {
		this.diseaseCheck = diseaseCheck;
	}
	@Column(name = "identify")
	public String getIdentify() {
		return identify;
	}
	public void setIdentify(String identify) {
		this.identify = identify;
	}
	@Column(name = "prevention")
	public String getPrevention() {
		return prevention;
	}
	public void setPrevention(String prevention) {
		this.prevention = prevention;
	}
	@Column(name = "complication")
	public String getComplication() {
		return complication;
	}
	public void setComplication(String complication) {
		this.complication = complication;
	}
	@Column(name = "treatment")
	public String getTreatment() {
		return treatment;
	}
	public void setTreatment(String treatment) {
		this.treatment = treatment;
	}
	@Column(name = "urgent_need_visit")
	public String getUrgentNeedVisit() {
		return urgentNeedVisit;
	}
	public void setUrgentNeedVisit(String urgentNeedVisit) {
		this.urgentNeedVisit = urgentNeedVisit;
	}
	@Column(name = "is_common")
	public String getIsCommon() {
		return isCommon;
	}
	public void setIsCommon(String isCommon) {
		this.isCommon = isCommon;
	}
	@Column(name = "part_id")
	public String getPartId() {
		return partId;
	}
	public void setPartId(String partId) {
		this.partId = partId;
	}
	@Column(name = "dep_id")
	public String getDepId() {
		return depId;
	}
	public void setDepId(String depId) {
		this.depId = depId;
	}
	@Column(name = "sort")
	public String getSort() {
		return sort;
	}
	public void setSort(String sort) {
		this.sort = sort;
	}

}