package com.infohold.bdrp.authority.model;

import org.apache.shiro.authz.Permission;

public class AuthPermission implements Permission {

	private String uri;

	public String getUri() {
		return uri;
	}

	public void setUri(String uri) {
		this.uri = uri;
	}

	@Override
	public boolean implies(Permission p) {
		// TODO Auto-generated method stub
		return false;
	}
}
