package com.lenovohit.elh.treat.vom;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.lenovohit.elh.treat.model.Cure;
import com.lenovohit.elh.treat.model.TreatDetail;

/**
 * 治疗项表
 * @author Administrator
 *
 */
public class CureVom extends TreatDetailVom{
	private  Cure  cure;
	private  TreatDetail treatDetail;
	@JsonIgnore
	public Cure getCure() {
		return cure;
	}
	public void setCure(Cure cure) {
		this.cure = cure;
	}
	public CureVom(Cure  Cure,TreatDetail treatDetail){
		this.cure = Cure;
		this.treatDetail = treatDetail;
	}
	public CureVom(){
		this.cure = new Cure();
		this.treatDetail = new TreatDetail();
	}
	public void setId(String id) {
		this.treatDetail.setId(id); //TODO 共享属性
		this.cure.setId(id);
	}
	
	public String getSubject() {
		return this.cure.getSubject();
	}
	
	public Double getPrice() {
		return this.cure.getPrice();
	}
	
	public void setSubject(String subject) {
		this.cure.setSubject(subject);
	}
	public void setPrice(Double price) {
		this.cure.setPrice(price);
	}
}


