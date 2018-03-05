package com.lenovohit.hwe.pay.service.impl;

import java.math.BigDecimal;
import java.util.List;

import org.apache.commons.configuration.Configuration;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.DateUtils;
import com.lenovohit.hwe.pay.model.CardBin;
import com.lenovohit.hwe.pay.model.Settlement;
import com.lenovohit.hwe.pay.service.PayBaseService;
import com.lenovohit.hwe.pay.support.unionpay.pos.model.PosPayResponse;
import com.lenovohit.hwe.pay.utils.PayMerchantConfigCache;

@Service("cunionTposPayService")
public class CunionpayTposPayServiceImpl implements PayBaseService {
	private static String PAY_SUCCESS_RET = "success";
    private static Log log = LogFactory.getLog(CunionpayTposPayServiceImpl.class);
   
    @Autowired
    private GenericManager<CardBin,String> cardBinManager;
    
    @Override
	public void prePay(Settlement settlement) {
    	Configuration config = PayMerchantConfigCache.getConfig(settlement.getPayType().getPayMerchant());
    	settlement.getVariables().put("_config", config);
    }
    @Override
	public void payCallback(Settlement settlement) {
    	try {
    		settlement.setRespText((String)settlement.getVariables().get("responseStr"));
    		settlement.getVariables().put("_resultStr", PAY_SUCCESS_RET);
    		PosPayResponse unionPay = new PosPayResponse(settlement.getRespText());
    		if("00".equals(unionPay.getRespCode())){//支付成功
    			//基础信息
        		settlement.setPayerAccount(unionPay.getCardNo());//	付款人账户 	交易卡号
        		settlement.setPayerAcctType(unionPay.getCardType());//	付款人账户 	卡类型
        		settlement.setPayerAcctBank(bankCodeConvert(unionPay.getCardNo()));
        		//交易信息
        		settlement.setTradeTerminalCode(unionPay.getTid());//交易终端号
        		settlement.setTradeNo(unionPay.getRef());//交易流水 ---支付渠道流水
    			settlement.setTradeTime(DateUtils.string2Date(DateUtils.getCurrentYear() + unionPay.getTransDate() + unionPay.getTransTime(), "yyyyMMddHHmmss"));// 交易时间 
        		settlement.setTradeRspCode(unionPay.getRespCode());//交易返回码
        		settlement.setTradeRspMsg(unionPay.getRespInfo());//交易返回说明
    			settlement.setTradeStatus(Settlement.SETTLE_TRADE_SUCCESS);
    			settlement.setStatus(Settlement.SETTLE_STAT_PAY_SUCCESS);
    			BigDecimal unAmt = new BigDecimal(unionPay.getAmount());
    			BigDecimal amt =  unAmt.divide(new BigDecimal(100));//银联支付以分为单位
    			settlement.setRealAmt(amt);//实际支付完成的金额
    		} else {
    			//交易信息
    			settlement.setTradeTerminalCode(unionPay.getTid());//交易终端号
        		settlement.setTradeNo(unionPay.getRef());//交易流水 ---支付渠道流水
    			settlement.setTradeTime(DateUtils.getCurrentDate());// 交易时间 
        		settlement.setTradeRspCode(unionPay.getRespCode());//交易返回码
        		settlement.setTradeRspMsg(unionPay.getRespInfo());//交易返回说明
    			settlement.setTradeStatus(Settlement.SETTLE_TRADE_FAILURE);
    			settlement.setStatus(Settlement.SETTLE_STAT_PAY_FAILURE);
    		}
		} catch (Exception e) {
			e.printStackTrace();
			settlement.setStatus(Settlement.SETTLE_STAT_EXCEPTIONAL);
			log.error("银联支付报文处理:" + e.getMessage());
		}
    }
    
    @Override
	public void refund(Settlement settlement) {}

	@Override
	public void query(Settlement settlement) {}

	@Override
	public void refundQuery(Settlement settlement) {}

	/**
	 * 
	 * @param upCardType
	 * @return
	 */
	private String bankCodeConvert(String cardNo) {
		List<?> cardBins = cardBinManager.findBySql(
				"SELECT CARD_BIN, BANK_CODE FROM PAY_CARD_BIN WHERE CARD_BIN = SUBSTR(?,1, CARD_BIN_NUM) AND CARD_NUM = ?",
				cardNo, cardNo.length());
		if (cardBins == null || cardBins.isEmpty()) {
			// TODO 即使沒對應卡Bin，不影响充值。
			// throw new BaseException("卡号"+cardNo+"无对应cardbin");
			return "00000000";
		}
		Object[] first = (Object[]) cardBins.get(0);
		String cardBin = first[0].toString();
		String bankCode = first[1].toString();
		for (Object _cardBin : cardBins) {// 取最长的
			Object[] bin_code = (Object[]) _cardBin;
			String bin = bin_code[0].toString();
			String code = bin_code[1].toString();
			if (cardBin.length() < bin.length()) {
				cardBin = bin;
				bankCode = code;
			}
		}
		log.info(" 查询卡号" + cardNo + ", 卡bin  " + cardBin + " 行号 " + bankCode);
		return bankCode;
	}
	
}
