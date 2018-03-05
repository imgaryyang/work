package com.lenovohit.hwe.pay.support.wxpay.scan.listener;

import com.lenovohit.hwe.pay.support.wxpay.scan.business.PayCallbackBusiness;
import com.lenovohit.hwe.pay.support.wxpay.scan.protocol.pay_callback.PayCallbackResData;

/**
 * User: rizenguo
 * Date: 2014/12/2
 * Time: 18:32
 */
public class DefaultPayCallbackBusinessResultListener implements PayCallbackBusiness.ResultListener {

    public static final String ON_FAIL_BY_RETURN_CODE_ERROR = "on_fail_by_return_code_error";
    public static final String ON_FAIL_BY_RETURN_CODE_FAIL = "on_fail_by_return_code_fail";
    public static final String ON_FAIL_BY_SIGN_INVALID = "on_fail_by_sign_invalid";
    public static final String ON_PAY_CALLBACK_FAIL = "on_pay_callback_fail";
    public static final String ON_PAY_CALLBACK_SUCCESS = "on_pay_callback_success";

    private String result = "";
    private PayCallbackResData payCallbackResData;

    @Override
    public void onFailByReturnCodeError(PayCallbackResData payCallbackResData) {
        result = ON_FAIL_BY_RETURN_CODE_ERROR;
		this.payCallbackResData = payCallbackResData;
    }

    @Override
    public void onFailByReturnCodeFail(PayCallbackResData payCallbackResData) {
        result = ON_FAIL_BY_RETURN_CODE_FAIL;
		this.payCallbackResData = payCallbackResData;
    }

    @Override
    public void onFailBySignInvalid(PayCallbackResData payCallbackResData) {
        result = ON_FAIL_BY_SIGN_INVALID;
		this.payCallbackResData = payCallbackResData;
    }

    @Override
    public void onFail(PayCallbackResData payCallbackResData) {
        result = ON_PAY_CALLBACK_FAIL;
		this.payCallbackResData = payCallbackResData;
    }

    @Override
    public void onSuccess(PayCallbackResData payCallbackResData) {
        result = ON_PAY_CALLBACK_SUCCESS;
		this.payCallbackResData = payCallbackResData;
    }

    public String getResult() {
        return result;
    }

    public void setResult(String result) {
        this.result = result;
    }

	public PayCallbackResData getPayCallbackResData() {
		return payCallbackResData;
	}

	public void setPayCallbackResData(PayCallbackResData payCallbackResData) {
		this.payCallbackResData = payCallbackResData;
	}

}
