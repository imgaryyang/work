package com.lenovohit.hcp.base.model;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.lenovohit.core.model.BaseIdModel;

@Entity
@Table(name = "HCP_ROLE_MENU_RELA") // 人员基本信息';
public class HcpRoleMenuRela extends BaseIdModel {
	/**
	 * 
	 */
	private static final long serialVersionUID = -6876844204986673475L;
	private HcpRole role;
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
	public HcpRole getRole() {
		return role;
	}
	public void setRole(HcpRole role) {
		this.role = role;
	}
}