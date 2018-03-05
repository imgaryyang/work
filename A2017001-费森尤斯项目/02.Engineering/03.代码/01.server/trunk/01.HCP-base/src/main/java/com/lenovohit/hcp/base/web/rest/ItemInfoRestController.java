package com.lenovohit.hcp.base.web.rest;


import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lenovohit.core.dao.Page;
import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hcp.base.manager.IRedisSequenceManager;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.base.model.ItemInfo;
import com.lenovohit.hcp.base.utils.PinyinUtil;
import com.lenovohit.hcp.base.utils.WubiUtil;

/**
 * 医院基本信息管理
 */
@RestController
@RequestMapping("/hcp/base/itemInfo")
public class ItemInfoRestController extends HcpBaseRestController {

	@Autowired
	private GenericManager<ItemInfo, String> itemInfoManager;
	@Autowired
	private IRedisSequenceManager redisSequenceManager;
//	@Autowired
//	private GenericManager<Dictionary, String> dictionaryManager;

//	@RequestMapping(value = "/type/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
//	public Result forTypeList(@RequestParam(value = "data", defaultValue = "") String data) {
//		List<Dictionary> models = dictionaryManager.find(" select dict.columnKey as columnKey, dict.columnVal as columnVal from Dictionary dict where dict.columnName = 'CLASS_CODE' ");
//		return ResultUtils.renderSuccessResult(models);
//	}
	
	@RequestMapping(value = "/page/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forPage(@PathVariable("start") String start, @PathVariable("limit") String limit,
			@RequestParam(value = "data", defaultValue = "") String data){
		ItemInfo query =  JSONUtils.deserialize(data, ItemInfo.class);
		StringBuilder jql = new StringBuilder( "from ItemInfo where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		HcpUser user = this.getCurrentUser();
		jql.append(" and hosId = ? ");
		values.add(user.getHosId());
		
		if(!StringUtils.isEmpty(query.getClassCode())){
			jql.append("and classCode = ? ");
			values.add(query.getClassCode());
		}
		if(StringUtils.isNotBlank(query.getIsgather())){
			jql.append("and isgather = ? ");
			values.add(query.getIsgather());
		}
		if(!StringUtils.isEmpty(query.getItemName())){
			jql.append("and (itemName like ? or spellCode like ? or wbCode like ?) ");
			values.add("%"+query.getItemName()+"%");
			values.add("%"+query.getItemName()+"%");
			values.add("%"+query.getItemName()+"%");
		}
		
		jql.append(" order by updateTime desc");
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		itemInfoManager.findPage(page);
		return ResultUtils.renderPageResult(page);
	}
	
	@RequestMapping(value = "/info/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forInfo(@PathVariable("id") String id){
		ItemInfo model= itemInfoManager.get(id);
		return ResultUtils.renderSuccessResult(model);
	}
	
	@RequestMapping(value = "/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@RequestParam(value = "data", defaultValue = "") String data) {
		List<ItemInfo> models = itemInfoManager.findAll();
		return ResultUtils.renderSuccessResult(models);
	}

	@RequestMapping(value="/create",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8/*TEXT_PLAIN_UTF_8*/)
	public Result forCreateMenu(@RequestBody String data){
		ItemInfo model =  JSONUtils.deserialize(data, ItemInfo.class);
		model.setItemCode(redisSequenceManager.get("ITEM_INFO", "ITEM_CODE"));
		model.setSpellCode(PinyinUtil.getFirstSpell(model.getItemName()));
		model.setWbCode(WubiUtil.getWBCode(model.getItemName()));
		//TODO 校验
		ItemInfo saved = this.itemInfoManager.save(model);
		return ResultUtils.renderSuccessResult(saved);
	}
	
	@RequestMapping(value = "/update", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdate(@RequestBody String data) {
		ItemInfo model =  JSONUtils.deserialize(data, ItemInfo.class);
		if(model==null || StringUtils.isBlank(model.getId())){
			return ResultUtils.renderFailureResult("不存在此对象");
		}
		model.setSpellCode(PinyinUtil.getFirstSpell(model.getItemName()));
		model.setWbCode(WubiUtil.getWBCode(model.getItemName()));
		this.itemInfoManager.save(model);
		return ResultUtils.renderSuccessResult();
	}
	
	@RequestMapping(value = "/remove/{id}",method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDeleteMenu(@PathVariable("id") String id){
		try {
			this.itemInfoManager.delete(id);
		} catch (Exception e) {
			throw new BaseException("删除失败");
		}
		return ResultUtils.renderSuccessResult();
	}
	
	@RequestMapping(value = "/removeAll",method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDeleteAll(@RequestBody String data){
		@SuppressWarnings("rawtypes")
		List ids =  JSONUtils.deserialize(data, List.class);
		StringBuilder idSql = new StringBuilder();
		List<String> idvalues = new ArrayList<String>();
		try {
			idSql.append("DELETE FROM ITEM_INFO  WHERE ID IN (");
			for(int i=0;i<ids.size();i++){
				idSql.append("?");
				idvalues.add(ids.get(i).toString());
				if(i != ids.size()-1)idSql.append(",");
			}
			idSql.append(")");
			System.out.println(idSql.toString());
			this.itemInfoManager.executeSql(idSql.toString(), idvalues.toArray());
		} catch (Exception e) {
			e.printStackTrace();
			throw new BaseException("删除失败");
		}
		return ResultUtils.renderSuccessResult();
	}
	
	public String ObjectIsNull(Object obj) {
		if (obj == null)
			return "";
		return obj.toString();
	}

}
