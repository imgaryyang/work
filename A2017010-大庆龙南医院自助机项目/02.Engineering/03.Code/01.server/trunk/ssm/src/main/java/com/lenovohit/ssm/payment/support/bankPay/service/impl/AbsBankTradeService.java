package com.lenovohit.ssm.payment.support.bankPay.service.impl;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.lenovohit.ssm.payment.support.bankPay.client.BankClient;
import com.lenovohit.ssm.payment.support.bankPay.model.builder.BankRequestBuilder;
import com.lenovohit.ssm.payment.support.bankPay.model.request.BankFileRequest;
import com.lenovohit.ssm.payment.support.bankPay.model.request.BankRequest;
import com.lenovohit.ssm.payment.support.bankPay.model.response.BankResponse;

/**
 * Created by zyus
 */
abstract class AbsBankTradeService {
    protected Log log = LogFactory.getLog(getClass());

    // 验证builder
    protected void validateBuilder(BankRequestBuilder builder) {
        if (builder == null) {
            throw new NullPointerException("builder should not be NULL!");
        }

        if (!builder.validate()) {
            throw new IllegalStateException("builder validate failed! " + builder.toString());
        }
    }

    @SuppressWarnings({ "rawtypes", "unchecked" })
	protected BankResponse getResponse(BankClient client, BankRequest request) {
		try {
			return client.execute(request);
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}
    @SuppressWarnings({ "rawtypes", "unchecked" })
    protected BankResponse getFileResponse(BankClient client, BankFileRequest request) {
        try {
        	 return  client.executeFile(request);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
