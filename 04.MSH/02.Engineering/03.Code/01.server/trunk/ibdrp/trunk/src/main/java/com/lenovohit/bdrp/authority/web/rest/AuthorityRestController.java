package com.lenovohit.bdrp.authority.web.rest;

import org.springframework.context.ApplicationContextAware;

import com.lenovohit.core.web.rest.BaseRestController;

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
