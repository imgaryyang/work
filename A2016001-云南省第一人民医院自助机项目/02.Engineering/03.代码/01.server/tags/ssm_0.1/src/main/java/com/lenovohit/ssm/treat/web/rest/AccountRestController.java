package com.lenovohit.ssm.treat.web.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.rest.BaseRestController;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.ssm.SSMConstants;
import com.lenovohit.ssm.treat.manager.HisAccountManager;
import com.lenovohit.ssm.treat.model.AccountBill;
import com.lenovohit.ssm.treat.model.HisAccount;
import com.lenovohit.ssm.treat.model.Patient;

/**
 * 账户
 */
@RestController
@RequestMapping("/ssm/treat/account/")
public class AccountRestController extends BaseRestController {
	
	@Autowired
	private HisAccountManager hisAccountManager;
	/**
	 * 账户基本信息查询
	 * @param data
	 * @return
	 */
	@RequestMapping(value="/info",method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forAccountInfo(){
		//获取当前患者
		Patient patient =this.getCurrentPatient();
		HisAccount account = hisAccountManager.accountInfo(patient);
		return ResultUtils.renderSuccessResult(account);
	}
	/**
	 * 开通预存
	 * @param data
	 * @return
	 */
	@RequestMapping(value="/open",method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result openPrepaid(){
		Patient patient =this.getCurrentPatient();
		HisAccount account = hisAccountManager.openPrepaid(patient);
		return ResultUtils.renderSuccessResult(account);
	}
	
	/**
	 * 预存/消费记录
	 * @param data
	 * @return
	 */
	@RequestMapping(value="/bill/list",method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result billList(@RequestParam(value = "data", defaultValue = "") String data){
		HisAccount account =  JSONUtils.deserialize(data, HisAccount.class);
		//TODO 校验
		List<AccountBill> bills = hisAccountManager.billList(account);
		return ResultUtils.renderSuccessResult(bills);
	}
	
	private Patient getCurrentPatient(){
		// 获取当前患者
		Patient patient = (Patient)this.getSession().getAttribute(SSMConstants.SSM_PATIENT_KEY);
		if(patient == null ){//TODO 生产时修改
			//patient = hisPatientManager.getPatientByHisID("");
			//TODO 异常，找不到当前患者 未登录
		}
		return patient;
	}
}
