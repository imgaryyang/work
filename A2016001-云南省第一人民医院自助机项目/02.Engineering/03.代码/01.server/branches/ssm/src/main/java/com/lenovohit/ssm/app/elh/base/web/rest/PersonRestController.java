package com.lenovohit.ssm.app.elh.base.web.rest;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.script.Invocable;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import com.lenovohit.bdrp.Constants;
import com.lenovohit.core.dao.Page;
import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.BeanUtils;
import com.lenovohit.core.utils.DateUtils;
import com.lenovohit.core.utils.FileUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.rest.BaseRestController;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.core.web.utils.SuccessResult;
import com.lenovohit.ssm.app.el.model.OptUser;
import com.lenovohit.ssm.app.elh.base.model.Dep;
import com.lenovohit.ssm.app.elh.base.model.Person;
import com.lenovohit.ssm.app.elh.base.model.PersonInOrg;
import com.lenovohit.ssm.app.elh.base.model.Post;
import com.lenovohit.ssm.base.model.Org;



@RestController
@RequestMapping("/hwe/app/person")
public class PersonRestController extends BaseRestController{
	
	@Autowired
	GenericManager<Person, String> personManager;
	@Autowired
	GenericManager<Org, String> orgManager;
	@Autowired
	GenericManager<PersonInOrg, String> personInOrgManager;
	@Autowired
	GenericManager<Dep, String> depManager;
	@Autowired
	GenericManager<Post, String> postManager;
	@Autowired
	GenericManager<OptUser, String> optUserManager;
	
	Person model;
	
	public Person getModel() {
		return model;
	}


	public void setModel(Person model) {
		this.model = model;
	}


	/**    
	 * 主页面
	 * @return
	 */
	@RequestMapping(value = "/main")
	public ModelAndView forMain() {
		ModelAndView mv = new ModelAndView("bdrp/org/person/personList");
		return mv;
	}
	
	@RequestMapping(value = "/page" , method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Page forPage() {
		
		String start = this.getRequest().getParameter("start");
		String pageSize = this.getRequest().getParameter("pageSize");
		String method = this.getRequest().getParameter("method");
		String context = this.getRequest().getParameter("context");
		String oid = this.getRequest().getParameter("oid");
		
		String query = "select distinct(p) from Person p left join p.orgs pio where 1=1 ";
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
	
	
	@RequestMapping(value = "/list/{start}/{pageSize}" , method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@PathVariable(value = "start") String start, @PathVariable(value = "pageSize") String pageSize,
			@RequestParam(value = "data", defaultValue = "") String data) {
		
		Page page = new Page();
		
			String method = this.getRequest().getParameter("method");
			String context = this.getRequest().getParameter("context");
			String oid = this.getRequest().getParameter("oid");
			
			String query = "from Person p where 1=1 ";
			List<Object> values= new ArrayList<Object>();

			if (StringUtils.isNotEmpty(oid)) {
				query = " and pio.id.org.id = ?";
				values.add(oid);
			}
			
			if (StringUtils.isNotEmpty(method)) {
				query += " and p." + method + " like ? ";
				values.add("%" + context + "%");
			}
			
			
			page.setStart(start);
			page.setPageSize(pageSize);
			page.setQuery(query);
			if(values.size()>0){
				page.setValues(values.toArray());
			}
		try {	
			this.personManager.findPage(page);
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
		}
//			this.getRequest().setAttribute("pageBean", page);
		
		
		return ResultUtils.renderSuccessResult(page);
	}
	
	@RequestMapping(value = "/tree" , method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public List<Person> forTree() {
		String method = this.getRequest().getParameter("method");
		String context = this.getRequest().getParameter("context");
		String oid = getRequest().getParameter("oid");
		
		String query = "select distinct(p) from Person p left join p.orgs pio where 1=1 ";
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
		
		
		String query = "select distinct(p) from Person p left join p.orgs pio where 1=1 ";
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
	
	@RequestMapping(value = "/edit/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public ModelAndView forEdit(@PathVariable("id") String id) {
		ModelAndView mv = new ModelAndView("bdrp/org/person/editPerson");
		mv.addObject("model" ,this.forView(id));
		return mv;
	}
	
	
	/**
	 * 返回单个 对象--查询
	 * <p>Title: forView</p>
	 * <p>Description: </p>
	 * @param String id
	 * @return Person
	 * @throws BaseException
	 */
	@RequestMapping(value = "/get/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Person forView(@PathVariable("id") String id) {
		Person person;
		try {
			person = this.personManager.get(id);
//			
//			String depHql = " select p.deps from Person p where p.id=? ";
//			List<Dep> deps = (List<Dep>)depManager.findByJql(depHql, new Object[] { id });
//			
//			String postHql = " select p.posts from Person p where p.id=? ";
//			List<Post> posts = (List<Post>)postManager.findByJql(postHql, new Object[] { id });
//			
//			String orgHql = "select pio.id.org from PersonInOrg pio where pio.id.person.id=? and pio.state = ?  ";
//			List<Org> orgs = this.orgManager.find(orgHql, new Object[] { person.getId(), "1" });
//			
//			person.setDep(deps.get(0));
//			person.setPost(posts.get(0));
//			person.setOrg(orgs.get(0));
		} catch (Exception e) {
			e.printStackTrace();
			throw new BaseException("该人员不存在");
		}
		return person;
	}
	
	
	/**
	 * 新增该人员
	 * <p>Title: forSave</p>
	 * <p>Description: </p>
	 * @param Person person
	 * @return Person
	 * @throws BaseException
	 */
	@RequestMapping(value = "/create", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Person forSave(@ModelAttribute Person person) throws Exception {
		String id = this.getRequest().getParameter("id");
		String orgId = this.getRequest().getParameter("oid.id");
		String depId = this.getRequest().getParameter("dep.id");
		String postId = this.getRequest().getParameter("post.id");
		orgId = "2c90a83a6010db41016010e3352a0000";
		depId = "2c90a83a6010db41016010e3a9870002";
		postId = "2c90a83a6010db41016010e37e6e0001";
		try {
			boolean isNew = StringUtils.isEmpty(id);
			if(StringUtils.isNotBlank(depId)){
				Dep dep = this.depManager.get(depId);
				person.addDeps(dep);
				person.setDep(dep);
			}
			if(StringUtils.isNotBlank(postId)){
				Post post = postManager.get(postId);
				person.addPosts(post);
				person.setPost(post);
			}
			if(StringUtils.isEmpty(id)){
				person.setId( StringUtils.uuid() );
			}
			
			person.setType("1");   // 是否去掉
			person.setUpDate(DateUtils.getCurrentDateStr());
			this.personManager.save(person);
			
			Org org = this.orgManager.get(orgId);
			PersonInOrg pio= new PersonInOrg(person,org);
			if(isNew) {
				pio.setEffon(DateUtils.getCurrentDateStr()+" 00:00:00");
				pio.setState(PersonInOrg.STATE_ON);
				this.personInOrgManager.save(pio);
			} else {
				String pioHql = "from PersonInOrg where id.person.id=? and id.org.id=? and state = ? ";
				List<PersonInOrg> pios = this.personInOrgManager.find(pioHql, new Object[] { person.getId(), org.getId(), PersonInOrg.STATE_ON });
				if (pios.size() == 0) {
					pio.setEffon(DateUtils.getCurrentDateStr()+" 00:00:00");
					pio.setState(PersonInOrg.STATE_ON);
					this.personInOrgManager.save(pio);
					//String upPioHql = "update PersonInOrg set state=?,offon=? where id.person.id= ? and id.org.id != ? and state=?";
					String upPioSql = "update IH_ORG_PER set state=?, offon=? where per_id=? and org_id!=? and state=? ";
					this.personInOrgManager.executeSql(upPioSql, new Object[] { "2", DateUtils.getCurrentDateStr()+" 00:00:00", person.getId(), org.getId(), "1" });
				}
			}
			
			OptUser optUser = new OptUser();
			BeanUtils.copyProperties(optUser, person);
			
			optUser.setId(person.getId());
			optUser.setPersonId(person.getId());
//			optUser = this.optUserManager.save(optUser);
			
			String updSql = "UPDATE IH_USER SET PASSWROD = ?  WHERE ID =  ? ";
			Map<String, String> params = new HashMap<String, String>();
			
			ScriptEngineManager sem = new ScriptEngineManager();
			ScriptEngine se = sem.getEngineByName("javascript");

//				PathMatchingResourcePatternResolver patternResolver = new PathMatchingResourcePatternResolver();
//				Resource[] resources = patternResolver.getResources("classpath*:security.js");
//				String rsa = FileUtils.readStreamToString(resources[0].getInputStream(), FileUtils.FILE_CHARSET_UTF8);
//				rsa += ";var random = '" + random.trim() + "';";
//				rsa += "var modulus='" + SecurityConstants.KEY_PUBLIC_MODULUS1.trim() + "', exponent='"
//						+ SecurityConstants.KEY_PUBLIC_EXPONENT1.trim() + "';";
//				rsa += "var modulus2='" + SecurityConstants.KEY_PUBLIC_MODULUS2.trim() + "', exponent2='"
//						+ SecurityConstants.KEY_PUBLIC_EXPONENT1.trim() + "';";
//				rsa += "var plained='" + Constants.APP_USER_DEFAULT_PASSWORD + "';";
//				rsa += "function clientEncPswd() {return RSAUtils.encryptedPassword(random,plained,modulus, exponent);}";
//
//				se.eval(rsa);
//				Invocable invocableEngine = (Invocable) se;
//				String clientPswd = (String) invocableEngine.invokeFunction("clientEncPswd");
//				log.info("用户:【" + optUser.getId() + "】随机数：【" + random + "】,输入密码：【" + Constants.APP_USER_DEFAULT_PASSWORD + "】,加密后：【" + clientPswd + "】");
//			
//				String psswdEnc = SecurityUtil.encryptPin(SecurityConstants.PIN_TYPE_LOGIN, optUser.getId(), clientPswd, params);
//				this.optUserManager.executeSql(updSql, psswdEnc, optUser.getId() );
		} catch (Exception e) {
			e.printStackTrace();
			throw new BaseException("该人员创建失败");
		}

		return person;
	}
	
	/**
	 * 修改
	 * <p>Title: forUpdate</p>
	 * <p>Description: </p>
	 * @param  Person person
	 * @return  Person person
	 * @throws BaseException
	 */
	@RequestMapping(value = "/update", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdate(@ModelAttribute Person person) {
		String orgId = this.getRequest().getParameter("org.id");
		String depId = this.getRequest().getParameter("dep.id");
		String postId = this.getRequest().getParameter("post.id");
		try {
			if(StringUtils.isNotBlank(depId)){
				Dep dep = this.depManager.get(depId);
				person.addDeps(dep);
				person.setDep(dep);
			}
			if(StringUtils.isNotBlank(postId)){
				Post post = postManager.get(postId);
				person.addPosts(post);
				person.setPost(post);
			}
			
			Org org = this.orgManager.get(orgId);
			PersonInOrg pio = new PersonInOrg(person, org);
			String pioHql = "from PersonInOrg where id.person.id=? and id.org.id=? and state = ? ";
			List<PersonInOrg> pios = this.personInOrgManager.find(pioHql, new Object[] { person.getId(), org.getId(), PersonInOrg.STATE_ON });
			if (pios.size() == 0) {
				pio.setEffon(DateUtils.getCurrentDateStr()+" 00:00:00");
				pio.setState(PersonInOrg.STATE_ON);
				this.personInOrgManager.save(pio);
				//String upPioHql = "update PersonInOrg set state=?,offon=? where id.person.id= ? and id.org.id != ? and state=?";
				String upPioSql = "update IH_ORG_PER set state=?, offon=? where per_id=? and org_id!=? and state=? ";
				this.personInOrgManager.executeSql(upPioSql, new Object[] { PersonInOrg.STATE_OFF, DateUtils.getCurrentDateStr()+" 00:00:00", person.getId(), org.getId(), PersonInOrg.STATE_ON });
			}
			
			this.personManager.save(person);
		} catch (Exception e) {
			throw new BaseException("人员更新失败");
		}

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
			this.personManager.delete(id);
		} catch (Exception e) {
			e.printStackTrace();
			throw new BaseException("该人员删除失败");
		}
		return ResultUtils.renderSuccessResult();
	}
	
	/**
	 * 返回分页
	 * <p>Title: getPage</p>
	 * <p>Description: </p>
	 * @param   String start,String limit
	 * @return List<Person>
	 * @throws BaseException
	 */
	@RequestMapping(value = "/get/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public List<Person> getPage(@PathVariable("start") String start, @PathVariable("limit") String limit){
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setQuery("from Person where 1=1 order by name");
	//	page.setValues(new Object[] {"0"});
		personManager.findPage(page);
		@SuppressWarnings("unchecked")
		List<Person> list = (List<Person>)page.getResult();
		return list;
	}
	
	
}
