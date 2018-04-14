package com.lenovohit.ssm.base.model;


import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.Table;

import com.lenovohit.bdrp.authority.model.AuthRole;
import com.lenovohit.core.model.BaseIdModel;
import com.lenovohit.core.utils.BeanUtils;

@Entity
@Table(name = "SSM_ROLE") // 人员基本信息';
public class Role extends BaseIdModel implements AuthRole {
	/**
	 * 
	 */
	private static final long serialVersionUID = -6902228056157687846L;
	private String hosId;
	private String code;
	private String name;
	private String type;
	private String parent;
	private String description;
	private String creator;
	private Date createTime;
	private String updater;
	private Date updateTime;

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}
	public String getHosId() {
		return hosId;
	}

	public void setHosId(String hosId) {
		this.hosId = hosId;
	}
	public String getCode() {
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

	public String getParent() {
		return parent;
	}

	public void setParent(String parent) {
		this.parent = parent;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getCreator() {
		return creator;
	}

	public void setCreator(String creator) {
		this.creator = creator;
	}

	public Date getCreateTime() {
		return createTime;
	}

	public void setCreateTime(Date createTime) {
		this.createTime = createTime;
	}

	public String getUpdater() {
		return updater;
	}

	public void setUpdater(String updater) {
		this.updater = updater;
	}

	public Date getUpdateTime() {
		return updateTime;
	}

	public void setUpdateTime(Date updateTime) {
		this.updateTime = updateTime;
	}

	@Override
	public AuthRole clone() {
		try {
			Object clone = super.clone();
			return (Role) clone;
		} catch (CloneNotSupportedException e) {
			Role target = new Role();
			BeanUtils.copyProperties(this, target);
			return target;
		}
	}
}