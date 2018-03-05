package com.lenovohit.bdrp.authority.shiro.web;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authz.AuthorizationException;
import org.apache.shiro.authz.UnauthenticatedException;
import org.apache.shiro.authz.UnauthorizedException;
import org.apache.shiro.subject.Subject;
import org.apache.shiro.util.StringUtils;
import org.apache.shiro.web.filter.PathMatchingFilter;
import org.apache.shiro.web.subject.WebSubject;
import org.apache.shiro.web.util.WebUtils;

import com.lenovohit.bdrp.authority.shiro.authc.RestPermission;
//
//
public class AuthorityFilter extends PathMatchingFilter{
	
    private String unauthorizedUrl;//未授权跳转页面
    private String loginUrl;//未登陆跳转页面即登陆页面，首页
    private String anonymousUrl;
    private String pageUrl;
    
	public String getAnonymousUrl() {
		return anonymousUrl;
	}
	public void setAnonymousUrl(String anonymousUrl) {
		this.anonymousUrl = anonymousUrl;
	}
	public String getPageUrl() {
		return pageUrl;
	}
	public void setPageUrl(String pageUrl) {
		this.pageUrl = pageUrl;
	}
	public void setLoginUrl(String loginUrl) {
		this.loginUrl = loginUrl;
	}
	public String getLoginUrl() {
        return loginUrl;
    }
    public String getUnauthorizedUrl() {
        return unauthorizedUrl;
    }
    public void setUnauthorizedUrl(String unauthorizedUrl) {
        this.unauthorizedUrl = unauthorizedUrl;
    }

	public boolean onPreHandle(ServletRequest request, ServletResponse response, Object mappedValue) throws Exception {
		if(isAnonymousRequest(request, response)){//静态资源或者特殊请求（比如error页面等）
			return true;
		}
		//return isPermissionAllowed(request, response, mappedValue);
		if(isAuthenticated(request, response, mappedValue)){//校验登陆
			if(isPageRequest(request, response)){//jsp或者其他后缀页面
				return isPermissionAllowed(request, response, mappedValue);
			}
			return true;//方法注解
		}else{
			return onAuthenDenied(request, response, mappedValue);
		}
	}
	protected boolean isAuthenticated(ServletRequest request, ServletResponse response, Object mappedValue) {
        Subject subject = getSubject(request, response);
        return subject.isAuthenticated();//是否登陆
    }
    protected boolean onAuthenDenied(ServletRequest request, ServletResponse response,Object mappedValue) throws Exception {
    	if (isLoginRequest(request, response)){//如果没有登录
        	 return true;
        } else {
            saveRequestAndRedirectToLogin(request, response);
            return false;
        }
    }
    
    protected boolean isPermissionAllowed(ServletRequest request, ServletResponse response, Object mappedValue) {
        if(StringUtils.hasText(unauthorizedUrl)&&this.isUnauthorizedRequest(request, response)){
        	return true;
        }
    	Subject subject = getSubject(request, response);//是否有权限
        if(subject instanceof WebSubject){
         	WebSubject webSubject = (WebSubject)subject;
         	HttpServletRequest httpRequest = WebUtils.toHttp(webSubject.getServletRequest());
        	String path = WebUtils.getPathWithinApplication(httpRequest);
         	subject.checkPermission(new RestPermission(path,httpRequest.getMethod()));
         	//String path = urlPathHelper.getLookupPathForRequest((HttpServletRequest) webSubject.getServletRequest());
//         	subject.checkPermission(path);
         }else{
         	throw new AuthorizationException("You can not use Annotation PathPermission with out an WEB Environment !");
         }
        return true;
    }
    protected boolean onPermissionDenied(ServletRequest request, ServletResponse response) throws Exception {
    	//如果isPermissionAllowed为true，则通过，如果isPermissionAllowed异常则进入cleanup，不存在isPermissionAllowed未false情况，所以此方法不起作用，恒置为false
    	return false;
    }
    @Override
    protected void cleanup(ServletRequest request, ServletResponse response, Exception existing) throws ServletException, IOException {
		try {
			if (existing instanceof UnauthorizedException
					|| (existing instanceof ServletException && existing
							.getCause() instanceof UnauthorizedException)) {
				
				doWithUnauthorizedException(request, response, existing);//未授权异常
		    	existing = null;

			} else if (existing instanceof UnauthenticatedException
					|| (existing instanceof ServletException && existing
							.getCause() instanceof UnauthenticatedException)) {
				
				doWithUnauthenticatedException(request, response, existing);//未登陆异常
		    	existing = null;
			}
		} catch (Exception e) {
			existing = e;
		}
       
        super.cleanup(request, response, existing);
    }
    /**
     * //未授权异常
     * @param request
     * @param response
     * @param existing
     * @throws IOException
     */
    protected void doWithUnauthorizedException(ServletRequest request, ServletResponse response, Exception existing) throws IOException{//未授权异常
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
    }
    /**
     * 未登录处理
     * @param request
     * @param response
     * @param existing
     * @throws IOException
     */
    protected void doWithUnauthenticatedException(ServletRequest request, ServletResponse response, Exception existing) throws IOException{//未登陆异常
    	saveRequestAndRedirectToLogin(request, response);
    }
    protected Subject getSubject(ServletRequest request, ServletResponse response) {
		return SecurityUtils.getSubject();
	}
    /**
     * 未能找到ant风格路径匹配多个的情况，添加方法针对逗号分隔的多个路径，匹配任意一个返回true
     */
	protected boolean pathsMatch(String path, ServletRequest request) {
		if (StringUtils.hasText(path)) {
			String[] paths = path.split(",");
			for (String p : paths) {
				if (super.pathsMatch(p, request)) {
					return true;
				}
			}
		}
		return false;
	}
    protected boolean isLoginRequest(ServletRequest request, ServletResponse response) {
        return pathsMatch(getLoginUrl(), request);
    }
    protected boolean isUnauthorizedRequest(ServletRequest request, ServletResponse response) {
        return pathsMatch(getUnauthorizedUrl(), request);
    }
    protected boolean isAnonymousRequest(ServletRequest request, ServletResponse response) {
        return pathsMatch(this.getAnonymousUrl(), request);
    }
    protected boolean isPageRequest(ServletRequest request, ServletResponse response) {
        return pathsMatch(this.getPageUrl(), request);
    }
    protected void saveRequestAndRedirectToLogin(ServletRequest request, ServletResponse response) throws IOException {
        saveRequest(request);
        String ajaxRequestType = WebUtils.toHttp(request).getHeader("X-Requested-With");
        if(null == ajaxRequestType || "".equals(ajaxRequestType)){
        	redirectToLogin(request, response);
        }else{//如果ajax提交 ajaxRequestType = "XMLHttpRequest"
        	HttpServletResponse httpRes = WebUtils.toHttp(response);
            //httpRes.sendError(402);
            String loginUrl = getLoginUrl();
            httpRes.addHeader("redirectURL", loginUrl);
            httpRes.sendError(402);
        }
    }
    protected void saveRequest(ServletRequest request) {
        WebUtils.saveRequest(request);
    }
    protected void redirectToLogin(ServletRequest request, ServletResponse response) throws IOException {
        String loginUrl = getLoginUrl();
        WebUtils.issueRedirect(request, response, loginUrl);
    }
    
}
