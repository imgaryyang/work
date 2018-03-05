/**
 * 
 */
package com.lenovohit.hcp.pharmacy.model;

import java.math.BigDecimal;

import javax.persistence.Entity;
import javax.persistence.Table;

import com.lenovohit.hcp.base.model.HcpBaseModel;

/**
 * @author duanyanshan
 * @date 2017年9月21日 下午5:48:33
 */
@Entity
@Table(name = "PHA_ACTUAL_BUY") // 实际采购剩余信息表
public class PhaActualBuy extends HcpBaseModel{

	private static final long serialVersionUID = 4695224781661510820L;
	private String billId;
	private String detailId;
    private BigDecimal buyNum;
	public String getBillId() {
		return billId;
	}
	public void setBillId(String billId) {
		this.billId = billId;
	}
	public BigDecimal getBuyNum() {
		return buyNum;
	}
	public void setBuyNum(BigDecimal buyNum) {
		this.buyNum = buyNum;
	}
	public String getDetailId() {
		return detailId;
	}
	public void setDetailId(String detailId) {
		this.detailId = detailId;
	}
    
    
}
