package com.infohold.bdrp.authority.web.rest;

import java.util.Map;
import java.util.Set;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.subject.Subject;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.BeanFactoryUtils;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerMapping;
import org.springframework.web.servlet.handler.AbstractHandlerMethodMapping;
import org.springframework.web.servlet.handler.AbstractUrlHandlerMapping;
import org.springframework.web.servlet.mvc.condition.PatternsRequestCondition;
import org.springframework.web.servlet.mvc.method.RequestMappingInfo;

import com.infohold.bdrp.authority.shiro.annotation.RequiresPathPermission;
import com.infohold.core.web.MediaTypes;
import com.infohold.core.web.rest.BaseRestController;

//@RestController
//@RequestMapping("/auth")
public class AuthorityRestController extends BaseRestController   implements ApplicationContextAware {
	
	
//	@RequestMapping(value = "/login", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)	
//	public void forLogin() {
//		org.apache.shiro.web.filter.authc.FormAuthenticationFilter a;
//		Subject subject = SecurityUtils.getSubject();
//		UsernamePasswordToken token = new UsernamePasswordToken("admin","1234");
//		try {
//			subject.login(token);
//		} catch (AuthenticationException e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//		}
//	}
//	
//	private static String getPath(){
//		return "";
//	}
//	@RequestMapping(value = "/role", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)	
//	@RequiresPathPermission()
//	public void forGet() {}
//	
//	@RequestMapping(value = "/uriList", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)	
//	public void forGetURIList() {
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
//						System.out.println("url : " + url );
//						HandlerMethod metd = (HandlerMethod)method;
//						System.out.println("bean : " + metd.getBean() );
//						System.out.println("metod : " + metd.getMethod() );
//						method.toString();
//					}
//				}
//			}
//		}
//	}
}
