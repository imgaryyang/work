package com.lenovohit.hwe.pay.service.impl;

import java.math.BigDecimal;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.SpringUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.hwe.base.utils.SeqCalculatorUtils;
import com.lenovohit.hwe.pay.exception.PayException;
import com.lenovohit.hwe.pay.model.Bill;
import com.lenovohit.hwe.pay.model.Cash;
import com.lenovohit.hwe.pay.model.PayType;
import com.lenovohit.hwe.pay.model.Settlement;
import com.lenovohit.hwe.pay.service.PayBaseService;
import com.lenovohit.hwe.pay.service.TradeService;

@Service("tradeService")
public class TradeServiceImpl implements TradeService {
	
	protected transient final Log log = LogFactory.getLog(getClass());
	@Autowired
	private GenericManager<Bill, String> billManager;
	@Autowired
	private GenericManager<Settlement, String> settlementManager;
	@Autowired
	private GenericManager<Cash, String> cashManager;
	@Autowired
	private GenericManager<PayType, String> payTypeManager;

	@Override
	public void createPay(Bill bill) throws PayException{
		try {
			//0.初始化数据
			initCreatePay(bill);
			
			//1.业务处理
			billManager.save(bill);
		} catch (PayException e) {
			throw e;
		} catch (Exception e) {
			e.printStackTrace();
			throw new PayException("91001000","生成支付订单系统错误!");
		}
		
	}

	public void prePay(Settlement settle) throws PayException {
		try {
			log.info("开始预支付");
			//0.初始化数据
			initPrePaySettle(settle);
			this.settlementManager.save(settle);
			log.info("开始调用支付渠道");
			//1.支付业务调用
			PayBaseService payBaseService = getAdaptPayService(settle.getPayType());
			payBaseService.prePay(settle);
			this.settlementManager.save(settle);
			log.info("完成调用支付渠道");
//			//2.账单状态
//			Bill bill = settle.getBill();
//			if(StringUtils.equals(settle.getStatus(), Settlement.SETTLE_STAT_PAY_SUCCESS) ||
//					StringUtils.equals(settle.getStatus(), Settlement.SETTLE_STAT_PAY_FINISH)){
//				bill.setRealAmt(bill.getRealAmt().add(settle.getRealAmt()));//此时记录真正支付的金额
//				bill.setLastAmt(settle.getAmt());
//				bill.setStatus(Bill.BILL_STAT_PAY_PARTIAL);
//				bill.setTranTime(DateUtils.getCurrentDate());
//			} else if(StringUtils.equals(settle.getStatus(), Settlement.SETTLE_STAT_PAY_FAILURE)){
//				bill.setStatus(Bill.BILL_STAT_CLOSED);
//				bill.setTranTime(DateUtils.getCurrentDate());
//				bill.setFinishTime(DateUtils.getCurrentDate());
//			}
//			this.billManager.save(bill);
//			
//			//3.业务回调
//			if(StringUtils.equals(bill.getStatus(), Bill.BILL_STAT_CLOSED)){
//				new TradeCallback(settle.getBill(), settle).start();
//			}
			log.info("开始业务回调渠道");
			//TODO 去Bill模式
			//3.业务回调
			if(StringUtils.equals(settle.getStatus(), Settlement.SETTLE_STAT_CLOSED)){
				new TradeCallback(settle).start();
			}
			log.info("完成业务回调渠道");
			log.info("完成预支付");
		} catch (PayException e) {
			throw e;
		} catch (Exception e) {
			e.printStackTrace();
			throw new PayException("91001000","预结算系统错误!");
		}
	}
	
	public void cashPay(Cash cash) throws PayException {
		try {
			//0.初始化数据
			initCashPay(cash);
			this.cashManager.save(cash);
			
			Settlement settlement = cash.getSettlement();
			settlement.setRealAmt(settlement.getRealAmt().add(cash.getAmt()));
			this.settlementManager.save(settlement);
		} catch (PayException e) {
			throw e;
		} catch (Exception e) {
			e.printStackTrace();
			throw new PayException("91001000","现金支付系统错误!");
		}
	}
	
	@Override
	public void payCallback(Settlement settle) throws PayException {
		try {
			//0.初始化数据
			initPayCallbackSettle(settle);
			this.settlementManager.save(settle);
			//1.支付业务调用
			PayBaseService payBaseService = getAdaptPayService(settle.getPayType());
			payBaseService.payCallback(settle);
			this.settlementManager.save(settle);
			
//			//2.账单状态
//			Bill bill = settle.getBill();
//			if(StringUtils.equals(settle.getStatus(), Settlement.SETTLE_STAT_PAY_SUCCESS) ||
//					StringUtils.equals(settle.getStatus(), Settlement.SETTLE_STAT_PAY_FINISH)){
//				//如果之前没有记录RealAmt则更新;已记录则放弃更新.
//				if(null == bill.getRealAmt() || bill.getRealAmt().compareTo(new BigDecimal(0.0)) == 0){
//					bill.setRealAmt(settle.getAmt());//此时记录真正支付的金额
//					bill.setLastAmt(settle.getAmt());
//				}
//				if(bill.getRealAmt().compareTo(bill.getAmt()) >= 0) {
//					bill.setStatus(Bill.BILL_STAT_PAY_SUCCESS);
//				} else {
//					bill.setStatus(Bill.BILL_STAT_PAY_PARTIAL);
//				}
//				bill.setTranTime(DateUtils.getCurrentDate());
//			} else if(StringUtils.equals(settle.getStatus(), Settlement.SETTLE_STAT_PAY_FAILURE)){
//				bill.setStatus(Bill.BILL_STAT_CLOSED);
//				bill.setTranTime(DateUtils.getCurrentDate());
//				bill.setFinishTime(DateUtils.getCurrentDate());
//			} else if(StringUtils.equals(settle.getStatus(), Settlement.SETTLE_STAT_EXCEPTIONAL)){
//				bill.setStatus(Bill.BILL_STAT_EXCEPTIONAL);
//				bill.setTranTime(DateUtils.getCurrentDate());
//			}
//			this.billManager.save(bill);
//			
//			//3.业务回调
//			if(StringUtils.equals(bill.getStatus(), Bill.BILL_STAT_PAY_SUCCESS)
//					|| StringUtils.equals(bill.getStatus(), Bill.BILL_STAT_PAY_PARTIAL)
//					|| StringUtils.equals(bill.getStatus(), Bill.BILL_STAT_CLOSED)){
//				new TradeCallback(settle.getBill(), settle).start();
//			}
			
			//TODO 去Bill模式
			//3.业务回调
			if(StringUtils.equals(settle.getStatus(), Settlement.SETTLE_STAT_PAY_SUCCESS)
					|| StringUtils.equals(settle.getStatus(), Settlement.SETTLE_STAT_PAY_PARTIAL)
					|| StringUtils.equals(settle.getStatus(), Settlement.SETTLE_STAT_CLOSED)){
				new TradeCallback(settle).start();
			}
		} catch (PayException e) {
			throw e;
		} catch (Exception e) {
			e.printStackTrace();
			throw new PayException("91001000","预结算系统错误!");
		}
	}
	
//	@Override
//	public void createRefund(Bill bill) throws PayException{
//		//0.初始化数据
//		initCreateRefund(bill);
//		
//		//1.业务处理
//		billManager.save(bill);
//	}
//	
	@Override
	public void refund(Settlement settle) throws PayException {

		//0.初始化数据
		initRefundSettle(settle);
		this.settlementManager.save(settle);
		
		//1.支付业务调用
		PayBaseService payBaseService = getAdaptPayService(settle.getPayType());
		payBaseService.refund(settle);
		this.settlementManager.save(settle);
		
//		//2.账单状态
//		Bill bill = settle.getBill();
//		if(StringUtils.equals(settle.getStatus(), Settlement.SETTLE_STAT_REFUND_SUCCESS)){//2.1 退款成功处理
//			bill.setStatus(Bill.BILL_STAT_REFUND_SUCCESS);
//			bill.setTranTime(DateUtils.getCurrentDate());
//			bill.setRealAmt(settle.getAmt());
//		} else if(StringUtils.equals(settle.getStatus(), Settlement.SETTLE_STAT_REFUNDING)){//2.2 退款中处理
//			bill.setStatus(Bill.BILL_STAT_REFUNDING);
//			bill.setTranTime(DateUtils.getCurrentDate());
//		} else if(StringUtils.equals(settle.getStatus(), Settlement.SETTLE_STAT_REFUND_FAILURE)){//2.3 退款失败处理 
//			bill.setStatus(Bill.BILL_STAT_REFUND_FAILURE);
//			bill.setTranTime(DateUtils.getCurrentDate());
//		} else if(StringUtils.equals(settle.getStatus(), Settlement.SETTLE_STAT_REFUND_CANCELED)){//2.4 退款被退汇
//			bill.setStatus(Bill.BILL_STAT_REFUND_CANCELED);
//			bill.setTranTime(DateUtils.getCurrentDate());
//			bill.setRealAmt(settle.getAmt());
//		} else if(StringUtils.equals(settle.getStatus(), Settlement.SETTLE_STAT_EXCEPTIONAL)){
//			bill.setStatus(Bill.BILL_STAT_EXCEPTIONAL);
//			bill.setTranTime(DateUtils.getCurrentDate());
//		}
//		this.billManager.save(bill);
//		
//		//3.业务回调
//		if(StringUtils.equals(bill.getStatus(), Bill.BILL_STAT_REFUND_SUCCESS)
//				|| StringUtils.equals(bill.getStatus(), Bill.BILL_STAT_REFUND_FAILURE)
//				|| StringUtils.equals(bill.getStatus(), Bill.BILL_STAT_REFUND_CANCELED)){
//			new TradeCallback(settle.getBill(), settle).start();
//		}
		//TODO 去Bill模式
		//3.业务回调
		if(StringUtils.equals(settle.getStatus(), Settlement.SETTLE_STAT_REFUND_SUCCESS)
				|| StringUtils.equals(settle.getStatus(), Settlement.SETTLE_STAT_REFUND_FAILURE)
				|| StringUtils.equals(settle.getStatus(), Settlement.SETTLE_STAT_REFUND_CANCELED)){
			new TradeCallback(settle).start();
		}
	}
	
	@Override
	public void payQuery(Settlement settle) throws PayException {
		//0.初始化数据
		initSettle(settle);
		
		//1.业务调用
		PayBaseService payBaseService = getAdaptPayService(settle.getPayType());
		payBaseService.query(settle);
		this.settlementManager.save(settle);
		
//		//2. 订单处理
//		Bill bill = settle.getBill();
//		boolean needCallback = true; 
//		if(StringUtils.equals(settle.getStatus(), Settlement.SETTLE_STAT_PAY_SUCCESS) ||
//				StringUtils.equals(settle.getStatus(), Settlement.SETTLE_STAT_PAY_FINISH)){//2.1 支付成功处理
//			//已经完成交易的不做处理
//			if(StringUtils.equals(bill.getStatus(), Bill.BILL_STAT_TRAN_SUCCESS) 
//					|| StringUtils.equals(bill.getStatus(), Bill.BILL_STAT_PAY_SUCCESS)
//					|| StringUtils.equals(bill.getStatus(), Bill.BILL_STAT_CLOSED)) {
//				needCallback = false;
//			} else {
//				bill.setStatus(Bill.BILL_STAT_PAY_SUCCESS);
//				bill.setTranTime(DateUtils.getCurrentDate());
//				bill.setRealAmt(settle.getAmt());//此时记录真正支付的金额
//			}
//		} else if(StringUtils.equals(settle.getStatus(), Settlement.SETTLE_STAT_PAY_FAILURE)){//2.2 支付失败处理
//			//已经完成交易的不做处理
//			if(StringUtils.equals(bill.getStatus(), Bill.BILL_STAT_TRAN_SUCCESS) 
//					|| StringUtils.equals(bill.getStatus(), Bill.BILL_STAT_PAY_FAILURE)
//					|| StringUtils.equals(bill.getStatus(), Bill.BILL_STAT_CLOSED)) {
//				needCallback = false;
//			} else {
//				bill.setStatus(Bill.BILL_STAT_PAY_FAILURE);
//				bill.setTranTime(DateUtils.getCurrentDate());
//				bill.setRealAmt(settle.getAmt());//此时记录真正支付的金额
//			}
//		} else {
//			//其他状态，业务不做处理
//		}
//		this.billManager.save(bill);
//		
//		//3.业务回调
//		if( needCallback ){
//			new TradeCallback(settle.getBill(), settle).start();
//		}
		
		//TODO 去Bill模式
		//3.业务回调
		if(!StringUtils.equals(settle.getTranStatus(), Settlement.SETTLE_STAT_TRAN_SUCCESS)){
			if(StringUtils.equals(settle.getStatus(), Settlement.SETTLE_STAT_PAY_SUCCESS) 
					|| StringUtils.equals(settle.getStatus(), Settlement.SETTLE_STAT_PAY_FINISH)
					||StringUtils.equals(settle.getStatus(), Settlement.SETTLE_STAT_PAY_FAILURE)){//2.1 支付成功处理
				new TradeCallback(settle).start();
			} 
		}
	}
	
	@Override
	public void refundQuery(Settlement settle) throws PayException {
		//0.初始化数据
		initSettle(settle);
		
		//1.业务调用
		PayBaseService payBaseService = getAdaptPayService(settle.getPayType());
		payBaseService.refundQuery(settle);
		this.settlementManager.save(settle);
		
//		//2. 订单处理
//		Bill bill = settle.getBill();
//		boolean needCallback = true; 
//		if(StringUtils.equals(settle.getStatus(), Settlement.SETTLE_STAT_REFUND_SUCCESS)){//2.3 退款成功处理
//			//已经完成交易的不做处理
//			if(StringUtils.equals(bill.getStatus(), Bill.BILL_STAT_TRAN_SUCCESS)
//					||StringUtils.equals(bill.getStatus(), Bill.BILL_STAT_REFUND_SUCCESS)
//					||StringUtils.equals(bill.getStatus(), Bill.BILL_STAT_CLOSED)) {
//				needCallback = false;
//			} else {
//				bill.setStatus(Bill.BILL_STAT_REFUND_SUCCESS);
//				bill.setTranTime(DateUtils.getCurrentDate());
//				bill.setRealAmt(settle.getAmt());//此时记录真正支付的金额
//			}
//		} else if(StringUtils.equals(settle.getStatus(), Settlement.SETTLE_STAT_REFUND_FAILURE) ){//2.4 退款失败
//			//考虑HIS已记账情况下的订单不通知HIS，需手工处理
//			if(StringUtils.equals(bill.getStatus(), Bill.BILL_STAT_TRAN_SUCCESS) ||
//				StringUtils.equals(bill.getStatus(), Bill.BILL_STAT_REFUND_FAILURE) || 
//				StringUtils.equals(bill.getStatus(), Bill.BILL_STAT_CLOSED)) {
//				needCallback = false;
//			} else {
//				bill.setStatus(Bill.BILL_STAT_REFUND_FAILURE);
//				bill.setTranTime(DateUtils.getCurrentDate());
//			}
//		} else if(StringUtils.equals(settle.getStatus(), Settlement.SETTLE_STAT_REFUND_CANCELED) ){//2.5 退款被撤销
//			//考虑HIS已记账情况下的订单不通知HIS，需手工处理
//			if(StringUtils.equals(bill.getStatus(), Bill.BILL_STAT_TRAN_SUCCESS) ||
//				StringUtils.equals(bill.getStatus(), Bill.BILL_STAT_REFUND_CANCELED) || 
//				StringUtils.equals(bill.getStatus(), Bill.BILL_STAT_CLOSED)) {
//				needCallback = false;
//			} else {
//				bill.setStatus(Bill.BILL_STAT_REFUND_CANCELED);
//				bill.setTranTime(DateUtils.getCurrentDate());
//				bill.setRealAmt(settle.getAmt());//此时记录真正支付的金额
//			}
//		} else {
//			//其他状态，业务不做处理
//		}
//		this.billManager.save(bill);
//		
//		//3.业务回调
//		if( needCallback ){
//			new TradeCallback(settle.getBill(), settle).start();
//		}
		
		//TODO 去Bill模式
		//3.业务回调
		if(!StringUtils.equals(settle.getTranStatus(), Settlement.SETTLE_STAT_TRAN_SUCCESS)){
			if(StringUtils.equals(settle.getStatus(), Settlement.SETTLE_STAT_REFUND_SUCCESS) 
					|| StringUtils.equals(settle.getStatus(), Settlement.SETTLE_STAT_REFUND_FAILURE)
					||StringUtils.equals(settle.getStatus(), Settlement.SETTLE_STAT_REFUND_CANCELED)){//2.1 支付成功处理
				new TradeCallback(settle).start();
			} 
		}
	}

	private void initSettle(Settlement settle) throws PayException {
		try {
			if (null == settle) {
				throw new NullPointerException("settle should not be NULL!");
			}
//			Bill bill = billManager.get(settle.getBillId());
//			if (null == bill) {
//				throw new NullPointerException("bill should not be NULL!");
//			}
//			settle.setBill(bill);
			PayType payType = payTypeManager.get(settle.getPayTypeId());
			if (null == payType) {
				throw new NullPointerException("payType should not be NULL!");
			}
			settle.setPayType(payType);
		} catch (PayException e) {
			throw e;
		} catch (Exception e) {
			e.printStackTrace();
			throw new PayException("91001020","同步查询，数据格式错误");
		}
	}

	private void initCashPay(Cash cash) throws PayException{
		try {
			if(null == cash) {
				throw new PayException("91001010","settle should not be NULL!");
			}
	        Settlement settlement = settlementManager.get(cash.getSettleId());
	        if (null == settlement || !StringUtils.equals(settlement.getStatus(), Settlement.SETTLE_STAT_INITIAL)){
	        	throw new PayException("91001010","settlement should not be NULL!");
	        }
//	        cash.setSettleId(settlement.getId());
	        cash.setSettleNo(settlement.getSettleNo());
	        cash.setSettlement(settlement);
	        
	        cash.setStatus(Cash.CASH_STAT_PAY_SUCCESS);//状态-成功
		} catch (PayException e) {
			throw e;
		} catch (Exception e) {
			e.printStackTrace();
			throw new PayException("91001020","现金支付，数据格式错误");
		}
	}
	
	private void initCreatePay(Bill bill) throws PayException{
		try {
			if(null == bill) {
				throw new PayException("91001010","bill should not be NULL!");
			}
			//账单基础信息
			bill.setBillNo(SeqCalculatorUtils.calculateCode("BILL_NO_PAY_SEQ"));
			bill.setBillType(Bill.BILL_TYPE_PAY);
			bill.setBillTitle(bill.getBillTitle());
			if(StringUtils.isEmpty(bill.getBillDesc())){
				bill.setBillDesc(bill.getBillTitle());
			}
			
			//付款金额(除Amt外其他不做控制)
			bill.setAmt(bill.getAmt());
//			bill.setrealAmt
//			bill.setlastAmt
//			bill.setpaAmt
//			bill.setmiAmt
//			bill.setselfAmt
//			bill.setreduceAmt
			
			//付款终端信息(不做控制)
//	        bill.setAppCode(appCode);
//	        bill.setAppName(appName);
//	        bill.setAppType(appType);
//	        bill.setTerminalCode(terminalCode);
//	        bill.setTerminalName(terminalName);
//	        bill.setTerminalUser(terminalUser);
			
			//支付渠道信息 【 银联 支付宝 微信  现金】(不做控制)
//			bill.setPayChannelId();
//	        bill.setPayChannelCode();
//	        bill.setPayChannelName();
//	        bill.setPayMerchantId();
//	        bill.setPayMerchantNo();
//	        bill.setPayMerchantName();
//	        bill.setPayTypeId();
//	        bill.setPayTypeCode();
//	        bill.setPayTypeName();
//	        bill.setPayType();
			
			//付款人信息(不做控制)
//			bill.setPayerNo();
//	        bill.setPayerName();
//	        bill.setPayerAccount();
//	        bill.setPayerAcctType();
//	        bill.setPayerAcctBank();
//	        bill.setPayerPhone();
//	        bill.setPayerLogin();
			
			//业务信息(不做控制)
//			bill.setBizType(bizType);
//			bill.setBizNo(bizNo);
//			bill.setBizUrl(bizUrl);
//			bill.setBizBean(bizBean);
//			bill.setBizTime(bizTime);
	        
			
	        //交易参数
//	        bill.setTranTime(tranTime);
//	        bill.setFinishTime(finishTime);
//	        bill.setOutTime(null);
//	        bill.setOriBillId(oriBillId);
//	        bill.setOriAmt(oriAmt);
			
			//账单后处理
//			bill.setOptStatus(optStatus);
//			bill.setOptTime(optTime);
//			bill.setOptId(optId);
//			bill.setOptName(optName);
//			bill.setOperation(operation);
			
			bill.setStatus(Bill.BILL_STAT_INITIAL);
			
		} catch (PayException e) {
			throw e;
		} catch (Exception e) {
			e.printStackTrace();
			throw new PayException("91001020","生产支付账单数据格式错误");
		}
	}
	
	private void initPrePaySettle(Settlement settle) throws PayException{
		try {
			if(null == settle) {
				throw new PayException("91001010","settle should not be NULL!");
			}
//			if(StringUtils.isEmpty(settle.getBillId())){
//				throw new PayException("91001010","billId should not be NULL!");
//			}
//	        Bill bill = this.billManager.get(settle.getBillId());
//	        settle.setBill(bill);
	        
	        /**基本信息**/
	        settle.setSettleNo(SeqCalculatorUtils.calculateCode("SETTLE_NO_PAY_SEQ"));//结算单号 
	        settle.setSettleType(Settlement.SETTLE_TYPE_PAY);//结算类型
//	        if(StringUtils.isEmpty(settle.getSettleTitle())){
//	        	settle.setSettleTitle(bill.getBillTitle());
//	        }
//	        if(StringUtils.isEmpty(settle.getSettleDesc())){
//	        	 settle.setSettleDesc(bill.getBillDesc());
//	        }
//	        if(StringUtils.isEmpty(settle.getAmt()) || settle.getAmt().compareTo(new BigDecimal(0)) != 1){
//	        	throw new PayException("91001020","Amt should not be NULL Or not be <= 0");
//	        }
	        settle.setRealAmt(new BigDecimal(0.0));
	        
	        //付款终端信息
//	        settle.setAppCode(appCode);
//	        settle.setAppName(appName);
//	        settle.setAppType(appType);
//	        settle.setTerminalCode(terminalCode);
//	        settle.setTerminalName(terminalName);
//	        settle.setTerminalUser(terminalUser);
//	        
//	        //支付渠道信息 【 银联 支付宝 微信  现金】
//	        if (StringUtils.isEmpty(settle.getPayTypeId())) {
//	        	throw new PayException("91001010","payTypeId should not be NULL!");
//	        }
	        PayType payType = payTypeManager.get(settle.getPayTypeId());
	        if (null == payType){
	        	throw new PayException("91001010","payType should not be NULL!");
	        }
	        settle.setPayChannelId(payType.getPayChannel().getId());
	        settle.setPayChannelCode(payType.getPayChannel().getCode());
	        settle.setPayChannelName(payType.getPayChannel().getName());
	        settle.setPayMerchantId(payType.getPayMerchant().getId());
	        settle.setPayMerchantNo(payType.getPayMerchant().getMchNo());
	        settle.setPayMerchantName(payType.getPayMerchant().getMchName());
	        settle.setPayTypeId(payType.getId());
	        settle.setPayTypeCode(payType.getCode());
	        settle.setPayTypeName(payType.getName());
	        settle.setPayType(payType);
			
	        //付款人信息(结算后赋值)
	        //settle.setPayerNo();
	        //settle.setPayerName();
	        //settle.setPayerAccount();
	        //settle.setPayerAcctType();
	        //settle.setPayerAcctBank();
	        //settle.setPayerPhone();
	        //settle.setPayerLogin();
	        
	        //结算信息(结算后赋值)
//	        settle.setTradeNo(tradeNo);
//	        settle.setTradeTime(tradeTime);
//	        settle.setTradeStatus(tradeStatus);
//	        settle.setTradeRspCode(tradeRspCode);
//	        settle.setTradeRspMsg(tradeRspMsg);
//	        settle.setTradeTerminalCode(tradeTerminalCode);
	        
	        //交易参数
//	        settle.setFinishTime(finishTime);
//	        settle.setOutTime(null);
//	        settle.setOriAmt(oriAmt);
	        
	        //交易对账信息
//	        settle.setcheckStat
//	        settle.setcheckTime
//	        settle.setsyncNum
	        
	        //交易过程参数
//	        settle.setqrCode
//	        settle.setrespText
//	        settle.setflag
	        
	        //现金交易参数
//	        settle.setprintStat
//	        settle.setprintBatchNo
	        settle.setStatus(Settlement.SETTLE_STAT_INITIAL);//结算状态
		} catch (PayException e) {
			throw e;
		} catch (Exception e) {
			e.printStackTrace();
			throw new PayException("91001020","预支付，数据格式错误");
		}
	}
	
	private void initPayCallbackSettle(Settlement settle) throws PayException{
		try {
			if(null == settle) {
				throw new PayException("91001010","settle should not be NULL!");
			}
//			if(StringUtils.isEmpty(settle.getBillId())){
//				throw new PayException("91001010","billId should not be NULL!");
//			}
//	        Bill bill = this.billManager.get(settle.getBillId());
//	        settle.setBill(bill);
	        if (StringUtils.isEmpty(settle.getPayTypeId())) {
	        	throw new PayException("91001010","payTypeId should not be NULL!");
	        }
	        PayType payType = payTypeManager.get(settle.getPayTypeId());
	        if (null == payType){
	        	throw new PayException("91001010","payType should not be NULL!");
	        }
	        settle.setPayType(payType);
		} catch (PayException e) {
			throw e;
		} catch (Exception e) {
			e.printStackTrace();
			throw new PayException("91001020","支付回调，数据格式错误");
		}
	}
	
//	private void initCreateRefund(Bill bill) throws PayException{
//		try {
//			if(null == bill) {
//				throw new PayException("91001010","bill should not be NULL!");
//			}
//			//账单基础信息
//			bill.setBillNo(SeqCalculatorUtils.calculateCode("BILL_NO_REF_SEQ"));
//			bill.setBillType(Bill.BILL_TYPE_REFUND);
//			bill.setBillTitle(bill.getBillTitle());
//			if(StringUtils.isEmpty(bill.getBillDesc())){
//				bill.setBillDesc(bill.getBillTitle());
//			}
//			
//			//付款金额(除Amt外其他不做控制)
//			bill.setAmt(bill.getAmt());
////			bill.setrealAmt
////			bill.setlastAmt
////			bill.setpaAmt
////			bill.setmiAmt
////			bill.setselfAmt
////			bill.setreduceAmt
//			
//			//付款终端信息(不做控制)
////	        bill.setAppCode(appCode);
////	        bill.setAppName(appName);
////	        bill.setAppType(appType);
////	        bill.setTerminalCode(terminalCode);
////	        bill.setTerminalName(terminalName);
////	        bill.setTerminalUser(terminalUser);
//			
//			//支付渠道信息 【 银联 支付宝 微信  现金】(不做控制)
////			bill.setPayChannelId();
////	        bill.setPayChannelCode();
////	        bill.setPayChannelName();
////	        bill.setPayMerchantId();
////	        bill.setPayMerchantNo();
////	        bill.setPayMerchantName();
////	        bill.setPayTypeId();
////	        bill.setPayTypeCode();
////	        bill.setPayTypeName();
////	        bill.setPayType();
//			
//			//付款人信息(不做控制)
////			bill.setPayerNo();
////	        bill.setPayerName();
////	        bill.setPayerAccount();
////	        bill.setPayerAcctType();
////	        bill.setPayerAcctBank();
////	        bill.setPayerPhone();
////	        bill.setPayerLogin();
//			
//			//业务信息(不做控制)
////			bill.setBizType(bizType);
////			bill.setBizNo(bizNo);
////			bill.setBizUrl(bizUrl);
////			bill.setBizBean(bizBean);
////			bill.setBizTime(bizTime);
//	        
//			
//	        //交易参数
////	        bill.setTranTime(tranTime);
////	        bill.setFinishTime(finishTime);
////	        bill.setOutTime(null);
////	        bill.setOriBillId(oriBillId);
////	        bill.setOriAmt(oriAmt);
//			
//			//账单后处理
////			bill.setOptStatus(optStatus);
////			bill.setOptTime(optTime);
////			bill.setOptId(optId);
////			bill.setOptName(optName);
////			bill.setOperation(operation);
//			
//			bill.setStatus(Bill.BILL_STAT_INITIAL);
//			
//		} catch (PayException e) {
//			throw e;
//		} catch (Exception e) {
//			e.printStackTrace();
//			throw new PayException("91001020","生产退款账单数据格式错误");
//		}
//	}
	
	private void initRefundSettle(Settlement settle) throws PayException{
		try {
			if(null == settle) {
				throw new PayException("91001010","settle should not be NULL!");
			}
//			if(StringUtils.isEmpty(settle.getBillId())){
//				throw new PayException("91001010","billId should not be NULL!");
//			}
//	        Bill bill = this.billManager.get(settle.getBillId());
	        if(!StringUtils.isEmpty(settle.getOriSettleId())){
	        	Settlement oriSettle = this.settlementManager.findOne("from Settlement where billId = ? ", settle.getOriSettleId());
	        	settle.setOriSettleId(oriSettle.getId());
	        	settle.setOriTradeNo(oriSettle.getTradeNo());
	        	settle.setOriAmt(oriSettle.getAmt());
	        	if(StringUtils.isEmpty(settle.getPayTypeId())){
	        		settle.setPayTypeId(oriSettle.getPayTypeId());
	        	}
	        	
	        	settle.setOriSettlement(oriSettle);
	        }
//	        if(StringUtils.isEmpty(settle.getAmt()) || settle.getAmt().compareTo(new BigDecimal(0.0)) != 1){
//        		settle.setAmt(bill.getAmt());
//        	}
//	        if(StringUtils.isEmpty(settle.getOriAmt()) || settle.getOriAmt().compareTo(new BigDecimal(0.0)) != 1){
//	        	settle.setOriAmt(bill.getOriAmt());
//	        }
//	        settle.setBill(bill);
	        
	        /**基本信息**/
	        settle.setSettleNo(SeqCalculatorUtils.calculateCode("SETTLE_NO_REF_SEQ"));//结算单号 
	        settle.setSettleType(Settlement.SETTLE_TYPE_REFUND);//结算类型
//	        if(StringUtils.isEmpty(settle.getSettleTitle())){
//	        	settle.setSettleTitle(bill.getBillTitle());
//	        }
//	        if(StringUtils.isEmpty(settle.getSettleDesc())){
//	        	 settle.setSettleDesc(bill.getBillDesc());
//	        }
//	        if(StringUtils.isEmpty(settle.getAmt()) || settle.getAmt().compareTo(new BigDecimal(0.0)) != 1){
//	        	throw new PayException("91001020","Amt should not be NULL Or not be <= 0");
//	        }
//	        settle.setRealAmt();支付后生成
	        
	        //付款终端信息
//	        settle.setAppCode(appCode);
//	        settle.setAppName(appName);
//	        settle.setAppType(appType);
//	        settle.setTerminalCode(terminalCode);
//	        settle.setTerminalName(terminalName);
//	        settle.setTerminalUser(terminalUser);
//	        
//	        //支付渠道信息 【 银联 支付宝 微信  现金】
//	        if (StringUtils.isEmpty(settle.getPayTypeId())) {
//	        	throw new PayException("91001010","payTypeId should not be NULL!");
//	        }
	        PayType payType = payTypeManager.get(settle.getPayTypeId());
	        if (null == payType){
	        	throw new PayException("91001010","payType should not be NULL!");
	        }
	        settle.setPayChannelId(payType.getPayChannel().getId());
	        settle.setPayChannelCode(payType.getPayChannel().getCode());
	        settle.setPayChannelName(payType.getPayChannel().getName());
	        settle.setPayMerchantId(payType.getPayMerchant().getId());
	        settle.setPayMerchantNo(payType.getPayMerchant().getMchNo());
	        settle.setPayMerchantName(payType.getPayMerchant().getMchName());
	        settle.setPayTypeId(payType.getId());
	        settle.setPayTypeCode(payType.getCode());
	        settle.setPayTypeName(payType.getName());
	        settle.setPayType(payType);
			
	        //付款人信息(结算后赋值)
	        //settle.setPayerNo();
	        //settle.setPayerName();
	        //settle.setPayerAccount();
	        //settle.setPayerAcctType();
	        //settle.setPayerAcctBank();
	        //settle.setPayerPhone();
	        //settle.setPayerLogin();
	        
	        //结算信息(结算后赋值)
//	        settle.setTradeNo(tradeNo);
//	        settle.setTradeTime(tradeTime);
//	        settle.setTradeStatus(tradeStatus);
//	        settle.setTradeRspCode(tradeRspCode);
//	        settle.setTradeRspMsg(tradeRspMsg);
//	        settle.setTradeTerminalCode(tradeTerminalCode);
	        
	        //交易参数
//	        settle.setFinishTime(finishTime);
//	        settle.setOutTime(null);
//	        settle.setOriAmt(oriAmt);
	        
	        //交易对账信息
//	        settle.setcheckStat
//	        settle.setcheckTime
//	        settle.setsyncNum
	        
	        //交易过程参数
//	        settle.setqrCode
//	        settle.setrespText
//	        settle.setflag
	        
	        //现金交易参数
//	        settle.setprintStat
//	        settle.setprintBatchNo
	        settle.setStatus(Settlement.SETTLE_STAT_INITIAL);//结算状态
		} catch (PayException e) {
			throw e;
		} catch (Exception e) {
			e.printStackTrace();
			throw new PayException("91001020","退款数据格式错误");
		}
	}
	/**
	 * 根据不同支付方式找到对应PayService
	 * @param payType
	 * @return
	 * @throws PayException
	 */
	private PayBaseService getAdaptPayService(PayType payType) throws PayException {
		PayBaseService payService = null;
		try {
			StringBuffer sb = new StringBuffer("");
			sb.append("c").append(payType.getPayChannel().getCode());
			sb.append("T").append(payType.getType());
			sb.append("PayService");
			payService = (PayBaseService) SpringUtils.getBean(sb.toString());
			if (null == payService) {
				throw new PayException("91002020","不支持的通信类型:" + sb.toString() + ",或需要在spring中进行未配置！");
			}
		} catch (PayException e) {
			throw e;
		} catch (Exception e) {
			e.getMessage();
			throw new PayException("91002020","不支持的支付渠道,或需要在spring中进行未配置！");
		}
		
		return payService;
	}
	
	class TradeCallback extends Thread{
		private Settlement settle;
		private RestTemplate restTemplate = new RestTemplate();
		public TradeCallback(Settlement settle){
			this.settle = settle;
		}
		
        @SuppressWarnings("unchecked")
		@Override
        public void run() {
        	log.info("开始业务回调渠道---------独立进程----");
        	GenericManager<Settlement, String> settlementManager = (GenericManager<Settlement, String>) SpringUtils.getBean("settlementManager");
        	Map<String, Object> tradeModel = new HashMap<String, Object>();
        	tradeModel.put("bizType", settle.getBizType());
        	tradeModel.put("bizNo", settle.getBizNo());
        	tradeModel.put("amt", settle.getAmt());
        	tradeModel.put("realAmt", settle.getRealAmt());
        	tradeModel.put("status", settle.getStatus());
        	
        	//支付信息
        	tradeModel.put("payChannleCode", settle.getPayChannelCode());
        	tradeModel.put("payChannleName", settle.getPayChannelName());
        	tradeModel.put("payMerchantNo", settle.getPayMerchantNo());
        	tradeModel.put("payMerchantName", settle.getPayMerchantName());
        	tradeModel.put("payTypeCode", settle.getPayTypeCode());
        	tradeModel.put("payTypeName", settle.getPayTypeName());
        	tradeModel.put("payerNo", settle.getPayerNo());
        	tradeModel.put("payerName", settle.getPayerName());
        	tradeModel.put("payerAccount", settle.getPayerAccount());
        	tradeModel.put("payerPhone", settle.getPayerPhone());
        	tradeModel.put("payerLogin", settle.getPayerLogin());
        	tradeModel.put("tradeNo", settle.getTradeNo());
        	tradeModel.put("tradeTime", settle.getTradeTime());
//        	tcService.callback(tradeModel);
        	
        	ResponseEntity<String> response = restTemplate.postForEntity(settle.getBizUrl(), tradeModel, String.class);
        	if(response.getStatusCode() == HttpStatus.OK){
        		settle.setTranStatus(Settlement.SETTLE_TRAN_SUCCESS);
        		settle.setTranTime(new Date());
        		settlementManager.save(settle);
        	}

        	log.info("完成业务回调渠道---------独立进程----");
        }
    }
	
}
