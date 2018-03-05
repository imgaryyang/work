package com.lenovohit.hwe.treat.web.rest;

import java.math.BigDecimal;

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
import com.lenovohit.hwe.treat.model.ChargeDetail;
import com.lenovohit.hwe.treat.service.HisChargeDetailService;
import com.lenovohit.hwe.treat.transfer.RestListResponse;

@RestController
@RequestMapping("/hwe/treat/chargeDetail/")
public class ChargeDetailRestController extends OrgBaseRestController {

	@Autowired
	private HisChargeDetailService hisChargeDetailService;
	
	@RequestMapping(value = "list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@RequestParam(value = "data", defaultValue = "") String data) {
		ChargeDetail model = JSONUtils.deserialize(data, ChargeDetail.class);
		RestListResponse<ChargeDetail> response = this.hisChargeDetailService.findList(model);
		if(response.isSuccess())
			return ResultUtils.renderSuccessResult(response.getList());
		else 
			return ResultUtils.renderFailureResult(response.getMsg());
	}
}
