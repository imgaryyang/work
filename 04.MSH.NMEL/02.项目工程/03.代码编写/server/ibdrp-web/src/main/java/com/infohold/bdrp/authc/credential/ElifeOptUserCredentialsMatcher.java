package com.infohold.bdrp.authc.credential;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.credential.SimpleCredentialsMatcher;
import org.springframework.beans.factory.annotation.Autowired;

import com.infohold.bdrp.authority.model.AuthUser;
import com.infohold.bdrp.tools.security.SecurityUtil;
import com.infohold.bdrp.tools.security.impl.SecurityConstants;
import com.infohold.core.web.utils.WebUtils;

public class ElifeOptUserCredentialsMatcher extends SimpleCredentialsMatcher{
	
	protected transient final Log log = LogFactory.getLog(getClass());
	
	@Autowired
	private HttpServletRequest request_;
	
	 /**
     * This implementation acquires the {@code token}'s credentials
     * (via {@link #getCredentials(AuthenticationToken) getCredentials(token)})
     * and then the {@code account}'s credentials
     * (via {@link #getCredentials(org.apache.shiro.authc.AuthenticationInfo) getCredentials(account)}) and then passes both of
     * them to the {@link #equals(Object,Object) equals(tokenCredentials, accountCredentials)} method for equality
     * comparison.
     *
     * @param token the {@code AuthenticationToken} submitted during the authentication attempt.
     * @param info  the {@code AuthenticationInfo} stored in the system matching the token principal.
     * @return {@code true} if the provided token credentials are equal to the stored account credentials,
     *         {@code false} otherwise
     */
	@Override  
    public boolean doCredentialsMatch(AuthenticationToken token, AuthenticationInfo info) {  
		Map<String, String> params = new HashMap<String, String>();
		String random = (String) WebUtils.getSessionAttribute(request_, SecurityConstants.PARAM_KEY_LONIN_RANDOM);
		params.put(SecurityConstants.PARAM_KEY_LONIN_RANDOM, random);
		
		AuthUser au = (AuthUser)  info.getPrincipals().getPrimaryPrincipal();
		boolean result = SecurityUtil.verifyPin(SecurityConstants.PIN_TYPE_LOGIN, au.getId(), String.valueOf((char[])token.getCredentials()), String.valueOf(info.getCredentials()), params);
		log.info("用户【" + au.getId() + "】-【" + au.getUsername() + "】输入密码：【" + String.valueOf((char[])token.getCredentials())+ "】随机字符串【" + random + "】,存储密码为:【"+ info.getCredentials().toString()+"】，登录密码校验结果："+ result);
        result = true;
		return result;  
    }  
}
