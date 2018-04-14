package com.lenovohit.hwe.pay.service.impl;

import java.math.BigDecimal;
import java.util.SortedMap;
import java.util.TreeMap;

import org.apache.commons.configuration.Configuration;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Service;

import com.lenovohit.core.utils.DateUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.hwe.pay.model.Settlement;
import com.lenovohit.hwe.pay.service.PayBaseService;
import com.lenovohit.hwe.pay.support.wxpay.WXPay;
import com.lenovohit.hwe.pay.support.wxpay.common.Signature;
import com.lenovohit.hwe.pay.support.wxpay.common.Util;
import com.lenovohit.hwe.pay.support.wxpay.listener.DefaultPayCallbackBusinessResultListener;
import com.lenovohit.hwe.pay.support.wxpay.listener.DefaultPrecreateBusinessResultListener;
import com.lenovohit.hwe.pay.support.wxpay.listener.DefaultRefundBusinessResultListener;
import com.lenovohit.hwe.pay.support.wxpay.listener.DefaultRefundQueryBusinessResultListener;
import com.lenovohit.hwe.pay.support.wxpay.listener.DefaultScanPayQueryBusinessResultListener;
import com.lenovohit.hwe.pay.support.wxpay.protocol.pay_callback.PayCallbackResData;
import com.lenovohit.hwe.pay.support.wxpay.protocol.pay_query_protocol.ScanPayQueryReqData;
import com.lenovohit.hwe.pay.support.wxpay.protocol.pay_query_protocol.ScanPayQueryResData;
import com.lenovohit.hwe.pay.support.wxpay.protocol.precreate_protocol.PrecreateReqData;
import com.lenovohit.hwe.pay.support.wxpay.protocol.precreate_protocol.PrecreateResData;
import com.lenovohit.hwe.pay.support.wxpay.protocol.refund_protocol.RefundReqData;
import com.lenovohit.hwe.pay.support.wxpay.protocol.refund_protocol.RefundResData;
import com.lenovohit.hwe.pay.support.wxpay.protocol.refund_query_protocol.RefundOrderData;
import com.lenovohit.hwe.pay.support.wxpay.protocol.refund_query_protocol.RefundQueryReqData;
import com.lenovohit.hwe.pay.support.wxpay.protocol.refund_query_protocol.RefundQueryResData;
import com.lenovohit.hwe.pay.support.wxpay.utils.PayCommonUtil;
import com.lenovohit.hwe.pay.utils.PayMerchantConfigCache;

@Service("cwxpayTjsapiPayService")
public class CwxpayTjsapiPayServiceImpl implements PayBaseService {
    private static Log log = LogFactory.getLog(CwxpayTjsapiPayServiceImpl.class);
	
    @Override
	public void prePay(Settlement settlement) {
    	Configuration config = PayMerchantConfigCache.getConfig(settlement.getPayType().getPayMerchant());
    	PrecreateReqData precreateReqData = new PrecreateReqData(
    			settlement.getSettleTitle(),
    			settlement.getAppType(),
    			settlement.getSettleNo(),
    			settlement.getAmt().multiply(new BigDecimal(100)).intValue(),
    			settlement.getTerminalCode(),
    			config.getString("ip"),//Configure.getIP(),
    			DateUtils.date2String(settlement.getCreatedAt(), "yyyyMMddHHmmss"),
    			DateUtils.date2String(DateUtils.addSecond(settlement.getCreatedAt(), config.getInt("trade_out_time"))/*Configure.getTradeOutTime())*/, "yyyyMMddHHmmss"),
    			"",
    			"JSAPI",
    			settlement.getPayerNo(),
    			config.getString("local_domain") + config.getString("pay_callback_url") + settlement.getId(),
    			config);
    	DefaultPrecreateBusinessResultListener resultListener = new DefaultPrecreateBusinessResultListener();
    	PrecreateResData precreateResData = null;
		try {
			WXPay.doPrecreateBusiness(precreateReqData, resultListener);
			precreateResData = resultListener.getPrecreateResData();
			switch (resultListener.getResult()) {
	            case DefaultPrecreateBusinessResultListener.ON_PRECREATE_SUCCESS:
	                settlement.setTradeStatus(Settlement.SETTLE_TRADE_INITIAL);
	                settlement.setTradeTime(DateUtils.getCurrentDate());
	                settlement.setTradeRspCode(precreateResData.getReturn_code());
		    		settlement.setTradeRspMsg(precreateResData.getReturn_msg());
		    		settlement.setRespText(precreateResData.getResponseString());
		    		settlement.getVariables().put("packageData", packageData(precreateResData, config.getString("key")));
		    		log.info("微信公众号支付-统一下单成功: )");
	                break;
	                
	            case DefaultPrecreateBusinessResultListener.ON_FAIL_BY_RETURN_CODE_ERROR:
	            case DefaultPrecreateBusinessResultListener.ON_FAIL_BY_RETURN_CODE_FAIL:
	            case DefaultPrecreateBusinessResultListener.ON_FAIL_BY_SIGN_INVALID:
	            case DefaultPrecreateBusinessResultListener.ON_PRECREATE_FAIL:
	            	settlement.setStatus(Settlement.SETTLE_STAT_CLOSED);
	                settlement.setTradeStatus(Settlement.SETTLE_TRADE_CLOSED);
	                settlement.setTradeTime(DateUtils.getCurrentDate());
	                settlement.setTradeRspCode(precreateResData.getReturn_code());
		    		settlement.setTradeRspMsg(precreateResData.getReturn_msg());
		    		settlement.setRespText(precreateResData.getResponseString());
		    		log.error("微信公众号支付-统一下单失败，交易关闭，错误原因【" + resultListener.getResult() + "】");
	                break;
	        }
		} catch (Exception e) {
			e.printStackTrace();
			settlement.setStatus(Settlement.SETTLE_STAT_CLOSED);
			settlement.setTradeStatus(Settlement.SETTLE_TRADE_EXCEPTIONAL);
			settlement.setTradeTime(DateUtils.getCurrentDate());
        	settlement.setTradeRspCode("40004");
    		settlement.setTradeRspMsg("系统处理错误！");
			log.error("微信公众号支付-统一下单系统异常，预下单状态未知，交易关闭!!!");
		}
	}

	private Object packageData(PrecreateResData precreateResData, String key) {
		SortedMap<String, Object> packageDate = new TreeMap<String, Object>();
		/*WeixinJSBridge.invoke(
	       'getBrandWCPayRequest', {
	           "appId":"wx2421b1c4370ec43b",     //公众号名称，由商户传入     
	           "timeStamp":"1395712654",         //时间戳，自1970年以来的秒数     
	           "nonceStr":"e61463f8efa94090b1f366cccfbbb444", //随机串     
	           "package":"prepay_id=u802345jgfjsdfgsdg888",     
	           "signType":"MD5",         //微信签名方式：     
	           "paySign":"70EA570631E4BB79628FBCA90534C63FF7FADD89" //微信签名 
	       }*/
		packageDate.put("appId", precreateResData.getAppid());
		packageDate.put("timeStamp", String.valueOf(System.currentTimeMillis()).toString().substring(0, 10));
		packageDate.put("nonceStr", PayCommonUtil.CreateNoncestr());
		packageDate.put("package", "prepay_id=" + precreateResData.getPrepay_id());
		// 本来生成的时间戳是13位，但是ios必须是10位，所以截取了一下
		packageDate.put("signType", "MD5");
		String paySign = Signature.getSign(key, packageDate);
		packageDate.put("paySign", paySign);
		
		return packageDate;
	}
    
    @Override
	public void payCallback(Settlement settlement) {
    	try {
    		Configuration config = PayMerchantConfigCache.getConfig(settlement.getPayType().getPayMerchant());
			String responseStr = (String)settlement.getVariables().get("responseStr");
			settlement.setRespText(responseStr);
			
			PayCallbackResData payCallbackResData = (PayCallbackResData) Util.getObjectFromXML(responseStr, PayCallbackResData.class);
			DefaultPayCallbackBusinessResultListener resultListener = new DefaultPayCallbackBusinessResultListener();
			payCallbackResData.setResponseString(responseStr);
			payCallbackResData.setConfigs(config);
			WXPay.doPayCallbackBusiness(payCallbackResData, resultListener);
			
			switch (resultListener.getResult()) {
	            case DefaultPayCallbackBusinessResultListener.ON_PAY_CALLBACK_SUCCESS:
	            	settlement.setStatus(Settlement.SETTLE_STAT_PAY_SUCCESS);
					settlement.setPayerAccount(payCallbackResData.getOpenid());
					settlement.setTradeNo(payCallbackResData.getTransaction_id());
					settlement.setTradeStatus(Settlement.SETTLE_TRADE_SUCCESS);
					settlement.setTradeTime(DateUtils.string2Date(payCallbackResData.getTime_end(), "yyyyMMddHHmmss"));
					settlement.setTradeRspCode(payCallbackResData.getReturn_code());
		    		settlement.setTradeRspMsg(payCallbackResData.getReturn_msg());
		    		settlement.setRespText(payCallbackResData.getResponseString());
		    		log.info("微信公众号支付-支付成功: )");
	                break;
	                
	            case DefaultPayCallbackBusinessResultListener.ON_FAIL_BY_RETURN_CODE_ERROR:
	            case DefaultPayCallbackBusinessResultListener.ON_FAIL_BY_RETURN_CODE_FAIL:
	            case DefaultPayCallbackBusinessResultListener.ON_FAIL_BY_SIGN_INVALID:
	            case DefaultPayCallbackBusinessResultListener.ON_PAY_CALLBACK_FAIL:
	            	settlement.setStatus(Settlement.SETTLE_STAT_PAY_FAILURE);
	                settlement.setTradeStatus(Settlement.SETTLE_TRADE_FAILURE);
	                settlement.setTradeTime(DateUtils.string2Date(payCallbackResData.getTime_end(), "yyyyMMddHHmmss"));
		    		settlement.setRespText(payCallbackResData.getResponseString());
	                log.error("微信公众号支付-支付失败，错误原因【" + resultListener.getResult() + "】");
	                break;
	        }
			
			if(!StringUtils.isBlank(payCallbackResData.getOut_trade_no()) && 
					!StringUtils.equals(payCallbackResData.getOut_trade_no(), settlement.getSettleNo())){
				settlement.setStatus(Settlement.SETTLE_STAT_EXCEPTIONAL);
				settlement.setTradeStatus(Settlement.SETTLE_TRADE_EXCEPTIONAL);
	            settlement.setTradeTime(DateUtils.getCurrentDate());
	        	settlement.setTradeRspCode("40004");
	    		settlement.setTradeRspMsg("inconsistent data between the out_trade_no and settleNo!");
                log.error("inconsistent data between the out_trade_no and settleNo!");
                return;
			}
			if(!StringUtils.isBlank(payCallbackResData.getTotal_fee())){
	    		int total_fee = settlement.getAmt().multiply(new BigDecimal(100)).intValue();
	    		if(total_fee != Integer.valueOf(payCallbackResData.getTotal_fee())){
	    			settlement.setStatus(Settlement.SETTLE_STAT_EXCEPTIONAL);
	    			settlement.setTradeStatus(Settlement.SETTLE_TRADE_EXCEPTIONAL);
	                settlement.setTradeTime(DateUtils.getCurrentDate());
	            	settlement.setTradeRspCode("40004");
	        		settlement.setTradeRspMsg("inconsistent data between the total_amount and amt!！");
	                log.error("inconsistent data between the total_amount and amt!！");
	    		}
	    		
				settlement.setRealAmt(new BigDecimal(payCallbackResData.getTotal_fee()).multiply(new BigDecimal(0.01)));//记录结算单真实发生金额
	    	}
		} catch (Exception e) {
			settlement.setStatus(Settlement.SETTLE_STAT_EXCEPTIONAL);
			settlement.setTradeStatus(Settlement.SETTLE_TRADE_EXCEPTIONAL);
            settlement.setTradeTime(DateUtils.getCurrentDate());
        	settlement.setTradeRspCode("40004");
    		settlement.setTradeRspMsg("系统处理错误！");
            log.error("微信公众号支付-支付回调系统异常，结算单号为【" + settlement.getSettleNo() + "】");
			e.printStackTrace();
		}
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
		    		log.info("微信公众号支付-退款成功: )");
	                break;
	                
	            case DefaultRefundBusinessResultListener.ON_FAIL_BY_RETURN_CODE_ERROR:
	            case DefaultRefundBusinessResultListener.ON_FAIL_BY_RETURN_CODE_FAIL:
	            case DefaultRefundBusinessResultListener.ON_FAIL_BY_SIGN_INVALID:
	            case DefaultRefundBusinessResultListener.ON_REFUND_FAIL:
	            	settlement.setStatus(Settlement.SETTLE_STAT_REFUND_FAILURE);
	                settlement.setTradeStatus(Settlement.SETTLE_TRADE_FAILURE);
		    		settlement.setRespText(refundResData.getResponseString());
		    		log.error("微信公众号支付-退款失败，错误原因【" + resultListener.getResult() + "】");
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
			log.error("微信公众号支付-退款系统异常，交易状态未知!!!");
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
	            	log.info("微信公众号支付-账单查询成功: )");
	            	if(StringUtils.equals(scanPayQueryResData.getTrade_state(), "SUCCESS")){
	            		log.info("微信公众号支付-账单支付成功: )");
	            		settlement.setStatus(Settlement.SETTLE_STAT_PAY_SUCCESS);
	            		settlement.setTradeStatus(Settlement.SETTLE_TRADE_SUCCESS);
						settlement.setPayerAccount(scanPayQueryResData.getOpenid());
						settlement.setTradeNo(scanPayQueryResData.getTransaction_id());
						settlement.setRealAmt(new BigDecimal(scanPayQueryResData.getTotal_fee()).multiply(new BigDecimal(0.01)));//记录结算单真实发生金额
 	            	} else {
 	            		log.info("微信公众号支付-账单支付失败: )");
 	            		settlement.setStatus(Settlement.SETTLE_STAT_PAY_FAILURE);
	            		settlement.setTradeStatus(Settlement.SETTLE_TRADE_FAILURE);
 	            	}
	                settlement.setTradeTime(DateUtils.string2Date(scanPayQueryResData.getTime_end(), "yyyyMMddHHmmss"));
	                settlement.setTradeRspCode(scanPayQueryResData.getReturn_code());
		    		settlement.setTradeRspMsg(scanPayQueryResData.getReturn_msg());
		    		settlement.setRespText(scanPayQueryResData.getResponseString());
	                break;
	                
	            case DefaultRefundQueryBusinessResultListener.ON_REFUND_QUERY_FAIL:
	            	log.info("微信公众号支付-支付查询失败: )");
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
		    		log.error("微信公众号支付-账单查询失败，错误原因【" + resultListener.getResult() + "】");
	                break;
	        }
		} catch (Exception e) {
			log.error("微信公众号支付-账单查询系统异常，交易状态未知!!!");
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
	            	log.info("微信公众号支付-退款查询成功: )");
	            	RefundOrderData refundOrder = null;
	            	if(null != refundQueryResData.getOrderList() && refundQueryResData.getOrderList().size() == 1){
	            		refundOrder = refundQueryResData.getOrderList().get(0);
	            	}
	            	if(refundOrder!=null && StringUtils.equals("SUCCESS", refundOrder.getRefundStatus())){
	            		log.info("微信公众号支付-退款成功: )");
	            		settlement.setStatus(Settlement.SETTLE_STAT_REFUND_SUCCESS);
	            		settlement.setTradeStatus(Settlement.SETTLE_TRADE_SUCCESS);
						settlement.setTradeNo(refundOrder.getRefundID());
	            		settlement.setRealAmt(new BigDecimal(refundOrder.getRefundFee()).multiply(new BigDecimal(0.01)));//记录结算单真实发生金额
	            	} else if(refundOrder!=null && StringUtils.equals("PROCESSING", refundOrder.getRefundStatus())){
	            		log.info("微信公众号支付-退款中 ....");
	            		settlement.setStatus(Settlement.SETTLE_STAT_REFUNDING);
	            		settlement.setTradeStatus(Settlement.SETTLE_TRADE_SUCCESS);
	            	} else if(refundOrder!=null && StringUtils.equals("CHANGE", refundOrder.getRefundStatus())){
	            		log.info("微信公众号支付-退款异常");
	            		settlement.setStatus(Settlement.SETTLE_STAT_EXCEPTIONAL);
	            		settlement.setTradeStatus(Settlement.SETTLE_TRADE_EXCEPTIONAL);
	            	} else {
	            		log.info("微信公众号支付-退款失败");
	            		settlement.setStatus(Settlement.SETTLE_STAT_REFUND_FAILURE);
	            		settlement.setTradeStatus(Settlement.SETTLE_TRADE_FAILURE);
	            	}
	                settlement.setTradeTime(DateUtils.getCurrentDate());
	                settlement.setTradeRspCode(refundQueryResData.getReturn_code());
		    		settlement.setTradeRspMsg(refundQueryResData.getReturn_msg());
		    		settlement.setRespText(refundQueryResData.getResponseString());
	                break;
	            case DefaultRefundQueryBusinessResultListener.ON_REFUND_QUERY_FAIL:
	            	log.info("微信公众号支付-退款查询失败: )");
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
		    		log.error("微信公众号支付-退款查询失败，错误原因【" + resultListener.getResult() + "】");
	                break;
	        }
		} catch (Exception e) {
			log.error("微信公众号支付-退款查询系统异常，交易状态未知!!!");
			e.printStackTrace();
		}
	}
	
}
