package com.lenovohit.ssm.app.elh.base.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.lenovohit.bdrp.authority.model.AuthRole;
import com.lenovohit.core.model.BaseIdModel;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.ssm.base.model.Org;

@Entity
@Table(name="IH_BASE_ROLE")
public class AppRole extends BaseIdModel implements AuthRole {
	private static final long serialVersionUID = -7816150963141599428L;

	private String name;
	private String code;
	private String memo;
	private String orgId;
	private Org org;

//	@ManyToOne(cascade = CascadeType.REFRESH, fetch = FetchType.LAZY, optional = true)
//	@JoinColumn(name = "ORGID")
	@Transient
	public Org getOrg() {
		return org;
	}

	public void setOrg(Org org) {
		this.org = org;
	}

	public String getMemo() {
		return memo;
	}

	public void setMemo(String memo) {
		this.memo = memo;
	}

	@Transient
	public String getCode() {
		if(null == code){
			return StringUtils.CnToSpell.getFullSpell(this.name);
		}
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
	
	@Column(name="ORGID")
	public String getOrgId() {
		return orgId;
	}

	public void setOrgId(String orgId) {
		this.orgId = orgId;
	}
	
	
}
