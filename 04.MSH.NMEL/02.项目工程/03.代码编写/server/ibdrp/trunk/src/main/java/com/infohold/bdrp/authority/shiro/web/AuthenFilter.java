package com.infohold.bdrp.authority.shiro.web;

import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;

import org.apache.shiro.subject.Subject;
import org.apache.shiro.web.filter.AccessControlFilter;
/**
 * 授权过滤器工作流程如下<br>
 * 是否静态资源<br>
 * ---是 直接通过<br>
 * ---否 是否登陆<br>
 * ------否 跳转登陆页面<br>
 * ------是 是否jsp页面<br>
 * ---------否 由注解判断是否授权，无授权抛出异常<br>
 * ---------是 判断是否授权，无授权抛出异常<br>
 * catch 异常<br>
 * ---未登陆异常 跳转登陆页面<br>
 * ---未授权异常，跳转403.jsp<br>
 * 
 * @author xiaweiyi
 *
 */
public class AuthenFilter extends AccessControlFilter{
	private String doLoginUrl;
    public String getDoLoginUrl() {
		return doLoginUrl;
	}
	public void setDoLoginUrl(String doLoginUrl) {
		this.doLoginUrl = doLoginUrl;
	}
	protected boolean isAccessAllowed(ServletRequest request, ServletResponse response, Object mappedValue) {
        Subject subject = getSubject(request, response);
        return subject.isAuthenticated();//是否登陆
    }
    protected boolean isDoLogin(ServletRequest request, ServletResponse response) {
        return pathsMatch(getDoLoginUrl(), request);
    }
    protected boolean isLoginRequest(ServletRequest request, ServletResponse response) {
        return pathsMatch(getLoginUrl(), request);
    }
    protected boolean onAccessDenied(ServletRequest request, ServletResponse response) throws Exception {
        if (isLoginRequest(request, response)||
        		isDoLogin(request, response)
        		) {
        	 return true;
        } else {
            saveRequestAndRedirectToLogin(request, response);
            return false;
        }
    }

//    @Override
//    protected void cleanup(ServletRequest request, ServletResponse response, Exception existing) throws ServletException, IOException {
//        if (existing instanceof UnauthorizedException || (existing instanceof ServletException && existing.getCause() instanceof UnauthorizedException))
//        {
//            try {
//            	Subject subject = getSubject(request, response);
//                if (subject.getPrincipal() == null) { // If the subject isn't identified, redirect to login URL
//                    saveRequestAndRedirectToLogin(request, response);
//                } else {
//                    // If subject is known but not authorized, redirect to the unauthorized URL if there is one
//                    // If no unauthorized URL is specified, just return an unauthorized HTTP status code
//                    String unauthorizedUrl = getUnauthorizedUrl();
//                    //SHIRO-142 - ensure that redirect _or_ error code occurs - both cannot happen due to response commit:
//                    if (StringUtils.hasText(unauthorizedUrl)) {
//                        WebUtils.issueRedirect(request, response, unauthorizedUrl);
//                    } else {
//                        WebUtils.toHttp(response).sendError(HttpServletResponse.SC_UNAUTHORIZED);
//                    }
//                }
//                existing = null;
//            } catch (Exception e) {
//                existing = e;
//            }
//        }
//        super.cleanup(request, response, existing);
//    }


}
