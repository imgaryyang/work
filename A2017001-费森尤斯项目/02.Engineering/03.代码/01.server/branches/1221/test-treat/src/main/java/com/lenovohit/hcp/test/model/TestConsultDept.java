package com.lenovohit.hcp.test.model;

import java.util.List;
import java.util.Map;

public class TestConsultDept {
	private Map<String,List<TestDepartment>> map;
	private List<String> typeList;
	private List<TestDepartment> deptList;
	public List<String> getTypeList() {
		return typeList;
	}
	public void setTypeList(List<String> typeList) {
		this.typeList = typeList;
	}
	public List<TestDepartment> getDeptList() {
		return deptList;
	}
	public void setDeptList(List<TestDepartment> deptList) {
		this.deptList = deptList;
	}
	public Map<String, List<TestDepartment>> getMap() {
		return map;
	}
	public void setMap(Map<String, List<TestDepartment>> map) {
		this.map = map;
	}

}
