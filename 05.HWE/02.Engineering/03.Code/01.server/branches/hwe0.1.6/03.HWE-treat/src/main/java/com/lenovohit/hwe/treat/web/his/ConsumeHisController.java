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
import com.lenovohit.hwe.treat.model.Consume;
import com.lenovohit.hwe.treat.service.HisConsumeService;
import com.lenovohit.hwe.treat.transfer.RestListResponse;

@RestController
@RequestMapping("/hwe/treat/his/consume/")
public class ConsumeHisController extends OrgBaseRestController {
	@Autowired
	private HisConsumeService hisConsumeService;
	
	@RequestMapping(value = "list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@RequestParam(value = "data", defaultValue = "") String data) {
		Consume model = JSONUtils.deserialize(data, Consume.class);
		RestListResponse<Consume> response = this.hisConsumeService.findList(model, null);
		if(response.isSuccess())
			return ResultUtils.renderSuccessResult(response.getList());
		else 
			return ResultUtils.renderFailureResult(response.getMsg());
	}
}
