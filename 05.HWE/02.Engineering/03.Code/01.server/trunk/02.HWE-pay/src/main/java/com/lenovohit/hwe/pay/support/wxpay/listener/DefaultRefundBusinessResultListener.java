package com.lenovohit.hwe.pay.support.wxpay.listener;

import com.lenovohit.hwe.pay.support.wxpay.business.RefundBusiness;
import com.lenovohit.hwe.pay.support.wxpay.protocol.refund_protocol.RefundResData;

/**
 * User: rizenguo
 * Date: 2014/12/2
 * Time: 18:32
 */
public class DefaultRefundBusinessResultListener implements RefundBusiness.ResultListener {

    public static final String ON_FAIL_BY_RETURN_CODE_ERROR = "on_fail_by_return_code_error";
    public static final String ON_FAIL_BY_RETURN_CODE_FAIL = "on_fail_by_return_code_fail";
    public static final String ON_FAIL_BY_SIGN_INVALID = "on_fail_by_sign_invalid";
    public static final String ON_REFUND_FAIL = "on_refund_fail";
    public static final String ON_REFUND_SUCCESS = "on_refund_success";

    private String result = "";
    private RefundResData refundResData;

    @Override
    public void onFailByReturnCodeError(RefundResData refundResData) {
        result = ON_FAIL_BY_RETURN_CODE_ERROR;
		this.refundResData = refundResData;
    }

    @Override
    public void onFailByReturnCodeFail(RefundResData refundResData) {
        result = ON_FAIL_BY_RETURN_CODE_FAIL;
		this.refundResData = refundResData;
    }

    @Override
    public void onFailBySignInvalid(RefundResData refundResData) {
        result = ON_FAIL_BY_SIGN_INVALID;
		this.refundResData = refundResData;
    }

    @Override
    public void onRefundFail(RefundResData refundResData) {
        result = ON_REFUND_FAIL;
		this.refundResData = refundResData;
    }

    @Override
    public void onRefundSuccess(RefundResData refundResData) {
        result = ON_REFUND_SUCCESS;
		this.refundResData = refundResData;
    }

    public String getResult() {
        return result;
    }

    public void setResult(String result) {
        this.result = result;
    }

	public RefundResData getRefundResData() {
		return refundResData;
	}

	public void setRefundResData(RefundResData refundResData) {
		this.refundResData = refundResData;
	}

}
