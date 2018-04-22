package com.lenovohit.ssm.payment.web.rest;

import java.io.OutputStream;
import java.math.BigDecimal;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.DateUtils;
import com.lenovohit.core.utils.JSONUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.core.web.MediaTypes;
import com.lenovohit.core.web.utils.Result;
import com.lenovohit.core.web.utils.ResultUtils;
import com.lenovohit.ssm.base.model.Machine;
import com.lenovohit.ssm.base.web.rest.SSMBaseRestController;
import com.lenovohit.ssm.payment.manager.AlipayManager;
import com.lenovohit.ssm.payment.manager.BankPayManager;
import com.lenovohit.ssm.payment.manager.CmbPayManager;
import com.lenovohit.ssm.payment.manager.HisPayManager;
import com.lenovohit.ssm.payment.manager.UnionPayManager;
import com.lenovohit.ssm.payment.manager.WxpayManager;
import com.lenovohit.ssm.payment.model.Order;
import com.lenovohit.ssm.payment.model.PayChannel;
import com.lenovohit.ssm.payment.model.Settlement;
import com.lenovohit.ssm.payment.support.alipay.utils.ZxingUtils;
import com.lenovohit.ssm.payment.support.wxPay.common.Util;
import com.lenovohit.ssm.payment.support.wxPay.protocol.pay_callback.PayCallbackResData;
import com.lenovohit.ssm.payment.utils.OrderSeqCalculator;
import com.lenovohit.ssm.payment.utils.SettleSeqCalculator;
import com.lenovohit.ssm.treat.model.DepositRecord;
import com.lenovohit.ssm.treat.model.ForegiftRecord;
import com.lenovohit.ssm.treat.model.HisOrder;
import com.lenovohit.ssm.treat.transfer.manager.HisEntityResponse;
import com.lenovohit.ssm.treat.transfer.manager.HisResponse;

/**
 * 支付管理
 */
@RestController
@RequestMapping("/ssm/payment/pay")
public class PayRestController extends SSMBaseRestController {
	
	@Autowired
	private GenericManager<Settlement, String> settlementManager;
	
	@Autowired
	private GenericManager<Order, String> orderManager;
	
	@Autowired
	private GenericManager<PayChannel, String> payChannelManager;
	
	@Autowired
	private AlipayManager alipayManager;
	
	@Autowired
	private WxpayManager wxpayManager;
	
	@Autowired
	private UnionPayManager unionPayManager;
	
	@Autowired
	private BankPayManager bankPayManager;
	
	@Autowired
	private CmbPayManager cmbPayManager;
	
	/**
	 * 现金预支付之前的操作
	 */
	private Settlement beforeCashPreCreate(Settlement settlement){
		Order order = settlement.getOrder();
		if(order != null && !StringUtils.isEmpty(order.getId())){
			order = this.orderManager.get(order.getId());
			if(null == order) throw new BaseException("不存在的订单号！");
		}else {
			throw new BaseException("不存在现金订单");
		}
		order.setRealAmt(order.getRealAmt().add(settlement.getAmt()));//此时记录真正支付的金额
		order.setLastAmt(settlement.getAmt());
		order = this.orderManager.save(order);
		
		settlement.setOrder(order);
		settlement.setStatus(Settlement.SETTLE_STAT_PAY_SUCCESS);
		
		return settlement;
	}
	/**
	 * 预支付
	 * 记录结算单支付渠道，
	 * 设置结算单回调url，
	 * 根据支付渠道晚上结算单信息（例如微信支付宝获取二维码等信息）
	 * @param data
	 * @return Result
	 */
	@RequestMapping(value = "/preCreate", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forPreCreate(@RequestBody String data ){
		Settlement settlement = JSONUtils.deserialize(data, Settlement.class);
		log.info("预结算："+ data);
		try {
			if("0000".equals(settlement.getPayChannelCode())){//现金先处理其订单信息
				settlement = this.beforeCashPreCreate(settlement);
			}
			buildPaySettlement(settlement);// 金额 支付渠道 支付方式 支付者手机号码以及订单信息由前台传入，剩余信息进行组装
			this.settlementManager.save(settlement);
			
			precreateCall(settlement);
			this.settlementManager.save(settlement);
			
			return ResultUtils.renderSuccessResult(settlement);
		} catch (Exception e) {
			log.error("PayRestController preCreate exception", e);
			e.printStackTrace();
			return ResultUtils.renderFailureResult("系统异常，预支付失败！");
		}
	}
	/**
	 * 根据二维码链接生成二维码图片
	 * @param id 
	 * @param size
	 * @return
	 */
	@RequestMapping(value = "/showQrCode/{id}/{size}", method = RequestMethod.GET)	
	public String showQrCode(@PathVariable("id") String id, @PathVariable("size") int size ){
		Settlement settlement = this.settlementManager.get(id);
		if(null == settlement || StringUtils.isEmpty(settlement.getQrCode()))
			return "";
		OutputStream output = null;
		try {
			output = this.getResponse().getOutputStream();
			ZxingUtils.getQRCodeImgeOs(settlement.getQrCode(), size, output);
		} catch (Exception e) {
			log.error("生成二维码信息失败！结算单号为【"+ settlement.getSettleNo() + "】");
			e.printStackTrace();
		} finally {
			try {
				if(output!=null){
					output.flush();
			    	output.close();
				}				
			} catch (Exception ex) {
				ex.printStackTrace();
			}
		}
		return "";
	}
	/**
	 * 支付宝回调
	 * 0.状态校验 1.结算单处理 2.订单处理 3.回调业务逻辑通知HIS
	 * @param settleId
	 * @param data
	 * @return
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value = "/callback/alipay/{settleId}", method = RequestMethod.POST)
	public String forAliPayCallback(@PathVariable("settleId") String settleId, @RequestBody String data ){
		log.info("支付宝扫码支付-异步通知返回的数据如下：");
        log.info(data);
		String successRet = "success";
		String failedRet = "failed";
		Settlement settle = null;
		try {
			if(StringUtils.isEmpty(data) || StringUtils.isEmpty(settleId))
				return failedRet;
			
			//0. 状态检验
			String uuid = com.lenovohit.core.utils.StringUtils.uuid();
			this.settlementManager.executeSql("UPDATE SSM_SETTLEMENT SET FLAG = ? where ID=? and STATUS=? and FLAG is null", uuid, settleId, Settlement.SETTLE_STAT_INITIAL);
			settle = this.settlementManager.findOne("from Settlement where flag=? and id=? and status=?", uuid, settleId, Settlement.SETTLE_STAT_INITIAL);
			if(null == settle || !StringUtils.equals(Settlement.SETTLE_STAT_INITIAL, settle.getStatus()))
				return successRet;
			
			//1. 结算单处理
			settle.getVariables().put("responseStr", data);
			alipayManager.payCallBack(settle);
			this.settlementManager.save(settle);
			
			//2. 订单处理
			Order order = settle.getOrder();
			if(StringUtils.equals(settle.getStatus(), Settlement.SETTLE_STAT_PAY_SUCCESS) ||
					StringUtils.equals(settle.getStatus(), Settlement.SETTLE_STAT_PAY_FINISH)){
				order.setStatus(Order.ORDER_STAT_PAY_SUCCESS);
				order.setTranTime(DateUtils.getCurrentDate());
				order.setRealAmt(settle.getAmt());//此时记录真正支付的金额
				
				//3. His通知
				HisEntityResponse<DepositRecord> bizResponse = (HisEntityResponse<DepositRecord>)bizAfterPay(order, settle);
				if( null != bizResponse && bizResponse.isSuccess()){
					order.setBizNo(bizResponse.getEntity().getSerialNumber());
					order.setBizTime(bizResponse.getEntity().getPaymentTime());
					order.setStatus(Order.ORDER_STAT_TRAN_SUCCESS);//HIS交易成功，交易成功！
					log.info("【"+ order.getOrderNo() + "】业务回调成功，修改订单状态， "+ order.getStatus());
				} else {
					order.setBizTime(DateUtils.getCurrentDateTimeStr());
					order.setStatus(Order.ORDER_STAT_TRAN_FAILURE);//HIS交易失败，交易失败！
					log.info("【"+ order.getOrderNo() + "】业务回调失败，修改订单状态 "+ order.getStatus());
				}
			} else if(StringUtils.equals(settle.getStatus(), Settlement.SETTLE_STAT_PAY_FAILURE)){
				order.setStatus(Order.ORDER_STAT_CLOSED);
				order.setFinishTime(DateUtils.getCurrentDate());
			}
			this.orderManager.save(order);
		} catch (Exception e) {
			log.error("支付宝支付回传交易失败，结算单号为【" + settle.getSettleNo() + "】");
			log.error("PayRestController forAliPayCallback exception", e);
			e.printStackTrace();
		}
		
		return successRet;
	}
	/**
	 * 微信预回调
	 * 0.状态校验 1.结算单处理 2.订单处理 3.回调业务逻辑通知HIS
	 * @param settleId
	 * @param data
	 * @return
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value = "/callback/wxpay/{settleId}", method = RequestMethod.POST)
	public String forWXPayCallback(@PathVariable("settleId") String settleId, @RequestBody String data){
        String uuid = com.lenovohit.core.utils.StringUtils.uuid();
		log.info(uuid + "微信扫码支付-异步通知返回的数据如下：");
        log.info(uuid + data);
        String successRet = "<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>";
        String failedRet = "<xml><return_code><![CDATA[FAIL]]></return_code><return_msg><![CDATA[系统错误]]></return_msg></xml>"; 
		Settlement settle = null;
		try {
			if(StringUtils.isEmpty(data))
				return failedRet;
			//将从API返回的XML数据映射到Java对象
	        PayCallbackResData payCallbackResData = (PayCallbackResData) Util.getObjectFromXML(data, PayCallbackResData.class);
	        if(payCallbackResData == null || StringUtils.isEmpty(payCallbackResData.getOut_trade_no()))
	        	return failedRet;
	        log.info(uuid + "转化对象成功!");
	        //0. 状态检验
			this.settlementManager.executeSql("UPDATE SSM_SETTLEMENT SET FLAG = ? where ID=? and STATUS=? and FLAG is null", uuid, settleId, Settlement.SETTLE_STAT_INITIAL);
			settle = this.settlementManager.findOne("from Settlement where flag=? and id=? and status=?", uuid, settleId, Settlement.SETTLE_STAT_INITIAL);
			if(null == settle || !StringUtils.equals(Settlement.SETTLE_STAT_INITIAL, settle.getStatus())){
				return successRet;
			}
			log.info(uuid + "对象查询完成!");
			//1. 结算单处理
			settle.getVariables().put("responseStr", data);
			settle.getVariables().put("responseObject", payCallbackResData);
			wxpayManager.payCallBack(settle);
			this.settlementManager.save(settle);
			log.info(uuid + "微信支付业务处理完成!");
			//2. 订单处理
			Order order = settle.getOrder();
			if(StringUtils.equals(settle.getStatus(), Settlement.SETTLE_STAT_PAY_SUCCESS) ||
					StringUtils.equals(settle.getStatus(), Settlement.SETTLE_STAT_PAY_FINISH)){
				order.setStatus(Order.ORDER_STAT_PAY_SUCCESS);
				order.setTranTime(DateUtils.getCurrentDate());
				order.setRealAmt(settle.getAmt());//此时记录真正支付的金额
				
				//3. His通知
				HisEntityResponse<DepositRecord> bizResponse = (HisEntityResponse<DepositRecord>)bizAfterPay(order, settle);
				if( null != bizResponse && bizResponse.isSuccess()){
					order.setBizNo(bizResponse.getEntity().getSerialNumber());
					order.setBizTime(bizResponse.getEntity().getPaymentTime());
					order.setStatus(Order.ORDER_STAT_TRAN_SUCCESS);//HIS交易成功，交易成功！
					log.info("【"+ order.getOrderNo() + "】业务回调成功，修改订单状态， "+ order.getStatus());
				} else {
					order.setBizTime(DateUtils.getCurrentDateTimeStr());
					order.setStatus(Order.ORDER_STAT_TRAN_FAILURE);//HIS交易失败，交易失败！
					log.info("【"+ order.getOrderNo() + "】业务回调失败，修改订单状态 "+ order.getStatus());
				}
			} else if(StringUtils.equals(settle.getStatus(), Settlement.SETTLE_STAT_PAY_FAILURE)){
				order.setStatus(Order.ORDER_STAT_CLOSED);
				order.setFinishTime(DateUtils.getCurrentDate());
			}
			this.orderManager.save(order);
			log.info(uuid + "微信扫码支付-异步通知处理完成!");
		} catch (Exception e) {
			log.error("微信支付回传交易失败，结算单号为【" + settle.getSettleNo() + "】");
			log.error("PayRestController forWXPayCallback exception", e);
			e.printStackTrace();
		}
		
		return successRet;
	}
	/**
	 * 银联回调，由前台页面发起
	 * 0.状态校验 1.结算单处理 2.订单处理 3.回调业务逻辑通知HIS
	 * @param settleId
	 * @param data
	 * @return
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value = "/callback/unionpay/{settleId}", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forUnionPayCallback(@PathVariable("settleId") String settleId, @RequestBody String data){
		Settlement payInfo = JSONUtils.deserialize(data, Settlement.class);
		Settlement settle = null;
		log.info("银联支付-异步通知返回的数据如下：");
        log.info(data);
		try {
			//0. 状态检验
			String uuid = com.lenovohit.core.utils.StringUtils.uuid();
			this.settlementManager.executeSql("UPDATE SSM_SETTLEMENT SET FLAG=? where ID=? and STATUS=? and FLAG is null", uuid, settleId, Settlement.SETTLE_STAT_INITIAL);
			settle = this.settlementManager.findOne("from Settlement where flag=? and id=? and status=?", uuid, settleId, Settlement.SETTLE_STAT_INITIAL);
			if(null == settle || !StringUtils.equals(Settlement.SETTLE_STAT_INITIAL, settle.getStatus()))
				return ResultUtils.renderFailureResult("结算状态错误！");
			
			//1. 结算单处理
			settle.getVariables().put("responseStr", payInfo.getRespText());
			unionPayManager.payCallBack(settle);
			this.settlementManager.save(settle);
			
			//2. 订单处理
			Order order = settle.getOrder();
			if(StringUtils.equals(settle.getStatus(), Settlement.SETTLE_STAT_PAY_SUCCESS)){
				order.setStatus(Order.ORDER_STAT_PAY_SUCCESS);
				order.setTranTime(DateUtils.getCurrentDate());
				order.setRealAmt(settle.getAmt());//此时记录真正支付的金额
				
				//3. His通知
				if(Order.BIZ_TYPE_PREPAY.equals(order.getBizType())){//住院
					HisEntityResponse<ForegiftRecord> bizResponse = (HisEntityResponse<ForegiftRecord>)bizAfterPay(order, settle);
					if( null != bizResponse && bizResponse.isSuccess()){
						order.setBizNo(bizResponse.getEntity().getReceipt());
						order.setBizTime(bizResponse.getEntity().getPaymentTime());
						order.setStatus(Order.ORDER_STAT_TRAN_SUCCESS);//HIS交易成功，交易成功！
						log.info("【"+ order.getOrderNo() + "】业务回调成功，修改订单状态， "+ order.getStatus());
					} else {
						order.setBizTime(DateUtils.getCurrentDateTimeStr());
						order.setStatus(Order.ORDER_STAT_TRAN_FAILURE);//HIS交易失败，记录失败！
						log.info("【"+ order.getOrderNo() + "】业务回调失败，修改订单状态 "+ order.getStatus());
					}
				}else{
					HisEntityResponse<DepositRecord> bizResponse = (HisEntityResponse<DepositRecord>)bizAfterPay(order, settle);
					if( null != bizResponse && bizResponse.isSuccess()){
						order.setBizNo(bizResponse.getEntity().getSerialNumber());
						order.setBizTime(bizResponse.getEntity().getPaymentTime());
						order.setStatus(Order.ORDER_STAT_TRAN_SUCCESS);//HIS交易成功，交易成功！
						log.info("【"+ order.getOrderNo() + "】业务回调成功，修改订单状态， "+ order.getStatus());
					} else {
						order.setBizTime(DateUtils.getCurrentDateTimeStr());
						order.setStatus(Order.ORDER_STAT_TRAN_FAILURE);//HIS交易失败，记录失败！
						log.info("【"+ order.getOrderNo() + "】业务回调失败，修改订单状态 "+ order.getStatus());
					}
				}
			} else if(StringUtils.equals(settle.getStatus(), Settlement.SETTLE_STAT_PAY_FAILURE)){
				order.setStatus(Order.ORDER_STAT_CLOSED);
				order.setFinishTime(DateUtils.getCurrentDate());
			}
			this.orderManager.save(order);
			return ResultUtils.renderSuccessResult(settle);
		} catch (BaseException be) {
			log.error("银联支付失败，结算单号为【"+ settle.getSettleNo() + "】");
			be.printStackTrace();
			return ResultUtils.renderFailureResult(be.getMessage());
		} catch (Exception e) {
			log.error("银联支付失败，结算单号为【"+ settle.getSettleNo() + "】");
			log.error("PayRestController forUnionPayCallback exception", e);
			e.printStackTrace();
			return ResultUtils.renderFailureResult("银联支付失败！");
		}
	}
	
	/**
	 * 余额回调，调用his扣款接口
	 * @param settleId
	 * @return
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value = "/callback/balance/{settleId}", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forBalanceCallback(@PathVariable("settleId") String settleId){
		Settlement settle = null;
		try {
			//0. 状态检验
			String uuid = com.lenovohit.core.utils.StringUtils.uuid();
			this.settlementManager.executeSql("UPDATE SSM_SETTLEMENT SET FLAG = ? where ID=? and STATUS=? and FLAG is null", uuid, settleId, Settlement.SETTLE_STAT_INITIAL);
			settle = this.settlementManager.findOne("from Settlement where flag=? and id=? and status=?", uuid, settleId, Settlement.SETTLE_STAT_INITIAL);
			if(null == settle || !StringUtils.equals(Settlement.SETTLE_STAT_INITIAL, settle.getStatus())) 
				return ResultUtils.renderFailureResult("结算状态错误！");
			Order order = settle.getOrder();
			if(null == order || !StringUtils.equals(Order.ORDER_STAT_INITIAL, order.getStatus()))
				return ResultUtils.renderFailureResult("订单状态错误！");
			//交易信息
			settle.setTradeTime(new Date());// 交易时间 
			settle.setStatus(Settlement.SETTLE_STAT_PAY_SUCCESS);
			this.settlementManager.save(settle);
			
			order.setStatus(Order.ORDER_STAT_PAY_SUCCESS);//支付成功
			order.setTranTime(DateUtils.getCurrentDate());
			order.setRealAmt(settle.getAmt());//此时记录真正支付的金额
			this.orderManager.save(order);//交易成功
			
			HisEntityResponse<ForegiftRecord> bizResponse = (HisEntityResponse<ForegiftRecord>)bizAfterPay(order, settle);
			if( null != bizResponse && bizResponse.isSuccess()){
				order.setBizNo(bizResponse.getEntity().getReceipt());
				order.setBizTime(bizResponse.getEntity().getPaymentTime());
				order.setStatus(Order.ORDER_STAT_TRAN_SUCCESS);//HIS交易成功，交易成功！
				log.info("【"+ order.getOrderNo() + "】业务回调成功，修改订单状态， "+ order.getStatus());
			} else {
				order.setBizTime(DateUtils.getCurrentDateTimeStr());
				order.setStatus(Order.ORDER_STAT_TRAN_FAILURE);//HIS交易失败，记录失败！
				log.info("【"+ order.getOrderNo() + "】业务回调失败，修改订单状态 "+ order.getStatus());
			}
			this.orderManager.save(order);
			
			return ResultUtils.renderSuccessResult(settle);
		} catch (BaseException be) {
			be.printStackTrace();
			log.error("现金支付失败，结算单号为【"+ settle.getSettleNo() + "】");
			return ResultUtils.renderFailureResult(be.getMessage());
		} catch (Exception e) {
			e.printStackTrace();
			log.error("现金支付失败，结算单号为【"+ settle.getSettleNo() + "】");
			log.error("PayRestController forBalanceCallback exception", e);
			return ResultUtils.renderFailureResult("现金支付失败！");
		}
	}
	/**
	 * 现金回调 
	 * @param settleId
	 * @return
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value = "/callback/cash/{settleId}", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forCashCallback(@PathVariable("settleId") String settleId){
		Settlement settle = null;
		try {
			if(StringUtils.isEmpty(settleId)) return ResultUtils.renderFailureResult("结算单id不许为空");
			String uuid = com.lenovohit.core.utils.StringUtils.uuid();
			this.settlementManager.executeSql("UPDATE SSM_SETTLEMENT SET FLAG = ? where ID=? and STATUS=? and FLAG is null", uuid, settleId, Settlement.SETTLE_STAT_PAY_SUCCESS);
			settle = this.settlementManager.findOne("from Settlement where flag=? and id=? and status=?", uuid, settleId, Settlement.SETTLE_STAT_PAY_SUCCESS);
			if(null == settle) return ResultUtils.renderFailureResult("不存在的结算单");
				
			if(!StringUtils.equals(Settlement.SETTLE_STAT_PAY_SUCCESS, settle.getStatus())) 
				return ResultUtils.renderFailureResult("结算状态错误！");
			Order order = settle.getOrder();
			if(null == order || !StringUtils.equals(Order.ORDER_STAT_INITIAL, order.getStatus()))
				return ResultUtils.renderFailureResult("订单状态错误！");
			order.setStatus(Order.ORDER_STAT_PAY_SUCCESS);//支付成功
			order.setTranTime(DateUtils.getCurrentDate());
			this.orderManager.save(order);
			
			HisEntityResponse<DepositRecord> bizResponse = (HisEntityResponse<DepositRecord>)bizAfterPay(order, settle);
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
			if(order.getRealAmt().compareTo(order.getAmt()) == -1){
				order.setStatus(Order.ORDER_STAT_PAY_PARTIAL);//支付成功
				order.setTranTime(DateUtils.getCurrentDate());
			}
			
			this.orderManager.save(order);//交易成功
			return ResultUtils.renderSuccessResult(settle);
		} catch (BaseException be) {
			be.printStackTrace();
			log.error("现金支付失败，订单号为【"+ settle.getOrder().getId() + "】");
			return ResultUtils.renderFailureResult(be.getMessage());
		} catch (Exception e) {
			e.printStackTrace();
			log.error("现金支付失败，订单号为【"+ settle.getOrder().getId() + "】");
			log.error("PayRestController forCashCallback exception", e);
			return ResultUtils.renderFailureResult("现金支付失败！");
		}
	}

	/**
	 * 退款
	 * @param settleId
	 * @return
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value = "/refund", method = RequestMethod.POST, produces = MediaTypes.JSON_UTF_8)
	public Result forRefund(@RequestBody String data ){
		Settlement settle = JSONUtils.deserialize(data, Settlement.class);
		try {
			settle = this.settlementManager.get(settle.getId());
			//0. 状态检验
			if(null == settle || !StringUtils.equals(Settlement.SETTLE_STAT_INITIAL, settle.getStatus())){
				log.info("结算状态错误！");
				return ResultUtils.renderFailureResult("结算状态错误！");
			}
			//1. 结算单处理
			this.refundCall(settle);
			this.settlementManager.save(settle);
			
			//2. 订单处理
			Order order = settle.getOrder();
			if(StringUtils.equals(settle.getStatus(), Settlement.SETTLE_STAT_REFUND_SUCCESS)){//2.1 退款成功处理
				order.setStatus(Order.ORDER_STAT_REFUND_SUCCESS);
				order.setTranTime(DateUtils.getCurrentDate());
				order.setRealAmt(settle.getAmt());
				
				HisEntityResponse<HisOrder> bizResponse = (HisEntityResponse<HisOrder>)bizAfterRefund(order, settle);
				if( null != bizResponse && bizResponse.isSuccess()){
					order.setBizNo(bizResponse.getEntity().getSerialNumber());
					order.setBizTime(bizResponse.getEntity().getPaymentTime());
					order.setStatus(Order.ORDER_STAT_TRAN_SUCCESS);//交易成功
					log.info("业务回调成功，修改订单状态 "+ order.getStatus());
				} else {
					order.setStatus(Order.ORDER_STAT_TRAN_FAILURE);//交易失败
					log.info("业务回调失败，修改订单状态 "+ order.getStatus());
				}
			} else if(StringUtils.equals(settle.getStatus(), Settlement.SETTLE_STAT_REFUNDING)){//2.2 退款中处理
				order.setStatus(Order.ORDER_STAT_REFUNDING);
				order.setTranTime(DateUtils.getCurrentDate());
			} else if(StringUtils.equals(settle.getStatus(), Settlement.SETTLE_STAT_REFUND_FAILURE)){//2.3 退款失败处理 
				order.setStatus(Order.ORDER_STAT_REFUND_FAILURE);
				order.setTranTime(DateUtils.getCurrentDate());
				
				HisEntityResponse<HisOrder> bizResponse = (HisEntityResponse<HisOrder>)bizAfterRefund(order, settle);
				if( null != bizResponse && bizResponse.isSuccess()){
					order.setStatus(Order.ORDER_STAT_CLOSED);//交易关闭
					order.setFinishTime(DateUtils.getCurrentDate());
					log.info("业务回调成功，修改订单状态 "+ order.getStatus());
				} else {
					order.setStatus(Order.ORDER_STAT_TRAN_FAILURE);//交易失败
					log.info("业务回调失败，修改订单状态 "+ order.getStatus());
				}
			} else if(StringUtils.equals(settle.getStatus(), Settlement.SETTLE_STAT_REFUND_CANCELED)){//2.4 退款被退汇
				order.setStatus(Order.ORDER_STAT_REFUND_SUCCESS);
				order.setTranTime(DateUtils.getCurrentDate());
				order.setRealAmt(settle.getAmt());
				
				HisEntityResponse<HisOrder> bizResponse = (HisEntityResponse<HisOrder>)bizAfterRefund(order, settle);
				if( null != bizResponse && bizResponse.isSuccess()){
					order.setBizNo(bizResponse.getEntity().getSerialNumber());
					order.setStatus(Order.ORDER_STAT_TRAN_SUCCESS);//交易成功
					log.info("业务回调成功，修改订单状态 "+ order.getStatus());
				} else {
					order.setStatus(Order.ORDER_STAT_TRAN_FAILURE);//交易失败
					log.info("业务回调失败，修改订单状态 "+ order.getStatus());
				}
				
				if(Order.ORDER_STAT_TRAN_SUCCESS.equals(order.getStatus())){
					order.setStatus(Order.ORDER_STAT_REFUND_CANCELED);
					order.setTranTime(DateUtils.getCurrentDate());
					
					HisEntityResponse<HisOrder> _bizResponse = (HisEntityResponse<HisOrder>)bizAfterRefund(order, settle);
					if( null != _bizResponse && _bizResponse.isSuccess()){
						Order _order = new Order();
						this.buildCancelOrder(_order, order);
						_order.setTranTime(DateUtils.getCurrentDate());
						_order.setBizNo(bizResponse.getEntity().getRechargeNumber());
						_order.setBizTime(bizResponse.getEntity().getPaymentTime());
						_order.setStatus(Order.ORDER_STAT_CANCEL);
						this.orderManager.save(_order);
						
						order.setStatus(Order.ORDER_STAT_CLOSED);//交易关闭
						order.setFinishTime(DateUtils.getCurrentDate());
						log.info("业务回调成功，修改订单状态 "+ order.getStatus());
					} else {
						order.setStatus(Order.ORDER_STAT_TRAN_FAILURE);//交易失败
						log.info("业务回调失败，修改订单状态 "+ order.getStatus());
					}
				}
			} else if(StringUtils.equals(settle.getStatus(), Settlement.SETTLE_STAT_EXCEPTIONAL)){
				order.setStatus(Order.ORDER_STAT_EXCEPTIONAL);
				order.setTranTime(DateUtils.getCurrentDate());
			}
			this.orderManager.save(order);
			
			return ResultUtils.renderSuccessResult(order);
		} catch (BaseException be) {
			log.error("渠道【"+ settle.getPayChannelCode()+"】退款失败，结算单号为【"+ settle.getSettleNo() + "】");
			return ResultUtils.renderFailureResult(be.getMessage());
		} catch (Exception e) {
			log.error("渠道【"+ settle.getPayChannelCode()+"】退款失败，结算单号为【"+ settle.getSettleNo() + "】");
			log.error("PayRestController forRefund exception", e);
			e.printStackTrace();
			return ResultUtils.renderFailureResult("退款后台处理失败！");
		}
	}
	
	
	/**
	 * 结算单状态同步
	 * @param settleId 结算单ID或者结算单编号
	 * @return
	 */
	@SuppressWarnings("unchecked")
	@RequestMapping(value = "/syncState/{settleId}",method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forSyncState(@PathVariable("settleId") String settleId){
		Settlement settle = null;
		try {
			settle = this.settlementManager.get(settleId);
			if(null == settle){
				settle = this.settlementManager.findOne("from Settlement where settleNo = ?", settleId);
			} 
			if(null == settle){
				return ResultUtils.renderFailureResult("未找到对应结算单！！！");
			} 
			//1. 结算单同步状态
			buildSyncSateSettlement(settle);
			syncStateCall(settle);
			this.settlementManager.save(settle);
			
			//2. 订单处理
			Order order = settle.getOrder();
			if(StringUtils.equals(settle.getStatus(), Settlement.SETTLE_STAT_PAY_SUCCESS) ||
					StringUtils.equals(settle.getStatus(), Settlement.SETTLE_STAT_PAY_FINISH)){//2.1 支付成功处理
				//已经做过HIS交易的直接返回成功
				if(StringUtils.equals(order.getStatus(), Order.ORDER_STAT_TRAN_SUCCESS) ||
					StringUtils.equals(order.getStatus(), Order.ORDER_STAT_PAY_PARTIAL)) {
					return ResultUtils.renderSuccessResult(settle);
				//登记HIS交易
				} else {
					order.setStatus(Order.ORDER_STAT_PAY_SUCCESS);
					order.setTranTime(DateUtils.getCurrentDate());
					order.setRealAmt(settle.getAmt());//此时记录真正支付的金额
					//3. His通知
					HisEntityResponse<DepositRecord> bizResponse = (HisEntityResponse<DepositRecord>)bizAfterPay(order, settle);
					if( null != bizResponse && bizResponse.isSuccess()){
						order.setBizNo(bizResponse.getEntity().getSerialNumber());
						order.setStatus(Order.ORDER_STAT_TRAN_SUCCESS);//交易成功
						log.info("业务回调成功，修改订单状态 "+ order.getStatus());
					} else {
						order.setStatus(Order.ORDER_STAT_TRAN_FAILURE);//交易失败
						log.info("业务回调失败，修改订单状态 "+ order.getStatus());
					}
				}
			} else if(StringUtils.equals(settle.getStatus(), Settlement.SETTLE_STAT_PAY_FAILURE)){//2.2 支付失败处理
				order.setStatus(Order.ORDER_STAT_PAY_FAILURE);
				order.setTranTime(DateUtils.getCurrentDate());
				order.setRealAmt(settle.getAmt());//此时记录真正支付的金额
			} else if(StringUtils.equals(settle.getStatus(), Settlement.SETTLE_STAT_REFUND_SUCCESS)){//2.3 退款成功处理
				//已经做过HIS交易的直接返回成功
				if(StringUtils.equals(order.getStatus(), Order.ORDER_STAT_TRAN_SUCCESS) ||
					StringUtils.equals(order.getStatus(), Order.ORDER_STAT_PAY_PARTIAL)) {
					return ResultUtils.renderSuccessResult(settle);
				//登记HIS交易
				} else {
					order.setStatus(Order.ORDER_STAT_REFUND_SUCCESS);
					order.setTranTime(DateUtils.getCurrentDate());
					order.setRealAmt(settle.getAmt());//此时记录真正支付的金额
					
					HisEntityResponse<HisOrder> bizResponse = (HisEntityResponse<HisOrder>)bizAfterRefund(order, settle);
					if( null != bizResponse && bizResponse.isSuccess()){
						order.setBizNo(bizResponse.getEntity().getSerialNumber());
						order.setStatus(Order.ORDER_STAT_TRAN_SUCCESS);//交易成功
						log.info("业务回调成功，修改订单状态 "+ order.getStatus());
					} else {
						order.setStatus(Order.ORDER_STAT_TRAN_FAILURE);//交易失败
						log.info("业务回调失败，修改订单状态 "+ order.getStatus());
					}
				}
			} else if(StringUtils.equals(settle.getStatus(), Settlement.SETTLE_STAT_REFUND_FAILURE) ){//2.4 退款失败
				//考虑HIS已记账情况下的订单不通知HIS，需手工处理
				if(StringUtils.equals(order.getStatus(), Order.ORDER_STAT_TRAN_SUCCESS) ||
					StringUtils.equals(order.getStatus(), Order.ORDER_STAT_REFUND_CANCELED) || 
					StringUtils.equals(order.getStatus(), Order.ORDER_STAT_CLOSED)) {
					return ResultUtils.renderSuccessResult(settle);
				//HIS未记账或者退款取消状态下
				} else {
					order.setStatus(Order.ORDER_STAT_REFUND_FAILURE);
					order.setTranTime(DateUtils.getCurrentDate());
					
					//解冻接口
					HisEntityResponse<HisOrder> bizResponse = (HisEntityResponse<HisOrder>)bizAfterRefund(order, settle);
					if( null != bizResponse && bizResponse.isSuccess()){
						order.setStatus(Order.ORDER_STAT_CLOSED);//交易关闭
						order.setFinishTime(DateUtils.getCurrentDate());
						log.info("业务回调成功，修改订单状态 "+ order.getStatus());
					} else {
						order.setStatus(Order.ORDER_STAT_TRAN_FAILURE);//交易失败
						log.info("业务回调失败，修改订单状态 "+ order.getStatus());
					}
				}
			} else if(StringUtils.equals(settle.getStatus(), Settlement.SETTLE_STAT_REFUND_CANCELED) ){//2.5 退款被撤销
				//考虑HIS已记账情况下的订单不通知HIS，需手工处理
				if(StringUtils.equals(order.getStatus(), Order.ORDER_STAT_TRAN_SUCCESS) ||
					StringUtils.equals(order.getStatus(), Order.ORDER_STAT_REFUND_CANCELED) || 
					StringUtils.equals(order.getStatus(), Order.ORDER_STAT_CLOSED)) {
					return ResultUtils.renderSuccessResult(settle);
				//HIS未记账或者退款取消状态下
				} else {
					order.setStatus(Order.ORDER_STAT_REFUND_SUCCESS);
					order.setTranTime(DateUtils.getCurrentDate());
					order.setRealAmt(settle.getAmt());//此时记录真正支付的金额
					
					HisEntityResponse<HisOrder> bizResponse = (HisEntityResponse<HisOrder>)bizAfterRefund(order, settle);
					if( null != bizResponse && bizResponse.isSuccess()){
						order.setBizNo(bizResponse.getEntity().getSerialNumber());
						order.setStatus(Order.ORDER_STAT_TRAN_SUCCESS);//交易成功
						log.info("业务回调成功，修改订单状态 "+ order.getStatus());
					} else {
						order.setStatus(Order.ORDER_STAT_TRAN_FAILURE);//交易失败
						log.info("业务回调失败，修改订单状态 "+ order.getStatus());
					}
					
					if(Order.ORDER_STAT_TRAN_SUCCESS.equals(order.getStatus())){
						order.setStatus(Order.ORDER_STAT_REFUND_CANCELED);
						order.setTranTime(DateUtils.getCurrentDate());
						
						HisEntityResponse<HisOrder> _bizResponse = (HisEntityResponse<HisOrder>)bizAfterRefund(order, settle);
						if( null != _bizResponse && _bizResponse.isSuccess()){
							Order _order = new Order();
							this.buildCancelOrder(_order, order);
							_order.setTranTime(DateUtils.getCurrentDate());
							_order.setBizNo(bizResponse.getEntity().getRechargeNumber());
							_order.setBizTime(bizResponse.getEntity().getPaymentTime());
							_order.setStatus(Order.ORDER_STAT_CANCEL);
							this.orderManager.save(_order);
							
							order.setStatus(Order.ORDER_STAT_CLOSED);//交易关闭
							order.setFinishTime(DateUtils.getCurrentDate());
							log.info("业务回调成功，修改订单状态 "+ order.getStatus());
						} else {
							order.setStatus(Order.ORDER_STAT_TRAN_FAILURE);//交易失败
							log.info("业务回调失败，修改订单状态 "+ order.getStatus());
						}
					}
				}
			} else {
				//其他状态，业务不做处理
			}
			this.orderManager.save(order);
			
			return ResultUtils.renderSuccessResult(settle);
		} catch (BaseException be) {
			log.error("同步订单状态失败，结算单号为【"+ settle.getSettleNo() + "】");
			return ResultUtils.renderFailureResult(be.getMessage());
		} catch (Exception e) {
			log.error("同步订单状态失败，结算单号为【"+ settle.getSettleNo() + "】");
			log.error("PayRestController forSyncState exception", e);
			return ResultUtils.renderFailureResult("同步订单状态失败！");
		}
	}
	
	/**
	 * 卡状态同步
	 * @param settleId
	 * @return
	 */
	@RequestMapping(value = "/card/state",method = RequestMethod.GET, produces = MediaTypes.JSON_UTF_8)
	public Result forCardState(@RequestParam(value = "data", defaultValue = "") String data){
		//生成充值结算单
		Settlement baseInfo = JSONUtils.deserialize(data, Settlement.class);
		try {
			buildCardSettlement(baseInfo);
			this.bankPayManager.queryCard(baseInfo);
			
			return ResultUtils.renderSuccessResult(baseInfo);
		} catch (BaseException be) {
			log.error("卡状态查询失败，卡号为【"+ baseInfo.getPayerAccount() + "】");
			return ResultUtils.renderFailureResult(be.getMessage());
		} catch (Exception e) {
			log.error("卡状态查询失败，卡号为【"+ baseInfo.getPayerAccount() + "】");
			return ResultUtils.renderFailureResult("卡状态查询失败！");
		}
	}
	/**
	 * 预支付调用
	 * @param order
	 * @throws Exception
	 */
	private void precreateCall(Settlement settle){
		try {
			if ("9999".equals(settle.getPayChannelCode())) {
				alipayManager.precreate(settle);
			} else if ("9998".equals(settle.getPayChannelCode())) {
				wxpayManager.precreate(settle);
			} else if ("0000".equals(settle.getPayChannelCode())) {
				//现金没有预支付
			} else if ("balance".equals(settle.getPayChannelCode())) {
				//余额没有预支付
			} else { 
				//银行没有预支付
			}
		} catch (Exception e) {
			settle.setStatus(Settlement.SETTLE_STAT_CLOSED);
			log.error("渠道【" +settle.getPayChannelCode()+"】结算单【"+settle.getSettleNo()+"】预支付系统异常，交易状态关闭！！！");
			log.error("PayRestController precreateCall exception", e);
			e.printStackTrace();
		}
		// TODO 后期考虑动态调用
	}
	/**
	 * 退款调用
	 * @param order
	 * @throws Exception
	 */
	private void refundCall(Settlement settle) {
		try {
			if ("9999".equals(settle.getPayChannelCode())) {
				alipayManager.refund(settle);
			} else if ("9998".equals(settle.getPayChannelCode())) {
				wxpayManager.refund(settle);
			} else if ("0308".equals(settle.getPayChannelCode())) {
				cmbPayManager.refund(settle);
			} else if ("0000".equals(settle.getPayChannelCode())) {
				//现金没有退款
			} else if ("balance".equals(settle.getPayChannelCode())) {
				//余额没有退款
			} else {
				bankPayManager.refund(settle);
			}
		} catch (Exception e) {
			settle.setStatus(Settlement.SETTLE_STAT_EXCEPTIONAL);
			log.error("渠道【" +settle.getPayChannelCode()+"】结算单【"+settle.getSettleNo()+"】 退款系统异常，交易状态异常！！！");
			log.error("PayRestController refundCall exception", e);
			e.printStackTrace();
		}
		// TODO 后期考虑动态调用
	}
	/**
	 * 同步状态
	 * @param order
	 * @throws Exception
	 */
	private void syncStateCall(Settlement settle){
		try {
			if( "9999".equals(settle.getPayChannelCode())){
				if(StringUtils.equals(Settlement.SETTLE_TYPE_PAY, settle.getSettleType())){
					alipayManager.query(settle);
				} else if(StringUtils.equals(Settlement.SETTLE_TYPE_REFUND, settle.getSettleType())){
					alipayManager.refundQuery(settle);
				}
			} else if( "9998".equals(settle.getPayChannelCode())){
				if(StringUtils.equals(Settlement.SETTLE_TYPE_PAY, settle.getSettleType())){
					wxpayManager.query(settle);
				} else if(StringUtils.equals(Settlement.SETTLE_TYPE_REFUND, settle.getSettleType())){
					wxpayManager.refundQuery(settle);
				}
			} else if( "0308".equals(settle.getPayChannelCode())){
				if(StringUtils.equals(Settlement.SETTLE_TYPE_PAY, settle.getSettleType())){
					unionPayManager.query(settle);
				} else if(StringUtils.equals(Settlement.SETTLE_TYPE_REFUND, settle.getSettleType())){
					cmbPayManager.refundQuery(settle);
				}
			} else if( "0000".equals(settle.getPayChannelCode())){
				
			} else {
				if(StringUtils.equals(Settlement.SETTLE_TYPE_PAY, settle.getSettleType())){
					unionPayManager.query(settle);
				} else if(StringUtils.equals(Settlement.SETTLE_TYPE_REFUND, settle.getSettleType())){
					bankPayManager.refundQuery(settle);
				}
			}
		} catch (Exception e) {//同步操作，交易异常时不做状态更新
			log.error("渠道【" +settle.getPayChannelCode()+"】结算单【"+settle.getSettleNo()+"】查询系统异常，交易状态不变！！！");
			log.error("PayRestController syncStateCall exception", e);
			e.printStackTrace();
		}
		// TODO 后期考虑动态调用
	}
	/*******************************************************************
	 * 工具方法                                                                                                                                                       *
	 *******************************************************************/
	private void buildPaySettlement(Settlement settlement) {
		if (null == settlement) {
        	throw new NullPointerException("settlement should not be NULL!");
        }
		/**订单信息**/
        if (null == settlement.getOrder() || StringUtils.isEmpty(settlement.getOrder().getId())) {
            throw new NullPointerException("orderId should not be NULL!");
        }
        Order order = this.orderManager.get(settlement.getOrder().getId());
        if (null == order){
            throw new NullPointerException("order should not be NULL!");
        }
        settlement.setOrder(order);
        
        /**基本信息**/
        settlement.setSettleNo(SettleSeqCalculator.calculateCode(Settlement.SETTLE_TYPE_PAY));//结算单号 
        settlement.setSettleType(Settlement.SETTLE_TYPE_PAY);//结算类型
        if(StringUtils.isEmpty(settlement.getStatus())){
        	settlement.setStatus(Settlement.SETTLE_STAT_INITIAL);//结算状态
        }
        if(StringUtils.isEmpty(settlement.getSettleTitle())){
        	settlement.setSettleTitle(order.getOrderTitle());
        }
        if(StringUtils.isEmpty(settlement.getSettleDesc())){
        	 settlement.setSettleDesc(order.getOrderDesc());
        }
        if(StringUtils.isEmpty(settlement.getAmt()) || settlement.getAmt().compareTo(new BigDecimal(0)) != 1){
            throw new NullPointerException("Amt should not be NULL Or not be <= 0");
        }
        //settlement.setqrCode;//预支付后生成
        
		/**渠道信息 【 银联 支付宝 微信  现金】**/
        if (StringUtils.isEmpty(settlement.getPayChannelCode())) {
            throw new NullPointerException("payChannelCode should not be NULL!");
        }
        PayChannel payChannel = payChannelManager.findOne("from PayChannel where code = ?", settlement.getPayChannelCode());
        if (null == payChannel){
        	throw new NullPointerException("payChannel should not be NULL!");
        }
        settlement.setPayChannel(payChannel);
        settlement.setPayChannelId(payChannel.getId());
        settlement.setPayChannelCode(payChannel.getCode());
        settlement.setPayChannelName(payChannel.getName());
        
        /**支付类型**/
        if (StringUtils.isEmpty(settlement.getPayTypeCode())) {
            throw new NullPointerException("payTypeCode should not be NULL!");
        }
        settlement.setPayTypeId("");
        settlement.setPayTypeCode(settlement.getPayTypeCode());;
        settlement.setPayTypeName("");
		
        //付款人信息
        //settlement.setPayerNo();//结算后赋值
        //settlement.setPayerName();//结算后赋值
        //settlement.setPayerAccount();//结算后赋值
        //settlement.setPayerAcctType();//结算后赋值
        //settlement.setPayerAcctBank();//结算后赋值
        //settlement.setPayerPhone();//结算后赋值
        
		//终端信息 支付后获取
        //settlement.setTerminalId();//结算后赋值
        //settlement.setTerminalCode();//结算后赋值
        //settlement.setTerminalName();//结算后赋值
        //settlement.setTerminalUser();//结算后赋值
        
		//自助机信息 
        Machine machine = this.getCurrentMachine();
		settlement.setMachineId(machine.getId());//自助机id
		settlement.setMachineMac(machine.getMac());//自助机mac地址
		settlement.setMachineCode(machine.getCode());
		settlement.setMachineName(machine.getName());//自助机名称
		settlement.setMachineUser(machine.getHisUser());
		settlement.setMachineMngCode(machine.getMngCode());
		
		//审计信息
		settlement.setCreateTime(new Date());//创建时间	
		//settle.setOutTime("");//TODO 超时时间   
	}
	private void buildSyncSateSettlement(Settlement settlement) {
		if (null == settlement) {
        	throw new NullPointerException("settlement should not be NULL!");
        }
		if (StringUtils.isEmpty(settlement.getPayChannelCode())) {
			throw new NullPointerException("payChannelCode should not be NULL!");
		}
        PayChannel payChannel = payChannelManager.findOne("from PayChannel where code = ?", settlement.getPayChannelCode());
        if (null == payChannel){
        	throw new NullPointerException("payChannel should not be NULL!");
        }
        settlement.setPayChannel(payChannel);
	}
	private void buildCardSettlement(Settlement settlement) {
		if (null == settlement) {
        	throw new NullPointerException("settlement should not be NULL!");
        }
		if (StringUtils.isEmpty(settlement.getPayChannelCode())) {
			throw new NullPointerException("payChannelCode should not be NULL!");
		}
		if (StringUtils.isEmpty(settlement.getPayerAccount())) {
			throw new NullPointerException("payerAccount should not be NULL!");
		}
		/**渠道信息 【 银联 支付宝 微信  现金】**/
        if (StringUtils.isEmpty(settlement.getPayChannelCode())) {
            throw new NullPointerException("payChannelCode should not be NULL!");
        }
        PayChannel payChannel = payChannelManager.findOne("from PayChannel where code = ?", settlement.getPayChannelCode());
        if (null == payChannel){
        	throw new NullPointerException("payChannel should not be NULL!");
        }
        settlement.setPayChannel(payChannel);
        settlement.setPayChannelId(payChannel.getId());
        settlement.setPayChannelCode(payChannel.getCode());
        settlement.setPayChannelName(payChannel.getName());
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

	/**
	 * 根据 结算单退款情况回调业务
	 * @param order
	 * @throws Exception
	 */
	private HisResponse bizAfterRefund(Order order, Settlement settle){
		HisResponse hisResponse = null;
		try {
			HisPayManager hisOrderManager = (HisPayManager) this.getApplicationContext().getBean(order.getBizBean());
			hisResponse = hisOrderManager.bizAfterRefund(order, settle);
		} catch (Exception e) {
			log.error("退款成功后业务回调失败,结算单号【" + settle.getSettleNo() + "】,订单号【" + order.getOrderNo() + "】,业务类型【"
					+ order.getBizType() + "】,业务单号【" + order.getBizNo() + "】");
			e.printStackTrace();
		}
		return hisResponse;
	}
	
}
