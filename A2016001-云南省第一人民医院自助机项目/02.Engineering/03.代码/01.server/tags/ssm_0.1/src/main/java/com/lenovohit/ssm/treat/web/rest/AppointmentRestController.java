package com.lenovohit.ssm.treat.web.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lenovohit.core.dao.Page;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.rest.BaseRestController;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.ssm.SSMConstants;
import com.lenovohit.ssm.treat.manager.HisAppointmentManager;
import com.lenovohit.ssm.treat.model.AppointmentTimePeriod;
import com.lenovohit.ssm.treat.model.HisAccount;
import com.lenovohit.ssm.treat.model.HisDepartment;
import com.lenovohit.ssm.treat.model.InpatientInfo;
import com.lenovohit.ssm.treat.model.MedicalRecord;
import com.lenovohit.ssm.treat.model.Patient;
import com.lenovohit.ssm.treat.model.Schedule;

/**
 * 预约
 */
@RestController
@RequestMapping("/ssm/treat/appointment")
public class AppointmentRestController extends BaseRestController {
	
	@Autowired
	private HisAppointmentManager hisAppointmentManager;
	/**
	 * 获取排班科室
	 * @param data
	 * @return
	 */
	@RequestMapping(value="/department/list",method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forDepartmentList(){
		List<HisDepartment> depts = hisAppointmentManager.getDepartmentList();
		return ResultUtils.renderSuccessResult(depts);
	}
	/**
	 * 获取排班医生
	 * @param data
	 * @return
	 */
	@RequestMapping(value="/doctor/list",method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forDoctorList(){
		return ResultUtils.renderSuccessResult();
	}
	/**
	 * 获取号源信息
	 * @param data
	 * @return
	 */
	@RequestMapping(value="/resource/page/{start}/{limit}",method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forResourcePage(@PathVariable("start") String start, @PathVariable("limit") String limit){
		List<Schedule> list= this.hisAppointmentManager.getSchedules(null);
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setTotal(list==null?0:list.size());
		page.setResult(list);
		return ResultUtils.renderSuccessResult(page);
	}
	/**
	 * 获取时间段信息
	 * @param data
	 * @return
	 */
	@RequestMapping(value="/timePeriod/page/{start}/{limit}",method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forTimelist(@PathVariable("start") String start, @PathVariable("limit") String limit,@RequestParam(value = "data", defaultValue = "") String data){
		List<AppointmentTimePeriod> list= this.hisAppointmentManager.getTimePeriod(null);
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setTotal(list==null?0:list.size());
		page.setResult(list);
		return ResultUtils.renderPageResult(page);
	}
	
	/**
	 * 获取一个排班下的所有时间段
	 * @param data
	 * @return
	 */
	@RequestMapping(value="/timePeriods/{scheduleId}",method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forTimelist(@PathVariable("scheduleId") String scheduleId){
		List<AppointmentTimePeriod> list= this.hisAppointmentManager.getScheduleTimePeriod(scheduleId);
		return ResultUtils.renderSuccessResult(list);
	}
	
	/**
	 * 用户选择是否使用医保，如果使用医保，前台调用医保工具预结算
	 * 根据预结算结果生成挂号订单、挂号医保结算单、挂号自费结算单
	 * 如果不使用医保，则直接生成订单、结算单
	 * 生成订单时，记录订单回调bean。当订单支付完毕后会直接调用通知his
	 * @param data
	 * @return
	 */
	@RequestMapping(value="/createOrder",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forCreateOrder(@RequestBody String data){
		//TODO 
		return ResultUtils.renderSuccessResult();
	}
	
	/**
	 * 预约信息查询(未签到预约、历史预约等)
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/page/{start}/{limit}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forPage(@PathVariable("start") String start, @PathVariable("limit") String limit){
		AppointmentTimePeriod appiont = new AppointmentTimePeriod();
		List<AppointmentTimePeriod> appointmentRecords = hisAppointmentManager.page(appiont);
		
		Page page = new Page();
		page.setStart(start);
		page.setPageSize(limit);
		page.setTotal(appointmentRecords==null?0:appointmentRecords.size());
		page.setResult(appointmentRecords);
		
		return ResultUtils.renderSuccessResult(page);
	}
	
	/**
	 * 取消预约
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/cancel", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forCancel(@RequestBody String data){
		AppointmentTimePeriod appiont = JSONUtils.deserialize(data, AppointmentTimePeriod.class);
		AppointmentTimePeriod appiontResult = hisAppointmentManager.cancel(appiont);
		return ResultUtils.renderSuccessResult(appiontResult);
	}
	
	/**
	 * 预约详细信息查询
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/info/{timePeriodId}", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forInfo(@PathVariable("timePeriodId") String timePeriodId){
		return ResultUtils.renderSuccessResult();
	}
	/**
	 * 预约
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/book", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forBook(@RequestBody String data){
		AppointmentTimePeriod time = JSONUtils.deserialize(data, AppointmentTimePeriod.class);
		System.out.println(data);
		AppointmentTimePeriod booked = this.hisAppointmentManager.bookTimePeriod(this.getCurrentPatient(), time);
		return ResultUtils.renderSuccessResult(booked);
	}
	/**
	 * 预约签到
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/sign", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forSign(@RequestBody String data){
		return ResultUtils.renderSuccessResult();
	}
	/**
	 * 未签到预约记录查询
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/unsigned/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forUnsignedList(){
		return ResultUtils.renderSuccessResult();
	}
	
	private Patient getCurrentPatient(){
		// 获取当前患者
		Patient patient = (Patient)this.getSession().getAttribute(SSMConstants.SSM_PATIENT_KEY);
		if(patient == null ){//TODO 生产时修改
			//patient = hisPatientManager.getPatientByHisID("");
			//TODO 异常，找不到当前患者 未登录
		}
		return patient;
	}
}
