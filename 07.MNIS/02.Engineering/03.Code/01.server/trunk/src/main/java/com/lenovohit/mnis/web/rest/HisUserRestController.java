  package com.lenovohit.mnis.web.rest;


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
import com.lenovohit.core.web.rest.BaseRestController;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.mnis.model.HisUser;

/**
 * 地址管理
 * 
 */
@RestController
@RequestMapping("/mnis/hisUser")
public class HisUserRestController extends BaseRestController {

	@Autowired
	private GenericManager<HisUser, String> hisUserManager;
	
	@RequestMapping(value = "/get/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result getInfo(@PathVariable("id") String id){
		HisUser model = this.hisUserManager.get(id);
		return ResultUtils.renderPageResult(model);
	}
	
	@RequestMapping(value = "/page/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forPage(@PathVariable("start") String start, @PathVariable("limit") String limit){
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery("from HisUser order by areaCode");
		
		this.hisUserManager.findPage(page);
		return ResultUtils.renderPageResult(page);
	}

	@RequestMapping(value = "/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@RequestParam(value = "data", defaultValue = "") String data) {
		HisUser query =  JSONUtils.deserialize(data, HisUser.class);
		StringBuilder jql = new StringBuilder( " from HisUser where 1=1 ");
		List<Object> values = new ArrayList<Object>();

		if(!StringUtils.isEmpty(query)) {
			if(!StringUtils.isEmpty(query.getName())){
				jql.append(" and name = ? ");
				values.add(query.getName());
			}
		}

		List<HisUser> hisUsers = this.hisUserManager.find(jql.toString(),values.toArray());
		return ResultUtils.renderSuccessResult(hisUsers);
	}
	
	@RequestMapping(value="/save",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8/*TEXT_PLAIN_UTF_8*/)
	public Result forCreate(@RequestBody String data){
		HisUser hisUser =  JSONUtils.deserialize(data, HisUser.class);
		HisUser saved = this.hisUserManager.save(hisUser);
		return ResultUtils.renderSuccessResult(saved);
	}
	@RequestMapping(value = "/remove/{id}",method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDeleteHisUser(@PathVariable("id") String id){
		try {
			this.hisUserManager.delete(id);
		} catch (Exception e) {
			throw new BaseException("删除失败");
		}
		return ResultUtils.renderSuccessResult();
	}
	
	@SuppressWarnings("rawtypes")
	@RequestMapping(value = "/removeAll",method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDeleteAll(@RequestBody String data){
		List ids =  JSONUtils.deserialize(data, List.class);
		StringBuilder idSql = new StringBuilder();
		List<String> idvalues = new ArrayList<String>();
		try {
			idSql.append("DELETE FROM MNIS_USER  WHERE ID IN (");
			for(int i = 0 ; i < ids.size() ; i++) {
				idSql.append("?");
				idvalues.add(ids.get(i).toString());
				if(i != ids.size() - 1) idSql.append(",");
			}
			idSql.append(")");
			this.hisUserManager.executeSql(idSql.toString(), idvalues.toArray());
		} catch (Exception e) {
			e.printStackTrace();
			throw new BaseException("删除失败");
		}
		return ResultUtils.renderSuccessResult();
	}
}
