package com.lenovohit.hwe.pay.support.wxpay.scan.service;

import com.lenovohit.hwe.pay.support.wxpay.scan.common.Configure;
import com.lenovohit.hwe.pay.support.wxpay.scan.protocol.precreate_protocol.PrecreateReqData;

/**
 * User: rizenguo
 * Date: 2014/10/29
 * Time: 16:03
 */
public class PrecreateService extends BaseService{

    public PrecreateService() throws IllegalAccessException, InstantiationException, ClassNotFoundException {
        super(Configure.PRECREATE_API);
    }

    /**
     * 扫码支付-统一下单
     * @param precreateReqData 这个数据对象里面包含了API要求提交的各种数据字段
     * @return API返回的数据
     * @throws Exception
     */
    public String request(PrecreateReqData precreateReqData) throws Exception {

        //--------------------------------------------------------------------
        //发送HTTPS的Post请求到API地址
        //--------------------------------------------------------------------
        String responseString = sendPost(precreateReqData);

        return responseString;
    }
}
