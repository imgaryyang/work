package com.lenovohit.hcp.base.web.rest;


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
import com.lenovohit.hcp.base.model.HcpRole;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.base.model.HcpUserRoleRela;

/**
 * 管理端用户管理
 * 
 */
@RestController
@RequestMapping("/hcp/base/role")
public class RoleRestController extends HcpBaseRestController {

	@Autowired
	private GenericManager<HcpRole, String> hcpRoleManager;
	
	@RequestMapping(value = "/get/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result getPage(@PathVariable("start") String start, @PathVariable("limit") String limit){
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery("from HcpRole order by sort");
		hcpRoleManager.findPage(page);
		return ResultUtils.renderPageResult(page);
	}
	@RequestMapping(value = "/myPage/{chanel}/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result getMyPage(@PathVariable("chanel") String chanel, @PathVariable("start") String start, @PathVariable("limit") String limit,
			@RequestParam(value = "data", defaultValue = "")String data){
		
		HcpUser current = this.getCurrentUser();
		HcpRole query =  JSONUtils.deserialize(data, HcpRole.class);
		StringBuilder jql = new StringBuilder( " from HcpRole where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		
		if("group".equals(chanel)){
			jql.append(" and  hosId = 'H0027' ");
		}else{
			jql.append(" and ( hosId = ? or hosId = 'H0027' ) and ( isGroup <> '1' or isGroup is null )");
			values.add(current.getHosId());
		}
		
		if(!StringUtils.isEmpty(query.getName())){
			jql.append(" and name like ? ");
			values.add("%"+query.getName()+"%");
		}
		if(!StringUtils.isEmpty(query.getCode())){
			jql.append(" and code like ? ");
			values.add("%"+query.getCode()+"%");
		}

		
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery(jql.toString());
		page.setValues(values.toArray());
		hcpRoleManager.findPage(page);
		
		return ResultUtils.renderPageResult(page);
	}
	
	@RequestMapping(value = "/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@RequestParam(value = "data", defaultValue = "") String data) {
		List<HcpRole> roles = hcpRoleManager.find(" from HcpRole role  ");
		return ResultUtils.renderSuccessResult(roles);
	}
	
	@RequestMapping(value = "/mylist/{chanel}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forMyList(@PathVariable("chanel") String chanel) {
		HcpUser current = this.getCurrentUser();
		StringBuilder jql = new StringBuilder( " from HcpRole where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		if("operate".equals(chanel)){
			jql.append(" and  hosId = 'H0027' ");
		}else{
			jql.append(" and ( hosId = ? or hosId = 'H0027' ) and ( isGroup <> '1' or isGroup is null )");
			values.add(current.getHosId());
		}
		List<HcpRole> roles = hcpRoleManager.find(jql.toString(),values.toArray());
		return ResultUtils.renderSuccessResult(roles);
	}
	@RequestMapping(value="/create",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8/*TEXT_PLAIN_UTF_8*/)
	public Result forCreateHcpRole(@RequestBody String data){
		HcpRole role =  JSONUtils.deserialize(data, HcpRole.class);
		HcpUser user = this.getCurrentUser();
		Date now = new Date();
		role.setCreateTime(now);
		role.setUpdateTime(now);
		role.setCreator(user.getName());
		role.setUpdater(user.getName());
		role.setHosId(user.getHosId());
		HcpRole saved = this.hcpRoleManager.save(role);
		return ResultUtils.renderSuccessResult(saved);
	}
	@RequestMapping(value="/update",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8/*TEXT_PLAIN_UTF_8*/)
	public Result forUpdateHcpRole(@RequestBody String data){
		HcpRole role =  JSONUtils.deserialize(data, HcpRole.class);
		HcpUser user = this.getCurrentUser();
		Date now = new Date();
		role.setUpdateTime(now);
		role.setUpdater(user.getName());
		role.setHosId(user.getHosId());
		HcpRole saved = this.hcpRoleManager.save(role);
		return ResultUtils.renderSuccessResult(saved);
	}
	@RequestMapping(value = "/remove/{id}",method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDeleteHcpRole(@PathVariable("id") String id){
		try {
			//TODO 校验
			this.hcpRoleManager.delete(id);
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
			this.hcpRoleManager.executeSql(idSql.toString(), idvalues.toArray());
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
