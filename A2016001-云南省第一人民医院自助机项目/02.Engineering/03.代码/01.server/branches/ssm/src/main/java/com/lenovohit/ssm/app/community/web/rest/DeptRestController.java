package com.lenovohit.ssm.app.community.web.rest;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.rest.BaseRestController;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.ssm.app.community.model.ConsultDept;
import com.lenovohit.ssm.app.elh.base.model.AppDepartment;

@RestController
@RequestMapping("/hwe/app/department")
public class DeptRestController extends BaseRestController{
	
	@Autowired
	private GenericManager<AppDepartment, String> appDepartmentManager;
	/**
	 * @param data
	 * @return  返回以type为key的科室map
	 */
	@RequestMapping(value = "/select", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forAppList(@RequestParam(value = "data", defaultValue = "") String data) {
		AppDepartment model = JSONUtils.deserialize(data, AppDepartment.class);
		StringBuilder sb = new StringBuilder(" from AppDepartment where 1=1 ");
		List<Object> cdList = new ArrayList<Object>();
		//cdList.add("1");
		if(model != null){
			if (model.getHospitalId() != null) {
				sb.append(" and hospitalId = ?");
				cdList.add(model.getHospitalId());
			}
			
		}
		sb.append(" order by type ");
		List<AppDepartment> list = this.appDepartmentManager.find(sb.toString(),cdList.toArray());
		
		//转换为Map
		ConsultDept dept = new ConsultDept();
		Map<String,List<AppDepartment>> map = new HashMap<String,List<AppDepartment>>();
		if(list!=null && list.size()>0){
			List<AppDepartment> dlist = new ArrayList<AppDepartment>();
			List<String> typelist = new ArrayList<String>();
			for(int i=0;i<list.size();i++){
				
				if(i==0){
					dlist.add(list.get(0));
					typelist.add(list.get(0).getType());
				}else{
					if(list.get(i-1).getType().equals(list.get(i).getType())){
						dlist.add(list.get(i));
					}else{
						List<AppDepartment> d = new ArrayList<AppDepartment>();
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
