package com.lenovohit.hwe.treat.web.rest;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hwe.org.web.rest.OrgBaseRestController;
import com.lenovohit.hwe.treat.model.Deposit;

@RestController
@RequestMapping("/hwe/treat/deposit")
public class DepositRestController extends OrgBaseRestController {
	@Autowired
	private GenericManager<Deposit, String> depositManager;
	
	/**
	 * 保存预存记录
	 * @param data
	 * @return
	 */
	@RequestMapping(value="/create",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8/*TEXT_PLAIN_UTF_8*/)
	public Result forCreate(@RequestBody String data){
		Deposit model =  JSONUtils.deserialize(data, Deposit.class);
		model.setCreatedAt(new Date());
		model.setStatus("0");
		Deposit saved = this.depositManager.save(model);
		return ResultUtils.renderSuccessResult(saved);
	}
}
