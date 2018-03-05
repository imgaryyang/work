package com.lenovohit.hwe.mobile.weixin.mananger.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.stereotype.Repository;

import com.lenovohit.bdrp.authority.model.AuthAccount;
import com.lenovohit.bdrp.authority.model.AuthPrincipal;
import com.lenovohit.bdrp.authority.utils.AuthUtils;
import com.lenovohit.core.dao.GenericDao;
import com.lenovohit.hwe.org.manager.impl.HweAuthorityManangerImpl;
import com.lenovohit.hwe.org.model.Account;
import com.lenovohit.hwe.mobile.weixin.configration.WeixinMpProperties;

@EnableConfigurationProperties(WeixinMpProperties.class)
@Repository("weixinAuthorityMananger")
public class WeixinAuthorityManangerImpl extends HweAuthorityManangerImpl {
	
	@Autowired
	private GenericDao<Account,String> accountDao;
	@Autowired
	private WeixinMpProperties properties;
	@Override
	public String getNamespace(){
		return "weixin";
	}
	/**
	 * 微信openid登录时，openid为用户名，app的secret为密码用于身份认证
	 */
	@Override
	public List<? extends AuthAccount> getAccounts(String username) {
		List<Account> accounts = this.accountDao.find("from Account where username = ? ", username); 
		if(null != accounts){
			for(Account acc : accounts){
				System.out.println(acc.getUsername());
				acc.setPassword(properties.getSecret());
				AuthUtils.encryptAccount(acc);
			}
		}
		return accounts;
	}
	@Override
	public List<? extends AuthPrincipal> getPrincipals(AuthAccount account) {
		System.out.println("...............................");
		return super.getPrincipals(account);
	}

}
