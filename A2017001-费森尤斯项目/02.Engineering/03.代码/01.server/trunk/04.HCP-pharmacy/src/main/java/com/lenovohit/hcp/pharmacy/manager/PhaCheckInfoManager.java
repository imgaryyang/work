package com.lenovohit.hcp.pharmacy.manager;

import java.util.List;

import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.pharmacy.model.PhaCheckInfo;

/**    
 *         
 * 类描述：  盘点结存更新库存表和库存汇总表  
 *@author GW
 *@date 2017年5月28日          
 *     
 */
public interface PhaCheckInfoManager {
	/**    
	 * 功能描述：
	 *@param matBuyBill
	 *@param hcpUser       
	 *@author GW
	 *@date 2017年5月28日             
	*/
	void updateStockInfo(List<PhaCheckInfo> checkList, HcpUser hcpUser);
}
