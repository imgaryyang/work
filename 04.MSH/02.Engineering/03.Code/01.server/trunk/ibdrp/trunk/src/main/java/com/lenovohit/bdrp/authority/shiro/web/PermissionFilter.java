package com.lenovohit.bdrp.authority.shiro.web;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.shiro.authz.AuthorizationException;
import org.apache.shiro.authz.UnauthorizedException;
import org.apache.shiro.subject.Subject;
import org.apache.shiro.util.StringUtils;
import org.apache.shiro.web.filter.AccessControlFilter;
import org.apache.shiro.web.subject.WebSubject;
import org.apache.shiro.web.util.WebUtils;

import com.lenovohit.bdrp.authority.shiro.authc.RestPermission;
//
//
public class PermissionFilter extends AccessControlFilter{
	
    private String unauthorizedUrl;
    public String getUnauthorizedUrl() {
        return unauthorizedUrl;
    }
    public void setUnauthorizedUrl(String unauthorizedUrl) {
        this.unauthorizedUrl = unauthorizedUrl;
    }
    protected boolean isAccessAllowed(ServletRequest request, ServletResponse response, Object mappedValue) {
        Subject subject = getSubject(request, response);
        if(subject instanceof WebSubject){
         	WebSubject webSubject = (WebSubject)subject;
         	HttpServletRequest httpRequest = WebUtils.toHttp(webSubject.getServletRequest());
        	String path = WebUtils.getPathWithinApplication(httpRequest);
         	subject.checkPermission(new RestPermission(path,httpRequest.getMethod()));
         }else{
         	throw new AuthorizationException("You can not use Annotation PathPermission with out an WEB Environment !");
         }
        return true;
    }
    protected boolean onAccessDenied(ServletRequest request, ServletResponse response) throws Exception {
    	//如果isAccessAllowed为true，则通过，如果isAccessAllowed异常则进入cleanup，不存在isAccessAllowed未false情况，所以此方法不起作用，恒置为false
    	 return false;
    }

    @Override
    protected void cleanup(ServletRequest request, ServletResponse response, Exception existing) throws ServletException, IOException {
        if (existing instanceof UnauthorizedException || (existing instanceof ServletException && existing.getCause() instanceof UnauthorizedException))
        {
            try {
            	Subject subject = getSubject(request, response);
                if (subject.getPrincipal() == null) { // If the subject isn't identified, redirect to login URL
                    saveRequestAndRedirectToLogin(request, response);
                } else {
                    // If subject is known but not authorized, redirect to the unauthorized URL if there is one
                    // If no unauthorized URL is specified, just return an unauthorized HTTP status code
                    String unauthorizedUrl = getUnauthorizedUrl();
                    //SHIRO-142 - ensure that redirect _or_ error code occurs - both cannot happen due to response commit:
                    if (StringUtils.hasText(unauthorizedUrl)) {
                        WebUtils.issueRedirect(request, response, unauthorizedUrl);
                    } else {
                        WebUtils.toHttp(response).sendError(HttpServletResponse.SC_UNAUTHORIZED);
                    }
                }
                existing = null;
            } catch (Exception e) {
                existing = e;
            }
        }
        super.cleanup(request, response, existing);
    }


}
