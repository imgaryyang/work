package com.lenovohit.ssm.base.model;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.lenovohit.core.model.BaseIdModel;

@Entity
@Table(name = "SSM_OPERATOR_ROLE_RELA") // 人员基本信息';
public class OperatorRoleRela extends BaseIdModel {
	/**
	 * 
	 */
	private static final long serialVersionUID = -6876844204986673475L;
	private Operator operator;
	private Role role;
	
	@JoinColumn(name = "OPERATOR_ID")
	@ManyToOne
	public Operator getOperator() {
		return operator;
	}
	public void setOperator(Operator operator) {
		this.operator = operator;
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