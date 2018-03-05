package com.lenovohit.bdrp.authority.model;

import javax.persistence.Transient;

import com.lenovohit.core.model.BaseIdModel;
import com.lenovohit.core.utils.StringUtils;

public class DefaultAuthRole extends BaseIdModel implements AuthRole{
	/**
	 * 
	 */
	private static final long serialVersionUID = -7816150963141599428L;

	private String name;
	private String code;
	private String memo;

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
}
