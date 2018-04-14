package com.lenovohit.hwe.pay.service.impl;

import java.math.BigDecimal;
import java.net.URLDecoder;
import java.util.Map;

import org.apache.commons.configuration.Configuration;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Service;

import com.alipay.api.response.AlipayTradeFastpayRefundQueryResponse;
import com.alipay.api.response.AlipayTradePrecreateResponse;
import com.alipay.api.response.AlipayTradeQueryResponse;
import com.alipay.api.response.AlipayTradeRefundResponse;
import com.lenovohit.core.utils.DateUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.hwe.pay.model.Settlement;
import com.lenovohit.hwe.pay.service.PayBaseService;
import com.lenovohit.hwe.pay.support.alipay.Alipay;
import com.lenovohit.hwe.pay.support.alipay.model.builder.AlipayTradePayCallbackRequestBuilder;
import com.lenovohit.hwe.pay.support.alipay.model.builder.AlipayTradePrecreateRequestBuilder;
import com.lenovohit.hwe.pay.support.alipay.model.builder.AlipayTradeQueryRequestBuilder;
import com.lenovohit.hwe.pay.support.alipay.model.builder.AlipayTradeRefundQueryRequestBuilder;
import com.lenovohit.hwe.pay.support.alipay.model.builder.AlipayTradeRefundRequestBuilder;
import com.lenovohit.hwe.pay.support.alipay.model.response.AlipayTradePayCallbackResponse;
import com.lenovohit.hwe.pay.support.alipay.model.result.AlipayTradePayCallbackResult;
import com.lenovohit.hwe.pay.support.alipay.model.result.AlipayTradePrecreateResult;
import com.lenovohit.hwe.pay.support.alipay.model.result.AlipayTradeQueryResult;
import com.lenovohit.hwe.pay.support.alipay.model.result.AlipayTradeRefundQueryResult;
import com.lenovohit.hwe.pay.support.alipay.model.result.AlipayTradeRefundResult;
import com.lenovohit.hwe.pay.utils.PayMerchantConfigCache;
@Service("calipayTscanPayService")
public class CalipayTscanPayServiceImpl implements PayBaseService {
    private static Log log = LogFactory.getLog(CalipayTscanPayServiceImpl.class);
   
    @Override
	public void prePay(Settlement settlement) {
    	Configuration config = PayMerchantConfigCache.getConfig(settlement.getPayType().getPayMerchant());
        // 创建扫码支付请求builder，设置请求参数
        AlipayTradePrecreateRequestBuilder builder = new AlipayTradePrecreateRequestBuilder()
            .setSubject(settlement.getSettleTitle()).setOutTradeNo(settlement.getSettleNo())
            .setTotalAmount(settlement.getAmt().toString()).setUndiscountableAmount("0.0")
            .setTimeoutExpress(config.getString("trade_out_time")/*Configs.getTradeOutTime()*/)
            .setSellerId("").setBody(settlement.getSettleDesc())
            .setTerminalId(settlement.getTerminalCode()).setOperatorId(settlement.getTerminalUser())
			.setNotifyUrl(config.getString("local_domain") + config.getString("pay_callback_url") /*Configs.getLocalDomain() + Configs.getPayCallbackUrl() */+ settlement.getId())//支付宝服务器主动通知商户服务器里指定的页面http路径,根据需要设置
        	.setConfigs(config);
        AlipayTradePrecreateResult result = Alipay.tradePrecreate(builder);
        AlipayTradePrecreateResponse response = result.getResponse();
        switch (result.getTradeStatus()) {
            case SUCCESS:
                settlement.setQrCode(response.getQrCode());
                settlement.setTradeStatus(Settlement.SETTLE_TRADE_INITIAL);
                settlement.setTradeTime(DateUtils.getCurrentDate());
                settlement.setTradeRspCode(response.getCode());
	    		settlement.setTradeRspMsg(response.getMsg());
	    		settlement.setRespText(response.getBody());
	    		log.info("支付宝扫码预下单成功: )");
                break;
                
            case FAILED:
            	settlement.setStatus(Settlement.SETTLE_STAT_CLOSED);
                settlement.setTradeStatus(Settlement.SETTLE_TRADE_CLOSED);
                settlement.setTradeTime(DateUtils.getCurrentDate());
                settlement.setTradeRspCode(response.getCode());
	    		settlement.setTradeRspMsg(response.getMsg());
	    		settlement.setRespText(response.getBody());
                log.error("支付宝扫码预下单失败!!!");
                break;
                
            case UNKNOWN:
            	settlement.setStatus(Settlement.SETTLE_STAT_CLOSED);
                settlement.setTradeStatus(Settlement.SETTLE_TRADE_EXCEPTIONAL);
                settlement.setTradeTime(DateUtils.getCurrentDate());
                settlement.setTradeRspCode(response.getCode());
	    		settlement.setTradeRspMsg(response.getMsg());
	    		settlement.setRespText(response.getBody());
                log.error("支付宝扫码预下单系统异常，预下单状态未知，交易关闭!!!");
                break;
        }
    }
    
    @Override
	public void payCallback(Settlement settlement) {
		try {
			Configuration config = PayMerchantConfigCache.getConfig(settlement.getPayType().getPayMerchant());
			String responseStr = URLDecoder.decode((String) settlement.getVariables().get("responseStr"), "utf-8");
			settlement.setRespText(responseStr);
			 
			// 创建支付成功请求builder，设置请求参数
			AlipayTradePayCallbackRequestBuilder builder = new AlipayTradePayCallbackRequestBuilder()
				.setResponseStr(responseStr)//支付宝异步通知数据
	        	.setConfigs(config);
	        AlipayTradePayCallbackResult result = Alipay.tradePayCallback(builder);
	        AlipayTradePayCallbackResponse response = result.getResponse();
	        Map<String, String> pm = response.getResponseMap();
	        switch (result.getTradeStatus()) {
            case SUCCESS:
            	if("TRADE_SUCCESS".equals(pm.get("trade_status"))){
    				settlement.setStatus(Settlement.SETTLE_STAT_PAY_SUCCESS);
    				settlement.setPayerAccount(pm.get("buyer_id"));
    				settlement.setPayerLogin(pm.get("buyer_logon_id"));
    				settlement.setTradeNo(pm.get("trade_no"));
    				settlement.setTradeTime(DateUtils.string2Date(pm.get("gmt_payment"), DateUtils.DATE_PATTERN_DASH_YYYYMMDD_HHMMSS));
    				settlement.setTradeStatus(Settlement.SETTLE_TRADE_SUCCESS);
    				settlement.setTradeRspCode(pm.get("trade_status"));
    				settlement.setTradeRspCode("支付成功");
    			} else if("TRADE_FINISHED".equals(pm.get("trade_status"))) {
    				settlement.setStatus(Settlement.SETTLE_STAT_PAY_FINISH);
    				settlement.setPayerAccount(pm.get("buyer_id"));
    				settlement.setPayerLogin(pm.get("buyer_logon_id"));
    				settlement.setTradeNo(pm.get("trade_no"));
    				settlement.setTradeTime(DateUtils.string2Date(pm.get("gmt_payment"), DateUtils.DATE_PATTERN_DASH_YYYYMMDD_HHMMSS));
    				settlement.setTradeStatus(Settlement.SETTLE_TRADE_SUCCESS);
    				settlement.setTradeRspCode(pm.get("trade_status"));
    				settlement.setTradeRspCode("交易完成");
    			}else if("WAIT_BUYER_PAY".equals(pm.get("trade_status"))) {
    			}else if("TRADE_CLOSED".equals(pm.get("trade_status"))) {
    				settlement.setStatus(Settlement.SETTLE_STAT_CLOSED);
    				settlement.setTradeStatus(Settlement.SETTLE_TRADE_CLOSED);
    				settlement.setTradeTime(DateUtils.getCurrentDate());
    				settlement.setTradeRspCode(pm.get("trade_status"));
    				settlement.setTradeRspCode("交易关闭");
    			}
                log.info("支付宝支付异步通知处理成功，交易状态为：" + pm.get("trade_status"));
                break;

            case FAILED:
                break;
                
            case UNKNOWN:
            	settlement.setStatus(Settlement.SETTLE_STAT_CLOSED);
                settlement.setTradeStatus(Settlement.SETTLE_TRADE_EXCEPTIONAL);
                settlement.setTradeTime(DateUtils.getCurrentDate());
                settlement.setTradeRspCode(pm.get("code"));
	    		settlement.setTradeRspMsg(pm.get("msg"));
	    		settlement.setRespText(response.getBody());
                log.error("支付宝支付异步通知系统异常，预下单状态未知，交易关闭!!!");
                break;
	        }

			
			if(!StringUtils.isBlank(pm.get("out_trade_no")) && 
					!StringUtils.equals(pm.get("out_trade_no"), settlement.getSettleNo())){
				settlement.setStatus(Settlement.SETTLE_STAT_EXCEPTIONAL);
				settlement.setTradeStatus(Settlement.SETTLE_TRADE_EXCEPTIONAL);
	            settlement.setTradeTime(DateUtils.getCurrentDate());
	        	settlement.setTradeRspCode("40004");
	    		settlement.setTradeRspMsg("inconsistent data between the out_trade_no and settleNo!");
                log.error("inconsistent data between the out_trade_no and settleNo!");
                return;
			}
			if(!StringUtils.isBlank(pm.get("total_amount"))){
				BigDecimal total_amount = new BigDecimal(pm.get("total_amount"));
	    		if(settlement.getAmt().compareTo(total_amount) != 0){
	    			settlement.setStatus(Settlement.SETTLE_STAT_EXCEPTIONAL);
					settlement.setTradeStatus(Settlement.SETTLE_TRADE_EXCEPTIONAL);
		            settlement.setTradeTime(DateUtils.getCurrentDate());
		        	settlement.setTradeRspCode("40004");
		    		settlement.setTradeRspMsg("inconsistent data between the total_amount and amt!！");
	                log.error("inconsistent data between the total_amount and amt!");
	                return;
	    		}
	    		settlement.setRealAmt(total_amount);//记录结算单真实发生金额
			}
		} catch (Exception e) {
			settlement.setStatus(Settlement.SETTLE_STAT_EXCEPTIONAL);
			settlement.setTradeStatus(Settlement.SETTLE_TRADE_EXCEPTIONAL);
            settlement.setTradeTime(DateUtils.getCurrentDate());
        	settlement.setTradeRspCode("40004");
    		settlement.setTradeRspMsg("系统处理错误！");
            log.error("支付宝扫码支付回调系统异常，结算单号为【" + settlement.getSettleNo() + "】");
			e.printStackTrace();
		}
    }
    
    @Override
	public void refund(Settlement settlement) {
    	Configuration config = PayMerchantConfigCache.getConfig(settlement.getPayType().getPayMerchant());
		AlipayTradeRefundRequestBuilder builder = new AlipayTradeRefundRequestBuilder()
				.setTradeNo(settlement.getOriTradeNo()).setOutRequestNo(settlement.getSettleNo())
				.setRefundAmount(settlement.getAmt().toString()).setRefundReason(settlement.getSettleTitle())
				.setTerminalId(settlement.getTerminalCode()).setOperatorId(settlement.getTerminalUser())
				.setConfigs(config);

		AlipayTradeRefundResult result = Alipay.tradeRefund(builder);
		AlipayTradeRefundResponse response = result.getResponse();
		switch (result.getTradeStatus()) {
	    	case SUCCESS:
	             settlement.setStatus(Settlement.SETTLE_STAT_REFUND_SUCCESS);
	             settlement.setTradeStatus(Settlement.SETTLE_TRADE_SUCCESS);
	             settlement.setPayerAccount(response.getBuyerUserId());
	             settlement.setTradeNo(response.getTradeNo());
	             settlement.setTradeTime(response.getGmtRefundPay());
	             settlement.setTradeRspCode(response.getCode());
	             settlement.setTradeRspMsg(response.getMsg());
	             settlement.setRespText(response.getBody());
	             log.info("支付宝扫码退款成功: )");
	             break;
	
	         case FAILED:
	             settlement.setStatus(Settlement.SETTLE_STAT_REFUND_FAILURE);
	             settlement.setTradeStatus(Settlement.SETTLE_TRADE_FAILURE);
	             settlement.setTradeTime(response.getGmtRefundPay());
	             settlement.setTradeRspCode(response.getCode());
	             settlement.setTradeRspMsg(response.getMsg());
	             settlement.setRespText(response.getBody());
	             log.error("支付宝扫码退款失败!!!");
	             break;
	
	         case UNKNOWN:
	         	 settlement.setStatus(Settlement.SETTLE_STAT_EXCEPTIONAL);
	             settlement.setTradeStatus(Settlement.SETTLE_TRADE_EXCEPTIONAL);
	             if(response != null){
	            	 settlement.setTradeTime(response.getGmtRefundPay());
	            	 settlement.setTradeRspCode(response.getCode());
	            	 settlement.setTradeRspMsg(response.getMsg());
	            	 settlement.setRespText(response.getBody());
	             }
	             log.error("系统异常，订单退款状态未知!!!");
	             break;
		 }
		// TODO 此处没有校验流水和金额
	}

	@Override
	public void query(Settlement settlement) {
		Configuration config = PayMerchantConfigCache.getConfig(settlement.getPayType().getPayMerchant());
	    AlipayTradeQueryRequestBuilder builder = new AlipayTradeQueryRequestBuilder()
	    		.setOutTradeNo(settlement.getSettleNo())
	    		.setConfigs(config);
	
	    AlipayTradeQueryResult result = Alipay.queryTradeResult(builder);
	    AlipayTradeQueryResponse response = result.getResponse();
	    switch (result.getTradeStatus()) {
	        case SUCCESS:
	            settlement.setStatus(Settlement.SETTLE_STAT_PAY_SUCCESS);
	            settlement.setTradeStatus(Settlement.SETTLE_TRADE_SUCCESS);
	            settlement.setTradeTime(DateUtils.getCurrentDate());
	    		settlement.setTradeNo(response.getTradeNo());
	    		settlement.setTradeRspCode(response.getCode());
	    		settlement.setTradeRspMsg(response.getMsg());
	    		settlement.setPayerAccount(response.getBuyerUserId());
	    		settlement.setPayerLogin(response.getBuyerLogonId());
	    		settlement.setRealAmt(new BigDecimal(response.getTotalAmount()));
	    		settlement.setRespText(response.getBody());
	            log.info("查询返回该订单支付成功!!!");
	            break;
	        case FAILED:
	            settlement.setStatus(Settlement.SETTLE_STAT_PAY_FAILURE);
	            settlement.setTradeStatus(Settlement.SETTLE_TRADE_FAILURE);
	            settlement.setTradeTime(DateUtils.getCurrentDate());
	    		settlement.setTradeNo(response.getTradeNo());
	    		settlement.setTradeRspCode(response.getCode());
	    		settlement.setTradeRspMsg(response.getMsg());
	    		settlement.setPayerAccount(response.getBuyerLogonId());
	    		settlement.setPayerLogin(response.getBuyerLogonId());
	    		settlement.setRealAmt(new BigDecimal(response.getTotalAmount()));
	    		settlement.setRespText(response.getBody());
	            log.error("查询返回该订单支付失败或被关闭!!!");
	            break;
	        case UNKNOWN://不做Settlement状态更新。
	    		log.error("系统异常，订单支付状态未知!!!");
	            break;
	    }
	}

	@Override
	public void refundQuery(Settlement settlement) {
		Configuration config = PayMerchantConfigCache.getConfig(settlement.getPayType().getPayMerchant());
		AlipayTradeRefundQueryRequestBuilder builder = new AlipayTradeRefundQueryRequestBuilder()
	    		.setTradeNo(settlement.getOriTradeNo())
	    		.setOutRequestNo(settlement.getSettleNo())
	    		.setConfigs(config);
	
		AlipayTradeRefundQueryResult result = Alipay.tradeRefundQueryResult(builder);
		AlipayTradeFastpayRefundQueryResponse response = result.getResponse();
	    switch (result.getTradeStatus()) {
	        case SUCCESS:
	            settlement.setStatus(Settlement.SETTLE_STAT_REFUND_SUCCESS);
	            settlement.setTradeStatus(Settlement.SETTLE_TRADE_SUCCESS);
	            settlement.setTradeNo(response.getTradeNo());
	            settlement.setTradeTime(DateUtils.getCurrentDate());
	    		settlement.setTradeRspCode(response.getCode());
	    		settlement.setTradeRspMsg(response.getMsg());
	    		settlement.setRespText(response.getBody());
	            log.info("查询返回该订单退款成功!!!");
	            break;
	        case FAILED:
	            settlement.setStatus(Settlement.SETTLE_STAT_REFUND_FAILURE);
	            settlement.setTradeStatus(Settlement.SETTLE_TRADE_FAILURE);
	            settlement.setTradeTime(DateUtils.getCurrentDate());
	    		settlement.setTradeNo(response.getTradeNo());
	    		settlement.setTradeRspCode(response.getCode());
	    		settlement.setTradeRspMsg(response.getMsg());
	    		settlement.setRespText(response.getBody());
	            log.error("查询返回该订单退款失败或被关闭!!!");
	            break;
	        case UNKNOWN://不做Settlement状态更新。
	    		log.error("系统异常，订单退款状态未知!!!");
	            break;
	    }
	}

}
