package com.infohold.bdrp.authority.shiro.authc;

import org.apache.shiro.authc.UsernamePasswordToken;

import com.infohold.bdrp.authority.model.AuthUser;

/**
 * shiro的api中提到出于安全考虑 UsernamePasswordToken的password使用char[]存储,<br>
 * 因此清除user的password字段，在token的password中转存
 * 
 * @author xiaweiyi
 *
 */
public class AuthUserToken<T extends AuthUser> extends UsernamePasswordToken {

	private static final long serialVersionUID = -4854567352059710901L;

	private T user;

	public AuthUserToken(){
		super();
	}
	
	public AuthUserToken(T user){
		super(user.getUsername(),user.getPassword());
		this.user = user;
	}
	
	public T getUser() {
		return user;
	}

	@Override
	public T getPrincipal() {
		return user;
	}

	public String getPasswordString() {
		return String.valueOf(super.getPassword());
	}

	public void clear() {
		this.user = null;
		super.clear();
	}

	public String toString() {
		return super.toString();
	}
}
