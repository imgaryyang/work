package com.infohold.elh.treat.vom;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.infohold.elh.treat.model.DrugDetail;
import com.infohold.elh.treat.model.DrugOrder;
import com.infohold.elh.treat.model.TreatDetail;

/**
 * 取药表
 * @author Administrator
 *
 */
public class DrugOrderVom extends TreatDetailVom{
	private  DrugOrder  drugOrder;
	@JsonIgnore
	public DrugOrder getDrugOrder() {
		return drugOrder;
	}
	public void setDrugOrder(DrugOrder drugOrder) {
		this.drugOrder = drugOrder;
	}
	@JsonIgnore
	public TreatDetail getTreatDetail() {
		return treatDetail;
	}
	public void setTreatDetail(TreatDetail treatDetail) {
		this.treatDetail = treatDetail;
	}
	public DrugOrderVom(DrugOrder  drugOrder,TreatDetail treatDetail){
		this.drugOrder = drugOrder;
		this.treatDetail = treatDetail;
	}
	public DrugOrderVom(){
		this.drugOrder = new DrugOrder();
		this.treatDetail = new TreatDetail();
	}
	public void setId(String id) {
		this.treatDetail.setId(id); //TODO 共享属性
		this.drugOrder.setId(id);
	}
	
	public void setAmount(Double amount) {
		this.drugOrder.setAmount(amount);
	}
	public void setDetails(List<DrugDetail> details) {
		this.drugOrder.setDetails(details);
	}
	
	public String getId() {
		return this.drugOrder.getId();
	}
	
	public Double getAmount() {
		return this.drugOrder.getAmount();
	}
	public List<DrugDetail> getDetails() {
		return this.drugOrder.getDetails();
	}
	
	
}
