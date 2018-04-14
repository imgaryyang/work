package com.lenovohit.hwe.org.web.rest;

import org.apache.shiro.authz.UnauthenticatedException;

import com.lenovohit.bdrp.authority.model.AuthPrincipal;
import com.lenovohit.bdrp.authority.web.rest.AuthorityRestController;
import com.lenovohit.hwe.org.model.User;

public class OrgBaseRestController  extends AuthorityRestController{
	protected  User getCurrentUser(){
		AuthPrincipal user = this.getCurrentPrincipal();
		if(null == user){
			throw new UnauthenticatedException("当前无登录用户");
		}
		if(!(user instanceof User)){
			User _user = new User();
			_user.setId(user.getId());
			_user.setName(user.getName());
			return _user;
		}
		return (User)user;
	}
}



