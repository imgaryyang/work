package com.lenovohit.ssm.payment.support.wxPay.listener;

import com.lenovohit.ssm.payment.support.wxPay.business.ScanPayBusiness;
import com.lenovohit.ssm.payment.support.wxPay.protocol.pay_protocol.ScanPayResData;


/**
 * User: rizenguo
 * Date: 2014/12/2
 * Time: 10:41
 *
 */
public class DefaultScanPayBusinessResultListener implements ScanPayBusiness.ResultListener{

    public static final String ON_FAIL_BY_RETURN_CODE_ERROR = "on_fail_by_return_code_error";
    public static final String ON_FAIL_BY_RETURN_CODE_FAIL = "on_fail_by_return_code_fail";
    public static final String ON_FAIL_BY_SIGN_INVALID = "on_fail_by_sign_invalid";

    public static final String ON_FAIL_BY_QUERY_SIGN_INVALID = "on_fail_by_query_sign_invalid";
    public static final String ON_FAIL_BY_REVERSE_SIGN_INVALID = "on_fail_by_query_service_sign_invalid";

    public static final String ON_FAIL_BY_AUTH_CODE_EXPIRE = "on_fail_by_auth_code_expire";
    public static final String ON_FAIL_BY_AUTH_CODE_INVALID = "on_fail_by_auth_code_invalid";
    public static final String ON_FAIL_BY_MONEY_NOT_ENOUGH = "on_fail_by_money_not_enough";
    


    public static final String ON_FAIL = "on_fail";
    public static final String ON_SUCCESS = "on_success";

    private String result = "";
    private String transcationID = "";
    private ScanPayResData scanPayResData;

    @Override
    /**
     * 遇到这个问题一般是程序没按照API规范去正确地传递参数导致，请仔细阅读API文档里面的字段说明
     */
    public void onFailByReturnCodeError(ScanPayResData scanPayResData) {
        result = ON_FAIL_BY_RETURN_CODE_ERROR;
        this.scanPayResData = scanPayResData;
    }

    @Override
    /**
     * 同上，遇到这个问题一般是程序没按照API规范去正确地传递参数导致，请仔细阅读API文档里面的字段说明
     */
    public void onFailByReturnCodeFail(ScanPayResData scanPayResData) {
        result = ON_FAIL_BY_RETURN_CODE_FAIL;
        this.scanPayResData = scanPayResData;
    }

    @Override
    /**
     * 支付请求API返回的数据签名验证失败，有可能数据被篡改了。遇到这种错误建议商户直接告警，做好安全措施
     */
    public void onFailBySignInvalid(ScanPayResData scanPayResData) {
        result = ON_FAIL_BY_SIGN_INVALID;
        this.scanPayResData = scanPayResData;
    }

    @Override
    /**
     * 用户用来支付的二维码已经过期，提示收银员重新扫一下用户微信“刷卡”里面的二维码"
     */
    public void onFailByAuthCodeExpire(ScanPayResData scanPayResData) {
        result = ON_FAIL_BY_AUTH_CODE_EXPIRE;
        this.scanPayResData = scanPayResData;
    }

    @Override
    /**
     * 授权码无效，提示用户刷新一维码/二维码，之后重新扫码支付
     */
    public void onFailByAuthCodeInvalid(ScanPayResData scanPayResData) {
        result = ON_FAIL_BY_AUTH_CODE_INVALID;
        this.scanPayResData = scanPayResData;
    }

    @Override
    /**
     * 用户余额不足，换其他卡支付或是用现金支付
     */
    public void onFailByMoneyNotEnough(ScanPayResData scanPayResData) {
        result = ON_FAIL_BY_MONEY_NOT_ENOUGH;
        this.scanPayResData = scanPayResData;
    }
    
    @Override
    /**
     * 支付失败，其他原因导致，这种情况建议把log记录好
     */
    public void onFail(ScanPayResData scanPayResData) {
        result = ON_FAIL;
        this.scanPayResData = scanPayResData;
    }


    @Override
    /**
     * 恭喜，支付成功，请返回成功结果
     */
    public void onSuccess(ScanPayResData scanPayResData) {
        result = ON_SUCCESS;
        this.scanPayResData = scanPayResData;
    }

    public String getResult() {
        return result;
    }

    public void setResult(String result) {
        this.result = result;
    }

    public String getTranscationID() {
        return transcationID;
    }

    public void setTranscationID(String transcationID) {
        this.transcationID = transcationID;
    }

	public ScanPayResData getScanPayResData() {
		return scanPayResData;
	}

	public void setScanPayResData(ScanPayResData scanPayResData) {
		this.scanPayResData = scanPayResData;
	}
    
    
}
