package com.lenovohit.hwe.pay.support.wxpay.scan;

import com.lenovohit.hwe.pay.support.wxpay.scan.business.DownloadBillBusiness;
import com.lenovohit.hwe.pay.support.wxpay.scan.business.PayCallbackBusiness;
import com.lenovohit.hwe.pay.support.wxpay.scan.business.PrecreateBusiness;
import com.lenovohit.hwe.pay.support.wxpay.scan.business.RefundBusiness;
import com.lenovohit.hwe.pay.support.wxpay.scan.business.RefundQueryBusiness;
import com.lenovohit.hwe.pay.support.wxpay.scan.business.ScanPayBusiness;
import com.lenovohit.hwe.pay.support.wxpay.scan.business.ScanPayQueryBusiness;
import com.lenovohit.hwe.pay.support.wxpay.scan.protocol.downloadbill_protocol.DownloadBillReqData;
import com.lenovohit.hwe.pay.support.wxpay.scan.protocol.pay_callback.PayCallbackResData;
import com.lenovohit.hwe.pay.support.wxpay.scan.protocol.pay_protocol.ScanPayReqData;
import com.lenovohit.hwe.pay.support.wxpay.scan.protocol.pay_query_protocol.ScanPayQueryReqData;
import com.lenovohit.hwe.pay.support.wxpay.scan.protocol.precreate_protocol.PrecreateReqData;
import com.lenovohit.hwe.pay.support.wxpay.scan.protocol.refund_protocol.RefundReqData;
import com.lenovohit.hwe.pay.support.wxpay.scan.protocol.refund_query_protocol.RefundQueryReqData;
import com.lenovohit.hwe.pay.support.wxpay.scan.protocol.reverse_protocol.ReverseReqData;
import com.lenovohit.hwe.pay.support.wxpay.scan.service.DownloadBillService;
import com.lenovohit.hwe.pay.support.wxpay.scan.service.PrecreateService;
import com.lenovohit.hwe.pay.support.wxpay.scan.service.RefundQueryService;
import com.lenovohit.hwe.pay.support.wxpay.scan.service.RefundService;
import com.lenovohit.hwe.pay.support.wxpay.scan.service.ReverseService;
import com.lenovohit.hwe.pay.support.wxpay.scan.service.ScanPayQueryService;
import com.lenovohit.hwe.pay.support.wxpay.scan.service.ScanPayService;

/**
 * SDK总入口
 */
public class WXPay {

    /**
     * 扫码支付-统一下单
     * @param precreateReqData 这个数据对象里面包含了API要求提交的各种数据字段
     * @return API返回的数据
     * @throws Exception
     */
    public static String requestPrecreateService(PrecreateReqData precreateReqData) throws Exception{
    	return new PrecreateService().request(precreateReqData);
    }
    /**
     * 请求支付服务
     * @param scanPayReqData 这个数据对象里面包含了API要求提交的各种数据字段
     * @return API返回的数据
     * @throws Exception
     */
    public static String requestScanPayService(ScanPayReqData scanPayReqData) throws Exception{
        return new ScanPayService().request(scanPayReqData);
    }

    /**
     * 请求支付查询服务
     * @param scanPayQueryReqData 这个数据对象里面包含了API要求提交的各种数据字段
     * @return API返回的XML数据
     * @throws Exception
     */
	public static String requestScanPayQueryService(ScanPayQueryReqData scanPayQueryReqData) throws Exception{
		return new ScanPayQueryService().request(scanPayQueryReqData);
	}

    /**
     * 请求退款服务
     * @param refundReqData 这个数据对象里面包含了API要求提交的各种数据字段
     * @return API返回的XML数据
     * @throws Exception
     */
    public static String requestRefundService(RefundReqData refundReqData) throws Exception{
        return new RefundService().request(refundReqData);
    }

    /**
     * 请求退款查询服务
     * @param refundQueryReqData 这个数据对象里面包含了API要求提交的各种数据字段
     * @return API返回的XML数据
     * @throws Exception
     */
	public static String requestRefundQueryService(RefundQueryReqData refundQueryReqData) throws Exception{
		return new RefundQueryService().request(refundQueryReqData);
	}

    /**
     * 请求撤销服务
     * @param reverseReqData 这个数据对象里面包含了API要求提交的各种数据字段
     * @return API返回的XML数据
     * @throws Exception
     */
	public static String requestReverseService(ReverseReqData reverseReqData) throws Exception{
		return new ReverseService().request(reverseReqData);
	}

    /**
     * 请求对账单下载服务
     * @param downloadBillReqData 这个数据对象里面包含了API要求提交的各种数据字段
     * @return API返回的XML数据
     * @throws Exception
     */
    public static String requestDownloadBillService(DownloadBillReqData downloadBillReqData) throws Exception{
        return new DownloadBillService().request(downloadBillReqData);
    }

    /**
     * 直接执行扫码支付-统一下单业务逻辑（包含最佳实践流程）
     * @param precreateReqData 这个数据对象里面包含了API要求提交的各种数据字段
     * @param resultListener 商户需要自己监听扫码支付-统一下单逻辑可能触发的各种分支事件，并做好合理的响应处理
     * @throws Exception
     */
    public static void doPrecreateBusiness(PrecreateReqData precreateReqData, PrecreateBusiness.ResultListener resultListener) throws Exception {
    	new PrecreateBusiness().run(precreateReqData, resultListener);
    }
    /**
     * 直接执行扫码支付-支付回调业务逻辑（包含最佳实践流程）
     * @param responseString 微信异步通知数据
     * @param resultListener 商户需要自己监听扫码支付-统一下单逻辑可能触发的各种分支事件，并做好合理的响应处理
     * @throws Exception
     */
    public static void doPayCallbackBusiness(PayCallbackResData payCallbackResData, PayCallbackBusiness.ResultListener resultListener) throws Exception {
    	new PayCallbackBusiness().run(payCallbackResData, resultListener);
    }
    /**
     * 直接执行被扫支付业务逻辑（包含最佳实践流程）
     * @param scanPayReqData 这个数据对象里面包含了API要求提交的各种数据字段
     * @param resultListener 商户需要自己监听被扫支付业务逻辑可能触发的各种分支事件，并做好合理的响应处理
     * @throws Exception
     */
    public static void doScanPayBusiness(ScanPayReqData scanPayReqData, ScanPayBusiness.ResultListener resultListener) throws Exception {
        new ScanPayBusiness().run(scanPayReqData, resultListener);
    }
    
    /**
     * 运行支付查询的业务逻辑
     * @param scanPayQueryReqData 这个数据对象里面包含了API要求提交的各种数据字段
     * @param resultListener 商户需要自己监听被扫支付业务逻辑可能触发的各种分支事件，并做好合理的响应处理
     * @throws Exception
     */
    public static void doScanPayQueryBusiness(ScanPayQueryReqData scanPayQueryReqData, ScanPayQueryBusiness.ResultListener resultListener) throws Exception {
        new ScanPayQueryBusiness().run(scanPayQueryReqData, resultListener);
    }
    /**
     * 调用退款业务逻辑
     * @param refundReqData 这个数据对象里面包含了API要求提交的各种数据字段
     * @param resultListener 业务逻辑可能走到的结果分支，需要商户处理
     * @throws Exception
     */
    public static void doRefundBusiness(RefundReqData refundReqData, RefundBusiness.ResultListener resultListener) throws Exception {
        new RefundBusiness().run(refundReqData,resultListener);
    }

    /**
     * 运行退款查询的业务逻辑
     * @param refundQueryReqData 这个数据对象里面包含了API要求提交的各种数据字段
     * @param resultListener 商户需要自己监听被扫支付业务逻辑可能触发的各种分支事件，并做好合理的响应处理
     * @throws Exception
     */
    public static void doRefundQueryBusiness(RefundQueryReqData refundQueryReqData,RefundQueryBusiness.ResultListener resultListener) throws Exception {
        new RefundQueryBusiness().run(refundQueryReqData,resultListener);
    }

    /**
     * 请求对账单下载服务
     * @param downloadBillReqData 这个数据对象里面包含了API要求提交的各种数据字段
     * @param resultListener 商户需要自己监听被扫支付业务逻辑可能触发的各种分支事件，并做好合理的响应处理
     * @return API返回的XML数据
     * @throws Exception
     */
    public static void doDownloadBillBusiness(DownloadBillReqData downloadBillReqData,DownloadBillBusiness.ResultListener resultListener) throws Exception {
        new DownloadBillBusiness().run(downloadBillReqData,resultListener);
    }

}
