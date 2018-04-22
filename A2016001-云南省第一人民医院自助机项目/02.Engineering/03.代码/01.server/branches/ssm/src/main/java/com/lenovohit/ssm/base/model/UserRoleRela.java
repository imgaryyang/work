package com.lenovohit.ssm.base.model;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.lenovohit.core.model.BaseIdModel;

@Entity
@Table(name = "SSM_USER_ROLE_RELA") // 人员基本信息';
public class UserRoleRela extends BaseIdModel {
	/**
	 * 
	 */
	private static final long serialVersionUID = -6876844204986673475L;
	private User user;
	private Role role;
	
	@JoinColumn(name = "USER_ID")
	@ManyToOne
	public User getUser() {
		return user;
	}
	public void setUser(User user) {
		this.user = user;
	}
	@JoinColumn(name = "ROLE_ID")
	@ManyToOne
	public Role getRole() {
		return role;
	}
	public void setRole(Role role) {
		this.role = role;
	}
}