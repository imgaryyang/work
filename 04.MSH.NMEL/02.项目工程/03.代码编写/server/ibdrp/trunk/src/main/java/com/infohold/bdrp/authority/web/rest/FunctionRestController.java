package com.infohold.bdrp.authority.web.rest;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.infohold.bdrp.authority.model.Function;
import com.infohold.core.dao.Page;
import com.infohold.core.exception.BaseException;
import com.infohold.core.manager.GenericManager;
import com.infohold.core.utils.StringUtils;
import com.infohold.core.web.MediaTypes;
import com.infohold.core.web.rest.BaseRestController;
import com.infohold.core.web.utils.Result;
import com.infohold.core.web.utils.ResultUtils;
import com.infohold.core.web.utils.SuccessResult;

@RestController
@RequestMapping("/bdrp/auth/function")
public class FunctionRestController extends BaseRestController{

	
	@Autowired
	private GenericManager<Function, String> functionManager;
	
	/**
	 * 主页
	 * @return
	 */
	@RequestMapping(value = "/main")
	public ModelAndView forMain() {
		ModelAndView mv = new ModelAndView("bdrp/auth/function/main");
		return mv;
	}
	
	/**
	 * 分页
	 * @return
	 */
	@RequestMapping(value = "/page" , method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forPage() {
		String method = this.getRequest().getParameter("method");
		String context = this.getRequest().getParameter("context");
		String start = this.getRequest().getParameter("start");
		String pageSize = this.getRequest().getParameter("pageSize");
		String parentId = this.getRequest().getParameter("parentId");
		
		String query = "from Function where 1=1 ";
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
		
		this.functionManager.findPage(page);
		
		return ResultUtils.renderPageResult(page);
	}
	/**
	 * 进入编辑页面
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/edit/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public ModelAndView forEdit(@PathVariable("id") String id) {
		ModelAndView mv = new ModelAndView("bdrp/auth/function/edit");
		mv.addObject("model" ,this.forView(id));
		return mv;
	}
	/**
	 * 是否存在
	 * @return
	 */
	@RequestMapping(value = "/exist" , method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forExist() {
		String id = this.getRequest().getParameter("id");
		String name = this.getRequest().getParameter("name");
		
		String query = "from Function where 1=1 ";
		Result result  = new SuccessResult();
		
		if(StringUtils.isNotEmpty(id)){
			query += "and id != ? and name = ? ";
			List<Function> lst =  this.functionManager.find(query, id, name);
			if(null != lst && lst.size()>0){
				result = ResultUtils.renderFailureResult("exist");
			}
		}else{
			query += "and name = ? ";
			List<Function> lst =  this.functionManager.find(query, name);
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
	 * @return Function
	 * @throws BaseException
	 */
	@RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Function forView(@PathVariable("id") String id) {
		Function org;
		try {
			org = this.functionManager.get(id);
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
	 * @return List<Function>
	 * @throws BaseException
	 */
	@RequestMapping(value = "/list",method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public List<Function> forList() {
		List<Function> list = functionManager.findAll();
		return list;
	}
	
	/**
	 * 新增机构
	 * <p>Title: forSave</p>
	 * <p>Description: </p>
	 * @param Function org
	 * @return Function
	 * @throws BaseException
	 */
	@RequestMapping(value = "/create", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forSave(@ModelAttribute Function model) {
		String jsql = "from Function where name = ? ";
		List<Function> list = functionManager.find(jsql,model.getName());

		if (list.size() > 0) {
			throw new BaseException("功能名重复，功能创建失败");
		}
		if (model.getParent() != null) {
			if ("".equals(model.getParent().getId())
					|| "undefined".equals(model.getParent().getId())) {
				model.setParent(null);
			} else {
				Function parent = this.functionManager.get(model.getParent().getId());
				model.setParent(parent);
			}
		} else {
			model.setParent(null);
		}

		model = this.functionManager.save(model);

//		return model;
		return ResultUtils.renderSuccessResult(model);
	}
	
	/**
	 * 修改
	 * <p>Title: forUpdate</p>
	 * <p>Description: </p>
	 * @param  Function org
	 * @return  Function org
	 * @throws BaseException
	 */
	@RequestMapping(value = "/update", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdate(@ModelAttribute Function org) {
		//org.setUpDate(DateUtils.getCurrentDateStr());
		this.functionManager.save(org);
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
	@RequestMapping(value = "remove/{id}",method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDelete(@PathVariable("id") String id){
		this.functionManager.delete(id);
		return ResultUtils.renderSuccessResult();
	}
	
	/**
	 * 返回分页
	 * <p>Title: getPage</p>
	 * <p>Description: </p>
	 * @param   String start,String limit
	 * @return List<Function>
	 * @throws BaseException
	 */
	@RequestMapping(value = "get/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Page getPage(@PathVariable("start") String start, @PathVariable("limit") String limit){
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery("from Function where 1=1 order by name");
	//	page.setValues(new Object[] {"0"});
		functionManager.findPage(page);
		return page;
	}
	@RequestMapping(value = "/tree" , method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public List<Function> forTree() {
		String parentId = this.getRequest().getParameter("parentId");
		
		String query = "from Function where 1=1 ";
		List<Object> values= new ArrayList<Object>();
		
		if(StringUtils.isNotEmpty(parentId)){
			query += "and parent.id = ? ";
			values.add(parentId);
		}else{
			query += "and parent is null ";
		}
		
		List<Function> lst = this.functionManager.find(query, values.toArray());
		for(Function f : lst){
			f.setChildren(getSubChildren(f.getId()));
		}
		
		return lst;
	}
	
	private Set<Function> getSubChildren(String parentId){
		String query = "from Function where parent.id = ?  ";
		
		
		List<Function> lst = this.functionManager.find(query, parentId);
		if(lst.size() > 0){
			
			for(Function f : lst){
				f.setChildren(getSubChildren(f.getId()));
			}
			
			return  new HashSet<Function>(lst);
		}
		return null;
	}
}
