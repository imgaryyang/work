package com.lenovohit.hcp.test.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lenovohit.bdrp.authority.web.rest.AuthorityRestController;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hcp.test.model.TestConsultDept;
import com.lenovohit.hcp.test.model.TestDepartment;

@RestController
@RequestMapping("/hcp/test/department")
public class DepartmentTestController extends AuthorityRestController{
	@Autowired
	private GenericManager<TestDepartment, String> testDepartmentManager;
	/**
	 * @param data
	 * @return  返回以type为key的科室map
	 */
	@RequestMapping(value = "/select", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forAppList(@RequestParam(value = "data", defaultValue = "") String data) {
		TestDepartment model = JSONUtils.deserialize(data, TestDepartment.class);
		StringBuilder sb = new StringBuilder(" from TestDepartment where 1=1 ");
		List<Object> cdList = new ArrayList<Object>();
		//cdList.add("1");
		if(model != null){
			if (model.getHosId() != null) {
				sb.append(" and hosId = ?");
				cdList.add(model.getHosId());
			}
		}
		sb.append(" order by type ");
		List<TestDepartment> list = this.testDepartmentManager.find(sb.toString(),cdList.toArray());
		
		//转换为Map
		TestConsultDept dept = new TestConsultDept();
		Map<String,List<TestDepartment>> map = new HashMap<String,List<TestDepartment>>();
		if(list!=null && list.size()>0){
			List<TestDepartment> dlist = new ArrayList<TestDepartment>();
			List<String> typelist = new ArrayList<String>();
			for(int i=0;i<list.size();i++){
				if(i==0){
					dlist.add(list.get(0));
					typelist.add(list.get(0).getType());
				}else{
					if(list.get(i-1).getType().equals(list.get(i).getType())){
						dlist.add(list.get(i));
					}else{
						List<TestDepartment> d = new ArrayList<TestDepartment>();
						d.addAll(dlist);
						map.put(list.get(i-1).getType()+"", d);
						dlist.clear();
						dlist.add(list.get(i));
						typelist.add(list.get(i).getType());
					}
				}
				if(i==list.size()-1){
					map.put(list.get(i).getType()+"", dlist);
				}
			}
			dept.setMap(map);
			dept.setTypeList(typelist);
			dept.setDeptList(list);
		}
		return ResultUtils.renderSuccessResult(dept);
	}

}
