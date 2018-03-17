package com.lenovohit.hwe.pay.support.alipay.fwc.service;

import org.apache.commons.configuration.Configuration;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.alipay.api.AlipayRequest;
import com.alipay.api.domain.AlipayTradeCreateModel;
import com.alipay.api.request.AlipayTradeCreateRequest;
import com.alipay.api.response.AlipayTradeCreateResponse;
import com.lenovohit.hwe.pay.support.alipay.service.AlipayTradeBaseService;


/**    
 *         
 * 商户通过该接口进行交易的创建下单
 *@author GW
 *@date 2018年1月25日          
 *     
 */
public class CreateBusiness extends AlipayTradeBaseService{
    protected Log log = LogFactory.getLog(getClass());

	public CreateBusiness(Configuration configs) {
		super(configs);
	}

	@Override
	@SuppressWarnings("rawtypes")
	public boolean validate(AlipayRequest request) {
		return true;
	}

    /**    
     * 功能描述：发送预支付信息获取支付宝相应数据和状态
     *@param precreateReqData
     *@throws Exception       
     *@author GW
     *@date 2018年1月25日             
    */
    public AlipayTradeCreateResponse create(AlipayTradeCreateModel model, String notifyUrl){
    	// 实例化具体API对应的request类,类名称和接口名称对应,当前调用接口名称：alipay.trade.create
		AlipayTradeCreateRequest request = new AlipayTradeCreateRequest();
		// SDK已经封装掉了公共参数，这里只需要传入业务参数。以下方法为sdk的model入参方式(model和biz_content同时存在的情况下取biz_content)。
		request.setBizModel(model);
		request.setNotifyUrl(notifyUrl);
    	
    	return (AlipayTradeCreateResponse) this.getResponse(client, request);
    }

}
