package com.infohold.bdrp.authority.shiro.authc;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import org.apache.shiro.authz.Permission;
import org.springframework.util.AntPathMatcher;
import org.springframework.util.PathMatcher;
import org.springframework.web.servlet.mvc.condition.PatternsRequestCondition;
import org.springframework.web.util.UrlPathHelper;

import com.infohold.bdrp.authority.model.AuthResource;

public class RestPermission implements Permission,Serializable {
	
	private static final long serialVersionUID = -2578278902751724950L;
	
//	private PatternsRequestCondition pathCondition;		
//	private static UrlPathHelper urlPathHelper = new UrlPathHelper();
	private static List<String> fileExtensions = new ArrayList<String>();
//	private static PathMatcher pathMatcher = new AntPathMatcher();
	private AuthResource authResource;
	private String uri;
	private String method="GET";
	public String getUri() {
		return uri;
	}
	public void setUri(String uri) {
		this.uri = uri;
//		this.pathCondition = new PatternsRequestCondition(
//				new String[]{uri},
//				urlPathHelper, 
//				pathMatcher,
//				true,true,
//				fileExtensions);
		
	}
	public String getMethod() {
		return method;
	}
	public void setMethod(String method) {
		if(null==method||"".equals(method))return;
		this.method = method;
	}
	public void setResource(AuthResource resource) {
		this.setUri(resource.getUri());
		this.setMethod(resource.getHttpMethod());
	}
	public RestPermission(){
		
	}
	public RestPermission(AuthResource resource){
		this.authResource = resource;
		this.setUri(resource.getUri());
		this.setMethod(resource.getHttpMethod());
	}
	public RestPermission(String uri,String method){
		this.setUri(uri);
		this.setMethod(method);
	}
	@Override
	public boolean implies(Permission permission) {
        if (!(permission instanceof RestPermission)) {
            return false;
        }
        RestPermission p = (RestPermission)permission;
        return this.uriMathch(p.getUri())&&this.methodMathch(p.getMethod());
	}
	/**
	 * 使用spring的uri匹配方式，不考虑同时匹配多个不同的uri的情况，认为只要可以匹配即为拥有该权限
	 * @param other
	 * @return
	 */
	protected boolean uriMathch(String other){
        if(null==uri)return false;
        UrlPathHelper urlPathHelper = new UrlPathHelper();
        PathMatcher pathMatcher = new AntPathMatcher();
        PatternsRequestCondition pathCondition = new PatternsRequestCondition(
				new String[]{uri},
				urlPathHelper, 
				pathMatcher,
				true,true,
				fileExtensions);
        List<String> matches = pathCondition.getMatchingPatterns(other);
        if(null!=matches && !matches.isEmpty())
        	return true;
        //if(uri.equals(other))return true;
		return false;
	}
	
//	/**
//	 * 使用spring的uri匹配方式，不考虑同时匹配多个不同的uri的情况，认为只要可以匹配即为拥有该权限
//	 * @param other
//	 * @return
//	 */
//	protected boolean uriMathch(RestPermission p ){
//        if(null==uri)return false;
//        UrlPathHelper urlPathHelper = new UrlPathHelper();
//        PathMatcher pathMatcher = new AntPathMatcher();
//        PatternsRequestCondition pathCondition = new PatternsRequestCondition(
//				new String[]{uri},
//				urlPathHelper, 
//				pathMatcher,
//				true,true,
//				fileExtensions);
//        List<String> matches = this.pathCondition.getMatchingPatterns(other);
//        if(null!=matches && !matches.isEmpty())
//        	return true;
//        //if(uri.equals(other))return true;
//		return false;
//	}
	protected boolean methodMathch(String other){
		if(null==method)return false;
		if("ALL".equals(method))return true;
		if(method.equals(other))return true;
		return false;
	}
	public AuthResource getAuthResource() {
		return authResource;
	}
	public void setAuthResource(AuthResource authResource) {
		this.authResource = authResource;
	}
	
}
