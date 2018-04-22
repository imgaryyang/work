package com.lenovohit.ssm.payment.support.cmbPay.client;

import com.lenovohit.core.exception.BaseException;
import com.lenovohit.ssm.payment.support.cmbPay.utils.XmlPacket;

public interface CmbClient {

    /**
     * @param
     * @param request
     * @return
     * @throws BaseException
     */
    public XmlPacket execute(XmlPacket request) throws BaseException;
    

    /**
     * @param 
     * @param request
     * @return
     * @throws BaseException
     */
    public XmlPacket executeFile(XmlPacket request) throws BaseException;
	
}
