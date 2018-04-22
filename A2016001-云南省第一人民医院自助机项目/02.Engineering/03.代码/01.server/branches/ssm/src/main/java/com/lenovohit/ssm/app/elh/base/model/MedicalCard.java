package com.lenovohit.ssm.app.elh.base.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.lenovohit.core.model.BaseIdModel;
import com.lenovohit.ssm.treat.model.Patient;

/**
 * 诊疗卡
 * @author Administrator
 *
 */
@Entity
@Table(name="ELH_MED_CARDS")
public class MedicalCard extends BaseIdModel {
	private static final long serialVersionUID = 8901044382597646462L;
	
	private String idHlht;//院方数据ID
	private String personId  ;      //人员ID	
	private String patientId ;
	private String typeId    ;      //卡类型ID	
	private String typeName  ;      //卡类型名称	
	private String cardNo    ;      //卡号	
	private String cardholder ;     //持卡人姓名	
	private String idCardNo ;       //持卡人身份证号	
	private String orgId     ;      //发卡机构ID	
	private String orgName   ;      //发卡机构名称
	private String bindedAt  ;      //绑卡时间	
	private String unbindedAt;      //解绑时间	
	private String state      ;     //状态	
	private Patient patient;
	private Boolean RealName;		//有没有实名认证
	
	@Column(name = "id_hlht")
	public String getIdHlht() {
		return idHlht;
	}
	public void setIdHlht(String idHlht) {
		this.idHlht = idHlht;
	}
		
	@Column(name = "person_id")
	public String getPersonId() {
		return personId;
	}
	public void setPersonId(String personId) {
		this.personId = personId;
	}

	@Column(name = "patient_id")
	public String getPatientId() {
		return patientId;
	}
	public void setPatientId(String patientId) {
		this.patientId = patientId;
	}
	
	@Column(name = "type_id")
	public String getTypeId() {
		return typeId;
	}
	public void setTypeId(String typeId) {
		this.typeId = typeId;
	}
	
	@Column(name = "type_name")
	public String getTypeName() {
		return typeName;
	}
	public void setTypeName(String typeName) {
		this.typeName = typeName;
	}
	
	@Column(name = "card_no")
	public String getCardNo() {
		return cardNo;
	}
	public void setCardNo(String cardNo) {
		this.cardNo = cardNo;
	}
	
	@Column(name = "cardholder")
	public String getCardholder() {
		return cardholder;
	}
	public void setCardholder(String cardholder) {
		this.cardholder = cardholder;
	}
	
	@Column(name = "id_card_no")
	public String getIdCardNo() {
		return idCardNo;
	}
	public void setIdCardNo(String idCardNo) {
		this.idCardNo = idCardNo;
	}
	
	@Column(name = "org_id")
	public String getOrgId() {
		return orgId;
	}
	public void setOrgId(String orgId) {
		this.orgId = orgId;
	}
	
	@Column(name = "org_name")
	public String getOrgName() {
		return orgName;
	}
	public void setOrgName(String orgName) {
		this.orgName = orgName;
	}
	
	@Column(name = "binded_at")
	public String getBindedAt() {
		return bindedAt;
	}
	public void setBindedAt(String bindedAt) {
		this.bindedAt = bindedAt;
	}
	
	@Column(name = "unbinded_at")
	public String getUnbindedAt() {
		return unbindedAt;
	}
	public void setUnbindedAt(String unbindedAt) {
		this.unbindedAt = unbindedAt;
	}
	
	@Column(name = "state")
	public String getState() {
		return state;
	}
	public void setState(String state) {
		this.state = state;
	}
	
	
	@Transient
	public Patient getPatient() {
		return patient;
	}
	public void setPatient(Patient patient) {
		this.patient = patient;
	}
	
	@Transient
	public Boolean getRealName() {
		return RealName;
	}
	public void setRealName(Boolean realName) {
		RealName = realName;
	}
	
}
