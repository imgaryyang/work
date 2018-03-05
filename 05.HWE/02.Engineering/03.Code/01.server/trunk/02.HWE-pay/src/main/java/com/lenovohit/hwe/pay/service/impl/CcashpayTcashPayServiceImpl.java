package com.lenovohit.hwe.pay.service.impl;

import java.math.BigDecimal;

import org.apache.commons.configuration.Configuration;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Service;

import com.lenovohit.core.utils.DateUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.hwe.pay.model.Settlement;
import com.lenovohit.hwe.pay.service.PayBaseService;
import com.lenovohit.hwe.pay.support.wxpay.scan.WXPay;
import com.lenovohit.hwe.pay.support.wxpay.scan.listener.DefaultPrecreateBusinessResultListener;
import com.lenovohit.hwe.pay.support.wxpay.scan.listener.DefaultRefundBusinessResultListener;
import com.lenovohit.hwe.pay.support.wxpay.scan.listener.DefaultRefundQueryBusinessResultListener;
import com.lenovohit.hwe.pay.support.wxpay.scan.listener.DefaultScanPayQueryBusinessResultListener;
import com.lenovohit.hwe.pay.support.wxpay.scan.protocol.pay_query_protocol.ScanPayQueryReqData;
import com.lenovohit.hwe.pay.support.wxpay.scan.protocol.pay_query_protocol.ScanPayQueryResData;
import com.lenovohit.hwe.pay.support.wxpay.scan.protocol.refund_protocol.RefundReqData;
import com.lenovohit.hwe.pay.support.wxpay.scan.protocol.refund_protocol.RefundResData;
import com.lenovohit.hwe.pay.support.wxpay.scan.protocol.refund_query_protocol.RefundOrderData;
import com.lenovohit.hwe.pay.support.wxpay.scan.protocol.refund_query_protocol.RefundQueryReqData;
import com.lenovohit.hwe.pay.support.wxpay.scan.protocol.refund_query_protocol.RefundQueryResData;
import com.lenovohit.hwe.pay.utils.PayMerchantConfigCache;

@Service("ccashpayTcashPayService")
public class CcashpayTcashPayServiceImpl implements PayBaseService {
    private static Log log = LogFactory.getLog(CcashpayTcashPayServiceImpl.class);
	
    @Override
	public void prePay(Settlement settlement) {
    	settlement.setRealAmt(settlement.getAmt());
    	settlement.setStatus(Settlement.SETTLE_STAT_PAY_SUCCESS);
		settlement.setTradeStatus(Settlement.SETTLE_TRADE_SUCCESS);
		settlement.setTradeTime(DateUtils.getCurrentDate());
    }
    @Override
	public void payCallback(Settlement settlement) {
    	//TODO 啥也不用做！
    }
    
    @Override
	public void refund(Settlement settlement) {
    	Configuration config = PayMerchantConfigCache.getConfig(settlement.getPayType().getPayMerchant());
		RefundReqData refundReqData = new RefundReqData(
    			settlement.getOriTradeNo(),
    			"",
    			settlement.getTerminalCode(),
    			settlement.getSettleNo(),
    			settlement.getOriAmt().multiply(new BigDecimal(100)).intValue(),
    			settlement.getAmt().multiply(new BigDecimal(100)).intValue(),
    			config.getString("mchID"),//Configure.getMchid(),
    			"CNY",
    			config);
    	DefaultRefundBusinessResultListener resultListener = new DefaultRefundBusinessResultListener();
    	RefundResData refundResData = null;
		try {
			WXPay.doRefundBusiness(refundReqData, resultListener);
			refundResData = resultListener.getRefundResData();
			switch (resultListener.getResult()) {
	            case DefaultRefundBusinessResultListener.ON_REFUND_SUCCESS:
	            	settlement.setStatus(Settlement.SETTLE_STAT_REFUND_SUCCESS);
            		settlement.setTradeNo(refundResData.getRefund_id());
	            	settlement.setTradeStatus(Settlement.SETTLE_TRADE_SUCCESS);
	            	settlement.setTradeTime(DateUtils.getCurrentDate());
	                settlement.setTradeRspCode(refundResData.getReturn_code());
		    		settlement.setTradeRspMsg(refundResData.getReturn_msg());
		    		settlement.setRespText(refundResData.getResponseString());
		    		log.info("微信扫码支付-退款成功: )");
	                break;
	                
	            case DefaultPrecreateBusinessResultListener.ON_FAIL_BY_RETURN_CODE_ERROR:
	            case DefaultPrecreateBusinessResultListener.ON_FAIL_BY_RETURN_CODE_FAIL:
	            case DefaultPrecreateBusinessResultListener.ON_FAIL_BY_SIGN_INVALID:
	            case DefaultPrecreateBusinessResultListener.ON_PRECREATE_FAIL:
	            	settlement.setStatus(Settlement.SETTLE_STAT_REFUND_FAILURE);
	                settlement.setTradeStatus(Settlement.SETTLE_TRADE_FAILURE);
		    		settlement.setRespText(refundResData.getResponseString());
		    		log.error("微信扫码支付-退款失败，错误原因【" + resultListener.getResult() + "】");
	                break;
	        }
			
			if(!StringUtils.isBlank(refundResData.getOut_refund_no()) && 
	    			!StringUtils.equals(refundResData.getOut_refund_no(), settlement.getSettleNo())){
				settlement.setStatus(Settlement.SETTLE_STAT_EXCEPTIONAL);
				settlement.setTradeStatus(Settlement.SETTLE_TRADE_EXCEPTIONAL);
	            settlement.setTradeTime(DateUtils.getCurrentDate());
	        	settlement.setTradeRspCode("40004");
	    		settlement.setTradeRspMsg("inconsistent data between the out_refund_no and settleNo!");
	            log.error("inconsistent data between the out_refund_no and settleNo!");
	            return;
			}
	    	if(!StringUtils.isBlank(refundResData.getRefund_fee())){
	    		int refund_fee = settlement.getAmt().multiply(new BigDecimal(100)).intValue();
	    		if(refund_fee != Integer.valueOf(refundResData.getRefund_fee())){
	    			settlement.setStatus(Settlement.SETTLE_STAT_EXCEPTIONAL);
	    			settlement.setTradeStatus(Settlement.SETTLE_TRADE_EXCEPTIONAL);
	                settlement.setTradeTime(DateUtils.getCurrentDate());
	            	settlement.setTradeRspCode("40004");
	        		settlement.setTradeRspMsg("inconsistent data between the getCurrentDate and amt!！");
	                log.error("inconsistent data between the refund_fee and amt!");
	    		}

				settlement.setRealAmt(new BigDecimal(refundResData.getRefund_fee()).multiply(new BigDecimal(0.01)));//记录结算单真实发生金额
	    	}
		} catch (Exception e) {
			settlement.setStatus(Settlement.SETTLE_STAT_EXCEPTIONAL);
			settlement.setTradeStatus(Settlement.SETTLE_TRADE_EXCEPTIONAL);
            settlement.setTradeTime(DateUtils.getCurrentDate());
        	settlement.setTradeRspCode("40004");
    		settlement.setTradeRspMsg("系统处理错误！");
			log.error("微信扫码支付-退款系统异常，交易状态未知!!!");
			e.printStackTrace();
		}
    }

	@Override
	public void query(Settlement settlement) {
		Configuration config = PayMerchantConfigCache.getConfig(settlement.getPayType().getPayMerchant());
		ScanPayQueryReqData scanPayQueryReqData = new ScanPayQueryReqData(
    			settlement.getTradeNo(),
    			settlement.getSettleNo(),
    			config);
    	DefaultScanPayQueryBusinessResultListener resultListener = new DefaultScanPayQueryBusinessResultListener();
    	ScanPayQueryResData scanPayQueryResData = null;
		try {
			WXPay.doScanPayQueryBusiness(scanPayQueryReqData, resultListener);
			scanPayQueryResData = resultListener.getScanPayQueryResData();
			switch (resultListener.getResult()) {
	            case DefaultScanPayQueryBusinessResultListener.ON_SCAN_PAY_QUERY_SUCCESS:
	            	log.info("微信扫码支付-账单查询成功: )");
	            	if(StringUtils.equals(scanPayQueryResData.getTrade_state(), "SUCCESS")){
	            		log.info("微信扫码支付-账单支付成功: )");
	            		settlement.setStatus(Settlement.SETTLE_STAT_PAY_SUCCESS);
	            		settlement.setTradeStatus(Settlement.SETTLE_TRADE_SUCCESS);
						settlement.setPayerAccount(scanPayQueryResData.getOpenid());
						settlement.setTradeNo(scanPayQueryResData.getTransaction_id());
						settlement.setRealAmt(new BigDecimal(scanPayQueryResData.getTotal_fee()).multiply(new BigDecimal(0.01)));//记录结算单真实发生金额
 	            	} else {
 	            		log.info("微信扫码支付-账单支付失败: )");
 	            		settlement.setStatus(Settlement.SETTLE_STAT_PAY_FAILURE);
	            		settlement.setTradeStatus(Settlement.SETTLE_TRADE_FAILURE);
 	            	}
	                settlement.setTradeTime(DateUtils.string2Date(scanPayQueryResData.getTime_end(), "yyyyMMddHHmmss"));
	                settlement.setTradeRspCode(scanPayQueryResData.getReturn_code());
		    		settlement.setTradeRspMsg(scanPayQueryResData.getReturn_msg());
		    		settlement.setRespText(scanPayQueryResData.getResponseString());
	                break;
	                
	            case DefaultRefundQueryBusinessResultListener.ON_REFUND_QUERY_FAIL:
	            	log.info("微信扫码支付-支付查询失败: )");
	            	settlement.setStatus(Settlement.SETTLE_STAT_PAY_FAILURE);
            		settlement.setTradeStatus(Settlement.SETTLE_TRADE_FAILURE);
	            	settlement.setTradeTime(DateUtils.getCurrentDate());
	                settlement.setTradeRspCode(scanPayQueryResData.getReturn_code());
		    		settlement.setTradeRspMsg(scanPayQueryResData.getReturn_msg());
		    		settlement.setRespText(scanPayQueryResData.getResponseString());
	                break;
	                
	            case DefaultScanPayQueryBusinessResultListener.ON_FAIL_BY_RETURN_CODE_ERROR:
	            case DefaultScanPayQueryBusinessResultListener.ON_FAIL_BY_RETURN_CODE_FAIL:
	            case DefaultScanPayQueryBusinessResultListener.ON_FAIL_BY_SIGN_INVALID:
		    		log.error("微信扫码支付-账单查询失败，错误原因【" + resultListener.getResult() + "】");
	                break;
	        }
		} catch (Exception e) {
			log.error("微信扫码支付-账单查询系统异常，交易状态未知!!!");
			e.printStackTrace();
		}
	}

	@Override
	public void refundQuery(Settlement settlement) {
		Configuration config = PayMerchantConfigCache.getConfig(settlement.getPayType().getPayMerchant());
		RefundQueryReqData refundQueryReqData = new RefundQueryReqData(
				settlement.getOriTradeNo(), 
				"", 
				settlement.getTerminalCode(),
				settlement.getSettleNo(), 
				"",
				config);
    	DefaultRefundQueryBusinessResultListener resultListener = new DefaultRefundQueryBusinessResultListener();
    	RefundQueryResData refundQueryResData = null;
		try {
			WXPay.doRefundQueryBusiness(refundQueryReqData, resultListener);
			refundQueryResData = resultListener.getRefundQueryResData();
			switch (resultListener.getResult()) {
	            case DefaultRefundQueryBusinessResultListener.ON_REFUND_QUERY_SUCCESS:
	            	log.info("微信扫码支付-退款查询成功: )");
	            	RefundOrderData refundOrder = null;
	            	if(null != refundQueryResData.getOrderList() && refundQueryResData.getOrderList().size() == 1){
	            		refundOrder = refundQueryResData.getOrderList().get(0);
	            	}
	            	if(refundOrder!=null && StringUtils.equals("SUCCESS", refundOrder.getRefundStatus())){
	            		log.info("微信扫码支付-退款成功: )");
	            		settlement.setStatus(Settlement.SETTLE_STAT_REFUND_SUCCESS);
	            		settlement.setTradeStatus(Settlement.SETTLE_TRADE_SUCCESS);
						settlement.setTradeNo(refundOrder.getRefundID());
	            		settlement.setRealAmt(new BigDecimal(refundOrder.getRefundFee()).multiply(new BigDecimal(0.01)));//记录结算单真实发生金额
	            	} else if(refundOrder!=null && StringUtils.equals("PROCESSING", refundOrder.getRefundStatus())){
	            		log.info("微信扫码支付-退款中 ....");
	            		settlement.setStatus(Settlement.SETTLE_STAT_REFUNDING);
	            		settlement.setTradeStatus(Settlement.SETTLE_TRADE_SUCCESS);
	            	} else if(refundOrder!=null && StringUtils.equals("CHANGE", refundOrder.getRefundStatus())){
	            		log.info("微信扫码支付-退款异常");
	            		settlement.setStatus(Settlement.SETTLE_STAT_EXCEPTIONAL);
	            		settlement.setTradeStatus(Settlement.SETTLE_TRADE_EXCEPTIONAL);
	            	} else {
	            		log.info("微信扫码支付-退款失败");
	            		settlement.setStatus(Settlement.SETTLE_STAT_REFUND_FAILURE);
	            		settlement.setTradeStatus(Settlement.SETTLE_TRADE_FAILURE);
	            	}
	                settlement.setTradeTime(DateUtils.getCurrentDate());
	                settlement.setTradeRspCode(refundQueryResData.getReturn_code());
		    		settlement.setTradeRspMsg(refundQueryResData.getReturn_msg());
		    		settlement.setRespText(refundQueryResData.getResponseString());
	                break;
	            case DefaultRefundQueryBusinessResultListener.ON_REFUND_QUERY_FAIL:
	            	log.info("微信扫码支付-退款查询失败: )");
            		settlement.setStatus(Settlement.SETTLE_STAT_REFUND_FAILURE);
            		settlement.setTradeStatus(Settlement.SETTLE_TRADE_FAILURE);
	            	settlement.setTradeTime(DateUtils.getCurrentDate());
	                settlement.setTradeRspCode(refundQueryResData.getReturn_code());
		    		settlement.setTradeRspMsg(refundQueryResData.getReturn_msg());
		    		settlement.setRespText(refundQueryResData.getResponseString());
	                break;
	            case DefaultRefundQueryBusinessResultListener.ON_FAIL_BY_RETURN_CODE_ERROR:
	            case DefaultRefundQueryBusinessResultListener.ON_FAIL_BY_RETURN_CODE_FAIL:
	            case DefaultRefundQueryBusinessResultListener.ON_FAIL_BY_SIGN_INVALID:
		    		log.error("微信扫码支付-退款查询失败，错误原因【" + resultListener.getResult() + "】");
	                break;
	        }
		} catch (Exception e) {
			log.error("微信扫码支付-退款查询系统异常，交易状态未知!!!");
			e.printStackTrace();
		}
	}
	
}
