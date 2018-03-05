package com.lenovohit.hcp.material.manager;

import java.util.List;

import com.lenovohit.hcp.base.model.HcpUser;

/**    
 *         
 * 类描述：    物资月结
 *@author GW
 *@date 2017年8月7日          
 *     
 */
public interface MonthCheckManager {

	/**    
	 * 功能描述：
	 *@param user
	 *@return       
	 *@author GW
	 *@date 2017年8月7日             
	*/
	String addMonthCheck(HcpUser user);
	
	/**    
	 * 功能描述：查询月结时间list
	 *@return       
	 *@author GW
	 *@date 2017年8月7日             
	*/
	List findMonthCheckTime();
}
