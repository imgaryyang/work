package com.lenovohit.hcp.material.manager;

import java.util.List;

import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.material.model.MatCheckInfo;

/**    
 *         
 * 类描述：  盘点结存更新库存表和库存汇总表  
 *@author GW
 *@date 2017年5月28日          
 *     
 */
public interface MatCheckinfoManager {
	/**    
	 * 功能描述：
	 *@param matBuyBill
	 *@param hcpUser       
	 *@author GW
	 *@date 2017年5月28日             
	*/
	void updateStockInfo(List<MatCheckInfo> checkList, HcpUser hcpUser);
}
