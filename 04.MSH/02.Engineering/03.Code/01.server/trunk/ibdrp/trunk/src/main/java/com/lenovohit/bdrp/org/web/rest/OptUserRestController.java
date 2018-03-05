package com.lenovohit.bdrp.org.web.rest;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.script.Invocable;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.lenovohit.bdrp.Constants;
import com.lenovohit.bdrp.authority.model.AuthUser;
import com.lenovohit.bdrp.org.manager.PrivilegeManager;
import com.lenovohit.bdrp.org.model.Dep;
import com.lenovohit.bdrp.org.model.OptUser;
import com.lenovohit.bdrp.org.model.Org;
import com.lenovohit.bdrp.org.model.Person;
import com.lenovohit.bdrp.org.model.Post;
import com.lenovohit.bdrp.tools.security.SecurityUtil;
import com.lenovohit.bdrp.tools.security.impl.SecurityConstants;
import com.lenovohit.core.dao.Page;
import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.BeanUtils;
import com.lenovohit.core.utils.DateUtils;
import com.lenovohit.core.utils.FileUtils;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.rest.BaseRestController;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.core.web.utils.SuccessResult;



@RestController
@RequestMapping("/bdrp/org/optuser")
public class OptUserRestController extends BaseRestController{

	@Autowired
	GenericManager<OptUser, String> optUserManager;
	@Autowired
	GenericManager<Person, String> personManager;
	@Autowired
	GenericManager<Org, String> orgManager;
	@Autowired
	GenericManager<Dep, String> depManager;
	@Autowired
	GenericManager<Post, String> postManager;

	@Autowired
	PrivilegeManager privilegeManager;
	
	/**    
	 * 主页面
	 * @return
	 */
	@RequestMapping(value = "/main")
	public ModelAndView forMain() {
		String oid = this.getRequest().getParameter("oid");
		ModelAndView mv = new ModelAndView("bdrp/org/optuser/optUserList");
		this.getRequest().setAttribute("oid", oid);
		return mv;
	}

	@RequestMapping(value = "/page" , method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Page forPage() {
		String start = this.getRequest().getParameter("start");
		String pageSize = this.getRequest().getParameter("pageSize");
		String method = this.getRequest().getParameter("method");
		String context = this.getRequest().getParameter("context");
		String oid = this.getRequest().getParameter("oid");

		String query = "select distinct(p) from OptUser p left join p.orgs pio where 1=1 ";
		List<Object> values= new ArrayList<Object>();

		if (StringUtils.isNotEmpty(oid)) {
			query = " and pio.id.org.id = ?";
			values.add(oid);
		}

		if (StringUtils.isNotEmpty(method)) {
			query += " and p." + method + " like ? ";
			values.add("%" + context + "%");
		}

		Page page = new Page();
		page.setStart(start);
		page.setPageSize(pageSize);
		page.setQuery(query);
		page.setValues(values.toArray());

		this.personManager.findPage(page);
		this.getRequest().setAttribute("pageBean", page);
		return page;
	}

	@RequestMapping(value = "/tree" , method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public List<Person> forTree() {
		String method = this.getRequest().getParameter("method");
		String context = this.getRequest().getParameter("context");
		String oid = getRequest().getParameter("oid");

		String query = "select distinct(p) from OptUser p left join p.orgs pio where 1=1 ";
		List<Object> values= new ArrayList<Object>();

		if (StringUtils.isNotEmpty(oid)) {
			query = " and pio.id.org.id = ?";
			values.add(oid);
		}

		if (StringUtils.isNotEmpty(method)) {
			query += "and p." + method + " like ? ";
			values.add("%" + context + "%");
		}

		List<Person> lst =  this.personManager.find(query, values.toArray());

		return lst;
	}


	@RequestMapping(value = "/exist" , method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forExist() {
		String id = this.getRequest().getParameter("id");
		String name = this.getRequest().getParameter("name");
		String oid = this.getRequest().getParameter("oid");


		String query = "select distinct(p) from OptUser p left join p.orgs pio where 1=1 ";
		List<Object> values= new ArrayList<Object>();

		if (StringUtils.isNotEmpty(oid)) {
			query = " and pio.id.org.id = ?";
			values.add(oid);
		}
		if(StringUtils.isNotEmpty(id)){
			query += "and p.id != ? and p.name = ? ";
			values.add(id);
			values.add(name);
		}else{
			query += "and p.name = ? ";
			values.add(name);
		}
		Result result  = new SuccessResult();
		List<Person> lst =  this.personManager.find(query, values.toArray());
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
	 * @return OptUser
	 * @throws BaseException
	 */
	@RequestMapping(value = "/get/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public OptUser forView(@PathVariable("id") String id) {
		OptUser optUser;
		try {
			optUser = this.optUserManager.get(id);
			String orgId = optUser.getOrgId();
			String sql = "from Org where id=?";
			List<Org> list = this.orgManager.find(sql, orgId);
		    Org name = list.get(0);
		    optUser.setOrg(name);
		} catch (Exception e) {
			e.printStackTrace();
			throw new BaseException("该人员不存在");
		}
		return optUser;
	}

	/**
	 * 返回全部对象--查询
	 * <p>Title: forList</p>
	 * <p>Description: </p>
	 * @param 
	 * @return List<OptUser>
	 * @throws BaseException
	 */
	@RequestMapping(value = "/list",method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public List<Person> forList() {
		List<Person> list = personManager.findAll();
		return list;
	}

	/**
	 * 新增该操作人员
	 * <p>Title: forSave</p>
	 * <p>Description: </p>
	 * @param Person person
	 * @return Person
	 * @throws BaseException
	 */
	@RequestMapping(value = "/create", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forCreate(@ModelAttribute OptUser optUser) {
		//String orgId = getRequest().getParameter("org.id");
		//String orgName = getRequest().getParameter("org.name");
		optUser.setCreateAt(DateUtils.getCurrentDateTimeStr());
		//状态初始
//		optUser.setState("1");
		
		//新建默认密码加密
		/*optUser.setPassword("0");
		String password = stringMD5(optUser.getPassword());
		optUser.setPassword(password);*/
		
		//用户名判重
		String username = optUser.getUsername();
		String jql = " from OptUser where username = ? and orgId = ?  ";
		List<OptUser> vldLst = this.optUserManager.find(jql, username, optUser.getOrg());
		if (vldLst.size()==0) {
			Person p = new Person();
			BeanUtils.copyProperties(optUser, p);
			p.setId(null);
			p.setOwnerOrg(optUser.getOrgId());
			p.setPassword("");
			p = this.personManager.save(p);
			optUser.setId(p.getId());
			optUser.setPersonId(p.getId());
			optUser = optUserManager.save(optUser);
			
			String updSql = "UPDATE IH_USER SET PASSWROD = ?  WHERE ID =  ? ";
			Map<String, String> params = new HashMap<String, String>();
			String random = SecurityUtil.genRandom(16);
			params.put(SecurityConstants.PARAM_KEY_LONIN_RANDOM, random);
			
			ScriptEngineManager sem = new ScriptEngineManager();
			ScriptEngine se = sem.getEngineByName("javascript");
			try {
				PathMatchingResourcePatternResolver patternResolver = new PathMatchingResourcePatternResolver();
				Resource[] resources = patternResolver.getResources("classpath*:security.js");
				String rsa = FileUtils.readStreamToString(resources[0].getInputStream(), FileUtils.FILE_CHARSET_UTF8);
				rsa += ";var random = '" + random.trim() + "';";
				rsa += "var modulus='" + SecurityConstants.KEY_PUBLIC_MODULUS1.trim() + "', exponent='"
						+ SecurityConstants.KEY_PUBLIC_EXPONENT1.trim() + "';";
				rsa += "var modulus2='" + SecurityConstants.KEY_PUBLIC_MODULUS2.trim() + "', exponent2='"
						+ SecurityConstants.KEY_PUBLIC_EXPONENT1.trim() + "';";
				rsa += "var plained='" + Constants.APP_USER_DEFAULT_PASSWORD + "';";
				rsa += "function clientEncPswd() {return RSAUtils.encryptedPassword(random,plained,modulus, exponent);}";

				se.eval(rsa);
				Invocable invocableEngine = (Invocable) se;
				String clientPswd = (String) invocableEngine.invokeFunction("clientEncPswd");
				log.info("用户:【" + optUser.getId() + "】随机数：【" + random + "】,输入密码：【" + Constants.APP_USER_DEFAULT_PASSWORD + "】,加密后：【" + clientPswd + "】");
			
				String psswdEnc = SecurityUtil.encryptPin(SecurityConstants.PIN_TYPE_LOGIN, optUser.getId(), clientPswd, params);
				this.optUserManager.executeSql(updSql, psswdEnc, optUser.getId() );
				
			} catch (IOException e) {
				e.printStackTrace();
			} catch (ScriptException e) {
				e.printStackTrace();
			} catch (NoSuchMethodException e) {
				e.printStackTrace();
			}
			
		}else {
			return ResultUtils.renderFailureResult("用户名重复，请重新输入！");
		}
		return ResultUtils.renderSuccessResult(optUser);
	}
	/**
	 * 机构端新增操作人员
	 * <p>Title: forSave</p>
	 * <p>Description: </p>
	 * @param Person person
	 * @return Person
	 * @throws BaseException
	 */
	@RequestMapping(value = "/optuser/create", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forCreate(@RequestBody String data) {
		
		OptUser optUser = new OptUser();
		Map<String, String> m = new HashMap<String, String>();
		
		if(StringUtils.isEmpty(data)){
			throw new BaseException("未检测到数据！");
		}
		
		m = JSONUtils.deserialize(data, Map.class);

		String name = String.valueOf(m.get("name"));
		String username = String.valueOf(m.get("username"));
		String mobile = String.valueOf(m.get("mobile"));
		String orgId = String.valueOf(m.get("orgId"));
		String email = String.valueOf(m.get("email"));
		String otherContactWay = String.valueOf(m.get("otherContactWay"));
		

		if (StringUtils.isEmpty(name))
			throw new BaseException("请输入姓名！");
		if (StringUtils.isEmpty(username))
			throw new BaseException("请输入用户名！");
		if (StringUtils.isEmpty(mobile))
			throw new BaseException("请输入联系电话！");
		
		Date date = new Date();
		String dateStr = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss").format(date);
		optUser.setCreateAt(dateStr);
		//状态初始
		optUser.setState("1");
		
		optUser.setOrgId(orgId);
		optUser.setName(name);
		optUser.setUsername(username);
		optUser.setMobile(mobile);
		optUser.setEmail(email);
		optUser.setOtherContactWay(otherContactWay);
		
		Org o = (Org) this.getSession().getAttribute(Constants.ORG_KEY);
		optUser.setOrgId(o.getId());
		
		try {
			Person p = new Person();
			BeanUtils.copyProperties(optUser, p);
			p.setId(null);
			p.setOwnerOrg(optUser.getOrgId());
			p.setPassword("");
			p = this.personManager.save(p);
			optUser.setPersonId(p.getId());
			optUser = optUserManager.save(optUser);
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		log.info(optUser);
		
		return ResultUtils.renderSuccessResult(optUser);
	}

	/**
	 * 机构端修改操作人员
	 * <p>Title: forUpdate</p>
	 * <p>Description: </p>
	 * @param  OptUser person
	 * @return  OptUser person
	 * @throws BaseException
	 */
	@RequestMapping(value = "/optuser/update", method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdate(@RequestBody String data) {
		
		//判断是否存在更新数据
		if(StringUtils.isEmpty(data)){
			throw new BaseException("未检测到更新数据！");
		}
		
		OptUser optUser = JSONUtils.deserialize(data, OptUser.class);
		
		if(null == optUser){
			throw new BaseException("更新数据存在错误！");
		}
		
		try {
			
			optUser = optUserManager.save(optUser);
			
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return ResultUtils.renderSuccessResult(optUser);
	}
	
	/**
	 * 修改(查询和保存更新)
	 * <p>Title: forUpdate</p>
	 * <p>Description: </p>
	 * @param  OptUser person
	 * @return  OptUser person
	 * @throws BaseException
	 */
	@RequestMapping(value = "/edit/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public ModelAndView forEdit(@PathVariable("id") String id) {
		ModelAndView mv = new ModelAndView("bdrp/org/optuser/editOptUser");
		mv.addObject("model" ,this.forView(id));
		mv.addObject("orgId" ,getRequest().getParameter("orgId"));
		mv.addObject("orgName" ,getRequest().getParameter("orgName"));
		return mv;
	}
	
	@RequestMapping(value = "/update", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdate(@ModelAttribute OptUser optUser) {
		optUserManager.save(optUser);
		return ResultUtils.renderSuccessResult(optUser);
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
			OptUser optUser =this.optUserManager.get(id);
			if(null != optUser){
				if(null != this.personManager){
					this.personManager.delete(optUser.getPersonId());
				}
				this.optUserManager.delete(id);
			}
			
		} catch (Exception e) {
			e.printStackTrace();
			throw new BaseException("该人员删除失败");
		}
		return ResultUtils.renderSuccessResult();
	}
	
	/**
	 * 密码重置  
	 * <p>Title: forDelete</p>
	 * <p>Description: </p>
	 * @param String id
	 * @return 
	 * @throws BaseException
	 */
	@RequestMapping(value = "/optuser/{id}",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forResetPassword(@PathVariable("id") String id){
		try {
			OptUser optUser =this.optUserManager.get(id);
			optUser.setPassword("1");
			this.optUserManager.save(optUser);
		} catch (Exception e) {
			e.printStackTrace();
			throw new BaseException("重置密码失败！");
		}
		return ResultUtils.renderSuccessResult();
	}
	
	/**
	 * 返回分页
	 * <p>Title: getPage</p>
	 * <p>Description: </p>
	 * @param   String start,String limit
	 * @return List<OptUser>
	 * @throws BaseException
	 */
	@RequestMapping(value = "/list/{start}/{pageSize}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@PathVariable("start") String start, @PathVariable("pageSize") String pageSize,@RequestParam(value="data",defaultValue="") String data ){
		String name = getRequest().getParameter("context");
		String orgId = getRequest().getParameter("orgId");
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(pageSize);
		
		String jql = "from OptUser where 1=1 ";
		List<String> values = new ArrayList<String>();
		
		jql += "and orgId = ? ";
		if(StringUtils.isEmpty(orgId)){
			Org o = (Org)this.getSession().getAttribute(Constants.ORG_KEY);
			orgId = o.getId();
		}
		values.add(orgId);
		if(name != null){
			jql += "and name like ? ";
			values.add("%"+name+"%");
		}
		page.setQuery(jql);
		page.setValues(values.toArray());
		
		personManager.findPage(page);

		return ResultUtils.renderSuccessResult(page);
	}

	/**
	 * 获取机构列表
	 * 
	 * @return
	 * @throws IOException
	 */
	@RequestMapping(value="/optuser/unlinked",method=RequestMethod.GET,produces = MediaTypes.JSON_UTF_8)
	public ModelAndView forToLinkUserList() {
		String start =this.getRequest().getParameter("start");
		String limit =this.getRequest().getParameter("limit");
		String pname = getRequest().getParameter("pname");
		List<String> values = new ArrayList<String>();
		String jql = "from Org where 1=1 ";
		Page page = new Page();
		if (!StringUtils.isEmpty(pname)) {
			jql += "and name like ? ";
			values.add("%" + pname + "%");
		}else{
			pname="";
		}
		page.setValues(values.toArray());
		page.setPageSize(limit);
		page.setStart(start);
		page.setQuery(jql);

		ModelAndView mv = new ModelAndView("bdrp/org/optuser/list");
		try {
			this.optUserManager.findPage(page);
		} catch (Exception e) {
			e.printStackTrace();
			throw new BaseException(e.getMessage());
		}
		mv.addObject("pageBean", page);
		return mv;
	}
	
	/**
	 * 获取功能列表
	 * 
	 * @return
	 */
	@RequestMapping(value = "/optuser/list" , method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forOrgList() {
		//String method = getRequest().getParameter("method");
		//String context = getRequest().getParameter("context");
		String jql = "from Org where 1=1 ";

		Page page = new Page();
		List<String> values = new ArrayList<String>();
		/*if (!StringUtils.isEmpty(method)) {
			jql += "and " + method + " like ? ";
			values.add("%" + context + "%");
		}*/
		page.setValues(values.toArray());
		page.setPageSize(getRequest().getParameter("limit"));
		page.setStart(getRequest().getParameter("start"));
		page.setQuery(jql+" order by name desc ");
		this.optUserManager.findPage(page);
		
		return ResultUtils.renderPageResult(page);
	}
	
	/**
	 * 获取可用菜单
	 * @return
	 */
	@RequestMapping(value = "/privileges", method = RequestMethod.GET)
	public String forPrivilege(){
		OptUser user =  (OptUser) this.getSession().getAttribute(Constants.USER_KEY);
		String privilegs = this.privilegeManager.getPrivileges(user.getPersonId());
//		String privilegs = this.privilegeManager.getPrivileges(Constants.APP_SUPER_ID);
		
		return privilegs;
	}
	
	/**
	 * 获取可用菜单
	 * @return
	 */
	@RequestMapping(value = "/privileges/info", method = RequestMethod.GET)
	public String forPrivilegeInfo(){
		OptUser user =  (OptUser) this.getSession().getAttribute(Constants.USER_KEY);
		Org org = (Org)this.getSession().getAttribute(Constants.ORG_KEY);
		String userInfo = JSONUtils.serialize(user);
		String orgInfo = JSONUtils.serialize(org);
		StringBuilder result = new StringBuilder("{");
		String privilegs = this.privilegeManager.getPrivileges(user.getPersonId());
//		String privilegs = this.privilegeManager.getPrivileges(Constants.APP_SUPER_ID);
		result.append("user:").append(userInfo).append(",");
		result.append("org:").append(orgInfo).append(",");
		result.append("menus:").append(privilegs);
		result.append("}");
		return privilegs;
	}
}
