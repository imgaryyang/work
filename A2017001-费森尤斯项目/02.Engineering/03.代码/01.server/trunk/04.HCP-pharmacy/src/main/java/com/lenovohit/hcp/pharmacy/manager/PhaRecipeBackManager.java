/**
 * 
 */
package com.lenovohit.hcp.pharmacy.manager;

import java.util.List;

import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.odws.model.MedicalOrder;

/**
 * @author duanyanshan
 * @date 2017年11月9日 下午5:44:09
 */
public interface PhaRecipeBackManager {
	
	//确认退药
	public String phaRecipe(String regId, HcpUser user);
	
	//退药驳回
	public String phaRecipeBack(String regId, HcpUser user);
	
	
}
