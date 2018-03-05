package com.lenovohit.hwe.treat.web.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.TypeReference;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hwe.org.web.rest.OrgBaseRestController;
import com.lenovohit.hwe.treat.model.Charge;
import com.lenovohit.hwe.treat.model.ChargeDetail;
import com.lenovohit.hwe.treat.service.HisChargeService;
import com.lenovohit.hwe.treat.transfer.RestEntityResponse;

@RestController
@RequestMapping("/hwe/treat/charge/")
public class ChargeRestController extends OrgBaseRestController {

	@Autowired
	private HisChargeService hisChargeService;
	
	@RequestMapping(value = "prePayInfo", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result prePayInfo(@RequestParam(value = "data", defaultValue = "") String data) {
		List<ChargeDetail> chagerList = JSONUtils.parseObject(data, new TypeReference<List<ChargeDetail>>() {
		});
		System.out.println("==============自费预结算开始===================");
		RestEntityResponse<Charge> response = this.hisChargeService.prepay(chagerList);
		System.out.println("==============自费预结算结束===================");
		if(response.isSuccess())
			return ResultUtils.renderSuccessResult(response.getEntity());
		else 
			return ResultUtils.renderFailureResult(response.getMsg());
	}
}
