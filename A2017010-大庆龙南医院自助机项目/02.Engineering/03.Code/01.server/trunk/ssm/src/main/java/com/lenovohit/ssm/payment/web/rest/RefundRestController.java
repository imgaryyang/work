package com.lenovohit.ssm.payment.web.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.DateUtils;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.rest.BaseRestController;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.ssm.SSMConstants;
import com.lenovohit.ssm.base.model.Machine;
import com.lenovohit.ssm.payment.manager.AlipayManager;
import com.lenovohit.ssm.payment.manager.HisPayManager;
import com.lenovohit.ssm.payment.model.Order;
import com.lenovohit.ssm.payment.model.Settlement;
import com.lenovohit.ssm.payment.utils.SettleSeqCalculator;
import com.lenovohit.ssm.treat.model.Patient;

/**
 * 
 */
@RestController
@RequestMapping("/ssm/payment/pay")
public class RefundRestController extends BaseRestController {
	
	@Autowired
	private GenericManager<Settlement, String> settlementManager;
	
	@Autowired
	private GenericManager<Order, String> orderManager;
	
	/*@Autowired
	private GenericManager<PayChannel, String> payChannelManager;*/
	
	@Autowired
	private AlipayManager alipayManager;
	
	/**
	 * 退款
	 * @param settleId
	 * @return
	 */
	@RequestMapping(value = "/otRefund", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forOtRefund(@RequestBody String data ){
		
		Settlement settlement = JSONUtils.deserialize(data, Settlement.class);
		
		validOtRefundSettlement(settlement);
		buildOtRefundSettlement(settlement);
		this.settlementManager.save(settlement);
		Order order = settlement.getOrder();
		if(StringUtils.equals(settlement.getStatus(), Settlement.SETTLE_STAT_REFUND_SUCCESS)){
			order.setStatus(Order.ORDER_STAT_REFUND_SUCCESS);
			order.setTranTime(DateUtils.getCurrentDate());
			bizAfterRefund(order, settlement);
		}
		refundCall(settlement);
		
		this.settlementManager.save(settlement);
		
		return ResultUtils.renderSuccessResult(settlement);
	}
	
	
	
	private void validOtRefundSettlement(Settlement settlement) {
		if (null == settlement) {
        	throw new NullPointerException("settlement should not be NULL!");
        }
		if (null == settlement.getOrder() || StringUtils.isEmpty(settlement.getOrder().getId())) {
        	settlement.getVariables().put("error", "order should not be NULL!");
            throw new NullPointerException("order should not be NULL!");
        }
		Order order = this.orderManager.get(settlement.getOrder().getId());
        if (null == order){
        	throw new NullPointerException("order should not be NULL!");
        }
        settlement.setOrder(order);
        
		List<Settlement> ls = this.settlementManager.find("from Settlement where settleType=? and orderId = ?", Settlement.SETTLE_TYPE_PAY, order.getId());
		for(Settlement sm : ls){
			if(StringUtils.equals(sm.getStatus(), Settlement.SETTLE_STAT_PAY_SUCCESS)){
				settlement.setOriSettlement(sm);//假设一个订单只对应一个结算单，完成状态的交易不能退款
				break;
			}	
		}
		if(null == settlement.getOriSettlement() 
				|| settlement.getAmt().compareTo(settlement.getOriSettlement().getAmt()) == 1){
			settlement.getVariables().put("error", "oriSettlement should not be NULL!");
			throw new NullPointerException("oriSettlement should not be NULL!");
        }
	}
	
	
	
	private void buildOtRefundSettlement(Settlement settlement) {
		if (null == settlement) {
        	throw new NullPointerException("settlement should not be NULL!");
        }  
		Machine machine = (Machine) this.getSession().getAttribute(SSMConstants.SSM_MACHINE_KEY);
        if (null == machine){
        	throw new NullPointerException("machine should not be NULL!");
        }
        // 获取当前患者
 		Patient patient = (Patient)this.getSession().getAttribute(SSMConstants.SSM_PATIENT_KEY);
 		if (null == patient){
        	throw new NullPointerException("currentPatient should not be NULL!");
        }
 		
 		Order order = settlement.getOrder();
        settlement.setSettleNo(SettleSeqCalculator.calculateCode(Settlement.SETTLE_TYPE_REFUND));;
        settlement.setSettleType(Settlement.SETTLE_TYPE_REFUND);
        settlement.setSettleTitle(order.getOrderTitle());
        settlement.setSettleDesc(order.getOrderDesc());
        settlement.setAmt(order.getSelfAmt());
        settlement.setTerminalId(order.getTerminalId());
        settlement.setTerminalCode(order.getTerminalCode());
        settlement.setTerminalName(order.getTerminalName());
        settlement.setPayChannelId(settlement.getOriSettlement().getPayChannelId());
        settlement.setPayChannelCode(settlement.getOriSettlement().getPayChannelCode());
        settlement.setPayChannelName(settlement.getOriSettlement().getPayChannelName());
        settlement.setPayTypeId(settlement.getOriSettlement().getPayTypeId());
        settlement.setPayTypeCode(settlement.getOriSettlement().getPayTypeCode());;
        settlement.setPayTypeName(settlement.getOriSettlement().getPayTypeName());
        
        //TODO 逻辑疑似有问题
//        settlement.setPayerId(patient.getId());
//        settlement.setPayerName(patient.getName());
//        settlement.setPayerAccount("");// TODO 硬件获取 || 交易返回
//        settlement.setPayerPhone(patient.getMobile());
    	
        settlement.setStatus(Settlement.SETTLE_STAT_INITIAL);
        settlement.setCreateTime(DateUtils.getCurrentDate());
        
	}

	/**
	 * 根据 结算单支付情况回调业务
	 * @param order
	 * @throws Exception
	 */
	private void bizAfterRefund(Order order, Settlement settle){
		String beanName  = order.getBizBean();
		HisPayManager hisOrderManager =(HisPayManager) this.getApplicationContext().getBean(beanName);
		hisOrderManager.bizAfterRefund(order,settle);
	}
	/**
	 * 原交易退款
	 * @param order
	 * @throws Exception
	 */
	private void refundCall(Settlement settle){
		if(null != settle && "9999".equals(settle.getPayChannelCode())){
			alipayManager.refund(settle);
		} /*else if(null != settle && "9998".equals(settle.getPayChannelCode())){
			wXpayManager.precreate(settle);
		}*/
		// TODO 后期考虑动态调用
	}
}
