package com.lenovohit.hwe.pay.support.alipay.scan;

import com.lenovohit.hwe.pay.support.alipay.scan.model.builder.AlipayTradeDownloadRequestBuilder;
import com.lenovohit.hwe.pay.support.alipay.scan.model.builder.AlipayTradePayRequestBuilder;
import com.lenovohit.hwe.pay.support.alipay.scan.model.builder.AlipayTradePrecreateRequestBuilder;
import com.lenovohit.hwe.pay.support.alipay.scan.model.builder.AlipayTradeQueryRequestBuilder;
import com.lenovohit.hwe.pay.support.alipay.scan.model.builder.AlipayTradeRefundQueryRequestBuilder;
import com.lenovohit.hwe.pay.support.alipay.scan.model.builder.AlipayTradeRefundRequestBuilder;
import com.lenovohit.hwe.pay.support.alipay.scan.model.result.AlipayF2FDownloadResult;
import com.lenovohit.hwe.pay.support.alipay.scan.model.result.AlipayF2FPayResult;
import com.lenovohit.hwe.pay.support.alipay.scan.model.result.AlipayF2FPrecreateResult;
import com.lenovohit.hwe.pay.support.alipay.scan.model.result.AlipayF2FQueryResult;
import com.lenovohit.hwe.pay.support.alipay.scan.model.result.AlipayF2FRefundQueryResult;
import com.lenovohit.hwe.pay.support.alipay.scan.model.result.AlipayF2FRefundResult;
import com.lenovohit.hwe.pay.support.alipay.scan.service.impl.AlipayTradeServiceImpl;

/**
 * SDK总入口
 */
public class Alipay {


	 /**
     * 当面付2.0流程支付
     * @param AlipayTradePayRequestBuilder  支付请求数据
     * @return AlipayF2FPayResult
     * @throws Exception
     */
    public static AlipayF2FPayResult tradePay(AlipayTradePayRequestBuilder builder){
    	return new AlipayTradeServiceImpl.ClientBuilder().build(builder.getConfigs()).tradePay(builder);
    }

    /**
     * 当面付2.0消费查询
     * @param builder
     * @return AlipayF2FQueryResult
     * @throws Exception
     */
    public static AlipayF2FQueryResult queryTradeResult(AlipayTradeQueryRequestBuilder builder){
    	return new AlipayTradeServiceImpl.ClientBuilder().build(builder.getConfigs()).queryTradeResult(builder);
    }

    /**
     * 当面付2.0消费退款
     * @param builder
     * @return AlipayF2FRefundResult
     * @throws Exception
     */
    public static AlipayF2FRefundResult tradeRefund(AlipayTradeRefundRequestBuilder builder){
    	return new AlipayTradeServiceImpl.ClientBuilder().build(builder.getConfigs()).tradeRefund(builder);
    }
    
    /**
     * 当面付2.0退款查询
     * @param builder
     * @return AlipayF2FRefundQueryResult
     * @throws Exception
     */
    public static AlipayF2FRefundQueryResult tradeRefundQueryResult(AlipayTradeRefundQueryRequestBuilder builder){
    	return new AlipayTradeServiceImpl.ClientBuilder().build(builder.getConfigs()).tradeRefundQueryResult(builder);
    }

    /**
     * 当面付2.0预下单(生成二维码)
     * @param builder
     * @return AlipayF2FPrecreateResult
     * @throws Exception
     */
    public static AlipayF2FPrecreateResult tradePrecreate(AlipayTradePrecreateRequestBuilder builder){
    	return new AlipayTradeServiceImpl.ClientBuilder().build(builder.getConfigs()).tradePrecreate(builder);
    }
    
//    // 当面付2.0异步通知
//    public static AlipayF2FPaySyncResult doPaySyncBusiness(AlipayPaySyncResponse response){
//    	return new AlipayTradeServiceImpl.ClientBuilder().build(builder.getConfigs()).tradePrecreate(builder);
//    }
    
    /**
     * 当面付2.0同步对账文件
     * @param builder
     * @return AlipayF2FPrecreateResult
     * @throws Exception
     */
    public static AlipayF2FDownloadResult tradeDownloadUrl(AlipayTradeDownloadRequestBuilder builder){
    	return new AlipayTradeServiceImpl.ClientBuilder().build(builder.getConfigs()).tradeDownloadUrl(builder);
    }

}
