package com.test;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.lenovohit.ssm.payment.schedule.TradeSchedule;
import com.lenovohit.ssm.payment.support.bankPay.config.Constants;
import com.lenovohit.ssm.payment.support.bankPay.model.builder.BankCardQueryRequestBuilder;
import com.lenovohit.ssm.payment.support.bankPay.model.builder.BankDownloadRequestBuilder;
import com.lenovohit.ssm.payment.support.bankPay.model.builder.BankQueryRequestBuilder;
import com.lenovohit.ssm.payment.support.bankPay.model.builder.BankRefundRequestBuilder;
import com.lenovohit.ssm.payment.support.bankPay.model.result.BankCardQueryResult;
import com.lenovohit.ssm.payment.support.bankPay.model.result.BankDownloadResult;
import com.lenovohit.ssm.payment.support.bankPay.model.result.BankQueryResult;
import com.lenovohit.ssm.payment.support.bankPay.model.result.BankRefundResult;
import com.lenovohit.ssm.payment.support.bankPay.service.BankTradeService;
import com.lenovohit.ssm.payment.support.bankPay.service.impl.BankTradeServiceImpl;

/**
 * Created by zyus.
 * 简单main函数，用于测试银行Socket 接口
 */
public class BankServiceTest {
    private static Log                  log = LogFactory.getLog(BankServiceTest.class);

    public static void main(String[] args) {
        BankServiceTest main = new BankServiceTest();
        
        main.test_trade_refund_query();
    }


    // 退款
    public void test_trade_refund() {
		BankRefundRequestBuilder builder = new BankRefundRequestBuilder()
				.setLength(Constants.TRADE_REFUND_REQ_SIZE).setCode(Constants.TRADE_CODE_REFUND)
				.setHisCode(Constants.HIS_CODE).setBankCode("0103")
				.setOutTradeNo("SR17102712345601")
				.setOutTradeDate("20171027")
				.setOutTradeTime("112200")
				.setCardBankCode("305100000013")
				.setAccount("6226200101707181")
				.setAccountName("刘永江")
				.setAmount("305.15");
		BankTradeServiceImpl.ClientBuilder clientBuilder = new BankTradeServiceImpl.ClientBuilder()
				.setFrontIp("127.0.0.1")
				.setFrontPort(2017)
				.setCharset("UTF-8");
		
		BankTradeService bankTradeService = new BankTradeServiceImpl.ClientBuilder().build(clientBuilder);
		BankRefundResult result = bankTradeService.tradeRefund(builder);
		System.out.println("service response" + result);
		switch (result.getTradeStatus()) {
			case SUCCESS:
				log.info("银行退款成功，退款流水号: ");
				break;
			case REFUNDING:
				log.info("银行退款处理中，退款流水号: ");
				break;
			case FAILED:
				log.error("银行退款失败!!!");
				break;
			case UNKNOWN:
				log.error("系统异常，银行退款状态未知!!!");
				break;
		}
	
    }

    // 退款查询
    public void test_trade_refund_query() {
    	BankQueryRequestBuilder builder = new BankQueryRequestBuilder()
				.setLength(Constants.TRADE_QUERY_REQ_SIZE).setCode(Constants.TRADE_CODE_QUERY)
				.setHisCode(Constants.HIS_CODE).setBankCode("0103")
				.setTradeType("02").setOutTradeNo("SR17102712345601")
				.setOutTradeDate("20171027")
				.setOutTradeTime("000000");
    	BankTradeServiceImpl.ClientBuilder clientBuilder = new BankTradeServiceImpl.ClientBuilder()
				.setFrontIp("127.0.0.1")
				.setFrontPort(2017)
				.setCharset("UTF-8");
		
		BankTradeService bankTradeService = new BankTradeServiceImpl.ClientBuilder().build(clientBuilder);
		BankQueryResult result = bankTradeService.tradeQuery(builder);
		System.out.println("service response" + result);
		switch (result.getTradeStatus()) {
			case SUCCESS:
				log.info("银行退款交易查询成功！！！");
				break;
			case REFUNDING:
				break;
			case FAILED:
				log.error("银行卡退款交易查询失败！！！");
				break;
			case UNKNOWN:
	    		log.error("系统异常，订单支付状态未知!!!");
	    		break;
		}
	
    }
    
    // 卡查询
    public void test_trade_card_query() {
		BankCardQueryRequestBuilder builder = new BankCardQueryRequestBuilder()
    			.setLength(Constants.TRADE_CARD_REQ_SIZE).setCode(Constants.TRADE_CODE_CARD)
    			.setHisCode(Constants.HIS_CODE).setBankCode("0103")
    			.setAccount("6228480868684263270");
    	BankTradeServiceImpl.ClientBuilder clientBuilder = new BankTradeServiceImpl.ClientBuilder()
    			.setFrontIp("127.0.0.1")
    			.setFrontPort(2017)
    			.setCharset("UTF-8");
    	
    	BankTradeService bankTradeService = new BankTradeServiceImpl.ClientBuilder().build(clientBuilder);
    	BankCardQueryResult result = bankTradeService.tradeCardQuery(builder);
    	System.out.println("service response" + result);
    	switch (result.getTradeStatus()) {
			case SUCCESS:
				log.info("银行卡状态成功");
				break;
			case REFUNDING:
				break;
			case FAILED:
				log.error("银行卡状态失败");
				break;
			case UNKNOWN:
				log.error("银行卡状态查询系统异常");
				break;
		}
    	
    }
   
    // 同步对账文件
    public void test_trade_download_file() {
		BankDownloadRequestBuilder builder = new BankDownloadRequestBuilder()
    			.setLength(Constants.TRADE_CHECK_REQ_SIZE).setCode(Constants.TRADE_CODE_CHECK)
    			.setHisCode(Constants.HIS_CODE).setBankCode("0103")
    			.setCheckDate("20171011")
				.setSyncType("socket")
				.setFilePath(TradeSchedule.CHECK_DIR + "/0103/");
    	BankTradeServiceImpl.ClientBuilder clientBuilder = new BankTradeServiceImpl.ClientBuilder()
    			.setFrontIp("127.0.0.1")
    			.setFrontPort(2017)
    			.setCharset("UTF-8");
    	
    	BankTradeService bankTradeService = new BankTradeServiceImpl.ClientBuilder().build(clientBuilder);
    	BankDownloadResult result = bankTradeService.tradeDownloadFile(builder);
    	System.out.println("service response" + result);
    	switch (result.getTradeStatus()) {
		case SUCCESS:
            log.info("银行获取对账文件地址成功!!!)");
			break;
		case REFUNDING:
			break;
		case FAILED:
			log.error("银行获取对账文件地址失败!!!)");
			break;
		case UNKNOWN:
			log.error("银行获取对账文件地址系统异常!!!");
			break;
    	}
    	
    }
    
    // 同步退汇文件
    public void test_trade_return_file() {
		BankDownloadRequestBuilder builder = new BankDownloadRequestBuilder()
    			.setLength(Constants.TRADE_RETURN_REQ_SIZE).setCode(Constants.TRADE_CODE_RETURN)
    			.setHisCode(Constants.HIS_CODE).setBankCode("0103")
    			.setCheckDate("20171012")
				.setSyncType("socket")
				.setFilePath(TradeSchedule.CHECK_DIR + "/0103/");
    	BankTradeServiceImpl.ClientBuilder clientBuilder = new BankTradeServiceImpl.ClientBuilder()
    			.setFrontIp("127.0.0.1")
    			.setFrontPort(2017)
    			.setCharset("UTF-8");
    	
    	BankTradeService bankTradeService = new BankTradeServiceImpl.ClientBuilder().build(clientBuilder);
    	BankDownloadResult result = bankTradeService.tradeDownloadFile(builder);
    	System.out.println("service response" + result);
    	switch (result.getTradeStatus()) {
		case SUCCESS:
            log.info("银行获取退汇文件地址成功!!!)");
			break;
		case REFUNDING:
			break;
		case FAILED:
			log.error("银行获取退汇文件地址失败!!!)");
			break;
		case UNKNOWN:
			log.error("银行获取退汇文件地址系统异常!!!");
			break;
    	}
    	
    }
}
