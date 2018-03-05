package com.lenovohit.hcp.hrp.web.rest;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.TypeReference;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.base.web.rest.HcpBaseRestController;
import com.lenovohit.hcp.hrp.manager.InstrmStoreMng;
import com.lenovohit.hcp.hrp.model.InstrmInputInfo;
import com.lenovohit.hcp.hrp.model.InstrmOutputInfo;

@RestController
@RequestMapping("/hcp/hrp/insStoreMng")
public class InstrmStoreMngRestController extends HcpBaseRestController {
	@Autowired
	private InstrmStoreMng insStoreManager;
	
	// 入库
	@RequestMapping(value = "/insInput", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result insInput(@RequestBody String data) {
		List<InstrmInputInfo> returnList = new ArrayList<>();
		try {
			List<InstrmInputInfo> inputList =  (List<InstrmInputInfo>) JSONUtils.parseObject(data,new TypeReference< List<InstrmInputInfo>>(){});
			HcpUser hcpUser = this.getCurrentUser();
			returnList = insStoreManager.instrmInput(inputList, hcpUser);
		} catch (Exception e) {
			e.printStackTrace();
			System.out.println(e.getMessage());
			return ResultUtils.renderFailureResult(e.getMessage());
		}
		return ResultUtils.renderSuccessResult(returnList);
	}

	// 出库
	@RequestMapping(value = "/insOutput", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result insOutput(@RequestBody String data) {
		System.out.println(data);
		try {
			List<InstrmOutputInfo> outputList =  (List<InstrmOutputInfo>) JSONUtils.parseObject(data,new TypeReference< List<InstrmOutputInfo>>(){});
			HcpUser hcpUser = this.getCurrentUser();
			insStoreManager.instrmOutput(outputList, hcpUser);
		} catch (Exception e) {
			e.printStackTrace();
			System.out.println(e.getMessage());
			return ResultUtils.renderFailureResult(e.getMessage());
		}
		return ResultUtils.renderSuccessResult();
	}
}
