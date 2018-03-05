package com.lenovohit.hcp.appointment.model;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.lenovohit.hcp.base.model.HcpBaseModel;
import com.lenovohit.hcp.base.model.ItemInfo;

@Entity
@Table(name = "OC_REGFEE") // 门诊挂号 - 附加费维护
public class RegFree extends HcpBaseModel{

    /**    
	 * 描述：    
	 *@author GW
	 *@date 2017年3月28日   
	 */    
	
	private static final long serialVersionUID = -6146529075496406977L;

	private String regLevel;		//挂号级别

    private String levelName;		//别号名称

    private String stopFlag;		//停用标志（0：停用  1：启用）
    
    private ItemInfo itemInfo;

    public String getRegLevel() {
        return regLevel;
    }

    public void setRegLevel(String regLevel) {
        this.regLevel = regLevel == null ? null : regLevel.trim();
    }

    public String getLevelName() {
        return levelName;
    }

    public void setLevelName(String levelName) {
        this.levelName = levelName == null ? null : levelName.trim();
    }

    public String getStopFlag() {
        return stopFlag;
    }

    public void setStopFlag(String stopFlag) {
        this.stopFlag = stopFlag == null ? null : stopFlag.trim();
    }

    @JoinColumn(name = "ITEM_ID")
	@ManyToOne
	public ItemInfo getItemInfo() {
		return itemInfo;
	}

	public void setItemInfo(ItemInfo itemInfo) {
		this.itemInfo = itemInfo;
	}

}