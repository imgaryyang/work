package com.lenovohit.bdrp.authority.dao;

import java.util.List;

import com.lenovohit.bdrp.authority.model.AuthResource;
import com.lenovohit.bdrp.authority.model.AuthRole;
import com.lenovohit.bdrp.authority.model.AuthUser;

public interface AuthorityDao<T extends AuthUser,K extends AuthRole> {
	
	public List<T> findAuthUser(AuthUser token);
	
	public List<K> findAuthRole(AuthUser token);
	
	public List<AuthResource> findAuthResources(AuthUser token);
	
}
