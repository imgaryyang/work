package com.infohold.el.dao.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.infohold.bdrp.authority.dao.AuthorityDao;
import com.infohold.bdrp.authority.model.AuthResource;
import com.infohold.bdrp.authority.model.AuthUser;
import com.infohold.bdrp.org.model.Role;
import com.infohold.core.dao.GenericDao;
import com.infohold.el.base.model.User;

@Repository("authorityDao")
public class ElUserAuthorityDaoImpl implements AuthorityDao<User, Role>{
	
	@Autowired
	private  GenericDao<User,String> userDao;
	@Autowired
	private  GenericDao<Role,String> roleDao;
	@Autowired
	private  GenericDao<AuthResource,String> authResourceDao;
	
	@Override
	public List<User> findAuthUser(AuthUser token) {
		return this.userDao.find("from User where mobile = ?  ", token.getUsername());
	}

	@Override
	public List<Role> findAuthRole(AuthUser token) {
		String jql = "select pr.role from PersonRole pr where pr.person.id = ? ";
		return this.roleDao.find(jql, ((User)token).getPersonId());
	}

	@Override
	public List<AuthResource> findAuthResources(AuthUser token) {
		List<AuthResource> list = new ArrayList<AuthResource>();
		AuthResource allResource = new AuthResource();//系统管理员赋予所有权限
		allResource.setHttpMethod("ALL");
		allResource.setUri("/**/*");
		list.add(allResource);
		return list;
	}
	
}
