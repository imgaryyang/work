package com.lenovohit.hcp.base.manager;

import java.util.List;

import com.lenovohit.hcp.base.model.ItemInfo;
import com.lenovohit.hcp.base.model.ItemShortDetail;

/**    
 *         
 * 类描述：   项目信息（暂时只有符合项目信息维护）
 *@author GW
 *@date 2017年7月11日          
 *     
 */
public interface ItemInfoManager {
	
	/**    
	 * 功能描述：更新符合项目明细
	 *@param complexItem
	 *@param detailItem
	 *@return       
	 *@author GW
	 *@date 2017年7月12日             
	*/
	public String updateComplexItemInfo(ItemInfo complexItem, List<ItemShortDetail> detailItem);
	
	/**    
	 * 功能描述：删除原有符合项目明细
	 *@param complexItem
	 *@return       
	 *@author GW
	 *@date 2017年7月12日             
	*/
	public String deleteDetail(ItemInfo complexItem);
	
	/**    
	 * 功能描述：保存新的复合项目
	 *@param complexItem
	 *@param detailItem
	 *@return       
	 *@author GW
	 *@date 2017年7月12日             
	*/
	public String saveComplexItemInfoDetail(ItemInfo complexItem,List<ItemShortDetail> detailItem);
	
}
