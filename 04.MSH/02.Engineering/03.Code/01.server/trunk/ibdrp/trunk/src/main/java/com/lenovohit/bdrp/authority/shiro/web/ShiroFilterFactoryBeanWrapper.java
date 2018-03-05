package com.lenovohit.bdrp.authority.shiro.web;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;

import javax.servlet.Filter;

import org.apache.shiro.spring.web.ShiroFilterFactoryBean;
import org.apache.shiro.web.filter.mgt.FilterChainManager;

public class ShiroFilterFactoryBeanWrapper extends  ShiroFilterFactoryBean{
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
	public void setFilterWrappers(Map<String, ShiroFilterWrapper> wrappers) {
		Map<String, Filter> filters = new LinkedHashMap<String, Filter>();
		Set<String> keys = filters.keySet();
		for(String key : keys){
			filters.put(key, wrappers.get(key).getFilter());
		}
       this.setFilters(filters);
    }
	protected AuthorityFilter createDefaultAuthorityFilter(){
		AuthorityFilter filter = new AuthorityFilter();
		filter.setLoginUrl(this.getLoginUrl());
		filter.setPageUrl(pageUrl);
		filter.setUnauthorizedUrl(this.getUnauthorizedUrl());
		filter.setAnonymousUrl(anonymousUrl);
		return filter;
	}
	protected FilterChainManager createFilterChainManager() {
		 Map<String, Filter> filters = getFilters();
		 AuthorityFilter authorityFilter = this.createDefaultAuthorityFilter();
		 filters.put("authority", authorityFilter);
		 return super.createFilterChainManager();
    }
}
