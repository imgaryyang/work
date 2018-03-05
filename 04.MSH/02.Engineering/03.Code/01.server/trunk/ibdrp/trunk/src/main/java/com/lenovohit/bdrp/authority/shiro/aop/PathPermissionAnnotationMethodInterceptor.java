package com.lenovohit.bdrp.authority.shiro.aop;

import org.apache.shiro.aop.AnnotationResolver;
import org.apache.shiro.authz.aop.AuthorizingAnnotationMethodInterceptor;

public class PathPermissionAnnotationMethodInterceptor extends AuthorizingAnnotationMethodInterceptor {

    public PathPermissionAnnotationMethodInterceptor() {
        super( new PathPermissionAnnotationHandler() );
    }

    public PathPermissionAnnotationMethodInterceptor(AnnotationResolver resolver) {
        super( new PathPermissionAnnotationHandler(), resolver);
    }
}
//package com.lenovohit.bdrp.authority.shiro.aop;
//
//import java.lang.annotation.Annotation;
//
//import javax.servlet.http.HttpServletRequest;
//
//import org.apache.shiro.aop.AnnotationResolver;
//import org.apache.shiro.aop.MethodInvocation;
//import org.apache.shiro.authz.AuthorizationException;
//import org.apache.shiro.authz.aop.AuthorizingAnnotationHandler;
//import org.apache.shiro.authz.aop.AuthorizingAnnotationMethodInterceptor;
//import org.apache.shiro.subject.Subject;
//import org.apache.shiro.web.subject.WebSubject;
//import org.apache.shiro.web.util.WebUtils;
//import org.springframework.web.bind.annotation.RequestMapping;
//
//import com.lenovohit.bdrp.authority.shiro.annotation.RequiresPathPermission;
//import com.lenovohit.bdrp.authority.shiro.authc.RestPermission;
//
//public class PathPermissionAnnotationMethodInterceptor extends AuthorizingAnnotationMethodInterceptor {
//
//    public PathPermissionAnnotationMethodInterceptor() {
//        super( new PathPermissionAnnotationHandler() );
//    }
//
//    public PathPermissionAnnotationMethodInterceptor(AnnotationResolver resolver) {
//        super( new PathPermissionAnnotationHandler(), resolver);
//    }
//    public void assertAuthorized(MethodInvocation mi) throws AuthorizationException {
//    	
//        try {
//        	assertAnnotationAuthoriz(mi);
//        }
//        catch(AuthorizationException ae) {
//            if (ae.getCause() == null) ae.initCause(new AuthorizationException("Not authorized to invoke method: " + mi.getMethod()));
//            throw ae;
//        }         
//    }
//    private void assertAnnotationAuthoriz(MethodInvocation mi){
//    	Annotation a = this.getAnnotation(mi);
//    	if (!(a instanceof RequiresPathPermission)) return;
//    	RequiresPathPermission permission = (RequiresPathPermission) a;
//    	String path =  permission.path();
//    	if(null== path||"".equals(path)){
//    		RequestMapping classMapping =  mi.getMethod().getDeclaringClass().getAnnotation(RequestMapping.class);
//        	RequestMapping methodMapping = (RequestMapping)getResolver().getAnnotation(mi, RequestMapping.class);
//        	String classPath = this.getMappingValue(classMapping);
//        	String methodPath = this.getMappingValue(methodMapping);
//        	path =(classPath+methodPath).replace("//", "/");
//    	}
//    	
//        Subject subject = getSubject();
//        if(subject instanceof WebSubject){
//        	WebSubject webSubject = (WebSubject)subject;
//        	HttpServletRequest httpRequest = WebUtils.toHttp(webSubject.getServletRequest());
//        	//String path = WebUtils.getPathWithinApplication(httpRequest);
//        	//String path = urlPathHelper.getLookupPathForRequest((HttpServletRequest) webSubject.getServletRequest());
//        	subject.checkPermission(new RestPermission(path,httpRequest.getMethod()));
//        }else{
//        	throw new AuthorizationException("You can not use Annotation PathPermission with out an WEB Environment !");
//        }
//    }
//    private String getMappingValue(RequestMapping mapping){
//    	String[] values = mapping.value();
//    	if(null==values)return "";
//    	else if(0==values.length)return "";
//    	else if(null == values[0])return "";
//    	else if("".equals(values[0]))return "";
//    	return values[0];
//    }
//}
