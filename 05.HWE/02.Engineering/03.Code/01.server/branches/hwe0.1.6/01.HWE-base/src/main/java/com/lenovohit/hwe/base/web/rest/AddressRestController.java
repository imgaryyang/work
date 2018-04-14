  package com.lenovohit.hwe.base.web.rest;


import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lenovohit.bdrp.authority.web.rest.AuthorityRestController;
import com.lenovohit.core.dao.Page;
import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hwe.base.model.Address;

/**
 * 地址管理
 * 
 */
@RestController
@RequestMapping("/hwe/base/address")
public class AddressRestController extends AuthorityRestController {

	@Autowired
	private GenericManager<Address, String> addressManager;
	
	@RequestMapping(value="/",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forCreate(@RequestBody String data){
		Address model =  JSONUtils.deserialize(data, Address.class);
		Address saved = this.addressManager.save(model);
		
		return ResultUtils.renderSuccessResult(saved);
	}

	@RequestMapping(value = "/{id}",method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdate(@PathVariable("id") String id, @RequestBody String data){
		Address model = JSONUtils.deserialize(data, Address.class);
		if(model == null || StringUtils.isBlank(model.getId())){
			return ResultUtils.renderFailureResult("不存在此对象");
		}
		Address saved = this.addressManager.save(model);
		
		return ResultUtils.renderSuccessResult(saved);
	}
	
	@RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forInfo(@PathVariable("id") String id){
		Address model = this.addressManager.get(id);
		
		return ResultUtils.renderPageResult(model);
	}
	
	@RequestMapping(value = "/page/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forPage(@PathVariable("start") String start, @PathVariable("limit") String limit, 
			@RequestParam(value = "data", defaultValue = "") String data){
		Address query =  JSONUtils.deserialize(data, Address.class);
		StringBuilder jql = new StringBuilder(" from Address where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		
		if(!StringUtils.isEmpty(query.getFkId())){
			jql.append(" and fkId = ? ");
			values.add(query.getFkId());
		}
		if(!StringUtils.isEmpty(query.getFkType())){
			jql.append(" and fkType = ? ");
			values.add(query.getFkType());
		}
		if(!StringUtils.isEmpty(query.getZipCode())){
			jql.append(" and zipCode = ? ");
			values.add(query.getZipCode());
		}
		if(!StringUtils.isEmpty(query.getAreaCode())){
			jql.append(" and areaCode = ? ");
			values.add(query.getAreaCode());
		}
		if(!StringUtils.isEmpty(query.getAreaName())){
			jql.append(" and areaName like ? ");
			values.add("%"+ query.getAreaCode() + "%");
		}
		jql.append("order by areaCode");
		
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		this.addressManager.findPage(page);
		
		return ResultUtils.renderPageResult(page);
	}
	
	@RequestMapping(value = "/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@RequestParam(value = "data", defaultValue = "") String data) {
		Address query =  JSONUtils.deserialize(data, Address.class);
		StringBuilder jql = new StringBuilder(" from Address where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		
		if(!StringUtils.isEmpty(query.getFkId())){
			jql.append(" and fkId = ? ");
			values.add(query.getFkId());
		}
		if(!StringUtils.isEmpty(query.getFkType())){
			jql.append(" and fkType = ? ");
			values.add(query.getFkType());
		}
		if(!StringUtils.isEmpty(query.getZipCode())){
			jql.append(" and zipCode = ? ");
			values.add(query.getZipCode());
		}
		if(!StringUtils.isEmpty(query.getAreaCode())){
			jql.append(" and areaCode = ? ");
			values.add(query.getAreaCode());
		}
		if(!StringUtils.isEmpty(query.getAreaName())){
			jql.append(" and areaName like ? ");
			values.add("%"+ query.getAreaCode() + "%");
		}
		jql.append("order by areaCode");
		List<Address> models = this.addressManager.find(jql.toString(), values.toArray());
		
		return ResultUtils.renderSuccessResult(models);
	}
	
	@RequestMapping(value = "/{id}",method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forRemove(@PathVariable("id") String id){
		try {
			this.addressManager.delete(id);
		} catch (Exception e) {
			throw new BaseException("删除失败");
		}
		return ResultUtils.renderSuccessResult();
	}
	
	@SuppressWarnings("rawtypes")
	@RequestMapping(value = "/removeAll",method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forRemoveAll(@RequestBody String data){
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
			this.addressManager.executeSql(idSql.toString(), idvalues.toArray());
		} catch (Exception e) {
			e.printStackTrace();
			throw new BaseException("删除失败");
		}
		return ResultUtils.renderSuccessResult();
	}
}
