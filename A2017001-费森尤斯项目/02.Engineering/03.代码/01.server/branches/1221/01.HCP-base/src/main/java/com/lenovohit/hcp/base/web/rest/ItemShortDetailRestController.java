package com.lenovohit.hcp.base.web.rest;


import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.TypeReference;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hcp.base.manager.ItemInfoManager;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.base.model.ItemInfo;
import com.lenovohit.hcp.base.model.ItemShortDetail;

/**
 * 符合项目信息维护
 */
@RestController
@RequestMapping("/hcp/base/complexItemInfo")
public class ItemShortDetailRestController extends HcpBaseRestController {

	@Autowired
	private GenericManager<ItemInfo, String> itemInfoManager;
	@Autowired
	private GenericManager<ItemShortDetail, String> itemShortDetailManager;
	@Autowired
	private ItemInfoManager itemMngImpl;

	/**    
	 * 功能描述：查询符合项目列表
	 *@param data
	 *@return       
	 *@author GW
	 *@date 2017年7月11日             
	*/
	@RequestMapping(value = "/loadComplexItem", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forComplexItem(@RequestParam(value = "data", defaultValue = "") String data){
		ItemInfo query =  JSONUtils.deserialize(data, ItemInfo.class);
		StringBuilder jql = new StringBuilder( "from ItemInfo where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		HcpUser user = this.getCurrentUser();
		jql.append(" and hosId = ? ");
		values.add(user.getHosId());
		
		if(!StringUtils.isEmpty(query.getItemName())){
			jql.append("and (itemName like ? or spellCode like ? or wbCode like ?) ");
			values.add("%"+query.getItemName()+"%");
			values.add("%"+query.getItemName()+"%");
			values.add("%"+query.getItemName()+"%");
		}
		jql.append("and isgather = ? ");
		values.add(true);

		jql.append("order by updateTime desc");
		List<ItemInfo> itemList = (List<ItemInfo>) itemInfoManager.findPageList(0, 20,jql.toString(),values.toArray());
		return ResultUtils.renderPageResult(itemList);
	}
	/**    
	 * 功能描述：根据符合项目查询符合项目明细列表
	 *@param data
	 *@return       
	 *@author GW
	 *@date 2017年7月11日             
	 */
	@RequestMapping(value = "/complexItemDetail", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forComplexItemDetail(@RequestParam(value = "data", defaultValue = "") String data){
		ItemInfo query =  JSONUtils.deserialize(data, ItemInfo.class);
		StringBuilder jql = new StringBuilder( "from ItemShortDetail where 1=1 and shortId = ? and hosId = ? ");
		if(StringUtils.isNotBlank(query.getId())){
			List<ItemShortDetail> itemList = (List<ItemShortDetail>) itemShortDetailManager.findByJql(jql.toString(),query.getId(),this.getCurrentUser().getHosId());
			return ResultUtils.renderPageResult(itemList);
		} else {
			return ResultUtils.renderFailureResult("无法获取符合项目信息");
		}
	}
	
	/**    
	 * 功能描述：保存符合项目明细
	 *@param data
	 *@return       
	 *@author GW
	 *@date 2017年7月11日             
	*/
	@RequestMapping(value = "/updateComplexItem", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdateComplexItem(@RequestBody String data) {
		
		JSONObject jsonObj = JSONObject.parseObject(data);
		String complexItemStr = jsonObj.getString("complexItem");
		String itemListStr = jsonObj.getString("detailListItem");
		ItemInfo complexItem =  JSONUtils.deserialize(complexItemStr, ItemInfo.class);	//符合项目
		List<ItemShortDetail> detailList = JSONUtils.parseObject(itemListStr, new TypeReference<List<ItemShortDetail>>() {});//符合项目明细
		
		if(complexItem!=null){
			if(detailList!=null && detailList.size()>0){
				for(ItemShortDetail detail:detailList){
					detail.setShortId(complexItem.getId());
				}
				//1、删除此项目对应的明细  2、加入新的明细
				String msg = itemMngImpl.updateComplexItemInfo(complexItem, detailList);
				if(msg==null){//没有出错信息
					return ResultUtils.renderSuccessResult();
				}else{
					return ResultUtils.renderFailureResult(msg);
				}
			} else {
				return ResultUtils.renderFailureResult("符合项目明细获取失败！！！");
			}
		} else {
			return ResultUtils.renderFailureResult("符合项目信息获取失败！！！");
		}
	}

}
