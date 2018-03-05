package com.lenovohit.hwe.pay.support.wxpay.scan;

import com.lenovohit.hwe.pay.support.wxpay.scan.common.Util;
import com.lenovohit.hwe.pay.support.wxpay.scan.protocol.getsignkey_protocol.GetsignkeyReqData;
import com.lenovohit.hwe.pay.support.wxpay.scan.service.GetsignkeyService;

public class Main {
    public static void main(String[] args) {
        try {
        	GetsignkeyReqData  reqData = new GetsignkeyReqData(null);
        	GetsignkeyService service = new GetsignkeyService();
        	String respnse = service.request(reqData);
        	System.out.println( "--------------------");
        	System.out.println(respnse);
//        	SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyyMMddHHmmss");
//            Calendar c = Calendar.getInstance();
//            c.setTime(new Date());
//            c.add(Calendar.DAY_OF_MONTH,10);
//            
//        	ScanPayReqData scanPayReqData = new ScanPayReqData(
//                    //这个是扫码终端设备从用户手机上扫取到的支付授权号，有效期是1分钟
////                  bridge.getAuthCode(),
//          		"130070451334348700",
//                  //要支付的商品的描述信息，用户会在支付成功页面里看到这个信息
////                  bridge.getBody(),
//          		"微信支付JavaSDK测试：ScanPayBusinessDemo",
//                  //支付订单里面可以填的附加数据，API会将提交的这个附加数据原样返回
////                  bridge.getAttach(),
//          		"微信支付JavaSDK测试：ScanPayBusinessDemo，为了跑通支付全流程",
//                  //商户系统内部的订单号,32个字符内可包含字母, 确保在商户系统唯一
////                  bridge.getOutTradeNo(),
//          		DateUtils.getCurrentDateStr("yyyyMMddHHmmss"),
//                  //订单总金额，单位为“分”，只能整数
////                  bridge.getTotalFee(),
//          		1,
//                  //商户自己定义的扫码支付终端设备号，方便追溯这笔交易发生在哪台终端设备上
////                  bridge.getDeviceInfo(),
//          		"GRZ的测试机",
//                  //订单生成的机器IP
////                  bridge.getSpBillCreateIP(),
//                  "127.0.0.1",
//                  //订单生成时间，格式为yyyyMMddHHmmss，如2009年12月25日9点10分10秒表示为20091225091010
////                  bridge.getTimeStart(),
//                  DateUtils.getCurrentDateStr("yyyyMMddHHmmss"),
//                  //订单失效时间，格式同上
////                  bridge.getTimeExpire(),
//                  simpleDateFormat.format(c.getTime()),
//                  //商品标记，微信平台配置的商品标记，用于优惠券或者满减使用
////                  bridge.getGoodsTag()
//                  ""
//          );
//        	DefaultScanPayBusinessResultListener resultListener = new DefaultScanPayBusinessResultListener();
//          WXPay.doScanPayBusiness(scanPayReqData, resultListener);	
        	
            //--------------------------------------------------------------------
            //温馨提示，第一次使用该SDK时请到com.lenovohit.hwe.pay.support.wxpay.common.Configure类里面进行配置
            //--------------------------------------------------------------------



            //--------------------------------------------------------------------
            //PART One:基础组件测试
            //--------------------------------------------------------------------

            //1）https请求可用性测试
            //HTTPSPostRquestWithCert.test();

            //2）测试项目用到的XStream组件，本项目利用这个组件将Java对象转换成XML数据Post给API
            //XStreamTest.test();


            //--------------------------------------------------------------------
            //PART Two:基础服务测试
            //--------------------------------------------------------------------

            //1）测试被扫支付API
//            PayServiceTest.test();

            //2）测试被扫订单查询API
            //PayQueryServiceTest.test();

            //3）测试撤销API
            //温馨提示，测试支付API成功扣到钱之后，可以通过调用PayQueryServiceTest.test()，将支付成功返回的transaction_id和out_trade_no数据贴进去，完成撤销工作，把钱退回来 ^_^v
            //ReverseServiceTest.test();

            //4）测试退款申请API
            //RefundServiceTest.test();

            //5）测试退款查询API
            //RefundQueryServiceTest.test();

            //6）测试对账单API
            //DownloadBillServiceTest.test();


            //本地通过xml进行API数据模拟的时候，先按需手动修改xml各个节点的值，然后通过以下方法对这个新的xml数据进行签名得到一串合法的签名，最后把这串签名放到这个xml里面的sign字段里，这样进行模拟的时候就可以通过签名验证了
           // Util.log(Signature.getSignFromResponseString(Util.getLocalXMLString("/test/com/tencent/business/refundqueryserviceresponsedata/refundquerysuccess2.xml")));

            //Util.log(new Date().getTime());
            //Util.log(System.currentTimeMillis());

        } catch (Exception e){
        	e.printStackTrace();
            Util.log(e.getMessage());
        }

    }

}
