package com.lenovohit.ssm.payment.manager.impl;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.DateUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.ssm.payment.hisModel.CheckDetailHis;
import com.lenovohit.ssm.payment.manager.CmbPayManager;
import com.lenovohit.ssm.payment.manager.HisManager;
import com.lenovohit.ssm.payment.model.CardBin;
import com.lenovohit.ssm.payment.model.CheckDetailBank;
import com.lenovohit.ssm.payment.model.CheckDetailResult;
import com.lenovohit.ssm.payment.model.CheckRecord;
import com.lenovohit.ssm.payment.model.Settlement;
import com.lenovohit.ssm.payment.support.cmbPay.config.Configs;
import com.lenovohit.ssm.payment.support.cmbPay.service.CmbTradeService;
import com.lenovohit.ssm.payment.support.cmbPay.service.impl.CmbTradeServiceImpl;
import com.lenovohit.ssm.payment.support.cmbPay.utils.XmlPacket;

public class CmbPayManagerImpl extends CmbPayManager {
    private static Log                  log = LogFactory.getLog(BankPayManagerImpl.class);
    // 招行银企直联服务
    private static CmbTradeService   tradeService;
    static {
        /** 一定要在创建CmbTradeService之前调用Configs.init()设置默认参数
         *  Configs会读取classpath下的cmbinfo.properties文件配置信息，如果找不到该文件则确认该文件是否在classpath目录
         */
        Configs.init("cmbinfo.properties");

        /** 使用Configs提供的默认参数
         *  CmbTradeService可以使用单例或者为静态成员对象，不需要反复new
         */
        tradeService = new CmbTradeServiceImpl.ClientBuilder().build();
    }
    @Autowired
    private GenericManager<CheckRecord, String> checkRecordManager;
    @Autowired
    private GenericManager<CheckDetailBank, String> checkDetailBankManager;
//    @Autowired
    private HisManager<CheckDetailHis, String> checkDetailHisManager;
    @Autowired
    private GenericManager<CheckDetailResult, String> checkDetailResultManager;
    @Autowired
    private GenericManager<CardBin,String> cardBinManager;
    @Autowired
    private GenericManager<Settlement,String> settlementManager;
	
    @Override
	public void precreate(Settlement settlement) {
		// TODO Auto-generated method stub
    }
    
    @Override
	public void payCallBack(Settlement settlement) {
		// TODO Auto-generated method stub
    }

	@SuppressWarnings({ "rawtypes", "unchecked" })
	@Override
	public void refund(Settlement settlement) {
		
		// 构造支付的请求报文
		XmlPacket request = new XmlPacket("DCPAYMNT", Configs.getLoginName());
		Map mpPodInfo = new Properties();
		mpPodInfo.put("BUSCOD", "N02031");											// 业务类别
		request.putProperty("SDKPAYRQX", mpPodInfo);								//
		
		Map mpPayInfo = new Properties();
		mpPayInfo.put("YURREF", settlement.getSettleNo());							//业务参考号
		mpPayInfo.put("EPTDAT", DateUtils.date2String(settlement.getCreateTime(), "yyyyMMdd"));	//期望日
		mpPayInfo.put("DBTACC", Configs.getPayAccount());							//付方帐号
		mpPayInfo.put("DBTBBK", Configs.getPayAcctCity());							//付方开户地区代码
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
		// TODO Auto-generated method stub
	}

	@SuppressWarnings({ "rawtypes", "unchecked" })
	@Override
	public void refundQuery(Settlement settlement) {
		// 构造支付的请求报文
		XmlPacket request = new XmlPacket("GetPaymentInfo", Configs.getLoginName());
		
		Map mpPayInfo = new Properties();
		mpPayInfo.put("BGNDAT", DateUtils.date2String(settlement.getCreateTime(), "yyyyMMdd"));	//起始日期
		mpPayInfo.put("ENDDAT", DateUtils.date2String(settlement.getCreateTime(), "yyyyMMdd"));	//结束日期
		mpPayInfo.put("DATFLG", "B");															//日期类型
		mpPayInfo.put("YURREF", settlement.getSettleNo());										//业务参考号
		request.putProperty("SDKPAYQYX", mpPayInfo);
		
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
	
	@SuppressWarnings({ "rawtypes", "unchecked" })
	@Override
	public void syncCheckFile(CheckRecord checkRecord) {
		// 构造支付的请求报文
		XmlPacket request = new XmlPacket("GetPaymentInfo", Configs.getLoginName());
		
		Map mpPayInfo = new Properties();
		mpPayInfo.put("BGNDAT", checkRecord.getChkDate().replaceAll("-", ""));	//起始日期
		mpPayInfo.put("ENDDAT", checkRecord.getChkDate().replaceAll("-", ""));	//结束日期
		mpPayInfo.put("DATFLG", "B");											//日期类型
		request.putProperty("SDKPAYQYX", mpPayInfo);

		XmlPacket result = tradeService.tradeQuery(request);
		if(result == null){
			log.error("招行退款【"+ checkRecord.getChkDate() +"】日获取对账文件地址失败!!!");
			return;
		}
		switch (result.getRETCOD()) {
			case "0":
				if( downloadFile(checkRecord, result) ){
					checkRecord.setStatus(CheckRecord.CHK_STAT_FILE_SUCCESS);
				} else {
					checkRecord.setStatus(CheckRecord.CHK_STAT_FILE_FAILURE);
				}
				checkRecord.setSyncTime(DateUtils.getCurrentDate());
				log.info("招行退款【"+ checkRecord.getChkDate() +"】日获取对账文件地址成功!!!)");
				break;
				
			case "-9":
				checkRecord.setStatus(CheckRecord.CHK_STAT_FILE_FAILURE);
				checkRecord.setSyncTime(DateUtils.getCurrentDate());
				log.error("招行退款【"+ checkRecord.getChkDate() +"】日获取对账文件地址系统异常!!!");
				break;
				
			default :
				checkRecord.setStatus(CheckRecord.CHK_STAT_FILE_FAILURE);
				checkRecord.setSyncTime(DateUtils.getCurrentDate());
				log.error("招行退款【"+ checkRecord.getChkDate() +"】日获取对账文件地址失败!!!");
		}
		
		this.checkRecordManager.save(checkRecord);
	}

	@SuppressWarnings("unchecked")
	@Override
	public void importCheckFile(CheckRecord checkRecord) {

		BufferedReader br = null;
		try {
			//0. 清除之前导入记录
			String deleleSql = "DELETE FROM SSM_CHECK_DETAIL_BANK WHERE CHECK_RECORD = ?";
			this.checkDetailBankManager.executeSql(deleleSql, checkRecord.getId());
			
			//1. 导入记录
			File checkFile = new File(checkRecord.getFilePath() + checkRecord.getChkFile());
			if(!checkFile.exists()) {
				throw new BaseException("对账文件【"+ checkRecord.getChkFile() + "】不存在！");
			}
			br = new BufferedReader(new FileReader(checkFile));
			StringBuilder body = new StringBuilder();
			String tempString = null;  
            while ((tempString = br.readLine()) != null) {  
            	body.append(tempString);
            }
            XmlPacket records = XmlPacket.valueOf(body.toString(),"GBK");
            Map<String, String> recordResult = null;
        	int length = records.getSectionSize("NTQPAYQYZ");
        	List<CheckDetailBank> cdbl = new ArrayList<CheckDetailBank>();
			CheckDetailBank cdb = null;
			int record = 0;
            for (int i=0; i<length; i++) { 
            	recordResult = (Map<String, String>)records.getProperty("NTQPAYQYZ", i);
            	cdb = convertRecordToObject(i, recordResult);
            	if(cdb == null) {
            		continue;
            	} else {
            		record++;
            	}
            	cdb.setClearDate(checkRecord.getChkDate().replaceAll("-", ""));
            	cdb.setCheckRecord(checkRecord.getId());
            	cdbl.add(cdb);
                if(cdbl.size() == 100){
                	this.checkDetailBankManager.batchSave(cdbl, 100);
                	cdbl = new ArrayList<CheckDetailBank>();
                }
            }
            this.checkDetailBankManager.batchSave(cdbl);
            log.info("招行退款【"+ checkRecord.getChkDate() +"】日 对账文件导入记录【" + record + "】条。");

            checkRecord.setStatus(CheckRecord.CHK_STAT_IMP_SUCCESS);
		} catch (Exception e) {
			checkRecord.setStatus(CheckRecord.CHK_STAT_IMP_FAILURE);
			log.error("招行退款【"+ checkRecord.getChkDate() +"】日 对账文件导入失败:" + e.getMessage());
			e.printStackTrace();
		}
		
		checkRecordManager.save(checkRecord);
	}
	
	@Override
	public void checkOrder(CheckRecord checkRecord) {
		int total = 0;
		int successTotal = 0;
		BigDecimal totalAmt = new BigDecimal(0);
		BigDecimal successAmt = new BigDecimal(0);
		try {
			//0. 清除之前对账记录
			String deleleSql = "DELETE FROM SSM_CHECK_DETAIL_RESULT WHERE CHECK_RECORD = ?";
			this.checkDetailResultManager.executeSql(deleleSql, checkRecord.getId());
			
			//1. 对账记录
			List<CheckDetailBank> cdbl = checkDetailBankManager.find("from CheckDetailBank where checkRecord = ?", checkRecord.getId());
			List<CheckDetailResult> cdrl = new ArrayList<CheckDetailResult>();
//			List<CheckDetailHis> cdhl = new ArrayList<CheckDetailHis>();
			Settlement settlement = null;
			CheckDetailHis detail = null;
			CheckDetailResult result = null;
			for(CheckDetailBank cdb : cdbl){
				result = new CheckDetailResult();
				result.setCheckRecord(cdb.getCheckRecord());
				result.setMerchanet("");
				result.setTerminal("");
				result.setBatchNo("");
				result.setAmt(cdb.getAmt().abs());
				result.setClearAmt(cdb.getAmt().abs());
				result.setAccount(cdb.getAccount());
				result.setCardType("");
				result.setCardBankCode("");
				result.setTradeNo(cdb.getTradeNo());
				result.setTradeType("HB02".equals(cdb.getTradeType())?Settlement.SETTLE_TYPE_REFUND:Settlement.SETTLE_TYPE_REFUND);
				result.setTradeDate(checkRecord.getChkDate());
				result.setTradeTime("00:00:00");
				result.setClearDate(checkRecord.getChkDate());
				//1.自助机结算单数据
				settlement = settlementManager.findOne("from Settlement where settleNo = ? and settleType = 'SR'", cdb.getOutTradeNo());
				if(null == settlement){
					result.setSsmCheckStatus(CheckDetailResult.SSM_CHECK_STATUS_SSM_NOTRADE);
					result.setSsmCheckTime(DateUtils.getCurrentDate());
					result.setSsmCheckType(checkRecord.getOptType());
				} else {
					result.setSsmNo(settlement.getSettleNo());
					result.setSsmTime(settlement.getCreateTime());
					result.setSsmAmt(settlement.getAmt());
					result.setSsmCode(settlement.getMachineCode());
					result.setSsmCheckTime(DateUtils.getCurrentDate());
					result.setSsmCheckType(checkRecord.getOptType());
					result.setSsmCheckStatus(CheckDetailResult.SSM_CHECK_STATUS_SUCCESS);
					
					if(StringUtils.equals("S", cdb.getTradeStatus())){
						if(!Settlement.SETTLE_STAT_REFUND_SUCCESS.equals(settlement.getStatus()) 
								&& !Settlement.SETTLE_STAT_REFUND_CANCELED.equals(settlement.getStatus())){
							result.setSsmCheckStatus(CheckDetailResult.SSM_CHECK_STATUS_FAILURE);
						}
					} else if(StringUtils.equals("B", cdb.getTradeStatus())){
						if(!Settlement.SETTLE_STAT_REFUND_SUCCESS.equals(settlement.getStatus()) 
								&& !Settlement.SETTLE_STAT_REFUND_CANCELED.equals(settlement.getStatus())){
							result.setSsmCheckStatus(CheckDetailResult.SSM_CHECK_STATUS_FAILURE);
						}
					} else if(StringUtils.equals("F", cdb.getTradeStatus())){
						if(!Settlement.SETTLE_STAT_REFUND_FAILURE.equals(settlement.getStatus())){
							result.setSsmCheckStatus(CheckDetailResult.SSM_CHECK_STATUS_FAILURE);
						}
					} else if(StringUtils.equals("P", cdb.getTradeStatus())){
						if(!Settlement.SETTLE_STAT_REFUNDING.equals(settlement.getStatus())){
							result.setSsmCheckStatus(CheckDetailResult.SSM_CHECK_STATUS_FAILURE);
						}
					}
					
					if(result.getSsmAmt().compareTo(result.getAmt()) == 1){
						result.setSsmCheckStatus(CheckDetailResult.SSM_CHECK_STATUS_MNY_MORE);
					}
					if(result.getSsmAmt().compareTo(result.getAmt()) == -1){
						result.setSsmCheckStatus(CheckDetailResult.SSM_CHECK_STATUS_MNY_LESS);
					}
				}
				//2.HIS银行交易明细数据
				detail = checkDetailHisManager.findOne("from CheckDetailHis where ztbz = '1' and jylx = 'HB02' and jsckh = ? ", cdb.getTradeNo());
				if(null == detail && null != settlement && !settlement.getOrder().getBizNo().contains("F")){
					detail = checkDetailHisManager.findOne("from CheckDetailHis where ycid = ?", Integer.valueOf(settlement.getOrder().getBizNo()));
				}
				if(null == detail){
					result.setHisCheckStatus(CheckDetailResult.HIS_CHECK_STATUS_HIS_NOTRADE);
					result.setHisCheckTime(DateUtils.getCurrentDate());
					result.setHisCheckType(checkRecord.getOptType());
				} else {
					result.setHisNo(String.valueOf(detail.getJlid()));
					result.setHisTime(detail.getJysj());
					result.setHisAmt(detail.getJe().abs());
					result.setHisCheckTime(DateUtils.getCurrentDate());
					result.setHisCheckType(checkRecord.getOptType());
					result.setHisCheckStatus(CheckDetailResult.HIS_CHECK_STATUS_SUCCESS);
					
					if(result.getHisAmt().compareTo(result.getAmt()) == 1){
						result.setHisCheckStatus(CheckDetailResult.HIS_CHECK_STATUS_MNY_MORE);
					}
					if(result.getHisAmt().compareTo(result.getAmt()) == -1){
						result.setHisCheckStatus(CheckDetailResult.HIS_CHECK_STATUS_MNY_LESS);
					}
					
//					detail.setJzrq(checkRecord.getChkDate());
//					cdhl.add(detail);
//					if(cdhl.size() == 100){
//						this.checkDetailHisManager.batchSave(cdhl);
//						cdhl = new ArrayList<CheckDetailHis>();
//					}
				}
				cdrl.add(result);
				if(cdrl.size() == 100){
					this.checkDetailResultManager.batchSave(cdrl);
					cdrl = new ArrayList<CheckDetailResult>();
				}
				total++;
				totalAmt = totalAmt.add(result.getAmt());
				if(StringUtils.equals(result.getHisCheckStatus(), CheckDetailResult.HIS_CHECK_STATUS_SUCCESS)){
					successTotal++;
					successAmt = successAmt.add(result.getAmt());
				}
				log.info("【"+ checkRecord.getPayChannel().getName() + "】【"+ checkRecord.getChkDate() +"】日 对账记录流水号【"+ result.getTradeNo() + "】,金额【"+result.getAmt().toString() + "】,对账状态【"+result.getHisCheckStatus() + "】。");
			}
			log.info("【"+ checkRecord.getPayChannel().getName() + "】【"+ checkRecord.getChkDate() +"】日 对账【"+ total +"】笔,【"+ totalAmt +"】元, 成功：【"+ successTotal +"】笔,【"+ successAmt.toString() +"】元！");
			this.checkDetailResultManager.batchSave(cdrl);
//			this.checkDetailHisManager.batchSave(cdhl);
			
			checkRecord.setStatus(CheckRecord.CHK_STAT_FINISH);
			checkRecord.setTotal(total);
			checkRecord.setAmt(totalAmt);
			checkRecord.setSuccessTotal(successTotal);
			checkRecord.setSuccessAmt(successAmt);
		} catch (Exception e) {
			checkRecord.setStatus(CheckRecord.CHK_STAT_FAILURE);
			log.error("银行【"+ checkRecord.getPayChannel().getName() + "】【"+ checkRecord.getChkDate() +"】日 对账失败：" + e.getMessage());
			e.printStackTrace();
		}
		
		this.checkRecordManager.save(checkRecord);
	}

	@SuppressWarnings({ "rawtypes", "unchecked" })
	@Override
	public void syncReturnFile(CheckRecord checkRecord) {
		// 构造支付的请求报文
		XmlPacket request = new XmlPacket("GetHisNotice", Configs.getLoginName());
		
		Map mpPayInfo = new Properties();
		mpPayInfo.put("BGNDAT", checkRecord.getChkDate().replaceAll("-", ""));	//起始日期
		mpPayInfo.put("ENDDAT", checkRecord.getChkDate().replaceAll("-", ""));	//结束日期
		mpPayInfo.put("MSGTYP", "NCDRTPAY");									//日期类型
		request.putProperty("FBDLRHMGX", mpPayInfo);
	
		XmlPacket result = tradeService.tradeQuery(request);
		switch (result.getRETCOD()) {
			case "0":
				if( downloadFile(checkRecord, result) ){
					checkRecord.setStatus(CheckRecord.CHK_STAT_FILE_SUCCESS);
				} else {
					checkRecord.setStatus(CheckRecord.CHK_STAT_FILE_FAILURE);
				}
				checkRecord.setSyncTime(DateUtils.getCurrentDate());
				log.info("招行退汇【"+ checkRecord.getChkDate() +"】日获取对账文件地址成功!!!)");
				break;
				
			case "-9":
				checkRecord.setStatus(CheckRecord.CHK_STAT_FILE_FAILURE);
				checkRecord.setSyncTime(DateUtils.getCurrentDate());
				log.error("招行退汇【"+ checkRecord.getChkDate() +"】日获取对账文件地址系统异常!!!");
				break;
				
			default :
				checkRecord.setStatus(CheckRecord.CHK_STAT_FILE_FAILURE);
				checkRecord.setSyncTime(DateUtils.getCurrentDate());
				log.error("招行退汇【"+ checkRecord.getChkDate() +"】日获取对账文件地址失败!!!");
		}
		
		this.checkRecordManager.save(checkRecord);
	}

	@SuppressWarnings("unchecked")
	@Override
	public void importReturnFile(CheckRecord checkRecord) {

		BufferedReader br = null;
		try {
			//0. 清除之前导入记录
			String deleleSql = "DELETE FROM SSM_CHECK_DETAIL_BANK WHERE CHECK_RECORD = ?";
			this.checkDetailBankManager.executeSql(deleleSql, checkRecord.getId());
			
			//1. 导入记录
			File checkFile = new File(checkRecord.getFilePath() + checkRecord.getChkFile());
			if(!checkFile.exists()) {
				throw new BaseException("招行退汇【"+ checkRecord.getChkFile() + "】文件不存在！");
			}
			br = new BufferedReader(new FileReader(checkFile));
			StringBuilder body = new StringBuilder();
			String tempString = null;  
            while ((tempString = br.readLine()) != null) {  
            	body.append(tempString);
            }
            XmlPacket records = XmlPacket.valueOf(body.toString(), "GBK");
            Map<String, String> recordResult = null;
        	int length = records.getSectionSize("NCDRTPAYY");
        	List<CheckDetailBank> cdbl = new ArrayList<CheckDetailBank>();
			CheckDetailBank cdb = null;
			int record = 0;
            for (int i=0; i<length; i++) { 
            	recordResult = (Map<String, String>)records.getProperty("NCDRTPAYY", i);
            	cdb = convertRetRecordToObject(i, recordResult);
            	if(cdb == null) {
            		continue;
            	} else {
            		record++;
            	}
            	cdb.setClearDate(checkRecord.getChkDate().replaceAll("-", ""));
            	cdb.setCheckRecord(checkRecord.getId());
            	cdbl.add(cdb);
                if(cdbl.size() == 100){
                	this.checkDetailBankManager.batchSave(cdbl, 100);
                	cdbl = new ArrayList<CheckDetailBank>();
                }
            }
            this.checkDetailBankManager.batchSave(cdbl);
            log.info("招行退汇【"+ checkRecord.getChkDate() +"】日 对账文件导入记录【" + record + "】条。");

            checkRecord.setStatus(CheckRecord.CHK_STAT_IMP_SUCCESS);
		} catch (Exception e) {
			checkRecord.setStatus(CheckRecord.CHK_STAT_IMP_FAILURE);
			log.error("招行退汇【"+ checkRecord.getChkDate() +"】日 对账文件导入失败:" + e.getMessage());
			e.printStackTrace();
		}
		
		checkRecordManager.save(checkRecord);
	}
	@Override
	public void checkReturnOrder(CheckRecord checkRecord) {
		int total = 0;
		int successTotal = 0;
		BigDecimal totalAmt = new BigDecimal(0);
		BigDecimal successAmt = new BigDecimal(0);
		try {
			//0. 清除之前对账记录
			String deleleSql = "DELETE FROM SSM_CHECK_DETAIL_RESULT WHERE CHECK_RECORD = ?";
			this.checkDetailResultManager.executeSql(deleleSql, checkRecord.getId());
			
			//1. 对账记录
			List<CheckDetailBank> cdbl = checkDetailBankManager.find("from CheckDetailBank where checkRecord = ?", checkRecord.getId());
			List<CheckDetailResult> cdrl = new ArrayList<CheckDetailResult>();
			Settlement settlement = null;
			CheckDetailHis detail = null;
			CheckDetailResult result = null;
			for(CheckDetailBank cdb : cdbl){
				result = new CheckDetailResult();
				result.setCheckRecord(cdb.getCheckRecord());
				result.setMerchanet("");
				result.setTerminal("");
				result.setBatchNo("");
				result.setAmt(cdb.getAmt().abs());
				result.setClearAmt(cdb.getAmt().abs());
				result.setAccount(cdb.getAccount());
				result.setCardType("");
				result.setCardBankCode("");
				result.setTradeNo(cdb.getTradeNo());
				result.setTradeType("HB10".equals(cdb.getTradeType())?Settlement.SETTLE_TYPE_CANCEL:Settlement.SETTLE_TYPE_CANCEL);
				result.setTradeDate(checkRecord.getChkDate());
				result.setTradeTime("00:00:00");
				result.setClearDate(checkRecord.getChkDate());
				//1.自助机结算单数据
				settlement = settlementManager.findOne("from Settlement where settleNo = ? and settleType = 'SR'", cdb.getOutTradeNo());
				if(null == settlement){
					result.setSsmCheckStatus(CheckDetailResult.SSM_CHECK_STATUS_SSM_NOTRADE);
					result.setSsmCheckTime(DateUtils.getCurrentDate());
					result.setSsmCheckType(checkRecord.getOptType());
				} else {
					result.setSsmNo(settlement.getSettleNo());
					result.setSsmTime(settlement.getCreateTime());
					result.setSsmAmt(settlement.getAmt());
					result.setSsmCode(settlement.getMachineCode());
					result.setSsmCheckTime(DateUtils.getCurrentDate());
					result.setSsmCheckType(checkRecord.getOptType());
					result.setSsmCheckStatus(CheckDetailResult.SSM_CHECK_STATUS_SUCCESS);
					
					if(!Settlement.SETTLE_STAT_REFUND_CANCELED.equals(settlement.getStatus())){
						result.setSsmCheckStatus(CheckDetailResult.SSM_CHECK_STATUS_FAILURE);
					}
					if(result.getSsmAmt().compareTo(result.getAmt()) == 1){
						result.setSsmCheckStatus(CheckDetailResult.SSM_CHECK_STATUS_MNY_MORE);
					}
					if(result.getSsmAmt().compareTo(result.getAmt()) == -1){
						result.setSsmCheckStatus(CheckDetailResult.SSM_CHECK_STATUS_MNY_LESS);
					}
				}
				//2.HIS银行交易明细数据
				detail = checkDetailHisManager.findOne("from CheckDetailHis where ztbz = '1' and jylx = 'HB02' and jsckh = ? ", cdb.getTradeNo());
				if(null == detail && null != settlement && !settlement.getOrder().getBizNo().contains("F")){
					detail = checkDetailHisManager.findOne("from CheckDetailHis where ycid = ?", Integer.valueOf(settlement.getOrder().getBizNo()));
				}
				if(null == detail){
					result.setHisCheckStatus(CheckDetailResult.HIS_CHECK_STATUS_HIS_NOTRADE);
					result.setHisCheckTime(DateUtils.getCurrentDate());
					result.setHisCheckType(checkRecord.getOptType());
				} else {
					result.setHisNo(String.valueOf(detail.getJlid()));
					result.setHisTime(detail.getJysj());
					result.setHisAmt(detail.getJe().abs());
					result.setHisCheckTime(DateUtils.getCurrentDate());
					result.setHisCheckType(checkRecord.getOptType());
					result.setHisCheckStatus(CheckDetailResult.HIS_CHECK_STATUS_SUCCESS);
					
					if(!"9".equals(detail.getZtbz())){
						result.setHisCheckStatus(CheckDetailResult.SSM_CHECK_STATUS_FAILURE);
					}
					if(result.getHisAmt().compareTo(result.getAmt()) == 1){
						result.setHisCheckStatus(CheckDetailResult.HIS_CHECK_STATUS_MNY_MORE);
					}
					if(result.getHisAmt().compareTo(result.getAmt()) == -1){
						result.setHisCheckStatus(CheckDetailResult.HIS_CHECK_STATUS_MNY_LESS);
					}
					
//					detail.setJzrq(checkRecord.getChkDate());
//					cdhl.add(detail);
//					if(cdhl.size() == 100){
//						this.checkDetailHisManager.batchSave(cdhl);
//						cdhl = new ArrayList<CheckDetailHis>();
//					}
				}
				cdrl.add(result);
				if(cdrl.size() == 100){
					this.checkDetailResultManager.batchSave(cdrl);
					cdrl = new ArrayList<CheckDetailResult>();
				}
				total++;
				totalAmt = totalAmt.add(result.getAmt());
				if(StringUtils.equals(result.getHisCheckStatus(), CheckDetailResult.HIS_CHECK_STATUS_SUCCESS)){
					successTotal++;
					successAmt = successAmt.add(result.getAmt());
				}
				log.info("【"+ checkRecord.getPayChannel().getName() + "】退汇记录流水号【"+ result.getTradeNo() + "】，金额【"+result.getAmt().toString() + "】，退汇对账状态【"+result.getHisCheckStatus() + "】。");
			}
			log.info("【"+ checkRecord.getPayChannel().getName() + "】【"+ checkRecord.getChkDate() +"】日  退汇对账【"+ total +"】笔,【"+ totalAmt +"】元, 成功：【"+ successTotal +"】笔,【"+ successAmt +"】元！");
			this.checkDetailResultManager.batchSave(cdrl);
//			this.checkDetailHisManager.batchSave(cdhl);
			
			checkRecord.setStatus(CheckRecord.CHK_STAT_FINISH);
			checkRecord.setTotal(total);
			checkRecord.setAmt(totalAmt);
			checkRecord.setSuccessTotal(successTotal);
			checkRecord.setSuccessAmt(successAmt);
		} catch (Exception e) {
			checkRecord.setStatus(CheckRecord.CHK_STAT_FAILURE);
			log.error("银行【"+ checkRecord.getPayChannel().getName() + "】【"+ checkRecord.getChkDate() +"】日 退汇对账失败：" + e.getMessage());
			e.printStackTrace();
		}
		
		this.checkRecordManager.save(checkRecord);
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
			//TODO 即使沒對應卡Bin，不影响充值。
			throw new BaseException("卡号【"+ cardNo +"】无对应清算行！");
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
	
	private boolean downloadFile(CheckRecord checkRecord, XmlPacket response) {
		boolean flag = true;
		BufferedWriter bw = null;
		try {
			String checkFile = "";
			if(StringUtils.equals(CheckRecord.CHK_TYPE_REFUND, checkRecord.getChkType())){
				checkFile = checkRecord.getChkDate().replaceAll("-", "") + "tkdz.txt";
			} else if(StringUtils.equals(CheckRecord.CHK_TYPE_RETURN, checkRecord.getChkType())){
				checkFile = checkRecord.getChkDate().replaceAll("-", "") + "thdz.txt";
			}
			File file = new File(checkRecord.getFilePath() + checkFile);
			checkRecord.setChkFile(checkFile);

			// if file doesnt exists, then create it
			if (!file.getParentFile().exists()) {
				file.getParentFile().mkdirs();
			}
			if (!file.exists()) {
				file.createNewFile();
			}
			bw = new BufferedWriter(new FileWriter(file.getAbsoluteFile()));
			bw.write(response.getBody().trim());
			bw.close();
		} catch (Exception e) {
			flag = false;
			log.error("招行【"+ checkRecord.getChkDate() +"】日 同步对账文件失败：" + e.getMessage());
			e.printStackTrace();
		} finally {
			if(bw != null) {
				try {
					bw.close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
		
		return flag;
	}
	private CheckDetailBank convertRecordToObject(int record, Map<String, String> recordMap){
//		REQSTS=’FIN’时再判断RTNFLG，RTNFLG为’S’时表示成功，’B’表示退票，其他作为失败处理；
		CheckDetailBank cdb = new CheckDetailBank();
		if(recordMap == null)
			return null;
		if(!StringUtils.equals(Configs.getLoginName(), recordMap.get("LGNNAM")))
			return null;
		cdb.setOutTradeNo(recordMap.get("YURREF"));
		cdb.setTradeType("HB02");
		cdb.setTradeNo(recordMap.get("REQNBR"));//截取日期后为系统记录流水
		cdb.setTradeDate(recordMap.get("EPTDAT"));
		cdb.setTradeTime(recordMap.get("EPTTIM"));
		cdb.setAccount(recordMap.get("CRTACC"));
		cdb.setAmt(new BigDecimal(recordMap.get("TRSAMT")));
		if(StringUtils.equals("FIN", recordMap.get("REQSTS"))){
			if(StringUtils.equals("S", recordMap.get("RTNFLG")))
				cdb.setTradeStatus("S");
			else if(StringUtils.equals("B", recordMap.get("RTNFLG")))
				cdb.setTradeStatus("B");
			else 
				cdb.setTradeStatus("F");
		} else {
			cdb.setTradeStatus("P");
		}
			
		
		return cdb;
	}
	
	private CheckDetailBank convertRetRecordToObject(int record, Map<String, String> recordMap){
//		REQSTS=’FIN’时再判断RTNFLG，RTNFLG为’S’时表示成功，’B’表示退票，其他作为失败处理；
		CheckDetailBank cdb = new CheckDetailBank();
		if(recordMap == null)
			return null;
		if(!StringUtils.equals("B", recordMap.get("RTNFLG"))){
			return null;
		}
		if(StringUtils.isBlank(recordMap.get("YURREF")) || !recordMap.get("YURREF").startsWith("SR")){
			return null;
		}
		cdb.setOutTradeNo(recordMap.get("YURREF"));
		cdb.setTradeType("HB10");
		cdb.setTradeNo(recordMap.get("REQNBR"));
		cdb.setTradeDate(recordMap.get("EPTDAT"));
		cdb.setTradeTime(recordMap.get("EPTTIM"));
		cdb.setAmt(new BigDecimal(recordMap.get("ENDAMT")));
		cdb.setTradeStatus(recordMap.get("RTNFLG"));
		cdb.setMemo(recordMap.get("RTNDSP"));
		
		return cdb;
	}
}
