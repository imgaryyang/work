package com.lenovohit.bdrp.authority.web.rest;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.lenovohit.bdrp.authority.model.AuthzAccess;
import com.lenovohit.bdrp.authority.model.Function;
import com.lenovohit.core.dao.Page;
import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.rest.BaseRestController;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.core.web.utils.SuccessResult;

@RestController
@RequestMapping("/bdrp/auth/access")
public class AuthzAccessRestController extends BaseRestController {
	
	@Autowired
	GenericManager<AuthzAccess, String> authAccessManager;
	
	@RequestMapping(value = "/main")
	public ModelAndView forMain() {
		ModelAndView mv = new ModelAndView("bdrp/auth/access/main");
		mv.addObject("pageBean", forPage());
		return mv;
	}
	
	@RequestMapping(value = "/page" , method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forPage() {
		String name = this.getRequest().getParameter("name");
		String desc = this.getRequest().getParameter("desc");
		String func = this.getRequest().getParameter("func");
		String start = this.getRequest().getParameter("start");
		String pageSize = this.getRequest().getParameter("pageSize");
		if(StringUtils.isEmpty(pageSize))
			pageSize = getRequest().getParameter("limit");
		
		String query = "select a ,f  from AuthzAccess a left join a.function  f where 1=1 ";
		List<Object> values= new ArrayList<Object>();
		if (StringUtils.isNotEmpty(name)) {
			query += "and a.name like ? ";
			values.add("%" + name + "%");
		}
		if (StringUtils.isNotEmpty(desc)) {
			query += "and a.descp like ? ";
			values.add("%" + desc + "%");
		}
		if (StringUtils.isNotEmpty(func)) {
			query += "and a.function.id = ? ";
			values.add(func);
		}
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(pageSize);
		page.setQuery(query);
		page.setValues(values.toArray());
		
		this.authAccessManager.findPage(page);
		List<AuthzAccess> accesses = new ArrayList<AuthzAccess>();
		List<Object[]> results= (List<Object[]>)page.getResult();
		if(results!=null && results.size()>0) {
			for(Object[] result : results){
				AuthzAccess access = (AuthzAccess)result[0];
				if (null!=result[1]) {
					Function function = (Function) result[1];
					access.setFunction(function);
				}
				accesses.add(access);
			}
		}
		page.setResult(accesses);
		return ResultUtils.renderPageResult(page);
	}
	
	/**
	 * 返回信息至浏览页面
	 * 
	 * @return
	 */
	@RequestMapping(value="/view/{id}",method=RequestMethod.GET,produces = MediaTypes.JSON_UTF_8)
	public AuthzAccess forView(@PathVariable String id) {
		return this.authAccessManager.get(id);
	}
	
	
	/**
	 * 返回信息至浏览页面
	 * 
	 * @return
	 */
	@RequestMapping(value="/edit/{id}",method=RequestMethod.GET,produces = MediaTypes.JSON_UTF_8)
	public ModelAndView forEdit(@PathVariable String id) {
		ModelAndView mv= new ModelAndView("bdrp/auth/access/edit");
		mv.addObject("model",this.forView(id));
		return mv;
	}
	
	/**
	 * 保存对象基本信息
	 * 
	 * @return
	 */
	@RequestMapping(value ="/create",method=RequestMethod.POST,produces = MediaTypes.JSON_UTF_8)
	public Result forCreate(@ModelAttribute AuthzAccess model ) {
		try {
			String validHql = "from AuthzAccess where name = ? ";
			List<AuthzAccess> lst = this.authAccessManager.find(validHql,
					model.getName());
			if (lst.size() > 0) {
				throw new BaseException("该名称已存在,请重新填写!");
			}
			
			if (null !=  model.getFunction() ) {
				if ("".equals(model.getFunction().getId())
						|| "undefined".equals(model.getFunction().getId())) {
					model.setFunction(null);
				}
			} else {
			}
			
			model = this.authAccessManager.save(model);
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return ResultUtils.renderSuccessResult(model);
	}
	
	@RequestMapping(value = "/exist" , method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forExist() {
		String id = this.getRequest().getParameter("id");
		String name = this.getRequest().getParameter("name");
		String query = "from AuthzAccess where 1=1 ";
		Result result  = new SuccessResult();
		
		if(StringUtils.isNotEmpty(id)){
			query += "and id != ? and name = ? ";
			List<AuthzAccess> lst = this.authAccessManager.find(query, id, name);
			if(null != lst && lst.size()>0){
				result = ResultUtils.renderFailureResult("exist");
			}
		}else{
			query += "and name = ? ";
			List<AuthzAccess> lst = this.authAccessManager.find(query, name);
			if(null != lst && lst.size()>0){
				result = ResultUtils.renderFailureResult("exist");
			}
		}
		return result;
	}
	
	/**
	 * 单个删除.
	 * 
	 * @return success
	 */
	@RequestMapping(value="/remove/{id}",method=RequestMethod.DELETE,produces = MediaTypes.JSON_UTF_8)
	public Result forDelete(@PathVariable String id) {
		this.authAccessManager.delete(id);
		return ResultUtils.renderSuccessResult();
	}

	
	/**
	 * 进入修改角色页面
	 * @return
	 */
	@RequestMapping(value = "/update" , method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdate(@ModelAttribute AuthzAccess model){   
		try {
			model = this.authAccessManager.save(model);
		} catch (Exception e) {
			e.printStackTrace();
		}
		model.setFunction(null);//防止转json时提示没有session
    	return ResultUtils.renderSuccessResult(model);
    }
	
	
	@RequestMapping(value = "/tree" , method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public List<AuthzAccess> forTree() {
		String method = this.getRequest().getParameter("method");
		String context = this.getRequest().getParameter("context");
		String parentId = this.getRequest().getParameter("parentId");
		
		String query = "from Access where 1=1 ";
		List<Object> values= new ArrayList<Object>();
		
		if(StringUtils.isNotEmpty(parentId)){
			query += "and parent.id = ? ";
			values.add(parentId);
		}else{
			query += "and parent is null ";
		}
		
		if (StringUtils.isNotEmpty(method)) {
			query += "and " + method + " like ? ";
			values.add("%" + context + "%");
		}
		
		
		List<AuthzAccess> lst = this.authAccessManager.find(query, values.toArray());
		
		return lst;
	}
	/**
	 * 授权操作
	 * @return
	 * @throws IOException
	 */
	@RequestMapping(value = "/authorize", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public String forDoAccess() {
		String result = "success";
		String checked = getRequest().getParameter("checked");
		String sid = getRequest().getParameter("aid");
		String rid = getRequest().getParameter("rid");
		
		if(checked.equals("true")){
			String jql="delete from IH_ROLE_ACC where RID=? and AID=? ";
			this.authAccessManager.executeSql(jql, rid,sid);
			String sql = "insert into IH_ROLE_ACC(RID,AID) values(? ,? )";
			this.authAccessManager.executeSql(sql, rid,sid);
			
		}else{
			String sql = "delete from IH_ROLE_ACC where RID = ? and AID = ? ";
			this.authAccessManager.executeSql(sql, rid,sid);
		}
		
		return result;
	}
	
	
	@RequestMapping(value = "menu/toLink" , method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public ModelAndView forToLink() {
		ModelAndView mv = new ModelAndView("bdrp/auth/access/list");
		
		String name = this.getRequest().getParameter("name");
		String functionName = this.getRequest().getParameter("functionName");
		String descp = this.getRequest().getParameter("descp");
		String start = this.getRequest().getParameter("start");
		String pageSize = this.getRequest().getParameter("pageSize");
		//new AuthzAccess(a.id,a.name,a.descp,f.id , f.name) 
		String query = "select a ,f  from AuthzAccess a left join a.function  f where 1=1 ";
		List<Object> values= new ArrayList<Object>();
		if (StringUtils.isNotEmpty(name)) {
			query += "and a.name like ? ";
			values.add("%" + name + "%");
		}
		
		if (StringUtils.isNotEmpty(functionName)) {
			query += "and a.function.name like ? ";
			values.add("%" + functionName + "%");
		}
		
		if (StringUtils.isNotEmpty(descp)) {
			query += "and a.descp like ? ";
			values.add("%" + descp + "%");
		}
		
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(pageSize);
		page.setQuery(query);
		page.setValues(values.toArray());
		
		this.authAccessManager.findPage(page);
		List<AuthzAccess> accesses = new ArrayList<AuthzAccess>();
		List<Object[]> results= (List<Object[]>)page.getResult();
		for(Object[] result : results){
			AuthzAccess access = (AuthzAccess)result[0];
			if (null!=result[1]) {
				Function function = (Function) result[1];
				access.setFunction(function);
			}
			accesses.add(access);
		}
		page.setResult(accesses);
		mv.addObject("pageBean", forPage());
		return mv;
	}
}
