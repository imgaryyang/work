package com.lenovohit.hwe.treat.web.rest;

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
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hwe.org.web.rest.OrgBaseRestController;
import com.lenovohit.hwe.treat.model.Doctor;

@RestController
@RequestMapping("/hwe/treat/doctor")
public class DoctorByDeptRestController extends OrgBaseRestController{
	
	@Autowired
	private GenericManager<Doctor, String> doctorManager;
	
	/**
	 * ELH_HOSP_009 查询医生列表 HMP1.3 1
	 * 
	 * @param start
	 * @param pageSize
	 * @param data
	 * @returnin
	 */
	@RequestMapping(value = "/listByDept/{start}/{pageSize}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forAppList(@PathVariable(value = "start") int start,
			@PathVariable(value = "pageSize") int pageSize,
			@RequestParam(value = "data", defaultValue = "") String data) {
		Doctor doctor = JSONUtils.deserialize(data, Doctor.class);
		
		StringBuilder sb = new StringBuilder(" from Doctor where 1=1");
		List<String> cdList = new ArrayList<String>();
		if (doctor!=null && StringUtils.isNoneBlank(doctor.getHosId())) {
			sb.append(" and hosId = ?");
			cdList.add(doctor.getHosId());
		}
		if (doctor!=null && StringUtils.isNoneBlank(doctor.getDepId())) {
			sb.append(" and depId = ?");
			cdList.add(doctor.getDepId());
		}
		if (doctor!=null && StringUtils.isNoneBlank(doctor.getIsExpert())) {
			sb.append(" and isExpert = ?");
			cdList.add(doctor.getIsExpert());
		}
		sb.append(" order by sort");
		
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(pageSize);
		page.setQuery(sb.toString());
		page.setValues(cdList.toArray());
		this.doctorManager.findPage(page);
		
		return ResultUtils.renderSuccessResult(page);
	}

	
	/**
	 * ELH_HOSP_009 查询医生列表 HMP1.3 1
	 * 
	 * @param start
	 * @param pageSize
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/listByHospital/{start}/{pageSize}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forListByHospital(@PathVariable(value = "start") int start,
			@PathVariable(value = "pageSize") int pageSize,
			@RequestParam(value = "data", defaultValue = "") String data) {
		Doctor doctor = JSONUtils.deserialize(data, Doctor.class);
		
		StringBuilder sb = new StringBuilder(" from Doctor where 1=1");
		List<String> cdList = new ArrayList<String>();
		if (doctor!=null && StringUtils.isNoneBlank(doctor.getHosId())) {
			sb.append(" and hosId = ?");
			cdList.add(doctor.getHosId());
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
