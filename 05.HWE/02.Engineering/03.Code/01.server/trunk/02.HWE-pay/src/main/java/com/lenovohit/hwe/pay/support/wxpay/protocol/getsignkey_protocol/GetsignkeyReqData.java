package com.lenovohit.hwe.pay.support.wxpay.protocol.getsignkey_protocol;

import java.lang.reflect.Field;
import java.util.HashMap;
import java.util.Map;

import org.apache.commons.configuration.Configuration;

import com.lenovohit.hwe.pay.support.wxpay.common.Configure;
import com.lenovohit.hwe.pay.support.wxpay.common.RandomStringGenerator;
import com.lenovohit.hwe.pay.support.wxpay.common.Signature;
import com.lenovohit.hwe.pay.support.wxpay.protocol.BaseReqData;

/**
 * User: rizenguo
 * Date: 2014/10/25
 * Time: 16:12
 */
public class GetsignkeyReqData extends BaseReqData {

    //每个字段具体的意思请查看API文档
    private String mch_id = "";
    private String nonce_str = "";
    private String sign = "";

    public GetsignkeyReqData(Configuration configs){
    	
    	//设置配置
    	setConfigs(configs);

        //微信支付分配的商户号ID（开通公众号的微信支付功能之后可以获取到）
        setMch_id(this.getConfigs().getString("mchID"));//Configure.getMchid());

        //随机字符串，不长于32 位
        setNonce_str(RandomStringGenerator.getRandomStringByLength(32));

        //根据API给的签名规则进行签名
        String sign = Signature.getSign(this.getConfigs().getString("key"), toMap());
        setSign(sign);//把签名数据设置到Sign这个属性中

    }

    public String getMch_id() {
		return mch_id;
	}

	public void setMch_id(String mch_id) {
		this.mch_id = mch_id;
	}

	public String getNonce_str() {
		return nonce_str;
	}

	public void setNonce_str(String nonce_str) {
		this.nonce_str = nonce_str;
	}

	public String getSign() {
		return sign;
	}

	public void setSign(String sign) {
		this.sign = sign;
	}

	public Map<String,Object> toMap(){
        Map<String,Object> map = new HashMap<String, Object>();
        Field[] fields = this.getClass().getDeclaredFields();
        for (Field field : fields) {
            Object obj;
            try {
                obj = field.get(this);
                if(obj!=null){
                    map.put(field.getName(), obj);
                }
            } catch (IllegalArgumentException e) {
                e.printStackTrace();
            } catch (IllegalAccessException e) {
                e.printStackTrace();
            }
        }
        return map;
    }

}