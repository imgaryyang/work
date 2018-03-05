package com.lenovohit.hwe.pay.support.wxpay.scan.listener;

import com.lenovohit.hwe.pay.support.wxpay.scan.business.ScanPayQueryBusiness;
import com.lenovohit.hwe.pay.support.wxpay.scan.protocol.pay_query_protocol.ScanPayQueryResData;


/**
 * User: rizenguo
 * Date: 2014/12/2
 * Time: 19:08
 */
public class DefaultScanPayQueryBusinessResultListener implements ScanPayQueryBusiness.ResultListener {

    public static final String ON_FAIL_BY_RETURN_CODE_ERROR = "on_fail_by_return_code_error";
    public static final String ON_FAIL_BY_RETURN_CODE_FAIL = "on_fail_by_return_code_fail";
    public static final String ON_FAIL_BY_SIGN_INVALID = "on_fail_by_sign_invalid";
    public static final String ON_SCAN_PAY_QUERY_FAIL = "on_scan_pay_query_fail";
    public static final String ON_SCAN_PAY_QUERY_SUCCESS = "on_scan_pay_query_success";

    private String result = "";
    private ScanPayQueryResData scanPayQueryResData;

    @Override
    public void onFailByReturnCodeError(ScanPayQueryResData scanPayQueryResData) {
        result = ON_FAIL_BY_RETURN_CODE_ERROR;
		this.scanPayQueryResData = scanPayQueryResData;
    }

    @Override
    public void onFailByReturnCodeFail(ScanPayQueryResData scanPayQueryResData) {
        result = ON_FAIL_BY_RETURN_CODE_FAIL;
		this.scanPayQueryResData = scanPayQueryResData;
    }

    @Override
    public void onFailBySignInvalid(ScanPayQueryResData scanPayQueryResData) {
        result = ON_FAIL_BY_SIGN_INVALID;
		this.scanPayQueryResData = scanPayQueryResData;
    }

    @Override
    public void onScanPayQueryFail(ScanPayQueryResData scanPayQueryResData) {
        result = ON_SCAN_PAY_QUERY_FAIL;
		this.scanPayQueryResData = scanPayQueryResData;
    }

    @Override
    public void onScanPayQuerySuccess(ScanPayQueryResData scanPayQueryResData) {
        result = ON_SCAN_PAY_QUERY_SUCCESS;
		this.scanPayQueryResData = scanPayQueryResData;
    }

    public String getResult() {
        return result;
    }

    public void setResult(String result) {
        this.result = result;
    }

	public ScanPayQueryResData getScanPayQueryResData() {
		return scanPayQueryResData;
	}

	public void setScanPayQueryResData(ScanPayQueryResData scanPayQueryResData) {
		this.scanPayQueryResData = scanPayQueryResData;
	}

}
