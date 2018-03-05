package com.lenovohit.hcp.base.manager.impl;

import java.util.ArrayList;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.hcp.base.manager.ItemInfoManager;
import com.lenovohit.hcp.base.model.ItemInfo;
import com.lenovohit.hcp.base.model.ItemShortDetail;
@Transactional
@Service
public class ItemInfoManagerImpl implements ItemInfoManager {

	@Autowired
	private GenericManager<ItemShortDetail, String> itemShortDetailManager;
	
	/**    
	 * 功能描述：更新符合项目明细
	 *@param complexItem
	 *@param detailItem
	 *@return       
	 *@author GW
	 *@date 2017年7月12日             
	*/
	public String updateComplexItemInfo(ItemInfo complexItem, List<ItemShortDetail> detailItem) {
		String msg = null;
		msg = deleteDetail(complexItem);
		if(msg==null){//删除过程中没有出错在保存新的符合项目明细
			msg = saveComplexItemInfoDetail(complexItem, detailItem);
		}
		return msg;
	}

	/**    
	 * 功能描述：删除原有符合项目明细
	 *@param complexItem
	 *@return       
	 *@author GW
	 *@date 2017年7月12日             
	*/
	public String deleteDetail(ItemInfo complexItem) {
		String msg =null;
		if(complexItem!=null && complexItem.getId()!=null){
			StringBuilder idSql = new StringBuilder();
			List<String> idvalues = new ArrayList<String>();
			try {
				idSql.append("DELETE FROM ITEM_SHORT_DETAIL  WHERE SHORT_ID = ? ");
				idvalues.add(complexItem.getId());
				//删除次复合项目的明细
				itemShortDetailManager.executeSql(idSql.toString(), idvalues.toArray());
			}catch (Exception e) {
				e.printStackTrace();
				msg = "删除符合项目明细失败！！";
			}
		} else {
			msg = "未获取到符合项目信息";
		}
		return msg;
	}

	/**    
	 * 功能描述：保存新的复合项目
	 *@param complexItem
	 *@param detailItem
	 *@return       
	 *@author GW
	 *@date 2017年7月12日             
	*/
	public String saveComplexItemInfoDetail(ItemInfo complexItem, List<ItemShortDetail> detailItem) {
		String msg = null;
		if(complexItem!=null){
			if(detailItem!=null && detailItem.size()>0){
				for(ItemShortDetail detail:detailItem){
					if(detail.getItemCode()!=null){//项目id不能为空
						ItemInfo itemInfo = new ItemInfo();
						itemInfo.setId(detail.getItemCode());
						detail.setItemInfo(itemInfo);
						detail.setShortId(complexItem.getId());
					} else {
						msg = "收费明细数据传递错误，请联系管理员！";
						break;
					}
				}
			} else {
				msg = "符合项目明细获取失败！！！";
			}
		} else {
			msg = "符合项目信息获取失败！！！";
		}
		if(msg==null){//没有报错的情况下保存数据
			itemShortDetailManager.batchSave(detailItem);
		}else{
			throw new RuntimeException("收费明细数据传递错误，请联系管理员！");
		}
		return msg;
	}
	
}
