package com.lenovohit.ssm.payment.support.cmbPay.service.impl;

import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.ssm.payment.support.cmbPay.client.CmbClient;
import com.lenovohit.ssm.payment.support.cmbPay.client.CmbSocketClient;
import com.lenovohit.ssm.payment.support.cmbPay.config.Configs;
import com.lenovohit.ssm.payment.support.cmbPay.service.CmbTradeService;
import com.lenovohit.ssm.payment.support.cmbPay.utils.XmlPacket;

/**
 * Created by zyus
 *
 */
public class CmbTradeServiceImpl extends AbsCmbTradeService implements CmbTradeService {
	protected CmbClient client;
	protected ClientBuilder clientBuilder;
	
    public static class ClientBuilder {

    	private String frontIp;
    	private int frontPort = 0;
        private String charset = "GBK";

        public CmbTradeServiceImpl build() {
        	if (!StringUtils.isEmpty(Configs.getFrontIp())) {
        		this.frontIp = Configs.getFrontIp(); 
        	}
        	if (frontPort != Configs.getFrontPort() ) {
        		this.frontPort = Configs.getFrontPort();
        	}
        	
        	return new CmbTradeServiceImpl(this);
        }
        
        public CmbTradeServiceImpl build(String frontIp, int frontPort, String charset) {
            if (!StringUtils.isEmpty(frontIp)) {
            	this.frontIp = frontIp; 
            }
            if (frontPort != 0 ) {
                this.frontPort = frontPort;
            }
            if (!StringUtils.isEmpty(charset)) {
                this.charset = charset;
            }

            return new CmbTradeServiceImpl(this);
        }
        
        public CmbTradeServiceImpl build(ClientBuilder clientBuilder){
            return new CmbTradeServiceImpl(clientBuilder);
        }

		public String getFrontIp() {
			return frontIp;
		}

		public ClientBuilder setFrontIp(String frontIp) {
			this.frontIp = frontIp;
			return this;
		}

		public int getFrontPort() {
			return frontPort;
		}

		public ClientBuilder setFrontPort(int frontPort) {
			this.frontPort = frontPort;
			return this;
		}

		public String getCharset() {
			return charset;
		}

		public ClientBuilder setCharset(String charset) {
			this.charset = charset;
			return this;
		}
        
    }

    public CmbTradeServiceImpl(ClientBuilder builder) {
        if (StringUtils.isEmpty(builder.getFrontIp())) {
            throw new NullPointerException("frontIp should not be NULL!");
        }
        if (StringUtils.isEmpty(builder.getFrontPort()) || builder.getFrontPort() == 0) {
            throw new NullPointerException("frontPort should not be NULL! or 0");
        }
        if (StringUtils.isEmpty(builder.getCharset())) {
            throw new NullPointerException("charset should not be NULL!");
        }
        clientBuilder = builder;
        client = new CmbSocketClient(builder.getFrontIp(), builder.getFrontPort(), builder.getCharset());
    }
    
    @Override
    public XmlPacket tradeRefund(XmlPacket request) {
        
    	validateBuilder(request);
    	return getResponse(client, request);
    }
    
    @Override
    public XmlPacket tradeQuery(XmlPacket request) {
        
    	validateBuilder(request);
    	return getResponse(client, request);
    }

	@Override
	public XmlPacket tradeCardQuery(XmlPacket request) {
        
    	validateBuilder(request);
    	return getResponse(client, request);
    }

	@Override
	public XmlPacket tradeDownloadFile(XmlPacket request) {
        
    	validateBuilder(request);
    	return getResponse(client, request);
    }
	
}
