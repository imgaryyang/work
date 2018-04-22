package com.lenovohit.ssm.app.community.web.rest;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lenovohit.core.dao.Page;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.rest.BaseRestController;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.ssm.app.elh.base.model.Doctor;
import com.lenovohit.ssm.app.elh.base.model.DoctorDuty;

@RestController
@RequestMapping("/hwe/app/doctor")
public class DoctorByDeptRestController extends BaseRestController{
	
	@Autowired
	private GenericManager<Doctor, String> doctorManager;
	@Autowired
	private GenericManager<DoctorDuty, String> doctorDutyManager;
	
	/**
	 * ELH_HOSP_009 查询医生列表 HMP1.3 1
	 * 
	 * @param start
	 * @param pageSize
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/listByDept/{start}/{pageSize}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forAppList(@PathVariable(value = "start") int start,
			@PathVariable(value = "pageSize") int pageSize,
			@RequestParam(value = "data", defaultValue = "") String data) {
		Doctor doctor = JSONUtils.deserialize(data, Doctor.class);
		
		StringBuilder sb = new StringBuilder(" from Doctor where 1=1");
		List<String> cdList = new ArrayList<String>();
		if (doctor!=null && StringUtils.isNoneBlank(doctor.getHospitalId())) {
			sb.append(" and hospitalId = ?");
			cdList.add(doctor.getHospitalId());
		}
		if (doctor!=null && StringUtils.isNoneBlank(doctor.getDepartmentId())) {
			sb.append(" and departmentId = ?");
			cdList.add(doctor.getDepartmentId());
		}
		if (doctor!=null && StringUtils.isNoneBlank(doctor.getIsExpert())) {
			sb.append(" and isExpert = ?");
			cdList.add(doctor.getIsExpert());
		}
		sb.append(" order by sortno");
		
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(pageSize);
		page.setQuery(sb.toString());
		page.setValues(cdList.toArray());
		this.doctorManager.findPage(page);
		
		return ResultUtils.renderSuccessResult(page);
	}

}
