package com.lenovohit.hcp.base.manager;

import java.util.List;

import com.lenovohit.hcp.base.model.HcpUser;

/**    
 *         
 * 类描述：   消息提醒 
 *@author GW
 *@date 2017年7月11日          
 *     
 */
public interface MessageNotificationManager {
	
	/**    
	 * 功能描述：查询消息记录
	 *@param modelName 模块名称
	 *@return       
	 *@author GW
	 *@date 2017年7月6日             
	*/
	public List<?> find(String modelName,HcpUser user);
	
}
