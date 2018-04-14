package com.lenovohit.hwe.pay.support.cmbpay.transfer.client;

import com.lenovohit.core.exception.BaseException;
import com.lenovohit.hwe.pay.support.cmbpay.transfer.utils.XmlPacket;

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
