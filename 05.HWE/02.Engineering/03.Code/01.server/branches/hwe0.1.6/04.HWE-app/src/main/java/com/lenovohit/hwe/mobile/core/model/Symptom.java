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
import javax.persistence.*;
import com.lenovohit.hwe.base.model.AuditableModel;

/**
 * APP_SYMPTOM
 * 
 * @author redstar
 * @version 1.0.0 2017-12-14
 */
@Entity
@Table(name = "APP_SYMPTOM")
public class Symptom  extends AuditableModel implements java.io.Serializable {
   
	/** 版本号 */
    private static final long serialVersionUID = 512231227239122921L;
   
    /** symptomId 编号 */
    private String symptomId;
    
    /** symptomName 名称 */
    private String symptomName;
    
    /** pinyin 拼音 */
    private String pinyin;
    
    /** sort 排序 */
    private String sort;
    
	/** partId 部位ID */
    private String partId;
    
    /** gender 性别 */
    private String gender; 

    /** minAge 最小年龄  */
    private String minAge;
    
    /** maxAge 序号  */
    private String maxAge;
    
//    /** parentSymptom 父病症  */
//    private Symptom parentSymptom;
//    
//    /** relSymptoms 子病症  */
//    private List<Symptom> relSymptoms = new ArrayList<Symptom>();  
//    
    /** relationship 关系 */
    private String parentRelationship;
    
    /** parentSymptomId 上级病症ID */
    private String parentSymptomId;
    
//     
//    private Set<Disease> diseases;
    
    /** childSymptomCount 子症状 数量 */
    private int childSymptomCount;
	
    @Column(name = "SYMPTOM_ID", nullable = true, length = 12)
	public String getSymptomId() {
		return symptomId;
	}

	public void setSymptomId(String symptomId) {
		this.symptomId = symptomId;
	}

	@Column(name = "SYMPTOM_NAME", nullable = true, length = 255)
	public String getSymptomName() {
		return symptomName;
	}

	public void setSymptomName(String symptomName) {
		this.symptomName = symptomName;
	}

	@Column(name = "PINYIN", nullable = true, length = 64)
	public String getPinyin() {
		return pinyin;
	}

	public void setPinyin(String pinyin) {
		this.pinyin = pinyin;
	}

	@Column(name = "SORT", nullable = true, length = 12)
	public String getSort() {
		return sort;
	}

	public void setSort(String sort) {
		this.sort = sort;
	}
	
	@Column(name = "PART_ID", nullable = true, length = 12)
	public String getPartId() {
		return partId;
	}

	public void setPartId(String partId) {
		this.partId = partId;
	}

	@Column(name = "GENDER", nullable = true, length = 2)
	public String getGender() {
		return gender;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}

	@Column(name = "MIN_AGE", nullable = true, length = 10)
	public String getMinAge() {
		return minAge;
	}

	public void setMinAge(String minAge) {
		this.minAge = minAge;
	}

	@Column(name = "MAX_AGE", nullable = true, length = 10)
	public String getMaxAge() {
		return maxAge;
	}

	public void setMaxAge(String maxAge) {
		this.maxAge = maxAge;
	}
	
	@Column(name = "PARENT_SYMPTOM_ID", nullable = true, length = 12)
	public String getParentSymptomId() {
		return parentSymptomId;
	}

	public void setParentSymptomId(String parentSymptomId) {
		this.parentSymptomId = parentSymptomId;
	}
	
	@Column(name = "PARENT_RELATIONSHIP", nullable = true, length = 64)
	public String getParentRelationship() {
		return parentRelationship;
	}

	public void setParentRelationship(String parentRelationship) {
		this.parentRelationship = parentRelationship;
	}
	
	@Transient
	public int getChildSymptomCount() {
		return childSymptomCount;
	}

	public void setChildSymptomCount(int childSymptomCount) {
		this.childSymptomCount = childSymptomCount;
	}
	
//	
//	public void setDiseases(Set<Disease> diseases) {
//		this.diseases = diseases;
//	}
//	
//    /** Diseases 关联的疾病 */
//    @ManyToMany(targetEntity = Disease.class, fetch = FetchType.EAGER)    
//    @JoinTable(name = "APP_SADR", joinColumns = @JoinColumn(name = "SYMPTOMS_ID", referencedColumnName="id"), 
//    inverseJoinColumns = @JoinColumn(name = "DISEASE_ID", referencedColumnName="id"))
//   	public Set<Disease> getDiseases() {
//		return diseases;
//	}
    
//    
//    public void setDiseases(Set<Disease> diseases) {
//    	this.diseases = diseases;
//    }

//    @ManyToOne(fetch = FetchType.LAZY)  
//    @JoinColumn(name = "PARENT_SYMPTOM_ID", referencedColumnName="SYMPTOM_ID",insertable = false, updatable = false)  
//    public Symptom getParentSymptom() {  
//        return parentSymptom;  
//    }  
//  
//    public void setParentSymptom(Symptom parentSymptom) {  
//    	this.parentSymptom = parentSymptom;
//    }  
//    
//    @OneToMany(targetEntity = Symptom.class, cascade = { CascadeType.ALL }, mappedBy = "parentSymptom")  
//    @Fetch(FetchMode.SUBSELECT)  
//    @OrderBy("parentRelationship")  
//    public List<Symptom> getRelSymptoms() {  
//        return relSymptoms;  
//    }  
//    
//    public void setRelSymptoms(List<Symptom> symptoms) {  
//    	relSymptoms = symptoms;
//    }  
    
//    @ManyToOne
//    @JoinTable(name="APP_SYMPtOM_RELATION", joinColumns={ @JoinColumn(name="symptom_id", referencedColumnName="symptom_id")}, 
//    inverseJoinColumns={ @JoinColumn(name = "tid") })　
//    public Set<Symptom> getRelSymptoms() {
//		return relSymptoms;
//	}
//
//	public void setRelSymptoms(Set<Symptom> relSymptoms) {
//		this.relSymptoms = relSymptoms;
//	}
   }