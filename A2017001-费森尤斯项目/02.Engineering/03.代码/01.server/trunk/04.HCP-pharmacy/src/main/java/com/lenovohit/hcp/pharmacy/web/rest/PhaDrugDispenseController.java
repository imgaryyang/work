package com.lenovohit.hcp.pharmacy.web.rest;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.hcp.base.model.Department;
import com.lenovohit.hcp.base.model.HcpUser;
import com.lenovohit.hcp.base.web.rest.HcpBaseRestController;
import com.lenovohit.hcp.odws.model.MedicalOrder;
import com.lenovohit.hcp.pharmacy.manager.PhaDrugDispenseManager;
import com.lenovohit.hcp.pharmacy.manager.PhaStoreManager;
import com.lenovohit.hcp.pharmacy.model.PhaDrugInfo;
import com.lenovohit.hcp.pharmacy.model.PhaOutputInfo;
import com.lenovohit.hcp.pharmacy.model.PhaRecipe;

/**
 * 收费管理
 */
@RestController
@RequestMapping("/hcp/pharmacy/dispense")
public class PhaDrugDispenseController extends HcpBaseRestController {
	
	/**
	 * 门诊处方manager
	 */
	@Autowired
	private GenericManager<MedicalOrder, String> medicalOrderManager;
	
	/**
	 * 药品处方请领manager
	 */
	@Autowired
	private GenericManager<PhaRecipe, String> phaRecipeManager;
	
	/**
	 * 发药manager
	 */
	@Autowired
	private PhaDrugDispenseManager drugDispenseManager;
	
	/**
	 * 发药
	 * @param data
	 * @return
	 */
	@RequestMapping(value="/done",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8/*TEXT_PLAIN_UTF_8*/)
	public Result forDispense(@RequestBody String data){
		try {
			// 当前登录用户
			HcpUser user = this.getCurrentUser();
			// 处方号
			String recipeId = JSONUtils.deserialize(data, String.class);
			// 发药
			drugDispenseManager.dispense(recipeId, user);
			return ResultUtils.renderSuccessResult();
		} catch(BaseException e) {
			return ResultUtils.renderFailureResult(e.getMessage());
		}
	}

}
