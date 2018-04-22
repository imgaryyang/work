package com.lenovohit.ssm.treat.model;

import java.util.List;

public class Department {
	private String id;			//部门ID
	private String parentId;	//上级部门ID
	private String code; 		//部门代码
	private String name;		//部门名称
	private String desc;		//部门介绍
	private List<Department> children;
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
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
	public String getParentId() {
		return parentId;
	}
	public void setParentId(String parentId) {
		this.parentId = parentId;
	}
	public List<Department> getChildren() {
		return children;
	}
	public void setChildren(List<Department> children) {
		this.children = children;
	}
	public String getDesc() {
		return desc;
	}
	public void setDesc(String desc) {
		this.desc = desc;
	}
	
}
