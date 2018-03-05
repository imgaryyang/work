package com.lenovohit.hcp.pharmacy.manager;

import java.io.OutputStream;
import java.util.List;

import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.pharmacy.model.PhaDrugInfo;
import com.lenovohit.hcp.pharmacy.model.PhaDrugPrice;
import com.lenovohit.hcp.pharmacy.model.PhaDrugPriceView;

public interface PhaDrugInfoManager {
	
	/**
	 * 集团保存药品基本信息
	 * @param price
	 * @param phaDrugInfo
	 * @param hcpUser
	 * @param chanel 
	 * @return
	 */
	 
	public PhaDrugInfo createDrugPriceGroup(PhaDrugPrice price,PhaDrugInfo phaDrugInfo, HcpUser hcpUser);
	
	/**
	 * 子医院保存药品基本信息
	 * @param price
	 * @param phaDrugInfo
	 * @param hcpUser
	 * @return
	 */
	public PhaDrugInfo createDrugPrice(PhaDrugPrice price,PhaDrugInfo phaDrugInfo, HcpUser hcpUser);
	
	/**
	 * 导出药品基本信息到Excel中
	 * @param infoList
	 * @param out
	 * @return
	 */
	public void exportInfoToExcel(List<PhaDrugPriceView> infoList, OutputStream out);

}
