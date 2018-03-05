package com.lenovohit.hcp.base.web.rest;

import org.apache.shiro.authz.UnauthenticatedException;

import com.lenovohit.bdrp.authority.model.AuthPrincipal;
import com.lenovohit.bdrp.authority.web.rest.AuthorityRestController;
import com.lenovohit.hcp.base.model.HcpUser;

public class HcpBaseRestController  extends AuthorityRestController{
	protected  HcpUser getCurrentUser(){
		AuthPrincipal user = this.getCurrentPrincipal();
		if(null == user){
			throw new UnauthenticatedException("当前无登录用户");
		}
		if(!(user instanceof HcpUser)){
			HcpUser hcpUser = new HcpUser();
			hcpUser.setId(user.getId());
			hcpUser.setName(user.getName());
			return hcpUser;
		}
		return (HcpUser)user;
	}
}
