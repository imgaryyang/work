package com.infohold.bdrp.authority.shiro.web;

import javax.servlet.Filter;
import javax.servlet.FilterConfig;
import javax.servlet.ServletContext;

/**
 * //TODO 考虑能不能用动态代理取代这个类
 * 
 * @author xiaweiyi
 *
 */
public class AuthorityFilterWrapper implements PathMatchShiroFilterWrapper {
	private AuthorityFilter filter;

	public AuthorityFilterWrapper() {
		filter = new AuthorityFilter();
	}

	public String getAnonymousUrl() {
		return filter.getAnonymousUrl();
	}

	public void setAnonymousUrl(String anonymousUrl) {
		this.filter.setAnonymousUrl(anonymousUrl);
	}

	public String getPageUrl() {
		return filter.getPageUrl();
	}

	public void setPageUrl(String pageUrl) {
		filter.setPageUrl(pageUrl);
	}

	public boolean isEnabled() {
		return filter.isEnabled();
	}

	public void setName(String name) {
		filter.setName(name);
	}

	public FilterConfig getFilterConfig() {
		return filter.getFilterConfig();
	}

	public void setFilterConfig(FilterConfig filterConfig) {
		filter.setFilterConfig(filterConfig);
	}

	public void setEnabled(boolean enabled) {
		filter.setEnabled(enabled);
	}

	public ServletContext getServletContext() {
		return filter.getServletContext();
	}

	public void setServletContext(ServletContext servletContext) {
		filter.setServletContext(servletContext);
	}

	public String getUnauthorizedUrl() {
		return filter.getUnauthorizedUrl();
	}

	public void setUnauthorizedUrl(String unauthorizedUrl) {
		filter.setUnauthorizedUrl(unauthorizedUrl);
	}

	public String getLoginUrl() {
		return filter.getLoginUrl();
	}

	public void setLoginUrl(String loginUrl) {
		filter.setLoginUrl(loginUrl);
	}

	@Override
	public Filter getFilter() {
		return filter;
	}

}
