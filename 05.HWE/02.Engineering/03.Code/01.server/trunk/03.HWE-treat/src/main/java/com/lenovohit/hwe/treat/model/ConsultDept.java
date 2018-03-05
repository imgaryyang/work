package com.lenovohit.hwe.treat.model;

import java.util.List;
import java.util.Map;

public class ConsultDept {
	private Map<String,List<Department>> map;
	private List<String> typeList;
	private List<Department> deptList;
	public List<String> getTypeList() {
		return typeList;
	}
	public void setTypeList(List<String> typeList) {
		this.typeList = typeList;
	}
	public List<Department> getDeptList() {
		return deptList;
	}
	public void setDeptList(List<Department> deptList) {
		this.deptList = deptList;
	}
	public Map<String, List<Department>> getMap() {
		return map;
	}
	public void setMap(Map<String, List<Department>> map) {
		this.map = map;
	}

}
