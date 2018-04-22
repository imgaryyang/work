  package com.lenovohit.ssm.base.web.rest;


import java.util.ArrayList;
import java.util.Date;
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
import com.lenovohit.ssm.base.model.Role;
import com.lenovohit.ssm.base.model.User;

/**
 * 管理端用户管理
 * 
 */
@RestController
@RequestMapping("/ssm/base/role")
public class RoleRestController extends SSMBaseRestController {

	@Autowired
	private GenericManager<Role, String> roleManager;
	
	@RequestMapping(value = "/get/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result getPage(@PathVariable("start") String start, @PathVariable("limit") String limit){
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery("from Role order by sort");
		roleManager.findPage(page);
		return ResultUtils.renderPageResult(page);
	}
	@RequestMapping(value = "/myPage/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result getMyPage(@PathVariable("start") String start, @PathVariable("limit") String limit,
			@RequestParam(value = "data", defaultValue = "")String data){
		
		User current = this.getCurrentUser();
		Role query =  JSONUtils.deserialize(data, Role.class);
		StringBuilder jql = new StringBuilder( " from Role where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		
		if(!StringUtils.isEmpty(query.getName())){
			jql.append(" and name like ? ");
			values.add("%"+query.getName()+"%");
		}
		if(!StringUtils.isEmpty(query.getCode())){
			jql.append(" and code like ? ");
			values.add("%"+query.getCode()+"%");
		}
		jql.append(" and hosId = ? ");
		values.add(current.getHosId());
		
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		roleManager.findPage(page);
		
		return ResultUtils.renderPageResult(page);
	}
	
	@RequestMapping(value = "/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@RequestParam(value = "data", defaultValue = "") String data) {
		Role query =  JSONUtils.deserialize(data, Role.class);
		StringBuilder jql = new StringBuilder( " from Role where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		
		if(!StringUtils.isEmpty(query.getName())){
			jql.append(" and name = ? ");
			values.add(query.getName());
		}
		if(!StringUtils.isEmpty(query.getCode())){
			jql.append(" and code = ? ");
			values.add(query.getCode());
		}
		if(!StringUtils.isEmpty(query.getType())){
			jql.append(" and type = ? ");
			values.add(query.getType());
		}
		// jql.append(" and hosId = ? ");
		List<Role> roles = roleManager.find(jql.toString(),values.toArray());
		return ResultUtils.renderSuccessResult(roles);
	}
	
	@RequestMapping(value = "/mylist", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forMyList() {
		User current = this.getCurrentUser();
		List<Role> roles = roleManager.find(" from Role role where hosId = ? ",current.getHosId());
		return ResultUtils.renderSuccessResult(roles);
	}
	@RequestMapping(value="/create",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8/*TEXT_PLAIN_UTF_8*/)
	public Result forCreateRole(@RequestBody String data){
		Role role =  JSONUtils.deserialize(data, Role.class);
		User user = this.getCurrentUser();
		Date now = new Date();
		role.setCreateTime(now);
		role.setUpdateTime(now);
		role.setCreator(user.getName());
		role.setUpdater(user.getName());
		role.setHosId(user.getHosId());
		Role saved = this.roleManager.save(role);
		return ResultUtils.renderSuccessResult(saved);
	}
	@RequestMapping(value="/update",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8/*TEXT_PLAIN_UTF_8*/)
	public Result forUpdateRole(@RequestBody String data){
		Role role =  JSONUtils.deserialize(data, Role.class);
		User user = this.getCurrentUser();
		Date now = new Date();
		role.setUpdateTime(now);
		role.setUpdater(user.getName());
		role.setHosId(user.getHosId());
		Role saved = this.roleManager.save(role);
		return ResultUtils.renderSuccessResult(saved);
	}
	@RequestMapping(value = "/remove/{id}",method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDeleteRole(@PathVariable("id") String id){
		try {
			//TODO 校验
			this.roleManager.delete(id);
		} catch (Exception e) {
			throw new BaseException("删除失败");
		}
		return ResultUtils.renderSuccessResult();
	}
	
	@RequestMapping(value = "/removeAll",method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDeleteAll(@RequestBody String data){
		System.out.println(data);
		@SuppressWarnings("rawtypes")
		List ids =  JSONUtils.deserialize(data, List.class);
		StringBuilder idSql = new StringBuilder();
		List<String> idvalues = new ArrayList<String>();
		try {
			idSql.append("DELETE FROM HCP_ROLE  WHERE ID IN (");
			for(int i = 0 ; i < ids.size() ; i++) {
				idSql.append("?");
				idvalues.add(ids.get(i).toString());
				if(i != ids.size() - 1) idSql.append(",");
			}
			idSql.append(")");
			System.out.println(idSql.toString());
			System.out.println(idvalues);
			this.roleManager.executeSql(idSql.toString(), idvalues.toArray());
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
