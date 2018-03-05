package com.infohold.bdrp.authority.shiro.web;

import javax.servlet.Filter;

/**
 * 为了 绕过spring boot 对类型为filter的bean自动注册为过滤器所做的封装
 * @author xiaweiyi
 *
 */
public interface ShiroFilterWrapper {

	public Filter getFilter();	
}
