package com.lenovohit.ssm.payment.manager.impl;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.lenovohit.core.exception.BaseException;
import com.lenovohit.core.manager.GenericManager;
import com.lenovohit.core.utils.DateUtils;
import com.lenovohit.core.utils.StringUtils;
import com.lenovohit.ssm.base.utils.FtpUtils;
import com.lenovohit.ssm.base.utils.SFTPUtils;
import com.lenovohit.ssm.payment.hisModel.CheckDetailHis;
import com.lenovohit.ssm.payment.manager.BankPayManager;
import com.lenovohit.ssm.payment.manager.HisManager;
import com.lenovohit.ssm.payment.model.CardBin;
import com.lenovohit.ssm.payment.model.CheckDetailBank;
import com.lenovohit.ssm.payment.model.CheckDetailResult;
import com.lenovohit.ssm.payment.model.CheckRecord;
import com.lenovohit.ssm.payment.model.Settlement;
import com.lenovohit.ssm.payment.support.bankPay.config.Constants;
import com.lenovohit.ssm.payment.support.bankPay.model.builder.BankCardQueryRequestBuilder;
import com.lenovohit.ssm.payment.support.bankPay.model.builder.BankDownloadRequestBuilder;
import com.lenovohit.ssm.payment.support.bankPay.model.builder.BankQueryRequestBuilder;
import com.lenovohit.ssm.payment.support.bankPay.model.builder.BankRefundRequestBuilder;
import com.lenovohit.ssm.payment.support.bankPay.model.response.BankCardQueryResponse;
import com.lenovohit.ssm.payment.support.bankPay.model.response.BankDownloadResponse;
import com.lenovohit.ssm.payment.support.bankPay.model.response.BankQueryResponse;
import com.lenovohit.ssm.payment.support.bankPay.model.response.BankRefundResponse;
import com.lenovohit.ssm.payment.support.bankPay.model.result.BankCardQueryResult;
import com.lenovohit.ssm.payment.support.bankPay.model.result.BankDownloadResult;
import com.lenovohit.ssm.payment.support.bankPay.model.result.BankQueryResult;
import com.lenovohit.ssm.payment.support.bankPay.model.result.BankRefundResult;
import com.lenovohit.ssm.payment.support.bankPay.service.BankTradeService;
import com.lenovohit.ssm.payment.support.bankPay.service.impl.BankTradeServiceImpl;

public class BankPayManagerImpl extends BankPayManager {
    private static Log                  log = LogFactory.getLog(BankPayManagerImpl.class);

    @Autowired
    private GenericManager<CheckRecord, String> checkRecordManager;
    @Autowired
    private GenericManager<CheckDetailBank, String> checkDetailBankManager;
    @Autowired
    private HisManager<CheckDetailHis, String> checkDetailHisManager;
    @Autowired
    private GenericManager<CheckDetailResult, String> checkDetailResultManager;
    @Autowired
    private GenericManager<CardBin, String> cardBinManager;
    @Autowired
    private GenericManager<Settlement, String> settlementManager;
	
    @Override
	public void precreate(Settlement settlement) {
    	
    }
    
    @Override
	public void payCallBack(Settlement settlement) {
    	
    }

	@Override
	public void refund(Settlement settlement) {
		if(!validOpenTimeInterval(settlement.getPayChannel().getOpenTimeInterval())){
			settlement.setStatus(Settlement.SETTLE_STAT_REFUND_FAILURE);
            settlement.setTradeStatus(Settlement.SETTLE_TRADE_CLOSED);
            settlement.setTradeTime(DateUtils.getCurrentDate());
            settlement.setTradeRspCode(Constants.NOT_OPENED_TIME);
    		settlement.setTradeRspMsg("非开放时间");
    		log.error("银行退款失败，交易关闭，错误原因非开放时间");
    		return;
		}
		BankRefundRequestBuilder builder = new BankRefundRequestBuilder()
				.setLength(Constants.TRADE_REFUND_REQ_SIZE).setCode(Constants.TRADE_CODE_REFUND)
				.setHisCode(Constants.HIS_CODE).setBankCode(settlement.getPayChannelCode())
				.setOutTradeNo(settlement.getSettleNo())
				.setOutTradeDate(DateUtils.date2String(settlement.getCreateTime(), "yyyyMMdd"))
				.setOutTradeTime(DateUtils.date2String(settlement.getCreateTime(), "HHmmss"))
				.setCardBankCode(cleanBankConvert(settlement.getPayerAccount())) //settlement.getPayerAcctBank()
				.setAccount(settlement.getPayerAccount())
				.setAccountName(settlement.getPayerName())
				.setAmount(settlement.getAmt().toString());
		BankTradeServiceImpl.ClientBuilder clientBuilder = new BankTradeServiceImpl.ClientBuilder()
				.setCharset(settlement.getPayChannel().getCharset())
				.setFrontIp(settlement.getPayChannel().getFrontIp())
				.setFrontPort(Integer.valueOf(settlement.getPayChannel().getFrontPort()));
		
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
				log.info("银行退款成功，退款流水号: 【"  + settlement.getSettleNo() + "】");
				break;
			case REFUNDING:
				settlement.setStatus(Settlement.SETTLE_STAT_REFUNDING);
				settlement.setTradeNo(response.getTradeNo());
				settlement.setTradeTime(DateUtils.string2Date(response.getTradeDate() + response.getTradeTime(), "yyyyMMddHHmmss"));
				settlement.setTradeRspCode(response.getRespCode());
				settlement.setTradeRspMsg(response.getRespMsg());
				settlement.setRespText(response.getBody());
				log.info("银行退款处理中，退款流水号: 【"  + settlement.getSettleNo() + "】");
				break;
			case FAILED:
				settlement.setStatus(Settlement.SETTLE_STAT_REFUND_FAILURE);
				settlement.setTradeNo(response.getTradeNo());
				settlement.setTradeTime(DateUtils.string2Date(response.getTradeDate() + response.getTradeTime(), "yyyyMMddHHmmss"));
				settlement.setTradeRspCode(response.getRespCode());
				settlement.setTradeRspMsg(response.getRespMsg());
				settlement.setRespText(response.getBody());
				log.error("银行退款失败!!!");
				break;
			case UNKNOWN:
				settlement.setStatus(Settlement.SETTLE_STAT_EXCEPTIONAL);
				log.error("系统异常，银行退款状态未知!!!");
				break;
		}
	}

	@Override
	public void query(Settlement settlement) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void refundQuery(Settlement settlement) {
		if(!validOpenTimeInterval(settlement.getPayChannel().getOpenTimeInterval())){
    		log.error("银行退款交易查询失败，交易关闭，错误原因非开放时间");
    		return;
		}
		
		BankQueryRequestBuilder builder = new BankQueryRequestBuilder()
				.setLength(Constants.TRADE_QUERY_REQ_SIZE).setCode(Constants.TRADE_CODE_QUERY)
				.setHisCode(Constants.HIS_CODE).setBankCode(settlement.getPayChannelCode())
				.setTradeType("02").setOutTradeNo(settlement.getSettleNo())
				.setOutTradeDate(DateUtils.date2String(settlement.getCreateTime(), "yyyyMMdd"))
				.setOutTradeTime(DateUtils.date2String(settlement.getCreateTime(), "HHmmss"));
		BankTradeServiceImpl.ClientBuilder clientBuilder = new BankTradeServiceImpl.ClientBuilder()
				.setCharset(settlement.getPayChannel().getCharset())
				.setFrontIp(settlement.getPayChannel().getFrontIp())
				.setFrontPort(Integer.valueOf(settlement.getPayChannel().getFrontPort()));
		
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
				log.info("银行退款交易查询成功，医院流水号: 【"  + settlement.getSettleNo() + "】");
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
				log.error("银行卡退款交易查询失败，医院流水号: 【"  + settlement.getSettleNo() + "】");
				break;
			case UNKNOWN:
				settlement.setTradeStatus(Settlement.SETTLE_TRADE_EXCEPTIONAL);
	    		log.error("系统异常，订单支付状态未知!!!");
	    		break;
		}
	
	}

	@Override
	public void queryCard(Settlement settlement) {
		if(!validOpenTimeInterval(settlement.getPayChannel().getOpenTimeInterval())){
    		log.error("银行卡状态失败，交易关闭，错误原因非开放时间");
    		return;
		}
		BankCardQueryRequestBuilder builder = new BankCardQueryRequestBuilder()
				.setLength(Constants.TRADE_CARD_REQ_SIZE).setCode(Constants.TRADE_CODE_CARD)
				.setHisCode(Constants.HIS_CODE).setBankCode(settlement.getPayChannelCode())
				.setAccount(settlement.getPayerAccount());
		BankTradeServiceImpl.ClientBuilder clientBuilder = new BankTradeServiceImpl.ClientBuilder()
				.setCharset(settlement.getPayChannel().getCharset())
				.setFrontIp(settlement.getPayChannel().getFrontIp())
				.setFrontPort(Integer.valueOf(settlement.getPayChannel().getFrontPort()));
		
		BankTradeService bankTradeService = new BankTradeServiceImpl.ClientBuilder().build(clientBuilder);
		BankCardQueryResult result = bankTradeService.tradeCardQuery(builder);
		BankCardQueryResponse response = result.getResponse();
		switch (result.getTradeStatus()) {
			case SUCCESS:
				settlement.setTradeTime(DateUtils.getCurrentDate());
				settlement.setTradeRspCode(response.getRespCode());
				settlement.setTradeRspMsg(response.getRespMsg());
				log.info("银行卡状态成功，卡号: 【"  + settlement.getPayerAccount() + "】");
				break;
			case REFUNDING:
				break;
			case FAILED:
				settlement.setTradeTime(DateUtils.getCurrentDate());
				settlement.setTradeRspCode(response.getRespCode());
				settlement.setTradeRspMsg(response.getRespMsg());
				log.error("银行卡状态失败，卡号: 【"  + settlement.getPayerAccount() + "】");
				break;
			case UNKNOWN:
				settlement.setTradeTime(DateUtils.getCurrentDate());
				log.error("银行卡状态查询系统异常，卡号: 【"  + settlement.getPayerAccount() + "】");
				break;
		}
	
	}

	@Override
	public void syncCheckFile(CheckRecord checkRecord) {
		if(!validOpenTimeInterval(checkRecord.getPayChannel().getOpenTimeInterval())){
    		log.error("银行【"+ checkRecord.getPayChannel().getName() + "】【"+ checkRecord.getChkDate() +"】日获取对账文件地址失败!!!，错误原因非开放时间");
    		return;
		}
		BankDownloadRequestBuilder builder = new BankDownloadRequestBuilder()
				.setLength(Constants.TRADE_CHECK_REQ_SIZE).setCode(Constants.TRADE_CODE_CHECK)
				.setHisCode(Constants.HIS_CODE).setBankCode(checkRecord.getPayChannel().getCode())
				.setCheckDate(checkRecord.getChkDate().replaceAll("-", ""))
				.setSyncType(checkRecord.getSyncType())
				.setFilePath(checkRecord.getFilePath());
		BankTradeServiceImpl.ClientBuilder clientBuilder = new BankTradeServiceImpl.ClientBuilder()
				.setCharset(checkRecord.getPayChannel().getCharset())
				.setFrontIp(checkRecord.getPayChannel().getFrontIp())
				.setFrontPort(Integer.valueOf(checkRecord.getPayChannel().getFrontPort()));
		
		BankTradeService bankTradeService = new BankTradeServiceImpl.ClientBuilder().build(clientBuilder);
		BankDownloadResult result = bankTradeService.tradeDownloadFile(builder);
		BankDownloadResponse response = result.getResponse();
		switch (result.getTradeStatus()) {
			case SUCCESS:
				checkRecord.setTotal(Integer.valueOf(response.getTotal()));
				checkRecord.setAmt(new BigDecimal(response.getTotalAmt()));
				checkRecord.setChkFile(response.getFileName());
	        	checkRecord.setStatus(CheckRecord.CHK_STAT_FILE_SUCCESS);
				if("sftp".equals(checkRecord.getSyncType()) && !StringUtils.isBlank(checkRecord.getChkFile())){
					if(!downloadFileBySFTP(checkRecord)){
						checkRecord.setStatus(CheckRecord.CHK_STAT_FILE_FAILURE);
					}
				} else if("ftp".equals(checkRecord.getSyncType()) && !StringUtils.isBlank(checkRecord.getChkFile())){
					if(!downloadFileByFTP(checkRecord)){
						checkRecord.setStatus(CheckRecord.CHK_STAT_FILE_FAILURE);
					}
				}
	            log.info("银行【"+ checkRecord.getPayChannel().getName() + "】【"+ checkRecord.getChkDate() +"】日获取对账文件地址成功!!!)");
				break;
			case REFUNDING:
				break;
			case FAILED:
				checkRecord.setStatus(CheckRecord.CHK_STAT_FILE_FAILURE);
				log.error("银行【"+ checkRecord.getPayChannel().getName() + "】【"+ checkRecord.getChkDate() +"】日获取对账文件地址失败!!!)");
				break;
			case UNKNOWN:
				checkRecord.setStatus(CheckRecord.CHK_STAT_FILE_FAILURE);
				log.error("银行【"+ checkRecord.getPayChannel().getName() + "】【"+ checkRecord.getChkDate() +"】日获取对账文件地址系统异常!!!");
				break;
		}
	
	    checkRecordManager.save(checkRecord);
	}

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
				if(StringUtils.equals(checkRecord.getStatus(), CheckRecord.CHK_STAT_FILE_SUCCESS)){
					log.info("银行【"+ checkRecord.getPayChannel().getName() + "】【"+ checkRecord.getChkDate() +"】日 对账文件导入记录【00】条。");
		            checkRecord.setStatus(CheckRecord.CHK_STAT_IMP_SUCCESS);
		            checkRecordManager.save(checkRecord);
		            return;
				} else {
					throw new BaseException("对账文件【"+ checkRecord.getChkFile() + "】不存在！");
				}
			}
			br = new BufferedReader(new FileReader(checkFile));
			List<CheckDetailBank> cdbl = new ArrayList<CheckDetailBank>();
			CheckDetailBank cdb = null;
			String tempString = null;  
			int line = 0;  
			int record = 0;
            while ((tempString = br.readLine()) != null) {  
            	line++;
            	if(line < 3){
            		continue;
            	}
            	cdb = convertRecordToObject(line, tempString);
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
            log.info("银行【"+ checkRecord.getPayChannel().getName() + "】【"+ checkRecord.getChkDate() +"】日 对账文件导入记录【" + record + "】条。");

            checkRecord.setStatus(CheckRecord.CHK_STAT_IMP_SUCCESS);
		} catch (Exception e) {
			checkRecord.setStatus(CheckRecord.CHK_STAT_IMP_FAILURE);
			log.error("银行【"+ checkRecord.getPayChannel().getName() + "】【"+ checkRecord.getChkDate() +"】日 对账文件导入失败:" + e.getMessage());
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
				result.setTradeDate(DateUtils.date2String(DateUtils.string2Date(cdb.getTradeDate(), "yyyyMMdd"), "yyyy-MM-dd"));
				result.setTradeTime(DateUtils.date2String(DateUtils.string2Date(cdb.getTradeDate(), "HHmmss"), "HH:mm:ss"));
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
					
					if(!Settlement.SETTLE_STAT_REFUND_SUCCESS.equals(settlement.getStatus()) 
							&& !Settlement.SETTLE_STAT_REFUND_CANCELED.equals(settlement.getStatus())){
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
				totalAmt = totalAmt.add(cdb.getAmt());
				if(StringUtils.equals(result.getHisCheckStatus(), CheckDetailResult.HIS_CHECK_STATUS_SUCCESS)){
					successTotal++;
					successAmt = successAmt.add(cdb.getAmt());
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

	@Override
	public void syncReturnFile(CheckRecord checkRecord) {
		if(!validOpenTimeInterval(checkRecord.getPayChannel().getOpenTimeInterval())){
			log.error("银行【"+ checkRecord.getPayChannel().getName() + "】【"+ checkRecord.getChkDate() +"】日获取对账文件地址失败!!!，错误原因非开放时间");
			return;
		}
		BankDownloadRequestBuilder builder = new BankDownloadRequestBuilder()
				.setLength(Constants.TRADE_RETURN_REQ_SIZE).setCode(Constants.TRADE_CODE_RETURN)
				.setHisCode(Constants.HIS_CODE).setBankCode(checkRecord.getPayChannel().getCode())
				.setCheckDate(checkRecord.getChkDate().replaceAll("-", ""))
				.setSyncType(checkRecord.getSyncType())
				.setFilePath(checkRecord.getFilePath());
		BankTradeServiceImpl.ClientBuilder clientBuilder = new BankTradeServiceImpl.ClientBuilder()
				.setCharset(checkRecord.getPayChannel().getCharset())
				.setFrontIp(checkRecord.getPayChannel().getFrontIp())
				.setFrontPort(Integer.valueOf(checkRecord.getPayChannel().getFrontPort()));
		
		BankTradeService bankTradeService = new BankTradeServiceImpl.ClientBuilder().build(clientBuilder);
		BankDownloadResult result = bankTradeService.tradeDownloadFile(builder);
		BankDownloadResponse response = result.getResponse();
		switch (result.getTradeStatus()) {
			case SUCCESS:
				checkRecord.setTotal(Integer.valueOf(response.getTotal()));
				checkRecord.setAmt(new BigDecimal(response.getTotalAmt()));
				checkRecord.setChkFile(response.getFileName());
	        	checkRecord.setStatus(CheckRecord.CHK_STAT_FILE_SUCCESS);
	        	if("sftp".equals(checkRecord.getSyncType()) && !StringUtils.isBlank(checkRecord.getChkFile())){
					if(!downloadFileBySFTP(checkRecord)){
						checkRecord.setStatus(CheckRecord.CHK_STAT_FILE_FAILURE);
					}
				} else if("ftp".equals(checkRecord.getSyncType()) && !StringUtils.isBlank(checkRecord.getChkFile())){
					if(!downloadFileByFTP(checkRecord)){
						checkRecord.setStatus(CheckRecord.CHK_STAT_FILE_FAILURE);
					}
				}
	            log.info("银行【"+ checkRecord.getPayChannel().getName() + "】【"+ checkRecord.getChkDate() +"】日获取对账文件地址成功!!!)");
				break;
			case REFUNDING:
				break;
			case FAILED:
				checkRecord.setStatus(CheckRecord.CHK_STAT_FILE_FAILURE);
				log.error("银行【"+ checkRecord.getPayChannel().getName() + "】【"+ checkRecord.getChkDate() +"】日获取对账文件地址失败!!!)");
				break;
			case UNKNOWN:
				checkRecord.setStatus(CheckRecord.CHK_STAT_FILE_FAILURE);
				log.error("银行【"+ checkRecord.getPayChannel().getName() + "】【"+ checkRecord.getChkDate() +"】日获取对账文件地址系统异常!!!");
				break;
		}
	
	    checkRecordManager.save(checkRecord);
	}

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
				if(StringUtils.equals(checkRecord.getStatus(), CheckRecord.CHK_STAT_FILE_SUCCESS)){
					log.info("银行【"+ checkRecord.getPayChannel().getName() + "】【"+ checkRecord.getChkDate() +"】日 退汇文件导入记录【00】条。");
		            checkRecord.setStatus(CheckRecord.CHK_STAT_IMP_SUCCESS);
		            checkRecordManager.save(checkRecord);
		            return;
				} else {
					throw new BaseException("退汇文件【"+ checkRecord.getChkFile() + "】不存在！");
				}
			}
			br = new BufferedReader(new FileReader(checkFile));
			List<CheckDetailBank> cdbl = new ArrayList<CheckDetailBank>();
			CheckDetailBank cdb = null;
			String tempString = null;  
			int line = 0;  
			int record = 0;
            while ((tempString = br.readLine()) != null) {  
            	line++;
            	if(line < 3){
            		continue;
            	}
            	cdb = convertRetRecordToObject(line, tempString);
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
            log.info("银行【"+ checkRecord.getPayChannel().getName() + "】【"+ checkRecord.getChkDate() +"】日 退汇文件导入记录【" + record + "】条。");

            checkRecord.setStatus(CheckRecord.CHK_STAT_IMP_SUCCESS);
		} catch (Exception e) {
			checkRecord.setStatus(CheckRecord.CHK_STAT_IMP_FAILURE);
			log.error("银行【"+ checkRecord.getPayChannel().getName() + "】【"+ checkRecord.getChkDate() +"】日  退汇文件导入失败:" + e.getMessage());
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
				result.setTradeDate(DateUtils.date2String(DateUtils.string2Date(cdb.getTradeDate(), "yyyyMMdd"), "yyyy-MM-dd"));
				result.setTradeTime(DateUtils.date2String(DateUtils.string2Date(cdb.getTradeDate(), "HHmmss"), "HH:mm:ss"));
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
				log.info("【"+ checkRecord.getPayChannel().getName() + "】退汇记录流水号【"+ result.getTradeNo() + "】,金额【"+result.getAmt().toString() + "】,退汇对账状态【"+result.getHisCheckStatus() + "】。");
			}
			log.info("【"+ checkRecord.getPayChannel().getName() + "】【"+ checkRecord.getChkDate() +"】日  退汇对账【"+ total +"】笔,【"+ totalAmt +"】元,成功：【"+ successTotal +"】笔,【"+ successAmt +"】元！");
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

	private CheckDetailBank convertRecordToObject(int line, String record){
//		SR17061600003334|201706160052209914|HB02|6212262502018152861|14.00
		CheckDetailBank cdb = new CheckDetailBank();
		if(StringUtils.isBlank(record))
			return null;
		String[] params = record.split("\\|");
		if(params.length != 5){
			log.info("银行导入 对账文件记录第【" + line + "】条数据错误。");
			log.info(record);
			return null;
		}
		cdb.setOutTradeNo(params[0]);
		cdb.setTradeType(params[2]);
		cdb.setTradeNo(params[1].substring(8));//截取日期后为系统记录流水
		cdb.setTradeDate(params[1].substring(0,8));
		cdb.setTradeTime("000000");
		cdb.setTradeStatus("S");//默认返回成功数据
		cdb.setAccount(params[3]);
		cdb.setAmt(new BigDecimal(params[4]));
		
		return cdb;
	}
	
	private CheckDetailBank convertRetRecordToObject(int line, String record){
//		SR17061600003334|201706160052209914|HB10|6212262502018152861|14.00
		CheckDetailBank cdb = new CheckDetailBank();
		if(StringUtils.isBlank(record))
			return null;
		String[] params = record.split("\\|");
		if(params.length != 5){
			log.info("银行导入 退汇文件记录第【" + line + "】条数据错误。");
			log.info(record);
			return null;
		}
		cdb.setOutTradeNo(params[0]);
		cdb.setTradeType(params[2]);
		cdb.setTradeNo(params[1].substring(8));//截取日期后为系统记录流水
		cdb.setTradeDate(params[1].substring(0,8));
		cdb.setTradeTime("000000");
		cdb.setTradeStatus("B");//默认返回成功数据
		cdb.setAccount(params[3]);
		cdb.setAmt(new BigDecimal(params[4]));
		
		return cdb;
	}
	
	private boolean downloadFileBySFTP(CheckRecord checkRecord) {
		boolean flag = true;
		SFTPUtils sftp = null;
		try {
			String checkString = "";
			if(StringUtils.equals(checkRecord.getChkType(), CheckRecord.CHK_TYPE_PAY)){
				checkString = checkRecord.getPayChannel().getCheckUrl();
			} else if(StringUtils.equals(checkRecord.getChkType(), CheckRecord.CHK_TYPE_REFUND)){
				checkString = checkRecord.getPayChannel().getRefCheckUrl();
			} else if(StringUtils.equals(checkRecord.getChkType(), CheckRecord.CHK_TYPE_RETURN)){
				checkString = checkRecord.getPayChannel().getRetCheckUrl();
			}
			String[] checkConfig = checkString.split(":");
			sftp = new SFTPUtils(checkConfig[3], checkConfig[4], checkConfig[1], Integer.valueOf(checkConfig[2]));
			sftp.login();
			sftp.download(checkConfig[5], checkRecord.getChkFile(), checkRecord.getFilePath() + checkRecord.getChkFile());
		} catch (Exception e) {
			flag = false;
			log.error("银行【"+ checkRecord.getPayChannel().getName() + "】【"+ checkRecord.getChkDate() +"】日同步文件【"+ checkRecord.getChkFile() + "】失败：" + e.getMessage());
			e.printStackTrace();
		} finally {
			if(sftp != null) {
				sftp.logout();
			}
		}
		
		return flag;
	}
	private boolean downloadFileByFTP(CheckRecord checkRecord) {
		boolean flag = true;
		FtpUtils ftp = null;
		try {
			String checkString = "";
			if(StringUtils.equals(checkRecord.getChkType(), CheckRecord.CHK_TYPE_PAY)){
				checkString = checkRecord.getPayChannel().getCheckUrl();
			} else if(StringUtils.equals(checkRecord.getChkType(), CheckRecord.CHK_TYPE_REFUND)){
				checkString = checkRecord.getPayChannel().getRefCheckUrl();
			} else if(StringUtils.equals(checkRecord.getChkType(), CheckRecord.CHK_TYPE_RETURN)){
				checkString = checkRecord.getPayChannel().getRetCheckUrl();
			}
			String[] checkConfig = checkString.split(":");
			ftp = new FtpUtils(checkConfig[1], Integer.valueOf(checkConfig[2]), checkConfig[3], checkConfig[4]);
			if(!ftp.connectServer()) {//TODO 当前需要连接两次,第一次连接被重置.
				ftp.connectServer();
			}
			if( ftp.downloadFile(checkConfig[5], checkRecord.getChkFile(), checkRecord.getFilePath() + checkRecord.getChkFile()) == 0 ){
				flag = false;
				log.info("银行【"+ checkRecord.getPayChannel().getName() + "】【"+ checkRecord.getChkDate() +"】日同步文件【"+ checkRecord.getChkFile() + "】失败！");
			}
		} catch (Exception e) {
			flag = false;
			log.error("银行【"+ checkRecord.getPayChannel().getName() + "】【"+ checkRecord.getChkDate() +"】日同步文件【"+ checkRecord.getChkFile() + "】失败：" + e.getMessage());
			e.printStackTrace();
		} finally {
			if(ftp != null) {
				ftp.closeServer();
			}
		}
		
		return flag;
	}
	/**
	 * 
	 * @param upCardType
	 * @return
	 */
	private String cleanBankConvert(String cardNo){
		List<?> cardBins = cardBinManager.findBySql("SELECT CARD_BIN, CLEAN_BANK_CODE FROM SSM_CARD_BIN WHERE CARD_BIN = SUBSTR(?, 1, CARD_BIN_NUM) and CARD_NUM =?", cardNo, cardNo.length());
		if(cardBins == null || cardBins.isEmpty()){
			//TODO 即使沒對應卡Bin，不影响充值。
			throw new BaseException("卡号【"+ cardNo +"】无对应清算行！");
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
			throw new BaseException("卡号【"+ cardNo +"】无对应清算行！");
		}
		log.info(" 查询卡号【"+cardNo+"】卡bin【" +cardBin+ "】行号【 "+ bankCode +"】。");
		return bankCode;
	}
	
	/**
	 * 校验当前时间是否在开放时间区间内
	 * <p>Title: validOpenTimeInterval</p> 
	 * <p>Description: </p>
	 * @param interval 格式 startTime|endTime，如:08:00:00|23:00:00
	 * @return
	 */
	private boolean validOpenTimeInterval(String interval) {
		boolean result = true;
		if(StringUtils.isBlank(interval)){
			return result;
		}
		try {
			String[] openTimeString = interval.split("\\|");
			String startOpenTime = openTimeString[0];
			String endOpenTime = openTimeString[1];
			Date cuurentTime = new Date();
			String currentDateStr = DateUtils.date2String(cuurentTime, "yyyy-MM-dd");
			if(cuurentTime.before(DateUtils.string2Date(currentDateStr +" "+startOpenTime, "yyyy-MM-dd HH:mm:ss")) 
					|| cuurentTime.after(DateUtils.string2Date(currentDateStr +" "+endOpenTime, "yyyy-MM-dd HH:mm:ss"))){
				result = false;
			} 
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return result;
	}
}
