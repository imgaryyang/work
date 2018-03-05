package com.infohold.bdrp.authority.shiro.aop;

import java.lang.annotation.Annotation;

import javax.servlet.http.HttpServletRequest;

import org.apache.shiro.authz.AuthorizationException;
import org.apache.shiro.authz.aop.AuthorizingAnnotationHandler;
import org.apache.shiro.subject.Subject;
import org.apache.shiro.web.subject.WebSubject;
import org.apache.shiro.web.util.WebUtils;

import com.infohold.bdrp.authority.shiro.annotation.RequiresPathPermission;
import com.infohold.bdrp.authority.shiro.authc.RestPermission;

public class PathPermissionAnnotationHandler extends AuthorizingAnnotationHandler {

	//private UrlPathHelper urlPathHelper = new UrlPathHelper();
    public PathPermissionAnnotationHandler() {
        super(RequiresPathPermission.class);
    }
    public void assertAuthorized(Annotation a) throws AuthorizationException {
        if (!(a instanceof RequiresPathPermission)) return;
        Subject subject = getSubject();
        if(subject instanceof WebSubject){
        	WebSubject webSubject = (WebSubject)subject;
        	HttpServletRequest httpRequest = WebUtils.toHttp(webSubject.getServletRequest());
        	String path = WebUtils.getPathWithinApplication(httpRequest);
        	//String path = urlPathHelper.getLookupPathForRequest((HttpServletRequest) webSubject.getServletRequest());
        	subject.checkPermission(new RestPermission(path,httpRequest.getMethod()));
        }else{
        	throw new AuthorizationException("You can not use Annotation PathPermission with out an WEB Environment !");
        }
    }
}
