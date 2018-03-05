package com.lenovohit.hcp.base.model;

import java.math.BigDecimal;

/**
 * 收费套餐明细
 */
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;

@Entity
@Table(name = "ITEM_SHORT_DETAIL")
public class ItemShortDetail extends HcpBaseModel{
	/**    
	 * 描述：    
	 *@author GW
	 *@date 2017年7月13日   
	 */    
	
	private static final long serialVersionUID = 10086L;
	
	private String shortId;// 符合项目ID,
	
	private String itemCode;// 项目编码（对应项目id）
	
	private ItemInfo itemInfo;
	
	private BigDecimal defaultNum;// 默认数量,
	
	private String comm;// 备注
	
	private boolean stopFlag;// 停用标志|1停0-启,

	public String getShortId() {
		return shortId;
	}

	public void setShortId(String shortId) {
		this.shortId = shortId;
	}

	@Transient
	public String getItemCode() {
		return itemCode;
	}

	public void setItemCode(String itemCode) {
		this.itemCode = itemCode;
	}

	@ManyToOne
	@JoinColumn(name = "ITEM_CODE", nullable = true)
	@NotFound(action=NotFoundAction.IGNORE)
	public ItemInfo getItemInfo() {
		return itemInfo;
	}

	public void setItemInfo(ItemInfo itemInfo) {
		this.itemInfo = itemInfo;
	}

	public BigDecimal getDefaultNum() {
		return defaultNum;
	}

	public void setDefaultNum(BigDecimal defaultNum) {
		this.defaultNum = defaultNum;
	}

	public String getComm() {
		return comm;
	}

	public void setComm(String comm) {
		this.comm = comm;
	}

	public boolean isStopFlag() {
		return stopFlag;
	}

	public void setStopFlag(boolean stopFlag) {
		this.stopFlag = stopFlag;
	}
	
}
