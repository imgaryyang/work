package com.lenovohit.ssm.treat.model;

import java.util.List;

public class HisDepartment {
	private String id;			//部门ID
	private String name;		//部门名称
	private String parentId;	//上级部门ID
	private List<HisDepartment> children;
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getParentId() {
		return parentId;
	}
	public void setParentId(String parentId) {
		this.parentId = parentId;
	}
	public List<HisDepartment> getChildren() {
		return children;
	}
	public void setChildren(List<HisDepartment> children) {
		this.children = children;
	}
}
