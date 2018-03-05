package com.lenovohit.hwe.treat.web.rest;

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
import com.lenovohit.hwe.treat.model.TestDetail;
import com.lenovohit.hwe.treat.service.HisRecordTestService;
import com.lenovohit.hwe.treat.service.HisTestDetailService;
import com.lenovohit.hwe.treat.transfer.RestListResponse;

@RestController
@RequestMapping("/hwe/treat/medicalCheck")
public class AppCheckListController extends OrgBaseRestController {
	@Autowired
	private HisRecordTestService hisRecordTestService;
	@Autowired
	private HisTestDetailService hisTestDetailService;
	
	
	@RequestMapping(value = "/loadHisCheckList", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8 )
	public Result list(@RequestParam(value = "data", defaultValue = "") String data){
		RecordTest model =  JSONUtils.deserialize(data, RecordTest.class);
		RestListResponse<RecordTest> response = this.hisRecordTestService.findList(model, null);
		if(response.isSuccess())
			return ResultUtils.renderSuccessResult(response.getList());
		else 
			return ResultUtils.renderFailureResult(response.getMsg());
	}
	@RequestMapping(value = "/loadHisCheckDetail", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8 )
	public Result loadHisCheckListDetail(@RequestParam(value = "data", defaultValue = "") String data){
		TestDetail model =  JSONUtils.deserialize(data, TestDetail.class);
		RestListResponse<TestDetail> response = this.hisTestDetailService.findList(model, null);
		if(response.isSuccess())
			return ResultUtils.renderSuccessResult(response.getList());
		else 
			return ResultUtils.renderFailureResult(response.getMsg());
	}

	
}
