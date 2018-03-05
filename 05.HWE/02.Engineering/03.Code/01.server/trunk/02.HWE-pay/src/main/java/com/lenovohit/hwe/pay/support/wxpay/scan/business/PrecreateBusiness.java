package com.lenovohit.hwe.pay.support.wxpay.scan.business;

import org.slf4j.LoggerFactory;

import com.lenovohit.hwe.pay.support.wxpay.scan.common.Log;
import com.lenovohit.hwe.pay.support.wxpay.scan.common.Signature;
import com.lenovohit.hwe.pay.support.wxpay.scan.common.Util;
import com.lenovohit.hwe.pay.support.wxpay.scan.protocol.precreate_protocol.PrecreateReqData;
import com.lenovohit.hwe.pay.support.wxpay.scan.protocol.precreate_protocol.PrecreateResData;
import com.lenovohit.hwe.pay.support.wxpay.scan.service.PrecreateService;

/**
 * User: rizenguo
 * Date: 2014/12/2
 * Time: 17:51
 */
public class PrecreateBusiness {

    public PrecreateBusiness() throws IllegalAccessException, ClassNotFoundException, InstantiationException {
        precreateService = new PrecreateService();
    }

    public interface ResultListener{
        //API返回ReturnCode不合法，支付请求逻辑错误，请仔细检测传过去的每一个参数是否合法，或是看API能否被正常访问
        void onFailByReturnCodeError(PrecreateResData precreateResData);

        //API返回ReturnCode为FAIL，支付API系统返回失败，请检测Post给API的数据是否规范合法
        void onFailByReturnCodeFail(PrecreateResData precreateResData);

        //支付请求API返回的数据签名验证失败，有可能数据被篡改了
        void onFailBySignInvalid(PrecreateResData precreateResData);

        //预支付失败
        void onPrecreateFail(PrecreateResData precreateResData);

        //预支付成功
        void onPrecreateSuccess(PrecreateResData precreateResData);

    }

    //打log用
    private static Log log = new Log(LoggerFactory.getLogger(PrecreateBusiness.class));

    //执行结果
    private static String result = "";

    private PrecreateService precreateService;

    /**
     * 调用预支付业务逻辑
     * @param precreateReqData 这个数据对象里面包含了API要求提交的各种数据字段
     * @param resultListener 业务逻辑可能走到的结果分支，需要商户处理
     * @throws Exception
     */
    public void run(PrecreateReqData precreateReqData, ResultListener resultListener) throws Exception {

        //--------------------------------------------------------------------
        //构造请求“预支付API”所需要提交的数据
        //--------------------------------------------------------------------

        //API返回的数据
        String precreateServiceResponseString;

        long costTimeStart = System.currentTimeMillis();

        log.i("预支付API返回的数据如下：");
        precreateServiceResponseString = precreateService.request(precreateReqData);

        long costTimeEnd = System.currentTimeMillis();
        long totalTimeCost = costTimeEnd - costTimeStart;
        log.i("api请求总耗时：" + totalTimeCost + "ms");
        log.i(precreateServiceResponseString);

        //将从API返回的XML数据映射到Java对象
        PrecreateResData precreateResData = (PrecreateResData) Util.getObjectFromXML(precreateServiceResponseString, PrecreateResData.class);
        precreateResData.setResponseString(precreateServiceResponseString);
        precreateResData.setConfigs(precreateReqData.getConfigs());
//        ReportReqData reportReqData = new ReportReqData(
//                precreateResData.getDevice_info(),
//                Configure.PRECREATE_API,
//                (int) (totalTimeCost),//本次请求耗时
//                precreateResData.getReturn_code(),
//                precreateResData.getReturn_msg(),
//                precreateResData.getResult_code(),
//                precreateResData.getErr_code(),
//                precreateResData.getErr_code_des(),
//                "",
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

        if (precreateResData == null || precreateResData.getReturn_code() == null) {
            setResult("Case1:预支付API请求逻辑错误，请仔细检测传过去的每一个参数是否合法，或是看API能否被正常访问",Log.LOG_TYPE_ERROR);
            resultListener.onFailByReturnCodeError(precreateResData);
            return;
        }

        //Debug:查看数据是否正常被填充到scanPayResponseData这个对象中
        //Util.reflect(precreateResData);

        if (precreateResData.getReturn_code().equals("FAIL")) {
            ///注意：一般这里返回FAIL是出现系统级参数错误，请检测Post给API的数据是否规范合法
            setResult("Case2:预支付API系统返回失败，请检测Post给API的数据是否规范合法",Log.LOG_TYPE_ERROR);
            resultListener.onFailByReturnCodeFail(precreateResData);
        } else {
            log.i("预支付API系统成功返回数据");
            //--------------------------------------------------------------------
            //收到API的返回数据的时候得先验证一下数据有没有被第三方篡改，确保安全
            //--------------------------------------------------------------------
            String key = precreateReqData.getConfigs().getString("key");
            if (!Signature.checkIsSignValidFromResponseString(key, precreateServiceResponseString)) {
                setResult("Case3:预支付请求API返回的数据签名验证失败，有可能数据被篡改了",Log.LOG_TYPE_ERROR);
                resultListener.onFailBySignInvalid(precreateResData);
                return;
            }

            if (precreateResData.getResult_code().equals("FAIL")) {
                log.i("出错，错误码：" + precreateResData.getErr_code() + "     错误信息：" + precreateResData.getErr_code_des());
                setResult("Case4:【预支付失败】",Log.LOG_TYPE_ERROR);
                //预支付失败时再怎么延时查询预支付状态都没有意义，这个时间建议要么再手动重试一次，依然失败的话请走投诉渠道进行投诉
                resultListener.onPrecreateFail(precreateResData);
            } else {
                //预支付成功
                setResult("Case5:【预支付成功】",Log.LOG_TYPE_INFO);
                resultListener.onPrecreateSuccess(precreateResData);
            }
        }
    }

    public void setPrecreateService(PrecreateService service) {
        precreateService = service;
    }

    public String getResult() {
        return result;
    }

    public void setResult(String result) {
        PrecreateBusiness.result = result;
    }

    public void setResult(String result,String type){
        setResult(result);
        log.log(type,result);
    }
}
