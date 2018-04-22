package com.lenovohit.ssm.treat.manager.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import com.lenovohit.ssm.payment.model.Order;
import com.lenovohit.ssm.payment.model.Settlement;
import com.lenovohit.ssm.treat.dao.FrontendRestDao;
import com.lenovohit.ssm.treat.manager.HisAppointmentManager;
import com.lenovohit.ssm.treat.model.AppointmentTimePeriod;
import com.lenovohit.ssm.treat.model.HisDepartment;
import com.lenovohit.ssm.treat.model.HisDoctor;
import com.lenovohit.ssm.treat.model.Patient;
import com.lenovohit.ssm.treat.model.Schedule;

public class HisAppointmentManagerImpl implements HisAppointmentManager{

	@Autowired
	private FrontendRestDao frontendRestDao;
	
	@Override
	public void bizAfterPay(Order order, Settlement settle) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public List<HisDepartment> getDepartmentList() {
		return frontendRestDao.getForList("appointment/department/list", HisDepartment.class);
	}

	@Override
	public List<HisDoctor> getDoctorList() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<Schedule> getSchedules(Schedule param) {
		return this.frontendRestDao.getForList("appointment/resource/page/0/10", Schedule.class);
	}

	@Override
	public List<AppointmentTimePeriod> getTimePeriod(AppointmentTimePeriod param) {
		// TODO Auto-generated method stub
		return null;
	}
	
	@Override
	public List<AppointmentTimePeriod> getScheduleTimePeriod(String scheduleId) {
		return this.frontendRestDao.getForList("appointment/timePeriod/list/"+scheduleId, AppointmentTimePeriod.class);
	}
	
	@Override
	public AppointmentTimePeriod bookTimePeriod(Patient patient, AppointmentTimePeriod param) {
		// TODO Auto-generated method stub
		return param;
	}

	@Override
	public List<AppointmentTimePeriod> unsignedList(AppointmentTimePeriod appiont) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<AppointmentTimePeriod> page(AppointmentTimePeriod appiont) {
		List<AppointmentTimePeriod> appointmentRecords = frontendRestDao.getForList("appointment/page/1/20", AppointmentTimePeriod.class);
		return appointmentRecords;
	}

	@Override
	public AppointmentTimePeriod sign(AppointmentTimePeriod appiont) {
		return this.frontendRestDao.getForEntity("appointment/sign", AppointmentTimePeriod.class);
	}

	@Override
	public AppointmentTimePeriod cancel(AppointmentTimePeriod appiont) {
		return this.frontendRestDao.getForEntity("appointment/cancel", AppointmentTimePeriod.class);
	}

}
