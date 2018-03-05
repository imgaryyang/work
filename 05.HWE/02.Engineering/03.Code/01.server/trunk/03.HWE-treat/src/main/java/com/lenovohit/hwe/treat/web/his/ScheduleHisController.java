  package com.lenovohit.hwe.treat.web.his;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hwe.org.web.rest.OrgBaseRestController;
import com.lenovohit.hwe.treat.model.Schedule;
import com.lenovohit.hwe.treat.service.HisScheduleService;
import com.lenovohit.hwe.treat.transfer.RestListResponse;

// 排班
@RestController
@RequestMapping("/hwe/treat/his/schedule")
public class ScheduleHisController extends OrgBaseRestController {

	@Autowired
	private HisScheduleService hisScheduleService;

	// 3.4.9 科室排班列表查询
	@RequestMapping(value = "/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@RequestParam(value = "data", defaultValue = "") String data) {
		try {
			log.info("\n======== forList Start ========\ndata:\n"+data);
			Schedule query =  JSONUtils.deserialize(data, Schedule.class);
			
			log.info("\n======== forList Before hisScheduleService.findList ========\nquery:\n"+JSONUtils.serialize(query));
			RestListResponse<Schedule> result=this.hisScheduleService.findList(query, null);
			
			log.info("\n======== forList After hisScheduleService.findList ========\nresult:\n"+JSONUtils.serialize(result));
			if (!result.isSuccess())		throw new BaseException("HIS返回失败："+result.getMsg());
			
			log.info("\n======== forList Success End ========\nlist:\n"+JSONUtils.serialize(result.getList()));
			return ResultUtils.renderSuccessResult(result.getList());
		} catch (Exception e) {
			log.error("\n======== forList Failure End ========\nmsg:\n"+e.getMessage());
			return ResultUtils.renderFailureResult(e.getMessage());
		}
	}
}
