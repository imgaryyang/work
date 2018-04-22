package com.lenovohit.ssm.treat.web.rest;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.rest.BaseRestController;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.ssm.SSMConstants;
import com.lenovohit.ssm.payment.model.Order;
import com.lenovohit.ssm.payment.model.Settlement;
import com.lenovohit.ssm.treat.manager.HisAccountManager;
import com.lenovohit.ssm.treat.manager.HisPatientManager;
import com.lenovohit.ssm.treat.model.HisAccount;
import com.lenovohit.ssm.treat.model.MedicalCard;
import com.lenovohit.ssm.treat.model.Patient;

/**
 * 患者基本信息
 */
@RestController
@RequestMapping("/ssm/treat/patient")
public class PatientRestController extends BaseRestController {
	@Autowired
	private HisAccountManager hisAccountManager;
	@Autowired
	private HisPatientManager hisPatientManager;
	@Autowired
	private GenericManager<Order, String> orderManager;
	@Autowired
	private GenericManager<Settlement, String> settlementManager;
	
	/**
	 * 患者登录
	 * @param data
	 * @return
	 */
	@RequestMapping(value="/login",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forLogin(@RequestBody String data){
		Patient loginInfo =  JSONUtils.deserialize(data, Patient.class);
		Patient patient = hisPatientManager.getPatient(loginInfo);
		if(patient == null){
			return ResultUtils.renderFailureResult();
		}
		this.getSession().setAttribute(SSMConstants.SSM_PATIENT_KEY,patient);
		HisAccount account= hisAccountManager.accountInfo(patient);
		patient.setAccount(account);
		return ResultUtils.renderSuccessResult(patient);
	}
	/**
	 * 患者登出
	 * @return
	 */
	@RequestMapping(value="/logout",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forLogout(){
		this.getSession().removeAttribute(SSMConstants.SSM_PATIENT_KEY);
		return ResultUtils.renderSuccessResult();
	}
	/**
	 * 查询患者信息（包含账户信息）
	 * @param data
	 * @return
	 */
	@RequestMapping(value="/info",method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forPatientInfo(@RequestParam(value = "data", defaultValue = "") String data){
		Patient searchInfo =  JSONUtils.deserialize(data, Patient.class);
		Patient patient = null;
		if(StringUtils.isEmpty(searchInfo.getId())){
			patient = hisPatientManager.getPatientByHisID(searchInfo.getId());
		}else if(StringUtils.isEmpty(searchInfo.getMiCardNo())){
			patient = hisPatientManager.getPatientByMI(searchInfo.getMiCardNo());
		}else if(StringUtils.isEmpty(searchInfo.getIdNo())){
			patient = hisPatientManager.getPatientByIDCard(searchInfo.getIdNo());
		}
		if(patient == null){
			return ResultUtils.renderFailureResult();
		}
		HisAccount account= hisAccountManager.accountInfo(patient);
		patient.setAccount(account);
		return ResultUtils.renderSuccessResult(patient);
	}
	/**
	 * 建立档案
	 * @param data
	 * @return
	 */
	@RequestMapping(value="/profile/create",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forCreateArchives(@RequestBody String data){
		Patient baseInfo =  JSONUtils.deserialize(data, Patient.class);
		Patient patient = hisPatientManager.createProfile(baseInfo);
		return ResultUtils.renderSuccessResult(patient);
	}
	/**
	 * 生成就诊卡收费订单结算单
	 * @param data
	 * @return
	 */
	@RequestMapping(value="/card/createOrder",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forCreateCardOrder(@RequestBody String data){
		Order order = new Order();
		Settlement settle = new Settlement();
		settle.setAmt(order.getAmt());
		settle.setOrderId(order.getId());
		//TODO 完善订单结算单信息
		order = this.orderManager.save(order);
		settle = this.settlementManager.save(settle);
		return ResultUtils.renderSuccessResult(order);
	}
	/**
	 * 办理就诊卡（记录） 在吐卡后调用
	 * @param data
	 * @return
	 */
	@RequestMapping(value="/card/issue",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forCreateCard(@RequestBody String data){
		Patient patient =this.getCurrentPatient();
		MedicalCard card = this.hisPatientManager.issueCard(patient);
		patient.setMedicalCard(card);
		return ResultUtils.renderSuccessResult(patient);
	}
	/**
	 * 开通预存
	 * @param data
	 * @return
	 */
	@RequestMapping(value="/openDeposit",method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forPopenDeposit(@RequestParam(value = "data", defaultValue = "") String data){
		Patient baseInfo =  JSONUtils.deserialize(data, Patient.class);
		Patient patient = hisPatientManager.openDeposit(baseInfo);
		return ResultUtils.renderSuccessResult(patient);
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
