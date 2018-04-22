package com.lenovohit.ssm.treat.manager;

import com.lenovohit.ssm.treat.model.Appointment;
import com.lenovohit.ssm.treat.model.Department;
import com.lenovohit.ssm.treat.model.Patient;
import com.lenovohit.ssm.treat.model.Schedule;
import com.lenovohit.ssm.treat.transfer.manager.HisEntityResponse;
import com.lenovohit.ssm.treat.transfer.manager.HisListResponse;
/**
 * 预约签到不收费
 * @author xiaweiyi
 *
 */
public interface HisAppointmentManager {
	/**
	 * 科室基本信息查询 APPOINT001
	 * @param param
	 * @return
	 */
	public HisListResponse<Department> getDepartments();
	/**
	 * 医生号源排班信息查询(按科室) APPOINT003
	 * @param param
	 * @return
	 */
	public HisListResponse<Schedule> getDepartmentSchedules(Schedule param);
	/**
	 * 医生号源排班信息查询(按医师) APPOINT004
	 * @param param
	 * @return
	 */
	public HisListResponse<Schedule> getDoctorSchedules(Schedule param);
	/**
	 * 获取某一排班的可预约序号列表（APPOINT005）
	 * @param param
	 * @return
	 */
	public HisListResponse<Appointment> getAppointSources(Schedule param);
	/**
	 * 预约记录生成(APPOINT006)
	 * @param patient
	 * @param srouce
	 * @param param
	 * @return
	 */
	public HisEntityResponse<Appointment> bookAppiontment(Appointment param);

	/**
	 * 未签到预约记录查询	appointment/unsigned/list	get
	 * @param appiont
	 * @return
	 */
	@Deprecated
	public HisListResponse<Appointment> unsignedList(Patient param);
	
	/**
	 * 已预约挂号信息查询(APPOINT007)
	 * @param appiont
	 * @return
	 */
	@Deprecated
	public HisListResponse<Appointment> appointments(Appointment param);
	
	/**
	 * 已预约挂号信息查询(APPOINT0071)
	 * @param appiont
	 * @return
	 */
	public HisListResponse<Appointment> getAppointments(Appointment param);
	
	/**
	 * 就诊登记(APPOINT011)
	 * @param appiont
	 * @return
	 */
	public HisEntityResponse<Appointment> sign(Appointment param);
	/**
	 * 3.4取消预约(APPOINT008)
	 * @param appiont
	 * @return
	 */
	public HisEntityResponse<Appointment> cancel(Appointment param);
	
}
