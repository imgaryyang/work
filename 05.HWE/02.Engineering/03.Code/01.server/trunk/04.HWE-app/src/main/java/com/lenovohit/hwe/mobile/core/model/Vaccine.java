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
 * APP_VACCINE
 * 
 * @author redstar
 * @version 1.0.0 2017-12-14
 */
@Entity
@Table(name = "APP_VACCINE")
public class Vaccine  extends AuditableModel implements java.io.Serializable {
   
	/** 版本号 */
    private static final long serialVersionUID = 5123120272341522921L;
   
    /** vaccineID id */
    private String vaccineId;
    
    /** vaccineName 名称 */
    private String vaccineName;
    
    /** vaccinePinYin 拼音 */
    private String vaccinePinyin;
    
	/** abbreviation  */
    private String abbreviation;
    
    /** disease 相关疾病 */
    private String disease; 

    /** inoculationSite 注射地方  */
    private String inoculationSite;
    
    /** way 注射方式  */
    private String way;
	
    /** inoculationTimes 时间  */
    private String inoculationTime;
    
    /** dose 规格  */
    private String dose;
    
    /** remark 备注  */
    private String remark;
    
    /** dayBirth 注射方式  */
    private String dayBirth;

	

	public String getVaccineId() {
		return vaccineId;
	}

	public void setVaccineId(String vaccineId) {
		this.vaccineId = vaccineId;
	}

	public String getVaccineName() {
		return vaccineName;
	}

	public void setVaccineName(String vaccineName) {
		this.vaccineName = vaccineName;
	}

	public String getVaccinePinyin() {
		return vaccinePinyin;
	}

	public void setVaccinePinyin(String vaccinePinyin) {
		this.vaccinePinyin = vaccinePinyin;
	}

	public String getAbbreviation() {
		return abbreviation;
	}

	public void setAbbreviation(String abbreviation) {
		this.abbreviation = abbreviation;
	}

	public String getDisease() {
		return disease;
	}

	public void setDisease(String disease) {
		this.disease = disease;
	}

	public String getInoculationSite() {
		return inoculationSite;
	}

	public void setInoculationSite(String inoculationSite) {
		this.inoculationSite = inoculationSite;
	}

	public String getWay() {
		return way;
	}

	public void setWay(String way) {
		this.way = way;
	}

	public String getInoculationTime() {
		return inoculationTime;
	}

	public void setInoculationTime(String inoculationTime) {
		this.inoculationTime = inoculationTime;
	}

	public String getDose() {
		return dose;
	}

	public void setDose(String dose) {
		this.dose = dose;
	}

	public String getRemark() {
		return remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public String getDayBirth() {
		return dayBirth;
	}

	public void setDayBirth(String dayBirth) {
		this.dayBirth = dayBirth;
	}

   }