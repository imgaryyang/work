package com.lenovohit.ssm.base.web.rest;

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
import com.lenovohit.core.manager.impl.GenericManagerImpl;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.ssm.base.model.Org;
@RestController
@RequestMapping("/ssm/base/org")
public class OrgRestController extends SSMBaseRestController {
	@Autowired
	private GenericManagerImpl<Org,String> orgManager;
	
	@RequestMapping(value = "/get/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result getPage(@PathVariable("start") String start, @PathVariable("limit") String limit){
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery("from Org order by sort");
		orgManager.findPage(page);
		return ResultUtils.renderPageResult(page);
	}
	@RequestMapping(value = "/page/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result getMyPage(@PathVariable("start") String start, @PathVariable("limit") String limit,
			@RequestParam(value = "data", defaultValue = "")String data){
		
		Org query =  JSONUtils.deserialize(data, Org.class);
		StringBuilder jql = new StringBuilder( " from Org where 1=1 ");
		List<Object> values = new ArrayList<Object>();
		
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
		orgManager.findPage(page);
		
		return ResultUtils.renderPageResult(page);
	}
	
	@RequestMapping(value = "/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@RequestParam(value = "data", defaultValue = "") String data) {
		List<Org> orgs = orgManager.find(" from Org org  order by code");
		return ResultUtils.renderSuccessResult(orgs);
	}
	
	@RequestMapping(value = "/mylist", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forMyList() {
		List<Org> orgs = orgManager.find(" from Org org ");
		return ResultUtils.renderSuccessResult(orgs);
	}
	@RequestMapping(value="/create",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8/*TEXT_PLAIN_UTF_8*/)
	public Result forCreateOrg(@RequestBody String data){
		Org org =  JSONUtils.deserialize(data, Org.class);
//		User user = this.getCurrentUser();
//		Date now = new Date();
//		/*org.setUpdateTime(now);
//		org.setUpdateUser(user.getName());
//		org.setRegTime(now);
//		org.setRegUser(user.getName());*/
		
		Org saved = this.orgManager.save(org);
		return ResultUtils.renderSuccessResult(saved);
	}
	@RequestMapping(value="/update",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8/*TEXT_PLAIN_UTF_8*/)
	public Result forUpdateOrg(@RequestBody String data){
		Org org =  JSONUtils.deserialize(data, Org.class);
//		User user = this.getCurrentUser();
//		Date now = new Date();
		/*org.setUpdateTime(now);
		org.setUpdateUser(user.getName());*/
		Org saved = this.orgManager.save(org);
		return ResultUtils.renderSuccessResult(saved);
	}
	@RequestMapping(value = "/remove/{id}",method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDeleteOrg(@PathVariable("id") String id){
		System.out.println(id);

		try {
			//TODO 校验
			if(!"".equals(id) && id!=null){
			Org org = this.orgManager.delete(id);
			return ResultUtils.renderSuccessResult(org);
		}
			this.orgManager.delete(id);
		} catch (Exception e) {
			throw new BaseException("删除失败");
		}
		return ResultUtils.renderFailureResult();
	}
	
	@RequestMapping(value = "/removeAll",method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDeleteAll(@RequestBody String data){
		System.out.println("Data:"+data);
		@SuppressWarnings("rawtypes")
		List ids =  JSONUtils.deserialize(data, List.class);
		StringBuilder idSql = new StringBuilder();
		List<String> idvalues = new ArrayList<String>();
		try {
			idSql.append("DELETE FROM SSM_ORG WHERE ID IN (");
			for(int i = 0 ; i < ids.size() ; i++) {
				idSql.append("?");
				idvalues.add(ids.get(i).toString());
				if(i != ids.size() - 1) idSql.append(",");
			}
			idSql.append(")");
			System.out.println("Sql"+idSql.toString());
			System.out.println("Idvalues"+idvalues);
			if(!"".equals(idvalues) && idvalues!=null){
			this.orgManager.executeSql(idSql.toString(), idvalues.toArray());
			return ResultUtils.renderSuccessResult(idvalues);
			}
		} 
		catch (Exception e) {
			e.printStackTrace();
			throw new BaseException("删除失败");
		}
		return ResultUtils.renderFailureResult();
	}
	
	public String ObjectIsNull(Object obj) {
		if (obj == null)
			return "";
		return obj.toString();
	}
}
