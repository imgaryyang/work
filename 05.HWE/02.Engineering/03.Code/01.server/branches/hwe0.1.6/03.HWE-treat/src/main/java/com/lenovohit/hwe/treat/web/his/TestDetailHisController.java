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
import com.lenovohit.hwe.treat.model.TestDetail;
import com.lenovohit.hwe.treat.service.HisTestDetailService;
import com.lenovohit.hwe.treat.transfer.RestListResponse;

// 化验明细
@RestController
@RequestMapping("/hwe/treat/his/testDetail")
public class TestDetailHisController extends OrgBaseRestController {

	@Autowired
	private HisTestDetailService hisTestDetailService;
	
	// 化验明细查询
	@RequestMapping(value = "/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@RequestParam(value = "data", defaultValue = "") String data) {
		try {
			TestDetail model =  JSONUtils.deserialize(data, TestDetail.class);
			RestListResponse<TestDetail> response = this.hisTestDetailService.findList(model, null);
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
