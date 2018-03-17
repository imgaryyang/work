package com.lenovohit.hwe.mobile.zfb.mananger.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.stereotype.Repository;

import com.lenovohit.bdrp.authority.model.AuthAccount;
import com.lenovohit.bdrp.authority.model.AuthPrincipal;
import com.lenovohit.bdrp.authority.utils.AuthUtils;
import com.lenovohit.core.dao.GenericDao;
import com.lenovohit.hwe.mobile.zfb.configration.ZfbMpProperties;
import com.lenovohit.hwe.org.manager.impl.HweAuthorityManangerImpl;
import com.lenovohit.hwe.org.model.Account;

@EnableConfigurationProperties(ZfbMpProperties.class)
@Repository("zfbAuthorityMananger")
public class ZfbAuthorityManangerImpl extends HweAuthorityManangerImpl {
	
	@Autowired
	private GenericDao<Account,String> accountDao;
	@Autowired
	private ZfbMpProperties properties;
	@Override
	public String getNamespace(){
		return "zfb";
	}
	/**
	 * 支付宝userId登录时，userId为用户名，app的secret为密码用于身份认证
	 */
	@Override
	public List<? extends AuthAccount> getAccounts(String username) {
		List<Account> accounts = this.accountDao.find("from Account where username = ? ", username); 
		if(null != accounts){
			for(Account acc : accounts){
				System.out.println(acc.getUsername());
				acc.setPassword(properties.getPrivate_key());
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
