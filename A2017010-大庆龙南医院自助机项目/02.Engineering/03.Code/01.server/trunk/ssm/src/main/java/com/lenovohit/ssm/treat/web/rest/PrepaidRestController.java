//package com.lenovohit.ssm.treat.web.rest;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RequestMethod;
//import org.springframework.web.bind.annotation.RestController;
//
//import com.lenovohit.core.manager.GenericManager;
//import com.lenovohit.core.utils.DateUtils;
//import com.lenovohit.core.utils.JSONUtils;
//import com.lenovohit.core.utils.StringUtils;
//import com.lenovohit.core.web.MediaTypes;
//import com.lenovohit.core.web.rest.BaseRestController;
//import com.lenovohit.core.web.utils.Result;
//import com.lenovohit.core.web.utils.ResultUtils;
//import com.lenovohit.ssm.SSMConstants;
//import com.lenovohit.ssm.base.model.Machine;
//import com.lenovohit.ssm.payment.model.Order;
//import com.lenovohit.ssm.payment.model.Settlement;
//import com.lenovohit.ssm.payment.utils.OrderSeqCalculator;
//
///**
// * 预存
// */
//@RestController
//@RequestMapping("/ssm/treat/prepaid")
//public class PrepaidRestController extends BaseRestController {
//	@Autowired
//	private GenericManager<Order, String> orderManager;
//	@Autowired
//	private GenericManager<Settlement, String> settlementManager;
//	/**
//	 * 生成订单、结算单
//	 * @param data
//	 * @return
//	 */
//	@RequestMapping(value="/createOrder",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
//	public Result forCreateOrder(@RequestBody String data){
//		Order order = JSONUtils.deserialize(data, Order.class);
//		validOrder(order);
//		buildOrder(order);
//		
//		this.orderManager.save(order);
//		/*List<PayChannel> channels= this.payChannelManager.find("from PayChannel where code = ? ", order.getPayChannel());
//		if(null ==channels || channels.size() == 0 ){
//			return ResultUtils.renderFailureResult("不支持的支付渠道");
//		}else if(channels.size() > 1){
//			return ResultUtils.renderFailureResult("多个符合条件的支付渠道");
//		}
//		Settlement settle = this.creatSettle(order, channels.get(0));
//		
//		this.settlementManager.save(settle);
//		order.getSettlements().add(settle);*/
//		return ResultUtils.renderSuccessResult(order);
//	}
//	
//	
//	private void buildOrder(Order order) {
//        if (null == order) {
//        	throw new NullPointerException("order should not be NULL!");
//        }  
//        Machine machine = (Machine) this.getSession().getAttribute(SSMConstants.SSM_MACHINE_KEY);
//        if (null == machine){
//        	throw new NullPointerException("machine should not be NULL!");
//        }
//        order.setOrderNo(OrderSeqCalculator.calculateCode(Order.ORDER_TYPE_PAY));
//        order.setOrderType(Order.ORDER_TYPE_PAY);
//        order.setOrderTitle("大庆龙南医院自助机预存: " + order.getAmt() + " 元！");
//        order.setOrderDesc("大庆龙南医院自助机预存: " + order.getAmt() + " 元！");
//        order.setBizType("00");
//        order.setBizNo("");
//        order.setBizUrl("");
//        order.setBizBean("hisPrePaidManager");
//        order.setStatus(Order.ORDER_STAT_INITIAL);
//        order.setSelfAmt(order.getAmt());
//        order.setAmt(order.getAmt());
//        order.setHisNo(machine.getHospitalNo());
//        order.setTerminalId(machine.getId());
//        order.setTerminalCode(machine.getCode());
//        order.setTerminalName(machine.getName());
//        order.setCreateTime(DateUtils.getCurrentDate());
//	}
//	
//	private void validOrder(Order order) {
//        if (StringUtils.isEmpty(order.getPatientNo())) {
//            throw new NullPointerException("patientNo should not be NULL!");
//        }
//        if (StringUtils.isEmpty(order.getPatientName())) {
//            throw new NullPointerException("patientName should not be NULL!");
//        }
//       /* if (StringUtils.isEmpty(order.getPatientIdNo())) {
//            throw new NullPointerException("patientIdNo should not be NULL!");
//        }
//        if (StringUtils.isEmpty(order.getPatientCardNo())) {
//            throw new NullPointerException("patientCardNo should not be NULL!");
//        }
//        if (StringUtils.isEmpty(order.getPatientCardType())) {
//            throw new NullPointerException("patientCardType should not be NULL!");
//        }*/
//	}
//	/*private Settlement creatSettle(Order order,PayChannel channel){
//		Settlement settle = new Settlement();
//		settle.setOrderId(order.getId());
//		settle.setAmt(order.getAmt());
//		settle.setOrderNo(order.getOrderNo());	
//		settle.setPayChannelCode(channel.getCode());
//		settle.setPayChannelId(channel.getId());
//		settle.setPayChannelName(channel.getName());
//		
//		return settle;
//	}*/
//}
