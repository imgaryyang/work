/***********************************************************************
 * Module:  PerMng.java
 * Author:  wod
 * Purpose: Defines the Class PerMng
 ***********************************************************************/
package com.infohold.els.model;

import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.infohold.core.model.BaseIdModel;
import com.infohold.core.utils.StringUtils;

@Entity
@Table(name = "ELS_STUB_TEMPLATE")
public class StubTemplate extends BaseIdModel {
	private static final long serialVersionUID = -3040277135292447199L;

	private String orgId;
	private String template;
	private String createAt;
	private List<StubTemplateinfo> stubTemplateinfos;

	@Column(name = "ORG_ID", length = 32)
	public String getOrgId() {
		return orgId;
	}

	public void setOrgId(String orgId) {
		this.orgId = orgId;
	}

	@Column(name = "TEMPLATE", length = 48)
	public String getTemplate() {
		return template;
	}

	public void setTemplate(String template) {
		this.template = template;
	}

	@Column(name = "CREATE_AT", length = 19)
	public String getCreateAt() {
		return createAt;
	}

	public void setCreateAt(String createAt) {
		this.createAt = createAt;
	}
	
	@Transient
	public List<StubTemplateinfo> getStubTemplateinfos() {
		return stubTemplateinfos;
	}

	public void setStubTemplateinfos(List<StubTemplateinfo> stubTemplateinfos) {
		this.stubTemplateinfos = stubTemplateinfos;
	}

	@Transient
	public boolean isNew() {
		return StringUtils.isEmpty(this.id);
	}

}