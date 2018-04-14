  package com.lenovohit.hwe.treat.web.his;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hwe.org.web.rest.OrgBaseRestController;
import com.lenovohit.hwe.treat.model.RecordTest;
import com.lenovohit.hwe.treat.service.HisRecordTestService;
import com.lenovohit.hwe.treat.transfer.RestListResponse;

// 化验
@RestController
@RequestMapping("/hwe/treat/his/test")
public class RecordTestHisController extends OrgBaseRestController {

	@Autowired
	private HisRecordTestService hisRecordTestService;

	// 3.10.1	化验记录查询
	@RequestMapping(value = "/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@RequestParam(value = "data", defaultValue = "") String data) {
		try {
			RecordTest model =  JSONUtils.deserialize(data, RecordTest.class);
			RestListResponse<RecordTest> response = this.hisRecordTestService.findList(model, null);
			if(response.isSuccess())
				return ResultUtils.renderSuccessResult(response.getList());
			else 
				return ResultUtils.renderFailureResult(response.getMsg());
		} catch (Exception e) {
			log.error("\n======== forList Failure End ========\nmsg:\n"+e.getMessage());
			return ResultUtils.renderFailureResult(e.getMessage());
		}
	}
	
}
