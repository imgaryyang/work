package com.lenovohit.hcp.pharmacy.web.rest;

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
import com.lenovohit.hcp.pharmacy.manager.PhaStoreManager;
import com.lenovohit.hcp.pharmacy.model.PhaInputInfo;
import com.lenovohit.hcp.pharmacy.model.PhaOutputInfo;

@RestController
@RequestMapping("/hcp/pharmacy/phaStoreMng")
public class PhaStoreMngRestController extends HcpBaseRestController {
	@Autowired
	private PhaStoreManager phaStoreManager;
	
	// 入库
	@RequestMapping(value = "/phaInput", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result phaInput(@RequestBody String data) {
		List<PhaInputInfo> returnList = new ArrayList<>();
		try {
			List<PhaInputInfo> inputList =  (List<PhaInputInfo>) JSONUtils.parseObject(data,new TypeReference< List<PhaInputInfo>>(){});
			HcpUser hcpUser = this.getCurrentUser();
			returnList = phaStoreManager.phaInput(inputList, hcpUser);
		} catch (Exception e) {
			e.printStackTrace();
			System.out.println(e.getMessage());
			return ResultUtils.renderFailureResult(e.getMessage());
		}
		return ResultUtils.renderSuccessResult(returnList);
	}

	// 出库
	@RequestMapping(value = "/phaOutput", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result phaOutput(@RequestBody String data) {
		List<PhaOutputInfo> outputList;
		try {
			outputList =  (List<PhaOutputInfo>) JSONUtils.parseObject(data,new TypeReference< List<PhaOutputInfo>>(){});
			HcpUser hcpUser = this.getCurrentUser();
			phaStoreManager.phaOutput(outputList, hcpUser);
		} catch (Exception e) {
			e.printStackTrace();
			System.out.println(e.getMessage());
			return ResultUtils.renderFailureResult(e.getMessage());
		}
		return ResultUtils.renderSuccessResult(outputList);
	}
	
	// 发药出库
	@RequestMapping(value = "/dispenseOutput", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result dispenseOutput(@RequestBody String data) {
		try {
			List<PhaOutputInfo> outputList =  (List<PhaOutputInfo>) JSONUtils.parseObject(data,new TypeReference< List<PhaOutputInfo>>(){});
			HcpUser hcpUser = this.getCurrentUser();
			phaStoreManager.dispenseOutput(outputList, hcpUser);
		} catch (Exception e) {
			e.printStackTrace();
			System.out.println(e.getMessage());
			return ResultUtils.renderFailureResult(e.getMessage());
		}
		return ResultUtils.renderSuccessResult();
	}
}
