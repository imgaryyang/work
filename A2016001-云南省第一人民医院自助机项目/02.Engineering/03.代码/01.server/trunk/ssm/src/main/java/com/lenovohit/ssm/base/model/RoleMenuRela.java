package com.lenovohit.ssm.base.model;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.lenovohit.core.model.BaseIdModel;

@Entity
@Table(name = "SSM_ROLE_MENU_RELA") // 人员基本信息';
public class RoleMenuRela extends BaseIdModel {
	/**
	 * 
	 */
	private static final long serialVersionUID = -6876844204986673475L;
	private Role role;
	private Menu menu;
	
	@JoinColumn(name = "MENU_ID")
	@ManyToOne
	public Menu getMenu() {
		return menu;
	}
	public void setMenu(Menu menu) {
		this.menu = menu;
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