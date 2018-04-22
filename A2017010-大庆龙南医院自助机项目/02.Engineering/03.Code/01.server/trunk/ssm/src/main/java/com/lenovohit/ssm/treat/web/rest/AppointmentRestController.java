package com.lenovohit.ssm.treat.web.rest;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.TypeReference;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.ssm.base.model.DepartmentConfig;
import com.lenovohit.ssm.base.web.rest.SSMBaseRestController;
import com.lenovohit.ssm.treat.manager.HisAppointmentManager;
import com.lenovohit.ssm.treat.model.Appointment;
import com.lenovohit.ssm.treat.model.Schedule;
import com.lenovohit.ssm.treat.transfer.manager.HisEntityResponse;
import com.lenovohit.ssm.treat.transfer.manager.HisListResponse;

/**
 * 预约
 */
@RestController
@RequestMapping("/ssm/treat/appointment")
public class AppointmentRestController extends SSMBaseRestController {
	@Autowired
	private GenericManager<DepartmentConfig, String> departmentConfigManager;
	@Autowired
	private HisAppointmentManager hisAppointmentManager;
	/**
	 * 获取排班科室
	 * @param data
	 * @return
	 */
	@RequestMapping(value="/department/list",method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forDepartmentList(){
//		HisListResponse response = hisAppointmentManager.getDepartments();
//		if(null != response && response.isSuccess()){
//			return ResultUtils.renderSuccessResult(response.getList()); 
//	    } else {
//	    	return ResultUtils.renderFailureResult();
//	    }
//		List<DepartmentConfig> depts = departmentConfigManager.find("from DepartmentConfig where clazz = ? or clazz = ? ", "1","0");
		List<DepartmentConfig> depts = departmentConfigManager.find("from DepartmentConfig where type is not null and clazz = ? order by hisId","1");
		Map<String, DepartmentConfig> typeMap = new TreeMap<String,DepartmentConfig>();
		for(DepartmentConfig dept : depts){
			String custom_code = dept.getCustom_code();
			String type = dept.getType();
			if(StringUtils.isEmpty(type)) type = dept.getName();
			// System.out.println(type+ " : "+custom_code+"-"+dept.getName());
			DepartmentConfig config = typeMap.get(type);
			if(null == config ){
				config = new DepartmentConfig();
				config.setName(type);
				config.setCode(custom_code);
//				System.out.println(type);
				typeMap.put(type, config);
			}
			config .getChildren().add(dept);
		}
		return ResultUtils.renderSuccessResult(typeMap.values()); 
	}
	/**
	 * 获取学科列表（大庆）
	 * @param data
	 * @return
	 */
	@RequestMapping(value="/subject/list",method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forDqSubjectList(){
		//List<?> depts = (List<?>)departmentConfigManager.findBySql("SELECT DISTINCT FLDM,FLMC,KSDM,KSMC  FROM VIEW_DEPT_DOCTOR order by To_number(FLDM),To_number(KSDM)");
		List<?> depts = (List<?>)departmentConfigManager.findBySql(" SELECT DISTINCT FLDM,FLMC,FLPX,KSDM,KSMC,KSPX  FROM VIEW_DEPT_DOCTOR order by FLPX,KSPX ");
		Map<String, DepartmentConfig> typeMap = new TreeMap<String,DepartmentConfig>();
		List<DepartmentConfig> typeList = new ArrayList<DepartmentConfig>();
		for(Object dept: depts){
			Object[] detpValues = (Object[])dept;
			DepartmentConfig config = new DepartmentConfig();
			String typeCode = detpValues[0].toString();
			DepartmentConfig type =  typeMap.get(typeCode);
			if(null == type){
				type = new DepartmentConfig();
				type.setCode(detpValues[0].toString());
				type.setName(detpValues[1].toString());
				type.setType(type.getCode());
				typeMap.put(typeCode, type);
				typeList.add(type);
			}
			config.setCode(detpValues[3].toString());
			config.setName(detpValues[4].toString());
			config.setType(type.getCode());
			type .getChildren().add(config);
		}
		return ResultUtils.renderSuccessResult(typeList); 
	}
	/**
	 * 医生号源排班信息查询(APPOINT003) 按科室查询HIS中科室可预约的排班
	 * @param data
	 * @return
	 */
	@RequestMapping(value="/schedule/dept",method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forDoctorList(@RequestParam(value = "data", defaultValue = "") String data){
		Schedule schedule = JSONUtils.deserialize(data, Schedule.class);
		schedule.setBookingPlatform("111");//TODO 
		schedule.setDoctorCode("");//科室查询 医生为空
		HisListResponse<Schedule> response = hisAppointmentManager.getDepartmentSchedules(schedule);
		if(null != response && response.isSuccess()){
			return ResultUtils.renderSuccessResult(response.getList()); 
	    } else {
	    	return ResultUtils.renderFailureResult();
	    }
	}
	/**
	 * 医生号源排班信息查询(APPOINT004) 按医师查询HIS中医师可预约的排班
	 * @param data
	 * @return
	 */
	@RequestMapping(value="/schedule/doct",method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forScheduleList(@RequestParam(value = "data", defaultValue = "") String data){
		long start = System.currentTimeMillis();
		Schedule schedule = JSONUtils.deserialize(data, Schedule.class);
		
		String deptCode = schedule.getDeptCode();
		List<?> doctors = (List<?>)departmentConfigManager.findBySql("SELECT ysyhid FROM VIEW_DEPT_DOCTOR where KSDM = ? ",deptCode);
		StringBuilder doctorCodes = new StringBuilder();
		for(int i=0;i<doctors.size();i++){
			Object doctor  = doctors.get(i);
			if(i != 0 )doctorCodes.append(";");
			doctorCodes.append(doctor.toString());
		}
		
		schedule.setDeptCode("");
		schedule.setDoctorCode(doctorCodes.toString());
		
		
		HisListResponse<Schedule> response = hisAppointmentManager.getDoctorSchedules(schedule);
		long end = System.currentTimeMillis();
		log.info(" schedule docotor cost 【 "+(end-start)+ "】");
		if(null != response && response.isSuccess()){
			return ResultUtils.renderSuccessResult(response.getList()); 
	    } else {
	    	return ResultUtils.renderFailureResult();
	    }
	}
	/**
	 * 获取号源信息
	 * @param data
	 * @return
	 */
	@Deprecated
	@RequestMapping(value="/appointment/sources",method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forResourcePage(@RequestParam(value = "data", defaultValue = "") String data){
		Schedule schedule = JSONUtils.deserialize(data, Schedule.class);
		HisListResponse<Appointment> response = hisAppointmentManager.getAppointSources(schedule);
		if(null != response && response.isSuccess()){
			return ResultUtils.renderSuccessResult(response.getList()); 
	    } else {
	    	return ResultUtils.renderFailureResult();
	    }
	}
	
	/**
	 * 已预约挂号信息查询(APPOINT007)
	 * 查询预约记录，查询当天及以后的预约记录，包括放弃记录。
	 * @param data
	 * @return
	 */
	@Deprecated
	@RequestMapping(value = "/appointment/history", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forPage(@RequestParam(value = "data", defaultValue = "") String data){
		Appointment appoint =  JSONUtils.deserialize(data, Appointment.class);
		HisListResponse<Appointment> response = hisAppointmentManager.appointments(appoint);
		if(null != response && response.isSuccess()){
			return ResultUtils.renderSuccessResult(response.getList()); 
	    } else {
	    	return ResultUtils.renderFailureResult();
	    }
	}

	/**
	 * 已预约挂号信息查询(APPOINT0071)
	 * 根据病人编号，查询预约记录，查询当天及以后的预约记录，包括放弃记录。
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/appointment/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forAppointmentList(@RequestParam(value = "data", defaultValue = "") String data){
		Appointment appoint =  JSONUtils.deserialize(data, Appointment.class);
		HisListResponse<Appointment> response = hisAppointmentManager.getAppointments(appoint);
		if(null != response && response.isSuccess()){
			return ResultUtils.renderSuccessResult(response.getList()); 
	    } else {
	    	return ResultUtils.renderFailureResult();
	    }
	}
	
	/**
	 * 取消预约
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/cancel", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forCancel(@RequestBody String data){
		Appointment appoint = JSONUtils.deserialize(data, Appointment.class);
		appoint.setOperaterUserID(this.getCurrentMachine().getHisUser());
		
		HisEntityResponse<Appointment> response = hisAppointmentManager.cancel(appoint);
	    if(null != response && response.isSuccess()){
			return ResultUtils.renderSuccessResult(response.getEntity()); 
	    } else {
	    	return ResultUtils.renderFailureResult();
	    }
	}
	/**
	 * 预约记录生成(APPOINT006)
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/book", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forBook(@RequestBody String data){
		Appointment appoint = JSONUtils.deserialize(data, Appointment.class);
		appoint.setBookingPlatform("111");//TODO 
		appoint.setOperaterUserID(this.getCurrentMachine().getHisUser());
		HisEntityResponse<?> response = hisAppointmentManager.bookAppiontment(appoint);
		if (null != response && response.isSuccess()) {
			return ResultUtils.renderSuccessResult(response.getEntity());
		} else {
			try {//TODO BUG
				List<Object> list = JSONUtils.parseObject(response.getContent(), new TypeReference<List<Object>>(){});
				Map<String,Object> msg = JSONUtils.parseObject(list.get(0).toString(), new TypeReference<Map<String,Object>>(){});
				return ResultUtils.renderFailureResult(msg.get("msg").toString());
			} catch (Exception e) {
				e.printStackTrace();
			}
			return ResultUtils.renderFailureResult();
		}
	}
	/**
	 * 就诊登记(APPOINT011) 预约签到，就诊登记
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/sign", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forSign(@RequestBody String data){
		Appointment appoint = JSONUtils.deserialize(data, Appointment.class);
		appoint.setBookingPlatform("111");//TODO 
		appoint.setOperaterUserID(this.getCurrentMachine().getHisUser());
		HisEntityResponse<?> response = hisAppointmentManager.sign(appoint);
		if (null != response && response.isSuccess()) {
			return ResultUtils.renderSuccessResult(response.getEntity());
		} else {
			return ResultUtils.renderFailureResult(response.getResult());
		}
	}
//	/**
//	 * 未签到预约记录查询
//	 * @param data
//	 * @return
//	 */
//	@RequestMapping(value = "/unsigned/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
//	public Result forUnsignedList(){
//		return ResultUtils.renderSuccessResult();
//	}
//	
}
