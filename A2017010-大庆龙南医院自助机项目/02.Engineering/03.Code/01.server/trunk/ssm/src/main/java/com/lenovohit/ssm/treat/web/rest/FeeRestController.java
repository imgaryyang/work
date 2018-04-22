package com.lenovohit.ssm.treat.web.rest;

import java.math.BigDecimal;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
import com.lenovohit.ssm.base.model.Machine;
import com.lenovohit.ssm.base.web.rest.SSMBaseRestController;
import com.lenovohit.ssm.payment.model.Order;
import com.lenovohit.ssm.payment.utils.OrderSeqCalculator;
import com.lenovohit.ssm.treat.manager.HisPatientManager;
import com.lenovohit.ssm.treat.model.Fee;
import com.lenovohit.ssm.treat.model.Patient;
import com.lenovohit.ssm.treat.transfer.manager.HisEntityResponse;

/**
 * 缴费
 */
@RestController
@RequestMapping("/ssm/treat/fee")
public class FeeRestController extends  SSMBaseRestController { 
	
	@Autowired
	private GenericManager<Order, String> orderManager;
	@Autowired
	private GenericManager<Fee, String> feeManager;
	@Autowired
	private HisPatientManager hisPatientManager;
	
	/**
	 * 上传处方信息，通知医院，生成订单，
	 * @param data
	 * @return
	 */
	@RequestMapping(value="/createOrder",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8/*TEXT_PLAIN_UTF_8*/)
	public Result forCreateOrder(@RequestBody String data){
		Order consume =  JSONUtils.deserialize(data, Order.class);
		List<Fee> fees = consume.getFees();
		Patient param = new Patient();
		param.setNo(consume.getPatientNo());
		HisEntityResponse<Patient> response =  hisPatientManager.getPatientByPatientNo(param);
		Patient patient = response.getEntity();
		
		Map<String,Order> result = new HashMap<String,Order>();
		BigDecimal totalAmt = new BigDecimal(0);;
		for(Fee fee : fees){
			BigDecimal amt = fee.getDj().multiply(fee.getSl()).multiply(fee.getCs()); 
			fee.setAmt(amt);
			totalAmt = totalAmt.add(fee.getAmt()); 
		}
//		if(totalAmt.equals(hisOrder.getAmount())){
//			//TODO 医院返回金额与自我计算金额不符  TODO 收费回调
//		}
//		consume.setBizNo(hisOrder.getRechargeNumber());
		consume.setAmt(totalAmt);
		
		Machine machine = this.getCurrentMachine();
		consume.setOrderNo(OrderSeqCalculator.calculateCode(Order.ORDER_TYPE_PAY));
		//病人信息
//		consume.setPatientNo(patient.getNo());//病人姓名
//		consume.setPatientName(patient.getName());//病人姓名	
//		consume.setPatientIdNo(patient.getIdNo());//病人身份证号
//		consume.setPatientCardNo(patient.getMedicalCardNo());//病人卡号	
//		consume.setPatientCardType(patient.getCardType());//就诊卡类型 TODO 就诊卡
		consume.setHisNo(machine.getHospitalNo());
		
		consume.setMachineId(machine.getId());//自助机id
		consume.setMachineMac(machine.getMac());//自助机mac地址
		consume.setMachineCode(machine.getCode());
		consume.setMachineName(machine.getName());//自助机名称
		consume.setMachineUser(machine.getHisUser());
		consume.setMachineMngCode(machine.getMngCode());
		
		//订单信息
		Date now = new Date();
		consume.setCreateTime(now);
		consume.setStatus(Order.ORDER_STAT_INITIAL);
		consume.setOrderType(Order.ORDER_TYPE_PAY);
		consume.setOrderDesc("门诊收费");
		consume.setBizBean("");//消费没有回调
		consume.setBizType(Order.BIZ_TYPE_CLINIC);//办卡
		consume.setOrderTitle("就诊人"+consume.getPatientName()+"门诊支付"+consume.getAmt()+"元");	
		consume = this.orderManager.save(consume);
		orderManager.save(consume);//保存订单
		for(Fee fee : fees){
			fee.setOrderId(consume.getId());
		}
		feeManager.batchSave(fees);//保存收费明细	
		
		
		
		result.put("consume", consume);
		if(patient.getBalance().compareTo(consume.getSelfAmt()) == -1){//生成充值订单
			Order recharge = new Order();
			recharge.setOrderNo(OrderSeqCalculator.calculateCode(Order.ORDER_TYPE_PAY));
			recharge.setPatientNo(consume.getPatientNo());//病人姓名
			recharge.setPatientName(consume.getPatientName());//病人姓名	
			recharge.setPatientIdNo(consume.getPatientIdNo());//病人身份证号
			recharge.setPatientCardNo(consume.getPatientCardNo());//病人卡号	
			recharge.setPatientCardType(consume.getPatientCardType());//就诊卡类型 TODO 就诊卡
			recharge.setHisNo(machine.getHospitalNo());
			recharge.setOrderType(Order.ORDER_TYPE_PAY);
			recharge.setSelfAmt(consume.getSelfAmt().subtract(patient.getBalance()));
			recharge.setAmt(recharge.getSelfAmt());
			recharge.setCreateTime(now);
			recharge.setStatus(Order.ORDER_STAT_INITIAL);
			recharge.setOrderDesc("收费余额不足充值");
			recharge.setBizBean("hisDepositManager");//充值回调
			recharge.setBizType(Order.BIZ_TYPE_PRESTORE);//充值
			
			recharge.setMachineId(machine.getId());//自助机id
			recharge.setMachineMac(machine.getMac());//自助机mac地址
			recharge.setMachineCode(machine.getCode());
			recharge.setMachineName(machine.getName());//自助机名称
			recharge.setMachineUser(machine.getHisUser());
			recharge.setMachineMngCode(machine.getMngCode());
			
			recharge.setOrderTitle("就诊人"+recharge.getPatientName()+"缴费充值"+recharge.getAmt()+"元");
			recharge = this.orderManager.save(recharge);
			
			result.put("recharge", recharge);
		}
		return ResultUtils.renderSuccessResult(result);
	}
	
	/**
	 * 待缴费账单查询
	 * @param start
	 * @param limit
	 * @return
	 */
	@RequestMapping(value="/list",method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forList(){
		/*Patient patient  = this.getCurrentPatient();
		List<UnPayedFeeRecord> feeList = hisFeeManager.getUnPayedFees(patient);
		return ResultUtils.renderSuccessResult(feeList);*/
		return null;
	}
	
	public String ObjectIsNull(Object obj) {
		if (obj == null)
			return "";
		return obj.toString();
	}
	
}
