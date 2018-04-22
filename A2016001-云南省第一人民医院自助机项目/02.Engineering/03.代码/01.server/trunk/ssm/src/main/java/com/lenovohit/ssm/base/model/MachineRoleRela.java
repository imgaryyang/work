package com.lenovohit.ssm.base.model;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.lenovohit.core.model.BaseIdModel;

@Entity
@Table(name = "SSM_MACHINE_ROLE_RELA") // 人员基本信息';
public class MachineRoleRela extends BaseIdModel {
	private static final long serialVersionUID = -6876844204986673475L;
	private Machine machine;
	private Role role;
	
	@JoinColumn(name = "MACHINE_ID")
	@ManyToOne
	public Machine getMachine() {
		return machine;
	}
	public void setMachine(Machine machine) {
		this.machine = machine;
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