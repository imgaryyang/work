package com.lenovohit.hwe.pay.service.impl;

import java.math.BigDecimal;
import java.net.URLDecoder;
import java.util.Map;
import java.util.TreeMap;

import org.apache.commons.configuration.Configuration;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.stereotype.Service;

import com.alipay.api.AlipayResponse;
import com.alipay.api.domain.AlipayTradeCreateModel;
import com.alipay.api.internal.util.AlipaySignature;
import com.alipay.api.response.AlipayTradeCreateResponse;
import com.alipay.api.response.AlipayTradeFastpayRefundQueryResponse;
import com.alipay.api.response.AlipayTradeQueryResponse;
import com.alipay.api.response.AlipayTradeRefundResponse;
import com.lenovohit.core.utils.DateUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.hwe.pay.model.Settlement;
import com.lenovohit.hwe.pay.service.PayBaseService;
import com.lenovohit.hwe.pay.support.alipay.app.config.Constants;
import com.lenovohit.hwe.pay.support.alipay.fwc.service.CreateBusiness;
import com.lenovohit.hwe.pay.support.alipay.scan.Alipay;
import com.lenovohit.hwe.pay.support.alipay.scan.model.builder.AlipayTradeQueryRequestBuilder;
import com.lenovohit.hwe.pay.support.alipay.scan.model.builder.AlipayTradeRefundQueryRequestBuilder;
import com.lenovohit.hwe.pay.support.alipay.scan.model.builder.AlipayTradeRefundRequestBuilder;
import com.lenovohit.hwe.pay.support.alipay.scan.model.result.AlipayF2FQueryResult;
import com.lenovohit.hwe.pay.support.alipay.scan.model.result.AlipayF2FRefundQueryResult;
import com.lenovohit.hwe.pay.support.alipay.scan.model.result.AlipayF2FRefundResult;
import com.lenovohit.hwe.pay.utils.PayMerchantConfigCache;

@Service("calipayTfwcPayService")
public class CalipayTfwcPayServiceImpl implements PayBaseService {
    private static Log                  log = LogFactory.getLog(CalipayTfwcPayServiceImpl.class);
    private static String PAY_SUCCESS_RET = "success";
    @Override
	public void prePay(Settlement settlement) {
		try {
			Configuration config = PayMerchantConfigCache.getConfig(settlement.getPayType().getPayMerchant());
			
			AlipayTradeCreateModel model = new AlipayTradeCreateModel();
			model.setOutTradeNo(settlement.getSettleNo());
			model.setTotalAmount(settlement.getAmt().toString());
			model.setSubject(settlement.getSettleTitle());
			model.setBuyerId(settlement.getPayerNo());;
			model.setTimeoutExpress(config.getString("trade_out_time"));
			
			AlipayTradeCreateResponse response = new CreateBusiness(config).create(model,
					config.getString("local_domain") + config.getString("pay_callback_url") + settlement.getId());
			if (response != null && response.isSuccess()) {
                settlement.setTradeStatus(Settlement.SETTLE_TRADE_INITIAL);
                settlement.setTradeTime(DateUtils.getCurrentDate());
                settlement.setTradeRspCode(response.getCode());
	    		settlement.setTradeRspMsg(response.getMsg());
	    		settlement.setRespText(response.getBody());
	    		settlement.getVariables().put("tradeNo", response.getTradeNo());
	    		log.info("支付宝服务窗支付下单成功: )");
	        } else if (tradeError(response)) {
	        	settlement.setStatus(Settlement.SETTLE_STAT_CLOSED);
                settlement.setTradeStatus(Settlement.SETTLE_TRADE_EXCEPTIONAL);
                settlement.setTradeTime(DateUtils.getCurrentDate());
                settlement.setTradeRspCode(response.getCode());
	    		settlement.setTradeRspMsg(response.getMsg());
	    		settlement.setRespText(response.getBody());
                log.error("支付宝服务窗下单系统异常，预下单状态未知，交易关闭!!!");
	        } else {
	        	settlement.setStatus(Settlement.SETTLE_STAT_CLOSED);
                settlement.setTradeStatus(Settlement.SETTLE_TRADE_CLOSED);
                settlement.setTradeTime(DateUtils.getCurrentDate());
                settlement.setTradeRspCode(response.getCode());
	    		settlement.setTradeRspMsg(response.getMsg());
	    		settlement.setRespText(response.getBody());
                log.error("支付宝服务窗支付下单失败!!!");
	        }
		} catch (Exception e) {
			settlement.setStatus(Settlement.SETTLE_STAT_CLOSED);
			settlement.setTradeStatus(Settlement.SETTLE_TRADE_EXCEPTIONAL);
			settlement.setTradeTime(DateUtils.getCurrentDate());
        	settlement.setTradeRspCode("40004");
    		settlement.setTradeRspMsg("系统处理错误！");
			log.error("支付宝服务窗支付-统一下单系统异常，预下单状态未知，交易关闭!!!");
			e.printStackTrace();
		}
	}
    
    @Override
	public void payCallback(Settlement settlement) {

		try {
			Configuration config = PayMerchantConfigCache.getConfig(settlement.getPayType().getPayMerchant());
			
			String responseStr = URLDecoder.decode((String) settlement.getVariables().get("responseStr"), "utf-8");
			settlement.setRespText(responseStr);
			settlement.getVariables().put("_resultStr", PAY_SUCCESS_RET);
			Map<String,String> pm = parseUrlToMap(responseStr);
			boolean checkSign = AlipaySignature.rsaCheckV1(pm, config.getString("alipay_public_key")/*Configs.getAlipayPublicKey()*/, "utf-8", config.getString("sign_type")/*Configs.getSignType()*/); //调用SDK验证签名
			if(!checkSign){
				settlement.setStatus(Settlement.SETTLE_STAT_EXCEPTIONAL);
				settlement.setTradeStatus(Settlement.SETTLE_TRADE_EXCEPTIONAL);
	            settlement.setTradeTime(DateUtils.getCurrentDate());
	        	settlement.setTradeRspCode("20001");
	    		settlement.setTradeRspMsg("验签出错!");
                log.error("sign check fail: check Sign and Data Fail!");
                return;
			}

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
				settlement.setTradeRspCode(pm.get("trade_status"));
				settlement.setTradeRspCode("交易关闭");
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
            log.error("支付宝支付回调系统异常，结算单号为【" + settlement.getSettleNo() + "】");
			e.printStackTrace();
		}
    }
    
    @Override
   	public void refund(Settlement settlement) {
       	Configuration config = PayMerchantConfigCache.getConfig(settlement.getPayType().getPayMerchant());
   		AlipayTradeRefundRequestBuilder builder = new AlipayTradeRefundRequestBuilder()
   				.setTradeNo(settlement.getOriTradeNo()).setOutRequestNo(settlement.getSettleNo())
   				.setRefundAmount(settlement.getAmt().toString()).setRefundReason(settlement.getSettleDesc())
   				.setTerminalId(settlement.getTerminalCode()).setOperatorId(settlement.getTerminalUser())
   				.setConfigs(config);

   		AlipayF2FRefundResult result = Alipay.tradeRefund(builder);
   		AlipayTradeRefundResponse response = result.getResponse();
   		switch (result.getTradeStatus()) {
   	    	case SUCCESS:
   	             settlement.setStatus(Settlement.SETTLE_STAT_REFUND_SUCCESS);
   	             settlement.setTradeStatus(Settlement.SETTLE_TRADE_SUCCESS);
   	             settlement.setTradeNo(response.getTradeNo());
   	             settlement.setTradeTime(response.getGmtRefundPay());
   	             settlement.setTradeRspCode(response.getCode());
   	             settlement.setTradeRspMsg(response.getMsg());
   	             settlement.setRespText(response.getBody());
   	             log.info("支付宝退款成功: )");
   	             break;
   	
   	         case FAILED:
   	             settlement.setStatus(Settlement.SETTLE_STAT_REFUND_FAILURE);
   	             settlement.setTradeStatus(Settlement.SETTLE_TRADE_FAILURE);
   	             settlement.setTradeTime(response.getGmtRefundPay());
   	             settlement.setTradeRspCode(response.getCode());
   	             settlement.setTradeRspMsg(response.getMsg());
   	             settlement.setRespText(response.getBody());
   	             log.error("支付宝退款失败!!!");
   	             break;
   	
   	         case UNKNOWN:
   	         	 settlement.setStatus(Settlement.SETTLE_STAT_EXCEPTIONAL);
   	             settlement.setTradeStatus(Settlement.SETTLE_TRADE_EXCEPTIONAL);
   	             settlement.setTradeTime(response.getGmtRefundPay());
   	             settlement.setTradeRspCode(response.getCode());
   	             settlement.setTradeRspMsg(response.getMsg());
   	             settlement.setRespText(response.getBody());
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
   	
   	    AlipayF2FQueryResult result = Alipay.queryTradeResult(builder);
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
   	
   		AlipayF2FRefundQueryResult result = Alipay.tradeRefundQueryResult(builder);
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
	 // 交易异常，或发生系统错误
    protected boolean tradeError(AlipayResponse response) {
        return response == null ||
                Constants.ERROR.equals(response.getCode());
    }
    private Map<String, String> parseUrlToMap(String str){
    	Map<String, String> tm = new TreeMap<String, String>();
    	String[] ss = str.split("\\&");
		for (String s : ss) {
			String[] subs = s.split("\\=", 2);
			tm.put(subs[0], subs[1]);
		}
		
    	return tm;
    }
}
