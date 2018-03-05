package com.lenovohit.bdrp.authority.model;

import java.util.ArrayList;
import java.util.List;

public class AuthURI {
	private AuthURI parent;
	private String text;
	private String uri;
	private List<AuthURI> children;
	private String httpMethod;
	private String clazz;
	private String method;
	private String type;
	public AuthURI getParent() {
		return parent;
	}
	public void setParent(AuthURI parent) {
		this.parent = parent;
	}
	public String getText() {
		return text;
	}
	public void setText(String text) {
		this.text = text;
	}
	public String getUri() {
		return uri;
	}
	public void setUri(String uri) {
		this.uri = uri;
	}
	public List<AuthURI> getChildren() {
		return children;
	}
	public void addChild(AuthURI children) {
		if(this.children==null)this.children = new ArrayList<AuthURI>();
		this.children.add(children);
	}
	public void setChildren(List<AuthURI> children) {
		this.children = children;
	}
	public String getHttpMethod() {
		return httpMethod;
	}
	public void setHttpMethod(String httpMethod) {
		this.httpMethod = httpMethod;
	}
	public String getClazz() {
		return clazz;
	}
	public void setClazz(String clazz) {
		this.clazz = clazz;
	}
	public String getMethod() {
		return method;
	}
	public void setMethod(String method) {
		this.method = method;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
}
