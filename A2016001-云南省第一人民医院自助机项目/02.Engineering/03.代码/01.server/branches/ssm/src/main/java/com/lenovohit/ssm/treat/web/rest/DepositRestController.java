package com.lenovohit.ssm.treat.web.rest;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.manager.impl.GenericManagerImpl;
import com.lenovohit.core.utils.DateUtils;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.ssm.base.model.Machine;
import com.lenovohit.ssm.base.web.rest.SSMBaseRestController;
import com.lenovohit.ssm.payment.manager.HisPayManager;
import com.lenovohit.ssm.payment.model.CardBin;
import com.lenovohit.ssm.payment.model.Order;
import com.lenovohit.ssm.payment.model.PayAccount;
import com.lenovohit.ssm.payment.model.PayChannel;
import com.lenovohit.ssm.payment.model.Settlement;
import com.lenovohit.ssm.payment.utils.OrderSeqCalculator;
import com.lenovohit.ssm.payment.utils.SettleSeqCalculator;
import com.lenovohit.ssm.treat.manager.HisDepositManager;
import com.lenovohit.ssm.treat.manager.HisPatientManager;
import com.lenovohit.ssm.treat.model.ConsumeRecord;
import com.lenovohit.ssm.treat.model.DepositRecord;
import com.lenovohit.ssm.treat.model.HisOrder;
import com.lenovohit.ssm.treat.model.Patient;
import com.lenovohit.ssm.treat.model.PayHistory;
import com.lenovohit.ssm.treat.transfer.manager.HisEntityResponse;
import com.lenovohit.ssm.treat.transfer.manager.HisListResponse;
import com.lenovohit.ssm.treat.transfer.manager.HisResponse;

/**
 * 门诊预存
 */
@RestController
@RequestMapping("/ssm/treat/deposit")
public class DepositRestController extends SSMBaseRestController {
	@Autowired
	private GenericManager<Order, String> orderManager;
	
	@Autowired
	private GenericManager<Settlement, String> settlementManager;

	@Autowired
	private GenericManager<PayChannel, String> payChannelManager;
	
	@Autowired
    private GenericManager<CardBin,String> cardBinManager;
	
	@Autowired
	private HisDepositManager hisDepositManager;
	
	@Autowired
	private HisPatientManager hisPatientManager;
	
	@Autowired
	private GenericManagerImpl<Machine,String> machineManager;
	
	
	/**
	 * 开通预存
	 * @param data
	 * @return
	 */
	@RequestMapping(value="/open",method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forOpen(@RequestParam(value = "data", defaultValue = "") String data){
//		Patient baseInfo =  JSONUtils.deserialize(data, Patient.class);
//		Patient patient = hisPatientManager.getPatient(baseInfo);
		return ResultUtils.renderSuccessResult(/*patient*/);
	}
	/**
	 * 预存订单修改状态
	 * @param data
	 * @return
	 */
	@RequestMapping(value="/state",method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forState(@RequestParam(value = "data", defaultValue = "") String data){
		HisResponse response  = hisDepositManager.depositState();
		if(response.isSuccess()){// 0 失败  1  成功
			return ResultUtils.renderSuccessResult();
		}else{
			return ResultUtils.renderFailureResult();
		}
	}
	/**
	 * 查询预存订单
	 * @param data
	 * @return
	 */
	@RequestMapping(value="/order/get/{orderId}",method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result getOrder(@PathVariable("orderId") String orderId ){
		Order order = this.orderManager.get(orderId);
		return ResultUtils.renderSuccessResult(order);
	}
	/**
	 * 生成预存订单
	 * @param data
	 * @return
	 */
	@RequestMapping(value="/order/recharge",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forCreateRechargeOrder(@RequestBody String data){
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
	 * 预存充值/退款记录查询
	 * @param data
	 * @return
	 */
	@RequestMapping(value="/records/recharge",method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forRechargeRecords(@RequestParam(value = "data", defaultValue = "") String data){
		Patient baseInfo =  JSONUtils.deserialize(data, Patient.class);
		HisListResponse<DepositRecord> response = hisDepositManager.rechargeRecords(baseInfo);
		if(null != response && response.isSuccess()){
			return ResultUtils.renderSuccessResult(response.getList()); 
	    } else {
	    	return ResultUtils.renderFailureResult();
	    }
		
	}
	/**
	 * 预存充值/退款记录查询
	 * @param data
	 * @return
	 */
	@RequestMapping(value="/records/consume",method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forConsumeRecords(@RequestParam(value = "data", defaultValue = "") String data){
		Patient baseInfo =  JSONUtils.deserialize(data, Patient.class);
		HisListResponse<ConsumeRecord> response = hisDepositManager.consumeRecords(baseInfo);
		if(null != response && response.isSuccess()){
			return ResultUtils.renderSuccessResult(response.getList()); 
	    } else {
	    	return ResultUtils.renderFailureResult();
	    }
	}
	/**
	 * 缴费明细查询
	 * @param data
	 * @return
	 */
	@RequestMapping(value="/records/payHistory",method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forPayHistoryRecords(@RequestParam(value = "data", defaultValue = "") String data){
		Patient baseInfo =  JSONUtils.deserialize(data, Patient.class);
		HisListResponse<PayHistory> response = hisDepositManager.payHistoryRecords(baseInfo);
		if(null != response && response.isSuccess()){
			return ResultUtils.renderSuccessResult(response.getList()); 
	    } else {
	    	return ResultUtils.renderFailureResult();
	    }
	}
	/**
	 * 预存充值明细查询查询
	 * @param data{PatientNo,StartTime,EndTime,PaymentWay,Account}
	 * @return
	 */
	@RequestMapping(value="/records/detail",method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forRechargeDetails(@RequestParam(value = "data", defaultValue = "") String data){
		HisOrder baseInfo =  JSONUtils.deserialize(data, HisOrder.class);
		HisListResponse<HisOrder> response = hisDepositManager.rechargeDetails(baseInfo);
		if(null != response && response.isSuccess()){
			return ResultUtils.renderSuccessResult(response.getList()); 
	    } else {
	    	return ResultUtils.renderFailureResult();
	    }
	}
	/**
	 * 预存订单修改状态
	 * @param data
	 * @return
	 */
	@RequestMapping(value="/consume/{orderId}/{status}",method = RequestMethod.PUT, produces = MediaTypes.JSON_UTF_8)
	public Result forConsume(@PathVariable("orderId") String orderId,  @PathVariable("status") String status){
		Order record =  this.orderManager.get(orderId);
		if("1".equals(status)){// 0 失败  1  成功
			record.setStatus(Order.ORDER_STAT_TRAN_SUCCESS);
		}else{
			record.setStatus(Order.ORDER_STAT_TRAN_FAILURE);
		}
		Order saved = this.orderManager.save(record);
		return ResultUtils.renderSuccessResult(saved);
	}


	/**
	 * 非现金充值账户查询
	 * @param data
	 * @return
	 */
	@RequestMapping(value="/accounts",method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forAccounts(@RequestParam(value = "data", defaultValue = "") String data){
		Patient baseInfo =  JSONUtils.deserialize(data, Patient.class);
		HisListResponse<PayAccount> response  = hisDepositManager.rechargeAccounts(baseInfo);
		if(null != response && response.isSuccess()){
			List<PayAccount> accounts = response.getList();
			if(null == accounts)
				return ResultUtils.renderFailureResult(); 
			for(PayAccount payAccount : accounts){
				if( "1".equals(payAccount.getAccType())){
					payAccount.setOpenBank("9999");
					payAccount.setOpenBankName("支付宝");
					continue;
				} else if("2".equals(payAccount.getAccType())){
					payAccount.setOpenBank("9998");
					payAccount.setOpenBankName("微信");
					continue;
				}
				try {
					CardBin cardBin = cardBinConvert(payAccount.getAccNo());
					if(cardBin!=null && !StringUtils.isBlank(cardBin.getBankCode())){
						payAccount.setCardBank(cardBin.getBankCode().substring(0, 4));
						payAccount.setOpenBank(cardBin.getBankCode());
						payAccount.setOpenBankName(cardBin.getBankName());
						payAccount.setOpenCity(cardBin.getCityCode());
						payAccount.setOpenCityName(cardBin.getCity());
					}
				} catch (Exception e) {
					e.printStackTrace();
					// TODO: handle exception
				}
			}
			return ResultUtils.renderSuccessResult(accounts); 
	    } else {
	    	return ResultUtils.renderFailureResult();
	    }
	}
	/**
	 * 50天内信用卡充值金额
	 * @param data
	 * @return
	 */
	@RequestMapping(value="/creditIn50",method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forCreditIn50(@RequestParam(value = "data", defaultValue = "") String data){
		Patient baseInfo =  JSONUtils.deserialize(data, Patient.class);
		HisEntityResponse<BigDecimal> response  = hisDepositManager.rechargeCreditIn50(baseInfo);
		if(null != response && response.isSuccess()){
			return ResultUtils.renderSuccessResult(response.getEntity()); 
	    } else {
	    	return ResultUtils.renderFailureResult();
	    }
	}
	/**
	 * 预退款
	 * @param data
	 * @return
	 */
	@RequestMapping(value = "/preRefund", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forPreRefund(@RequestBody String data ){
		HisOrder hisOrder = JSONUtils.deserialize(data, HisOrder.class);
		Order order = new Order();
		Settlement settlement = new Settlement();
		try {
			validRefundOrder(hisOrder);
			buildRefundOrder(hisOrder, order, settlement);
			this.orderManager.save(order);
			this.settlementManager.save(settlement);
			HisEntityResponse<HisOrder> response = this.hisDepositManager.freezeRefund(order, settlement);
			if(null!=response && response.isSuccess()){
				order.setBizNo(response.getEntity().getFrozenNumber());
				order.setBizTime(response.getEntity().getFrozenTime());
				this.orderManager.save(order);
				
				return ResultUtils.renderSuccessResult(settlement);
			} else {
				order.setStatus(Order.ORDER_STAT_CLOSED);
				order.setFinishTime(DateUtils.getCurrentDate());
				order.setBizTime(DateUtils.getCurrentDateTimeStr());
				this.orderManager.save(order);
				
				return ResultUtils.renderFailureResult(response.getResult()); 
			}
		} catch (BaseException be) {
			log.error("自助机退款错误！");
			log.error(be.getMessage());
			return ResultUtils.renderFailureResult(be.getMessage());
		} catch (Exception e) {
			log.error("自助机退款错误！");
			log.error("DepositRestController forPreRefund exception", e);
			e.printStackTrace();
			return ResultUtils.renderFailureResult("自助机退款错误！");
		}
	}
	
	/**
	 * 退款取消
	 * @param settleId
	 * @return
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value = "/cancelRefund", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forCancelRefund(@RequestBody String data ){
		Settlement settle = JSONUtils.deserialize(data, Settlement.class);
		try {
			settle = this.settlementManager.findOne("from Settlement where settleNo = ?", settle.getSettleNo());
			//0. 状态检验
			if(this.getCurrentUser() == null){
				log.info("当前用户未登录！");
				return ResultUtils.renderFailureResult(settle);
			} 
			if(null == settle || !StringUtils.equals(Settlement.SETTLE_STAT_REFUND_SUCCESS, settle.getStatus())){
				log.info("结算单不存在或结算状态错误！");
				return ResultUtils.renderFailureResult("结算单不存在或结算状态错误！");
			}
			Order order = settle.getOrder();
			if(!StringUtils.equals(order.getStatus(), Order.ORDER_STAT_TRAN_SUCCESS)) {
				log.info("订单状态错误！");
				return ResultUtils.renderFailureResult(settle);
			}
			settle.setStatus(Settlement.SETTLE_STAT_REFUND_CANCELED);
			this.settlementManager.save(settle);
			
			order.setStatus(Order.ORDER_STAT_REFUND_CANCELED);
			this.orderManager.save(order);
			//1. 取消退款
			HisEntityResponse<HisOrder> bizResponse = (HisEntityResponse<HisOrder>)this.hisDepositManager.bizAfterRefund(order, settle);
			if(null!=bizResponse && bizResponse.isSuccess()){
				Order _order = new Order();
				this.buildCancelOrder(_order, order);
				_order.setBizNo(bizResponse.getEntity().getSerialNumber());
				_order.setBizTime(bizResponse.getEntity().getPaymentTime());
				_order.setTranTime(DateUtils.getCurrentDate());
				_order.setStatus(Order.ORDER_STAT_CANCEL);
				this.orderManager.save(_order);
				
				order.setStatus(Order.ORDER_STAT_CLOSED);//交易关闭
				order.setFinishTime(DateUtils.getCurrentDate());
				this.orderManager.save(order);
				log.info("业务回调成功，修改订单状态 "+ order.getStatus());
				
				return ResultUtils.renderSuccessResult(settle);
			} else {
				order.setStatus(Order.ORDER_STAT_TRAN_FAILURE);//交易失败
				this.orderManager.save(order);
				log.info("业务回调失败，修改订单状态 "+ order.getStatus());
				
				return ResultUtils.renderFailureResult(settle);
			}
		} catch (BaseException be) {
			log.error("渠道【"+ settle.getPayChannelCode()+"】退款取消失败，结算单号为【"+ settle.getSettleNo() + "】");
			return ResultUtils.renderFailureResult(be.getMessage());
		} catch (Exception e) {
			log.error("渠道【"+ settle.getPayChannelCode()+"】退款取消失败，结算单号为【"+ settle.getSettleNo() + "】");
			e.printStackTrace();
			return ResultUtils.renderFailureResult("退款取消后台处理失败！");
		}
	}
	
	/**
	 * 退款取消
	 * @param settleId
	 * @return
	 */
	@RequestMapping(value = "/reversePay", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forReversePay(@RequestBody String data ){
		HisOrder hisOrder = JSONUtils.deserialize(data, HisOrder.class);
		Order order = new Order();
		Settlement settlement = new Settlement();
		try {
			validReverseOrder(hisOrder);
			buildReverseOrder(hisOrder, order, settlement);
			this.orderManager.save(order);
			this.settlementManager.save(settlement);
			
			HisEntityResponse<HisOrder> response = this.hisDepositManager.freezeRefund(order, settlement);
			if(null!=response && response.isSuccess()){
				order.setBizNo(response.getEntity().getFrozenNumber());
				order.setBizTime(response.getEntity().getFrozenTime());
				
				this.hisDepositManager.confirmRefund(order, settlement);
				
				settlement.setStatus(Settlement.SETTLE_STAT_REVERSE);
				order.setStatus(Order.ORDER_STAT_REVERSE);
				this.orderManager.save(order);
				this.settlementManager.save(settlement);
				return ResultUtils.renderSuccessResult(settlement);
			} else {
				order.setStatus(Order.ORDER_STAT_CLOSED);
				order.setFinishTime(DateUtils.getCurrentDate());
				this.orderManager.save(order);
				
				return ResultUtils.renderFailureResult(response.getResult()); 
			}
		} catch (BaseException be) {
			log.error("自助机支付冲账错误！");
			return ResultUtils.renderFailureResult(be.getMessage());
		} catch (Exception e) {
			log.error("自助机支付冲账错误！");
			e.printStackTrace();
			return ResultUtils.renderFailureResult("自助机支付冲账错误！");
		}
	}
	
	
	/**
	 * 生成预存订单
	 * @param data
	 * @return
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value="/additional/{patientNo}",method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forAdditional(@PathVariable("patientNo") String patientNo, @RequestBody String data){
		//生成充值订单
		Settlement _settlement = JSONUtils.deserialize(data, Settlement.class);
		Order order = null;
		Settlement settlement = null;
		if(null !=_settlement && !StringUtils.isEmpty(_settlement.getSettleNo())){
			settlement  = this.settlementManager.findOne("from Settlement where settleNo = ?", _settlement.getSettleNo());
			order = settlement.getOrder();
		} else {
			settlement = new Settlement();
			order = new Order();
		}
		order.setPatientNo(patientNo);
		try {
			validAdditionalOrder(order, settlement, _settlement);
			buildAdditionalOrder(order, settlement, _settlement);
			
			settlement.setStatus(Settlement.SETTLE_STAT_PAY_SUCCESS);
			order.setStatus(Order.ORDER_STAT_PAY_SUCCESS);//支付成功
			order.setTranTime(DateUtils.getCurrentDate());
			order.setRealAmt(settlement.getAmt());//此时记录真正支付的金额
			this.orderManager.save(order);
			this.settlementManager.save(settlement);
			
			HisEntityResponse<DepositRecord> bizResponse = (HisEntityResponse<DepositRecord>)bizAfterPay(order, settlement);
			if( null != bizResponse && bizResponse.isSuccess()){
				order.setBizNo(bizResponse.getEntity().getSerialNumber());
				order.setBizTime(bizResponse.getEntity().getPaymentTime());
				order.setStatus(Order.ORDER_STAT_TRAN_SUCCESS);//HIS交易成功，交易成功！
				log.info("【"+ order.getOrderNo() + "】业务回调成功，修改订单状态， "+ order.getStatus());
			} else {
				order.setBizTime(DateUtils.getCurrentDateTimeStr());
				order.setStatus(Order.ORDER_STAT_TRAN_FAILURE);//HIS交易失败，记录失败！
				log.info("【"+ order.getOrderNo() + "】业务回调失败，修改订单状态， "+ order.getStatus());
			}
			this.orderManager.save(order);//交易成功
		} catch (BaseException be) {
			log.error("自助机预存补录失败！");
			return ResultUtils.renderFailureResult(be.getMessage());
		} catch (Exception e) {
			log.error("自助机预存补录失败！");
			e.printStackTrace();
			return ResultUtils.renderFailureResult("自助机预存补录失败！");
		}
		return ResultUtils.renderSuccessResult(settlement);
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
	}

	private void buildRechargeOrder(Order order) {
		//自助机是否登录
        Machine machine = this.getCurrentMachine();
        if (null == machine){
        	throw new NullPointerException("CurrentMachine should not be NULL!");
        }
        
		order.setOrderNo(OrderSeqCalculator.calculateCode(Order.ORDER_TYPE_PAY));
		order.setOrderType(Order.ORDER_TYPE_PAY);
		order.setOrderTitle("患者 "+order.getPatientName()+" 自助机充值 "+ order.getAmt() +" 元。");
		order.setOrderDesc("门诊预存充值订单 " + order.getAmt() + " 元。");
		order.setStatus(Order.ORDER_STAT_INITIAL);
		order.setSelfAmt(order.getAmt());
		order.setAmt(order.getAmt());

		order.setBizType(Order.BIZ_TYPE_PRESTORE);//充值
		order.setBizNo("");
		order.setBizUrl("");
		order.setBizBean("hisDepositManager");//充值回调
		
		order.setMachineId(machine.getId());//自助机id
		order.setMachineMac(machine.getMac());//自助机mac地址
		order.setMachineCode(machine.getCode());//自助机编号
		order.setMachineName(machine.getName());//自助机名称
		order.setMachineUser(machine.getHisUser());//自助机对应HIS用户
		order.setMachineMngCode(machine.getMngCode());

		order.setHisNo(machine.getHospitalNo());
		order.setCreateTime(new Date());
	}
	
	private void validRefundOrder(HisOrder hisOrder) {
		if (null == hisOrder) {
            throw new NullPointerException("HisOrder should not be NULL!");
        }
		if (StringUtils.isEmpty(hisOrder.getPatientNo())) {
			throw new NullPointerException("PatientNo should not be NULL!");
		}
		if (StringUtils.isEmpty(hisOrder.getPatientName())) {
			throw new NullPointerException("PatientName should not be NULL!");
		}
		if (StringUtils.isEmpty(hisOrder.getPaymentWay()) || !"0,1,2".contains(hisOrder.getPaymentWay())) {
			throw new NullPointerException("PaymentWay should not be NULL or not be Support!");
		} 
		if(StringUtils.equals("0", hisOrder.getPaymentWay())){
			if (StringUtils.isEmpty(hisOrder.getAccount())) {
				throw new NullPointerException("Account should not be NULL!");
			}
			if (StringUtils.isEmpty(hisOrder.getAccountName())) {
				throw new NullPointerException("AccountName should not be NULL!");
			}
			if (StringUtils.isEmpty(hisOrder.getCardType())) {
				throw new NullPointerException("CardType should not be NULL!");
			}
			if (StringUtils.isEmpty(hisOrder.getCardBankCode())) {
				throw new NullPointerException("CardBankcode should not be NULL!");
			}
			CardBin cardBin = cardBinConvert(hisOrder.getAccount());
			if (StringUtils.isEmpty(cardBin.getCleanBankCode())){
				throw new NullPointerException("CleanBankCode should not be NULL!");
			} else {
	        	hisOrder.setCardBankCode(cardBin.getBankCode());
			}
		} else {
			if(StringUtils.isEmpty(hisOrder.getOutTradeNo())){
				throw new NullPointerException("OutTradeNo should not be NULL!");
			}
			if(StringUtils.isEmpty(hisOrder.getRecharge()) 
					|| new BigDecimal(hisOrder.getRecharge()).compareTo(new BigDecimal(0)) != 1){
				throw new NullPointerException("Recharge should not be NULL!");
			}
		}
		
		if (StringUtils.isEmpty(hisOrder.getBalance()) 
				|| new BigDecimal(hisOrder.getBalance()).compareTo(new BigDecimal(0)) != 1) {
			throw new NullPointerException("Balance should not be <= 0.0 !");
		}
		if (StringUtils.isEmpty(hisOrder.getAllowRefund()) 
				|| new BigDecimal(hisOrder.getAllowRefund()).compareTo(new BigDecimal(0)) != 1) {
			throw new NullPointerException("AllowRefund should not be <= 0.0 !");
		}
		if (StringUtils.isEmpty(hisOrder.getAmount()) 
				|| new BigDecimal(hisOrder.getAmount()).compareTo(new BigDecimal(0)) != 1
				|| new BigDecimal(hisOrder.getAmount()).compareTo(new BigDecimal(hisOrder.getAllowRefund())) == 1) {
			throw new NullPointerException("Amount should not be  <= 0.0  or > AllowRefund!");
		}
	}
	
	private void buildRefundOrder(HisOrder hisOrder, Order order, Settlement settlement) {
		if (null == hisOrder || null == order || null == settlement) {
			throw new NullPointerException("hisOrder or order or settlement should not be NULL!");
		}  
		//自助机是否登录
        Machine machine = null;
        if (!StringUtils.isBlank(hisOrder.getMachineId())){
        	machine = machineManager.get(hisOrder.getMachineId());
        } else {
        	machine = this.getCurrentMachine();
        }
//        Machine machine = machineManager.get("8a942a765c3d44d3015c3f2f4db300cc");
        if (null == machine){
        	throw new NullPointerException("CurrentMachine should not be NULL!");
        }
        
        //订单基本信息
        order.setOrderNo(OrderSeqCalculator.calculateCode(Order.ORDER_TYPE_REFUND));
        order.setOrderType(Order.ORDER_TYPE_REFUND);
        order.setOrderTitle("患者 "+hisOrder.getPatientName()+" 自助机退款 " + hisOrder.getAmount() + " 元！");
        order.setOrderDesc("患者 "+hisOrder.getPatientName()+" 自助机退款 " + hisOrder.getAmount() + " 元！");
        order.setStatus(Order.ORDER_STAT_INITIAL);
        order.setAmt(new BigDecimal(hisOrder.getAmount()));
        //订单业务信息
        order.setBizType(Order.BIZ_TYPE_PRESTORE);//门诊预存
        order.setBizNo(hisOrder.getRechargeNumber());//发起时记录原始充值记录，冻结后记录冻结ID
        order.setBizBean("hisDepositManager");
        //订单机器信息
        order.setMachineId(machine.getId());
        order.setMachineMac(machine.getMac());
        order.setMachineCode(machine.getCode());
        order.setMachineName(machine.getName());
        order.setMachineUser(machine.getHisUser());
        order.setMachineMngCode(machine.getMngCode());
        //订单用户信息
        order.setHisNo(machine.getHospitalNo());
        order.setPatientNo(hisOrder.getPatientNo());
        order.setPatientName(hisOrder.getPatientName());
        order.setCreateTime(DateUtils.getCurrentDate());
        
        if(!StringUtils.isBlank(hisOrder.getMachineId())){
        	//操作信息
        	order.setOptStatus(Order.OPT_STAT_ADFLAG);
        	order.setOptTime(new Date());
        	order.setOptId(this.getCurrentUser().getId());
        	order.setOptName(this.getCurrentUser().getName());
        	order.setOperation("【" + hisOrder.getPaymentWay() + "】手工退款【" + order.getAmt() + "】元！");
        }
        
        settlement.setSettleNo(SettleSeqCalculator.calculateCode(Settlement.SETTLE_TYPE_REFUND));;
        settlement.setSettleType(Settlement.SETTLE_TYPE_REFUND);
        settlement.setSettleTitle(order.getOrderTitle());
        settlement.setSettleDesc(order.getOrderDesc());
		settlement.setStatus(Settlement.SETTLE_STAT_INITIAL);
		settlement.setOriAmt(new BigDecimal(hisOrder.getRecharge()));
		settlement.setAmt(order.getAmt());
        
		PayChannel payChannel = null;
        if(StringUtils.equals("0", hisOrder.getPaymentWay())){
        	//银行卡对应渠道
            payChannel = payChannelManager.findOne("from PayChannel where code = ?", hisOrder.getCardBankCode());
            //当前只支持广发和招行
            if (null == payChannel || !PayChannel.STATUS_OK.equals(payChannel.getStatus())){
            	payChannel = payChannelManager.findOne("from PayChannel where code = ?", machine.getMngCode());
            } 
        } else if(StringUtils.equals("1", hisOrder.getPaymentWay())){
        	//支付宝退款渠道
            payChannel = payChannelManager.findOne("from PayChannel where code = ?", "9999");
        } else if(StringUtils.equals("2", hisOrder.getPaymentWay())){
        	//微信退款渠道
            payChannel = payChannelManager.findOne("from PayChannel where code = ?", "9998");
        }
//		payChannel = payChannelManager.get("4028a0815a91d9a5015a91da378b0013");
        //支付渠道信息
		settlement.setPayChannel(payChannel);
        settlement.setPayChannelId(payChannel.getId());
        settlement.setPayChannelCode(payChannel.getCode());
        settlement.setPayChannelName(payChannel.getName());
        
        // 支付类型 退款暂无
        settlement.setPayTypeId("");
        settlement.setPayTypeCode("");;
        settlement.setPayTypeName("");
        
        //退款账户信息
        settlement.setPayerName(hisOrder.getAccountName());
        settlement.setPayerAccount(hisOrder.getAccount());
        settlement.setPayerAcctType(hisOrder.getCardType());
        settlement.setPayerAcctBank(hisOrder.getCardBankCode());
        settlement.setTradeNo(hisOrder.getOutTradeNo());
      
        //自助机信息
		settlement.setMachineId(machine.getId());//自助机id
		settlement.setMachineMac(machine.getMac());//自助机mac地址
		settlement.setMachineCode(machine.getCode());
		settlement.setMachineName(machine.getName());//自助机名称
		settlement.setMachineUser(machine.getHisUser());
		settlement.setMachineMngCode(machine.getMngCode());

        settlement.setCreateTime(new Date());
        settlement.setOrder(order);
	}
	
	private void buildCancelOrder(Order _order, Order oriOrder) {
		if (null == _order || null == oriOrder) {
        	throw new NullPointerException("_order or oriOrder should not be NULL!");
        }
		 //订单基本信息
        _order.setOrderNo(OrderSeqCalculator.calculateCode(Order.ORDER_TYPE_CANCEL));
        _order.setOrderType(Order.ORDER_TYPE_CANCEL);
        _order.setOrderTitle("患者 "+oriOrder.getPatientName()+" 自助机取消退款 " + oriOrder.getAmt() + " 元！");
        _order.setOrderDesc("患者 "+oriOrder.getPatientName()+" 自助机取消退款 " + oriOrder.getAmt() + " 元！");
        _order.setStatus(Order.ORDER_STAT_INITIAL);
        _order.setAmt(oriOrder.getAmt());
        //订单业务信息
        _order.setBizType(Order.BIZ_TYPE_PRESTORE);//门诊预存
        _order.setBizNo("");//发起取消是为null
        _order.setBizBean("");
        //订单机器信息
        _order.setMachineId(oriOrder.getMachineId());
        _order.setMachineMac(oriOrder.getMachineMac());
        _order.setMachineCode(oriOrder.getMachineCode());
        _order.setMachineName(oriOrder.getMachineName());
        _order.setMachineUser(oriOrder.getMachineUser());
        _order.setMachineMngCode(oriOrder.getMachineMngCode());
        //订单用户信息
        _order.setHisNo(oriOrder.getHisNo());
        _order.setPatientNo(oriOrder.getPatientNo());
        _order.setPatientName(oriOrder.getPatientName());
        _order.setCreateTime(DateUtils.getCurrentDate());
        _order.setOriOrder(oriOrder);
        //登记操作人员信息
        if(null != this.getCurrentUser()){
        	//操作信息
        	_order.setOptStatus(Order.OPT_STAT_CANCEL);
        	_order.setOptTime(new Date());
        	_order.setOptId(this.getCurrentUser().getId());
        	_order.setOptName(this.getCurrentUser().getName());
        	_order.setOperation("手工撤销！");
        }
	}
	
	private void validReverseOrder(HisOrder hisOrder) {
		if (null == hisOrder) {
            throw new NullPointerException("HisOrder should not be NULL!");
        }
		if (StringUtils.isEmpty(hisOrder.getPatientNo())) {
			throw new NullPointerException("PatientNo should not be NULL!");
		}
		if (StringUtils.isEmpty(hisOrder.getPatientName())) {
			throw new NullPointerException("PatientName should not be NULL!");
		}
		if (StringUtils.isEmpty(hisOrder.getPaymentWay()) || !"0,1,2".contains(hisOrder.getPaymentWay())) {
			throw new NullPointerException("PaymentWay should not be NULL or not be Support!");
		} 
		if(StringUtils.equals("0", hisOrder.getPaymentWay())){
			if (StringUtils.isEmpty(hisOrder.getAccount())) {
				throw new NullPointerException("Account should not be NULL!");
			}
			if (StringUtils.isEmpty(hisOrder.getAccountName())) {
				throw new NullPointerException("AccountName should not be NULL!");
			}
			if (StringUtils.isEmpty(hisOrder.getCardType())) {
				throw new NullPointerException("CardType should not be NULL!");
			}
			if (StringUtils.isEmpty(hisOrder.getCardBankCode())) {
				throw new NullPointerException("CardBankcode should not be NULL!");
			}
		} 
		if (StringUtils.isEmpty(hisOrder.getAmount())) {
			throw new NullPointerException("Amount should not be  <= 0.0  or > AllowRefund!");
		}
	}
	private void buildReverseOrder(HisOrder hisOrder, Order order, Settlement settlement) {
		if (null == hisOrder || null == order || null == settlement) {
			throw new NullPointerException("hisOrder or order or settlement should not be NULL!");
		}  
//        Machine machine = machineManager.get(hisOrder.getMachineId());
		//指定机器GF041
        Machine machine = machineManager.get("4028a0815a91d9a5015a91e02dbe0112");
        
        //订单基本信息
        order.setOrderNo(OrderSeqCalculator.calculateCode(Order.ORDER_TYPE_REVERSE));
        order.setOrderType(Order.ORDER_TYPE_REVERSE);
        order.setOrderTitle("患者 "+hisOrder.getPatientName()+" 自助机冲账 " + hisOrder.getAmount() + " 元！");
        order.setOrderDesc("患者 "+hisOrder.getPatientName()+" 自助机冲账 " + hisOrder.getAmount() + " 元！");
        order.setStatus(Order.ORDER_STAT_INITIAL);
        order.setAmt(new BigDecimal(hisOrder.getAmount()));
        //订单业务信息
        order.setBizType(Order.BIZ_TYPE_PRESTORE);//门诊预存
        order.setBizNo(hisOrder.getRechargeNumber());//发起时记录原始充值记录，冻结后记录冻结ID
        order.setBizBean("hisDepositManager");
        //订单机器信息
        order.setMachineId(machine.getId());
        order.setMachineMac(machine.getMac());
        order.setMachineCode(machine.getCode());
        order.setMachineName(machine.getName());
        order.setMachineUser(machine.getHisUser());
        order.setMachineMngCode(machine.getMngCode());
        //订单用户信息
        order.setHisNo(machine.getHospitalNo());
        order.setPatientNo(hisOrder.getPatientNo());
        order.setPatientName(hisOrder.getPatientName());
       
		order.setTranTime(DateUtils.getCurrentDate());
        order.setCreateTime(DateUtils.getCurrentDate());

        settlement.setSettleNo(SettleSeqCalculator.calculateCode(Settlement.SETTLE_TYPE_REVERSE));;
        settlement.setSettleType(Settlement.SETTLE_TYPE_REVERSE);
        settlement.setSettleTitle(order.getOrderTitle());
        settlement.setSettleDesc(order.getOrderDesc());
		settlement.setStatus(Settlement.SETTLE_STAT_INITIAL);
		settlement.setOriAmt(new BigDecimal(hisOrder.getRecharge()));
		settlement.setAmt(order.getAmt());
		
		PayChannel payChannel = null;
        if(StringUtils.equals("0", hisOrder.getPaymentWay())){
        	//银行退款渠道
            payChannel = payChannelManager.findOne("from PayChannel where code = ?", hisOrder.getCardBankCode());
            //当前只支持广发和招行
            if (null == payChannel || !("0306".equals(payChannel.getCode()) || "0308".equals(payChannel.getCode()))){
            	payChannel = payChannelManager.findOne("from PayChannel where code = ?", machine.getMngCode());
            } 
        } else if(StringUtils.equals("1", hisOrder.getPaymentWay())){
        	//支付宝退款渠道
            payChannel = payChannelManager.findOne("from PayChannel where code = ?", "9999");
        } else if(StringUtils.equals("2", hisOrder.getPaymentWay())){
        	//微信退款渠道
            payChannel = payChannelManager.findOne("from PayChannel where code = ?", "9998");
        }
//		payChannel = payChannelManager.get("4028a0815a91d9a5015a91da378b0013");
        //支付渠道信息
		settlement.setPayChannel(payChannel);
        settlement.setPayChannelId(payChannel.getId());
        settlement.setPayChannelCode(payChannel.getCode());
        settlement.setPayChannelName(payChannel.getName());
        
        // 支付类型 退款暂无
        settlement.setPayTypeId("");
        settlement.setPayTypeCode("");;
        settlement.setPayTypeName("");
        
        if(StringUtils.equals("0", hisOrder.getPaymentWay())){
        	CardBin cardBin = cardBinConvert(hisOrder.getAccount());
        	hisOrder.setCardBankCode(cardBin.getBankCode());
        }
        //退款账户信息
        settlement.setPayerName(hisOrder.getAccountName());
        settlement.setPayerAccount(hisOrder.getAccount());
        settlement.setPayerAcctType(hisOrder.getCardType());
        settlement.setPayerAcctBank(hisOrder.getCardBankCode());
        settlement.setTradeNo(hisOrder.getOutTradeNo());
        settlement.setTradeTime(DateUtils.getCurrentDate());
        
        //自助机信息
		settlement.setMachineId(machine.getId());//自助机id
		settlement.setMachineMac(machine.getMac());//自助机mac地址
		settlement.setMachineCode(machine.getCode());
		settlement.setMachineName(machine.getName());//自助机名称
		settlement.setMachineUser(machine.getHisUser());
		settlement.setMachineMngCode(machine.getMngCode());

        settlement.setCreateTime(new Date());
        settlement.setOrder(order);
	}
	
	private void validAdditionalOrder(Order order, Settlement settlement, Settlement _settlement) {
		if (null == order) {
            throw new NullPointerException("order should not be NULL!");
        }
		if (StringUtils.isEmpty(order.getPatientNo())) {
			throw new NullPointerException("PatientNo should not be NULL!");
		}
		if (null == settlement) {
			throw new NullPointerException("Settlement should not be NULL!");
		}
		if (null == _settlement) {
			throw new NullPointerException("_Settlement should not be NULL!");
		}
		if (StringUtils.isEmpty(_settlement.getMachineId())) {
			throw new NullPointerException("MachineId should not be NULL!");
		}
		if (StringUtils.isEmpty(_settlement.getPayChannelCode())) {
			throw new NullPointerException("PayChannelCode should not be NULL!");
		}
		if(!StringUtils.isEmpty(settlement.getId())) {
			if(_settlement.getAmt().compareTo(settlement.getAmt()) != 0){
				throw new NullPointerException("Amt should be Equal!");
			}
			if(!StringUtils.equals(_settlement.getPayChannelCode(), settlement.getPayChannelCode())){
				throw new NullPointerException("PayChannelCode should Equal!");
			}
			if(!StringUtils.equals(_settlement.getMachineId(), settlement.getMachineId())){
				throw new NullPointerException("MachineId should Equal!");
			}
		}
		if(!StringUtils.equals("0000", _settlement.getPayChannelCode())){
			if (StringUtils.isEmpty(_settlement.getPayerAccount())) {
				throw new NullPointerException("PayerAccount should not be NULL!");
			}
			if (StringUtils.isEmpty(_settlement.getPayerAcctType())) {
				throw new NullPointerException("PayerAcctType should not be NULL!");
			}
			if (StringUtils.isEmpty(_settlement.getPayerAcctBank())) {
				throw new NullPointerException("PayerAcctBank should not be NULL!");
			}
			if (StringUtils.isEmpty(_settlement.getTerminalCode())) {
				throw new NullPointerException("TerminalCode should not be NULL!");
			}
			if (StringUtils.isEmpty(_settlement.getTradeNo())) {
				throw new NullPointerException("TradeNo should not be NULL!");
			}
			if (StringUtils.isEmpty(_settlement.getTradeTime())) {
				throw new NullPointerException("TradeTime should not be NULL!");
			}
			if (StringUtils.isEmpty(_settlement.getRespText())) {
				throw new NullPointerException("RespText should not be NULL!");
			}
		}
	}

	private void buildAdditionalOrder(Order order, Settlement settlement, Settlement _settlement) {
		if(StringUtils.isEmpty(settlement.getId())) {
			Patient patient = new Patient();
			patient.setNo(order.getPatientNo());
			HisEntityResponse<Patient> noPatientResponse = hisPatientManager.getPatientByPatientNo(patient);
			patient = noPatientResponse.getEntity();
			if(null == patient){
				throw new NullPointerException("Patient not be exited!");
			}
			 //订单基本信息
	        order.setOrderNo(OrderSeqCalculator.calculateCode(Order.ORDER_TYPE_ADDITIONAL));
	        order.setOrderType(Order.ORDER_TYPE_ADDITIONAL);
	        order.setOrderTitle("患者 "+patient.getName()+" 自助机预存补录 " + _settlement.getAmt() + " 元！");
	        order.setOrderDesc("患者 "+patient.getName()+" 自助机预存补录 " + _settlement.getAmt() + " 元！");
	        order.setStatus(Order.ORDER_STAT_INITIAL);
	        order.setAmt(_settlement.getAmt());
	        
	        //订单业务信息
	        order.setBizType(Order.BIZ_TYPE_PRESTORE);//门诊预存
	        order.setBizNo("");//发起时记录原始充值记录，冻结后记录冻结ID
	        order.setBizBean("hisDepositManager");
	       
	        Machine machine = machineManager.get(_settlement.getMachineId());
			if(null == machine){
				throw new NullPointerException("Machine not be exited!");
			}
	        //订单机器信息
	        order.setMachineId(machine.getId());
	        order.setMachineMac(machine.getMac());
	        order.setMachineCode(machine.getCode());
	        order.setMachineName(machine.getName());
	        order.setMachineUser(machine.getHisUser());
	        order.setMachineMngCode(machine.getMngCode());
	        
	        //订单用户信息
	        order.setHisNo(machine.getHospitalNo());
	        order.setPatientNo(patient.getNo());
	        order.setPatientName(patient.getName());
	        order.setCreateTime(new Date());
	        
	        settlement.setSettleNo(SettleSeqCalculator.calculateCode(Settlement.SETTLE_TYPE_ADDITIONAL));;
	        settlement.setSettleType(Settlement.SETTLE_TYPE_ADDITIONAL);
	        settlement.setSettleTitle(order.getOrderTitle());
	        settlement.setSettleDesc(order.getOrderDesc());
			settlement.setStatus(Settlement.SETTLE_STAT_INITIAL);
			settlement.setAmt(_settlement.getAmt());
	        
			PayChannel payChannel = payChannelManager.findOne("from PayChannel where code = ?", _settlement.getPayChannelCode());
	        if (null == payChannel){
	        	throw new NullPointerException("PayChannel not be exited!");
	        }
			//支付渠道信息
			settlement.setPayChannel(payChannel);
	        settlement.setPayChannelId(payChannel.getId());
	        settlement.setPayChannelCode(payChannel.getCode());
	        settlement.setPayChannelName(payChannel.getName());
	        
	        // 支付类型 
	        settlement.setPayTypeId("");
	        settlement.setPayTypeCode("");;
	        settlement.setPayTypeName("");
	        
	        //自助机信息
			settlement.setMachineId(machine.getId());//自助机id
			settlement.setMachineMac(machine.getMac());//自助机mac地址
			settlement.setMachineCode(machine.getCode());
			settlement.setMachineName(machine.getName());//自助机名称
			settlement.setMachineUser(machine.getHisUser());
			settlement.setMachineMngCode(machine.getMngCode());

	        settlement.setCreateTime(new Date());
	        settlement.setOrder(order);
		}
        //订单用户信息
        order.setOptStatus(Order.OPT_STAT_ADFLAG);
        order.setOptTime(new Date());
        order.setOptId(this.getCurrentUser().getId());
        order.setOptName(this.getCurrentUser().getName());
        order.setOperation("【" + _settlement.getPayChannelCode() + "】预存补录【" + order.getAmt() + "】元！");
		
        settlement.setPayerAccount(_settlement.getPayerAccount());
        settlement.setPayerAcctType(_settlement.getPayerAcctType());
        settlement.setPayerAcctBank(_settlement.getPayerAcctBank());
        settlement.setTerminalCode(_settlement.getTerminalCode());
        settlement.setTradeNo(_settlement.getTradeNo());
        settlement.setTradeTime(_settlement.getTradeTime());
        settlement.setRespText(_settlement.getRespText());
        settlement.setTradeRspCode(_settlement.getTradeRspCode());
        settlement.setTradeRspMsg(_settlement.getTradeRspMsg());
	}
	
	/**
	 * 
	 * @param cardNo
	 * @return
	 */
	private CardBin cardBinConvert(String cardNo){
		String hql = "from CardBin cb where cardBin = substring(?,1,cb.cardBinNum) and cardNum =?";
		List<CardBin> cbl = cardBinManager.find(hql, cardNo, cardNo.length());
		if(cbl == null || cbl.isEmpty()){
			//TODO 即使沒對應卡Bin，不影响充值。
			throw new BaseException("卡号【"+ cardNo +"】无对应清算行！");
		}
		CardBin cardBin = cbl.get(0);
		for(CardBin _cardBin : cbl){//取最长的
			if(cardBin.getCardBin().length() < _cardBin.getCardBin().length() ){
				cardBin = _cardBin;
			}
		}
		log.info(" 查询银行【 "+ cardBin.getBankName() +"】卡号【"+cardNo+"】卡bin【" +cardBin.getCardBin()+ "】。");
		return cardBin;
	}
	
	/**
	 * 根据 结算单支付情况回调业务
	 * @param order
	 * @throws Exception
	 */
	private HisResponse bizAfterPay(Order order, Settlement settle){
		HisResponse hisResponse = null;
		try {
			HisPayManager hisOrderManager = (HisPayManager) this.getApplicationContext().getBean(order.getBizBean());
			hisResponse = hisOrderManager.bizAfterPay(order, settle);
		} catch (Exception e) {
			log.error("支付成功后业务回调失败,结算单号【" + settle.getSettleNo() + "】,订单号【" + order.getOrderNo() + "】,业务类型【"
					+ order.getBizType() + "】,业务单号【" + order.getBizNo() + "】");
			e.printStackTrace();
		}
		return hisResponse;
	}
}
