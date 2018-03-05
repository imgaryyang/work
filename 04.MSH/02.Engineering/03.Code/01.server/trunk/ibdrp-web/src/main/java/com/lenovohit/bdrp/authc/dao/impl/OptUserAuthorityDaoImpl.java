package com.lenovohit.bdrp.authc.dao.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.lenovohit.bdrp.authority.dao.AuthorityDao;
import com.lenovohit.bdrp.authority.model.AuthResource;
import com.lenovohit.bdrp.authority.model.AuthUser;
import com.lenovohit.bdrp.org.model.OptUser;
import com.lenovohit.bdrp.org.model.Role;
import com.lenovohit.core.dao.GenericDao;
import com.lenovohit.core.utils.StringUtils;

//TODO 熟悉url匹配规则后给system添加通配resource而不是添加超级权限。
@Repository("authorityDao")
public class OptUserAuthorityDaoImpl implements AuthorityDao<OptUser, Role> {

	@Autowired
	private GenericDao<OptUser, String> optUserDao;
	
	@Autowired
	private GenericDao<Role, String> roleDao;
	
	@Autowired
	private GenericDao<AuthResource, String> authResourceDao;

	@Override
	public List<OptUser> findAuthUser(AuthUser token) {
		return this.optUserDao.find("from OptUser where username = ?  ", token.getUsername());
	}

	@Override
	public List<Role> findAuthRole(AuthUser token) {
		String jql = "select pr.role from PersonRole pr  where pr.person.id = ? ";
		return this.roleDao.find(jql, ((OptUser)token).getPersonId());
	}

	@Override
	public List<AuthResource> findAuthResources(AuthUser token) {
		List<AuthResource> resources = new ArrayList<AuthResource>();
		StringBuilder sqlSb = new StringBuilder();
		sqlSb.append("select res.ID, res.URI,res.HTTP_METHOD ");
		sqlSb.append("from IH_RESOURCE res,IH_ACCESS_RES  acr, IH_ROLE_ACC rac ");
		sqlSb.append("where res.id=acr.rid and acr.aid=rac.aid ");
		sqlSb.append("and rac.rid in ( ");
		sqlSb.append("select r.id from IH_BASE_ROLE r,IH_PERSON_ROLE pr ");
		sqlSb.append("where r.orgid is null or (r.id=pr.rid and  pr.id= ? ) ");
		sqlSb.append(")");
				
		@SuppressWarnings("unchecked")
		List<Object[]> result = (List<Object[]>) this.authResourceDao.findBySql(sqlSb.toString(), token.getId());
		AuthResource resource = null;
		for (Object[] row : result) {
			resource = new AuthResource();
			resource.setId(StringUtils.convertToString(row[0]));
			resource.setUri(StringUtils.convertToString(row[1]));
			resource.setHttpMethod(StringUtils.convertToString(row[2]));
			resources.add(resource);
			resource = null;
		}
		resource = new AuthResource();
		resource.setId("all");
		resource.setUri("/**/*");
		resource.setHttpMethod("ALL");
		resources.add(resource);
		return resources;
	}
}
