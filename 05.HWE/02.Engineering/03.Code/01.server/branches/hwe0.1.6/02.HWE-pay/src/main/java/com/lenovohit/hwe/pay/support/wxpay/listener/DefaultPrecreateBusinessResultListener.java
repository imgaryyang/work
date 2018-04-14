package com.lenovohit.hwe.pay.support.wxpay.listener;

import com.lenovohit.hwe.pay.support.wxpay.business.PrecreateBusiness;
import com.lenovohit.hwe.pay.support.wxpay.protocol.precreate_protocol.PrecreateResData;

/**
 * User: rizenguo
 * Date: 2014/12/2
 * Time: 18:32
 */
public class DefaultPrecreateBusinessResultListener implements PrecreateBusiness.ResultListener {

    public static final String ON_FAIL_BY_RETURN_CODE_ERROR = "on_fail_by_return_code_error";
    public static final String ON_FAIL_BY_RETURN_CODE_FAIL = "on_fail_by_return_code_fail";
    public static final String ON_FAIL_BY_SIGN_INVALID = "on_fail_by_sign_invalid";
    public static final String ON_PRECREATE_FAIL = "on_precreate_fail";
    public static final String ON_PRECREATE_SUCCESS = "on_precreate_success";

    private String result = "";
    private PrecreateResData precreateResData;

    @Override
    public void onFailByReturnCodeError(PrecreateResData precreateResData) {
        result = ON_FAIL_BY_RETURN_CODE_ERROR;
		this.precreateResData = precreateResData;
    }

    @Override
    public void onFailByReturnCodeFail(PrecreateResData precreateResData) {
        result = ON_FAIL_BY_RETURN_CODE_FAIL;
		this.precreateResData = precreateResData;
    }

    @Override
    public void onFailBySignInvalid(PrecreateResData precreateResData) {
        result = ON_FAIL_BY_SIGN_INVALID;
		this.precreateResData = precreateResData;
    }

    @Override
    public void onPrecreateFail(PrecreateResData precreateResData) {
        result = ON_PRECREATE_FAIL;
		this.precreateResData = precreateResData;
    }

    @Override
    public void onPrecreateSuccess(PrecreateResData precreateResData) {
        result = ON_PRECREATE_SUCCESS;
		this.precreateResData = precreateResData;
    }

    public String getResult() {
        return result;
    }

    public void setResult(String result) {
        this.result = result;
    }

	public PrecreateResData getPrecreateResData() {
		return precreateResData;
	}

	public void setPrecreateResData(PrecreateResData precreateResData) {
		this.precreateResData = precreateResData;
	}

}
