package com.lenovohit.ssm.treat.web.rest;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.ssm.base.model.Machine;
import com.lenovohit.ssm.base.web.rest.SSMBaseRestController;
import com.lenovohit.ssm.payment.model.Order;
import com.lenovohit.ssm.payment.model.Settlement;
import com.lenovohit.ssm.payment.utils.OrderSeqCalculator;
import com.lenovohit.ssm.treat.manager.HisForegiftManager;
import com.lenovohit.ssm.treat.model.ForegiftRecord;
import com.lenovohit.ssm.treat.transfer.manager.HisEntityResponse;
import com.lenovohit.ssm.treat.transfer.manager.HisResponse;

/**
 * 门诊预存
 */
@RestController
@RequestMapping("/ssm/treat/foregift")
public class ForegiftRestController extends SSMBaseRestController {
	@Autowired
	private GenericManager<Order, String> orderManager;
	
	@Autowired
	private GenericManager<Settlement, String> settlementManager;
	
	@Autowired
	private HisForegiftManager hisForegiftManager;
	
	/**
	 * 预存订单修改状态
	 * @param data
	 * @return
	 */
	@RequestMapping(value="/state",method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forState(@RequestParam(value = "data", defaultValue = "") String data){
		HisResponse response  = hisForegiftManager.foregiftState();
		if(response.isSuccess()){// 0 失败  1  成功
			return ResultUtils.renderSuccessResult();
		}else{
			return ResultUtils.renderFailureResult();
		}
	}

	/**
	 * 住院预交订单
	 * @param data
	 * @return
	 */
	@RequestMapping(value="/order/foregift",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forCreateForegiftOrder(@RequestBody String data){
		//生成充值订单
		Order recharge = JSONUtils.deserialize(data, Order.class);
		try {
			validRechargeOrder(recharge);
			buildRechargeOrder(recharge);
			this.orderManager.save(recharge);
		} catch (Exception e) {
			log.error("生成预支付订单失败！");
			return ResultUtils.renderFailureResult("生成预支付订单失败！");
		}
		
		return ResultUtils.renderSuccessResult(recharge);
	}

	/**
	 * 住院预缴
	 * @param data
	 * @return
	 */
	@Deprecated
	@RequestMapping(value="/card",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forCardRecharge(@RequestBody String data){
		Settlement settle = JSONUtils.deserialize(data, Settlement.class);
		settle = this.settlementManager.get(settle.getId());
		
		HisEntityResponse<ForegiftRecord> response = hisForegiftManager.cardRecharge(settle.getOrder(), settle);
		if (null != response && response.isSuccess()) {
			return ResultUtils.renderSuccessResult(response.getEntity());
		} else {
			return ResultUtils.renderFailureResult();
		}
	}
	
	/**
	 * 住院预缴
	 * @param data
	 * @return
	 */
	@RequestMapping(value="/balance",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forBalanceRecharge(@RequestBody String data){
		Settlement settle = JSONUtils.deserialize(data, Settlement.class);
		settle = this.settlementManager.get(settle.getId());
		
		HisEntityResponse<ForegiftRecord> response = hisForegiftManager.balanceRecharge(settle.getOrder(), settle);
		if (null != response && response.isSuccess()) {
			return ResultUtils.renderSuccessResult(response.getEntity());
		} else {
			return ResultUtils.renderFailureResult();
		}
	}
	
	private void validRechargeOrder(Order order) {
		if (null == order) {
            throw new NullPointerException("order should not be NULL!");
        }
		if (StringUtils.isEmpty(order.getPatientNo())) {
			throw new NullPointerException("PatientNo should not be NULL!");
		}
		if (StringUtils.isEmpty(order.getPatientName())) {
			throw new NullPointerException("PatientName should not be NULL!");
		}
//		if (StringUtils.isEmpty(order.getPatientIdNo())) {
//			throw new NullPointerException("PatientIdNo should not be NULL!");
//		}
//		if (StringUtils.isEmpty(order.getPatientCardNo())) {
//			throw new NullPointerException("PatientCardNo should not be NULL!");
//		}
//		if (StringUtils.isEmpty(order.getPatientCardType())) {
//			throw new NullPointerException("PatientCardType should not be NULL!");
//		}
	}

	private void buildRechargeOrder(Order order) {
		//自助机是否登录
        Machine machine = this.getCurrentMachine();
        if (null == machine){
        	throw new NullPointerException("CurrentMachine should not be NULL!");
        }
        
		order.setOrderNo(OrderSeqCalculator.calculateCode(Order.ORDER_TYPE_PAY));
		order.setOrderType(Order.ORDER_TYPE_PAY);
		order.setOrderTitle("大庆龙南医院患者 "+order.getPatientName()+" 自助机住院预缴 "+order.getAmt()+" 元。");
		order.setOrderDesc("大庆龙南医院自助机住院预缴订单 " + order.getAmt().toString() + " 元。");

		order.setBizType(Order.BIZ_TYPE_PREPAY);//充值
		order.setBizNo("");
		order.setBizUrl("");
		order.setBizBean("hisForegiftManager");//充值回调
		order.setStatus(Order.ORDER_STAT_INITIAL);
		
		order.setMachineId(machine.getId());//自助机id
		order.setMachineMac(machine.getMac());//自助机mac地址
		order.setMachineCode(machine.getCode());
		order.setMachineName(machine.getName());//自助机名称
		order.setMachineUser(machine.getHisUser());
		order.setMachineMngCode(machine.getMngCode());

		order.setHisNo(machine.getHospitalNo());
		order.setCreateTime(new Date());
		order.setSelfAmt(order.getAmt());
	}
}
