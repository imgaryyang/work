package com.lenovohit.hwe.pay.support.alipay.service;

import org.apache.commons.configuration.Configuration;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.alipay.api.AlipayApiException;
import com.alipay.api.AlipayClient;
import com.alipay.api.AlipayRequest;
import com.alipay.api.AlipayResponse;
import com.alipay.api.DefaultAlipayClient;

/**
 * Created by liuyangkly on 15/7/31.
 */
public abstract class AlipayTradeBaseService {
    protected Log log = LogFactory.getLog(getClass());

	protected AlipayClient client;


    public AlipayTradeBaseService(Configuration configs){
    	client = new DefaultAlipayClient(
    			configs.getString("open_api_domain"), 
    			configs.getString("appid"), 
    			configs.getString("private_key"), 
    			"json",
				"utf-8", 
    			configs.getString("alipay_public_key"), 
    			configs.getString("sign_type"));
    }

    //校验
    @SuppressWarnings("rawtypes")
	public abstract boolean validate(AlipayRequest request);
    
    /**
     * 获取Response
     * <p>Title: getResponse</p> 
     * <p>Description: </p>
     * @param client
     * @param request
     * @return
     */
    @SuppressWarnings({ "unchecked", "rawtypes" })
	protected AlipayResponse getResponse(AlipayClient client, AlipayRequest request) {
        try {
        	if( validate(request) ){
        		
        	}
            AlipayResponse response = client.execute(request);
            if (response != null) {
                log.info(response.getBody());
            }
            return response;
        } catch (AlipayApiException e) {
        	log.error("AbsAlipayService  getResponse Exception", e);
            e.printStackTrace();
            return null;
        }
    }
    
    
   
}
