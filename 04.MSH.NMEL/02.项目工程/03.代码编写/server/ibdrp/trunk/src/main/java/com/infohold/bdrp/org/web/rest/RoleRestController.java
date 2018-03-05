package com.infohold.bdrp.org.web.rest;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.alibaba.fastjson.JSONObject;
import com.infohold.bdrp.Constants;
import com.infohold.bdrp.org.model.Org;
import com.infohold.bdrp.org.model.Person;
import com.infohold.bdrp.org.model.Role;
import com.infohold.core.dao.Page;
import com.infohold.core.exception.BaseException;
import com.infohold.core.manager.GenericManager;
import com.infohold.core.utils.JSONUtils;
import com.infohold.core.utils.StringUtils;
import com.infohold.core.web.MediaTypes;
import com.infohold.core.web.rest.BaseRestController;
import com.infohold.core.web.utils.Result;
import com.infohold.core.web.utils.ResultUtils;
import com.infohold.core.web.utils.SuccessResult;

@RestController
@RequestMapping("/bdrp/org/role")
public class RoleRestController extends BaseRestController {
	
	@Autowired
	GenericManager<Role, String> roleManager;
	
	@RequestMapping(value = "/main")
	public ModelAndView forMain() {
		ModelAndView mv = new ModelAndView("bdrp/org/role/main");
		String orgId = this.getRequest().getParameter("orgId");
		String orgName = this.getRequest().getParameter("orgName");
		mv.addObject("pageBean", forPage());
		mv.addObject("orgId", orgId);
		mv.addObject("orgName", orgName);
		return mv;
	}
	
	@RequestMapping(value = "/page" , method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Page forPage() {
		
		Page page;
		try {
			String start = this.getRequest().getParameter("start");
			String pageSize = this.getRequest().getParameter("pageSize");
			String orgId = this.getRequest().getParameter("orgId");
			String memo = getRequest().getParameter("memo");
			String name = getRequest().getParameter("name");	
			
			String query = "from Role where 1=1 ";
			List<Object> values= new ArrayList<Object>();

			if(StringUtils.isEmpty(orgId)){
				orgId = this.getOrgId();			
			}
			query += "and orgId = ? ";
			values.add(orgId);
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
	
	@RequestMapping(value = "/page/{start}/{pageSize}" , method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forPage(@PathVariable("start") int start,@PathVariable("pageSize") int pageSize ,@RequestParam(value = "data", defaultValue = "") String data) {
		
		Page page;
		try {
			
			String orgId = Constants.APP_SUPER_ID;
			
			JSONObject params = JSONUtils.parseObject(data);
			String query = "from Role where 1=1 ";
			List<Object> values= new ArrayList<Object>();
			if(null != params){
				String memo = params.get("memo").toString();
				String name = params.get("name").toString();	
				if(null != params.get("orgId") ){
					orgId = params.get("orgId").toString();
				}else{
					orgId = this.getOrgId();	
				}
				query += "and orgId = ? ";
				values.add(orgId);
				if (!StringUtils.isEmpty(name)) {
					query += "and name like ? ";
					values.add("%" + name + "%");
				}
				if (!StringUtils.isEmpty(memo)) {
					query += "and descp like ? ";
					values.add("%" + memo + "%");
				}
				query +="order by id desc";
			}
			
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
		return ResultUtils.renderSuccessResult(page);
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
		try {
			if(StringUtils.isEmpty(model.getOrgId())){
				model.setOrgId(this.getOrgId());
			}

			String validHql = "from Role where name = ? and orgId = ?";
			List<Role> lst = this.roleManager.find(validHql, model.getName(), model.getOrgId());
			if (lst.size() > 0) {
				throw new BaseException("该名称已存在,请重新填写!");
			}
		
			model = this.roleManager.save(model);
		} catch (Exception e) {
			log.error(e);
			throw new BaseException(e.getMessage());
		}
		/*String validHql = "from Role where name = ? and id != ? ";
		List<Role> lst = this.roleManager.find(validHql,
				model.getName(), model.getId());
		if (lst.size() > 0) {
			throw new BaseException("该名称已存在,请重新填写!");
		}*/
		model = this.roleManager.save(model);
		return ResultUtils.renderSuccessResult(model);
	}
	
	@RequestMapping(value = "/exist" , method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forExist() {
    	String name = getRequest().getParameter("name");
    	String id = getRequest().getParameter("id");
    	String orgId = getRequest().getParameter("orgId");
		try {
			String query = "from Role where 1=1 ";
			List<Object> values = new ArrayList<Object>();
			
			if(StringUtils.isEmpty(orgId)){
				orgId = this.getOrgId();
			}
			
			query += "and orgId = ? ";
			values.add(orgId);
			
			if(StringUtils.isNotEmpty(id)){
				query += "and id != ? and name = ? ";
				values.add(id);
				values.add(name);
			}else{
				query += "and name = ? ";
				values.add(name);
			}
			Result result  = new SuccessResult();
			List<Role> lst =  this.roleManager.find(query, values.toArray());
			if(null != lst && lst.size()>0){
				result = ResultUtils.renderFailureResult("exist");
			}
			return result;
	    
		} catch (Exception e) {
			log.info("delete error:" + e.getMessage());
			throw new BaseException(e.getMessage());
		}
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
		try {
			this.roleManager.delete(id);
		} catch (Exception e) {
			log.info("delete error:" + e.getMessage());
			throw new BaseException(e.getMessage());
		}
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
		try {
			String sql = "delete from IH_BASE_ROLE where id in (" + id + ")";
			this.roleManager.executeSql(sql);
		} catch (Exception e) {
			throw new BaseException(e.getMessage());
		}
		return ResultUtils.renderSuccessResult();
	}

	@RequestMapping(value="/{id}",method=RequestMethod.PUT,produces = MediaTypes.JSON_UTF_8)
	public Result forUpdate(@PathVariable("id") String id,@ModelAttribute Role model){    
		if(id != model.getId()){
			throw new BaseException("输入参数不符合调用需求");
		}
		
		String validHql = "from Role where name = ? and id != ? and orgId = ?";
		List<Role> lst = this.roleManager.find(validHql, model.getName(), model.getId(),model.getOrgId());
		if (lst.size() > 0) {
			throw new BaseException("该名称已存在,请重新填写!");
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
		ModelAndView mv = new ModelAndView("bdrp/org/role/edit");
		mv.addObject("model" ,this.forView(id).getResult());
		return mv;
	}
	/**
	 * 获取该机构中所有未关联的人员
	 * 
	 * @return
	 * @throws IOException
	 */
	@RequestMapping(value="/user/unlinked",method=RequestMethod.GET,produces = MediaTypes.JSON_UTF_8)
	public ModelAndView forToLinkUserList() {
		String start =this.getRequest().getParameter("start");
		String limit =this.getRequest().getParameter("limit");
		String rId = this.getRequest().getParameter("rid");
		String orgId = this.getRequest().getParameter("orgId");
		String pname = getRequest().getParameter("pname");
		List<String> values = new ArrayList<String>();
		String jql = "select distinct(p) from Person p,Org o where p.ownerOrg = o.id and o.id = ? and  p not in ( select rp.person from PersonRole rp  where rp.role.id = ? ) ";
		if(StringUtils.isEmpty(orgId)){
			jql = "select distinct(p) from Person p Org o where p.ownerOrg = o.id and o.id is null and  p not in ( select rp.person from PersonRole rp  where rp.role.id = ? ) ";
		}else{
			values.add(orgId);
		}
		Page page = new Page();
		values.add(rId);
		if (!StringUtils.isEmpty(pname)) {
			jql += "and p.name like ? ";
			values.add("%" + pname + "%");
		}else{
			pname="";
		}
		page.setValues(values.toArray());
		page.setPageSize(limit);
		page.setStart(start);
		page.setQuery(jql);

		ModelAndView mv = new ModelAndView("bdrp/org/role/list");
		try {
			this.roleManager.findPage(page);
		} catch (Exception e) {
			e.printStackTrace();
			throw new BaseException(e.getMessage());
		}
		mv.addObject("pageBean", page);
		return mv;
	}
	
	/**
	 * 将用户与角色关联
	 * @return
	 * @throws IOException
	 */
	@RequestMapping(value="/user/link",method=RequestMethod.POST,produces = MediaTypes.JSON_UTF_8)
	public Result forPubLinkToUser() {
		String uIds = getRequest().getParameter("uIds");
		String rId = getRequest().getParameter("rId");
		String pid=uIds.substring(0, uIds.length()-1);
		try {
			String sql = "insert into IH_PERSON_ROLE(RID,PID) select ?,p.id from IH_PERSON p where p.id in ("
					+ pid + ")";
			this.roleManager.executeSql(sql, rId);
		} catch (Exception e) {
			throw new BaseException(e.getMessage());
		}
		return ResultUtils.renderSuccessResult();
	}
	
	
	/**
	 * 获取该角色中已关联的用户
	 * @return
	 * @throws IOException
	 */
	@RequestMapping(value="/{id}/users",method=RequestMethod.GET,produces = MediaTypes.JSON_UTF_8)
	public Result forLinkedUserList(@PathVariable String id) {
		try {
			//Role role = this.roleManager.get(id);
			//String rId = getRequest().getParameter("id");
			String jql = "select rp.person from PersonRole rp  where rp.role.id = ? ";//left join rp.person p
			//String jql = "select p from Role p ";
			Page page = new Page();
			List<String> values = new ArrayList<String>();
			values.add(id);
			
			page.setValues(values.toArray());
			page.setPageSize(getRequest().getParameter("limit"));
			page.setStart(getRequest().getParameter("start"));
			page.setQuery(jql);
			
			this.roleManager.findPage(page);
			List<Person> ps = new ArrayList<Person>();
			@SuppressWarnings("unchecked")
			List<Object> results= (List<Object>)page.getResult();
			if( null!=results){
				for(Object result : results){
					Person p = cloneSimplePerson((Person)result);
					ps.add(p);
				}
			}
			page.setResult(ps);
			return ResultUtils.renderPageResult(page);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}
	/**
	 * 获取该角色中已关联的用户
	 * @return
	 * @throws IOException
	 */
	@RequestMapping(value="/user/remove",method=RequestMethod.DELETE,produces = MediaTypes.JSON_UTF_8)
	public Result removeLinkedUser() {
		try {
			String rid= getRequest().getParameter("rid");
			String pid= getRequest().getParameter("pid");
			
			String jql="delete from IH_PERSON_ROLE where RID=? and PID=? ";
			this.roleManager.executeSql(jql, rid,pid);
			
			return ResultUtils.renderSuccessResult();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}
	
	/**
	 * 批量删除角色关联的用户.
	 * 
	 * @return success
	 */
	@RequestMapping(value="/users/remove",method=RequestMethod.POST,produces = MediaTypes.JSON_UTF_8)
	public Result removeLinkedUsers() {
		String ids = getRequest().getParameter("ids");
		String id = ids.substring(0, ids.length()-1);
		String rId = getRequest().getParameter("rId");
		try {
			String sql = "delete from IH_PERSON_ROLE where RID = ? and PID in (" + id + ")";
			this.roleManager.executeSql(sql, rId);
		} catch (Exception e) {
			throw new BaseException(e.getMessage());
		}
		return ResultUtils.renderSuccessResult();
	}
	
	/**
	 * 解除角色与用户的关联
	 * @return
	 * @throws IOException
	 */
	public String forDivestUserPub() {
		String result = "success";
		String uIds = getRequest().getParameter("uIds");
		String rId = getRequest().getParameter("rId");

		try {
			String sql = "delete from IH_PERSON_ROLE where RID = ? and PID in ("
					+ uIds + ")";
			this.roleManager.executeSql(sql, rId);
		} catch (Exception e) {
			throw new BaseException(e.getMessage());
		}
		return result;
	}
	/**
	 * 从session中获取机构ID
	 * @return
	 */
	public String getOrgId(){
		Org org =  (Org)getSession().getAttribute(Constants.ORG_KEY);
		if(null != org && StringUtils.isNotBlank(org.getId())){
			return org.getId();
		}
		return null;
	}
	
	/**
	 * 从session中获取用户机构信息
	 * @return
	 */
//	public Org getOrgInfo(){
//		return (Org)getSession().getAttribute(Constants.ORG_KEY);
//	}
	private Person cloneSimplePerson(Person p) {
		Person person = new Person();
		person.setId(p.getId());
		person.setPinyin(p.getPinyin());
		person.setUserCode(p.getUserCode());
		person.setProvince(p.getProvince());
		person.setEffectDate(p.getEffectDate());
		person.setMobile(p.getMobile());
		person.setIdNo(p.getIdNo());
		person.setAddress(p.getAddress());
		person.setMobile1(p.getMobile1());
		person.setPhone(p.getPhone());
		person.setShortName(p.getShortName());
		person.setEnName(p.getEnName());
		person.setVisaAddress(p.getVisaAddress());
		person.setExpirDate(p.getExpirDate());
		person.setUpDate(p.getUpDate());
		person.setPhone1(p.getPhone1());
		person.setStatus(p.getStatus());
		person.setCity(p.getCity());
		person.setVisaDate(p.getVisaDate());
		person.setZip(p.getZip());
		person.setCustCode(p.getCustCode());
		person.setIdType(p.getIdType());
		person.setName(p.getName());
		person.setGender(p.getGender());
		person.setFolk(p.getFolk());
		person.setEduLevel(p.getEduLevel());
		person.setMarrStatus(p.getMarrStatus());
		person.setHomePlace(p.getHomePlace());
		person.setBornDate(p.getBornDate());
		person.setMail(p.getMail());
		person.setLoginId(p.getLoginId());
		person.setOwnerOrg(p.getOwnerOrg());
		person.setUsername(p.getUsername());
		person.setPassword(p.getPassword());
		person.setActive(p.getActive());
		person.setExpired(p.getExpired());
		person.setType(p.getType());
		return person;
	}
}
