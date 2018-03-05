package com.lenovohit.hwe.pay.support.alipay.app.business;

import org.slf4j.LoggerFactory;

import com.alipay.api.AlipayClient;
import com.alipay.api.DefaultAlipayClient;
import com.alipay.api.domain.AlipayTradeAppPayModel;
import com.alipay.api.request.AlipayTradeAppPayRequest;
import com.alipay.api.response.AlipayTradeAppPayResponse;
import com.lenovohit.hwe.pay.support.alipay.app.model.PrePayData;
import com.lenovohit.hwe.pay.support.wxpay.scan.common.Log;


/**    
 *         
 * 类描述：支付宝交易统一入口    
 *@author GW
 *@date 2018年1月25日          
 *     
 */
public class PrecreateBusiness {

    private static Log log = new Log(LoggerFactory.getLogger(PrecreateBusiness.class));

    /**    
     * 功能描述：发送预支付信息获取支付宝相应数据和状态
     *@param precreateReqData
     *@throws Exception       
     *@author GW
     *@date 2018年1月25日             
    */
    public AlipayTradeAppPayResponse run(PrePayData prePayData,AlipayTradeAppPayModel model){
    	AlipayTradeAppPayResponse response = null;
    	try{
    		// 实例化Client
			AlipayClient alipayClient = new DefaultAlipayClient(prePayData.getAliUrl(), prePayData.getAppId(), prePayData.getAppPrivateKey(), "json",
					prePayData.getCharset(), prePayData.getAlipayPublicKey(), prePayData.getEncryptType());
			// 实例化具体API对应的request类,类名称和接口名称对应,当前调用接口名称：alipay.trade.app.pay
			AlipayTradeAppPayRequest request = new AlipayTradeAppPayRequest();
			// SDK已经封装掉了公共参数，这里只需要传入业务参数。以下方法为sdk的model入参方式(model和biz_content同时存在的情况下取biz_content)。
			request.setBizModel(model);
			request.setNotifyUrl(prePayData.getNotifyUr());
			
			log.i("trade.appPay request:" + request.getBizContent());
			response = alipayClient.sdkExecute(request);
			log.i("trade.appPay response:" + response.getBody());
			//TODO 验签不做了。
		} catch(Exception e){
			e.printStackTrace();
		}
    	
    	return response;
    }

}
