package com.infohold.bdrp.authority.dao;

import java.util.List;

import com.infohold.bdrp.authority.model.AuthResource;
import com.infohold.bdrp.authority.model.AuthRole;
import com.infohold.bdrp.authority.model.AuthUser;

public interface AuthorityDao<T extends AuthUser,K extends AuthRole> {
	
	public List<T> findAuthUser(AuthUser token);
	
	public List<K> findAuthRole(AuthUser token);
	
	public List<AuthResource> findAuthResources(AuthUser token);
	
}
