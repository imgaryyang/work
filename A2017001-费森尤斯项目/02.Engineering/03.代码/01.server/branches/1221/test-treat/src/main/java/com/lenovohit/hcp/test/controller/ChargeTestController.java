package com.lenovohit.hcp.test.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hcp.test.model.TestCharge;

@RestController
@RequestMapping("/hcp/app/test/charge")
public class ChargeTestController {
	@Autowired
	private GenericManager<TestCharge, String> testChargeManager;
	
	@RequestMapping(value = "/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@RequestParam(value = "data", defaultValue = "") String data){
		List<TestCharge> list = this.testChargeManager.findAll();
		return ResultUtils.renderSuccessResult(list);
	}
}
