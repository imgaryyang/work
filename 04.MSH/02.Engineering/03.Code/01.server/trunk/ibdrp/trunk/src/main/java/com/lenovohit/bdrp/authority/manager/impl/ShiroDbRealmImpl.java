package com.lenovohit.bdrp.authority.manager.impl;

import java.util.List;

import javax.annotation.PostConstruct;

import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.SimpleAuthenticationInfo;
import org.apache.shiro.authc.UnknownAccountException;
import org.apache.shiro.authc.credential.CredentialsMatcher;
import org.apache.shiro.authc.credential.SimpleCredentialsMatcher;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.Permission;
import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.apache.shiro.cache.CacheManager;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.subject.PrincipalCollection;
import org.apache.shiro.util.ByteSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.lenovohit.bdrp.Constants;
import com.lenovohit.bdrp.authority.dao.AuthorityDao;
import com.lenovohit.bdrp.authority.dao.impl.DefaultAuthorityDaoImpl;
import com.lenovohit.bdrp.authority.model.AuthResource;
import com.lenovohit.bdrp.authority.model.AuthRole;
import com.lenovohit.bdrp.authority.model.AuthUser;
import com.lenovohit.bdrp.authority.shiro.authc.AuthUserToken;
import com.lenovohit.bdrp.authority.shiro.authc.NoPasswordException;
import com.lenovohit.bdrp.authority.shiro.authc.RestPermission;
import com.lenovohit.core.utils.SpringUtils;
import com.lenovohit.core.utils.StringUtils;

@Service("shiroDbRealm")
public class ShiroDbRealmImpl extends AuthorizingRealm {

	@Autowired(required=false)
	protected AuthorityDao<?, ?> authorityDao;
	
	protected AuthorityDao<AuthUser, AuthRole> defaultAuthorityDao = new DefaultAuthorityDaoImpl();

	@Value("${app.sercurity.credentials.matcher.name:hashCredentialsMatcher}")
	private String credentialsMatcherBeanName;

	public ShiroDbRealmImpl() {
		this(null, null);
	}

	public ShiroDbRealmImpl(CacheManager cacheManager) {
		this(cacheManager, null);
	}

	public ShiroDbRealmImpl(CredentialsMatcher matcher) {
		this(null, matcher);
	}

	public ShiroDbRealmImpl(CacheManager cacheManager, CredentialsMatcher matcher) {
		super(cacheManager, matcher);
		this.setAuthenticationTokenClass(AuthUserToken.class);
	}

	/**
	 * 认证回调函数,登录时调用.
	 */
	@Override
	protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken authcToken)
			throws AuthenticationException {
		
		if(null == getCredentialsMatcher()){
			this.initCredentialsMatcher();
		}
		
		AuthUser authUser = this.getAuthUser((AuthUser)authcToken.getPrincipal());
		if(StringUtils.isBlank(authUser.getPassword())){
			throw new NoPasswordException();
		}
		SimpleAuthenticationInfo sai = new SimpleAuthenticationInfo(authUser, authUser.getPassword(), ByteSource.Util.bytes(authcToken.getCredentials()),getName());
		return sai;// 返回的info与token比较产生结果
	}

	/**
	 * 授权查询回调函数, 进行鉴权但缓存中无用户的授权信息时调用.
	 */
	@Override
	protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principals) {
		AuthUser user = (AuthUser) principals.getPrimaryPrincipal();
		SimpleAuthorizationInfo info = this.initAuthorizationInfo(user);
		return info;
	}

	private SimpleAuthorizationInfo initAuthorizationInfo(AuthUser user) {
		SimpleAuthorizationInfo info = new SimpleAuthorizationInfo();
		List<AuthRole> roles = (List<AuthRole>) this.getRoles(user);
		if (roles == null)
			return info;
		for (AuthRole role : roles) {
			info.addRole(role.getCode());
		}
		List<AuthResource> resources = this.getResources(user);
		for (AuthResource resource : resources) {
			info.addObjectPermission(createURIPermission(resource));
		}
		return info;
	}

	private Permission createURIPermission(AuthResource resource) {
		return new RestPermission(resource);
	}

	/**
	 * 设定Password校验的Matcher
	 */
	@PostConstruct
	public void initCredentialsMatcher() {
		SimpleCredentialsMatcher matcher = (SimpleCredentialsMatcher) SpringUtils
				.loadBeanByName(this.credentialsMatcherBeanName);
		setCredentialsMatcher(matcher);
	}

	private List<AuthResource> getResources(AuthUser user) {
		return getAuthorityDao(user).findAuthResources(user);
	}

	private List<?> getRoles(AuthUser user) {
		return getAuthorityDao(user).findAuthRole(user);
	}
	
	
	private AuthUser getAuthUser(AuthUser tokenUser) {
		List<AuthUser> users = (List<AuthUser>) getAuthorityDao(tokenUser).findAuthUser(tokenUser);
		if (null == users || users.size() == 0) {
			// 没有查到用户
			throw new UnknownAccountException("there is no user name is " + tokenUser.getUsername());
		} else if (users.size() > 1) {
			// 查询到多个用户
			throw new UnknownAccountException("there is more than one user name is " + tokenUser.getUsername());
		} else {
			return users.get(0);
		}
	}

	private AuthorityDao<?, ?> getAuthorityDao(AuthUser tokenUser) {
		if(Constants.APP_SUPER_USERNAME.equals(tokenUser.getUsername())){
			return this.defaultAuthorityDao;
		}
		if (null != this.authorityDao) {
			return this.authorityDao;
		}
		return this.defaultAuthorityDao;
	}

}
