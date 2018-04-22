package com.lenovohit.ssm.base.model;

import javax.persistence.Entity;
import javax.persistence.Table;

import com.lenovohit.bdrp.authority.model.AuthAccount;
import com.lenovohit.bdrp.authority.model.impl.DefaultAuthAccount;
import com.lenovohit.core.model.BaseIdModel;
import com.lenovohit.core.utils.BeanUtils;
@Entity 
@Table(name = "SSM_ACCOUNT")//账户基本信息，用于登录;
public class Account extends BaseIdModel implements AuthAccount {

	/**
	 * 
	 */
	private static final long serialVersionUID = -7731028339917101932L;
	private String username;	//用户名，用户登录系统的登录名
	private String password;	//密码
	private String userId;		//用户ID
	private String type;		//用户类型
	private String status;		//账户状态
	
	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}

	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}

	@Override
	public AuthAccount clone() {
		try {
			Object clone = super.clone();
			AuthAccount cloned = (AuthAccount)clone;
			return cloned;
		} catch (CloneNotSupportedException e) {
			DefaultAuthAccount target = new DefaultAuthAccount();
			BeanUtils.copyProperties(this, target);
			return target;
		}
	}
}