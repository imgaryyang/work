package com.lenovohit.ssm.app.community.model;

import java.util.List;
import java.util.Map;

import com.lenovohit.ssm.app.elh.base.model.AppDepartment;

public class ConsultDept {
	private Map<String,List<AppDepartment>> map;
	private List<String> typeList;
	private List<AppDepartment> deptList;
	public List<String> getTypeList() {
		return typeList;
	}
	public void setTypeList(List<String> typeList) {
		this.typeList = typeList;
	}
	public List<AppDepartment> getDeptList() {
		return deptList;
	}
	public void setDeptList(List<AppDepartment> deptList) {
		this.deptList = deptList;
	}
	public Map<String, List<AppDepartment>> getMap() {
		return map;
	}
	public void setMap(Map<String, List<AppDepartment>> map) {
		this.map = map;
	}
	
	

}
