package com.lenovohit.ssm.app.elh.treat.model;

import javax.persistence.Entity;
import javax.persistence.Table;

import com.lenovohit.core.model.BaseIdModel;

/**
 * 取药明细表
 * @author Administrator
 *
 */
@Entity
@Table(name="ELH_DRUG_DETAIL")
public class DrugDetail extends BaseIdModel {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 5673089251840126336L;
	
	
	private String idHlht;//医院数据唯一标志
	private String name;//药品名称
	private double price;//单价
	private int num;//数量
	private double amount;//总价
	private String type;//药品类别
	private String prescribed;//是否处方
	private String drugOrder;//取药单号
	private String spec;//规格
	private String dosage;//剂量
	private String expira_date;//有效期
	private String unit;//单位
	public String getUnit() {
		return unit;
	}
	public void setUnit(String unit) {
		this.unit = unit;
	}
	public String getIdHlht() {
		return idHlht;
	}
	public void setIdHlht(String idHlht) {
		this.idHlht = idHlht;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public double getPrice() {
		return price;
	}
	public void setPrice(double price) {
		this.price = price;
	}
	public int getNum() {
		return num;
	}
	public void setNum(int num) {
		this.num = num;
	}
	public double getAmount() {
		return amount;
	}
	public void setAmount(double amount) {
		this.amount = amount;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getPrescribed() {
		return prescribed;
	}
	public void setPrescribed(String prescribed) {
		this.prescribed = prescribed;
	}
	public String getDrugOrder() {
		return drugOrder;
	}
	public void setDrugOrder(String drugOrder) {
		this.drugOrder = drugOrder;
	}
	public String getSpec() {
		return spec;
	}
	public void setSpec(String spec) {
		this.spec = spec;
	}
	public String getDosage() {
		return dosage;
	}
	public void setDosage(String dosage) {
		this.dosage = dosage;
	}
	public String getExpira_date() {
		return expira_date;
	}
	public void setExpira_date(String expira_date) {
		this.expira_date = expira_date;
	}
}
