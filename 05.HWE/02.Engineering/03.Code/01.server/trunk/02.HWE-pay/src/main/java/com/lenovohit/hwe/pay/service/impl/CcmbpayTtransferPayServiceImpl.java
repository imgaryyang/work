package com.lenovohit.hwe.pay.service.impl;

import java.util.List;
import java.util.Map;
import java.util.Properties;

import org.apache.commons.configuration.Configuration;
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
import com.lenovohit.hwe.pay.support.cmbpay.transfer.service.CmbTradeService;
import com.lenovohit.hwe.pay.support.cmbpay.transfer.service.impl.CmbTradeServiceImpl;
import com.lenovohit.hwe.pay.support.cmbpay.transfer.utils.XmlPacket;
import com.lenovohit.hwe.pay.utils.PayMerchantConfigCache;

@Service("ccmbpayTtransferPayService")
public class CcmbpayTtransferPayServiceImpl implements PayBaseService {
	private static Log log = LogFactory.getLog(CcmbpayTtransferPayServiceImpl.class);
    @Autowired
    private GenericManager<CardBin, String> cardBinManager;
    
	@Override
	public void prePay(Settlement settlement) {}

	@Override
	public void payCallback(Settlement settlement) {}
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	@Override
	public void refund(Settlement settlement) {
		Configuration config = PayMerchantConfigCache.getConfig(settlement.getPayType().getPayMerchant());
		// 构造支付的请求报文
		XmlPacket request = new XmlPacket("DCPAYMNT", config.getString("login_name")/*Configs.getLoginName()*/);
		Map mpPodInfo = new Properties();
		mpPodInfo.put("BUSCOD", "N02031");											// 业务类别
		request.putProperty("SDKPAYRQX", mpPodInfo);								//
		
		Map mpPayInfo = new Properties();
		mpPayInfo.put("YURREF", settlement.getSettleNo());							//业务参考号
		mpPayInfo.put("EPTDAT", DateUtils.date2String(settlement.getCreatedAt(), "yyyyMMdd"));	//期望日
		mpPayInfo.put("DBTACC", config.getString("pay_account")/*Configs.getPayAccount()*/);							//付方帐号
		mpPayInfo.put("DBTBBK", config.getString("pay_acct_city")/*Configs.getPayAcctCity()*/);							//付方开户地区代码
		mpPayInfo.put("TRSAMT", settlement.getAmt().toString());					//交易金额
		mpPayInfo.put("CCYNBR", "10");												//币种代码 10(人民币)
		mpPayInfo.put("STLCHN", "N");												//结算方式代码 N：普通	F：快速
		mpPayInfo.put("NUSAGE", settlement.getSettleTitle());						//用途（62）
		mpPayInfo.put("BUSNAR", settlement.getSettleDesc());						//业务摘要（200）
		mpPayInfo.put("CRTACC", settlement.getPayerAccount());						//收方帐号
		mpPayInfo.put("CRTNAM", settlement.getPayerName());							//收方帐户名
		CardBin cardBin = cardBinConvert(settlement.getPayerAccount());				
		mpPayInfo.put("BRDNBR", cardBin.getCleanBankCode());						//收方行号
		mpPayInfo.put("BNKFLG", "N");		//系统内外标志 Y：招行；N：非招行；TODO本行校验太多，统一走跨行
		mpPayInfo.put("CRTBNK", cardBin.getCleanBankName());						//收方开户行 
		mpPayInfo.put("CTYCOD", cardBin.getCityCode());								//城市代码
		mpPayInfo.put("CRTADR", cardBin.getPrivince() + cardBin.getCity());			//收方行地址
		request.putProperty("DCOPDPAYX", mpPayInfo);
		
		CmbTradeService tradeService = new CmbTradeServiceImpl.ClientBuilder().build(config);
		XmlPacket result = tradeService.tradeRefund(request);
		switch (result.getRETCOD()) {
			case "0":
				Map<String, String> propPayResult = result.getProperty("NTQPAYRQZ", 0);
				if(StringUtils.equals("FIN", propPayResult.get("REQSTS"))){
					if(StringUtils.equals("S", propPayResult.get("RTNFLG"))){
						settlement.setStatus(Settlement.SETTLE_STAT_REFUND_SUCCESS);
						settlement.setTradeNo(propPayResult.get("REQNBR"));
						log.info("【招行退款】交易成功，结算单号为【"+ settlement.getSettleNo() + "】!!!");
					} else if(StringUtils.equals("B", propPayResult.get("RTNFLG"))){
						settlement.setStatus(Settlement.SETTLE_STAT_REFUND_CANCELED);
						settlement.setTradeNo(propPayResult.get("REQNBR"));
						log.info("【招行退款】交易失败，结算单号为【"+ settlement.getSettleNo() + "】!!!");
					} else {
						settlement.setStatus(Settlement.SETTLE_STAT_REFUND_FAILURE);
						settlement.setTradeNo(propPayResult.get("REQNBR"));
						log.info("【招行退款】交易失败，结算单号为【"+ settlement.getSettleNo() + "】!!!");
					}
				} else {
					settlement.setStatus(Settlement.SETTLE_STAT_REFUNDING);
					log.info("【招行退款】交易处理中，结算单号为【"+ settlement.getSettleNo() + "】!!!");
				}
				settlement.setTradeTime(DateUtils.getCurrentDate());
				settlement.setTradeRspCode(result.getRETCOD());
				settlement.setTradeRspMsg(result.getERRMSG());
				settlement.setRespText(result.getBody());
				break;
			case "-1":
			case "-9":
				settlement.setStatus(Settlement.SETTLE_STAT_EXCEPTIONAL);
				settlement.setTradeTime(DateUtils.getCurrentDate());
				settlement.setTradeRspCode(result.getRETCOD());
				settlement.setTradeRspMsg(result.getERRMSG());
				log.error("【招行退款】系统异常，银行退款状态未知，结算单号为【"+ settlement.getSettleNo() + "】!!!");
				break;
			default :
				settlement.setStatus(Settlement.SETTLE_STAT_REFUND_FAILURE);
				settlement.setTradeTime(DateUtils.getCurrentDate());
				settlement.setTradeRspCode(result.getRETCOD());
				settlement.setTradeRspMsg(result.getERRMSG());
				log.error("【招行退款】交易失败，结算单号为【"+ settlement.getSettleNo() + "】!!!");
		}
	}

	@Override
	public void query(Settlement settlement) {
	}

	@SuppressWarnings({ "rawtypes", "unchecked" })
	@Override
	public void refundQuery(Settlement settlement) {
		Configuration config = PayMerchantConfigCache.getConfig(settlement.getPayType().getPayMerchant());
		// 构造支付的请求报文
		XmlPacket request = new XmlPacket("GetPaymentInfo", config.getString("login_name")/*Configs.getLoginName()*/);
		
		Map mpPayInfo = new Properties();
		mpPayInfo.put("BGNDAT", DateUtils.date2String(settlement.getCreatedAt(), "yyyyMMdd"));	//起始日期
		mpPayInfo.put("ENDDAT", DateUtils.date2String(settlement.getCreatedAt(), "yyyyMMdd"));	//结束日期
		mpPayInfo.put("DATFLG", "B");															//日期类型
		mpPayInfo.put("YURREF", settlement.getSettleNo());										//业务参考号
		request.putProperty("SDKPAYQYX", mpPayInfo);
		
		CmbTradeService tradeService = new CmbTradeServiceImpl.ClientBuilder().build(config);
		XmlPacket result = tradeService.tradeQuery(request);
		if(result == null){
			log.error("【招行退款查詢】交易错误，结算单号为【"+ settlement.getSettleNo() + "】!!!");
			return;
		}
		switch (result.getRETCOD()) {
			case "0":
				Map<String, String> propPayResult = result.getProperty("NTQPAYQYZ", 0);
				if(null != propPayResult && StringUtils.equals("FIN", propPayResult.get("REQSTS"))){
					if(StringUtils.equals("S", propPayResult.get("RTNFLG"))){
						settlement.setStatus(Settlement.SETTLE_STAT_REFUND_SUCCESS);
						settlement.setTradeNo(propPayResult.get("REQNBR"));
						log.info("【招行退款查詢】交易成功，结算单号为【"+ settlement.getSettleNo() + "】!!!");
					} else if(StringUtils.equals("B", propPayResult.get("RTNFLG"))){
						settlement.setStatus(Settlement.SETTLE_STAT_REFUND_CANCELED);
						settlement.setTradeNo(propPayResult.get("REQNBR"));
						log.info("【招行退款查詢】交易失败，结算单号为【"+ settlement.getSettleNo() + "】!!!");
					} else {
						settlement.setStatus(Settlement.SETTLE_STAT_REFUND_FAILURE);
						settlement.setTradeNo(propPayResult.get("REQNBR"));
						log.info("【招行退款查詢】交易失败，结算单号为【"+ settlement.getSettleNo() + "】!!!");
					}
				} else if(null != propPayResult && !StringUtils.equals("FIN", propPayResult.get("REQSTS"))){
					settlement.setStatus(Settlement.SETTLE_STAT_REFUNDING);
					log.info("【招行退款查詢】交易处理中，结算单号为【"+ settlement.getSettleNo() + "】!!!");
				} else {
					settlement.setStatus(Settlement.SETTLE_STAT_REFUND_FAILURE);
					log.error("【招行退款查詢】交易失败，结算单号为【"+ settlement.getSettleNo() + "】!!!");
				}
				settlement.setTradeRspCode(result.getRETCOD());
				settlement.setTradeRspMsg(result.getERRMSG());
				settlement.setRespText(result.getBody());
				break;
				
			case "-9":
				log.error("【招行退款查詢】系统异常，结算单号为【"+ settlement.getSettleNo() + "】!!!");
				break;
				
			default :
				log.error("【招行退款查詢】交易错误，结算单号为【"+ settlement.getSettleNo() + "】!!!");
		}
	
	}
	
	/**
	 * 
	 * @param upCardType
	 * @return
	 */
	private CardBin cardBinConvert(String cardNo){
		String hql = "from CardBin cb where cardBin = substring(?,1,cb.cardBinNum) and cardNum =?";
		List<CardBin> cbl = cardBinManager.find(hql, cardNo, cardNo.length());
		if(cbl == null || cbl.isEmpty()){
			throw new PayException("91001030", "卡号【"+ cardNo +"】无对应清算行！");
		}
		CardBin cardBin = cbl.get(0);
		for(CardBin _cardBin : cbl){//取最长的
			if(cardBin.getCardBin().length() < _cardBin.getCardBin().length() ){
				cardBin = _cardBin;
			}
		}
		log.info(" 查询银行【 "+ cardBin.getBankName() +"】卡号【"+cardNo+"】卡bin【" +cardBin.getCardBin()+ "】。");
		return cardBin;
	}
	
}
