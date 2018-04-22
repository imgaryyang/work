package com.lenovohit.ssm.payment.support.bankPay.service.impl;

import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.ssm.payment.support.bankPay.client.BankClient;
import com.lenovohit.ssm.payment.support.bankPay.client.BankSocketClient;
import com.lenovohit.ssm.payment.support.bankPay.config.Constants;
import com.lenovohit.ssm.payment.support.bankPay.model.BankTradeStatus;
import com.lenovohit.ssm.payment.support.bankPay.model.builder.BankCardQueryRequestBuilder;
import com.lenovohit.ssm.payment.support.bankPay.model.builder.BankDownloadRequestBuilder;
import com.lenovohit.ssm.payment.support.bankPay.model.builder.BankQueryRequestBuilder;
import com.lenovohit.ssm.payment.support.bankPay.model.builder.BankRefundRequestBuilder;
import com.lenovohit.ssm.payment.support.bankPay.model.request.BankCardQueryRequest;
import com.lenovohit.ssm.payment.support.bankPay.model.request.BankDownloadRequest;
import com.lenovohit.ssm.payment.support.bankPay.model.request.BankQueryRequest;
import com.lenovohit.ssm.payment.support.bankPay.model.request.BankRefundRequest;
import com.lenovohit.ssm.payment.support.bankPay.model.response.BankCardQueryResponse;
import com.lenovohit.ssm.payment.support.bankPay.model.response.BankDownloadResponse;
import com.lenovohit.ssm.payment.support.bankPay.model.response.BankQueryResponse;
import com.lenovohit.ssm.payment.support.bankPay.model.response.BankRefundResponse;
import com.lenovohit.ssm.payment.support.bankPay.model.result.BankCardQueryResult;
import com.lenovohit.ssm.payment.support.bankPay.model.result.BankDownloadResult;
import com.lenovohit.ssm.payment.support.bankPay.model.result.BankQueryResult;
import com.lenovohit.ssm.payment.support.bankPay.model.result.BankRefundResult;
import com.lenovohit.ssm.payment.support.bankPay.service.BankTradeService;

/**
 * Created by zyus
 *
 */
public class BankTradeServiceImpl extends AbsBankTradeService implements BankTradeService {
	protected BankClient client;
	protected ClientBuilder clientBuilder;
	
    public static class ClientBuilder {

    	private String frontIp;
    	private int frontPort = 0;
        private String charset = "utf-8";

        public BankTradeServiceImpl build(String frontIp, int frontPort, String charset) {
            if (!StringUtils.isEmpty(frontIp)) {
            	this.frontIp = frontIp; 
            }
            if (frontPort != 0 ) {
                this.frontPort = frontPort;
            }
            if (!StringUtils.isEmpty(charset)) {
                this.charset = charset;
            }

            return new BankTradeServiceImpl(this);
        }
        
        public BankTradeServiceImpl build(ClientBuilder clientBuilder){
            return new BankTradeServiceImpl(clientBuilder);
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

    public BankTradeServiceImpl(ClientBuilder builder) {
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
        client = new BankSocketClient(builder.getFrontIp(), builder.getFrontPort(), builder.getCharset());
    }
    
    @Override
    public BankRefundResult tradeRefund(BankRefundRequestBuilder builder) {
        
    	validateBuilder(builder);

        BankRefundRequest request = new BankRefundRequest();
        request.setContentBytes(builder.getContentBytes(clientBuilder.charset));
        log.info("trade.refund content:【" + builder.toString() + "】");
        
        BankRefundResponse response = (BankRefundResponse) getResponse(client, request);

        BankRefundResult result = new BankRefundResult(response);
        if (response != null && Constants.SUCCESS.equals(response.getRespCode())) {
            // 退货交易成功
            result.setTradeStatus(BankTradeStatus.SUCCESS);
        } else if (response != null && Constants.REFUNDING.equals(response.getRespCode())) {
            // 退货交易处理中
            result.setTradeStatus(BankTradeStatus.REFUNDING);
        } else if (response != null && !StringUtils.isBlank(response.getRespCode())){
            // 其他情况表明该订单退货明确失败
            result.setTradeStatus(BankTradeStatus.FAILED);
        } else {
            // 其他情况表明该订单退货交易异常
            result.setTradeStatus(BankTradeStatus.UNKNOWN);
        }
        
        return result;
    }
    
    @Override
    public BankQueryResult tradeQuery(BankQueryRequestBuilder builder) {
        
    	validateBuilder(builder);

        BankQueryRequest request = new BankQueryRequest();
        request.setContentBytes(builder.getContentBytes(clientBuilder.charset));
        log.info("trade.query content:【" + builder.toString() + "】");

        BankQueryResponse response = (BankQueryResponse) getResponse(client, request);

        BankQueryResult result = new BankQueryResult(response);
        if (response != null && Constants.SUCCESS.equals(response.getRespCode())) {
            // 退货交易成功
            result.setTradeStatus(BankTradeStatus.SUCCESS);
        } else if (response != null && Constants.REFUNDING.equals(response.getRespCode())) {
            // 退货交易处理中
            result.setTradeStatus(BankTradeStatus.REFUNDING);
        } else if (response != null && !StringUtils.isBlank(response.getRespCode())){
            // 其他情况表明该订单退货明确失败
            result.setTradeStatus(BankTradeStatus.FAILED);
        } else {
            // 其他情况表明该订单退货异常
            result.setTradeStatus(BankTradeStatus.UNKNOWN);
        }
        
        return result;
    }

	@Override
	public BankCardQueryResult tradeCardQuery(BankCardQueryRequestBuilder builder) {
        
    	validateBuilder(builder);

        BankCardQueryRequest request = new BankCardQueryRequest();
        request.setContentBytes(builder.getContentBytes(clientBuilder.charset));
        log.info("trade.cardQuery content:【" + builder.toString() + "】");

        BankCardQueryResponse response = (BankCardQueryResponse) getResponse(client, request);

        BankCardQueryResult result = new BankCardQueryResult(response);
        if (response != null && Constants.SUCCESS.equals(response.getRespCode())) {
            // 退货交易成功
            result.setTradeStatus(BankTradeStatus.SUCCESS);
        } else if (response != null && !StringUtils.isBlank(response.getRespCode())){
            // 其他情况表明该订单退货明确失败
            result.setTradeStatus(BankTradeStatus.FAILED);
        } else {
            // 其他情况表明该订单退货异常
            result.setTradeStatus(BankTradeStatus.UNKNOWN);
        }
        
        return result;
    }

	@Override
	public BankDownloadResult tradeDownloadFile(BankDownloadRequestBuilder builder) {
        
    	validateBuilder(builder);

        BankDownloadRequest request = new BankDownloadRequest();
        request.setContentBytes(builder.getContentBytes(clientBuilder.charset));
        request.setFilePath(builder.getFilePath());
        log.info("trade.downloadFile content:【" + builder.toString() + "】");
        
        BankDownloadResponse response = null;
        switch (builder.getSyncType()) {
	        case "socket":
	        	response = (BankDownloadResponse) getFileResponse(client, request); 
	            break;
	        default :
	        	response = (BankDownloadResponse) getResponse(client, request); 
	            break;
	    }

        BankDownloadResult result = new BankDownloadResult(response);
        if (response != null && Constants.SUCCESS.equals(response.getRespCode())) {
            // 获取对账文件交易成功
            result.setTradeStatus(BankTradeStatus.SUCCESS);
        }  else if (response != null && !StringUtils.isBlank(response.getRespCode())){
            // 其他情况表明获取对账文件失败
            result.setTradeStatus(BankTradeStatus.FAILED);
        } else {
            // 其他情况表明获取对账文件异常
            result.setTradeStatus(BankTradeStatus.UNKNOWN);
        }
        
        return result;
    }
	
}
