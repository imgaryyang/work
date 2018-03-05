/***********************************************************************
 * Module:  PerMng.java
 * Author:  wod
 * Purpose: Defines the Class PerMng
 ***********************************************************************/
package com.infohold.els.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.infohold.core.model.BaseIdModel;
import com.infohold.core.utils.StringUtils;

@Entity
@Table(name = "ELS_STUB_TEMPLATEINFO")
public class StubTemplateinfo extends BaseIdModel {
	private static final long serialVersionUID = -3040277135292447199L;

	private String templateId;
	private String template;
	private int seqNo;
	private String item;
	private String isAmt;
	private String ioFlag;

	
	@Column(name = "TEMPLATE", length = 48)
	public String getTemplate() {
		return template;
	}

	public void setTemplate(String template) {
		this.template = template;
	}

	@Column(name = "TEMPLATE_ID", length = 32)
	public String getTemplateId() {
		return templateId;
	}

	public void setTemplateId(String templateId) {
		this.templateId = templateId;
	}

	@Column(name = "SEQNO")
	public int getSeqNo() {
		return seqNo;
	}

	public void setSeqNo(int seqNo) {
		this.seqNo = seqNo;
	}

	@Column(name = "ITEM", length = 48)
	public String getItem() {
		return item;
	}

	public void setItem(String item) {
		this.item = item;
	}

	@Column(name = "IS_AMT", length = 1)
	public String getIsAmt() {
		return isAmt;
	}

	public void setIsAmt(String isAmt) {
		this.isAmt = isAmt;
	}

	@Column(name = "IOFLAG", length = 1)
	public String getIoFlag() {
		return ioFlag;
	}

	public void setIoFlag(String ioFlag) {
		this.ioFlag = ioFlag;
	}

	@Transient
	@Override
	public boolean isNew() {
		return StringUtils.isEmpty(this.id);
	}

}