package com.lenovohit.hwe.pay.support.alipay;

import com.lenovohit.hwe.pay.support.alipay.business.AlipayTradeAppPayBusiness;
import com.lenovohit.hwe.pay.support.alipay.business.AlipayTradeCreateBusiness;
import com.lenovohit.hwe.pay.support.alipay.business.AlipayTradeDownloadBusiness;
import com.lenovohit.hwe.pay.support.alipay.business.AlipayTradePayCallbackBusiness;
import com.lenovohit.hwe.pay.support.alipay.business.AlipayTradePrecreateBusiness;
import com.lenovohit.hwe.pay.support.alipay.business.AlipayTradeQueryBusiness;
import com.lenovohit.hwe.pay.support.alipay.business.AlipayTradeRefundBusiness;
import com.lenovohit.hwe.pay.support.alipay.business.AlipayTradeRefundQueryBusiness;
import com.lenovohit.hwe.pay.support.alipay.model.builder.AlipayTradeAppPayRequestBuilder;
import com.lenovohit.hwe.pay.support.alipay.model.builder.AlipayTradeCreateRequestBuilder;
import com.lenovohit.hwe.pay.support.alipay.model.builder.AlipayTradeDownloadRequestBuilder;
import com.lenovohit.hwe.pay.support.alipay.model.builder.AlipayTradePayCallbackRequestBuilder;
import com.lenovohit.hwe.pay.support.alipay.model.builder.AlipayTradePayRequestBuilder;
import com.lenovohit.hwe.pay.support.alipay.model.builder.AlipayTradePrecreateRequestBuilder;
import com.lenovohit.hwe.pay.support.alipay.model.builder.AlipayTradeQueryRequestBuilder;
import com.lenovohit.hwe.pay.support.alipay.model.builder.AlipayTradeRefundQueryRequestBuilder;
import com.lenovohit.hwe.pay.support.alipay.model.builder.AlipayTradeRefundRequestBuilder;
import com.lenovohit.hwe.pay.support.alipay.model.result.AlipayTradeAppPayResult;
import com.lenovohit.hwe.pay.support.alipay.model.result.AlipayTradeCreateResult;
import com.lenovohit.hwe.pay.support.alipay.model.result.AlipayTradeDownloadResult;
import com.lenovohit.hwe.pay.support.alipay.model.result.AlipayTradePayCallbackResult;
import com.lenovohit.hwe.pay.support.alipay.model.result.AlipayTradePayResult;
import com.lenovohit.hwe.pay.support.alipay.model.result.AlipayTradePrecreateResult;
import com.lenovohit.hwe.pay.support.alipay.model.result.AlipayTradeQueryResult;
import com.lenovohit.hwe.pay.support.alipay.model.result.AlipayTradeRefundQueryResult;
import com.lenovohit.hwe.pay.support.alipay.model.result.AlipayTradeRefundResult;
import com.lenovohit.hwe.pay.support.alipay.service.impl.AlipayTradeServiceImpl;

/**
 * SDK总入口
 */
public class Alipay {


	/**
	 * App支付下单接口( orderString )
	 * 
	 * @param builder
	 * @return AlipayTradeAppPayResult
	 * @throws Exception
	 */
	public static AlipayTradeAppPayResult tradeAppPay(AlipayTradeAppPayRequestBuilder builder) {
		return new AlipayTradeAppPayBusiness(builder.getConfigs()).run(builder);
	}
	/**
	 * 服务窗统一收单交易创建接口(支付宝交易号)
	 * 
	 * @param builder
	 * @return AlipayTradeCreateResult
	 * @throws Exception
	 */
	public static AlipayTradeCreateResult tradeCreate(AlipayTradeCreateRequestBuilder builder) {
		return new AlipayTradeCreateBusiness(builder.getConfigs()).run(builder);
	}

	 /**
	 * 当面付2.0预下单(生成二维码)
	 * @param builder
	 * @return AlipayTradePrecreateResult
	 * @throws Exception
	 */
	public static AlipayTradePrecreateResult tradePrecreate(AlipayTradePrecreateRequestBuilder builder){
		return new AlipayTradePrecreateBusiness(builder.getConfigs()).run(builder);
	}
	
	 /**
	 * 支付成功回调
	 * @param builder
	 * @return AlipayTradePrecreateResult
	 * @throws Exception
	 */
	public static AlipayTradePayCallbackResult tradePayCallback(AlipayTradePayCallbackRequestBuilder builder){
		return new AlipayTradePayCallbackBusiness(builder.getConfigs()).run(builder);
	}

	
	/**
	 * 消费查询
	 * @param builder
	 * @return AlipayTradeQueryResult
	 * @throws Exception
	 */
	public static AlipayTradeQueryResult queryTradeResult(AlipayTradeQueryRequestBuilder builder){
		return new AlipayTradeQueryBusiness(builder.getConfigs()).run(builder);
	}

	/**
     * 消费退款
     * @param builder
     * @return AlipayTradeRefundResult
     * @throws Exception
     */
    public static AlipayTradeRefundResult tradeRefund(AlipayTradeRefundRequestBuilder builder){
    	return new AlipayTradeRefundBusiness(builder.getConfigs()).run(builder);
    }
    
    /**
     * 退款查询
     * @param builder
     * @return AlipayTradeRefundQueryResult
     * @throws Exception
     */
    public static AlipayTradeRefundQueryResult tradeRefundQueryResult(AlipayTradeRefundQueryRequestBuilder builder){
    	return new AlipayTradeRefundQueryBusiness(builder.getConfigs()).run(builder);
    }

    /**
     * 同步对账文件
     * @param builder
     * @return AlipayTradeDownloadResult
     * @throws Exception
     */
    public static AlipayTradeDownloadResult tradeDownloadUrl(AlipayTradeDownloadRequestBuilder builder){
    	return new AlipayTradeDownloadBusiness(builder.getConfigs()).run(builder);
    }

	/**
	 * 流程支付
	 * @param AlipayTradePayRequestBuilder  支付请求数据
	 * @return AlipayTradePayResult
	 * @throws Exception
	 */
	public static AlipayTradePayResult tradePay(AlipayTradePayRequestBuilder builder){
		return new AlipayTradeServiceImpl.ClientBuilder().build(builder.getConfigs()).tradePay(builder);
	}

}
