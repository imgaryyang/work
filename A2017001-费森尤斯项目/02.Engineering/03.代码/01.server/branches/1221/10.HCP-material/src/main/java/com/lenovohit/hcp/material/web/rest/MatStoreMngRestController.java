package com.lenovohit.hcp.material.web.rest;

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
import com.lenovohit.hcp.material.manager.MatStoreManager;
import com.lenovohit.hcp.material.model.MatInputInfo;
import com.lenovohit.hcp.material.model.MatOutputInfo;

@RestController
@RequestMapping("/hcp/material/matStoreMng")
public class MatStoreMngRestController extends HcpBaseRestController {
	@Autowired
	private MatStoreManager matStoreManager;
	
	// 入库
	@RequestMapping(value = "/matInput", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result matInput(@RequestBody String data) {
		List<MatInputInfo> returnList = new ArrayList<>();
		try {
			List<MatInputInfo> inputList =  (List<MatInputInfo>) JSONUtils.parseObject(data,new TypeReference< List<MatInputInfo>>(){});
			HcpUser hcpUser = this.getCurrentUser();
			returnList = matStoreManager.matInput(inputList, hcpUser);
		} catch (Exception e) {
			e.printStackTrace();
			System.out.println(e.getMessage());
			return ResultUtils.renderFailureResult(e.getMessage());
		}
		return ResultUtils.renderSuccessResult(returnList);
	}

	// 出库
	@RequestMapping(value = "/matOutput", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result matOutput(@RequestBody String data) {
		System.out.println(data);
		try {
			List<MatOutputInfo> outputList =  (List<MatOutputInfo>) JSONUtils.parseObject(data,new TypeReference< List<MatOutputInfo>>(){});
			HcpUser hcpUser = this.getCurrentUser();
			matStoreManager.matOutput(outputList, hcpUser);
		} catch (Exception e) {
			e.printStackTrace();
			System.out.println(e.getMessage());
			return ResultUtils.renderFailureResult(e.getMessage());
		}
		return ResultUtils.renderSuccessResult();
	}
}
