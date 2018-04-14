package com.lenovohit.hwe.pay.support.cmbpay.transfer.service.impl;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.lenovohit.hwe.pay.support.cmbpay.transfer.client.CmbClient;
import com.lenovohit.hwe.pay.support.cmbpay.transfer.utils.XmlPacket;

/**
 * Created by zyus
 */
abstract class AbsCmbTradeService {
    protected Log log = LogFactory.getLog(getClass());

    // 验证request
    protected void validateBuilder(XmlPacket request) {
        if (request == null) {
            throw new NullPointerException("request should not be NULL!");
        }
    }

	protected XmlPacket getResponse(CmbClient client, XmlPacket request) {
		try {
			return client.execute(request);
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}
	
    protected XmlPacket getFileResponse(CmbClient client, XmlPacket request) {
        try {
        	 return  client.executeFile(request);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
