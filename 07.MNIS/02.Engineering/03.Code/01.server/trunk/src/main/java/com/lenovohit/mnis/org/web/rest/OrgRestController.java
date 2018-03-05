  package com.lenovohit.mnis.org.web.rest;


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
import com.lenovohit.mnis.org.model.Org;

/**
 * 机构管理
 * 
 */
@RestController
@RequestMapping("/mnis/org/org")
public class OrgRestController extends OrgBaseRestController {

	@Autowired
	private GenericManager<Org, String> orgManager;
	
	@RequestMapping(value = "/get/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result getInfo(@PathVariable("id") String id){
		Org model = this.orgManager.get(id);
		return ResultUtils.renderPageResult(model);
	}
	
	@RequestMapping(value = "/page/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forPage(@PathVariable("start") String start, @PathVariable("limit") String limit){
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery("from Org order by code");
		
		this.orgManager.findPage(page);
		return ResultUtils.renderPageResult(page);
	}
	@RequestMapping(value = "/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@RequestParam(value = "data", defaultValue = "") String data) {
		Org query =  JSONUtils.deserialize(data, Org.class);
		StringBuilder jql = new StringBuilder( " from Org where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		
		if(!StringUtils.isEmpty(query.getCustCode())){
			jql.append(" and custCode = ? ");
			values.add(query.getCustCode());
		}
		if(!StringUtils.isEmpty(query.getBrcCode())){
			jql.append(" and brcCode = ? ");
			values.add(query.getBrcCode());
		}
		if(!StringUtils.isEmpty(query.getIdNo())){
			jql.append(" and idNo = ? ");
			values.add(query.getIdNo());
		}
		if(!StringUtils.isEmpty(query.getType())){
			jql.append(" and type = ? ");
			values.add(query.getType());
		}
		if(!StringUtils.isEmpty(query.getParent())){
			jql.append(" and parent = ? ");
			values.add(query.getParent());
		}
		if(!StringUtils.isEmpty(query.getOrgNo())){
			jql.append(" and orgNo = ? ");
			values.add(query.getOrgNo());
		}
		if(!StringUtils.isEmpty(query.getStatus())){
			jql.append(" and status = ? ");
			values.add(query.getStatus());
		}
		if(!StringUtils.isEmpty(query.getName())){
			jql.append(" and name like ? ");
			values.add("'%"+ query.getName() + "%'");
		}
		jql.append("order by custCode");
		
		List<Org> orgs = this.orgManager.find(jql.toString(),values.toArray());
		return ResultUtils.renderSuccessResult(orgs);
	}
	
	@RequestMapping(value="/save",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8/*TEXT_PLAIN_UTF_8*/)
	public Result forCreate(@RequestBody String data){
		Org org =  JSONUtils.deserialize(data, Org.class);
		Org saved = this.orgManager.save(org);
		return ResultUtils.renderSuccessResult(saved);
	}
	@RequestMapping(value = "/remove/{id}",method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDeleteOrg(@PathVariable("id") String id){
		try {
			this.orgManager.delete(id);
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
			idSql.append("DELETE FROM BASE_ADDRESS  WHERE ID IN (");
			for(int i = 0 ; i < ids.size() ; i++) {
				idSql.append("?");
				idvalues.add(ids.get(i).toString());
				if(i != ids.size() - 1) idSql.append(",");
			}
			idSql.append(")");
			this.orgManager.executeSql(idSql.toString(), idvalues.toArray());
		} catch (Exception e) {
			e.printStackTrace();
			throw new BaseException("删除失败");
		}
		return ResultUtils.renderSuccessResult();
	}
}
