package com.lenovohit.bdrp.authority.web.rest;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.lenovohit.bdrp.authority.model.Menu;
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
@RequestMapping("/bdrp/auth/menu")
public class MenuRestController extends BaseRestController {
	
	@Autowired
	GenericManager<Menu, String> menuManager;
	
	@RequestMapping(value = "/main")
	public ModelAndView forMain() {
		ModelAndView mv = new ModelAndView("bdrp/auth/menu/main");
		return mv;
	}
	
	@RequestMapping(value = "/page" , method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Page forPage() {
		String method = this.getRequest().getParameter("method");
		String context = this.getRequest().getParameter("context");
		String parentId = this.getRequest().getParameter("parentId");
		String start = this.getRequest().getParameter("start");
		String pageSize = this.getRequest().getParameter("pageSize");
		
		String query = "from Menu where 1=1 ";
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
		page.setValues(values.toArray());
		
		this.menuManager.findPage(page);
		
		return page;
	}
	
//	/**
//	 * 返回信息至浏览页面
//	 * 
//	 * @return
//	 */
	@RequestMapping(value="/view/{id}",method=RequestMethod.GET,produces = MediaTypes.JSON_UTF_8)
	public Menu forView(@PathVariable String id) {
		return this.menuManager.get(id);
	}
	
	
	/**
	 * 返回信息至浏览页面
	 * 
	 * @return
	 */
	@RequestMapping(value="/edit/{id}",method=RequestMethod.GET,produces = MediaTypes.JSON_UTF_8)
	public ModelAndView forEdit(@PathVariable String id) {
		ModelAndView mv= new ModelAndView("bdrp/auth/menu/edit");
		mv.addObject("model",this.forView(id));
		return mv;
	}
	
	/**
	 * 保存对象基本信息
	 * 
	 * @return
	 */
	@RequestMapping(value="/create",method=RequestMethod.POST,produces = MediaTypes.JSON_UTF_8)
	public Menu forCreate(@ModelAttribute Menu model ) {
		String validHql = "from Menu where name = ? ";
		List<Menu> lst = this.menuManager.find(validHql,
				model.getName());
		if (lst.size() > 0) {
			throw new BaseException("该名称已存在,请重新填写!");
		}
//		if(null == model.getParent() || StringUtils.isBlank(model.getParent().getId())){
//			model.setParent(null);
//		}
		this.menuManager.save(model);
		
		return model;
	}
	
	@RequestMapping(value = "/exist" , method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forExist() {
		String id = this.getRequest().getParameter("id");
		String name = this.getRequest().getParameter("name");
		
		String query = "from Menu where 1=1 ";
		Result result  = new SuccessResult();
		
		if(StringUtils.isNotEmpty(id)){
			query += "and id != ? and name = ? ";
			List<Menu> lst = this.menuManager.find(query, id, name);
			if(null != lst && lst.size()>0){
				result = ResultUtils.renderFailureResult("exist");
			}
		}else{
			query += "and name = ? ";
			List<Menu> lst = this.menuManager.find(query, name);
			if(null != lst && lst.size()>0){
				result = ResultUtils.renderFailureResult("exist");
			}
		}
		
		return result;
	}
	
	/**
	 * 获取功能列表
	 * 
	 * @return
	 */
	public Page forList() {
		String method = getRequest().getParameter("method");
		String context = getRequest().getParameter("context");
		String jql = "from Menu where 1=1 ";

		Page page = new Page();
		List<String> values = new ArrayList<String>();
		if (!StringUtils.isEmpty(method)) {
			jql += "and " + method + " like ? ";
			values.add("%" + context + "%");
		}
		page.setValues(values.toArray());
		page.setPageSize(getRequest().getParameter("limit"));
		page.setStart(getRequest().getParameter("start"));
		page.setQuery(jql);
		this.menuManager.findPage(page);

		return page;
	}


	/**
	 * 单个删除.
	 * 
	 * @return success
	 */
	@RequestMapping(value="/remove/{id}",method=RequestMethod.DELETE,produces = MediaTypes.JSON_UTF_8)
	public Result forDelete(@PathVariable String id) {
		this.menuManager.delete(id);
		return ResultUtils.renderSuccessResult();
	}

	
	/**
	 * 进入修改角色页面
	 * @return
	 */
	@RequestMapping(value = "/update" , method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Menu forUpdate(@ModelAttribute Menu model){    	
		this.menuManager.save(model);
    	return model;
    }
	
	/**
	 * 获取授权菜单树
	 * @return
	 */
	@RequestMapping(value = "/tree/{roleId}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public List<?> forAuthTree(@PathVariable("roleId") String roleId) {
		String msql = "select"
				+ " m.ID as id,m.CODE as code,m.NAME as name,m.PARENT as parent,"
				+ "m.DESCP as descp,m.ICON as icon,"
				+ "m.SORTER as sorter,m.AID as aid  "
				+ "from IH_MENU m ";
		List<Object[]> menus =(List<Object[]>) this.menuManager.findBySql(msql);
		String accsql = "SELECT AID FROM IH_ROLE_ACC WHERE RID = ? ";
		List<String> accList =(List<String>) this.menuManager.findBySql(accsql,roleId);
		
		List<Menu> memuLst = new ArrayList<Menu>();
		List<MenuRoleRel> allMemuLst = new ArrayList<MenuRoleRel>();
		List<Menu> retLst = new ArrayList<Menu>();
		MenuRoleRel mt = null;
		Map<String, MenuRoleRel> tmpMap = new HashMap<String, MenuRoleRel>();
		List<String> parentIdList = new ArrayList<String>();
		List<Menu> mainMenu = new ArrayList<Menu>();
		for (Object[] obj : menus) {
			mt = new MenuRoleRel();
			mt.setId(convertStrNull(obj[0]));
			mt.setCode(convertStrNull(obj[1]));
			mt.setName(convertStrNull(obj[2]));
			mt.setParentId(convertStrNull(obj[3]));
			mt.setDescp(convertStrNull(obj[4]));
			mt.setIconPath(convertStrNull(obj[5]));
			mt.setSort((Integer.parseInt(String.valueOf(obj[6]))));
			mt.setAid(convertStrNull(obj[7]));
			if(accList.indexOf(obj[7].toString())>=0){
				mt.setRid(roleId);
			}
			
			if (StringUtils.isBlank(convertStrNull(obj[3]))) {
				mainMenu.add(mt);
			} else {
				parentIdList.add(convertStrNull(obj[3]));
				mt.setParentId(convertStrNull(obj[3]));
				memuLst.add(mt);
			}
			tmpMap.put(mt.getId(), mt);
			allMemuLst.add(mt);
		}
		for (String id : tmpMap.keySet()) {
			if (null != tmpMap.get(tmpMap.get(id).getParentId())) {
				tmpMap.get(tmpMap.get(id).getParentId()).getChildren()
						.add(tmpMap.get(id));
			} else {
				mainMenu.add(tmpMap.get(id));
			}
		}
		for (Menu m : mainMenu) {
			construtMenu(memuLst, m.getId(), m);
			if (!retLst.contains(m))
				retLst.add(m);
		}

		Collections.sort(retLst);
		return retLst;
	}
	
	
	@RequestMapping(value = "/tree" , method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public List<Menu> forTree() {
		String parentId = this.getRequest().getParameter("parentId");
		
		String query = "from Menu where 1=1 ";
		List<Object> values= new ArrayList<Object>();
		
		if(StringUtils.isNotEmpty(parentId)){
			query += "and parentId = ? ";
			values.add(parentId);
		}else{
			query += "and parentId is null ";
		}
		
		List<Menu> lst = this.menuManager.find(query, values.toArray());
		for(Menu m : lst){
			m.setChildren(getSubChildren(m.getId()));
		}
		return lst;
	}
	
	private Set<Menu>  getSubChildren(String parentId){
		String query = "from Menu where parentId = ? ";
		List<Menu> lst = this.menuManager.find(query, parentId);
		if(lst.size() > 0){
			for(Menu m : lst){
				m.setChildren(getSubChildren(m.getId()));
			}
			return  new HashSet<Menu>(lst);
		}
		return null;
	}
	private String convertStrNull(Object obj){
		String str = String.valueOf(obj);
    	if(str==null||"null".equals(str)){
    		str="";
    	}
    	return str;
	}
	
	
	/**
	 * 构建菜单层次机构
	 * @param srcMenu
	 * @param pid
	 * @param tarMenu
	 */
	protected void construtMenu(List<Menu> srcMenu,String pid,Menu tarMenu){
		Set<Menu> chMenu = getChildren(srcMenu,tarMenu.getId(),tarMenu);
		if(chMenu.size()>0){
			tarMenu.getChildren().addAll(chMenu);
		}
	}
	/**
	 * 查找菜单集合中符合条件的菜单
	 * @param srcMenu
	 * @param pid
	 * @param tarMenu
	 * @return
	 */
	protected Set<Menu> getChildren(List<Menu> srcMenu,String pid, Menu tarMenu){
		TreeSet<Menu> retuMenu = new TreeSet<Menu>(new Comparator<Menu>(){
			public int compare(Menu o1, Menu o2) {
				int n1 = o1.getSort();
			    int n2 = o2.getSort();
			    if(n1==n2){
			    	return 0;
			    }else if(n1>n2){
			    	return 1;
			    }else if(n1<n2){
			    	return -1;
			    }
				return 0;
			}
			  });
		for(Menu menu : srcMenu){
			if(pid.equals(menu.getParentId())){
				construtMenu(srcMenu,menu.getId(),menu);
				retuMenu.add(menu);
			}
		}
		return retuMenu;
	}
	
}

@SuppressWarnings("serial")
class MenuRoleRel extends Menu{
	
	private String aid;
	
	private String rid;

	public String getRid() {
		return rid;
	}

	public void setRid(String rid) {
		this.rid = rid;
	}

	public String getAid() {
		return aid;
	}

	public void setAid(String aid) {
		this.aid = aid;
	}
	
	
}