package com.infohold.elh.base.web.rest;


import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.infohold.core.dao.Page;
import com.infohold.core.manager.GenericManager;
import com.infohold.core.utils.JSONUtils;
import com.infohold.core.web.MediaTypes;
import com.infohold.core.web.rest.BaseRestController;
import com.infohold.core.web.utils.Result;
import com.infohold.core.web.utils.ResultUtils;
import com.infohold.elh.base.model.DoctorDuty;

/**
 * 医生管理
 * 
 * @author Administrator
 *
 */
@RestController
@RequestMapping("/elh/doctor/duty")
public class DoctorDutyRestController extends BaseRestController {
	@Autowired
	private GenericManager<DoctorDuty, String> doctorDutyManager;



	/**
	 * ELH_HOSP_013 按医生查询常规出诊信息 时间及挂号费 1
	 * 
	 * @param start
	 * @param pageSize
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forDutyInfo(@PathVariable("id") String id) {
		DoctorDuty DoctorDuty = this.doctorDutyManager.get(id);
		return ResultUtils.renderSuccessResult(DoctorDuty);
	}

	/**
	 * ELH_HOSP_014 维护医生常规出诊信息 1
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/create", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forDutyCreate(@RequestBody String data) {
		DoctorDuty doctorDuty = JSONUtils.deserialize(data, DoctorDuty.class);
		Map doctorDutyMap = JSONUtils.deserialize(data, Map.class);
		if (null != doctorDutyMap.get("doctor")) {
			doctorDuty.setDoctor(doctorDutyMap.get("doctor").toString()); // 医生
		}
		if (null != doctorDutyMap.get("name")) {
			doctorDuty.setName(doctorDutyMap.get("name").toString()); // 医生姓名
		}
		if (null != doctorDutyMap.get("dayBy")) {
			doctorDuty.setDayBy(doctorDutyMap.get("dayBy").toString()); // 时间单位
		}
		if (null != doctorDutyMap.get("day")) {
			String str1 = doctorDutyMap.get("day").toString();
			try {
				int a = Integer.parseInt(str1);
				doctorDuty.setDay(a);// 日期
			} catch (NumberFormatException e) {
				e.printStackTrace();
			}
		}
		if (null != doctorDutyMap.get("noon")) {
			doctorDuty.setNoon(doctorDutyMap.get("noon").toString()); // 上下午
		}
		if (null != doctorDutyMap.get("startHour")) {
			String str2 = doctorDutyMap.get("startHour").toString();
			try {
				int b = Integer.parseInt(str2);
				doctorDuty.setStartHour(b);// 开始时间（小时）
			} catch (NumberFormatException e) {
				e.printStackTrace();
			}
		}
		if (null != doctorDutyMap.get("endHour")) {
			String str3 = doctorDutyMap.get("endHour").toString();
			try {
				int c = Integer.parseInt(str3);
				doctorDuty.setEndHour(c);// 结束时间（小时）
			} catch (NumberFormatException e) {
				e.printStackTrace();
			}
		}
		if (null != doctorDutyMap.get("amount")) {
			doctorDuty.setAmount(doctorDutyMap.get("amount").toString()); // 挂号费
		}
		doctorDuty = this.doctorDutyManager.save(doctorDuty);
		return ResultUtils.renderSuccessResult(doctorDuty);
	}

	/**
	 * ELH_HOSP_014 维护医生常规出诊信息 1
	 * 
	 * @param id
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/{id}", method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forDutyUpdate(@PathVariable("id") String id,
			@RequestBody String data) {
		DoctorDuty DoctorDuty = this.doctorDutyManager.get(id);
		DoctorDuty savedDoctorDuty = this.doctorDutyManager.save(DoctorDuty);
		return ResultUtils.renderSuccessResult(savedDoctorDuty);
	}

	/**
	 * ELH_HOSP_015 删除医生常规出诊信息 1
	 * 
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDutyDelete(@PathVariable("id") String id) {
		DoctorDuty DoctorDuty = this.doctorDutyManager.delete(id);
		return ResultUtils.renderSuccessResult(DoctorDuty);
	}

	/**
	 *  查询医生常规出诊信息列表
	 *  
	 * @param start
	 * @param pageSize
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/list/{start}/{pageSize}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forDutyList(@PathVariable(value = "start") int start,
			@PathVariable(value = "pageSize") int pageSize,
			@RequestParam(value = "data", defaultValue = "") String data) {
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(pageSize);
		page.setQuery("from DoctorDuty ");
		this.doctorDutyManager.findPage(page);
		return ResultUtils.renderSuccessResult(page);
	}
	/******************************************************机构端方法*************************************************************************/
	/******************************************************机构端方法end*************************************************************************/
	/******************************************************app端方法*************************************************************************/
	/******************************************************app端方法end*************************************************************************/
	/******************************************************运营端方法*************************************************************************/
	/******************************************************运营端方法end*************************************************************************/
	
}
