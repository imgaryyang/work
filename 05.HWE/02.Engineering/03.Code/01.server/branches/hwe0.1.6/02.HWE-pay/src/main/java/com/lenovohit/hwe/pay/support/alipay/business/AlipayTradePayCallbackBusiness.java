package com.lenovohit.hwe.pay.support.alipay.business;

import java.util.Map;
import java.util.TreeMap;

import org.apache.commons.configuration.Configuration;

import com.alipay.api.AlipayApiException;
import com.alipay.api.internal.util.AlipaySignature;
import com.lenovohit.hwe.pay.support.alipay.model.TradeStatus;
import com.lenovohit.hwe.pay.support.alipay.model.builder.AlipayTradePayCallbackRequestBuilder;
import com.lenovohit.hwe.pay.support.alipay.model.response.AlipayTradePayCallbackResponse;
import com.lenovohit.hwe.pay.support.alipay.model.result.AlipayTradePayCallbackResult;

/**
 * Created by liuyangkly on 15/7/31.
 */
public class AlipayTradePayCallbackBusiness extends AbsAlipayTradeBusiness {

	public AlipayTradePayCallbackBusiness(Configuration configs) {
		super(configs);
	}
	
    public AlipayTradePayCallbackResult run(AlipayTradePayCallbackRequestBuilder builder) {
    	validateBuilder(builder);
    	Configuration config = builder.getConfigs();
    	Map<String, String> pm = parseUrlToMap(builder.getResponseStr());
        AlipayTradePayCallbackResponse response = new AlipayTradePayCallbackResponse();
        response.setResponseStr(builder.getResponseStr());
        response.setResponseMap(pm);
        
        AlipayTradePayCallbackResult result = new AlipayTradePayCallbackResult(response);
        result.setTradeStatus(TradeStatus.SUCCESS);
        try {
        	//调用SDK验证签名
			boolean checkSign = AlipaySignature.rsaCheckV1(pm, config.getString("alipay_public_key")/*Configs.getAlipayPublicKey()*/, "utf-8", config.getString("sign_type")/*Configs.getSignType()*/);
			if(!checkSign){
				pm.put("code", "20001");
				pm.put("msg", "验签出错!");
				result.setTradeStatus(TradeStatus.UNKNOWN);
			}
        } catch (AlipayApiException e) {
        	log.error("AlipayTradePayCallbackBusiness valid sign error", e);
			e.printStackTrace();
		} 
        
        return result;
    }
    
    protected Map<String, String> parseUrlToMap(String str){
    	Map<String, String> tm = new TreeMap<String, String>();
    	String[] ss = str.split("\\&");
		for (String s : ss) {
			String[] subs = s.split("\\=", 2);
			tm.put(subs[0], subs[1]);
		}
		
    	return tm;
    }
}
