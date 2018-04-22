package com.test;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.lenovohit.ssm.payment.support.bankPay.config.Constants;
import com.lenovohit.ssm.payment.support.bankPay.model.builder.BankRefundRequestBuilder;
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

        // 系统商商测试交易保障接口api
        //        main.test_monitor_sys();

        // POS厂商测试交易保障接口api
        //        main.test_monitor_pos();

        // 测试交易保障接口调度
        //        main.test_monitor_schedule_logic();

        // 测试当面付2.0支付（使用未集成交易保障接口的当面付2.0服务）
        //        main.test_trade_pay(tradeService);

        // 测试查询当面付2.0交易
        //        main.test_trade_query();

        // 测试当面付2.0退货
        //        main.test_trade_refund();

        // 测试当面付2.0生成支付二维码
        main.test_trade_refund();
    }


    // 测试当面付2.0退款
    public void test_trade_refund() {
		BankRefundRequestBuilder builder = new BankRefundRequestBuilder()
				.setLength("136").setCode(Constants.TRADE_CODE_REFUND)
				.setHisCode(Constants.HIS_CODE).setBankCode("1030")
				.setOutTradeNo("SR17040812345678")
				.setOutTradeDate("20170408")
				.setOutTradeTime("173430")
				.setCardBankCode("1030")
				.setAccount("acconut")
				.setAccountName("AccountName")
				.setAmount("12.00");
		BankTradeServiceImpl.ClientBuilder clientBuilder = new BankTradeServiceImpl.ClientBuilder()
				.setFrontIp("127.0.0.1")
				.setFrontPort(2017);
		
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

}
