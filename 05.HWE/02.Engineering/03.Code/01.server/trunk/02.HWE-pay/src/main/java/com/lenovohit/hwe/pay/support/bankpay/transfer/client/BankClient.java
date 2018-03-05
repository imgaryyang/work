package com.lenovohit.hwe.pay.support.bankpay.transfer.client;

import com.lenovohit.core.exception.BaseException;
import com.lenovohit.hwe.pay.support.bankpay.transfer.model.request.BankFileRequest;
import com.lenovohit.hwe.pay.support.bankpay.transfer.model.request.BankRequest;
import com.lenovohit.hwe.pay.support.bankpay.transfer.model.response.BankResponse;

public interface BankClient {

    /**
     * @param <T>
     * @param request
     * @return
     * @throws BaseException
     */
    public <T extends BankResponse> T execute(BankRequest<T> request) throws BaseException;
    

    /**
     * @param <T>
     * @param request
     * @return
     * @throws BaseException
     */
    public <T extends BankResponse> T executeFile(BankFileRequest<T> request) throws BaseException;
	
}
