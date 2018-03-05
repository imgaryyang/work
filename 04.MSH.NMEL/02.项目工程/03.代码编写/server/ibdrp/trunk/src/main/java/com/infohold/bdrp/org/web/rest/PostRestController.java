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

import com.infohold.bdrp.org.model.Person;
import com.infohold.bdrp.org.model.Post;
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
@RequestMapping("/bdrp/org/post")
public class PostRestController extends BaseRestController{
	
	
	@Autowired
	private GenericManager<Post, String> postManager;//泛型的manager
	@Autowired
	GenericManager<Person, String> personManager;
	
	@RequestMapping(value = "/main")
	public ModelAndView forMain() {
		ModelAndView mv = new ModelAndView("bdrp/org/post/postMgr");
		return mv;
	}
	
	@RequestMapping(value = "/page" , method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Page forPage() {
		String start = this.getRequest().getParameter("start");
		String pageSize = this.getRequest().getParameter("pageSize");
		String oid = this.getRequest().getParameter("oid");
		String name = this.getRequest().getParameter("name");
		String parentId = this.getRequest().getParameter("parentId");
		
		String query = "from Post where 1=1 ";
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
		
		this.postManager.findPage(page);
		
		return page;
	}
	
	@RequestMapping(value = "/tree" , method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public List<Post> forTree() {
		String method = this.getRequest().getParameter("method");
		String context = this.getRequest().getParameter("context");
		String parentId = this.getRequest().getParameter("parentId");
		String orgId = this.getRequest().getParameter("oid");
		
		String query = "from Post where 1=1 ";
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
		
		List<Post> lst =  this.postManager.find(query, values.toArray());
		return lst;
	}
	
	
	@RequestMapping(value = "/exist" , method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forExist() {
		String id = this.getRequest().getParameter("id");
		String oid = this.getRequest().getParameter("oid");
		String name = this.getRequest().getParameter("name");
		
		String query = "from Post where 1=1 ";
		List<Object> values = new ArrayList<Object>();
		if(StringUtils.isNotEmpty(oid)){
			query += "and org.id = ? ";
			values.add(oid);
		}
		if(StringUtils.isNotEmpty(id)){
			query += "and id != ? and name = ? ";
			values.add(id);
			values.add(name);
		}else{
			query += "and name = ? ";
			values.add(name);
		}
		Result result  = new SuccessResult();
		List<Post> lst =  this.postManager.find(query, values.toArray());
		if(null != lst && lst.size()>0){
			result = ResultUtils.renderFailureResult("exist");
		}
		return result;
	}
	
	/**
	 * 返回单个 对象--查询
	 * <p>Title: forView</p>
	 * <p>Description: </p>
	 * @param String id
	 * @return Post
	 * @throws BaseException
	 */
	@RequestMapping(value = "/get/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Post forView(@PathVariable("id") String id) {
		Post post;
		try {
			post = this.postManager.get(id);
		} catch (Exception e) {
			throw new BaseException("部门不存在");
		}
		return post;
	}
	
	/**
	 * 返回全部对象--查询
	 * <p>Title: forList</p>
	 * <p>Description: </p>
	 * @param 
	 * @return List<Post>
	 * @throws BaseException
	 */
	@RequestMapping(value = "/list",method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public List<Post> forList() {
		List<Post> list = postManager.findAll();
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
	@RequestMapping(value = "/findList", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public List<Post> forFindList() {
		String method = this.getRequest().getParameter("method");
		String context = this.getRequest().getParameter("context");
		String parentId = this.getRequest().getParameter("parentId");
		String orgId = getRequest().getParameter("oid");
		
		String query = "from Post where 1=1 ";
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
		
		List<Post> lst =  this.postManager.find(query, values.toArray());
		return lst;
	}
	/**
	 * 新增部门
	 * <p>Title: forSave</p>
	 * <p>Description: </p>
	 * @param Post post
	 * @return Post
	 * @throws BaseException
	 */
	@RequestMapping(value = "/create", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forSave(@ModelAttribute Post post) {

		if(post.getOrg() != null){
			if(StringUtils.isEmpty(post.getOrg().getId())
					|| StringUtils.equals("undefined", post.getOrg().getId())){
				post.setOrg(null);
			}
		}
		if (post.getParent() != null) {
			if (StringUtils.isEmpty(post.getParent().getId())
					|| StringUtils.equals("undefined",post.getParent().getId())) {
				post.setParent(null);
			}
		}
		
		post = this.postManager.save(post);
		return ResultUtils.renderSuccessResult(post);
	}
	
	@RequestMapping(value = "/edit/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public ModelAndView forEdit(@PathVariable("id") String id) {
		ModelAndView mv = new ModelAndView("bdrp/org/post/editPost");
		mv.addObject("model" ,this.forView(id));
		return mv;
	}
	/**
	 * 修改
	 * <p>Title: forUpdate</p>
	 * <p>Description: </p>
	 * @param  Post post
	 * @return  Post post
	 * @throws BaseException
	 */
	@RequestMapping(value = "/update", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdate(@ModelAttribute Post model) {
		if(model==null || StringUtils.isBlank(model.getId())){
			return ResultUtils.renderFailureResult();
		} else {
			Post post = this.postManager.get(model.getId());
			model.setOrg(post.getOrg());
			model.setPersons(post.getPersons());
			model.setChildren(post.getChildren());
		}
		model = this.postManager.save(model);

		return ResultUtils.renderSuccessResult(model);
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
		this.postManager.delete(id);
		return ResultUtils.renderSuccessResult();
	}
	
	/**
	 * 返回分页
	 * <p>Title: getPage</p>
	 * <p>Description: </p>
	 * @param   String start,String limit
	 * @return List<Post>
	 * @throws BaseException
	 */
	@RequestMapping(value = "/get/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public List<Post> getPage(@PathVariable("start") String start, @PathVariable("limit") String limit){
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery("from Post where 1=1 order by name");
	//	page.setValues(new Object[] {"0"});
		postManager.findPage(page);
		@SuppressWarnings("unchecked")
		List<Post> list = (List<Post>) page.getResult();
		return list;
	}
	
	//查询该机构下用户
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
			query +=" and p not in ( select rp from Person rp left join rp.posts rs where rs.id = ? ) "; 
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
		ModelAndView mv = new ModelAndView("bdrp/org/post/addPerson");
	//	mv.addObject("model" ,this.forView(id));
		mv.addObject("pageBean", page);
		
		this.getRequest().setAttribute("rid", rid);
		this.getRequest().setAttribute("oid", oid);
		this.getRequest().setAttribute("pname", pname);
		return mv;
	}

	//该职位关联用户
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
			query +=" and p in ( select rp from Person rp left join rp.posts rs where rs.id = ? ) "; 
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
	//添加用户与职位关联
	@RequestMapping(value = "/saveLinkPerson", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result saveLinkPerson() {
		String pids = getRequest().getParameter("pids");
		String rid = getRequest().getParameter("rid");
		try {
			String sql = "insert into IH_PER_POST(PTID,PID) select '"+rid+"', p.id from IH_PERSON p where p.id in ("+ pids + ")";
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
		String pids = getRequest().getParameter("pids");
		String rid = getRequest().getParameter("rid");
		try {
			String sql = "delete from IH_PER_POST where PTID = '"+rid+"' and PID in ("+ pids + ")";
			this.personManager.executeSql(sql);
		} catch (Exception e) {
			throw new BaseException(e.getMessage());
		}
		
		return ResultUtils.renderSuccessResult("success");
	}
}
