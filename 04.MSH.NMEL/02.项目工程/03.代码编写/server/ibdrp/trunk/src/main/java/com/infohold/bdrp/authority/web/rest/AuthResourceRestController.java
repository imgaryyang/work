package com.infohold.bdrp.authority.web.rest;

import java.io.IOException;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.annotation.AnnotationUtils;
import org.springframework.stereotype.Controller;
import org.springframework.util.ClassUtils;
import org.springframework.util.ReflectionUtils.MethodFilter;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.method.HandlerMethodSelector;
import org.springframework.web.servlet.ModelAndView;

import com.infohold.bdrp.authority.model.AuthResource;
import com.infohold.bdrp.authority.model.AuthURI;
import com.infohold.core.dao.Page;
import com.infohold.core.exception.BaseException;
import com.infohold.core.manager.GenericManager;
import com.infohold.core.utils.StringUtils;
import com.infohold.core.web.MediaTypes;
import com.infohold.core.web.rest.BaseRestController;
import com.infohold.core.web.utils.Result;
import com.infohold.core.web.utils.ResultUtils;

@RestController
@RequestMapping("/bdrp/auth/resource")
public class AuthResourceRestController extends BaseRestController{
	
	@Autowired
	private GenericManager<AuthResource, String> authResourceManager;
	
	/**
	 * 主页面
	 * @return
	 */
	public ModelAndView forMain() {
		ModelAndView mv= new ModelAndView();
		return mv;
	}
	
	/**
	 * 返回信息至编辑页面
	 * @return
	 */
	public ModelAndView forEdit() {
		ModelAndView mv= new ModelAndView();
		return mv;
	}
	
	/**
	 * 返回信息至浏览页面
	 * @return
	 */
	public AuthResource forView(@PathVariable String id){
		return this.authResourceManager.get(id);
		
	}
	
	
	
	/**
	 * 获取列表
	 * 
	 * @return
	 */
	public Result forPage(){
		String functionId = getRequest().getParameter("functionId");
		String method = getRequest().getParameter("method");
		String context = getRequest().getParameter("context");
		String hql = "from AuthResource where 1=1 ";
		
		Page page = new Page();
		List<String> values = new ArrayList<String>();
		
		if(!StringUtils.isEmpty(functionId)){
			hql += "and function.id = ? ";
			values.add(functionId);
			page.setValues(values.toArray());
		}
		
		if(!StringUtils.isEmpty(method)){
			hql += "and " + method + " like ? ";
			values.add("%"+context+"%");
			page.setValues(values.toArray());
		}
		page.setPageSize(getRequest().getParameter("pageSize"));
    	page.setStart(getRequest().getParameter("start"));
		page.setQuery(hql);
		this.authResourceManager.findPage(page);
		
		return ResultUtils.renderPageResult(page);
		
	}
	

    // ******** pub版方法添加  *************
    
    /**
     * 判断当前功能下的资源编码是否存在
     * @return
     * @throws IOException 
     */
	@RequestMapping(value = "/exist/code" , method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
    public Result forCodeExist(){
    	
    	String functionId = this.getRequest().getParameter("functionId");
		String code = this.getRequest().getParameter("code");
		List<AuthResource> list = this.authResourceManager.
					find("from AuthResource where code = ? and function.id = ? ", code, functionId);
		if(list.size() > 0){
			return ResultUtils.renderFailureResult("已存在");
		}
		
    	return ResultUtils.renderSuccessResult();
    	
    	
    }
    
    /**
     * 判断当前功能下的资源名称是否存在
     * @return
     * @throws IOException 
     */
	@RequestMapping(value = "/exist/name" , method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forNameExist(){
    	String functionId = this.getRequest().getParameter("functionId");
		String name = this.getRequest().getParameter("name");
		List<AuthResource> list = this.authResourceManager.
					find("from AuthResource where name = ? and function.id = ? ", name, functionId);
		if(list.size() > 0){
			return ResultUtils.renderFailureResult("已存在");
		}
		
    	return ResultUtils.renderSuccessResult();
    }
    
    /**
     * 保存资源
     * @return
     * @throws IOException 
     */
	@RequestMapping(value = "/create" , method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public AuthResource forCreate(@ModelAttribute AuthResource model){
    	String validHql = "from AuthResource where code = ? and function.id = ?";
		List<AuthResource> lst = this.authResourceManager.find(validHql, model.getCode(),model.getFunction().getId());
		if(lst.size()>0){
			throw new BaseException("该编码已存在,请重新填写!");
		}
		
		validHql = "from AuthResource where name = ? and function.id = ?";
		lst = this.authResourceManager.find(validHql, model.getName(),model.getFunction().getId());
		if(lst.size()>0){
			throw new BaseException("该名称已存在,请重新填写!");
		}
		
		
		this.authResourceManager.save(model);
		
		return model;
    	
    	
    }
    
    /**
     * 删除资源
     * @return
     * @throws IOException 
     */
	@RequestMapping(value = "/remove/{id}",method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forRemove(@PathVariable String id){
    	// 获取要删除的资源ID
		this.authResourceManager.delete(id);
		
    	return ResultUtils.renderSuccessResult();
    	
    }
    
    /**
     * 获取分页资源内容
     * @return
     * @throws IOException 
     */
    @RequestMapping(value = "access/linked", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forLinkedAuthResource(){
    	// 获取参数
    	String start = this.getRequest().getParameter("start");
    	String pageSize = this.getRequest().getParameter("pageSize");
    	if(StringUtils.isEmpty(pageSize))
    		pageSize = this.getRequest().getParameter("limit");
    	String functionId = this.getRequest().getParameter("functionId");
    	String authzId = this.getRequest().getParameter("authzId");
//    	String jql = "from AuthResource res where 1=1 and res.function.id = ?  and  res  in ( select sres from AuthzAccess acc  left join acc.resource sres where  acc.id= ?  ) ";
    	String jql = "select res, res.function  from AuthResource res where 1=1 and res.function.id = ?  and  res  in ( select sres from AuthzAccess acc  left join acc.resource sres where  acc.id= ?  ) ";
    	
    	
    	Page page = new Page();
    	List<String> values = new ArrayList<String>();
    	values.add(functionId);
    	values.add(authzId);
    	
    	page.setStart(start);
    	page.setPageSize(pageSize);
    	page.setQuery(jql);
    	page.setValues(values.toArray());
		this.authResourceManager.findPage(page);
		
		List<Object[]> list = (List<Object[]>)page.getResult();
		List<AuthResource> list2 = new ArrayList<AuthResource>();
		for(int i=0;list!=null && i<list.size();i++) {
			Object[] arr = list.get(i);
			AuthResource ar = (AuthResource)arr[0];
			ar.setFname(ar.getFunction().getName());
			list2.add(ar);
		}
		page.setResult(list2);
    	
    	return ResultUtils.renderPageResult(page);
    }
    
    /**
	 * 返回信息至编辑页面
	 * @return
	 */
    @RequestMapping(value = "access/toLink", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public ModelAndView forToLink() {
		ModelAndView mv= new ModelAndView("bdrp/auth/resource/list");
		
		String start = this.getRequest().getParameter("start");
    	String pageSize = this.getRequest().getParameter("pageSize");
    	
		String functionId = getRequest().getParameter("functionId");
    	String authzId = getRequest().getParameter("authzId");
    	
		String method = getRequest().getParameter("method");
		String context = getRequest().getParameter("context");
		String jql = "from AuthResource res where 1=1 and res.function.id = ?  and  res  not in ( select sres from AuthzAccess acc  left join acc.resource sres where  acc.id= ? and sres is not null ) ";
		
		Page page = new Page();
		List<String> values = new ArrayList<String>();
		values.add(functionId);
		values.add(authzId);
		
		if(!StringUtils.isEmpty(method)){
			jql += "and " + method + " like ? ";
			values.add("%"+context+"%");
			
		}
		page.setStart(start);
    	page.setPageSize(pageSize);
    	page.setQuery(jql);
    	page.setValues(values.toArray());
		
    	this.authResourceManager.findPage(page);
    	mv.addObject("pageBean", page);
		return mv;
	}
    
    
    /**
	 * 获取该授权和方法中所有未关联的资源(新)
	 * 
	 * @return
	 * @throws IOException
	 */
	@RequestMapping(value="/access/unlinked",method=RequestMethod.GET,produces = MediaTypes.JSON_UTF_8)
	public Result forToLinkUserList2() {
		String start=getRequest().getParameter("start");
		String limit=getRequest().getParameter("limit");
		String functionId = getRequest().getParameter("functionId");
    	String authzId = getRequest().getParameter("authzId");
    	
    	String method = getRequest().getParameter("method");
		String context = getRequest().getParameter("context");
		String jql = "from AuthResource res where 1=1 and res.function.id = ?  and  res  not in ( select sres from AuthzAccess acc  left join acc.resource sres where  acc.id= ? and sres is not null ) ";
		
		Page page = new Page();
		List<String> values = new ArrayList<String>();
		values.add(functionId);
		values.add(authzId);
		
		if(!StringUtils.isEmpty(method)){
			jql += "and " + method + " like ? ";
			values.add("%"+context+"%");
			
		}
		page.setStart(start);
    	page.setPageSize(limit);
    	page.setQuery(jql);
    	page.setValues(values.toArray());
    	try {
    		this.authResourceManager.findPage(page);
    	} catch (Exception e) {
			e.printStackTrace();
			throw new BaseException(e.getMessage());
		}
		return ResultUtils.renderPageResult(page);
	}
    
    @RequestMapping(value = "access/doLink", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forDoLink() {
    	String resIds = getRequest().getParameter("resIds");
    	String accId = getRequest().getParameter("accId");
    	
		String sql = "insert into IH_ACCESS_RES(AID,RID) select ? ,r.id from IH_RESOURCE r where r.id in ("+resIds+")";
		this.authResourceManager.executeSql(sql, accId);
		
		return ResultUtils.renderSuccessResult();
	}
    
    @RequestMapping(value = "access/divest", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forDivest() {
    	String resIds = getRequest().getParameter("resIds");
    	String svrId = getRequest().getParameter("svrId");
    	
		String sql = "delete from IH_ACCESS_RES where AID = ? and RID in ("+resIds+")";
		this.authResourceManager.executeSql(sql, svrId);
		
		return ResultUtils.renderSuccessResult();
	}
    
    /**
     * 获取分页资源内容
     * @return
     * @throws IOException 
     */
    @RequestMapping(value = "function/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forAuthResourceOfFunction(){
    	// 获取参数
    	String start = this.getRequest().getParameter("start");
    	String pageSize = this.getRequest().getParameter("pageSize");
    	String functionId = this.getRequest().getParameter("functionId");
    	String jql = "from AuthResource res where 1=1 and res.function.id = ?  ";
    	
    	Page page = new Page();
    	List<String> values = new ArrayList<String>();
    	values.add(functionId);
    	
    	page.setStart(start);
    	page.setPageSize(pageSize);
    	page.setQuery(jql);
    	page.setValues(values.toArray());
		this.authResourceManager.findPage(page);
    	
    	
    	return ResultUtils.renderPageResult(page);
    }
    /**
     * 获取系统的资源
     * @return
     */
    @RequestMapping(value = "/system/uri", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)	
	public List<AuthURI> forGetURIList() {
    	List<AuthURI> uriList = new ArrayList<AuthURI>();
		try {
			
			String[] beanNames = getApplicationContext().getBeanNamesForType(Object.class);
			for (String beanName : beanNames) {
				if (!beanName.startsWith( "scopedTarget.") &&
						isHandler(getApplicationContext().getType(beanName))){
					AuthURI beanUri= detectHandlerMethods(beanName);
					if(null!=beanUri)uriList.add(beanUri);
				}
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} 
		//TODO 添加所有的jsp页面
		//TODO 添加所有的配置文件配置的urlmapping
		return uriList;
//		List<String[]> list1 = new ArrayList<String[]>();
//		List<String> list = new ArrayList<String>();
//		Map<String, HandlerMapping> matchingBeans = BeanFactoryUtils.beansOfTypeIncludingAncestors(this.getApplicationContext(), HandlerMapping.class, true, false);
//		Set<String> keys = matchingBeans.keySet();
//		for(String key : keys){
//			HandlerMapping mapping = matchingBeans.get(key);
//			if(mapping instanceof AbstractUrlHandlerMapping){
//				AbstractUrlHandlerMapping urlMapping = (AbstractUrlHandlerMapping)mapping;
//				Map<String,Object> HandlerMap = urlMapping.getHandlerMap();
//				Set<String> mapKeys = HandlerMap.keySet();
//				for(String mapKey : mapKeys){
//					System.out.println("key : " + mapKey);
//					System.out.println("object : " + HandlerMap.get(mapKey));
//					list1.add(new String[]{mapKey,HandlerMap.get(mapKey).toString()});
//					list.add(mapKey);
//				}
//			}else if(mapping instanceof AbstractHandlerMethodMapping){
//				@SuppressWarnings("rawtypes")
//				AbstractHandlerMethodMapping methodMapping = (AbstractHandlerMethodMapping)mapping;
//				Map methodMap = methodMapping.getHandlerMethods();
//				Set<Object> mapKeys = methodMap.keySet();
//				for(Object mapKey : mapKeys){
//					Object method = methodMap.get(mapKey);
//					if(mapKey instanceof RequestMappingInfo && method instanceof HandlerMethod){
//						PatternsRequestCondition pc = ((RequestMappingInfo)mapKey).getPatternsCondition();
//						String pattern = pc.toString();
//						String url = pattern.substring(1, pattern.length()-1);
//						list.add(url);
//						HandlerMethod metd = (HandlerMethod)method;
//						list1.add(new String[]{url,metd.getMethod().toGenericString()});
//					}
//				}
//			}
//		}
//		for(String[] f : list1){
////			System.out.println(/*"url:" + */f[0]);
//			//System.out.println("path:" + f[1]);
//		}
//		return list;
	}
	private boolean isHandler(Class<?> beanType) {
		return ((AnnotationUtils.findAnnotation(beanType, Controller.class) != null) ||
				(AnnotationUtils.findAnnotation(beanType, RequestMapping.class) != null));
	}
	private AuthURI detectHandlerMethods(final Object handler) {
		Class<?> handlerType =
				(handler instanceof String ? getApplicationContext().getType((String) handler) : handler.getClass());
		final Class<?> userType = ClassUtils.getUserClass(handlerType);
		RequestMapping typeAnnotation = AnnotationUtils.findAnnotation(handlerType, RequestMapping.class);
		if(null==typeAnnotation)return null;
		final AuthURI classURI = createURI(null,typeAnnotation);
		classURI.setClazz(userType.getName());
		classURI.setType("class");
		classURI.setText(classURI.getUri());
		HandlerMethodSelector.selectMethods(userType, new MethodFilter() {
			@Override
			public boolean matches(Method method) {
				RequestMapping methodAnnotation = AnnotationUtils.findAnnotation(method, RequestMapping.class);
				if (methodAnnotation != null) {
					AuthURI methodURI = createURI(classURI,methodAnnotation);
					methodURI.setClazz(methodURI.getClazz());
					methodURI.setType("method");
					methodURI.setMethod(method.getName());
					methodURI.setText(methodURI.getUri()+"["+methodURI.getHttpMethod()+"]");
					classURI.addChild(methodURI);
					return true;
				}else {
					return false;
				}
			}
		});
		return classURI;
	}
	private AuthURI createURI(AuthURI parent, RequestMapping annon){
		AuthURI authURI = new AuthURI();
		String[] vlaues = annon.value();
		String uri="";
		for(String value : vlaues){
			uri +=value;
		}
		if(null!=parent&&!"/".equals(parent.getUri())){
			uri=parent.getUri()+uri;
		}
		RequestMethod[] methods = annon.method();
		if(null!=methods&&methods.length>0){
			RequestMethod method = methods[0];
			switch(method){
				case DELETE : authURI.setHttpMethod("DELETE");break;
				case GET : authURI.setHttpMethod("GET");break;
				case HEAD : authURI.setHttpMethod("HEAD");break;
				case POST : authURI.setHttpMethod("POST");break;
				case PUT : authURI.setHttpMethod("PUT");break;
				case PATCH : authURI.setHttpMethod("PATCH");break;
				case OPTIONS : authURI.setHttpMethod("OPTIONS");break;
				case TRACE : authURI.setHttpMethod("TRACE");break;
				default : authURI.setHttpMethod("");break;
			}
		}
		authURI.setUri(uri);
		return authURI;
	}
}
