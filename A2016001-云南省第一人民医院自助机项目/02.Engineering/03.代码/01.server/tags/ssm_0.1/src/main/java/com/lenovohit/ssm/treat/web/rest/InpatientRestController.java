package com.lenovohit.ssm.treat.web.rest;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.rest.BaseRestController;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.ssm.SSMConstants;
import com.lenovohit.ssm.payment.model.Order;
import com.lenovohit.ssm.payment.model.PayChannel;
import com.lenovohit.ssm.payment.model.Settlement;
import com.lenovohit.ssm.treat.manager.HisInpatientManager;
import com.lenovohit.ssm.treat.model.InpatientBill;
import com.lenovohit.ssm.treat.model.InpatientDailyBillDetail;
import com.lenovohit.ssm.treat.model.InpatientInfo;
import com.lenovohit.ssm.treat.model.Patient;

/**
 * 住院预缴
 */
@RestController
@RequestMapping("/ssm/treat/inpatient")
public class InpatientRestController extends BaseRestController {
	@Autowired
	private GenericManager<Order, String> orderManager;

	@Autowired
	private GenericManager<Settlement, String> settlementManager;
	
	@Autowired
	private HisInpatientManager hisInpatientManager;
	
	@Autowired
	private GenericManager<PayChannel, String> payChannelManager;

	/**
	 * 生成预缴订单、结算单
	 * @param data
	 * @return
	 */
	@RequestMapping(value="/deposit/createOrder",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forCreateOrder(@RequestBody String data){
		Order param = JSONUtils.deserialize(data, Order.class);
		//TODO 通知his 生成订单
		Order order = param;
		this.orderManager.save(order);
		List<PayChannel> channels= this.payChannelManager.find(" from PayChannel where code = ? ",param.getPayChannel());
		if(null ==channels || channels.size() == 0 ){
			return ResultUtils.renderFailureResult("不支持的支付渠道");
		}else if(channels.size() > 1){
			return ResultUtils.renderFailureResult("多个符合条件的支付渠道");
		}
		Settlement settle = this.creatSettle(order,channels.get(0));
		
		this.settlementManager.save(settle);
		order.getSettlements().add(settle);
		
		return ResultUtils.renderSuccessResult(order);
	}
	/**
	 * 现金预缴
	 * @param data
	 * @return
	 */
	@RequestMapping(value="/deposit/cash",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8/*TEXT_PLAIN_UTF_8*/)
	public Result forCashPay(@RequestBody String data){
		Settlement settle = JSONUtils.deserialize(data, Settlement.class);
		//TODO 校验、完善settle信息
		String orderId = settle.getOrderId();
		Order order = null ;
		if(!StringUtils.isEmpty(orderId)){
			order = new Order();
			//TODO 完善信息
		}else{
			order = this.orderManager.get(orderId);
		}
		BigDecimal amt = order.getAmt();
		order.setAmt(amt.add(settle.getAmt()));
		this.orderManager.save(order);
		this.settlementManager.save(settle);
		//TODO 通知医院
		return ResultUtils.renderSuccessResult(settle);
	}
	
	/**
	 * 住院基本信息查询/{patientId}
	 * @param data
	 * @return
	 */
	@RequestMapping(value="/baseInfo",method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result baseInfo(){
		Patient patient = this.getCurrentPatient();
		InpatientInfo  info = hisInpatientManager.getBaseInfo(patient);
		return ResultUtils.renderSuccessResult(info);
	}
	/**
	 * 日结清单
	 * @param data
	 * @return
	 */
	@RequestMapping(value="/dailyBill/list/{billDate}",method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result dailyBillList(@RequestParam(value = "data", defaultValue = "") String data, @PathVariable("billDate") String billDate){
		InpatientInfo baseInfo =  JSONUtils.deserialize(data, InpatientInfo.class);
		List<InpatientDailyBillDetail> bills = hisInpatientManager.getDailyBill(baseInfo, billDate);
		return ResultUtils.renderSuccessResult(bills);
	}
	/**
	 * 住院费用
	 * @param data
	 * @return
	 */
	@RequestMapping(value="/inpatientBill/list",method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result inpatientBillList(@RequestParam(value = "data", defaultValue = "") String data){
		InpatientInfo baseInfo =  JSONUtils.deserialize(data, InpatientInfo.class);
		List<InpatientBill> bills = hisInpatientManager.getInpatientBill(baseInfo);
		return ResultUtils.renderSuccessResult(bills);
	}
	
	/**
	 * 预缴余额查询
	 * @param data
	 * @return
	 */
	@RequestMapping(value="/deposit/balance",method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result billList(@RequestParam(value = "data", defaultValue = "") String data){
		BigDecimal balance = hisInpatientManager.depositBalance(this.getCurrentPatient());
		return ResultUtils.renderSuccessResult(balance);
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
	
	private Settlement creatSettle(Order order,PayChannel channel){
		Settlement settle = new Settlement();
		settle.setOrderId(order.getId());
		settle.setAmt(order.getAmt());
		settle.setOrderNo(order.getOrderNo());	
		settle.setPayChannelCode(channel.getCode());
		settle.setPayChannelId(channel.getId());
		settle.setPayChannelName(channel.getName());
		return settle;
	}
}
