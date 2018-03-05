package com.infohold.bdrp.authority.dao.impl;

import java.util.ArrayList;
import java.util.List;

import com.infohold.bdrp.Constants;
import com.infohold.bdrp.authority.dao.AuthorityDao;
import com.infohold.bdrp.authority.model.AuthResource;
import com.infohold.bdrp.authority.model.AuthRole;
import com.infohold.bdrp.authority.model.AuthUser;
import com.infohold.bdrp.authority.model.DefaultAuthRole;
import com.infohold.bdrp.authority.model.DefaultAuthUser;
import com.infohold.core.utils.BeanUtils;

public class DefaultAuthorityDaoImpl implements AuthorityDao<AuthUser, AuthRole> {
	
	@Override
	public List<AuthUser> findAuthUser(AuthUser token) {
		List<AuthUser> list = new ArrayList<AuthUser>();
		if (Constants.APP_SUPER_USERNAME.equals(token.getUsername())) {
			DefaultAuthUser user = new DefaultAuthUser();
			BeanUtils.copyProperties(token, user);
			user.setId(Constants.APP_SUPER_ID);
			user.setPassword(Constants.APP_SUPER_PASSWORD);
			list.add(user);
		}
		return list;
	}

	@Override
	public List<AuthRole> findAuthRole(AuthUser token) {
		List<AuthRole> list = new ArrayList<AuthRole>();
		if (Constants.APP_SUPER_USERNAME.equals(token.getUsername())) {// 系统管理员赋予系统角色
			DefaultAuthRole role = new DefaultAuthRole();
			role.setId(Constants.APP_SUPER_ID);
			role.setName(Constants.APP_SUPER_USERNAME);
			role.setCode(Constants.APP_SUPER_USERNAME);
			list.add(role);
		}
		return list;
	}

	@Override
	public List<AuthResource> findAuthResources(AuthUser token) {
		List<AuthResource> list = new ArrayList<AuthResource>();
		if (Constants.APP_SUPER_ID.equals(token.getId())) {
			AuthResource allResource = new AuthResource();// 系统管理员赋予所有权限
			allResource.setHttpMethod("ALL");
			allResource.setUri("/**/*");
			// allResource.setUri("/bdrp/auth/function/edit/{id}");//测试用
			list.add(allResource);
		}
		return list;
	}
}
