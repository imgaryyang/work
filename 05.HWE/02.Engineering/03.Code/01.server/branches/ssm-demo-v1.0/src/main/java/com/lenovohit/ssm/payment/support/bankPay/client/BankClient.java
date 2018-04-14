package com.lenovohit.ssm.payment.support.bankPay.client;

import com.lenovohit.core.exception.BaseException;
import com.lenovohit.ssm.payment.support.bankPay.model.request.BankFileRequest;
import com.lenovohit.ssm.payment.support.bankPay.model.request.BankRequest;
import com.lenovohit.ssm.payment.support.bankPay.model.response.BankResponse;

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
