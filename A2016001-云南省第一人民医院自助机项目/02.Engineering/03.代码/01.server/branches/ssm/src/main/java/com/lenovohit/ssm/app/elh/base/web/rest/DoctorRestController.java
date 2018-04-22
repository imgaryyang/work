package com.lenovohit.ssm.app.elh.base.web.rest;


import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lenovohit.bdrp.Constants;
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
import com.lenovohit.ssm.base.model.Org;

/**
 * 医生管理
 * 
 * @author Administrator
 *
 */
@RestController
@RequestMapping("/hwe/app/doctor")
public class DoctorRestController extends BaseRestController {
	@Autowired
	private GenericManager<Doctor, String> doctorManager;
	@Autowired
	private GenericManager<DoctorDuty, String> doctorDutyManager;
	
	/**
	 * demo
	 */
	@RequestMapping(value = "/demo", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result demo(){
		List<Doctor> list = doctorManager.findAll();
		return ResultUtils.renderSuccessResult(list);
	}
	/******************************************************机构端方法*************************************************************************/

	/**
	 * ELH_HOSP_009 查询医生列表 HMP1.3 1
	 * 
	 * @param start
	 * @param pageSize
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/forlist/{start}/{pageSize}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@PathVariable(value = "start") String start,
			@PathVariable(value = "pageSize") String pageSize,
			@RequestParam(value = "data", defaultValue = "") String data) {
		log.info("查询列表数据，输入查询条件为：【" + data + "】");
		System.out.println(start+"-----"+pageSize);
		Org loginOrg = (Org)this.getSession().getAttribute(Constants.ORG_KEY);
//		String orgId = loginOrg.getId();
		String orgId = "1111";
		Doctor doctor = JSONUtils.deserialize(data, Doctor.class);
		
		StringBuilder sb = new StringBuilder(" from Doctor where hospitalId = ? ");
		List<String> cdList = new ArrayList<String>();
		cdList.add(orgId);
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
	
	/**
	 * ELH_HOSP_010 查询医院医生信息 HMP1.3 1
	 * 
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forInfo(@PathVariable("id") String id) {
		Doctor doctor = this.doctorManager.get(id);
		
//		Org loginOrg = (Org)this.getSession().getAttribute(Constants.ORG_KEY);
//		if(null==loginOrg || "".equals(loginOrg)){
//			return ResultUtils.renderFailureResult("未找到当前登录机构doc1");
//		}
//		String orgId = loginOrg.getId();
//		if(!orgId.equals(doctor.getHospitalId())){
//			return ResultUtils.renderFailureResult("无权修改其他医院医生");
//		}
		return ResultUtils.renderSuccessResult(doctor);
	}
	
	/**
	 * ELH_HOSP_011 新增医院医生信息 HMP1.3 1
	 * 
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/create", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forCreate(@RequestBody String data) {
//		Org loginOrg = (Org)this.getSession().getAttribute(Constants.ORG_KEY);
//		if(null==loginOrg || "".equals(loginOrg)){
//			return ResultUtils.renderFailureResult("未找到当前登录机构doc2");
//		}
//		String orgId = loginOrg.getId();
		
		Doctor doctor = JSONUtils.deserialize(data, Doctor.class);
//		doctor.setHospitalId(orgId);
		doctor = this.doctorManager.save(doctor);
		return ResultUtils.renderSuccessResult(doctor);
	}


	/**
	 * ELH_HOSP_011 维护医院医生信息 HMP1.3 1
	 * 
	 * @param id
	 * @param data
	 * @return
	 */
	@SuppressWarnings("rawtypes")
	@RequestMapping(value = "/{id}", method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forUpdate(@PathVariable("id") String id,
			@RequestBody String data) {
		Org loginOrg = (Org)this.getSession().getAttribute(Constants.ORG_KEY);
		if(null==loginOrg || "".equals(loginOrg)){
			return ResultUtils.renderFailureResult("未找到当前登录机构doc3");
		}
		String orgId = loginOrg.getId();
		Doctor doctor = this.doctorManager.get(id);
		if(!orgId.equals(doctor.getHospitalId())){
			return ResultUtils.renderFailureResult("无权修改其他医院医生");
		}
		
		Map doctorMap = JSONUtils.deserialize(data, Map.class);
		if (null != doctorMap.get("idHlht")) {
			doctor.setIdHlht(doctorMap.get("idHlht").toString()); // 院方ID
		}
		if (null != doctorMap.get("name")) {
			doctor.setName(doctorMap.get("name").toString()); // 姓名
		}
		if (null != doctorMap.get("gender")) {
			doctor.setGender(doctorMap.get("gender").toString()); // 性别
		}
		if (null != doctorMap.get("jobNum")) {
			doctor.setJobNum(doctorMap.get("jobNum").toString()); // 工号
		}
		if (null != doctorMap.get("certNum")) {
			doctor.setCertNum(doctorMap.get("certNum").toString()); // 资格证书号
		}
		if (null != doctorMap.get("degrees")) {
			doctor.setDegrees(doctorMap.get("degrees").toString()); // 学历
		}
		if (null != doctorMap.get("major")) {
			doctor.setMajor(doctorMap.get("major").toString()); // 专业
		}
		if (null != doctorMap.get("jobTitle")) {
			doctor.setJobTitle(doctorMap.get("jobTitle").toString()); // 职称
		}
		if (null != doctorMap.get("speciality")) {
			doctor.setSpeciality(doctorMap.get("speciality").toString()); // 特长
		}
		if (null != doctorMap.get("entryTime")) {
			String strDate = doctorMap.get("entryTime").toString();
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd "); 
			Date date;
			try {
				date = sdf.parse(strDate);
				doctor.setEntryTime(date); // 入职时间
			} catch (ParseException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		if (null != doctorMap.get("departmentId")) {
			doctor.setDepartmentId(doctorMap.get("departmentId").toString()); // 部门ID
		}
		if (null != doctorMap.get("deptName")) {
			doctor.setDeptName(doctorMap.get("deptName").toString()); // 部门名称
		}
		if (null != doctorMap.get("hospitalId")) {
			doctor.setHospitalId(doctorMap.get("hospitalId").toString()); // 医院ID
		}
		if (null != doctorMap.get("hosName")) {
			doctor.setHosName(doctorMap.get("hosName").toString()); // 医院名称
		}
		if (null != doctorMap.get("portrait")) {
			doctor.setPortrait(doctorMap.get("portrait").toString()); // 照片
		}
		if (null != doctorMap.get("clinic")) {
			doctor.setClinic(doctorMap.get("clinic").toString()); // 诊治代码
		}
		if (null != doctorMap.get("clinicDesc")) {
			doctor.setClinicDesc(doctorMap.get("clinicDesc").toString()); // 诊治描述
		}
		if (null != doctorMap.get("isExpert")) {
			doctor.setIsExpert(doctorMap.get("isExpert").toString()); // 是否专家
		}
		if (null != doctorMap.get("birthday")) {
			doctor.setBirthday(doctorMap.get("birthday").toString()); // 出生日期
		}
		if (null != doctorMap.get("entryDate")) {
			doctor.setEntryDate(doctorMap.get("entryDate").toString()); // 从医日期
		}
		if (null != doctorMap.get("sortno")) {
			String str = doctorMap.get("sortno").toString();
			try {
			    int a = Integer.parseInt(str);
			    doctor.setSortno(a);// 排序码
			} catch (NumberFormatException e) {
			    e.printStackTrace();
			}
		}
		Doctor savedDoctor = this.doctorManager.save(doctor);
		return ResultUtils.renderSuccessResult(savedDoctor);
	}

	/**
	 * ELH_HOSP_012 删除医生 HMP1.3 1
	 * 
	 * @param id
	 * @return
	 */
	@RequestMapping(value = "/{id}", method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDelete(@PathVariable("id") String id) {
//		Org loginOrg = (Org)this.getSession().getAttribute(Constants.ORG_KEY);
//		if(null==loginOrg || "".equals(loginOrg)){
//			return ResultUtils.renderFailureResult("未找到当前登录机构doc4");
//		}
//		String orgId = loginOrg.getId();
//		Doctor doctor = this.doctorManager.get(id);
//		if(!orgId.equals(doctor.getHospitalId())){
//			return ResultUtils.renderFailureResult("无权修改其他医院医生");
//		}
//		
		Doctor doctorMoved = this.doctorManager.delete(id);
		return ResultUtils.renderSuccessResult(doctorMoved);
	}
	/**
	 * ELH_HOSP_007	设置特色科室special
	 * @param id
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/expert/set/{id}", method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forSetExpert(@PathVariable("id") String id) {
//		Org loginOrg = (Org)this.getSession().getAttribute(Constants.ORG_KEY);
//		if(null==loginOrg || "".equals(loginOrg)){
//			return ResultUtils.renderFailureResult("未找到当前登录机构doc5");
//		}
//		String orgId = loginOrg.getId();
		Doctor doctor = this.doctorManager.get(id);
//		if(!orgId.equals(doctor.getHospitalId())){
//			return ResultUtils.renderFailureResult("科室不属于当前机构");
//		}
		doctor.setIsExpert("1");
		Doctor doctorUped = this.doctorManager.save(doctor);
		return ResultUtils.renderSuccessResult(doctorUped);
	}
	/**
	 * ELH_HOSP_007	设置特色科室special
	 * @param id
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/expert/move/{id}", method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forMoveExpert(@PathVariable("id") String id) {
//		Org loginOrg = (Org)this.getSession().getAttribute(Constants.ORG_KEY);
//		if(null==loginOrg || "".equals(loginOrg)){
//			return ResultUtils.renderFailureResult("未找到当前登录机构doc6");
//		}
//		String orgId = loginOrg.getId();
		Doctor doctor = this.doctorManager.get(id);
//		if(!orgId.equals(doctor.getHospitalId())){
//			return ResultUtils.renderFailureResult("科室不属于当前机构");
//		}
		doctor.setIsExpert("0");
		Doctor doctorUped = this.doctorManager.save(doctor);
		return ResultUtils.renderSuccessResult(doctorUped);
	}
	/**
	 * ELH_HOSP_013 按医生查询常规出诊信息 时间及挂号费 1
	 * 
	 * @param start
	 * @param pageSize
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/duty/{id}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
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
	@RequestMapping(value = "/duty/create", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forDutyCreate(@RequestBody String data) {
		DoctorDuty doctorDuty = JSONUtils.deserialize(data, DoctorDuty.class);
		Map doctorDutyMap = JSONUtils.deserialize(data, Map.class);
		if (null != doctorDutyMap.get("doctor")) {
			doctorDuty.setDoctor(doctorDutyMap.get("doctor").toString()); // 医生
		}
		if (null != doctorDutyMap.get("name")) {
			doctorDuty.setName(doctorDutyMap.get("name").toString()); // 医生姓名
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
	@RequestMapping(value = "/duty/{id}", method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
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
	@RequestMapping(value = "/duty/{id}", method = RequestMethod.DELETE, produces = MediaTypes.JSON_UTF_8)
	public Result forDutyDelete(@PathVariable("id") String id) {
		DoctorDuty DoctorDuty = this.doctorDutyManager.delete(id);
		return ResultUtils.renderSuccessResult(DoctorDuty);
	}

	/**
	 * @param start
	 * @param pageSize
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/duty/list/{start}/{pageSize}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
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
	
	/******************************************************机构端方法end*************************************************************************/
	/******************************************************app端方法*************************************************************************/

	/**
	 * ELH_HOSP_009 查询医生列表 HMP1.3 1
	 * 
	 * @param start
	 * @param pageSize
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/app/list/{start}/{pageSize}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forAppList(@PathVariable(value = "start") int start,
			@PathVariable(value = "pageSize") int pageSize,
			@RequestParam(value = "data", defaultValue = "") String data) {
		log.info("查询列表数据，输入查询条件为：【" + data + "】");
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
	/******************************************************app端方法end*************************************************************************/

	
	/******************************************************运营端方法*************************************************************************/
	/******************************************************运营端方法end*************************************************************************/
	
}
