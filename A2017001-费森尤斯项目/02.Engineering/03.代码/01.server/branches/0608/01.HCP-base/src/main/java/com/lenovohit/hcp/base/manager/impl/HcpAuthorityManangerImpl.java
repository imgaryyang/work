package com.lenovohit.hcp.base.manager.impl;

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
import com.lenovohit.hcp.base.model.HcpAccount;
import com.lenovohit.hcp.base.model.HcpRole;
import com.lenovohit.hcp.base.model.HcpUser;
@Repository("authorityMananger")
public class HcpAuthorityManangerImpl implements AuthorityMananger {
	
	@Autowired
	private GenericDao<HcpAccount,String> hcpAccountDao;
	@Autowired
	private GenericDao<HcpUser,String> hcpUserDao;
	@Autowired
	private GenericDao<HcpRole,String> hcpRoleDao;
	@Autowired
	private GenericDao<DefaultAuthRole,String> defaultAuthRoleDao;
	@Autowired
	private GenericDao<AuthRestResource,String> authRestResourceDao;
	
	@Override
	public List<? extends AuthAccount> getAccounts(String username) {
		return this.hcpAccountDao.find("from HcpAccount where username = ? ", username);
	}

	@Override
	public List<? extends AuthPrincipal> getPrincipals(AuthAccount account) {
		if(account instanceof HcpAccount ){
			HcpAccount hcpAccount = (HcpAccount)account;
			return hcpUserDao.find("from HcpUser where id = ? and active = ?", hcpAccount.getUserId(),true);
		}
		return null;
	}

	@Override
	public List<? extends AuthRole> findRolesBySubject(AuthPrincipal principal) {
		if(principal instanceof HcpUser ){
			HcpUser user = (HcpUser)principal;//left join real.role left join real.user
			return hcpRoleDao.find("select rela.role from HcpUserRoleRela rela  where rela.user.id = ? and rela.user.active = ?", user.getId(),true);
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
