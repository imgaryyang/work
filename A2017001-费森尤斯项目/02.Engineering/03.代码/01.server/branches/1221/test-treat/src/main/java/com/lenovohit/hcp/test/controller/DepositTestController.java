package com.lenovohit.hcp.test.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lenovohit.bdrp.authority.web.rest.AuthorityRestController;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hcp.test.model.TestDeposit;


@RestController
@RequestMapping("/hcp/app/test/deposit")
public class DepositTestController extends AuthorityRestController {
	@Autowired
	private GenericManager<TestDeposit, String> testDepositManager;
	
	@RequestMapping(value = "/list", method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(@RequestParam(value = "data", defaultValue = "") String data){
		List<TestDeposit> list = this.testDepositManager.findAll();
		return ResultUtils.renderSuccessResult(list);
	}
}
