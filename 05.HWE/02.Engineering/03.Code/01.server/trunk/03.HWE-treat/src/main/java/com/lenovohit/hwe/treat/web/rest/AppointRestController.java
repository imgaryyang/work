package com.lenovohit.hwe.treat.web.rest;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hwe.org.web.rest.OrgBaseRestController;
import com.lenovohit.hwe.treat.model.Department;
import com.lenovohit.hwe.treat.service.HisAppointService;
import com.lenovohit.hwe.treat.transfer.RestListResponse;

// 预约挂号
@RestController
@RequestMapping("/hwe/treat/appoint")
public class AppointRestController extends OrgBaseRestController {
	@Autowired
	private HisAppointService hisAppointService;

	// 3.4.1 可预约科室分类树查询
	@RequestMapping(value = "/deptTree", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forDeptTree(@RequestParam(value = "data", defaultValue = "") String data) {
		try {
			log.info("\n======== forDeptTree Start ========\ndata:\n"+data);
			Department query =  JSONUtils.deserialize(data, Department.class);
			
			log.info("\n======== forDeptTree Before hisAppointService.findDeptList ========\nquery:\n"+JSONUtils.serialize(query));
			RestListResponse<Department> result=this.hisAppointService.findDeptList(query, null);
			
			log.info("\n======== forDeptTree After hisAppointService.findDeptList ========\nresult:\n"+JSONUtils.serialize(result));
			if (!result.isSuccess())		throw new BaseException("HIS返回失败："+result.getMsg());
			
			List<Department> deptList= result.getList();
			Map<String, Department> deptTree = new TreeMap<String,Department>();
			for(Department dept : deptList) {
				String type = dept.getType();
				Department deptType = deptTree.get(type);
				if (null == deptType) {
					deptType = new Department();
					deptType.setName(type);
					deptType.setType(type);
					deptType.setChildren(new ArrayList<Department>());
					deptType.getChildren().add(dept);
					deptTree.put(type, deptType);
				} else {
					deptType.getChildren().add(dept);
				}
			}
			
			log.info("\n======== forDeptTree Success End ========\nlist:\n"+JSONUtils.serialize(deptTree.values()));
			return ResultUtils.renderSuccessResult(deptTree.values());
		} catch (Exception e) {
			log.error("\n======== forDeptTree Failure End ========\nmsg:\n"+e.getMessage());
			return ResultUtils.renderFailureResult(e.getMessage());
		}
	}
}
