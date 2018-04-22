package com.lenovohit.ssm.treat.manager.impl;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.ssm.treat.dao.HisRestDao;
import com.lenovohit.ssm.treat.manager.HisAppointmentManager;
import com.lenovohit.ssm.treat.model.Appointment;
import com.lenovohit.ssm.treat.model.Department;
import com.lenovohit.ssm.treat.model.Patient;
import com.lenovohit.ssm.treat.model.Schedule;
import com.lenovohit.ssm.treat.transfer.dao.RestEntityResponse;
import com.lenovohit.ssm.treat.transfer.dao.RestListResponse;
import com.lenovohit.ssm.treat.transfer.dao.RestRequest;
import com.lenovohit.ssm.treat.transfer.manager.HisEntityResponse;
import com.lenovohit.ssm.treat.transfer.manager.HisListResponse;


/**
 * HIS预约
 * @author xiaweiyi
 *
 */
public class HisAppointmentManagerImpl implements HisAppointmentManager{
	protected transient final Log log = LogFactory.getLog(getClass());
	@Autowired
	private HisRestDao hisRestDao;
	
	/**
	 * 一级科室基本信息查询 APPOINT001
	 * @param param
	 * @return
	 */
	public HisListResponse<Department> getDepartments(){
		RestListResponse response = hisRestDao.postForList("APPOINT0011", RestRequest.SEND_TYPE_LOCATION, null);
		HisListResponse<Department> result = new HisListResponse<Department>(response);
		List<Map<String, Object>> resMaplist = response.getList();
		List<Department> resList = new ArrayList<Department>();
		Department department = null;
		if(response.isSuccess() && null != resMaplist){
			for(Map<String, Object> resMap : resMaplist){
				department = new Department();
				department.setCode(object2String(resMap.get("DETP_CODE_FIRST")));
				department.setName(object2String(resMap.get("DETP_NMAE_FIRST")));
				//department.setDesc(object2String(resMap.get("DEPT_INTRODUCE")));
				department.setPinyin(object2String(resMap.get("PINYIN")));
				resList.add(department);
			}
			result.setList(resList);
		}
		return result;
	}
	/**
	 * 二级科室信息查询APPOINT0012
	 */
	public HisListResponse<Department> getChildrenDepartments(String code) {
		Map<String, Object> reqMap = new HashMap<String, Object>();
		reqMap.put("DETP_CODE_FIRST", code);
		RestListResponse response = hisRestDao.postForList("APPOINT0012", RestRequest.SEND_TYPE_LOCATION, reqMap);
		HisListResponse<Department> result = new HisListResponse<Department>(response);
		List<Map<String, Object>> resMaplist = response.getList();
		List<Department> resList = new ArrayList<Department>();
		Department department = null;
		if(response.isSuccess() && null != resMaplist){
			for(Map<String, Object> resMap : resMaplist){
				department = new Department();
				department.setCode(object2String(resMap.get("DETP_CODE")));
				department.setName(object2String(resMap.get("DETP_NMAE")));
				department.setDescription(object2String(resMap.get("DEPT_INTRODUCE")));
				department.setPinyin(object2String(resMap.get("PINYIN")));
				department.setType(object2String(resMap.get("DETP_TYPE")));
				resList.add(department);
			}
			result.setList(resList);
		}
		return result;
	}
	/**
	 * 医生号源排班信息查询(按科室) APPOINT0031
	 * @param param
	 * @return
	 */
	public HisListResponse<Schedule> getDepartmentSchedules(Schedule param) {
		Map<String, Object> reqMap = new HashMap<String, Object>();
		// 入参字段映射
		reqMap.put("BOOKING_PLATFORM", param.getBookingPlatform());
		reqMap.put("START_DATE", param.getStartDate());
		reqMap.put("END_DATE", param.getEndDate());
		reqMap.put("DEPT_CODE", param.getDeptCode());
		reqMap.put("DOCTOR_CODE", param.getDoctorCode());
		reqMap.put("DEPT_TYPE", param.getDeptType());
		//{DOCTOR_CODE=, DEPT_CODE=null, END_DATE=2017-10-27, START_DATE=2017-09-27, BOOKING_PLATFORM=111, DEPT_TYPE=1}
		RestListResponse response = hisRestDao.postForList("APPOINT0031", RestRequest.SEND_TYPE_LOCATION, reqMap);
		HisListResponse<Schedule> result = new HisListResponse<Schedule>(response);
		
		List<Map<String, Object>> resMaplist = response.getList();
		List<Schedule> resList = new ArrayList<Schedule>();
		Schedule schedule = null;//SPECIAL_DISEASES_NAME：专病          	DEPT_NAME：专科
		if(response.isSuccess() && null != resMaplist){
			for(Map<String, Object> resMap : resMaplist){
				schedule = new Schedule();
				schedule.setScheduleId(object2String(resMap.get("SCHEDULEID")));
				schedule.setDoctorCode(object2String(resMap.get("DOCTOR_CODE")));
				schedule.setDoctorName(object2String(resMap.get("DOCTOR_NAME")));
				schedule.setDoctorPinyin(StringUtils.getFirstUpPinyin(schedule.getDoctorName()));
				schedule.setDoctorType(object2String(resMap.get("DOCTOR_TYPE")));
				schedule.setDoctorTypeName(object2String(resMap.get("DOCTOR_TYPENAME")));
				schedule.setDeptCode(object2String(resMap.get("DEPT_CODE")));
				schedule.setDeptName(object2String(resMap.get("DEPT_NAME")));
				schedule.setOnDutyTime(object2String(resMap.get("ON_DUTY_TIME")));
				schedule.setOffDutyTime(object2String(resMap.get("OFF_DUTY_TIME")));
				schedule.setClinicType(object2String(resMap.get("DOCTOR_CLINIC_TYPE")));
				schedule.setClinicTypeName(object2String(resMap.get("DOCTOR_CLINIC_TYPENAME")));
				schedule.setClinicDate(object2String(resMap.get("CLINIC_DATE")));
				schedule.setClinicDuration(object2String(resMap.get("CLINIC_DURATION")));
				schedule.setClinicDurationName(object2String(resMap.get("CLINIC_DURATIONNAME")));
				schedule.setHospitalDistrict(object2String(resMap.get("HOSPITAL_DISTRICT")));
				schedule.setHospitalDistrictName(object2String(resMap.get("HOSPITAL_DISTRICTNAME")));
				schedule.setServiceStation(object2String(resMap.get("OUTPATIENT_SERVICESTATION")));
				schedule.setCountNo(object2String(resMap.get("APPOINTMENT_COUNTNO")));
				schedule.setSpecialDiseasesCode(object2String(resMap.get("SPECIAL_DISEASES_CODE")));
				schedule.setSpecialDiseasesName(object2String(resMap.get("SPECIAL_DISEASES_NAME")));
				// 处理号源
				String countNO = schedule.getCountNo();
				List<Appointment> appointments = new ArrayList<Appointment>();
				String[] appoints = countNO.split(";");
				for(String appoint : appoints ){
					if(StringUtils.isBlank(appoint)){
						continue;
					}
					String[] data = appoint.split(",");
					if(data.length != 2){
						log.info("号源数据格式错误 : "+appoint);
						continue;
					}
					Appointment appointment = new Appointment();
					appointment.setScheduleId(schedule.getScheduleId());
					appointment.setAppointmentNo(data[0]);
					String[] dateTime = data[1].split(" ");
					if(dateTime.length != 2){
						log.info("日期格式错误 : "+data[1]);
						appointment.setAppointmentTime(data[1]);
					}else{
						appointment.setAppointmentDate(dateTime[0]);
						appointment.setAppointmentTime(data[1]);
					}
					appointment.setDeptName(schedule.getDeptName());
					appointment.setClinicTypeName(schedule.getClinicTypeName());
					appointment.setClinicDurationName(schedule.getClinicDurationName());
					appointment.setDoctorName(schedule.getDoctorName());
					appointment.setDoctorTypeName(schedule.getDoctorTypeName());
					appointment.setHospitalDistrictName(schedule.getHospitalDistrictName());
					appointments.add(appointment);
				}
				schedule.setAppointments(appointments);
				
				resList.add(schedule);
			}
			
			resList.sort(new Comparator<Schedule>() {
				SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
				@Override
				public int compare(Schedule o1, Schedule o2) {
					if(StringUtils.isEmpty(o1.getOnDutyTime()) || StringUtils.isEmpty(o2.getOnDutyTime()))
						return 0;
					try {
						Date date1 = format.parse(o1.getOnDutyTime());
						Date date2 = format.parse(o2.getOnDutyTime());
						if(date1.before(date2))return -1;
						else return 1;
					} catch (ParseException e) {
						return 0;
					}
				}
				
			});
			result.setList(resList);
		}
		return result;
	}
	/**
	 * 医生号源排班信息查询(按医师) APPOINT004
	 * @param param
	 * @return
	 */
	public HisListResponse<Schedule> getDoctorSchedules(Schedule param){
		Map<String, Object> reqMap = new HashMap<String, Object>();
		// 入参字段映射
		reqMap.put("BOOKING_PLATFORM", param.getBookingPlatform());
		reqMap.put("START_DATE", param.getStartDate());
		reqMap.put("END_DATE", param.getEndDate());
		reqMap.put("DEPT_CODE", param.getDeptId());
		reqMap.put("DOCTOR_CODE", param.getDoctorCode());

		RestListResponse response = hisRestDao.postForList("APPOINT004", RestRequest.SEND_TYPE_LOCATION, reqMap);
		HisListResponse<Schedule> result = new HisListResponse<Schedule>(response);

		List<Map<String, Object>> resMaplist = response.getList();
		List<Schedule> resList = new ArrayList<Schedule>();
		Schedule schedule = null;
		if(response.isSuccess() && null != resMaplist){
			for(Map<String, Object> resMap : resMaplist){
				schedule = new Schedule();
				schedule.setScheduleId(object2String(resMap.get("SCHEDULEID")));
				schedule.setDoctorCode(object2String(resMap.get("DOCTOR_CODE")));
				schedule.setDoctorName(object2String(resMap.get("DOCTOR_NAME")));
				schedule.setDoctorPinyin(StringUtils.getFirstUpPinyin(schedule.getDoctorName()));
				schedule.setDoctorType(object2String(resMap.get("DOCTOR_TYPE")));
				schedule.setDoctorTypeName(object2String(resMap.get("DOCTOR_TYPENAME")));
				schedule.setDeptCode(object2String(resMap.get("DEPT_CODE")));
				schedule.setDeptName(object2String(resMap.get("DEPT_NAME")));
				schedule.setOnDutyTime(object2String(resMap.get("ON_DUTY_TIME")));
				schedule.setOffDutyTime(object2String(resMap.get("OFF_DUTY_TIME")));
				schedule.setClinicType(object2String(resMap.get("DOCTOR_CLINIC_TYPE")));
				schedule.setClinicType(object2String(resMap.get("DOCTOR_CLINIC_TYPE")));
				schedule.setClinicTypeName(object2String(resMap.get("DOCTOR_CLINIC_TYPENAME")));
				schedule.setClinicDate(object2String(resMap.get("CLINIC_DATE")));
				schedule.setClinicDuration(object2String(resMap.get("CLINIC_DURATION")));
				schedule.setClinicDurationName(object2String(resMap.get("CLINIC_DURATIONNAME")));
				schedule.setHospitalDistrict(object2String(resMap.get("HOSPITAL_DISTRICT")));
				schedule.setHospitalDistrictName(object2String(resMap.get("HOSPITAL_DISTRICTNAME")));
				schedule.setServiceStation(object2String(resMap.get("OUTPATIENT_SERVICESTATION")));
				schedule.setCountNo(object2String(resMap.get("APPOINTMENT_COUNTNO")));
				schedule.setSpecialDiseasesCode(object2String(resMap.get("SPECIAL_DISEASES_CODE")));
				schedule.setSpecialDiseasesName(object2String(resMap.get("SPECIAL_DISEASES_NAME")));
				// 处理号源
				String countNO = schedule.getCountNo();
				List<Appointment> appointments = new ArrayList<Appointment>();
				String[] appoints = countNO.split(",");
				for(String appoint : appoints ){
					if(StringUtils.isBlank(appoint)){
						continue;
					}
					String[] data = appoint.split(",");
					if(data.length != 2){
						log.info("号源数据格式错误 : "+appoint);
						continue;
					}
					Appointment appointment = new Appointment();
					appointment.setScheduleId(schedule.getScheduleId());
					appointment.setAppointmentNo(data[0]);
					String[] dateTime = data[1].split(" ");
					if(dateTime.length != 2){
						log.info("日期格式错误 : "+data[1]);
						appointment.setAppointmentTime(data[1]);
					}else{
						appointment.setAppointmentDate(dateTime[0]);
						appointment.setAppointmentTime(data[1]);
					}
					appointment.setDeptName(schedule.getDeptName());
					appointment.setClinicTypeName(schedule.getClinicTypeName());
					appointment.setClinicDurationName(schedule.getClinicDurationName());
					appointment.setDoctorName(schedule.getDoctorName());
					appointment.setDoctorTypeName(schedule.getDoctorTypeName());
					appointment.setHospitalDistrictName(schedule.getHospitalDistrictName());
					appointments.add(appointment);
				}
				schedule.setAppointments(appointments);
				
				resList.add(schedule);
			}
			
			result.setList(resList);
		}
		return result;
	}
	/**
	 * 获取某一排班的可预约序号列表（APPOINT005）
	 * @param param
	 * @return
	 */
	public HisListResponse<Appointment> getAppointSources(Schedule param){
		RestListResponse response = hisRestDao.postForList("二期", RestRequest.SEND_TYPE_LOCATION, param);
		HisListResponse<Appointment> result = new HisListResponse<Appointment>(response);
		List<Appointment> resList = new ArrayList<Appointment>();
		result.setList(resList);
		return result;
	}
	/**
	 * 预约记录生成(APPOINT006)
	 * @param patient
	 * @param srouce
	 * @param param
	 * @return
	 */
	public HisEntityResponse<Appointment> bookAppiontment(Appointment param){
		Map<String,Object> reqMap = new HashMap<String,Object>();
        //入参字段映射
        reqMap.put("BOOKING_PLATFORM", param.getBookingPlatform());
        reqMap.put("SCHEDULEID", param.getScheduleId());
        reqMap.put("APPOINTMENT_NO", param.getAppointmentNo());
        reqMap.put("APPOINTMENT_TIME", param.getAppointmentTime());
        reqMap.put("PATIENTNO", param.getPatientNo());
        reqMap.put("PATIENT_NAME", param.getPatientName());
        reqMap.put("PATIENT_SEX", param.getPatientSex());
        reqMap.put("PATIENT_PHONE_NO", param.getPatientPhone());
        reqMap.put("PATIENT_ID_NO", param.getPatientIdNo());
        reqMap.put("REMARKS", param.getRemarks());
        reqMap.put("OperaterUserID", param.getOperaterUserID());
        

        RestEntityResponse response = hisRestDao.postForEntity("APPOINT006", RestRequest.SEND_TYPE_POST, reqMap);
        Map<String, Object> resMap = response.getEntity();
        HisEntityResponse<Appointment> result = new HisEntityResponse<Appointment>(response);
        if(response.isSuccess() && null != resMap){
			Appointment  appointment = new Appointment();
			appointment.setVerifyCode(object2String(resMap.get("VERIFY_CODE")));//取号凭证
            appointment.setAppointmentNo(object2String(resMap.get("APPOINTMENT_NO")));//预约序号
            appointment.setAppointmentTime(object2String(resMap.get("APPOINTMENT_TIME")));//预约时间
            appointment.setAppointmentInfo(object2String(resMap.get("APPOINTMENT_INFO")));//预约信息
            appointment.setPatientName(object2String(resMap.get("brxm")));//病人姓名
            appointment.setAppointmentDate(object2String(resMap.get("yyrq")));//预约日期
            appointment.setDeptName(object2String(resMap.get("zk")));//预约科室
            appointment.setScheduleDeptName(object2String(resMap.get("zb")));//值班科室
            appointment.setClinicHouse(object2String(resMap.get("zs")));//预约诊室
            appointment.setHouseLocation(object2String(resMap.get("fjwz")));//房间位置
            appointment.setHospitalDistrictName(object2String(resMap.get("yq")));//院区
				
			result.setEntity(appointment);
		}
		
		return result;
	}

	/**
	 * 未签到预约记录查询	appointment/unsigned/list	get
	 * @param appiont
	 * @return
	 */
	@Deprecated
	public HisListResponse<Appointment> unsignedList(Patient param){
		RestListResponse response = hisRestDao.postForList("二期", RestRequest.SEND_TYPE_LOCATION, param);
		return new HisListResponse<Appointment>(response);
	}
	
	/**
	 * 已预约挂号信息查询(APPOINT007)
	 * 根据病人姓名、电话、时间查询
	 * @param appiont
	 * @return
	 */
	@Deprecated
	public HisListResponse<Appointment> appointments(Appointment param){
		Map<String,Object> reqMap = new HashMap<String,Object>();
        //入参字段映射
        reqMap.put("PATIENT_NAME", param.getPatientName());
        reqMap.put("PATIENT_PHONE_NO", param.getPatientPhone());
        reqMap.put("APPOINTMENT_TIME", param.getAppointmentTime());
		
		RestListResponse response = hisRestDao.postForList("APPOINT007", RestRequest.SEND_TYPE_LOCATION, reqMap);
		HisListResponse<Appointment> reuslt =new  HisListResponse<Appointment>();
		List<Map<String, Object>> resMapList = response.getList();
		List<Appointment> resList = new ArrayList<Appointment>();
		Appointment appointment = null;
		if(null != resMapList){
			for(Map<String, Object> resMap : resMapList){
				appointment = new Appointment();
				appointment.setAppointmentId(object2String(resMap.get("APPOINTMENT_ID")));
				appointment.setDoctorName(object2String(resMap.get("DOCTOR_NAME")));
				appointment.setDoctorTypeName(object2String(resMap.get("DOCTOR_TYPENAME")));
				appointment.setDeptName(object2String(resMap.get("DEPT_NAME")));
				appointment.setClinicTypeName(object2String(resMap.get("DOCTOR_CLINIC_TYPENAME")));
				appointment.setHospitalDistrictName(object2String(resMap.get("HOSPITAL_DISTRICTNAME")));
				appointment.setAppointmentNo(object2String(resMap.get("APPOINTMENT_NO")));
				appointment.setAppointmentTime(object2String(resMap.get("APPOINTMENT_TIME")));
				appointment.setAppointmentState(object2String(resMap.get("APPOINTMENT_STATE")));

				resList.add(appointment);
			}
			reuslt.setList(resList);
		}
		
		return reuslt;
	}
	
	/**
	 * 已预约挂号信息查询(APPOINT0071)
	 * @param appiont
	 * @return
	 */
	public HisListResponse<Appointment> getAppointments(Appointment param){
		Map<String,Object> reqMap = new HashMap<String,Object>();
        //入参字段映射
        reqMap.put("PATIENT_NO", param.getPatientNo());
        reqMap.put("APPOINTMENT_TIME", param.getAppointmentTime());
		
		RestListResponse response = hisRestDao.postForList("APPOINT0071", RestRequest.SEND_TYPE_LOCATION, reqMap);
		HisListResponse<Appointment> result = new HisListResponse<Appointment>(response);
		List<Map<String, Object>> resMapList = response.getList();
		List<Appointment> resList = new ArrayList<Appointment>();
		Appointment appointment = null;
		if(null != resMapList){
			for(Map<String, Object> resMap : resMapList){
				appointment = new Appointment();
				appointment.setAppointmentId(object2String(resMap.get("APPOINTMENT_ID")));
				appointment.setDoctorName(object2String(resMap.get("DOCTOR_NAME")));
				appointment.setDoctorTypeName(object2String(resMap.get("DOCTOR_TYPENAME")));
				appointment.setDeptName(object2String(resMap.get("DEPT_NAME")));
				appointment.setClinicTypeName(object2String(resMap.get("DOCTOR_CLINIC_TYPENAME")));
				appointment.setHospitalDistrictName(object2String(resMap.get("HOSPITAL_DISTRICTNAME")));
				appointment.setAppointmentNo(object2String(resMap.get("APPOINTMENT_NO")));
				appointment.setAppointmentTime(object2String(resMap.get("APPOINTMENT_TIME")));
				appointment.setAppointmentState(object2String(resMap.get("APPOINTMENT_STATE")));//0预留，1预约，2等待，3已呼叫，4已刷卡，5完成，9放弃
				
				resList.add(appointment);
			}
			result.setList(resList);
		}
		
		return result;
	}
	
	/**
	 * 就诊登记(APPOINT011)
	 * @param appiont
	 * @return
	 */
	public HisEntityResponse<Appointment> sign(Appointment param){
		Map<String,Object> reqMap = new HashMap<String,Object>();
        //入参字段映射
		reqMap.put("BOOKING_PLATFORM", param.getBookingPlatform());
		reqMap.put("CARDNO", param.getCardNo());
		reqMap.put("PATIENTNO", param.getPatientNo());
        reqMap.put("APPOINTMENTID", param.getAppointmentId());
        reqMap.put("OperaterUserID", param.getOperaterUserID());
        
		RestEntityResponse response = hisRestDao.postForEntity("APPOINT011", RestRequest.SEND_TYPE_POST, reqMap);
		Map<String, Object> resMap = response.getEntity();
        HisEntityResponse<Appointment> result = new HisEntityResponse<Appointment>(response);
        if(response.isSuccess() && null != resMap){
            Appointment  appointment = new Appointment();
            appointment.setAppointmentInfo(object2String(resMap.get("APPOINTMENT_INFO")));//预约信息
            appointment.setPatientName(object2String(resMap.get("brxm")));//病人姓名
            appointment.setAppointmentDate(object2String(resMap.get("yyrq")));//预约日期
            appointment.setDeptName(object2String(resMap.get("zk")));//预约科室
            appointment.setScheduleDeptName(object2String(resMap.get("zb")));//值班科室
            appointment.setClinicHouse(object2String(resMap.get("zs")));//预约诊室
            appointment.setHouseLocation(object2String(resMap.get("fjwz")));//房间位置
            appointment.setHospitalDistrictName(object2String(resMap.get("yq")));//院区
                
            result.setEntity(appointment);
        }
        
        return result;
	}
	/**
	 * 3.4取消预约(APPOINT008)
	 * @param appiont
	 * @return
	 */
	public HisEntityResponse<Appointment> cancel(Appointment param) {
		Map<String, Object> reqMap = new HashMap<String, Object>();
		// 入参字段映射
		reqMap.put("ll_fzyyid", param.getAppointmentId());
        reqMap.put("OperaterUserID", param.getOperaterUserID());

		RestEntityResponse response = hisRestDao.postForEntity("APPOINT008", RestRequest.SEND_TYPE_POST, reqMap);
		HisEntityResponse<Appointment> result= new HisEntityResponse<Appointment>(response);
		
		return result;
	}

	private String object2String(Object obj){
		return obj==null ? "" : obj.toString();
	}
	
	
}
