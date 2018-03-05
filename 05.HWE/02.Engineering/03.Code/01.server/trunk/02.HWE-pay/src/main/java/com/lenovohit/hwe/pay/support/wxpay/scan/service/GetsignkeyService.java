package com.lenovohit.hwe.pay.support.wxpay.scan.service;

import com.lenovohit.hwe.pay.support.wxpay.scan.common.Configure;
import com.lenovohit.hwe.pay.support.wxpay.scan.protocol.getsignkey_protocol.GetsignkeyReqData;

/**
 * User: rizenguo
 * Date: 2014/10/29
 * Time: 16:04
 */
public class GetsignkeyService extends BaseService{

    public GetsignkeyService() throws IllegalAccessException, InstantiationException, ClassNotFoundException {
        super(Configure.GETSIGNKEY_API);
    }

    /**
     * 请求退款服务
     * @param refundReqData 这个数据对象里面包含了API要求提交的各种数据字段
     * @return API返回的XML数据
     * @throws Exception
     */
    public String request(GetsignkeyReqData refundReqData) throws Exception {

        //--------------------------------------------------------------------
        //发送HTTPS的Post请求到API地址
        //--------------------------------------------------------------------
        String responseString = sendPost(refundReqData);

        return responseString;
    }

}
