package com.lenovohit.ssm.payment.support.wxPay.business;

import org.slf4j.LoggerFactory;

import com.lenovohit.ssm.payment.support.wxPay.common.Log;
import com.lenovohit.ssm.payment.support.wxPay.common.Signature;
import com.lenovohit.ssm.payment.support.wxPay.common.Util;
import com.lenovohit.ssm.payment.support.wxPay.protocol.pay_query_protocol.ScanPayQueryReqData;
import com.lenovohit.ssm.payment.support.wxPay.protocol.pay_query_protocol.ScanPayQueryResData;
import com.lenovohit.ssm.payment.support.wxPay.service.ScanPayQueryService;

/**
 * User: rizenguo
 * Date: 2014/12/2
 * Time: 18:51
 */
public class ScanPayQueryBusiness {

    public ScanPayQueryBusiness() throws IllegalAccessException, ClassNotFoundException, InstantiationException {
        scanPayQueryService = new ScanPayQueryService();
    }

    public interface ResultListener{
        //API返回ReturnCode不合法，支付请求逻辑错误，请仔细检测传过去的每一个参数是否合法，或是看API能否被正常访问
        void onFailByReturnCodeError(ScanPayQueryResData scanPayQueryResData);

        //API返回ReturnCode为FAIL，支付API系统返回失败，请检测Post给API的数据是否规范合法
        void onFailByReturnCodeFail(ScanPayQueryResData scanPayQueryResData);

        //支付请求API返回的数据签名验证失败，有可能数据被篡改了
        void onFailBySignInvalid(ScanPayQueryResData scanPayQueryResData);

        //支付查询失败
        void onScanPayQueryFail(ScanPayQueryResData scanPayQueryResData);

        //支付查询成功
        void onScanPayQuerySuccess(ScanPayQueryResData scanPayQueryResData);

    }

    //打log用
    private static Log log = new Log(LoggerFactory.getLogger(ScanPayQueryBusiness.class));

    //执行结果
    private static String result = "";

    private ScanPayQueryService scanPayQueryService;

    /**
     * 运行支付查询的业务逻辑
     * @param scanPayQueryReqData 这个数据对象里面包含了API要求提交的各种数据字段
     * @param resultListener 商户需要自己监听被扫支付业务逻辑可能触发的各种分支事件，并做好合理的响应处理
     * @throws Exception
     */
    public void run(ScanPayQueryReqData scanPayQueryReqData, ScanPayQueryBusiness.ResultListener resultListener) throws Exception {

        //--------------------------------------------------------------------
        //构造请求“支付查询API”所需要提交的数据
        //--------------------------------------------------------------------

        //接受API返回
        String scanPayQueryServiceResponseString;

        long costTimeStart = System.currentTimeMillis();

        //表示是本地测试数据
        log.i("支付查询API返回的数据如下：");
        scanPayQueryServiceResponseString = scanPayQueryService.request(scanPayQueryReqData);

        long costTimeEnd = System.currentTimeMillis();
        long totalTimeCost = costTimeEnd - costTimeStart;
        log.i("api请求总耗时：" + totalTimeCost + "ms");

        log.i(scanPayQueryServiceResponseString);

        //将从API返回的XML数据映射到Java对象
        ScanPayQueryResData scanPayQueryResData = (ScanPayQueryResData) Util.getObjectFromXML(scanPayQueryServiceResponseString, ScanPayQueryResData.class);
        scanPayQueryResData.setResponseString(scanPayQueryServiceResponseString);
//        ReportReqData reportReqData = new ReportReqData(
//        		scanPayQueryResData.getDevice_info(),
//                Configure.REFUND_QUERY_API,
//                (int) (totalTimeCost),//本次请求耗时
//                scanPayQueryResData.getReturn_code(),
//                scanPayQueryResData.getReturn_msg(),
//                scanPayQueryResData.getResult_code(),
//                scanPayQueryResData.getErr_code(),
//                scanPayQueryResData.getErr_code_des(),
//                scanPayQueryResData.getOut_trade_no(),
//                Configure.getIP()
//        );
//
//        long timeAfterReport;
//        if(Configure.isUseThreadToDoReport()){
//            ReporterFactory.getReporter(reportReqData).run();
//            timeAfterReport = System.currentTimeMillis();
//            Util.log("pay+report总耗时（异步方式上报）："+(timeAfterReport-costTimeStart) + "ms");
//        }else{
//            ReportService.request(reportReqData);
//            timeAfterReport = System.currentTimeMillis();
//            Util.log("pay+report总耗时（同步方式上报）："+(timeAfterReport-costTimeStart) + "ms");
//        }

        if (scanPayQueryResData == null || scanPayQueryResData.getReturn_code() == null) {
            setResult("Case1:支付查询API请求逻辑错误，请仔细检测传过去的每一个参数是否合法，或是看API能否被正常访问",Log.LOG_TYPE_ERROR);
            resultListener.onFailByReturnCodeError(scanPayQueryResData);
            return;
        }

        //Debug:查看数据是否正常被填充到scanPayResponseData这个对象中
        //Util.reflect(scanPayQueryResData);

        if (scanPayQueryResData.getReturn_code().equals("FAIL")) {
            ///注意：一般这里返回FAIL是出现系统级参数错误，请检测Post给API的数据是否规范合法
            setResult("Case2:支付查询API系统返回失败，请检测Post给API的数据是否规范合法",Log.LOG_TYPE_ERROR);
            resultListener.onFailByReturnCodeFail(scanPayQueryResData);
        } else {
            log.i("支付查询API系统成功返回数据");
            //--------------------------------------------------------------------
            //收到API的返回数据的时候得先验证一下数据有没有被第三方篡改，确保安全
            //--------------------------------------------------------------------
            if (!Signature.checkIsSignValidFromResponseString(scanPayQueryServiceResponseString)) {
                setResult("Case3:支付查询API返回的数据签名验证失败，有可能数据被篡改了",Log.LOG_TYPE_ERROR);
                resultListener.onFailBySignInvalid(scanPayQueryResData);
                return;
            }

            if (scanPayQueryResData.getResult_code().equals("SUCCESS")) {
            	setResult("Case4:【支付查询成功】",Log.LOG_TYPE_INFO);
            	resultListener.onScanPayQuerySuccess(scanPayQueryResData);
            } else {
            	log.i("出错，错误码：" + scanPayQueryResData.getErr_code() + " 错误信息：" + scanPayQueryResData.getErr_code_des());
            	setResult("Case5:【支付查询失败】",Log.LOG_TYPE_ERROR);
            	resultListener.onScanPayQueryFail(scanPayQueryResData);
            	//支付失败时再怎么延时查询支付状态都没有意义，这个时间建议要么再手动重试一次，依然失败的话请走投诉渠道进行投诉
            }
        }
    }

    public void setScanPayQueryService(ScanPayQueryService service) {
        scanPayQueryService = service;
    }

    public String getResult() {
        return result;
    }

    public void setResult(String result) {
        ScanPayQueryBusiness.result = result;
    }

    public void setResult(String result,String type){
        setResult(result);
        log.log(type,result);
    }

}
