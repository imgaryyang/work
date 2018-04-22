package com.lenovohit.ssm.base.manager.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.lenovohit.bdrp.authority.manager.AuthorityMananger;
import com.lenovohit.bdrp.authority.model.AuthAccount;
import com.lenovohit.bdrp.authority.model.AuthPrincipal;
import com.lenovohit.bdrp.authority.model.AuthRole;
import com.lenovohit.bdrp.authority.model.impl.AuthRestResource;
import com.lenovohit.bdrp.authority.model.impl.DefaultAuthRole;
import com.lenovohit.core.dao.GenericDao;
import com.lenovohit.ssm.base.model.Account;
import com.lenovohit.ssm.base.model.Role;
import com.lenovohit.ssm.base.model.User;
@Repository("authorityMananger")
public class SsmAuthorityManangerImpl implements AuthorityMananger {
	
	@Autowired
	private GenericDao<Account,String> accountDao;
	@Autowired
	private GenericDao<User,String> userDao;
	@Autowired
	private GenericDao<Role,String> roleDao;
	@Autowired
	private GenericDao<DefaultAuthRole,String> defaultAuthRoleDao;
	@Autowired
	private GenericDao<AuthRestResource,String> authRestResourceDao;
	
	@Override
	public List<? extends AuthAccount> getAccounts(String username) {
		return this.accountDao.find("from Account where username = ? ", username);
	}

	@Override
	public List<? extends AuthPrincipal> getPrincipals(AuthAccount account) {
		if(account instanceof Account ){
			Account act = (Account)account;
			return userDao.find("from User where id = ? and active = ?", act.getUserId(),true);
		}
		return null;
	}

	@Override
	public List<? extends AuthRole> findRolesBySubject(AuthPrincipal principal) {
		if(principal instanceof User ){
			User user = (User)principal;//left join real.role left join real.user
			return roleDao.find("select rela.role from UserRoleRela rela  where rela.user.id = ? and rela.user.active = ?", user.getId(),true);
		}
		return defaultAuthRoleDao.find("select rela.role form DefaultAuthRoleUserRela rela where rela.user.id = ? ", principal.getId());
	}

	@Override
	public List<? extends AuthRestResource> findRestResourcesByRole(AuthRole role) {
		if(role instanceof SystemRole){
			List<AuthRestResource> list = new ArrayList<AuthRestResource>();
			AuthRestResource allResource = new AuthRestResource();//系统管理员赋予所有权限
			allResource.setMethod("ALL");
			allResource.setUri("/**");
			//allResource.setUri("/bdrp/auth/function/edit/{id}");//测试用
			list.add(allResource);
			return list;
		}
		return authRestResourceDao.find("select rela.resource form DefaultAuthRoleResourceRela rela where rela.role.id = ? ", role.getId());
	}
	
	private class SystemRole implements AuthRole{

		@Override
		public String getId() {
			return "system";
		}

		@Override
		public void setId(String id) {}

		@Override
		public String getCode() {
			return "system";
		}

		@Override
		public void setCode(String code) {}

		@Override
		public String getName() {
			return "system";
		}

		@Override
		public void setName(String name) {}
		
	}

}
