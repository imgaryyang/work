package com.lenovohit.hwe.pay.service.impl;

import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.DateUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.hwe.pay.exception.PayException;
import com.lenovohit.hwe.pay.model.CardBin;
import com.lenovohit.hwe.pay.model.Settlement;
import com.lenovohit.hwe.pay.service.PayBaseService;
import com.lenovohit.hwe.pay.support.bankpay.transfer.config.Constants;
import com.lenovohit.hwe.pay.support.bankpay.transfer.model.builder.BankQueryRequestBuilder;
import com.lenovohit.hwe.pay.support.bankpay.transfer.model.builder.BankRefundRequestBuilder;
import com.lenovohit.hwe.pay.support.bankpay.transfer.model.response.BankQueryResponse;
import com.lenovohit.hwe.pay.support.bankpay.transfer.model.response.BankRefundResponse;
import com.lenovohit.hwe.pay.support.bankpay.transfer.model.result.BankQueryResult;
import com.lenovohit.hwe.pay.support.bankpay.transfer.model.result.BankRefundResult;
import com.lenovohit.hwe.pay.support.bankpay.transfer.service.BankTradeService;
import com.lenovohit.hwe.pay.support.bankpay.transfer.service.impl.BankTradeServiceImpl;

@Service("ccgbpayTtransferPayService")
public class CcgbpayTtransferPayServiceImpl implements PayBaseService {
	private static Log log = LogFactory.getLog(CcgbpayTtransferPayServiceImpl.class);
    @Autowired
    private GenericManager<CardBin, String> cardBinManager;
    
	@Override
	public void prePay(Settlement settlement) {}

	@Override
	public void payCallback(Settlement settlement) {}

	@Override
	public void refund(Settlement settlement) {
		BankRefundRequestBuilder builder = new BankRefundRequestBuilder()
				.setLength(Constants.TRADE_REFUND_REQ_SIZE).setCode(Constants.TRADE_CODE_REFUND)
				.setHisCode(Constants.HIS_CODE).setBankCode(settlement.getPayChannelCode())
				.setOutTradeNo(settlement.getSettleNo())
				.setOutTradeDate(DateUtils.date2String(settlement.getCreatedAt(), "yyyyMMdd"))
				.setOutTradeTime(DateUtils.date2String(settlement.getCreatedAt(), "HHmmss"))
				.setCardBankCode(cleanBankConvert(settlement.getPayerAccount())) //settlement.getPayerAcctBank()
				.setAccount(settlement.getPayerAccount())
				.setAccountName(settlement.getPayerName())
				.setAmount(settlement.getAmt().toString());
		BankTradeServiceImpl.ClientBuilder clientBuilder = new BankTradeServiceImpl.ClientBuilder()
				.setCharset(settlement.getPayType().getPayMerchant().getCharset())
				.setFrontIp(settlement.getPayType().getPayMerchant().getFrontIp())
				.setFrontPort(Integer.valueOf(settlement.getPayType().getPayMerchant().getFrontPort()));
		
		BankTradeService bankTradeService = new BankTradeServiceImpl.ClientBuilder().build(clientBuilder);
		BankRefundResult result = bankTradeService.tradeRefund(builder);
		BankRefundResponse response = result.getResponse();
		switch (result.getTradeStatus()) {
			case SUCCESS:
				settlement.setStatus(Settlement.SETTLE_STAT_REFUND_SUCCESS);
				settlement.setTradeNo(response.getTradeNo());
				settlement.setTradeTime(DateUtils.string2Date(response.getTradeDate() + response.getTradeTime(), "yyyyMMddHHmmss"));
				settlement.setTradeRspCode(response.getRespCode());
				settlement.setTradeRspMsg(response.getRespMsg());
				settlement.setRespText(response.getBody());
				log.info("广发退款成功，退款流水号: 【"  + settlement.getSettleNo() + "】");
				break;
			case REFUNDING:
				settlement.setStatus(Settlement.SETTLE_STAT_REFUNDING);
				settlement.setTradeNo(response.getTradeNo());
				settlement.setTradeTime(DateUtils.string2Date(response.getTradeDate() + response.getTradeTime(), "yyyyMMddHHmmss"));
				settlement.setTradeRspCode(response.getRespCode());
				settlement.setTradeRspMsg(response.getRespMsg());
				settlement.setRespText(response.getBody());
				log.info("广发退款处理中，退款流水号: 【"  + settlement.getSettleNo() + "】");
				break;
			case FAILED:
				settlement.setStatus(Settlement.SETTLE_STAT_REFUND_FAILURE);
				settlement.setTradeNo(response.getTradeNo());
				settlement.setTradeTime(DateUtils.string2Date(response.getTradeDate() + response.getTradeTime(), "yyyyMMddHHmmss"));
				settlement.setTradeRspCode(response.getRespCode());
				settlement.setTradeRspMsg(response.getRespMsg());
				settlement.setRespText(response.getBody());
				log.error("广发退款失败!!!");
				break;
			case UNKNOWN:
				settlement.setStatus(Settlement.SETTLE_STAT_EXCEPTIONAL);
				settlement.setRespText(response.getBody());
				log.error("系统异常，广发退款状态未知!!!");
				break;
		}
	}

	@Override
	public void query(Settlement settlement) {
	}

	@Override
	public void refundQuery(Settlement settlement) {

		BankQueryRequestBuilder builder = new BankQueryRequestBuilder()
				.setLength(Constants.TRADE_QUERY_REQ_SIZE).setCode(Constants.TRADE_CODE_QUERY)
				.setHisCode(Constants.HIS_CODE).setBankCode(settlement.getPayChannelCode())
				.setTradeType("02").setOutTradeNo(settlement.getSettleNo())
				.setOutTradeDate(DateUtils.date2String(settlement.getCreatedAt(), "yyyyMMdd"))
				.setOutTradeTime(DateUtils.date2String(settlement.getCreatedAt(), "HHmmss"));
		BankTradeServiceImpl.ClientBuilder clientBuilder = new BankTradeServiceImpl.ClientBuilder()
				.setCharset(settlement.getPayType().getPayMerchant().getCharset())
				.setFrontIp(settlement.getPayType().getPayMerchant().getFrontIp())
				.setFrontPort(Integer.valueOf(settlement.getPayType().getPayMerchant().getFrontPort()));
		
		BankTradeService bankTradeService = new BankTradeServiceImpl.ClientBuilder().build(clientBuilder);
		BankQueryResult result = bankTradeService.tradeQuery(builder);
		BankQueryResponse response = result.getResponse();
		switch (result.getTradeStatus()) {
			case SUCCESS:
				settlement.setStatus(Settlement.SETTLE_STAT_REFUND_SUCCESS);
				settlement.setTradeStatus(Settlement.SETTLE_TRADE_SUCCESS);
				settlement.setTradeNo(response.getTradeNo());
				settlement.setTradeTime(DateUtils.string2Date(response.getTradeDate() + response.getTradeTime(), "yyyyMMddHHmmss"));
				settlement.setTradeRspCode(response.getRespCode());
				settlement.setTradeRspMsg(response.getRespMsg());
				settlement.setRespText(response.getBody());
				log.info("广发退款交易查询成功，医院流水号: 【"  + settlement.getSettleNo() + "】");
				break;
			case REFUNDING:
				break;
			case FAILED:
				settlement.setStatus(Settlement.SETTLE_STAT_REFUND_FAILURE);
				settlement.setTradeStatus(Settlement.SETTLE_TRADE_FAILURE);
				settlement.setTradeNo(response.getTradeNo());
				settlement.setTradeTime(DateUtils.string2Date(response.getTradeDate() + response.getTradeTime(), "yyyyMMddHHmmss"));
				settlement.setTradeRspCode(response.getRespCode());
				settlement.setTradeRspMsg(response.getRespMsg());
				settlement.setRespText(response.getBody());
				log.error("广发卡退款交易查询失败，医院流水号: 【"  + settlement.getSettleNo() + "】");
				break;
			case UNKNOWN:
				settlement.setTradeStatus(Settlement.SETTLE_TRADE_EXCEPTIONAL);
	    		log.error("系统异常，订单支付状态未知!!!");
	    		break;
		}
	
	}
	
	/**
	 * 
	 * @param upCardType
	 * @return
	 */
	private String cleanBankConvert(String cardNo){
		List<?> cardBins = cardBinManager.findBySql("SELECT CARD_BIN, CLEAN_BANK_CODE FROM SSM_CARD_BIN WHERE CARD_BIN = SUBSTR(?, 1, CARD_BIN_NUM) and CARD_NUM =?", cardNo, cardNo.length());
		if(cardBins == null || cardBins.isEmpty()){
			throw new PayException("91001030", "卡号【"+ cardNo +"】无对应清算行！");
		}
		Object[] first = (Object[])cardBins.get(0);
		String cardBin = first[0].toString();
		String bankCode = first[1].toString();
		for(Object _cardBin : cardBins){//取最长的
			Object[] bin_code = (Object[])_cardBin;
			String bin = bin_code[0].toString();
			String code = bin_code[1].toString();
			if(cardBin.length() < bin.length() ){
				cardBin = bin;
				bankCode = code;
			}
		}
		if(StringUtils.isBlank(bankCode) || StringUtils.equals("null", bankCode)){
			throw new PayException("91001030", "卡号【"+ cardNo +"】无对应清算行！");
		}
		log.info(" 查询卡号【"+cardNo+"】卡bin【" +cardBin+ "】行号【 "+ bankCode +"】。");
		return bankCode;
	}
}
