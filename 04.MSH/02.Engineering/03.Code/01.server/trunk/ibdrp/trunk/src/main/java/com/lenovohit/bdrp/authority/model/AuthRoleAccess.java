package com.lenovohit.bdrp.authority.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import com.lenovohit.core.model.BaseModel;
import com.lenovohit.core.utils.StringUtils;
@Entity
@Table(name = "IH_ROLE_ACC")
public class AuthRoleAccess extends BaseModel{
	/**
	 * 
	 */
	private static final long serialVersionUID = -2814212420886950230L;
//	private AuthRole role;
//	private AuthzAccess access;
//	@Id
//	@ManyToOne(cascade = CascadeType.REFRESH, fetch = FetchType.LAZY, optional = true)
//	@JoinColumn(name = "RID")
//	public AuthRole getRole() {
//		return role;
//	}
//	public void setRole(AuthRole role) {
//		this.role = role;
//	}
//	@Id
//	@ManyToOne(cascade = CascadeType.REFRESH, fetch = FetchType.LAZY, optional = true)
//	@JoinColumn(name = "AID")
//	public AuthzAccess getAccess() {
//		return access;
//	}
//	public void setAccess(AuthzAccess access) {
//		this.access = access;
//	}
	private String roleId;
	private String accessId;
	@Id
	@Column(name = "RID", nullable = false, length = 32)
	public String getRoleId() {
		return roleId;
	}
	public void setRoleId(String roleId) {
		this.roleId = roleId;
	}
	@Id
	@Column(name = "AID", nullable = false, length = 32)
	public String getAccessId() {
		return accessId;
	}
	public void setAccessId(String accessId) {
		this.accessId = accessId;
	}
	@Override
	public boolean _newObejct() {
		return StringUtils.isNoneEmpty(this.roleId) && StringUtils.isNoneEmpty(this.roleId);
	}
	
}
