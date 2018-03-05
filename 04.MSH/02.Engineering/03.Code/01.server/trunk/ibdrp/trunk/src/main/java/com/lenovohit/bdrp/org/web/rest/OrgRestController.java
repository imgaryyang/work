package com.lenovohit.bdrp.org.web.rest;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.lenovohit.bdrp.org.model.Org;
import com.lenovohit.core.dao.Page;
import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.DateUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.rest.BaseRestController;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.core.web.utils.SuccessResult;

@RestController
@RequestMapping("/bdrp/org")
public class OrgRestController extends BaseRestController{
	
	@Autowired
	private GenericManager<Org, String> orgManager;
	
	
	@RequestMapping(value = "/org/main")
	public ModelAndView forMain() {
		ModelAndView mv = new ModelAndView("bdrp/org/org/orgMain");
		return mv;
	}
	
	@RequestMapping(value = "/org/edit/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public ModelAndView forEdit(@PathVariable("id") String id) {
		ModelAndView mv = new ModelAndView("bdrp/org/org/editOrg");
		mv.addObject("model" ,this.forView(id));
		return mv;
	}
	@RequestMapping(value = "/org/addPost/{orgId}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public ModelAndView addPost(@PathVariable("orgId") String orgId) {
		ModelAndView mv = new ModelAndView("bdrp/org/post/addPost");
		mv.addObject("org" ,this.forView(orgId));
		return mv;
	}
	@RequestMapping(value = "/org/addDep/{orgId}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public ModelAndView addDep(@PathVariable("orgId") String orgId) {
		ModelAndView mv = new ModelAndView("bdrp/org/dep/deptForm");
		mv.addObject("org" ,this.forView(orgId));
		return mv;
	}
	
	@RequestMapping(value = "/org/page" , method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Page forPage() {
		String method = this.getRequest().getParameter("method");
		String context = this.getRequest().getParameter("context");
		String start = this.getRequest().getParameter("start");
		String pageSize = this.getRequest().getParameter("pageSize");
		String parentId = this.getRequest().getParameter("parentId");
		
		String query = "from Org where 1=1 ";
		List<Object> values= new ArrayList<Object>();
		
		if(StringUtils.isNotEmpty(parentId)){
			query += "and parentId = ? ";
			values.add(parentId);
		}else{
			query += "and parentId is null ";
		}
		
		if (StringUtils.isNotEmpty(method)) {
			query += "and " + method + " like ? ";
			values.add("%" + context + "%");
		}
		
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(pageSize);
		page.setQuery(query);
		if(values.size()>0){
			page.setValues(values.toArray());
		}
		
		
		this.orgManager.findPage(page);
		if(null == page.getResult()){
			page.setResult(new ArrayList<Object>());
		}
		
		return page;
	}
	

	@RequestMapping(value = "/org/list/{start}/{pageSize}" , method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forPage(@PathVariable(value = "start") int start,
			@PathVariable(value = "pageSize") int pageSize,
			@RequestParam(value = "data", defaultValue = "") String data) {
		String method = this.getRequest().getParameter("method");
		String context = this.getRequest().getParameter("context");
		String parentId = this.getRequest().getParameter("parentId");
		
		String query = "from Org where 1=1 ";
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
		
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(pageSize);
		page.setQuery(query);
		page.setValues(values.toArray());
		
		this.orgManager.findPage(page);
		if(null == page.getResult()){
			page.setResult(new ArrayList<Object>());
		}
		
		return ResultUtils.renderSuccessResult(page);
	}
	
	
	@RequestMapping(value = "/org/exist" , method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forExist() {
		String id = this.getRequest().getParameter("id");
		String name = this.getRequest().getParameter("name");
		
		String query = "from Org where 1=1 ";
		Result result  = new SuccessResult();
		
		if(StringUtils.isNotEmpty(id)){
			query += "and id != ? and name = ? ";
			List<Org> lst = this.orgManager.find(query, id, name);
			if(null != lst && lst.size()>0){
				result = ResultUtils.renderFailureResult("exist");
			}
		}else{
			query += "and name = ? ";
			List<Org> lst = this.orgManager.find(query, name);
			if(null != lst && lst.size()>0){
				result = ResultUtils.renderFailureResult("exist");
			}
		}
		
		return result;
	}
	
	
	/**
	 * 返回单个 对象--查询
	 * <p>Title: forView</p>
	 * <p>Description: </p>
	 * @param String id
	 * @return Org
	 * @throws BaseException
	 */
	@RequestMapping(value = "/get/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Org forView(@PathVariable("id") String id) {
		Org org;
		try {
			org = this.orgManager.get(id);
		} catch (Exception e) {
			throw new BaseException("机构不存在");
		}
		return org;
	}
	
	/**
	 * 返回全部对象--查询
	 * <p>Title: forList</p>
	 * <p>Description: </p>
	 * @param 
	 * @return List<Org>
	 * @throws BaseException
	 */
	@RequestMapping(value = "/list",method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public List<Org> forList() {
		List<Org> list = orgManager.findAll();
		return list;
	}
	
	/**
	 * 查询
	 * <p>Title: findList</p>
	 * <p>Description: </p>
	 * @param 
	 * @return List<Dep>
	 * @throws BaseException
	 */
	@RequestMapping(value = "/findList",method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public List<Org> forFindList() {
		String method = this.getRequest().getParameter("method");
		String context = this.getRequest().getParameter("context");
		String parentId = this.getRequest().getParameter("parentId");
		
		String query = "from Org where 1=1 ";
		List<Object> values= new ArrayList<Object>();
		
		if(StringUtils.isNotEmpty(parentId)){
			query += "and parent.id = ? ";
			values.add(parentId);
		}
		
		if (StringUtils.isNotEmpty(method)) {
			query += "and " + method + " like ? ";
			values.add("%" + context + "%");
		}
		
		List<Org> lst = this.orgManager.find(query, values.toArray());
		
		return lst;
	}
	
	/**
	 * 新增机构
	 * <p>Title: forSave</p>
	 * <p>Description: </p>
	 * @param Org org
	 * @return Org
	 * @throws BaseException
	 */
	@RequestMapping(value = "/org/create", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forSave(@ModelAttribute Org org) {
		String jql = "from Org where name = ? ";
		List<Org> list = orgManager.find(jql,org.getName());

		if (list.size() > 0) {
			throw new BaseException("机构名重复，机构创建失败");
		}
		if(StringUtils.isEmpty(org.getId())){
			org.setId( StringUtils.uuid() );
		}
		if (org.getParent() != null) {
			if ("".equals(org.getParent().getId())
					|| "undefined".equals(org.getParent().getId())) {
				org.setParent(null);
			} else {
				Org parent = this.orgManager.get(org.getParent().getId());
				org.setParent(parent);
			}
		} else {
			org.setParent(null);
		}

		org.setUpDate(DateUtils.getCurrentDateStr());

		this.orgManager.save(org);

		return ResultUtils.renderSuccessResult(org);
	}
	
	/**
	 * 新增机构
	 * <p>Title: forCreate</p>
	 * <p>Description: </p>
	 * @param Org org
	 * @return Org
	 * @throws BaseException
	 */
	@RequestMapping(value = "/org/create4json", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forCreate(@RequestBody Org org) {
		
		String jql = "from Org where name = ? ";
		List<Org> list = orgManager.find(jql,org.getName());

		if (list.size() > 0) {
			throw new BaseException("机构名重复，机构创建失败");
		}
		if (org.getParent() != null) {
			if ("".equals(org.getParent().getId())
					|| "undefined".equals(org.getParent().getId())) {
				org.setParent(null);
			} else {
				Org parent = this.orgManager.get(org.getParent().getId());
				org.setParent(parent);
			}
		} else {
			org.setParent(null);
		}

		org.setUpDate(DateUtils.getCurrentDateStr());
		
//		if(StringUtils.isEmpty(org.getId())){
//			org.setId( StringUtils.uuid() );
//		}
		
		this.orgManager.save(org);

		return ResultUtils.renderSuccessResult(org);
	}
	
	/**
	 * 修改
	 * <p>Title: forUpdate</p>
	 * <p>Description: </p>
	 * @param  Org org
	 * @return  Org org
	 * @throws BaseException
	 */
	@RequestMapping(value = "/org/update", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdate(@ModelAttribute Org org) {
//		
//		String jql = "from Org where id != ? and name = ? ";
//		List<Org> list = orgManager.find(jql,org.getId(),org.getName());
//
//		if (list.size() > 0) {
//			throw new BaseException("机构名重复，机构更新失败！");
//		}
		
		org.setUpDate(DateUtils.getCurrentDateStr());
		this.orgManager.save(org);
		return ResultUtils.renderSuccessResult();
	}
	
	/**
	 * 删除  
	 * <p>Title: forDelete</p>
	 * <p>Description: </p>
	 * @param String id
	 * @return 
	 * @throws BaseException
	 */
	@RequestMapping(value = "/remove/{id}",method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDelete(@PathVariable("id") String id){
		this.orgManager.delete(id);
		return ResultUtils.renderSuccessResult();
	}
	
	/**
	 * 返回分页
	 * <p>Title: getPage</p>
	 * <p>Description: </p>
	 * @param   String start,String limit
	 * @return List<Org>
	 * @throws BaseException
	 */
	@RequestMapping(value = "/get/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public List<Org> getPage(@PathVariable("start") String start, @PathVariable("limit") String limit){
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery("from Org where 1=1 order by name");
	//	page.setValues(new Object[] {"0"});
		orgManager.findPage(page);
		@SuppressWarnings("unchecked")
		List<Org> list = (List<Org>)page.getResult();
		return list;
	}
	
	
	@RequestMapping(value = "/org/tree" , method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public List<Org> forTree() {
		String method = this.getRequest().getParameter("method");
		String context = this.getRequest().getParameter("context");
		String parentId = this.getRequest().getParameter("parentId");
		
		String query = "from Org where 1=1 ";
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
		
		
		List<Org> lst = this.orgManager.find(query, values.toArray());
		
		return lst;
	}
	
	@RequestMapping(value = "/org/newTree" , method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forNewTree() {
		String method = this.getRequest().getParameter("method");
		String context = this.getRequest().getParameter("context");
		String parentId = this.getRequest().getParameter("parentId");
		
		String jql = "from Org where 1=1 ";
		List<Object> values= new ArrayList<Object>();
		Page page = new Page();
		
		if(StringUtils.isNotEmpty(parentId)){
			jql += "and parent.id = ? ";
			values.add(parentId);
		}else{
			jql += "and parent is null ";
		}
		
		if (StringUtils.isNotEmpty(method)) {
			jql += "and " + method + " like ? ";
			values.add("%" + context + "%");
		}
		page.setValues(values.toArray());
		page.setPageSize(getRequest().getParameter("limit"));
		page.setStart(getRequest().getParameter("start"));
		page.setQuery(jql+" order by name asc ");
		this.orgManager.findPage(page);
		return ResultUtils.renderPageResult(page);
	}
}


