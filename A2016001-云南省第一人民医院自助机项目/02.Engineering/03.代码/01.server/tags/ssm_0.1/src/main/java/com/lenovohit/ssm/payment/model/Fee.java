package com.lenovohit.ssm.payment.model;

import java.math.BigDecimal;

import javax.persistence.Entity;
import javax.persistence.Table;

import com.lenovohit.core.model.BaseIdModel;

/**
 * 缴费明细
 * @author xiaweiyi
 *
 */
@Entity
@Table(name="SSM_FEE")
public class Fee extends BaseIdModel{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1098286956401539056L;
	private BigDecimal amt;
	private String hospitalFeeId;
	

	public String getHospitalFeeId() {
		return hospitalFeeId;
	}

	public void setHospitalFeeId(String hospitalFeeId) {
		this.hospitalFeeId = hospitalFeeId;
	}

	public BigDecimal getAmt() {
		return amt;
	}

	public void setAmt(BigDecimal amt) {
		this.amt = amt;
	}
}
