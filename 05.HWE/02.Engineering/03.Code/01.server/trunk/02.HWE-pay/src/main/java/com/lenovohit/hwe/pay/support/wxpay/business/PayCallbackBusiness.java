package com.lenovohit.hwe.pay.support.wxpay.business;

import static java.lang.Thread.sleep;

import org.apache.commons.configuration.Configuration;
import org.slf4j.LoggerFactory;

import com.lenovohit.hwe.pay.support.wxpay.common.Log;
import com.lenovohit.hwe.pay.support.wxpay.common.Signature;
import com.lenovohit.hwe.pay.support.wxpay.common.Util;
import com.lenovohit.hwe.pay.support.wxpay.protocol.pay_callback.PayCallbackResData;
import com.lenovohit.hwe.pay.support.wxpay.protocol.pay_query_protocol.ScanPayQueryReqData;
import com.lenovohit.hwe.pay.support.wxpay.protocol.pay_query_protocol.ScanPayQueryResData;
import com.lenovohit.hwe.pay.support.wxpay.service.ScanPayQueryService;

/**
 * User: rizenguo
 * Date: 2014/12/1
 * Time: 17:05
 */
public class PayCallbackBusiness {

    public PayCallbackBusiness() throws IllegalAccessException, ClassNotFoundException, InstantiationException {
    }

    public interface ResultListener {

        //API返回ReturnCode不合法，支付请求逻辑错误，请仔细检测传过去的每一个参数是否合法，或是看API能否被正常访问
        void onFailByReturnCodeError(PayCallbackResData payCallbackResData);

        //API返回ReturnCode为FAIL，支付API系统返回失败，请检测Post给API的数据是否规范合法
        void onFailByReturnCodeFail(PayCallbackResData payCallbackResData);

        //支付请求API返回的数据签名验证失败，有可能数据被篡改了
        void onFailBySignInvalid(PayCallbackResData payCallbackResData);

        //支付失败
        void onFail(PayCallbackResData payCallbackResData);

        //支付成功
        void onSuccess(PayCallbackResData payCallbackResData);

    }

    //打log用
    private static Log log = new Log(LoggerFactory.getLogger(PayCallbackBusiness.class));

    //每次调用订单查询API时的等待时间，因为当出现支付失败的时候，如果马上发起查询不一定就能查到结果，所以这里建议先等待一定时间再发起查询
    private int waitingTimeBeforePayQueryServiceInvoked = 5000;

    //循环调用订单查询API的次数
    private int payQueryLoopInvokedCount = 3;

    private ScanPayQueryService scanPayQueryService;

    /**
     * 扫码支付-异步通知业务逻辑（包含最佳实践流程）
     *
     * @param responseString 异步通知数据
     * @param resultListener 商户需要自己监听被扫支付业务逻辑可能触发的各种分支事件，并做好合理的响应处理
     * @throws Exception
     */
    public void run(PayCallbackResData payCallbackResData, ResultListener resultListener) throws Exception {
    	
        if (payCallbackResData == null || payCallbackResData.getReturn_code() == null) {
            log.e("【扫码支付-异步通知失败】微信返回数据解析错误!");
            resultListener.onFailByReturnCodeError(payCallbackResData);
            return;
        }
        String outTradeNo = payCallbackResData.getOut_trade_no();

        if (payCallbackResData.getReturn_code().equals("FAIL")) {
            //注意：一般这里返回FAIL是出现系统级参数错误，请检测Post给API的数据是否规范合法
            log.e("【扫码支付-异步通知失败】微信支付系统返回失败!");
            resultListener.onFailByReturnCodeFail(payCallbackResData);
            return;
        } else {
            log.i("微信支付系统成功返回数据");
            //--------------------------------------------------------------------
            //收到API的返回数据的时候得先验证一下数据有没有被第三方篡改，确保安全
            //--------------------------------------------------------------------
            String key = payCallbackResData.getConfigs().getString("key");
            if (!Signature.checkIsSignValidFromResponseString(key, payCallbackResData.getResponseString())) {
                log.e("【扫码支付-异步通知失败】微信支付系统返回的数据签名验证失败，有可能数据被篡改了");
                resultListener.onFailBySignInvalid(payCallbackResData);
                return;
            }

            //获取错误码
            String errorCode = payCallbackResData.getErr_code();
            //获取错误描述
            String errorCodeDes = payCallbackResData.getErr_code_des();
            if (payCallbackResData.getResult_code().equals("SUCCESS")) {
            	//--------------------------------------------------------------------
                //1)直接扣款成功
                //--------------------------------------------------------------------
                log.i("【扫码支付-异步通知成功】微信支付系统交易成功");
                resultListener.onSuccess(payCallbackResData);
            }else{
            	//出现业务错误
                log.i("业务返回失败");
                log.i("err_code:" + errorCode);
                log.i("err_code_des:" + errorCodeDes);
                //--------------------------------------------------------------------
                //2)扣款未知失败
                //--------------------------------------------------------------------
                if (doPayQueryLoop(payQueryLoopInvokedCount, outTradeNo, payCallbackResData.getConfigs())) {
                    log.i("【扫码支付-异步通知失败，查询到支付成功】");
                    resultListener.onSuccess(payCallbackResData);
                } else {
                    log.i("【扫码支付-异步通知失败，在一定时间内没有查询到支付成功】");
                    resultListener.onFail(payCallbackResData);
                }
            }
        }
    }

    /**
     * 进行一次支付订单查询操作
     *
     * @param outTradeNo    商户系统内部的订单号,32个字符内可包含字母, [确保在商户系统唯一]
     * @return 该订单是否支付成功
     * @throws Exception
     */
    private boolean doOnePayQuery(String outTradeNo, Configuration configs) throws Exception {

        sleep(waitingTimeBeforePayQueryServiceInvoked);//等待一定时间再进行查询，避免状态还没来得及被更新

        String payQueryServiceResponseString;

        ScanPayQueryReqData scanPayQueryReqData = new ScanPayQueryReqData("", outTradeNo, configs);
        payQueryServiceResponseString = scanPayQueryService.request(scanPayQueryReqData);

        log.i("支付订单查询API返回的数据如下：");
        log.i(payQueryServiceResponseString);

        //将从API返回的XML数据映射到Java对象
        ScanPayQueryResData payCallbackQueryResData = (ScanPayQueryResData) Util.getObjectFromXML(payQueryServiceResponseString, ScanPayQueryResData.class);
        if (payCallbackQueryResData == null || payCallbackQueryResData.getReturn_code() == null) {
            log.i("支付订单查询请求逻辑错误，请仔细检测传过去的每一个参数是否合法");
            return false;
        }

        if (payCallbackQueryResData.getReturn_code().equals("FAIL")) {
            //注意：一般这里返回FAIL是出现系统级参数错误，请检测Post给API的数据是否规范合法
            log.i("支付订单查询API系统返回失败，失败信息为：" + payCallbackQueryResData.getReturn_msg());
            return false;
        } else {
            if (payCallbackQueryResData.getResult_code().equals("SUCCESS")) {//业务层成功
                if (payCallbackQueryResData.getTrade_state().equals("SUCCESS")) {
                    //表示查单结果为“支付成功”
                    log.i("查询到订单支付成功");
                    return true;
                } else {
                    //支付不成功
                    log.i("查询到订单支付不成功");
                    return false;
                }
            } else {
                log.i("查询出错，错误码：" + payCallbackQueryResData.getErr_code() + "     错误信息：" + payCallbackQueryResData.getErr_code_des());
                return false;
            }
        }
    }

    /**
     * 由于有的时候是因为服务延时，所以需要商户每隔一段时间（建议5秒）后再进行查询操作，多试几次（建议3次）
     *
     * @param loopCount     循环次数，至少一次
     * @param outTradeNo    商户系统内部的订单号,32个字符内可包含字母, [确保在商户系统唯一]
     * @return 该订单是否支付成功
     * @throws InterruptedException
     */
    private boolean doPayQueryLoop(int loopCount, String outTradeNo, Configuration configs) throws Exception {
        //至少查询一次
        if (loopCount == 0) {
            loopCount = 1;
        }
        //进行循环查询
        for (int i = 0; i < loopCount; i++) {
            if (doOnePayQuery(outTradeNo, configs)) {
                return true;
            }
        }
        return false;
    }

    /**
     * 设置循环多次调用订单查询API的时间间隔
     *
     * @param duration 时间间隔，默认为10秒
     */
    public void setWaitingTimeBeforePayQueryServiceInvoked(int duration) {
        waitingTimeBeforePayQueryServiceInvoked = duration;
    }

    /**
     * 设置循环多次调用订单查询API的次数
     *
     * @param count 调用次数，默认为三次
     */
    public void setPayQueryLoopInvokedCount(int count) {
        payQueryLoopInvokedCount = count;
    }

}
