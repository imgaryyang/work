package com.lenovohit.hwe.pay.support.wxpay.scan.protocol.getsignkey_protocol;

import com.lenovohit.hwe.pay.support.wxpay.scan.protocol.BaseResData;

/**
 * User: rizenguo
 * Date: 2014/10/25
 * Time: 16:12
 */
public class GetsignkeyResData extends BaseResData {

    //协议层
    private String return_code = "";
    private String return_msg = "";

    //协议返回的具体数据（以下字段在return_code 为SUCCESS 的时候有返回）
    private String mch_id = "";
    private String sandbox_signkey = "";
    
    
	public String getReturn_code() {
		return return_code;
	}
	public void setReturn_code(String return_code) {
		this.return_code = return_code;
	}
	public String getReturn_msg() {
		return return_msg;
	}
	public void setReturn_msg(String return_msg) {
		this.return_msg = return_msg;
	}
	public String getMch_id() {
		return mch_id;
	}
	public void setMch_id(String mch_id) {
		this.mch_id = mch_id;
	}
	public String getSandbox_signkey() {
		return sandbox_signkey;
	}
	public void setSandbox_signkey(String sandbox_signkey) {
		this.sandbox_signkey = sandbox_signkey;
	}
    
}
