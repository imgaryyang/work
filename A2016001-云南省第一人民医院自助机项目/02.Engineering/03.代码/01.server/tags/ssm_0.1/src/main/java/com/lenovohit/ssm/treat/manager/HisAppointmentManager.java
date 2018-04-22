package com.lenovohit.ssm.treat.manager;

import java.util.List;

import com.lenovohit.ssm.payment.manager.HisPayManager;
import com.lenovohit.ssm.treat.model.AppointmentTimePeriod;
import com.lenovohit.ssm.treat.model.HisDepartment;
import com.lenovohit.ssm.treat.model.HisDoctor;
import com.lenovohit.ssm.treat.model.Patient;
import com.lenovohit.ssm.treat.model.Schedule;

public interface HisAppointmentManager extends HisPayManager{
	
	/**
	 * （预约）科室列表查询	appointment/department/list	get
	 * @param param
	 * @return
	 */
	public List<HisDepartment> getDepartmentList();
	/**
	 * 科室可预约医生查询	appointment/doctor/list	get
	 * @param param
	 * @return
	 */
	public List<HisDoctor> getDoctorList();
	/**
	 * 可预约号源查询	appointment/resource/page/{start}/{limit}	get
	 * @param param
	 * @return
	 */
	public List<Schedule> getSchedules(Schedule param);
	/**
	 * 可预约时间段查询	appointment/timePeriod/page/{start}/{limit}	get
	 * @param param
	 * @return
	 */
	public List<AppointmentTimePeriod> getTimePeriod(AppointmentTimePeriod param);
	/**
	 * 可预约时间段查询	appointment/timePeriod/page/{start}/{limit}	get
	 * @param param
	 * @return
	 */
	public List<AppointmentTimePeriod> getScheduleTimePeriod(String  scheduleId);
	/**
	 * 预约时间段	appointment/book	post
	 * @param patient
	 * @param srouce
	 * @param param
	 * @return
	 */
	public AppointmentTimePeriod bookTimePeriod(Patient patient,AppointmentTimePeriod param);

	/**
	 * 未签到预约记录查询	appointment/unsigned/list	get
	 * @param appiont
	 * @return
	 */
	public List<AppointmentTimePeriod> unsignedList(AppointmentTimePeriod appiont);
	
	/**
	 * 预约记录查询	appointment/page	get
	 * @param appiont
	 * @return
	 */
	public List<AppointmentTimePeriod> page(AppointmentTimePeriod appiont);
	/**
	 * 预约签到	appointment/sign	post
	 * @param appiont
	 * @return
	 */
	public AppointmentTimePeriod sign(AppointmentTimePeriod appiont);
	/**
	 * 取消预约	appointment/cancel	post
	 * @param appiont
	 * @return
	 */
	public AppointmentTimePeriod cancel(AppointmentTimePeriod appiont);
	
	/**
	 *  收费回调，根据情况
	 *  1 预约时收费，则预约接口弃用，使用该接口
	 *  2 签到时收费，则签到接口弃用，使用该接口
	 * @param order
	 * @param settle
	 */
	//void bizAfterPay(Order order,Settlement settle);
}
