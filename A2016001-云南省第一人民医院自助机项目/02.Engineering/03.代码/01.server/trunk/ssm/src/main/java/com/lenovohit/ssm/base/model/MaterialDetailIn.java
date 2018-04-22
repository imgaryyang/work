package com.lenovohit.ssm.base.model;


import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.lenovohit.core.model.BaseIdModel;

/**
 * 材料入库明细表
 * @author wang
 *
 */

@Entity
@Table(name="SSM_MATERIAL_DETAIL_IN")
public class MaterialDetailIn extends BaseIdModel {
	private static final long serialVersionUID = -138639418568502305L;
	
	private int inPutAccount;//入库数量
	private String inPutTime;//入库时间
	private String operator;//操作人
	private Material material;//材料编号
	
	public int getInPutAccount() {
		return inPutAccount;
	}
	public void setInPutAccount(int inPutAccount) {
		this.inPutAccount = inPutAccount;
	}
	
	public String getInPutTime() {
		return inPutTime;
	}
	public void setInPutTime(String inPutTime) {
		this.inPutTime = inPutTime;
	}
	public String getOperator() {
		return operator;
	}
	public void setOperator(String operator) {
		this.operator = operator;
	}
	@JoinColumn(name = "MATERIAL_ID")
	@ManyToOne
	public Material getMaterial() {
		return material;
	}
	public void setMaterial(Material material) {
		this.material = material;
	}

}
