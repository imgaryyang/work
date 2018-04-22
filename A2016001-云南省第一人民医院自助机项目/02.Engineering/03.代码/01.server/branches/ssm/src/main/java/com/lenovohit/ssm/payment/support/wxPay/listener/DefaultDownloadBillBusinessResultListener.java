package com.lenovohit.ssm.payment.support.wxPay.listener;

import com.lenovohit.ssm.payment.support.wxPay.business.DownloadBillBusiness;
import com.lenovohit.ssm.payment.support.wxPay.protocol.downloadbill_protocol.DownloadBillResData;

/**
 * User: rizenguo
 * Date: 2014/12/3
 * Time: 10:42
 */
public class DefaultDownloadBillBusinessResultListener implements DownloadBillBusiness.ResultListener {

    public static final String ON_FAIL_BY_RETURN_CODE_ERROR = "on_fail_by_return_code_error";
    public static final String ON_FAIL_BY_RETURN_CODE_FAIL = "on_fail_by_return_code_fail";
    public static final String ON_DOWNLOAD_BILL_FAIL = "on_download_bill_fail";
    public static final String ON_DOWNLOAD_BILL_SUCCESS = "on_download_bill_success";

    private String result = "";
    private String response;
    private DownloadBillResData downloadBillResData;
    

    @Override
    public void onFailByReturnCodeError(DownloadBillResData downloadBillResData) {
        result = ON_FAIL_BY_RETURN_CODE_ERROR;
		this.downloadBillResData = downloadBillResData;
    }

    @Override
    public void onFailByReturnCodeFail(DownloadBillResData downloadBillResData) {
        result = ON_FAIL_BY_RETURN_CODE_FAIL;
		this.downloadBillResData = downloadBillResData;
    }

    @Override
    public void onDownloadBillFail(String response) {
        result = ON_DOWNLOAD_BILL_FAIL;
		this.response = response;
    }

    @Override
    public void onDownloadBillSuccess(String response) {
        result = ON_DOWNLOAD_BILL_SUCCESS;
		this.response = response;
    }

    public String getResult() {
        return result;
    }

    public void setResult(String result) {
        this.result = result;
    }

	public String getResponse() {
		return response;
	}

	public void setResponse(String response) {
		this.response = response;
	}

	public DownloadBillResData getDownloadBillResData() {
		return downloadBillResData;
	}

	public void setDownloadBillResData(DownloadBillResData downloadBillResData) {
		this.downloadBillResData = downloadBillResData;
	}

}
