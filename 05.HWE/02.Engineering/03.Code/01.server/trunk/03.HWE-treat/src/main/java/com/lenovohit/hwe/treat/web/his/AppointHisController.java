  package com.lenovohit.hwe.treat.web.his;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hwe.org.web.rest.OrgBaseRestController;
import com.lenovohit.hwe.treat.model.Appoint;
import com.lenovohit.hwe.treat.model.Department;
import com.lenovohit.hwe.treat.model.Doctor;
import com.lenovohit.hwe.treat.service.HisAppointService;
import com.lenovohit.hwe.treat.transfer.RestEntityResponse;
import com.lenovohit.hwe.treat.transfer.RestListResponse;

// 预约挂号
@RestController
@RequestMapping("/hwe/treat/his/appoint")
public class AppointHisController extends OrgBaseRestController {

	@Autowired
	private GenericManager<Appoint, String> appointManager;
	@Autowired
	private HisAppointService hisAppointService;

	// 3.4.10 排班号源列表查询
	@RequestMapping(value = "/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@RequestParam(value = "data", defaultValue = "") String data) {
		try {
			log.info("\n======== forList Start ========\ndata:\n"+data);
			Appoint query =  JSONUtils.deserialize(data, Appoint.class);
			
			log.info("\n======== forList Before hisAppointService.findList ========\nquery:\n"+JSONUtils.serialize(query));
			RestListResponse<Appoint> result=this.hisAppointService.findList(query, null);
			log.info("\n======== forList After hisAppointService.findList ========/result:\n"+JSONUtils.serialize(result));
			
			if (result.isSuccess()){
				return ResultUtils.renderSuccessResult(result.getList());
			} else {
				return ResultUtils.renderFailureResult(result.getMsg());
			}
		} catch (Exception e) {
			log.error("\n======== forList Failure End ========\nmsg:\n"+e.getMessage());
			return ResultUtils.renderFailureResult(e.getMessage());
		}
	}
	
	// 3.4.2 可预约科室列表查询
	@RequestMapping(value = "/deptList", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forDeptList(@RequestParam(value = "data", defaultValue = "") String data) {
		try {
			log.info("\n======== forDeptList Start ========\ndata:\n"+data);
			Department query = JSONUtils.deserialize(data, Department.class);
			
			log.info("\n======== forDeptList Before hisAppointService.findDeptList ========\nquery:\n"+JSONUtils.serialize(query));
			RestListResponse<Department> result = this.hisAppointService.findDeptList(query, null);
			log.info("\n======== forDeptList After hisAppointService.findDeptList ========/result:\n"+JSONUtils.serialize(result));
			
			if (result.isSuccess()){
				return ResultUtils.renderSuccessResult(result.getList());
			} else {
				return ResultUtils.renderFailureResult(result.getMsg());
			}
		} catch (Exception e) {
			log.error("\n======== forDeptList Failure End ========\nmsg:\n"+e.getMessage());
			return ResultUtils.renderFailureResult(e.getMessage());
		}
	}

	// 3.4.2 可预约科室列表查询
	@RequestMapping(value = "/docList", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forDocList(@RequestParam(value = "data", defaultValue = "") String data) {
		try {
			log.info("\n======== forDocList Start ========\ndata:\n"+data);
			Doctor query = JSONUtils.deserialize(data, Doctor.class);
			
			log.info("\n======== forDocList Before hisAppointService.findDocList ========\nquery:\n"+JSONUtils.serialize(query));
			RestListResponse<Doctor> result = this.hisAppointService.findDocList(query, null);
			log.info("\n======== forDocList After hisAppointService.findDocList ========/result:\n"+JSONUtils.serialize(result));
			
			if (result.isSuccess()){
				return ResultUtils.renderSuccessResult(result.getList());
			} else {
				return ResultUtils.renderFailureResult(result.getMsg());
			}
		} catch (Exception e) {
			log.error("\n======== forDocList Failure End ========\nmsg:\n"+e.getMessage());
			return ResultUtils.renderFailureResult(e.getMessage());
		}
	}
	
	// 3.4.11 患者预约记录查询
	@RequestMapping(value = "/reserved/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forReservedList(@RequestParam(value = "data", defaultValue = "") String data) {
		try {
			log.info("\n======== forReservedList Start ========\ndata:\n"+data);
			Appoint query =  JSONUtils.deserialize(data, Appoint.class);
			
			log.info("\n======== forReservedList Before hisAppointService.findReservedList ========\nquery:\n"+JSONUtils.serialize(query));
			RestListResponse<Appoint> result=this.hisAppointService.findReservedList(query, null);
			log.info("\n======== forReservedList After hisAppointService.findReservedList ========\nresult:\n"+JSONUtils.serialize(result));
			
			if (result.isSuccess()){
				return ResultUtils.renderSuccessResult(result.getList());
			} else {
				return ResultUtils.renderFailureResult(result.getMsg());
			}
		} catch (Exception e) {
			log.error("\n======== forReservedList Failure End ========\nmsg:\n"+e.getMessage());
			return ResultUtils.renderFailureResult(e.getMessage());
		}
	}

	// 3.4.5 患者预约
	@RequestMapping(value = "/reserve", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forReserve(@RequestBody String data) {
		try {
			log.info("\n======== forReserve Start ========\ndata:\n"+data);
			Appoint appoint =  JSONUtils.deserialize(data, Appoint.class);
			
			log.info("\n======== forReserve Before hisAppointService.reserve ========\nappoint:\n"+JSONUtils.serialize(appoint));
			RestEntityResponse<Appoint> result=this.hisAppointService.reserve(appoint, null);
			log.info("\n======== forReserve After hisAppointService.reserve ========\nresult:\n"+JSONUtils.serialize(result));
			
			if (result.isSuccess()){
				appoint.setStatus("1");
//				appoint.setStatusName("已预约");
				appoint.setAppointTime(new Date());
				appoint.setNo(result.getEntity().getId());
				Appoint saved = this.appointManager.save(appoint);
				
				return ResultUtils.renderSuccessResult(saved);
			} else {
				return ResultUtils.renderFailureResult(result.getMsg());
			}
		} catch (Exception e) {
			log.error("\n======== forReserve Failure End ========\nmsg:\n"+e.getMessage());
			return ResultUtils.renderFailureResult(e.getMessage());
		}
	}
	
	// 3.4.7 患者签到
	@RequestMapping(value = "/sign", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forSign(@RequestBody String data) {
		try {
			log.info("\n======== forSign Start ========\ndata:\n"+data);
			Appoint appoint =  JSONUtils.deserialize(data, Appoint.class);
			
			log.info("\n======== forSign Before hisAppointService.sign ========\nappoint:\n"+JSONUtils.serialize(appoint));
			RestEntityResponse<Appoint> result=this.hisAppointService.sign(appoint, null);
			log.info("\n======== forSign After hisAppointService.sign ========\nresult:\n"+JSONUtils.serialize(result));
			
			if (result.isSuccess()){
				appoint.setStatus("2");
//				appoint.setStatusName("已签到");
				appoint.setSignTime(new Date());
				Appoint saved = this.appointManager.save(appoint);
				
				return ResultUtils.renderSuccessResult(saved);
			} else {
				return ResultUtils.renderFailureResult(result.getMsg());
			}
		} catch (Exception e) {
			log.error("\n======== forSign Failure End ========\nmsg:\n"+e.getMessage());
			return ResultUtils.renderFailureResult(e.getMessage());
		}
	}
	
	// 3.4.8 患者取消
	@RequestMapping(value = "/cancel", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forCancel(@RequestBody String data) {
		try {
			log.info("\n======== forCancel Start ========\ndata:\n"+data);
			Appoint appoint =  JSONUtils.deserialize(data, Appoint.class);
			
			log.info("\n======== forCancel Before hisAppointService.cancel ========\nappoint:\n"+JSONUtils.serialize(appoint));
			RestEntityResponse<Appoint> result=this.hisAppointService.cancel(appoint, null);
			log.info("\n======== forCancel After hisAppointService.cancel ========\nresult:\n"+JSONUtils.serialize(result));
			
			if (result.isSuccess()){
				appoint.setStatus("3");
//				appoint.setStatusName("已取消");
				Appoint saved = this.appointManager.save(appoint);
				
				return ResultUtils.renderSuccessResult(saved);
			} else {
				return ResultUtils.renderFailureResult(result.getMsg());
			}
		} catch (Exception e) {
			log.error("\n======== forCancel Failure End ========\nmsg:\n"+e.getMessage());
			return ResultUtils.renderFailureResult(e.getMessage());
		}
	}
}
