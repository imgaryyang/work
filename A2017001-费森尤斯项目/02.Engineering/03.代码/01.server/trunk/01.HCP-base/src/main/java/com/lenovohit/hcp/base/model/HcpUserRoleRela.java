package com.lenovohit.hcp.base.model;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.lenovohit.core.model.BaseIdModel;

@Entity
@Table(name = "HCP_USER_ROLE_RELA") // 人员基本信息';
public class HcpUserRoleRela extends BaseIdModel {
	/**
	 * 
	 */
	private static final long serialVersionUID = -6876844204986673475L;
	private HcpUser user;
	private HcpRole role;
	
	@JoinColumn(name = "USER_ID")
	@ManyToOne
	public HcpUser getUser() {
		return user;
	}
	public void setUser(HcpUser user) {
		this.user = user;
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