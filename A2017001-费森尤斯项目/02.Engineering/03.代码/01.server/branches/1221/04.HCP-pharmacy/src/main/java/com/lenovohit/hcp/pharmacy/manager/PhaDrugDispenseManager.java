package com.lenovohit.hcp.pharmacy.manager;

import com.lenovohit.hcp.base.model.HcpUser;

public interface PhaDrugDispenseManager {
	
	/**
	 * 记录发药信息
	 * @param recipeId - 处方
	 * @param hcpUser - 当前登录用户
	 */
	void dispense(String recipeId, HcpUser user);

}
