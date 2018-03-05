package com.infohold.bdrp.org.web.rest;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.infohold.bdrp.org.model.Role;
import com.infohold.core.dao.Page;
import com.infohold.core.exception.BaseException;
import com.infohold.core.manager.GenericManager;
import com.infohold.core.utils.StringUtils;
import com.infohold.core.web.MediaTypes;
import com.infohold.core.web.rest.BaseRestController;
import com.infohold.core.web.utils.Result;
import com.infohold.core.web.utils.ResultUtils;

@RestController
@RequestMapping("/bdrp/org/pubrole")
public class PubRoleRestController extends BaseRestController {
	
	@Autowired
	GenericManager<Role, String> roleManager;
	
	@RequestMapping(value = "/main")
	public ModelAndView forMain() {
		ModelAndView mv = new ModelAndView("bdrp/org/pubrole/main");
		mv.addObject("pageBean", forPage());
		return mv;
	}
	
	@RequestMapping(value = "/page" , method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Page forPage() {
		
		Page page;
		try {
			String start = this.getRequest().getParameter("start");
			String pageSize = this.getRequest().getParameter("pageSize");
			String memo = getRequest().getParameter("memo");
			String name = getRequest().getParameter("name");	
			
			String query = "from Role where 1=1 ";
			List<Object> values= new ArrayList<Object>();
			query += "and orgId is null ";
			if (!StringUtils.isEmpty(name)) {
				query += "and name like ? ";
				values.add("%" + name + "%");
			}
			if (!StringUtils.isEmpty(memo)) {
				query += "and descp like ? ";
				values.add("%" + memo + "%");
			}
			if(StringUtils.isEmpty(pageSize)){
				pageSize = "10";
			}
			if(StringUtils.isEmpty(start)){
				start = "0";
			}
			query +="order by id desc";
			
			page = new Page();
			page.setStart(start);
			page.setPageSize(pageSize);
			page.setQuery(query);
			page.setValues(values.toArray());
			
			this.roleManager.findPage(page);
		} catch (Exception e) {
			e.printStackTrace();
			throw new BaseException(e.getMessage());
		}
		return page;
	}
	
	
	/**
	 * 返回信息至浏览页面
	 * 
	 * @return
	 */
	@RequestMapping(value="/{id}",method=RequestMethod.GET,produces = MediaTypes.JSON_UTF_8)
	public Result forView(@PathVariable String id) {
		Role role = this.roleManager.get(id);
		return ResultUtils.renderSuccessResult(role);
	}

	/**
	 * 保存对象基本信息
	 * 
	 * @return
	 */
	@RequestMapping(value="/create",method=RequestMethod.POST,produces = MediaTypes.JSON_UTF_8)
	public Result forCreate(@ModelAttribute Role model ) {
		
		model.setOrg(null);
		model.setOrgId(null);
		
		String validHql = "from Role where name = ? and id != ? and orgId is null ";
		List<Role> lst = this.roleManager.find(validHql,
				model.getName(), model.getId());
		if (lst.size() > 0) {
			throw new BaseException("该名称已存在,请重新填写!");
		}
	
		model = this.roleManager.save(model);
		/*String validHql = "from Role where name = ? and id != ? ";
		List<Role> lst = this.roleManager.find(validHql,
				model.getName(), model.getId());
		if (lst.size() > 0) {
			throw new BaseException("该名称已存在,请重新填写!");
		}*/
		return ResultUtils.renderSuccessResult(model);
	}
	
	@RequestMapping(value = "/exist" , method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forExist() {
		
    	String name = getRequest().getParameter("name");
    	String id = getRequest().getParameter("id");
		String query = "from Role where 1=1 ";
		List<Object> values = new ArrayList<Object>();
		query += "and orgId is null ";
		if(StringUtils.isNotEmpty(id)){
			query += "and id != ? and name = ? ";
			values.add(id);
			values.add(name);
		}else{
			query += "and name = ? ";
			values.add(name);
		}
		List<Role> lst =  this.roleManager.find(query, values.toArray());
		if(null != lst && lst.size()>0){
			return ResultUtils.renderFailureResult("exist");
		}
		return ResultUtils.renderSuccessResult();
	    
	}
	/**
	 * 获取功能列表
	 * 
	 * @return
	 */
	@RequestMapping(value = "/list" , method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList() {
		String method = getRequest().getParameter("method");
		String context = getRequest().getParameter("context");
		String jql = "from Role where 1=1 ";

		Page page = new Page();
		List<String> values = new ArrayList<String>();
		if (!StringUtils.isEmpty(method)) {
			jql += "and " + method + " like ? ";
			values.add("%" + context + "%");
		}
		page.setValues(values.toArray());
		page.setPageSize(getRequest().getParameter("limit"));
		page.setStart(getRequest().getParameter("start"));
		page.setQuery(jql+" order by name desc ");
		this.roleManager.findPage(page);
		
		return ResultUtils.renderPageResult(page);
	}


	/**
	 * 单个删除.
	 * 
	 * @return success
	 */
	@RequestMapping(value="/remove/{id}",method=RequestMethod.DELETE,produces = MediaTypes.JSON_UTF_8)
	public Result forDelete(@PathVariable String id) {
		
		this.roleManager.delete(id);
		
		return ResultUtils.renderSuccessResult();
	}
	
	/**
	 * 批量删除角色.
	 * 
	 * @return success
	 */
	@RequestMapping(value="/remove",method=RequestMethod.POST,produces = MediaTypes.JSON_UTF_8)
	public Result forDelete() {
		String ids = getRequest().getParameter("ids");
		String id = ids.substring(0, ids.length()-1);
		String accSql =  "DELETE FROM IH_ROLE_ACC WHERE RID IN （" + id + ")";
		this.roleManager.executeSql(accSql);
		String sql = "DELETE FROM IH_BASE_ROLE WHERE ID IN (" + id + ")";
		this.roleManager.executeSql(sql);
		
		return ResultUtils.renderSuccessResult();
	}

	
	
	public Result forUpdate(@ModelAttribute Role model){  
		
		String query = "from Role where 1=1 ";
		List<Object> values = new ArrayList<Object>();
		query += "and orgId is null ";
		if(StringUtils.isNotEmpty(model.getId())){
			query += "and id != ? and name = ? and orgId is null ";
			values.add(model.getId());
			values.add(model.getName());
		}else{
			query += "and name = ? and orgId is null ";
			values.add(model.getName());
		}
		List<Role> lst =  this.roleManager.find(query, values.toArray());
		if(null != lst && lst.size()>0){
			return ResultUtils.renderFailureResult("exist");
		}
		
		model = this.roleManager.save(model);
    	return ResultUtils.renderSuccessResult(model);
    }
	
	/**
	 * 进入修改角色页面
	 * @return
	 */
	@RequestMapping(value = "/edit/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public ModelAndView forEdit(@PathVariable("id") String id) {
		ModelAndView mv = new ModelAndView("bdrp/org/pubrole/edit");
		mv.addObject("model" ,this.forView(id).getResult());
		return mv;
	}
	
}
