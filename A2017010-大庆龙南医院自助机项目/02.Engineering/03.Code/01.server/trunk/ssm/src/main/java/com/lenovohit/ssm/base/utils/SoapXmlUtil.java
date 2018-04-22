package com.lenovohit.ssm.base.utils;

import java.io.ByteArrayInputStream;
import java.util.Iterator;

import javax.xml.soap.MessageFactory;
import javax.xml.soap.MimeHeaders;
import javax.xml.soap.SOAPBody;
import javax.xml.soap.SOAPElement;
import javax.xml.soap.SOAPMessage;

import com.lenovohit.ssm.treat.model.PacsRecord;

public class SoapXmlUtil {

	/**
     * 解析soapXML
     * @param soapXML
     * @return
     */
    public static PacsRecord parseSoapMessage(String soapXML) {
    	PacsRecord pacsRecord = new PacsRecord();
        try {
            SOAPMessage msg = formatSoapString(soapXML);
            SOAPBody body = msg.getSOAPBody();
            Iterator<SOAPElement> iterator = body.getChildElements();
            parse(iterator, pacsRecord);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return pacsRecord;
    }

    /**
     * 把soap字符串格式化为SOAPMessage
     * 
     * @param soapString
     * @return
     * @see [类、类#方法、类#成员]
     */
    public static SOAPMessage formatSoapString(String soapString) {
        MessageFactory msgFactory;
        try {
            msgFactory = MessageFactory.newInstance();
            SOAPMessage reqMsg = msgFactory.createMessage(new MimeHeaders(),
                    new ByteArrayInputStream(soapString.getBytes("UTF-8")));
            reqMsg.saveChanges();
            return reqMsg;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
    
    /**
     * 解析soap xml
     * @param iterator
     * @param resultBean
     */
    public static void parse(Iterator<SOAPElement> iterator, PacsRecord pacsRecord) {
        while (iterator.hasNext()) {
            SOAPElement element = iterator.next();
            if ("soap:Envelope".equals(element.getNodeName())) {
                continue;
            } else if ("soap:Body".equals(element.getNodeName())) {
            	continue;
            } else if ("DownLoadPdfResponse".equals(element.getNodeName())){
            	Iterator<SOAPElement> it = element.getChildElements();
                SOAPElement el = null;
                while (it.hasNext()) {
                    el = it.next();
                    if ("DownLoadPdfResult".equals(el.getLocalName())) {
                    	pacsRecord.setDownLoadPdfResult(null != el.getValue() ? el.getValue() : "");
                    } else if("error".equals(el.getLocalName())) {
                    	pacsRecord.setError(null != el.getValue() ? el.getValue() : "");
                    }
                }
            } 
            else if (null == element.getValue()
                    && element.getChildElements().hasNext()) {
                parse(element.getChildElements(), pacsRecord);
            }
        }
    }
    
    public static void PrintBody(Iterator<SOAPElement> iterator, String side) {
        while (iterator.hasNext()) {
            SOAPElement element = (SOAPElement) iterator.next();
            if (null == element.getValue() && element.getChildElements().hasNext()) {
                PrintBody(element.getChildElements(), null);
            }
        }
    }
    
}
