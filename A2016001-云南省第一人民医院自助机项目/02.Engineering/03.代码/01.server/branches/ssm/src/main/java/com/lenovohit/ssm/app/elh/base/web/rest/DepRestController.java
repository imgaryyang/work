package com.lenovohit.ssm.app.elh.base.web.rest;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.lenovohit.core.dao.Page;
import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.rest.BaseRestController;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.core.web.utils.SuccessResult;
import com.lenovohit.ssm.app.elh.base.model.Dep;
import com.lenovohit.ssm.app.elh.base.model.Person;

/**
 * 部门管理
 * @author wang
 *
 */
@RestController
@RequestMapping("/hwe/app/dep")
public class DepRestController extends BaseRestController{

	@Autowired
	private GenericManager<Dep, String> depManager;
	@Autowired
	GenericManager<Person, String> personManager;
	
	@RequestMapping(value = "/main")
	public ModelAndView forMain() {
		ModelAndView mv = new ModelAndView("bdrp/org/dep/deptMain");
		return mv;
	}
	
	@RequestMapping(value = "/page" , method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Page forPage() {
		String start = this.getRequest().getParameter("start");
		String pageSize = this.getRequest().getParameter("pageSize");
		String oid = this.getRequest().getParameter("oid");
		String name = this.getRequest().getParameter("name");
		String parentId = this.getRequest().getParameter("parentId");
		
		String query = "from Dep where 1=1 ";
		List<Object> values= new ArrayList<Object>();
		
		if(StringUtils.isNotEmpty(oid)){
			query += "and org.id = ? ";
			values.add(oid);
		}
		if(StringUtils.isNotEmpty(parentId)){
			query += "and parent.id = ? ";
			values.add(parentId);
		}else{
			query += "and parent is null ";
		}
		
		if (StringUtils.isNotEmpty(name)) {
			query += "and name like ? ";
			values.add("%" + name + "%");
		}
		
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(pageSize);
		page.setQuery(query);
		page.setValues(values.toArray());
		
		this.depManager.findPage(page);
		
		return page;
	}
	
	@RequestMapping(value = "/tree" , method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public List<Dep> forTree() {
		String method = this.getRequest().getParameter("method");
		String context = this.getRequest().getParameter("context");
		String parentId = this.getRequest().getParameter("parentId");
		String orgId = getRequest().getParameter("oid");
		
		String query = "from Dep where 1=1 ";
		List<Object> values= new ArrayList<Object>();
		
		if(StringUtils.isNotEmpty(orgId)){
			query += "and org.id = ? ";
			values.add(orgId);
		}
		
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
		
		List<Dep> lst =  this.depManager.find(query, values.toArray());
		
		return lst;
	}
	
	/**
	 * 是否存在
	 * @return
	 */
	@RequestMapping(value = "/exist" , method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forExist() {
		String id = this.getRequest().getParameter("id");
		String name = this.getRequest().getParameter("name");
		String oid = this.getRequest().getParameter("oid");
		
		String query = "from Dep where 1=1 ";
		List<Object> values = new ArrayList<Object>();
		if(StringUtils.isNotEmpty(oid)){
			query += "and org.id = ? ";
			values.add(oid);
		}
		if(StringUtils.isNotEmpty(id)){
			query += "and id != ? and name = ? ";
			values.add(id);
			values.add(name);
		} else {
			query += "and name = ? ";
			values.add(name);
		}
		List<Dep> lst =  this.depManager.find(query, values.toArray());
		Result result  = new SuccessResult();
		if(null != lst && lst.size()>0){
			result = ResultUtils.renderFailureResult("exist");
		}
		return result;
	}
	@RequestMapping(value = "/edit/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public ModelAndView forEdit(@PathVariable("id") String id) {
		ModelAndView mv = new ModelAndView("bdrp/org/dep/deptEdit");
		mv.addObject("model" ,this.forView(id));
		return mv;
	}
	/**
	 * 返回单个 对象--查询
	 * <p>Title: forView</p>
	 * <p>Description: </p>
	 * @param String id
	 * @return Dep
	 * @throws BaseException
	 */
	@RequestMapping(value = "/get/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Dep forView(@PathVariable("id") String id) {
		Dep dep;
		try {
			dep = this.depManager.get(id);
		} catch (Exception e) {
			throw new BaseException("部门不存在");
		}
		return dep;
	}
	
	/**
	 * 返回全部对象--查询
	 * <p>Title: forList</p>
	 * <p>Description: </p>
	 * @param 
	 * @return List<Dep>
	 * @throws BaseException
	 */
	@RequestMapping(value = "/list",method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public List<Dep> forList() {
		List<Dep> list = depManager.findAll();
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
	public List<Dep> forFindList() {
		String method = this.getRequest().getParameter("method");
		String context = this.getRequest().getParameter("context");
		String parentId = this.getRequest().getParameter("parentId");
		String orgId = getRequest().getParameter("oid");
		
		String query = "from Dep where 1=1 ";
		List<Object> values= new ArrayList<Object>();
		
		if(StringUtils.isNotEmpty(orgId)){
			query += "and org.id = ? ";
			values.add(orgId);
		}
		
		if(StringUtils.isNotEmpty(parentId)){
			query += "and parent.id = ? ";
			values.add(parentId);
		}
		
		if (StringUtils.isNotEmpty(method)) {
			query += "and " + method + " like ? ";
			values.add("%" + context + "%");
		}
		
		List<Dep> lst =  this.depManager.find(query, values.toArray());
		
		return lst;
	}
	/**
	 * 新增部门
	 * <p>Title: forSave</p>
	 * <p>Description: </p>
	 * @param Dep dep
	 * @return Dep
	 * @throws BaseException
	 */
	@RequestMapping(value = "/create", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forSave(@ModelAttribute Dep dep) throws Exception {
		try {
			if(dep.getOrg() != null){
				if(StringUtils.isEmpty(dep.getOrg().getId())
						|| StringUtils.equals("undefined", dep.getOrg().getId())){
					dep.setOrg(null);
				}
			}
			if (dep.getParent() != null) {
				if (StringUtils.isEmpty(dep.getParent().getId())
						|| StringUtils.equals("undefined",dep.getParent().getId())) {
					dep.setParent(null);
				}
			}
			
			dep = this.depManager.save(dep);
			return ResultUtils.renderSuccessResult(dep);
		} catch (Exception e) {
			throw new BaseException("部门创建失败");
		}
	}
	
	/**
	 * 修改
	 * <p>Title: forUpdate</p>
	 * <p>Description: </p>
	 * @param  Dep dep
	 * @return  Dep dep
	 * @throws BaseException
	 */
	@RequestMapping(value = "/update", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdate(@ModelAttribute Dep model) {
		if(model==null || StringUtils.isBlank(model.getId())){
			return ResultUtils.renderFailureResult();
		} else {
			Dep dep = this.depManager.get(model.getId());
			model.setOrg(dep.getOrg());
			model.setChildren(dep.getChildren());
		}
		this.depManager.save(model);

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
		try {
			this.depManager.delete(id);
		} catch (Exception e) {
			throw new BaseException("部门删除失败");
		}
		return ResultUtils.renderSuccessResult();
	}
	
	/**
	 * 返回分页
	 * <p>Title: getPage</p>
	 * <p>Description: </p>
	 * @param   String start,String limit
	 * @return List<Dep>
	 * @throws BaseException
	 */
	@RequestMapping(value = "/get/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public List<Dep> getPage(@PathVariable("start") String start, @PathVariable("limit") String limit){
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery("from Dep where 1=1 order by name");
	//	page.setValues(new Object[] {"0"});
		depManager.findPage(page);
		@SuppressWarnings("unchecked")
		List<Dep> list = (List<Dep>)page.getResult();
		return list;
	}
	
	//查询该机构下 未关联用户
	@RequestMapping(value = "/toLinkPerson", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public ModelAndView toLinkPerson() {
		String start = this.getRequest().getParameter("start");
		String pageSize = this.getRequest().getParameter("pageSize");
		String rid = this.getRequest().getParameter("rid");
		String oid = this.getRequest().getParameter("oid");
		String pname = this.getRequest().getParameter("pname");

		String query = "select distinct(p) from Person p left join p.orgs pio where 1=1 ";
		List<Object> values = new ArrayList<Object>();
		if(StringUtils.isNotBlank(oid)){
			query +=" and pio.id.org.id = ?"; 
			values.add(oid);
		}
		if(StringUtils.isNotBlank(rid)){
			query +=" and p not in ( select rp from Person rp left join rp.deps rd  where rd.id = ?  ) "; 
			values.add(rid);
		}
		if(StringUtils.isNotBlank(pname)){
			query +=" and p.name like ?"; 
			values.add("%" + pname + "%");
		}
		
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(pageSize);
		page.setQuery(query);
		page.setValues(values.toArray());
		this.personManager.findPage(page);
		ModelAndView mv = new ModelAndView("bdrp/org/dep/addPerson");
	//	mv.addObject("model" ,this.forView(id));
		mv.addObject("pageBean",page);
		
		this.getRequest().setAttribute("rid", rid);
		this.getRequest().setAttribute("oid", oid);
		this.getRequest().setAttribute("pname", pname);
		return mv;
	}
	//该部门关联用户
	@RequestMapping(value = "/linkedUsers" , method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result linkedUsers() {
		String start = this.getRequest().getParameter("start");
		String pageSize = this.getRequest().getParameter("pageSize");
		String rid = this.getRequest().getParameter("rid");
		String oid = this.getRequest().getParameter("oid");
		String pname = this.getRequest().getParameter("pname");
		
		String query = "select distinct(p) from Person p left join p.orgs pio where 1=1";
		List<String> values= new ArrayList<String>();
		if(StringUtils.isNotBlank(oid)){
			query +=" and pio.id.org.id = ?"; 
			values.add(oid);
		}
		if(StringUtils.isNotBlank(rid)){
			query +=" and p in ( select rp from Person rp left join rp.deps rd where rd.id = ? ) "; 
			values.add(rid);
		}
		if(StringUtils.isNotBlank(pname)){
			query +=" and p.name like ?"; 
			values.add("%" + pname + "%");
		}
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(pageSize);
		page.setQuery(query);
		page.setValues(values.toArray());
		this.personManager.findPage(page);
		
		return ResultUtils.renderSuccessResult(page);
	}
	//添加用户与部门关联
	@RequestMapping(value = "/saveLinkPerson", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result saveLinkPerson() {
		String rid = getRequest().getParameter("rid");
		String pids = getRequest().getParameter("pids");
		try {
			String sql = "insert into IH_DEPT_PER(DEP_ID,PER_ID) select '"+rid+"', p.id from IH_PERSON p where p.id in ("+ pids +")";
			//this.personManager.executeSql(sql, rid);
			this.personManager.executeSql(sql);
		} catch (Exception e) {
			throw new BaseException(e.getMessage());
		}
		
		return ResultUtils.renderSuccessResult("success");
	}
	//删除用户与职位关联
	@RequestMapping(value = "/deleteLinkPerson", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result deleteLinkPerson() {
		String rid = getRequest().getParameter("rid");
		String pids = getRequest().getParameter("pids");
		try {
			String sql = "delete from IH_DEPT_PER where DEP_ID = '"+rid+"' and PER_ID in ("+ pids + ")";
			this.personManager.executeSql(sql);
		} catch (Exception e) {
			throw new BaseException(e.getMessage());
		}
		
		return ResultUtils.renderSuccessResult("success");
	}
}   
