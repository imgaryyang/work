package com.lenovohit.ssm.treat.model;

/**
 * 处方药品明细
 * @author fanyang
 *
 */
public class PrescriptionItem {
	private String drugName;		//药品名称
	private String specifications;	//剂型规格
	private String usageAndDosage;	//用法用量
	private String number;			//数量
	
	public String getDrugName() {
		return drugName;
	}
	public void setDrugName(String drugName) {
		this.drugName = drugName;
	}
	public String getSpecifications() {
		return specifications;
	}
	public void setSpecifications(String specifications) {
		this.specifications = specifications;
	}
	public String getUsageAndDosage() {
		return usageAndDosage;
	}
	public void setUsageAndDosage(String usageAndDosage) {
		this.usageAndDosage = usageAndDosage;
	}
	public String getNumber() {
		return number;
	}
	public void setNumber(String number) {
		this.number = number;
	}
}
